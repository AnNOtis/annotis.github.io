# The & Operator in Ruby

## 二元運算子

例：  `x & x`

### Bitwise

http://calleerlandsson.com/2014/02/06/rubys-bitwise-operators/
```
101 & 111 = 101
```

```
56 & 54 = 48
```

### 交集

用在 `Array`

``` ruby
[1, 3, 5] & [2, 3, 4] #=> [3]
```

### Boolean 運算

與 `&&` 的行為不會一樣， `&` 只定義在 FalseClass, NilClass 與 TrueClass

``` ruby
false & true #=> false
nil & true #=> false
true & Object.new #=> true
Object.new & true
#=>NoMethodError: undefined method `&' for #<Object:0x007f9e7ac96420>
```

### Custom

## 一元運算子

例：  `&x`









## 參考資料

- [The & Operator in Ruby](http://ablogaboutcode.com/2012/01/04/the-ampersand-operator-in-ruby/)