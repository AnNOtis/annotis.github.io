---
layout: post
title: JavaScript 的物件 -- object, prototype, inheritance chain
date:  2015-12-04 16:22:50 +0800
tags:
  - Javascript
categories:
---

原型（Prototype）一向是 JavaScript 語言中最需要被瞭解的知識，因為他是 JavaScript 語言的基石，其概念也滲透進我們的日常開發中，在不同的情境下不斷出現，瞭解原型也是模組化程式碼的第一步，他具有委派（delegation）的行為，能夠實現物件導向概念中的繼承，從而將程式碼組織成不同得抽象層級。

## 什麼是原型？

看看下面這段程式碼：

```js
var myObject = {}
myObject.toString() // => "[object Object]"
```

`myObject` 是一個空物件，他呼叫一個 `.toString()` 的方法，如果你曾經疑惑 `myObject` 分明是一個空物件，`toString` 方法從哪裡來？那你已經踏入暸解 Prototype 的第一步。

實際上 `toString` 存在於另一個物件上，

## 參考資料
- [JS Objects](https://davidwalsh.name/javascript-objects) - _Kyle Simpson_
- [Understanding "Prototypes" in JavaScript](http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript) - _[Yehuda Katz]_
- [Introduction to Object-Oriented JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript) - _[MDN]_
- [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) - _[MDN]_
- [Chapter 5: Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md) - _[You Dont Know JS: this & Object Prototypes]_

[Yehuda Katz]: https://github.com/wycats
[MDN]: https://developer.mozilla.org/en-US/
