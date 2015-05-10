# block

## 什麼是 block?

- 用 `{}` 或是 `do ... end` 定義一個 block

- 只能在方法執行時被定義

- 該方法能夠用 yield 呼叫 block

- 會回傳最後一行的結果，不需要寫 return

- 可以用 `block_given?` 確認是否有 block 傳入方法

``` ruby
def a_method
  return yield if block_given?
  'no block!'
end

a_method                       # => "no block!"
a_method { "here's a block!" } # => "here's a block!"
```

- 當你定義一個 block 的時候，他會抓取目前scope的綁定

## Scope

全域變數

top-level 實體變數


