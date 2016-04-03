---
layout: post
title: 在 Ruby on Rails 中使用 Markdown
date: 2014-10-23 12:30 UTC
tags:
  - Ruby
  - Ruby on Rails
---

Markdown 是一種純文字的語法，目的是以純文字的方式便能夠產生出易讀的文件，Markdown 的語法有多種表達方式，像是使用兩顆 `*` 代表強調（eg. \*強調\*)，使用兩個 `反引號` 包起來的區塊代表行內程式碼（eg. \`Here is code\`），用代表性的符號取代使用編輯器產生樣式，這樣就可以脫離對編輯器的依賴，在任何平台上都可以通用喔。

<!--more-->

對我來說最實用的是 Markdown 可以不需要使用任何滑鼠編輯文件，雙手一秒鐘都不需要離開鍵盤是工程師追尋的終極 workflow 啊，可能也是這個緣故所以許多技術文件都以 Markdown 撰寫。另一個實用的點是 Markdown 可以直接轉換成 HTML，本篇部落格也是以 Markdown 撰寫然後轉換成 HTML。

## Markdown Parser
既然 Markdown 這麼實用，在開發編輯文本功能的時候當然常常會遇到要使用 Markdown 需求啦，在 Ruby 中有多個 Gem 可以作為 Markdown Parser，本篇文章選擇 [Redcarpet](https://github.com/vmg/redcarpet) 使用，原因是因為他有較多的可選參數，而且不僅僅可選擇禁用或啟用 Markdown 語法，對輸出的 HTML 也有提供過濾選項，另一個原因是 [Redcarpet是由GitHub開發的Markdown parser][1]，品質是掛保證的啦！

其他選擇可以參考 [RDiscount][2] 或是 [BlueCloth][3]

## 在 Rails 中使用 Markdown
在 `Gemfile` 中加入：

~~~ruby
gem 'redcarpet'
~~~

執行 `bundle install` 安裝 Redcarpet

在 `application_helper.rb` 中寫入以下程式碼：

~~~ruby
def to_markdown(text)
    html_render_options = {
      filter_html:     true, # no input tag or textarea
      hard_wrap:       true,
      link_attributes: { rel: 'nofollow' }
    }

    markdown_options = {
      autolink:           true,
      fenced_code_blocks: true,
      lax_spacing:        true,
      no_intra_emphasis:  true,
      strikethrough:      true,
      superscript:        true
    }

    renderer = Redcarpet::Render::HTML.new(html_render_options)
    markdown = Redcarpet::Markdown.new(renderer, markdown_options)
    raw markdown.render(text)
  end
~~~

這個 helper 的目的是將文字轉換為 Markdown，比較值得注意的是，Markdown 的參數中，`autolink` 會將所有網址格式的文字自動轉換成超連結，`fenced_code_blocks` 則是比較厲害的code_block 可以在 \~\~\~ 後標明語言，用於 syntax highlighting，也可以強調特定行數的程式碼，詳情請見 [fenced_code_blocks][4]。

另外輸出html的選項，`filter_html` 代表不會輸出任何 `<input>` tag，`link_attributes: { rel: 'nofollow' }` 則是會在所有 `<a>` tag加上 `rel="nofollow"`，在做論壇或部落格平台，當無法有效控管使用者輸入的內容時，可以避免垃圾連結影像網站的 seo。

使用的話只要這樣就行了:

~~~erb
<%= to_markdown(some_markdown_content) %>
~~~

## 程式碼上色 Syntax Highlighting ( rouge )

rouge 是一個用 ruby 寫成的 syntax highlighter，內建 mixin 可以與 Redcarpet 搭配使用，方法如下

在 `gemfile` 加入：

~~~ruby
gem 'rouge'
~~~

執行 `bundle install` 安裝 rouge

在 `config/initializers/rouge.rb` 加入：

~~~ruby
require 'rouge/plugins/redcarpet'

class Html < Redcarpet::Render::HTML
  include Rouge::Plugins::Redcarpet
end
~~~

上面的程式碼會提供一個的擁有的 syntax highlighting 功能的 html renderer，再將我們一開始在 `application_helper.rb` 中所使用的 renderer 替換成新的。

將這行

~~~ruby
renderer = Redcarpet::Render::HTML.new(render_options)
~~~

改成

~~~ruby
renderer = Html.new(render_options)
~~~

這樣 code block 就會轉換為 syntax highlighting 的格式，但目前程式碼還沒有任何上色，必須要加入 syntax 的 CSS

~~~erb
<%= Rouge::Theme.find('base16.light').render(scope: '.highlight') %>
~~~

上面的程式碼會產生 syntax 的 css，必須將他放置在結尾為 `.erb` 的 css 檔案中，如 `code.css.erb`，然後在 `assets_pipeline` 中 require 進來就可以了，另外 rouge 有多種 theme 可以選擇，colorful、github、monokai、monokai.sublime、thankful_eyes、base16、base16.dark、base16.light、base16.solarized、base16.monokai，挑一個自己喜歡的吧。

## 參考資料

- [Markdown.tw](http://markdown.tw/)
- [Redcarpet's GitHub](https://github.com/vmg/redcarpet)
- [Rolling out the Redcarpet](https://github.com/blog/832-rolling-out-the-redcarpet)
- [Rouge's GitHub](https://github.com/jneen/rouge)

[1]: https://github.com/blog/832-rolling-out-the-redcarpet
[2]: https://github.com/davidfstr/rdiscount
[3]: https://github.com/ged/bluecloth
[4]: https://pythonhosted.org/Markdown/extensions/fenced_code_blocks.html
