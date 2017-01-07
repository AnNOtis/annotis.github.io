---
layout: post
title: "字型排版中的名詞解釋"
date:  2015-11-28 15:44:06 +0800
tags:
  - Typography
  - Design
categories:
  - Notes
---

最近在閱讀 [Thinking with Type]，瞭解字型排版的基礎，以下是相關的筆記。

## 身體各部位

![anatomy][image/anatomy]

- **Ascender**： 字體的上端，如：_b, d, h, l, t, k_
- **Descender**： 字體的下端，如：_j, q, g_
- **Counter**： 中空的部分，如：_O, o, P, p, D_

- **Baseline**： 字體會倚靠在 baseline 上，也是與其他文字或圖片排版所依據的基礎
- **X-Height**： 是小寫字不包含 ascender 與 descender 的本體高度，也是小寫 x 的高度
- **Cap Height**： 從 baseline 到大寫字母最上緣的高度，也用來決定一個字的大小
- **Descender Height**： descender 的長度，會影響字體的風格與姿態

## 字體大小

**高度**
現今使用 point system 作為標準，1 point 等於 1/72 英吋或 0.35 毫米。pica 也常被使用，1 pica 等於 12 points。

- 一些表示法:
  - 8 picas = 8p
  - 8 points = p8, 8pts
  - 8picas, 4points = 8p4
  - 8-point Helvetica with 9 points of line spacing = 8/9 Helvetica

**寬度**
字母水平的量測稱之為 _set width_，_set width_ 包含字體大小與防止字體碰撞的間隔，改變 _set width_ 會影響字體的視覺感受，盡量選擇擁有合適特性的字體，
而不是去竄改 _set width_。

### X-Heights 的影響
字體的 _x-height_ 會影響它看起來多大以及視覺效果。同樣的字體大小，擁有較大 _x-height_ 字體會看起來比較大。較小的 _x-height_ 則可能會使字體擁有一種詩意，但卻會損失清晰度，因此應在不同的情境下考量字體的選用。

### Opticals Size <small>[link](http://www.thinkingwithtype.com/misc/Optical_Sizes.pdf)</small>
有些字體會有不同的版本，來呈現不同情境下的視覺效果。

## Scale

## Type Families

- **Regular**: 一般的形式，是其他家族的來源。
- **Italic**: 斜體字，用來強調，形狀與筆畫常常會跟 regular 不同。
- **Small Caps**: 用來放在大寫字排版會很不方便的一行文字，小型的大寫字會稍稍高於小寫字的 x-height
- **Bold and Semibold**: 用來強調，無襯線字體通常會有不同權重的的版本（thin, bold, black, etc.）
- **Bold and Italic**: 粗體同樣也有斜體的版本

## 參考資料

- [Thinking with Type] -- _Ellen Lupton_
- [Typography Essentials – A Getting Started Guide][Typography Essentials]

[Thinking with Type]: http://www.thinkingwithtype.com
[Typography Essentials]: http://freelancefolder.com/typography-essentials-a-getting-started-guide


[image/anatomy]: https://raw.githubusercontent.com/AnNOtis/annotis.github.io/e372558f003fe9951d19859bcf3df29c3c66bb0c/images/basic-of-typography/anatomy.png
