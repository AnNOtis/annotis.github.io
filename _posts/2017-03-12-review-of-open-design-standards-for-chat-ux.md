---
layout: post
title: "[筆記] Open Design Standards for Chat UX"
date: 2017-03-12 15:28:51 +0800
tags:
  - Design
  - Note
categories:
  - Notes
---

原文：[Open Design Standards for Chat UX - *Kip*](https://hackernoon.com/open-design-standards-for-chat-ux-f9f786b3a68e)

[Kip] 是一間做辦公室輔助軟體的公司，他們的產品是一個 Slack Bot，用來管理公司內部的大小事。

他們嘗試歸納出聊天介面元素的跨平台通則，提供好的使用者體驗。

<!--more-->

## Stickers as Conversation Landmarks

使用者聊天的過程是單向的訊息流動，如果有訊息隱藏在之前的聊天記錄中，使用者會很疑惑，如果要使用者往前回滾或打 `help`，也會中斷訊息的傳達。

Kip 的解決方法是使用「貼圖」來顯示目前的對話模式，讓使用者能夠預期將接收到的訊息。

「貼圖」也可以被用來切換不同的體驗。

![Stickers as Conversation Landmarks](https://cdn-images-1.medium.com/max/1000/1*cAIRjUZr_mzDoVQHu-Vh6A.jpeg)

> - 需要避免訊息的中斷
- 貼紙適合需要模式切換的 bot

## Poll with Conversable Forms

- 多樣的表單對於收集回饋訊息很必要。
- 行內更新可以避免多行的訊息與通知的轟炸。

![Conversable Forms](https://cdn-images-1.medium.com/max/800/1*xZ8tmKGFsYbcH9xMzu_cFw.gif)

> 橫跨多行的訊息較難確定目前的聊天狀態。

## Persistent Menu Buttons

在對話的 UI 中，沒有 Home、Back 或「選單」，所以使用者必須記憶很多東西。

作者用一個 emoji 代表「選單」鍵，在每個對話中出現，使用遇到困難就可以點一下。這讓使用者不需要記憶「指令」或回滾才能操作。

## 學習總結

- 用符號來切割不同的情境。
- 運用行內更新來顯示互動的結果。
- 提供一直存在的「選單」

[Kip]: https://kipthis.com/
