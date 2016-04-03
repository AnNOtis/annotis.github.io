---
layout: post
title: Hello Rack
date: 2014-10-10 10:59 UTC
tags:
  - Ruby
---

從[官網](http://rack.github.io/)的介紹中提到:

> Rack provides a minimal interface between webservers supporting Ruby and Ruby frameworks.

在開發 Ruby web framewrok 時有許多前置工作，必須對所支援的 web server 撰寫介面，然後 parse http protocol，假如多支援一套 web server 這些工作又要再做一次，Rack 幫我們解決了重複性的工作，Rack 支援不同的 server，將 http request 與 response 包裝後，成為統一的API標準，不管 web server 是 WEBrick 、 Mongrel 或是 Unicorn ，web framework 都只需要對 Rack 溝通就行了，就像是如果要馬上精通各國語言(web server)，吃個翻譯蒟蒻就萬事OK，Rack就是翻譯蒟蒻!!!

<!--more-->

[Rack支援的server列表](https://github.com/rack/rack)

## 第一個Rack application
使用 Rack 很容易就可以完成一個簡單的 web application，官方的文件中寫到：

> The Rack application is an object that responds to the call method, taking the environment hash as a parameter, and returning an Array with three elements: status, headers and a body

舉例來說，這就是一個簡單的 Rack application

{% highlight ruby %}
require "rack" # Core Ruby Lib doesn't include Rack

class HelloRack
  def call(env)
    [200, {"Content-Type" => "text/plain"}, ["Hello Rack!"]]
  end
end

Rack::Handler::WEBrick.run HelloRack.new
{% endhighlight %}

但我們要讓它動起來～ 必須使用 `Rack::Handler`，這是 Rack 連接 Web Server 的介面，讓我們可以把程式跑在 Server 上，Handler 可以連接不同的Http Server，如 Thin, WEBrick, FastCGI... ([Handler列表][RackHandler])，在這邊使用 `Webrick` 啟動 server

執行 `ruby hello_rack.rb`，開啟瀏覽器 `http://localhost:8080`，會看到以下畫面：

![HelloRack][1]

## Response

實際上畫面的回應是來自於 `call` 這個方法的回傳值，回傳值在Rack的spec定義必須是一個 `Array` :

{% highlight ruby %}
[ Status Code, Http Header, Response body ]
{% endhighlight %}

- **Status code**: 可以指定200, 400, 302等
- **Http headers**: http的標頭，型態需為hash，hash的內容至少要指定content-type，例：{"Content-Type" => "text/html"}
- **Response body**: 回傳的內容，此物件必須能夠回應each這個方法，使用array就可以了，如果他有多個Response body則會由第一個元素開始輸出。

所以如果 call 回傳的是像這樣的內容：

{% highlight ruby %}
[ 200, {"Content-Type" => "text/plain"}, ["Hello Rack!"] ]
{% endhighlight %}

打開 chrome console 來看：
![Rack Response][2]

就是這樣囉～

## Request
可以看到 `call(env)` 這個方法傳入唯一的參數 `env`，但在上一段的程式完全沒有用到參數 `env`，實際上參數 `env` 就是 environment 的資訊，那environment 的資訊包含哪些呢？利用上一節的 response，我們可以把 environment 打開來看看裡頭有什麼。

{% highlight ruby %}
require "rack"

class RackApp
  def call(env)
    [200, {"Content-Type" => "text/plain"}, [env.inspect]]
  end
end

Rack::Handler::WEBrick.run RackApp.new
{% endhighlight %}
執行結果：
![Rack Environment 1][3]

雖然結果顯示的有點擁擠，但依稀可以看到 `"PATH_INFO"=>"/"`、`"QUERY_STRING"=>""`、`"REQUEST_METHOD"=>"GET"`，沒錯，我們可以從environment拿到request的資訊，這就可以發揮想像做很多事啦，比如說簡單的做一個router讓不同的request顯示不同的內容。
完整的environment的資訊可以參考[spec](http://rubydoc.info/github/rack/rack/master/file/SPEC)。

## Excercise

作為練習，要來做一個稍微有點功能的應用程式啦，需求是這樣的，我可以下 `http://locahost:8080/request_method`，去查詢該 `environemtn` 的參數，如果沒有子路徑的話，就回傳所有參數，回傳的參數必須要用 `html` 的 `table` 顯示（比較好看 :D），無此參數就回傳“查無結果”。

### STEP
1. 寫一個 `convert_hash_to_table` 的方法
2. 將 `"Content-Type" => "text/plain"` 改為 `text/html`
3. 找到路徑 `env['REQUEST_PATH']`
4. 判斷是否有此 environment 參數
5. 輸出結果

{% highlight ruby %}
require 'rack'
class RackApp
  def call(env)
    query = env['REQUEST_PATH'].delete '/'
    query_result = env[query]

    if query_result.nil? && !query.empty?
      output = "查無結果"
    else
      output = query.empty? ? env : env.select{|k, v| k == query}
      output = convert_hash_to_table(output)
    end

    [200, {"Content-Type" => "text/html"}, [output] ]
  end

  def convert_hash_to_table(hash)
    result = "<table border='1'>"
    hash.each do |key, value|
      result +=
      """
        <tr>
          <td>#{key}</td>
          <td>#{value}</td>
        </tr>
      """
    end
    result += "</table>"
  end
end
Rack::Handler::WEBrick.run RackApp.new

# ruby rack_app.rb
{% endhighlight %}

## 後續發展

基本的rack就是這樣啦，下個相關的研究議題 **什麼是Rack Middleware?**、**Rails中的Rack Middleware**，改天介紹。


## 參考資料
- [Rack官網](http://rack.github.io/)
- [RailsCast 151-Rack-middleware](http://asciicasts.com/episodes/151-rack-middleware)
- [Rack app with uri and HTTP specific responses](https://github.com/rack/rack/wiki/Rack-app-with-uri-and-HTTP-specific-responses)
- [A quick introduction to Rack](http://rubylearning.com/blog/a-quick-introduction-to-rack/)
- [hello-rack](http://m.onkey.org/ruby-on-rack-1-hello-rack)

[RackHandler]: https://github.com/rack/rack/tree/master/lib/rack/handler

[1]: /images/hello-rack/1.png
[2]: /images/hello-rack/2.png
[3]: /images/hello-rack/3.png
