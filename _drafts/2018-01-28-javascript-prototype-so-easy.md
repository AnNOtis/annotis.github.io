---
layout: post
title: "JavaScript Prototype"
date: 2018-01-28 18:05:52 +0800
tags:
  - JavaScript
categories:
---

JavaScript Prototype 每個面試都會問一次，但這個東西真的很簡單，應該要納入「這麼簡單你還不明白」的百科全書中。

## 原型鍊 Prototype Chain

提到 JavaScript 原型，通常就是在講原型鍊（prototype chain），那原型鍊是什麼呢？

一句話暸解就是：

「當你在物件上（object）上找不到屬性（property）時，js 就會順著原型鍊往上查看另一個物件的屬性，直到碰到 null。」

舉例來說：

當我們定義一個 person 物件：

```js
var person = {
  name: 'Otis!'
}

person.name // Otis!
```

當我們呼叫 person 的 name 屬性，如我們預期的會回傳 `Otis!`。

我們呼叫任何不存在 person 上的屬性都會回傳 `undefined`

```js
person.girlfriend // undefined
```

不過會寫程式的瘋子跟被老闆搞到發瘋的工程師，絕對不會這麼快放棄，他會決定遍歷世界上所有他想得到的屬性，過了 2375 個夜晚，他終於發現了例外。

```js
person.toString // [Function: toString]
```

六年來的辛苦沒有白費，toString 就算沒有宣告在我們的 person 上，還是可以使用，買一送一，好不快樂。

這時候問題來了，toString 到底存在在哪個平行時空呢？為什麼沒有定義還是可以招喚使用？

### 取得原型

還記得我們開宗明義說到，

> 當找不到屬性，就會沿著原型鍊到另一個物件找啊！ -- 宗明義

That's the idea，它存在於原型鍊的另一個物件。

靈光乍現、電光一閃，該瘋子知道了問題的關鍵，無法被觀測的原型鍊既生既死，既存在又不存在，我們必須先尋找觀測的方法。

彷彿接到神的隻字片語，神告訴他用 `__proto__`，可以穿越到原型鍊的的另一端一探究竟。

但 `__proto__` 在某些瀏覽器會爆炸，而且就算是神也不知道到底哪些瀏覽器才有支援 `__proto__`，神建議你先安裝 chrome，並另外使用標準加持的 `getPrototypeOf` 進行原型鍊小旅行。

使用 getPrototypeOf 可以找到原型鍊上的下一個物件：

```js
const anotherObject = Object.getPrototypeOf(person)
```

用 getOwnPropertyNames 定睛一看：

```js
Object.getOwnPropertyNames(anotherObject)
/**
[
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'propertyIsEnumerable',
  '__proto__',
  'constructor',
  'toString',    <------------- 媽！我在這～
  'toLocaleString',
  'valueOf',
  'isPrototypeOf'
]
**/
```

啊～ 原來 toString 就藏在這裡，這時候瘋子工程師頓時茫然失措，一句 `getPrototypeOf` 捶打著他的胸口，還有一句 `getOwnPropertyNames` 撕裂他的心扉，六年的時光虛擲，為什麼當初不知道這兩個方法，更！媽的。

但能在沒人性老闆的魔爪下存活的工程師，絕不會被這樣的打擊打敗，心智更不是一般草莓工程師能夠猜透，他心想也許這一切都是巧合，`toString` 只是恰巧在對的時間走到了對的地點，難道 `constructor`、`valueOf` 還有其他屬性，都跟 `toString` 一樣可以從 person 物件存取？

```js
person.valueOf // [Function: toString]
person.constructor // [Function: toString]
person.hasOwnProperty // [Function: toString]
```

結果的確如此，都不是 `undefined`，的確都可以被 person 物件存取。

他只能信了，「當存取某物件的屬性時，也能存取原型鍊上其他物件的屬性」。

不過問題是，這條原型鍊，到底，通向，哪裡？ 是不是盡頭只能看見一片虛無，還是上帝在我眼前遮住了簾忘了掀開。

他還記得六年換來的教訓，他現在知道用 getPrototypeOf 就能夠進行原型鍊小旅行囉～

旅行開始！

```js
const person = {name: 'Otis'}

const one = Object.getPrototypeOf(person)
const two = Object.getPrototypeOf(one)
const three = Object.getPrototypeOf(two)
const four = Object.getPrototypeOf(three)
const five = Object.getPrototypeOf(four)
const six = Object.getPrototypeOf(five)

console.log(person) // {name: 'Otis'}
console.log(one) // {}
console.log(two) // null
console.log(three) // null
console.log(four) // null
console.log(five) // null
console.log(six) // null
```

發現了原型鍊的盡頭只剩下無盡的 null。

「null 就是原型鍊的終點！」

## 原型鍊概念彙總

故事就到這一段落，因為想像力已用鑿，繼續掰下去，只會變成言承旭，讓我整理思緒，把想法過濾（單押 x 4）

**什麼是原型鍊？**

> 原型鍊是物件與物件之間的連結，當在物件上找不到屬性時，便會沿著原型鍊到另一個物件上尋找。

**如何存取原型鍊？**

