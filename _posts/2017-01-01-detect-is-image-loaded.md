---
layout: post
title: "圖片到底載入了沒？"
date:  2017-01-01 21:05:00 +0800
tags:
  - JavaScript
categories:
  - Notes
---

最近在撰寫的專案，常常會使用 canvas 來處理圖片合成，canvas 在合成圖片時必須確保圖片已經被載入，否則會產生空白圖片。

## 如何確保操作在圖片載入後

所以，該如何確保圖片已經被載入後，再進行下一個操作？

大部分的時候，我們會使用 `new Image()` 在 JavaScript 中產生 `HTMLImageElement`，然後在屬性 `onload` 中設定圖片載入後要執行的操作。如下：

```js
var image = new Image()
image.onload = function () {
  // ... 在圖片載入後要進行的操作 ...
}
image.src = 'https://www.google.com/favicon.ico'
```

上方的程式碼在 https://www.google.com/favicon.ico 載入成功（status < 400）時，就會執行 `onload` 所設定的函式。

值得注意的是 `image.onload = ` 的敘述語句**必須**放在 `image.src =` 之前，如果寫為下方的形式：

```js
image.src = 'https://www.google.com/favicon.ico'
image.onload = function () { /* ... */ }
```

在圖片沒有被 cached 的情況下，`onload` 會正常被執行，不過如果圖片已經被 cached，在 **Safari** 上則不會執行 `onload` 所設定的函式。

## 圖片是否已經被載入

另一種常見的情境，如果程式碼中要使用到圖片，但是該程式並不會馬上執行，我們也會提前將圖片注入到 markup 之中，確保程式需要用到該圖片前，馬上就可以使用，而不需要等待下載時間。

在這種情況下，如果我們依舊使用上方的方式，程式並不可靠，因為如果圖片在程式碼 `.onload` 執行之前就被載入，則 `.onload` 的回調永遠不會被觸發。

```js
// 頁面上放置 <img src="https://www.google.com/favicon.ico">

// ... https://www.google.com/favicon.ico ...載入完成

// 執行下方程式碼
var image = new Image()
image.onload = function () { /* 這裡永遠不會被執行到 QQ */ }
image.src = 'https://www.google.com/favicon.ico'
```

要解決這個問題，可以使用 `complete` 這個屬性，如果圖片已經被載入 `complete` 會被設定為 `true`。

```js
/* <img id="preload-image" src="https://www.google.com/favicon.ico"> */

var preloadedImage = docuemnt.getElementById('preload-image')

console.log(preloadedImage.complete)
// => true: 已經載入, false: 未載入
```

值得注意的是，`complete` 屬性在 IE9 上才開始支援，IE8 以下的話，則必須在圖片載入的那一刻，自行記錄該圖片已經被載入了。

## 圖片載入函式

在實際的應用當中，我們可以寫一個函式，同時適應上述「圖片上尚未載入」以及「圖片已經載入」兩個情境，方便在各個地方複用。

```js
function onImageLoaded(url, cb) {
  var image = new Image()
  image.src = url

  if (image.complete) {
    // 圖片已經被載入
    cb(image)
  } else {
    // 如果圖片未被載入，則設定載入時的回調
    image.onload = function () {
      cb(image)
    }
  }
}

onImageLoaded('https://google.com/favicon.ico', function (icon) {
  console.log('Google 的 Favicon 載入完成啦！')
})
```

## 結論

圖片載入的判斷，除了我遇到的 canvas 合成圖片必須確保載入完成，還可以被使用在圖片 Lazy load 的實作上，應該是很常需要使用到的小知識啦，紀錄一下總是好的。

不過為了精簡文章的主題，圖片載入錯誤的情況就被略過，這也是需要小心的地方，也許改天可以開一篇文章專門來寫圖片載入的錯誤處理呢！
