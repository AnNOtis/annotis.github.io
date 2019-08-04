---
layout: post
title: "在 React Apollo 中處理 UI 衍生資料"
date: 2019-08-02 12:43:44 +0800
tags:
  - JavaScript
categories:
---

## 目的

後端在開發 API 時，不可能完全符合前端的期待，因為後端的目的是盡可能的將 API 設計的一般化，這樣能提供更多服務共用 API，也能減輕開發負擔。

前端理所當然就無法避免要處理 UI 衍生資料，我們需要針對 Resposne 的值進行轉換來符合前端的需求，轉換的程式碼很容易就不受控制的侵入進 UI 層，尤其是在 GraphQL 的 Response 非常彈性的情況下，處理起來也十分令人煩躁。

<!--more-->

本文章嘗試說明問題與提供解決方式

- [目的](#%e7%9b%ae%e7%9a%84)
- [問題](#%e5%95%8f%e9%a1%8c)
  - [1. 型別對 JS 來說不好操作](#1-%e5%9e%8b%e5%88%a5%e5%b0%8d-js-%e4%be%86%e8%aa%aa%e4%b8%8d%e5%a5%bd%e6%93%8d%e4%bd%9c)
  - [2. 後端的特有的邏輯滲透到前端](#2-%e5%be%8c%e7%ab%af%e7%9a%84%e7%89%b9%e6%9c%89%e7%9a%84%e9%82%8f%e8%bc%af%e6%bb%b2%e9%80%8f%e5%88%b0%e5%89%8d%e7%ab%af)
  - [3. UI 所需的衍生資料](#3-ui-%e6%89%80%e9%9c%80%e7%9a%84%e8%a1%8d%e7%94%9f%e8%b3%87%e6%96%99)
  - [4. 沒有為什麼就是想改名](#4-%e6%b2%92%e6%9c%89%e7%82%ba%e4%bb%80%e9%ba%bc%e5%b0%b1%e6%98%af%e6%83%b3%e6%94%b9%e5%90%8d)
- [如何在前端實作轉換？](#%e5%a6%82%e4%bd%95%e5%9c%a8%e5%89%8d%e7%ab%af%e5%af%a6%e4%bd%9c%e8%bd%89%e6%8f%9b)
- [實作方式](#%e5%af%a6%e4%bd%9c%e6%96%b9%e5%bc%8f)
- [結語](#%e7%b5%90%e8%aa%9e)

## 問題

目前遇到的問題是，後端給出的 Schema 不可能完全符合前端介面開發的需求，因此需要針對 Server 回傳的資料進行轉換：

在下列情景前端都需要進行轉換：

1. 型別對 JS 來說不好操作
2. 後端的特有的邏輯滲透到前端
3. UI 所需的衍生資料
4. 沒有為什麼就是想改名

### 1. 型別對 JS 來說不好操作

我遇過的例子是，時間的格式為 Unix Time in Second，型別為字串，JS Date Object 沒有辦法直接對其處理。

```js
const timeFromServer = "1534476064"

// 直接傳入 UNIX time 字串
new Date(timeFromServer) // => Invalid Date

// 轉成 Int 傳入，會得到錯誤的時間，因為 Date 應接受毫秒
new Date(parseInt(timeFromServer)) // => Mon Jan 19 1970 02:14:36 GMT+0800 (台北標準時間)

// 轉成 Int 傳入，並乘上 1000 才能得到正確的 Date 物件
new Date(parseInt(timeFromServer) * 1000) // => Fri Aug 17 2018 11:21:04 GMT+0800 (台北標準時間)
```

### 2. 後端的特有的邏輯滲透到前端

曾遇到的例子是，產品支援使用比特幣（BTC），但是 Golang 的 [currency package](https://github.com/golang/text/blob/master/currency/currency.go) 並不支援這種幣別，因為某些歷史原因，後端選擇使用白銀（XPT）替代比特幣（BTC），因此在我們後端回傳的資料中，所有的比特幣（BTC）都被叫做白銀（XPT）。

身為一個對使用者體驗有追求的前端，把 XPT 全部轉成 BTC 是很合理的選擇，使用者不應該知道 XPT 跟 BTC 之間的關係。

### 3. UI 所需的衍生資料

後端提供的資料應該保持純淨，不需要提供衍生資料。但 UI 上會有各種花式變奏或條件判斷需要計算。

例如，後端回傳一筆訂單的資料，包含兩個欄位「訂單總額」與「客戶已付款金額」，在多個地方需要判斷這筆訂單「是否已付清」來顯示對應的 UI。

### 4. 沒有為什麼就是想改名

有時候回傳的 Key 值名稱不符合個人喜好，就想改個名

## 如何在前端實作轉換？

所以通常會如何在前端實作轉換呢？

最簡單的做法是，在各個元件裡遇到對應的值都嵌入這些轉換函式。

```js
const Component = () => (
<Query query={queryOrderFromServer}>
  {({ data }) => {
    // 從 GraphQL Server 拿到訂單的資料
    const order = data.order;
    return (
      <div>
        ...
        <span>{formateBTC(order.currencyName)}</span> // 轉
        <span>{formatDate(order.createTime)}</span> // 轉
        ...
      </div>
    );
  }}
</Query>
);
```

這樣的做法在訂單資料只出現在系統中一次時沒有任何問題。
但在系統中出現多次時就無法管理，因為同樣的函式會散落在世界各地，或者是不屬於 UI 的邏輯，被寫到 UI 裡。

為了解決這件事，一個頁面或一個區塊一個 Container，我們可以把轉換相關的程式碼提升到 Container 或 HOC。

會寫出 withOrderQuery, withUserQuery 之類的 HOC 或 Container 來負責處理特定資料的轉換，再把資料傳下去改 children，所以每次需要同樣的資料類型，呼叫對應的 HOC 即可。

這種寫法在各個 HOC 之間沒有共用的資料類型時時，可以運作得很好，但是如果各個 HOC 有共用的類型時，就會有重複的程式碼，比如說我們在一個取得 User 資料的 Query，也同時去取得該 User 下的 Orders，這樣 withUserQuery 處理的資料就會包含 Order 這個資料類型，發現了嗎？ withUserQuery 與 withOrderQuery 都需要處理 Order 的資料。

在這種情況下，我們為了避免處理 Order 的程式碼的重複，我們需要建立共用的模型 Model，還讓他在各個 HOC 之間共用。

可喜可賀的是，GraphQL 在規劃 Schema 的時候，已經規劃了資料類型，也就是 type，我們可以直接根據 Schema 中的 type，來建立 model。

> GraphQL 小知識GraphQL 的運作是這樣的，Server Side 在開發時會定義各個領域物件，在 GraphQL 的標準中，這些領域物件稱之為「Type」，每種「Type」下面會涵蓋多個「Field」，「Field」的作用是作為「Type」的屬性。舉例來說，我們做一個直播系統，可能的 type 有「直播間」、「直播主」、「觀眾」，在 type 「直播間」之下則可能有「直播間名稱」、「直播人數」、「觀眾人數」、「該直播間的直播主」等等的 field

你可以建立像是下面這樣的 class 作為 model（或你想用 function 也可以，這不重要）

```js
class Streamer {
   constructor(data) {
     this.id = data.id;
     this.name = data.name;
     this.picture = data.picture;
     this.gender = data.gender;
   }

   get pictureURL() {
     if (!this.picture) return null;
     return `https://example.com/images/${this.picture}`;
   }

   get displayedGender() {
     return (
       {
         "0": "Male",
         "1": "Female"
       }[this.gender] || "Unknown"
     );
   }
}
```

就可以在 Container 中，套用該 Streamer 的 model 對資料進行擴充與轉換

```js
import Streamer from "./models/Streamer";

const streamerQuery = gql`
query queryStreamer($id: Int!) {
  stream(id: $id) {
    id
    name
    picture
    gender
  }
}
`;

const streamerContainer = graphql(streamerQuery, {
   options: props => ({ variables: { id: props.id } }),
   props: ({ data }) => {
     return {
       transformedData: {
         ...data,
         stream: new Streamer(data.streamer) // 轉一波
       }
     };
   }
});

export default streamerContainer;
```

乍看之下沒什麼問題，但是假如 query 的資料有好幾層，而 streamer 的資料在深處。

那要如何處理？

先設定一個情境，我們用一個 Query 去拉某「直播網站首頁」所需要的資料，首頁需要顯示排名靠前的「直播間（topLiveRooms）」，並顯示每間直播間的「直播主（Streamer）」資料，以及與該直播間相關的「推薦直播間（recommendedLiveRooms）」，「推薦的直播間」也須顯示「直播主」的資料。

該 Query 的會像下方這個樣子：

```
query homepageData {
   topLiveRooms {
     # type TopLiveRoomList
     count
     items {
       # type [LiveRoom]
       id
       name
       streamer {
         # type Streamer
         name
         picture
         gender
       }
       recommendedLiveRooms {
         # type RecommendedLiveRoomList
         items {
           # type [LiveRoom]
           name
           streamer {
             # type Streamer
             name
             picture
             gender
           }
         }
       }
     }
   }
}
```

我們用上方的 Query 去 GraphQL Server 拿資料，會得到如下方的 Response

```
const response = {
   topLiveTooms: {
     count: 23,
     items: [
       {
         id: 1,
         name: "天才的直播間",
         streamer: {
           id: "phyllis_genius",
           name: "Phyllis",
           picture: "<https://x.live/avatar/phyllis_genius.png>",
           gender: 1
         },
         recommendedLiveRooms: {
           items: [
             {
               name: "J 神的直播間",
               streamer: {
                 id: "jack_god",
                 name: "The Jack",
                 picture: "<https://x.live/avatar/jack_god.png>",
                 gender: 0
               }
             }
             // other items...
           ]
         }
       }
       // other items...
     ]
   }
};
```

如果我們需要在「直播主 Streamer」資料出現的時候，針對包含「直播主 Streamer」資料的 Object，套用我們寫好的 Streamer 模型進行轉換。

大概會寫出如下的程式碼：

```js
 import Streamer from '../models/Streamer'

 const transformedResponse = {
   ...response,
   topLiveRooms: {
     ...response.topLiveRooms,
     items: response.topLiveRooms.items.map(liveRoom => ({
       ...liveRoom,
       streamer: new Streamer(liveRoom.streamer),
       recommendedLiveRooms: {
         ...liveRoom.recommendedLiveRooms,
         items: liveRoom.recommendedLiveRooms.items.map(recommendedLiveRoom => ({
           ...recommendedLiveRoom,
           streamer: new Streamer(recommendedLiveRoom.streamer)
         }))
       }
     }))
   }
 };
```

恩.... 醜到炸裂。

就算選擇用 `lodash.merge` 或忽略 immutability 的方式，也是一樣醜，而且也一樣難寫。

```js
    import merge from "lodash/merge";
    import Streamer from "../models/Streamer";

    const transformedResponse = merge({}, response, {
      topLiveRooms: {
        items: response.topLiveRooms.items(liveRoom =>
          merge({}, liveRoom, {
            streamer: new Streamer(liveRoom.streamer),
            recommendedLiveRooms: {
              items: liveRoom.recommendedLiveRooms.items.map(recommendedLiveRoom =>
                merge({}, recommendedLiveRoom, {
                  streamer: new Streamer(recommendedLiveRoom.streamer)
                })
              )
            }
          })
        )
      }
    });
```

另一種實作的方式是針對每一個 Schema 裡的 Type 在前端都建立一個 model

像下方的程式去描述各個 type 之間的關係：

```js
import Streamer from "./models/Streamer";

class TopLiveRoomList {
   constructor(data) {
     Object.assign(this, data, {
       items: data || data.items.map(item => new LiveRoom(item))
     });
   }
}

class RecommendedLiveRoomList {
   constructor(data) {
     Object.assign(this, data, {
       items: data || data.items.map(item => new LiveRoom(item))
     });
   }
}

class LiveRoom {
   constructor(data) {
     Object.assign(this, data, {
       streamer: data.streamer || new Streamer(data.streamer),
       recommendedLiveRooms:
         data.recommendedLiveRooms ||
         new RecommendedLiveRoomList(data.recommendedLiveRooms)
     });
   }
}

const response = {
/**... 略 ...**/
};
const transformedResponse = {
   topLiveRooms: new TopLiveRoomList(response.topLiveRooms)
};
```

上述作法讓我們可以用非常簡單的方式，去轉換一個複雜 graphql 的 response。

不過缺點就是要寫很多的沒什麼用的中介 model，目的只是為了描述 type 之間的關係。

上述做法都有其缺點。

##（我覺得）正確的轉換方式

會如此複雜的根本的原因是，我們必須完整暸解整個結構的形狀，到達待轉換目標的路徑，途經節點是否為空值、物件還是陣列。這對我們開發是一種負擔。

事實上在轉換 Response 中特定 type 的 Object 時，我們根本不需要知道整體的結構。

GraphQL 提供了一系列的 *[Introspection](https://graphql.org/learn/introspection/)* 語法，作用是 client 端可以跟 server 請求 schema 的結構。其中一個語法是 `__typename` 。

當在 Query 裡寫入 `__typename`，Server 就會把該 type 名稱也一同回傳。

舉例來說：

Query:

```
    query homepageData {
      topLiveRooms {
        items {
          __typename
          streamer {
            __typename
          }
        }
        __typename
      }
    }
```

Response:

```js
const response = {
   topLiveRooms: {
     items: [
       {
         __typename: "LiveRoom",
         streamer: {
           __typename: "Streamer"
         }
       }
       // ...
     ],
     __typename: "TopLiveRoomList"
   }
};
```

程式完全有能力知道目前存取的 Object 屬於哪個 Type，是`TopLiveRoomList`, `LiveRoom` 還是 `Streamer`，也能夠實現依據 type 自動套用對應的 Model。

只要將整個 Response 樹遍歷，在存取各個節點時，去查找那個節點的 type 是不是有預先定義好的 model，如果有則使用 defineProperty 加上 getter，這樣就能把預先定義好的 model 套用上去，而且能夠適應各種不同的 response 結構，只需要定義 Model，然後就能享有轉換後的結果。

## 實作方式

我依照上方的概念，實作了一個 library [graphql-client-models](https://github.com/AnNOtis/graphql-client-models)

使用方式如下

```js
import { createTransform } from 'graphql-client-models'

const models = {
  Streamer: {
    pictureURL: self =>
      self.picture ? `https://example.com/images/${self.picture}` : '',
    displayedGender: self => {
      if (self.gender === 0) return "Male"
      if (self.gender === 1) return "Female"
      return "Unknown"
    }
  }
}
const transform = createTransform(models)

// somewhere in the ui layer
<Query query={topLiveRoomsQuery}>
  {({ data }) => {
    const result = transform(data)

    // 可以在這讀取到轉換過後的值
    result.topLiveRooms.items[0].streamer.displayedGender
    result.topLiveRooms.items[0].recommendedLiveRooms.items[0].streamer.displayedGender
  }}
</Query>
```

跟上方冗長的轉換方式比起來，是不是看起來簡潔多了呢？ 只要定義一次，就可以用在所有地方，而且還不用管 response 的結構！ 重點是轉換的邏輯能夠很輕易的被抽離出 UI 層，也很容易針對 model 做單元測試。

## 結語

在寫類型之間有很多關係的 GraphQL 專案時，要如何漂亮的處理 UI 衍生資料時，真的很令人頭疼，在勉勉強強掙扎時，偶然靈光一閃 GraphQL 有提供 __typename，不就可以知道整體的結構了嗎，我寫那麼多判斷式是在...

寫完這個 library 後，開發 GraphQL 整個輕鬆多了呢