> 可以使用 `__proto__` 或是 `getPrototypeOf`，最好使用 `getPrototypeOf` 因為是未來的標準。

**原型鍊的終點是？**

> 當原形鍊不斷上去，終點是 null，當遇到 null 的時候便會停止，因為 null 沒有任何的屬性，而且 null 的原型還是 null。

## 自定義原型之 Object.create()

俗話說得好，沒辦法應用的東西都只是空中樓閣，只有理論而不能實踐在我們的程式碼的話就沒有價值。

所以我們要知道，如何自行建立原形鍊，這樣原形鍊的概念才能為我們所用。

原型鍊的特性能讓我們引用其他物件的屬性，這恰好很能夠應用到物件導向上，物件導向的核心之一就是行為的繼承，行為能被不同的物件繼承下去。

> 龍生龍，鳳生鳳，老鼠生的兒子會打洞

華盛頓他爸年輕的時候是砍樹的專家，他知道如何砍倒每一棵樹，尤其是櫻桃樹。

```js
const father = {
  cut: function () {
    console.log("I know how to cut a tree, expecially cherry tree.")
  }
}
```

過了幾年意氣風發的日子，他遇上了生命中對他最重要的女人，他們決定共組家庭，沒想到一切才是噩夢的開始。

他們生下的第一個兒子，不管怎麼教，都對砍樹沒有興趣，倒是整天黏在螢幕前，嘴裡喃喃有詞，「哦哦，原來原型鍊會往上查看另一個物件的屬性，直到碰到 null。」

```js
const son = {
  job: 'JavaScript Developer'
  speak: () => console.log('%*#!&^%A0daf#*l')
}
console.log(son.cut()) // TypeError: 我不會砍樹
console.log(son.girlfriend) // undefined
```

華盛頓他爸知道，這個兒子，這個不孝子已經選擇了一條最艱辛的路，他已經愛上 JavaScript，一輩子都會是個肥宅，靠他繼承砍樹的事業是不行了。

還好華盛頓他爸正值壯年，再生一個兒子對他來說還是沒有問題的，不過他這次決定執行計畫性的生育，事前使用 `Object.create` 來做一個孵蛋的動作。

```js
const anotherSon = Object.create(father)
```

故事的發展正如同大家想的一樣，另外一個兒子，也就是華盛頓，在六歲那年，拿起了大斧頭砍倒了門前的櫻桃樹。

```js
anotherSon.cut() // "I know how to cut a tree, expecially cherry tree."
```

華盛頓把這件事告訴他爸爸，他爸爸不僅沒有責罰他，還興高采烈的誇獎他：「不愧是我的好兒子啊！」

這就是華盛頓砍倒櫻桃樹的故事，這個故事告訴我們。

「要生兒子的時候，記得要使用 Object.create()。」


## Object.create 概念彙總

講了很多廢話，其實是想說

「當你調用 Object.create()，就會以參數作為原型產生新的物件」

```js
const father = {
  cut: () => console.log('Kill a cherry tree.')
}
const son = Object.create(father)
```

這是後，原型的鏈結已經被建立，如果你不相信，你可以用 `Object.getPrototypeOf` 確認一下

```js
console.log(
  Object.getPrototypeOf(son) === father
) // true
```

son 的原型會是 father，也因此 son 可以存取 father 的屬性

```js
son.cut() // Kill a cherry tree
```

## 自定義原型鍊之 - new Constructor

上方 Object.create 的例子，是一個很好的示範時如建立原形鍊，但是對於物件導向來說，我覺得不行。

如果我們砍樹系統中，有很多老爸都會砍樹，只是名字不同，要怎麼在我們系統中實踐呢？

```js
function generateFather (name, cutThree) {
  return {
    name: name,
    cut: console.log('Kill a cherry tree.')
  }
}

const fatherBatman = generateFather('Batman')
fatherBatman.name // Batman
fatherBatman.cut() // Kill a cherry tree

const fatherSuperman = generateFather('Superman')
fatherSuperman.name // Superman
fatherSuperman.cut() // Kill a cherry tree

const fatherJay = generateFather('Jay Chou')
fatherJay.name // Jack Chou
fatherJay.cut() // Kill a cherry tree
```

const son = Object.create(fatherA)

這樣的結果我們可以很愉快的讓每一位老爸都會砍樹，還可以讓每一位老爸都有自己的名字，帥！

但是，當我們開始使用 Object.create 生小孩的時候，問題就來了。

```js
const sonA = Object.create(fatherJay)
sonA.name // Jay Chou
const sonB = Object.create(fatherJay)
sonB.name // Jay Chou
const sonC = Object.create(fatherJay)
sonC.name // Jay Chou
```

fatherJay 生出來的小孩每一個都叫 Jay Chou，WTF，青蜂俠只能有一個。

問題是出在，我們沒能把可以被繼承的行為（or 屬性），與不能夠被繼承的行為分開。

### Constructor

JavaScript 中能夠解決這個問題。

```js
function Father (name) {
  this.name = name
}

Father.prototype.cut = () => console.log('Kill a tree')
```

使用這種方法，我們直接就將老爸的

```js
function Father (name) {
  this.name = name
}


```



