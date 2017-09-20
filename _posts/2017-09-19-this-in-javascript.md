---
layout: post
title: "JavaScript 中的 this"
date: 2017-09-19 15:11:32 +0800
tags:
  - JavaScript
---

整理 JavaScript 中 this 在不同情況的值，大部分參考自超棒的 [MDN 解釋 this 的文章]

<!--more-->

**大綱：**

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:1 -->

1. [全域環境](#全域環境)
2. [函式環境](#函式環境)
	1. [嚴格模式](#嚴格模式)
3. [物件中的方法](#物件中的方法)
	1. [巢狀](#巢狀)
	2. [模組封裝](#模組封裝)
4. [getter 與 setter 中](#getter-與-setter-中)
5. [建構子中](#建構子中)
	1. [建構子回傳物件](#建構子回傳物件)
6. [箭頭函式中](#箭頭函式中)
7. [DOM 事件 callback 中](#dom-事件-callback-中)
8. [使用 bind 覆寫 this](#使用-bind-覆寫-this)
	1. [例外: 綁定箭頭函式無效](#例外-綁定箭頭函式無效)
	2. [例外: 綁定建構子無效](#例外-綁定建構子無效)
9. [使用 call 與 apply 覆寫 this](#使用-call-與-apply-覆寫-this)
10. [結論](#結論)
11. [參考](#參考)

<!-- /TOC -->

## 全域環境

在全域環境下（不在 function 內），`this` 等於 `window`

```js
console.log(this) // => Window {}
console.log(this === window) // => true

window.foo = 'bar'
console.log(this.foo) // => 'bar'
```

## 函式環境

直接呼叫 function 時，`this` 為 `window` 物件

> `this` 代表 `function` 的呼叫者（caller），在物件中函式能夠看到除了 `window` 以外的例子

```js
function foo () {
  return this
}

foo() ===  window // true

// 等同於
window.foo() === window // true
```

### 嚴格模式

嚴格模式下 `function` 內的 `this` 為 `undefined`

**example 1:**
```js
'use strict'
function foo () {
  return this
}

foo() === undefined // true
```

**example 2:**
```js
function foo () {
  'use strict'
  return this
}

foo() === undefined // true
```

但如果使用 `window.` 來呼叫函式，則 `this` 為 `window`

```js
function foo () {
  'use strict'
  return this
}

window.foo() === window // true
```

## 物件中的方法

當呼叫函式時，`this` 會被指到呼叫方法的物件，例如: `obj.f()` 則 `f` 內部的 `this` 會指到 `obj`。

```js
var people = {
  name: 'Otis Chou',
  sayName: function () {
    console.log('This is ' + this.name)
  }
}

people.sayName() // This is Otis Chou
```

### 巢狀

就算是巢狀的物件也不影響結果，`this` 一定會連結到他的呼叫者。

```js
var obj = {
  a: {
    b: {
      f: function () {
        return this
      }
    }
  }
}

console.log(obj.a.b.f() === obj.a.b) // true
```

### 模組封裝

這個特性用在輕量的模組封裝時很方便，可以像這樣做，切分「初始化」與「綁定事件」的行為。

```js
var module = {
  // 初始化
  init: function (el) {
    this.el = el
    this.bindEvents()
  },
  // 綁定事件
  bindEvents: function () {
    this.el.addEventListener('click', this.yell.bind(this))
  },
  // 其他內部方法
  yell: function () {
    alert('Woooooo！')
  }
}

module.init(document.querySelector('#target'))
```

## getter 與 setter 中

物件中 getter 或 setter 方法的 `this` 同樣是指到「呼叫者」

**example 1 - literally getter and setter:**

```js
var people = {
  lastname: '漩渦',
  firstname: '鳴人',
  get fullname () {
    return this.lastname + this.firstname
  },
  set fullname (fullname) {
    this.lastname = fullname.slice(0, 2)
    this.firstname = fullname.slice(2)
  }
}

console.log(people.fullname) // 漩渦鳴人

people.fullname = '一鳴驚人'
console.log(people.lastname) // '一鳴'
console.log(people.firstname) // '驚人'
```

**example 2 - definedProperty:**

用 `definedProperty` 定義 `getter` 與 `setter` 也能取得一樣的結果

```js
var people = { lastname: '漩渦', firstname: '鳴人' }

Object.defineProperty(people, 'fullname', {
  get: function () {
    return this.lastname + this.firstname
  },
  set: function (fullname) {
    this.lastname = fullname.slice(0, 2)
    this.firstname = fullname.slice(2)
  }
})

console.log(people.fullname) // 漩渦鳴人

people.fullname = '一鳴驚人'
console.log(people.lastname) // '一鳴'
console.log(people.firstname) // '驚人'
```

## 建構子中

當用 `new` 呼叫建構子函式時，建構子會建立一個新的物件，並將這個物件的 `[[prototype]]` 連結到 `People.prototype`，然後當作執行的結果回傳。

在建構子中的 `this` 就代表這個新建立的物件。

```js
function People (name) {
  this.name = name
}
People.prototype.sayName = function () {
  console.log('This is ' + this.name)
}

var annie = new People('Annie')
console.log(annie.name) // Annie
annie.sayName() // This is Annie
```

### 建構子回傳物件

建構子函式如果回傳物件，使用 new 呼叫建構子的結果就會指到該物件。

而建構子中的 `this` 雖然也同樣連到「建構子創建出來的物件」，但因為沒有任何方法可以存取建構子中的 `this`，所以 `this` 也失去意義。

```js
var returnedObj = { foo: 'bar' }
function ConstructorWithReturnedObject () {
  this.a = 'aaaa'

  // 回傳物件
  return returnedObj
}

ConstructorWithReturnedObject.prototype.method = function () {}

var instance = new ConstructorWithReturnedObject()
console.log(instance === returnedObject) // true

console.log(instance.a) // undefined
console.log(instance.foo) // 'bar'
console.log(instance.method()) // throw TypeError: instance.method is not a function
```

## 箭頭函式中

ES2015 引入箭頭函式（`=>`）語法，箭頭函式中的 `this` 不是指向該函式的呼叫者，而是函式定義時所處位置 `this` 的值。

**example - excution in global context**

```js
var globalThis = this
var arrowFunction = () => { return this }

console.log(globalThis); // window
console.log(globalThis === arrowFunction()) // true
```

`globalThis` 就是 `arrowFunctino` 定義時所處位置的 `this` 的值。

**example - excution in context of another function**

```js
var obj = {
  a: function () {
    console.log('a:', this === obj); // true

    return () => {
      console.log('() => {} in a:', this === obj) // true
      console.log(this.b) // foo
    }
  },
  b: 'foo'
}

obj.a()()
// a: true
// () => {} in a: true
// foo
```

`obj.a` 函式中的 `this`，等同於，`obj.a` 中箭頭函式的 `this` 的值

## DOM 事件 callback 中

在 DOM 的事件的 callback 中，`this` 等同於觸發事件的 DOM 元素本身

```js
var button = document.querySelector('#button')
button.addEventListener('click', function (event) {
  console.log(button === event.currentTarget) // true
  console.log(event.currentTarget === this) // true
})
```

儘管將 callback 定義在其他地方，結果還是會將 `this` 連結到元素上

```js
var obj = {
  foo: {
    bar: function (event) {
      console.log('button === event.currentTarget =>', button === event.currentTarget)
      console.log('event.currentTarget === this =>', event.currentTarget === this)
    }
  }
}

var button = document.querySelector('#button')
button.addEventListener('click', obj.foo.bar)

// 點擊按鈕時:
//   button === event.currentTarget => true
//   event.currentTarget === this => true
```

## 使用 bind 覆寫 this

在 [物件中的方法](#物件中的方法) 一節提到，`this` 會連結至他的呼叫者，但其實這個行為可以被覆蓋。

呼叫 `bind` 方法會複製原本的函式，並指定新的函式中 `this` 的值。

```js
var obj = {
  getX: function () {
    return this.x
  },
  x: 'this is x'
}

obj.getX() // 'this is x'

// 綁定 newThis 物件到 obj.getX 的 this 上
var newThis = {
  x: 'this is NOT x'
}
var boundGetX = obj.getX.bind(newThis)
boundGetX() // 'this is NOT x'
```

> bind 也可以用在，除了綁定 this，也可以用在綁定參數上。
> see: [Function.prototype.bind() - MDN]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Partially_applied_functions)

### 例外: 綁定箭頭函式無效

```js
var x = 'xxx' // 宣告 foo 變數在 window 上
var getX = () => { return this.x } // 宣告箭頭函式

// 直接呼叫 getX 會綁定 this 到 window 上，因此可以取得 x 的值
getX() // 'xxx'

// 嘗試呼叫 bind 綁定新的 this 到 getX 上，但呼叫 boundGetX() 的結果不是 'yyy'，代表 this 沒有被改變
var boundGetX = getX.bind({ x: 'yyy' })
boundGetX() // 'xxx'
```

### 例外: 綁定建構子無效

```js
function Module () {
  this.x = 'x'
}

// 綁定建構子函式 Module
var boundModule = Module.bind({x: 'FOO'})
var module = new boundModule()

// 調用 x 還是獲得原本的值，沒有被新的綁定 {x: 'FOO'} 覆蓋
module.x // 'x'
```

## 使用 call 與 apply 覆寫 this

我們也可以用 call 與 apply 來呼叫指定的 function，並改變 function 的 this

```js
var x = '我是 x'
var getX = function () { console.log(this.x) }

getX() // '我是 x'

// 用 call 覆蓋 this
getX.call({ x: '我是 x 戰警' }) // '我是 x 戰警'
getX.call({ x: '我是 x 保母' }) // '我是 x 保母'

// 用 apply 覆蓋 this
getX.apply({ x: 'Hunter x Hunter' }) // 'Hunter x Hunter'
getX.apply({ x: '9 x 9' }) // '9 x 9'
```

> 範例中只使用 call 與 apply 的第一個參數，但他們的不同在於，call 接收「參數」在第二個參數及之後，apply 則接收單一個「陣列」作為第二的參數。

## 結論

在大多數的情況，this 都會指向**函式的呼叫者**。

少數情況「箭頭函式」、「建構子」與「DOM 事件」則需要個別去記憶。

覆蓋 this 則有三種方法「bind、call、apply」。

## 參考
- [MDN 解釋 this 的文章]


[MDN 解釋 this 的文章]: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this
