---
layout: post
title: "Pattern Matching 引起的好奇"
date: 2017-06-22 14:57:54 +0800
tags:
  - Functional Programming
categories:
---

最近投入函數式語言的使用，發現很多語言（ex. Haskell , Elixir, Scala, Swift）都有提供模式匹配（Pattern Matching），這讓我有個疑問**「使用模式匹配有什麼好處？」**

<!--more-->

大綱：

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [代數型別 Algebraic data type](#代數型別-algebraic-data-type)
	- [建立一顆樹](#建立一顆樹)
	- [代數型別小結](#代數型別小結)
- [勸人向善的 Pattern matching](#勸人向善的-pattern-matching)
- [比較直覺啊？！](#比較直覺啊)
	- [自然對應](#自然對應)
	- [模式匹配與條件判斷](#模式匹配與條件判斷)
- [結論](#結論)

<!-- /TOC -->

## 代數型別 Algebraic data type

### 建立一顆樹

代數型別指的是，能夠**以其他型別組合而成的新的型別**，取自 [Wiki - Algebraic data type] 的例子，要建立一棵樹的型別，我們可以選擇將樹分解為空節點、節點與葉子，在 Haskell 中以下列的方式表示：

```hs
data Tree = Empty
          | Leaf Int
          | Node Tree Tree
```

這代表一棵樹可能是「空值」，也可能是只有一片「葉子」，或是一個「節點」下面帶有兩棵樹（左邊與右邊），當然這兩棵樹又可遞迴下去成為「空值」、「葉子」或「節點」。

如果我們使用上述資料結構來建構一棵樹

```hs
exampleTree = Node
  (Leaf 1) (Node
    (Leaf 2) (Node
      (Leaf 3) Empty))
```

可以得到如下圖的結果：

![tree](/images/pattern-matching/tree.png)

接下來定義求深度的函式，這時候模式匹配就可以派上用場了

```hs
depth :: Tree -> Int
depth Empty = 0
depth (Leaf n) = 1
depth (Node left right) = 1 + max (depth left) (depth right)
```

上述程式碼定義一個 depth 的函式，利用模式匹配，Haskell 會判斷參數的型別呼叫對應的函式，就算是我們**自行定義的型別**「空值 Empty」、「葉子 Leaf」、「節點 Node」也能夠對應。

參數的型別為 Empty 則深度加 0，Leaf 深度加 1，如果為 Node 則求取左右兩棵樹的深度，不斷遞迴下去直到碰到 Empty 或 Leaf。

以上方的 `exampleTree` 為例，求取深度的結果為 4：

```hs
print $ depth exampleTree -- 深度為 4
```

![depth of tree](/images/pattern-matching/tree-depth.png)

### 代數型別小結

如果跟一般遍歷的解法比較起來，遞迴加上語言本身模式匹配的支持，的確讓程式碼簡化許多。

另外一個在 [Learn You a Haskell - Algebraic data types intro] 書中提供定義形狀並求取面積的例子相當有趣，也顯示代數型別加上模式匹配的表達能力。

實際上代數型別，也可以用來指 Tuple 與 Record 等資料結構，只要能夠辨識數值之間的關係，語言本身就能實作 Pattern Matching，在 JavaScript 中也有[函式庫實作 Pattern Matching](https://github.com/bramstein/funcy)，實作方式的基礎就是[定義哪些數值屬於同一型別](https://github.com/bramstein/funcy/blob/master/lib/type.js)。

撇開 JavaScript 的實作，如果語言天生能夠更嚴格的定義型別，就能夠有更好的比較能力。

參考來源：
- <small>[Wiki - Pattern matching](https://en.wikipedia.org/wiki/Pattern_matching)</small>
- <small>[Wiki - Algebraic data type](https://en.wikipedia.org/wiki/Algebraic_data_type)</small>
- <small>[为什么 pattern matching 常常出现在函数式编程语言？](https://www.zhihu.com/question/22344888)</small>
- <small>[Pattern matching in JavaScript](https://www.bramstein.com/writing/pattern-matching.html)</small>

## 勸人向善的 Pattern matching

Thought 的這篇 ["Tell, Don't Ask" in Elixir: A Story of Pattern-Matching] 也提出不同角度的看法。

文章從「Tell Don't Ask」的原則出發，闡述模式匹配的特性，能夠鼓勵程序員寫出「聲名式設計 Declarative Programming」而不是「指令式設計 Imperative Programming」。

雖然我不確信文章的看法，因為「Tell Don't Ask」就算不使用模式匹配也可以輕易地做到。但是文章內闡述模式匹配重構的過程，還是直得一看。

## 比較直覺啊？！

聽到有人說：「這樣寫比較直覺啊！」，都會覺得不太對勁，因為「直覺」是主觀的概念，因人而異，但描述「模式匹配」比「條件判斷」直覺，我卻認為十分合適。

### 自然對應

有時候我們會發現，在一個地方有多個燈光的開關，很難記住哪一個開關是控制哪一個燈光，我們必須試了又試才能找到開關與燈泡之間的關係，這是因為開關與燈光缺乏直接的對應關係。

像是下面這張圖，瓦斯爐以及他的控制開關：

![non natural mapping](/images/pattern-matching/Old-style-kitchen-stove.jpg)

<small>By G5dvdyeh, GFDL, [Link](https://commons.wikimedia.org/w/index.php?curid=22521173)</small>

如果我們要知道「哪一個開關控制哪一個爐子」，我們會每一個開關都打開來試試看，然後發現，原來左上角的爐子是由第 1 個開關控制，然後以順時針的順序，依序對應到第 2、3、4 個開關。

我們必須要將瓦斯爐的位置，在心裡轉化為另一套可以對應開關位置的系統，才能夠順利的操作瓦斯爐。

如果我們將開關的改成下圖的排列，那使用瓦斯爐就會非常容易。

![natural mapping](/images/pattern-matching/Stove-square.jpg)

<small>By G5dvdyeh, GFDL, [Link](https://commons.wikimedia.org/w/index.php?curid=9054844)</small>

我們喜歡事物有自然的對應關係。

### 模式匹配與條件判斷

在 Elixir 中，使用 tuple 來做模式匹配很常見，如下：

```elixir
case Client.get(url) do
  {:ok, %{code: 200, body: body}} -> IO.inspect body
  {:ok, %{code: 404}} -> IO.inspect "Not found"
  {:error, %{reason: reason}} -> IO.inspect reason
end
```

不是從 tuple 中取值來做條件判斷，而是直接將預期中的結果寫成模式，模式匹配的寫法能夠在資料與預期的結果有自然對應的關係。

另外，模式匹配在「比對」完成後還有「附值」的操作，這也是方便的地方，因為通常匹配的目標，就是接下來要處理得值，這也讓程式碼簡潔許多

## 結論

根據上面的內容，模式匹配有三個好處：

- 更容易表達遞迴
- 鼓勵更好的架構
- 比較直覺

我們也能夠把「模式匹配」的想法對應到日常開發，而不只是「函數式設計」，像是處理[網址的路由](https://github.com/sinatra/mustermann)，或是[檔案的路徑](https://en.wikipedia.org/wiki/Glob_(programming))。

將「模式匹配」獨立出來並無法理解它的優點，「模式匹配」搭配語言特性、寫作風格與特定領域，才能體會它的好處。



[Learn You a Haskell - Algebraic data types intro]: http://learnyouahaskell.com/making-our-own-types-and-typeclasses#algebraic-data-types
