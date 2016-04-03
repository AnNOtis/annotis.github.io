---
layout: post
title: 我的 Sublime Text 使用習慣
date: 2015-01-06 15:27 UTC
tags:
  - SublimeText
  - Tool
---

這篇對自己平常使用 Sublime Text 的習慣做個紀錄，Sublime Text 的功能很多，還有很多操作方式或工具沒有記錄在這裏，但目前使用起來還對我來說蠻夠用的，分享給有需要的人。

<!--more-->

- 版本: Sublime Text 3
- 作業系統: OSX

## 快捷鍵

### 文字操作

`cmd⌘ + ctrl⌃ + up`
整行上移

`cmd⌘ + ctrl⌃ + down`
整行下移

`cmd⌘ + {`
縮排往前一格

`cmd⌘ + }`
縮排往後一格

`cmd⌘ + shift⇧ + d`
複製當前的這一行，並貼上到下一行

`cmd⌘ + Enter`
插入一行空白行到下一行

`cmd⌘ + shift⇧ + Enter`
插入一行空白行到上一行


### 選取

`cmd⌘ + a`
全選

`cmd⌘ + d`
如果未選取任何目標的話，會選取游標停留的那個字（word），效果跟連點兩下滑鼠一樣，如果已經選取字段的話，則會搜尋下一個一模一樣的字段並選取

`cmd⌘ + ctrl⌃ + g`
目前被選取的字段，會在整份文件中搜尋並選取，通常搭配`cmd⌘ + d`使用

`cmd⌘ + l`
選取一整行，連按會一直往下選取下一行

### 游標控制
`cmd⌘ + 滑主左鍵`
可以產生多個游標，可以在很多地方編輯一樣的內容，按esc結束模式

`cmd⌘ + left or right`
游標移到行頭或移到行尾

`cmd⌘ + up or down`
游標移到檔案開頭或檔案尾

`cmd⌘ + /`
根據目前編輯的檔案格式註解，例如：Ruby 會加上 #，CSS 會加上 //，也可以選取多行一起使用。

`cmd⌘ + shift⇧ + l`
通常搭配 `cmd⌘ + l` 選取多行後使用，會出現多個游標分別在每行的行尾，也可以搭配 `cmd⌘ + left` 讓游標到行頭。

### 搜尋

`cmd⌘ + p`
搜尋目前目錄下的檔案名稱，搜尋方式由前到後依序尋找符合的字元，例如檔案名稱叫 `MySublimeSettings`，那搜尋 `MSS` 就能夠找到

`cmd⌘ + r`
搜尋目前檔案下的 method

`cmd⌘ + p` 打開輸入框後填入 `:(行號)`，會跳到指定的那一行（eg. :254，跳到254行 ）

`cmd⌘ + f`
搜尋目前檔案下的是否有符合的文字

`cmd⌘ + shift⇧ + f`
搜尋目前目錄下的是否有符合的文字

### 分頁控制：

`cmd⌘ + n`
開新分頁

`cmd⌘ + w`
關閉目前的分頁

`cmd⌘ + 1~9`
選取指定的分頁

`cmd⌘ + opt⌥ + left or right`
到上一個分頁或下一個分頁

`cmd⌘ + opt⌥ + 1~5`
將頁面水平分割成多個視窗，假裝自己有雙螢幕...，通常用在比對程式碼的時候。


### 其他

`cmd⌘ + shift⇧ + p`
打開指令框，可以用來鍵入 pluging 或內建的指令。比較常用到的是 `Set Syntax`，或是 `Package Controll:Install Package`

`cmd⌘ + k + b`
打開或是關閉側邊欄（sidebar）

`cmd⌘ + ,`
打開 Sublime Text 設定檔



## 套件

