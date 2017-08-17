---
layout: post
title: "解析 Webpack Bundle 的運作原理"
date: 2017-08-16 20:48:46 +0800
tags:
  - JavaScript
categories:
---

# 解析 Webpack Bundle 的運作原理

Webpack 做為管理模組化 JavaScript 的工具，最後會將所有的模組編譯為一隻 JavaScript 檔案（bundle），讓所有模組可以在瀏覽器上執行。

拆解 Bundle 檔能夠更暸解 Webpack 的運作，它如何兼容既有的模組系統，以及支援前端優化與開發體驗的需求。

> 多看原始碼，沒有黑魔法 🎩

<!--more-->

**大綱：**

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [基本 Webpack 設定](#基本-webpack-設定)
- [Bundle 結構](#bundle-結構)
- [\_\_webpack_require\_\_](#webpackrequire)
- [CommonJS 模組](#commonjs-模組)
- [ES2015 模組](#es2015-模組)
- [動態載入模組 `import(...)`](#動態載入模組-import)
- [Hot Module Reload (HMR)](#hot-module-reload-hmr)

<!-- /TOC -->

## 基本 Webpack 設定

從最基本的 Webpack 設定，產出一個乾淨的 bundle 檔，是研究 bundle 檔很好的開始。

一個基本的 Webpack 設定，只需要包含 Entry（模組進入點） 以及 Output（bundle 檔產出位置） 兩個選項。

<small>**檔案結構:**</small>
```sh
├─ (bundle.js)            # 即將產出的 bundle 檔
├─ index.js               # entry 模組進入點
└─ webpack.config.js      # webpack 設定檔
```

<small>**webpack.config.js:**</small>
```js
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'bundle.js',
    path: __dirname
  }
}
```

## Bundle 結構

webpack 執行剛剛的設定會產生如下的 bundle 檔

```js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// This is a blank entry

/***/ })
/******/ ]);
```

外層是一個 IIFE，將 bundle 獨立執行，內部整個 bundle 的結構可以分成兩個部分（1）載入相關的幫助函式（2）編譯後的模組程式碼

```js
(function(modules) {
  // 1. 載入相關的幫助函式
})(
  // 2. 編譯後的模組程式碼
  [
    (function(module, exports) {}),
  ]
);
```

**載入相關的幫助函式**

webpack 在瀏覽器可以有不同的載入方式:

  - [同步載入模組](https://webpack.js.org/api/module-methods/#import)
  - [動態載入模組 (Dynamic import)](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
  - [熱加載 (Hot module replacement)](https://webpack.js.org/guides/hot-module-replacement/)

最簡單的載入方式就是同步載入，核心只有一個 `__webpack_require__` 函式，負責記錄載入的模組以及執行模組。

依據載入的方式不同，這部分會增加不同的程式碼，像是「動態載入模組」就增加非同步載入 script 相關的程式碼。

**編譯後的模組程式碼**

從進入點下的所有依賴模組，還有依賴模組的依賴模組（還有依賴模組的依賴的依賴...），都會被放在這部分，用一個陣列將所有相關的模組儲存起來。

模組的程式碼經過編譯也會有所改變，跟[模組相關的方法或語法](https://webpack.js.org/api/module-methods)（例：`import`、`export` 與 `require()`）會被替換。

例如 `import xxx from '../modules/xxx'` 被替換成 `__WEBPACK_IMPORTED_MODULE_0__modules_xxx__ = __webpack_require__(1);`。

`__webpack_require__(1)` 的數字 1 就是 xxx 模組在陣列中的位置，下面會再詳細說明。

## \_\_webpack_require\_\_

在幫助函式中的 `__webpack_require__`，是負責執行模組的程式碼，然後取得模組的匯出資訊。

```js
var installedModules = {};
function __webpack_require__(moduleId) {
	// 1. 快取
	if(installedModules[moduleId]) {
		return installedModules[moduleId].exports;
	}
	// 2. 創建紀錄模組資訊的物件
	var module = installedModules[moduleId] = {
		i: moduleId,
		l: false,
		exports: {}
	};

	// 3. 執行模組
	modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	module.l = true;

  // 4. 回傳載入的結果
	return module.exports;
}
```

`__webpack_require__` 接收參數 `moduleId`，`moduleId` 模組的編號。

**1. 快取**

```js
if(installedModules[moduleId]) {
  return installedModules[moduleId].exports;
}
```

模組只應該被執行一次，`installedModules` 會儲存已經載入過的模組，如果 installedModules 已經存在就直接提供匯出資訊。

**2. 創建紀錄模組資訊的物件**

```js
var module = installedModules[moduleId] = {
  i: moduleId, // index: 模組的編號
  l: false, // loaded: 是否被執行
  exports: {} // 匯出物件
};
```

這邊會將模組的資訊包成物件，並塞入快取中，物件中最重要的是 `exports` 的值，`exports` 會是 `__webpack_require__` 的回傳值，當載入的是 CommonJS 模組中，最終會完全等於 `module.exports` 的值。

**3. 執行模組**

```js
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__); // 執行模組
module.l = true; // 紀錄模組已經執行過

return module.exports // 回傳 exports 的內容
```

第一行用 .call 來執行傳進來的模組，讓放置模組的函式會依序接收到 `module`, `module.exports` 與 `__webpack_require__` 參數。

`module` 與 `module.exports` 在模組執行的過程會被賦
予該模組匯出得值，之後會由 return 回傳 `module.exports` 讓匯入該模組的模組可以使用。

## CommonJS 模組

## ES2015 模組

## 動態載入模組 `import(...)`

## Hot Module Reload (HMR)
