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
- [資源處理的三個階段](#資源處理的三個階段)
- [資源執行的順序](#資源執行的順序)
- [Critical Resources](#critical-resources)
- [Speculative parsing](#speculative-parsing)
- [onLoad vs onContentLoaded](#onload-vs-oncontentloaded)
  - [onContentLoaded](#oncontentloaded)
- [資源載入的優先度](#資源載入的優先度)

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

有兩個方法可以優化第一次渲染的速度。

### Media Query

如果你使用非當前顯示器的 media query 來載入 CSS，該 CSS 會延到第一次渲染之後下載。

舉例來說，使用影印用的 CSS 可以剝離出來單獨宣告：

```

```






























如果你有使用過 Page Speed 檢查過你自己的網頁，他可能會告訴你需要 `清除前幾行內容中的禁止轉譯 JavaScript 和 CSS`，這是什麼意思呢？當然沒人看得懂，因為翻譯得實在很爛。喂谷歌之後大概會查到「Critical Rendering Path」、「Critical Requests」、「Ｃritical Resources」 之類的。Critical 又有多 Critical 呢？我為什麼要在乎呢？你說 Critical 就 Critical 嗎！！

其實我們要在乎的是瀏覽器多快能夠顯示畫面，越快顯示畫面使用者就感覺越舒服。而那些會延後瀏覽器第一次繪製畫面的資源，我們稱之為關鍵資源（Critical Resources）。

## 第一次渲染 First Paint

在第一次渲染之前，會發生幾件事，HTML 文檔會被下載，下載後會被解析。

解析的時候會將看到什麼資源，就把它丟進佇列裡等待下載，下載的順序有一個神秘的規則，
我研究了很久還是無法嵾透他的規則是什麼，而且各個瀏覽器有「不同」的規則來最佳化他們的下載，這個「不同」讓我很頭痛，我們暫且不理他，只要知道所有 HTML 上下述形式的 CSS、JS、Font 都會在第一次渲染前被下載。

Image 可能會因為不在視圖（view port）當中而延後下載



## 資源處理的三個階段

- 下載 download
- 解析 parse
- 執行 execute
- render

## 資源執行的順序

```html
<link rel="stylesheets" type="text/css" href="style.css"></link>
<script src="first.js" type="text/javascript"></script>
<script src="second.js" type="text/javascript">
</script>
```

我們知道瀏覽器會依序執行資源，所以在上方的例子，`style.css` 會被執行，然後才執行 `first.js` 以及 `second.js`。

假如 `style.css` 定義了 `<body>` 元素的背景顏色，`first.js` 應該要可以讀取到。同理 `first.js` 所做的操作如 `document.body.style = 'red'` 也要可以被 `second.js` 讀取。

這帶來的問題是，下一個資源必須要等待上一個資源被執行完成才會開始執行，在上方的例子如果 `style.css` 的下載花了很久的時間，`first.js` 與 `second.js` 就遲遲不能開始執行。

## Critical Resources



## Speculative parsing

現今的瀏覽器都會做一個優化，讓瀏覽器先掃過一遍 document，得到所有需要先下載的

## onLoad vs onContentLoaded

### onContentLoaded

發生在瀏覽器下載 HTML、完成解析並建立 DOM tree

瀏覽器在解析 HTML 文件時，當遇到 `<script>...</script>` 便會暫停建立 DOM，因為 script 中的內容有可能改變 document，他必須等到 script 的程式碼被執行後，才會繼續建立 DOM。

載入外部 script 也會暫停 DOM 的建立：

```html
<script src="external-a.js" type="text/javscript"></script>
<script src="external-b.js" type="text/javscript"></script>
```

合情合理，因為在開發者的預期中，嵌入在 HTML 的 JavaScript 就是要順序執行，如果 `external-a.js` 更改 DOM，`external-b.js` 必須要能讀到更改的結果。

而這帶來的影響是，CSS 與 JS 完成下載、解析與執行之後  `DOMContentLoaded` 才會被觸發。






這代表所有在 `Speculative parsing` 所掃瞄到的 JavaScript 必須已經被載入，因為 JS 的程式碼很有可能會改變 HTML，而且
```js
document.addEventListener("DOMContentLoaded", function(event) {
  console.log(`[Event] DOMContentLoaded - DOM fully loaded and parsed! ${getTimeFromStart()}`)
})
```

所有資源被載入後回傳，

```js
window.addEventListener("load", function(event) {
  console.log(`[Event] Load - All resources finished loading! ${getTimeFromStart()}`)
})
```



## 資源載入的優先度

[Resource Fetch Prioritization and Scheduling in Chromium](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit#)

[Using the Paint Timing API | CSS-Tricks](https://css-tricks.com/paint-timing-api/)

[A Primer for Web Performance Timing APIs](http://w3c.github.io/perf-timing-primer/)

[Building the DOM faster: speculative parsing, async, defer and preload](https://hacks.mozilla.org/2017/09/building-the-dom-faster-speculative-parsing-async-defer-and-preload/)

[The Critical Request](https://css-tricks.com/the-critical-request/)

[Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)

[Resource Prioritization – Getting the Browser to Help You](https://developers.google.com/web/fundamentals/performance/resource-prioritization)



[如何決定下載的優先程度]:https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit#

[css-block-rendering]: /images/before-first-paint/css-block-rendering.png
[rendering-flow]: /images/before-first-paint/rendering-flow.png
