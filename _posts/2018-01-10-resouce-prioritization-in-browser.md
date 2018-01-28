---
layout: post
title: "在瀏覽器第一次渲染之前"
date: 2018-01-10 22:51:22 -0500
tags:
  - JavaScript
categories:
---

瀏覽器的第一次渲染花費多久時間（Time to First Paint），代表使用者多快能夠看到畫面，這件事情至關重要，因為當畫面越慢顯示，網站的轉化率會隨之下降。

在一些擁有高流量的網站，轉化率的下降就是數以千萬計的損失，就算網站不具有高流量，追求效能與速度也是前端工程師的課題。

<!--more-->

大綱：

<!-- TOC -->

- [關鍵資源 Critical Resources](#關鍵資源-critical-resources)
- [HTML 文檔](#html-文檔)
- [HTML 文檔中的資源](#html-文檔中的資源)
- [解析 CSS](#解析-css)
- [針對 CSS 優化第一次渲染的速度](#針對-css-優化第一次渲染的速度)
  - [Media Query](#media-query)
  - [動態載入 CSS](#動態載入-css)
- [下載與解析 JavaScript](#下載與解析-javascript)
- [JS 優化](#js-優化)
  - [Async vs Defer](#async-vs-defer)
  - [Defer](#defer)
    - [Async](#async)
  - [動態載入 JS](#動態載入-js)
- [結論](#結論)
- [參考資料](#參考資料)

<!-- /TOC -->

## 關鍵資源 Critical Resources

在談到關鍵渲染時，一定會提到前端三劍客 HTML、CSS、JS，這三個資源都會延後第一次渲染的時間，因為他們在第一次渲染時扮演重要的角色，被稱之為關鍵資源（Critical Resources）。

HTML 乘載著內容，一個網站能夠沒有 JS 與 CSS，但一定要提供 HTML，在第一次渲染前的主要工作，就是要將 HTML 從頭到尾解析完成。

CSS 代表樣式，CSS 與 HTML 都能夠定義樣式，所以在渲染時必須考慮兩者的內容，因此如果 CSS 沒有被解析完成，就不會進行渲染。

JS 尚未解析完成也會禁止渲染，因為 JS 有機會改變之後的 HTML，而另一方面 JS 必須等待 CSS 解析完成才會開始解析，因為 JS 可以讀取 CSS 的內容。

三個資源會交互作用，單純看字面關係很複雜，但並不需要死記硬背，因為瀏覽器並不會在第一次渲染前做浪費時間事情，比較好的理解方法是了解每樣事物完成所需的前置條件，在面對不同情境時也比較能有思考上的彈性。

## HTML 文檔

從使用者輸入網址，點擊確認之後，第一件事情會下載 HTML 文檔(HTML Document)，緊接著解析（parse）文檔。

HTML 本身設計十分容錯，沒寫結尾的 tag 瀏覽器會自動補齊，在 table tag 中的 form tag 會被移出，怎麼寫都不會報錯，著重在兼容的特性使得 HTML 本身並不適合直接被程式所操作，需要一個轉化的過程，來產出另一種適合被程式操作的結構 -- DOM (Document Object Model)。

當 DOM tree 被建構之後，才能夠被 JS 所存取，也才能夠在稍後與 CSS 的規則融合為渲染做準備。

## HTML 文檔中的資源

在解析的過程中，會遇到如下的的資源宣告

```html
<link rel="stylesheet" href="/external.css">
```

```html
<img src="/scare.jpg" />
```

```html
<script type="text/javascript" src="/external.js"></script>
```

瀏覽器就是見一個載一個，瀏覽器會將要下載的資源丟到一個佇列裡，再用一個神秘的演算法決定下載的順序，因為各個瀏覽器的實作並不一致，而且瀏覽器也一直在改進「[如何決定下載的優先程度]」，每個版本都可能不一樣，因此在這篇文章並不會著墨下載的順序，那是另一個很大的議題。

值得注意的是資源宣告的順序十分重要，瀏覽器會將資源依序執行。

如果 `script.js` 想要存取 `style.css` 得值（例： window.getComputedStyle），則必須將 `style.css` 宣告在 `script.js` 之前

```html
<link rel="stylesheet" href="/style.css">
...
<script type="text/javascript" src="/script.js" ></script>
```

如果順序顛倒，那就會出現不可預期的結果，這也是為什麼 best practice 都會建議將 CSS 宣告在 `<head>` 當中。


## 解析 CSS

身為一個現代的網頁，沒有 CSS 根本不能閱讀，將 HTML 文檔與樣式結合之後再渲染也是很合理的，如果我們將文檔與樣式分開渲染，就會造成先出現文字，然後樣式才被附加上去，而產生螢幕的閃爍，這樣的問題被稱為 FOUC（Flash of unstyled content）。

還好只有古老的瀏覽器才會發生 FOUC，少一件要煩惱的事，現今的瀏覽器會禁止渲染直到 CSS 被解析完成。

以下方 HTML 為例：

```html
<head>
  <link rel="stylesheet" href="/style.css">
</head>
```

在 Chrome Dev Tool 的 performance 頁籤中可以觀察到：

![CSS block rendering][css-block-rendering]{:data-action="zoom"}

**綠色虛線**是第一次渲染發生之時，我們可以看到「HTML 解析完成」後並不會馬上進行渲染的處理，而是等到「`style.css` 被載入完成」，才進行渲染。

style.css 載入後，瀏覽器會分析規則，產生稱之為 CSSOM 的樹狀結構，然後需要合併 CSSOM Tree 與 DOM Tree，計算樣式該如何去套用，因為在 HTML 行內的樣式很有可能覆蓋 CSS 中的規則，CSS 的規則也必須要知道哪些元素需要被套用樣式，必須要經過計算才能得出最終的樣式結果，這個步驟稱之為「樣式計算（Recalculate style）」並產生 Render Tree。

經過「樣式計算」下一個步驟是「版面配置 Layout」決定出每個元素在頁面上的位置，然後經過「繪製 Paint」步驟，負責生成像素的資料，這些像素的資料會分成多個層，然後最後一個步驟是「合成 composite」將多個層依照正確的順序合成在一起。

![Rendering Flow][rendering-flow]{:data-action="zoom"}

## 針對 CSS 優化第一次渲染的速度

優化的方法就是讓第一次渲染前要下載與解析的 CSS 減少，只留下必要的 CSS，有兩個方法可以延後下載與解析。

### Media Query

如果你使用非當前顯示器的 media query 來載入 CSS，該 CSS 會延到第一次渲染之後下載。

舉例來說，影印才會用到的 CSS，可以剝離出來單獨宣告：

```html
<link rel="stylesheet" media="screen" href="style.css" />
<link rel="stylesheet" media="print" href="printer.css" />  <!-- 只有在影印的時候才會套用 -->
```

這樣 `printer.css` 是否被解析完成，就跟第一次渲染無關，如果 `printer.css` 檔案很大，下載或解析很久，就會被延到第一次渲染之後。

其他的 media query 也是用一樣的規則，只要不符合當前顯示的 media，就不會禁止第一次渲染。

### 動態載入 CSS

也可以使用 Javascript 來插入 CSS

```js
function loadCss (path) {
  var head= document.getElementsByTagName('head')[0];
  var style= document.createElement('link')
  style.rel = "stylesheet"
  style.href = path
  head.appendChild(style);
}

loadCSS('/lazy.css')
```

`lazy.css` 便不會禁止第一次渲染


## 下載與解析 JavaScript

JavaScript 在 HTML 文檔內部，可以以行內的方式嵌入，或是引用外部資源：

行內：

```html
<script>
  // do some cool stuff
  console.log('執行 JavaScript')
</script>
```

引用外部資源：

```html
<script type="text/javascript" src="/external.js"></script>
```

當引用外部資源的時候要注意放置的位置，當放在 `<head>` 中，瀏覽器會等到該 JavaScript 下載解析完成才進行第一次渲染。

如果我們在 `<head>` 中引用外部的 jQuery

```html
<body>
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
</body>
```

瀏覽器執行結果：

![JS in Head][js-in-head]{:data-action="zoom"}

黃色區塊是正在執行 JavaScript，綠色虛線是第一次渲染發生之時，可以看到渲染在 jQuery 下載完成之後。

但如果我們將 jQuery 宣告放在 `<body>` 中就不會影響第一次渲染。

```html
<body>
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
</body>
```

![JS in Body][js-in-body]{:data-action="zoom"}

渲染早早發生，jQuery 才慢慢下載與執行。

## JS 優化

雖然說只要放在 `<body>` 中就能夠減少第一次渲染的時間，但 js 在 body 中的位置會影響其後的內容。

舉例來說：

```html
<body>
  <h1>這行出現在 external.js 尚未開始下載前</h1>
  <script type="text/javascript" src="/external.js"></script>
  <h1>這行出現在 external.js 執行完成後</h1>
</body>
```

第二個 `<h1>` 在下載完成並執行完成之前都不會顯示，所以最佳實踐通常建議將 `<script>` 放在結尾，也就是 `</body>` 前一行。

### Async vs Defer

在舊瀏覽器我們只能使用放在結尾的方式，但新的標準提供了 `defer` 與 `async` 可以做到一樣的事情。

### Defer

當在 `<script>` 加上 defer:

```html
<script defer type="text/javascript" src="/external.js"></script>
```

在解析 HTML 時不會停下來等 js 執行完，而是 **等到 HTML 解析完成才執行**，而且會循著宣告的順序執行。

如果你將 `<script>` 放在 HTML 文檔的結尾，有沒有加 defer 的效果是一樣的。

差別是當你將 `<script>` 放在 HTML 文檔中間，他並不會暫停 HTML 解析


#### Async

```html
<script async type="text/javascript" src="/external.js"></script>
```

async 也不會暫停 HTML 解析，但他很特別，他會在 **下載完成的那一刻馬上執行**。

這表示如果你有多個 `<script>` 使用 async，他們之間的執行順序一定不能保證，async 只適合用在需要越早執行越好，但是又跟其他程式碼沒有依賴關係的程式碼，像是偵測使用者行為的程式（例：Google Analytics）。

### 動態載入 JS

動態載入 JS 非常彈性，你可以決定他的載入時機要在 HTML 解析完成之時，還是所有資源都被下載完成之後。

基本的動態載入 JS 的程式碼長這樣：

```js
function loadJS (path) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script')
  script.type = "text/javascript"
  script.src = path
  head.appendChild(script);
}

loadJS('./external')
```

當你想要在 HTML 解析完成之後就開始執行，就把它包在 `DOMContentLoaded` 事件發生之時：

```js
document.addEventListener("DOMContentLoaded", function(event) {
  loadJS('./externalA.js')
  loadJS('./externalB.js')
  loadJS('./externalC.js')
})
```

而你想要等在所有資源都載入完成之後，包括不再 viewport 內的圖片，以及沒有符合當前 media query 的 CSS 都載入完成才載入的話，就包在 `onload` 事件內。

```js
window.onload = function() {
  loadJS('./externalA.js')
  loadJS('./externalB.js')
  loadJS('./externalC.js')
}
```

## 結論

講了落落長，好像沒有結論不行，但我又是個迷幻的人，自己都不知道我在幹麻。

結論應該是，要優化第一次渲染的時間很簡單，只要將真正重要的東西用正常的方式宣告，其他則延後下載或執行。

CSS 可以使用 media query 跟動態載入來延後下載與執行，而 JavaScript 則是放在結尾、使用 defer 或是動態載入。

## 參考資料

[Resource Fetch Prioritization and Scheduling in Chromium](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit#)

[Building the DOM faster: speculative parsing, async, defer and preload](https://hacks.mozilla.org/2017/09/building-the-dom-faster-speculative-parsing-async-defer-and-preload/)

[The Critical Request](https://css-tricks.com/the-critical-request/)

[Resource Prioritization – Getting the Browser to Help You](https://developers.google.com/web/fundamentals/performance/resource-prioritization)

[如何決定下載的優先程度]:https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit#

[css-block-rendering]: /images/before-first-paint/css-block-rendering.png
[rendering-flow]: /images/before-first-paint/rendering-flow.png
[js-in-body]: /images/before-first-paint/js-in-body.png
[js-in-head]: /images/before-first-paint/js-in-head.png