### [Package Control][0]
這是 Sublime Text 必裝的套件，功能是管理套件，讓套件可以更方便地安裝與管理，安裝方式[在這裡](https://packagecontrol.io/installation)。另外他的官網可以看到套件排行以及最近套件的趨勢，有空時逛逛會有意想不到的發現。

### [Alignment][1]

超實用，用來對齊程式碼。有一段程式碼有很多行的變數宣告，如下：

~~~ ruby
@title = 'Otis Blog'
@description = 'Otis的小確幸'
@keywords = 'Otis, Blog, Ruby, 設計'
~~~

選取後，按`cmd⌘ + ctrl⌃ + a`，就會變成下面這樣，超整齊，再也不用手動對齊。

~~~ ruby
@title       = 'Otis Blog'
@description = 'Otis的小確幸'
@keywords    = 'Otis, Blog, Ruby, 設計'
~~~

如果對預設的不滿意，也可以自己指定依據什麼字元來排列。

### [Bracket Highlighter][2]

讓你一眼看出括號或標籤的開頭與結尾，對於要看很多層的程式碼縮排，或是要找出錯誤的 HTML 標籤都很好用。

![bracket_highlighter](/images/sublime-intro/bracket_highlighter.png)

### [Color Highlighter][3]

在程式碼中標記出色碼的顏色是什麼，開發 Web 必不可少的好物。一張圖了解 Color Highlighter。

![color_highlighter_demo](https://camo.githubusercontent.com/e13f5346a650e7e3fc2269fd4de3904d78c8fd1e/687474703a2f2f692e696d6775722e636f6d2f55506d456b30392e706e67)

<small>（圖片來源：Color Highlighter Github）</small>

### [Emmet][4]
開發前端必不可少的利器！主要目的是改進編寫 HTML 與 CSS 的 workflow，功能實在太多了，來看個介紹吧！[官網介紹](http://docs.emmet.io/)

### [Git Gutter][5]
能夠依據 git，顯示出哪一行被新增、刪除或修改

![Git Gutter Demo](https://camo.githubusercontent.com/272854f332fd374f50a58060615af911b9798fbc/68747470733a2f2f7261772e6769746875622e636f6d2f6a69736161636b732f4769744775747465722f6d61737465722f73637265656e73686f742e706e67 "Git Gutter Demo")

<small>（圖片來源：Git Gutter Github）</small>

### [Markdown Preview][6]
功能包括在瀏覽器中預覽 Markdown 檔案，輸出為 HTML、Markdown Cheatsheet...等

### [Sidebar Enhancements][7]
擴充 Sublime Text 的側邊欄功能，現在你可以複製、貼上或剪下檔案，在 Finder 中開啟資料夾，這是原本做不到的！

![Sidebar Enhancements Demo](https://camo.githubusercontent.com/9c427039fb2e97570edf760c4abeaf43d208f702/687474703a2f2f646c2e64726f70626f782e636f6d2f752f34333539363434392f7469746f2f7375626c696d652f536964654261722f73637265656e73686f742e706e67 "Sidebar Enhancements Demo")

<small>（圖片來源：Sidebar Enhancements Github）</small>

### [Trailing Spaces][8]
高亮顯示多餘的空格，並可以設定在儲存的時候自動刪除

## 主題

### [Solarized](http://ethanschoonover.com/solarized)
如果喜歡亮色系的主題，很推薦 Solarized(Lighted)，語法高亮的顏色對比很適中，背景色是羊皮紙的顏色，不會太刺眼，而且是內建就有的主題。

### [SpaceGray](https://github.com/kkga/spacegray)
如果喜歡暗色系的主題，推薦 Spacegray，推薦的原因也是一樣，語法高亮的顏色對比很適中，但只限於 base16-ocean-dark。

### [Cobalt2](https://github.com/wesbos/cobalt2)
推薦這個主題的介面，每種檔案類型會用不同圖形標示出來，主要編輯的檔案會有顯眼的標記，不過語法高亮的對比就太強烈了，自己不是很習慣。

自己的設定是介面用 Cobalt2，語法高亮用 SpaceGray，這樣就兩全其美啦。另外覺得 Source Code Pro 的字型還不錯，所以也一起加進去設定。
設定如下，打開 `Preferences > Settings - User` 加入：

```json
{
    "color_scheme": "Packages/Theme - Spacegray/base16-ocean.dark.tmTheme",
    "theme": "Cobalt2.sublime-theme",
    "font_face": "Source Code Pro"
}
```

<small>（備註：記得要先安裝 Cobalt2 與 Spacegray，然後電腦要有 Source Code Pro 的字型！！）</small>

## 參考資料
- 社群朋友的分享
- 自己的使用習慣


[0]:https://packagecontrol.io/
[1]:https://github.com/wbond/sublime_alignment
[2]:https://github.com/facelessuser/BracketHighlighter
[3]:https://github.com/Monnoroch/ColorHighlighter
[4]:https://github.com/sergeche/emmet-sublime#readme
[5]:https://github.com/jisaacks/GitGutter
[6]:https://github.com/revolunet/sublimetext-markdown-preview
[7]:https://github.com/titoBouzout/SideBarEnhancements
[8]:https://github.com/SublimeText/TrailingSpaces
