# 关于Golang你需要知道的50件事 - Part 1 入门

Go是一门简单有趣的语言, 不过和其他语言一样, 这门语言也有一些所谓的'坑'...大部分这些'坑'并不完全是Go的错, 有些'坑'是你从别的语言转换到Go时必然会遇到的陷阱, 而其他的则一般是因为你在写代码进行了错误的假设或者没有注意到细节.

如果你花了时间去学习这门语言的官方spec, wiki, mailing list讨论, 以及以及Rob Pike的一些非常好的文章和源码, 那么其实这些'坑'都是显而易见的. 不过不是每个人开始学习的道路都是一样的, 如果你是一个Go新手, 那么这里的内容将能大大减少你调试代码的时间.

这篇文章涵盖了Go 1.5及以下版本.

目录:

1. 左花括号不能另起一行
2. 未使用的变量
3. 未使用的引入
4. 短变量声明只能在函数内使用
5. 使用短变量声明重复声明变量
6. 不能使用短变量声明给字段赋值
7. 意外的变量覆盖
8. 不能在没确定类型的情况下使用nil初始变量
9. 使用nil Slice/Map
10. Map的容量
11. 字符串不能是nil
12. 数组类型的函数参数
13. Slice和Array使用range语句时的意外值
14. Slice和Array是一维的
15. 访问Map中不存在的key
16. 字符串是不可变的
17. 字符串和字节码Slice的转换
18. 字符串和索引操作符
19. 字符串并不总是UTF8编码
20. 字符串的长度
21. 使用多行Slice/Array/Map字面量缺少逗号
22. log.Fatal和log.Panic可以比log做的更多
23. 内置数据结构的操作并不是同步的
24. 字符串使用range语句时的迭代值
25. 使用for range语句来遍历一个Map
26. switch语句中的Fallthrough行为
27. 自增和自减
28. '否'位操作符
29. 运算符优先级
30. 未导出的字段不进行编码
31. 在还有活动的协程时退出程序
32. 发送到没有buffer的Channel的消息会在接收目标准备好的时候立刻被返回
33. 向已经关闭的Channel发送消息会导致Panic
34. 使用nil Channel
35. 带有消息接收方的方法并不能改变消息的初始值

---

### 左花括号不能另起一行

在大部分使用花括号的语言里你可以自由选择放置它们的位置, 但是Go不一样, 这是因为Go编译器的分号自动插入机制(JS也有类似的机制), 而Go语言编写的源码里是没有分号的

#### Fails:

    package main

    import "fmt"

    func main()  
    { //error, can't have the opening brace on a separate line
        fmt.Println("hello there!")
    }

#### Compile Error:

> /tmp/sandbox826898458/main.go:6: syntax error: unexpected semicolon or newline before {

#### Works:

    package main

    import "fmt"

    func main() {  
        fmt.Println("works!")
    }

---

### 未使用的变量

如果你在代码中存在没有使用的变量是会导致异常进而编译失败的, 你必须使用你在函数体内声明的变量, 但是如果一个变量是全局变量就不会有这样的问题, 同时未使用的函数参数也不会报错.

当然仅仅是给一个未使用变量赋值仍然是不够的, 必须要使用这个变量才能编译通过.

#### Fails:

    package main

    var gvar int //not an error

    func main() {  
        var one int   //error, unused variable
        two := 2      //error, unused variable
        var three int //error, even though it's assigned 3 on the next line
        three = 3

        func(unused string) {
            fmt.Println("Unused arg. No compile error")
        }("what?")
    }

#### Compile Errors:

> /tmp/sandbox473116179/main.go:6: one declared and not used /tmp/sandbox473116179/main.go:7: two declared and not used /tmp/sandbox473116179/main.go:8: three declared and not used

#### Works:

    package main

    import "fmt"

    func main() {  
        var one int
        _ = one

        two := 2 
        fmt.Println(two)

        var three int 
        three = 3
        one = three

        var four int
        four = four
    }

当然还有一个方案就是删除或注释掉未使用的变量.

---

### 未使用的引入

如果引入一个包但是又没有使用这个包导出的任意变量或者函数的话, 代码是会编译失败的.

如果你的确需要引入一个包又不实用它, 那么可以给它一个空的标志```_```以避免编译错误. 这个空标志用来导入一个包以获取它的副作用.

#### Fails:

    package main

    import (  
        "fmt"
        "log"
        "time"
    )

    func main() {  
    }

#### Compile Errors:

> /tmp/sandbox627475386/main.go:4: imported and not used: "fmt" /tmp/sandbox627475386/main.go:5: imported and not used: "log" /tmp/sandbox627475386/main.go:6: imported and not used: "time"

#### Works:

    package main

    import (  
        _ "fmt"
        "log"
        "time"
    )

    var _ = log.Println

    func main() {  
        _ = time.Now
    }

当然还有一个方案就是删除或注释掉未使用的引入, [goimports](https://github.com/bradfitz/goimports)这个包就是帮你完成这个任务的.

---

### 短变量声明只能在函数内使用

#### Fails:

    package main

    myvar := 1 //error

    func main() {  
    }

#### Compile Error:

> /tmp/sandbox265716165/main.go:3: non-declaration statement outside function body

#### Works:

    package main

    var myvar = 1

    func main() {  
    }

---

### 使用短变量声明重复声明变量

你不能在一个代码块里重复声明变量, 但是可以在```:=```左侧至少有一个新变量的情况下使用短变量声明重复声明一个已有变量.

The redeclared variable has to be in the same block or you'll end up with a shadowed variable.
重复声明变量必须是在同一个代码块里或者

#### Fails:

    package main

    func main() {  
        one := 0
        one := 1 //error
    }

#### Compile Error:

> /tmp/sandbox706333626/main.go:5: no new variables on left side of :=

#### Works:

    package main

    func main() {  
        one := 0
        one, two := 1,2

        one,two = two,one
    }

---

### 不能使用短变量声明给字段赋值

#### Fails:

    package main

    import (  
        "fmt"
    )

    type info struct {  
        result int
    }

    func work() (int,error) {  
        return 13,nil  
    }

    func main() {  
        var data info

        data.result, err := work() //error
        fmt.Printf("info: %+v\n",data)
    }

#### Compile Error:

> prog.go:18: non-name data.result on left side of := 

就算有ticket去指出这个'坑'这个应该也不会变因为Rob Pike喜欢 :-)

你可以使用临时变量或者预先声明需要的变量然后使用标准赋值操作符.

#### Works:

    package main

    import (  
        "fmt"
    )

    type info struct {  
        result int
    }

    func work() (int,error) {  
        return 13,nil  
    }

    func main() {  
    var data info

    var err error
    data.result, err = work() //ok
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Printf("info: %+v\n",data) //prints: info: {result:13}
    }

#### 意外的变量覆盖

The short variable declaration syntax is so convenient (especially for those coming from a dynamic language) that it's easy to treat it like a regular assignment operation. If you make this mistake in a new code block there will be no compiler error, but your app will not do what you expect.
短变量声明是如此方便(特别是对于从动态类型语言转过来的人)以至于容易让人以为这是赋值语句, 如果你在一个新的语句块里烦了这种错误, 代码不一定会编译出错但是无法以预期的方式运行.

    package main

    import "fmt"

    func main() {  
        x := 1
        fmt.Println(x)     //prints 1
        {
            fmt.Println(x) //prints 1
            x := 2
            fmt.Println(x) //prints 2
        }
        fmt.Println(x)     //prints 1 (bad if you need 2)
    }

即使对一个经验丰富的Go开发者来说这也是一个常见的陷阱, 你可以使用vet命令找出代码中的这些问题, 但是vet默认没有执行任何被覆盖变量检测, 请确保带上了`-shadow`的flag:

    go tool vet -shadow your_file.go

注意vet命令并不会报告出所有的被覆盖变量, 使用[go-nyet](https://github.com/barakmich/go-nyet)以获得更强的被覆盖变量检测.

---

### 不能在没确定类型的情况下使用nil初始变量

nil标志可以作为interface, 函数, 指针, map, slice以及channel这些类型的零值, 如果你没有声明变量的类型, 那么编译会报错因为编译器不知道变量是否满足类型要求.

#### Fails:

    package main

    func main() {  
        var x = nil //error

        _ = x
    }

#### Compile Error:

> /tmp/sandbox188239583/main.go:4: use of untyped nil

#### Works:

    package main

    func main() {  
        var x interface{} = nil

        _ = x
    }

---

### 使用nil slice/map

向nil slice中添加项目是没问题的, 但是对map进行同样的操作会导致运行时panic.

#### Works:

    package main

    func main() {  
        var s []int
        s = append(s,1)
    }

#### Fails:

    package main

    func main() {  
        var m map[string]int
        m["one"] = 1 //error

    }

---

### map的容量

你可以在创建map的时候确定气容量, 但是你并不能对一个map使用```cap()```函数.

#### Fails:

    package main

    func main() {  
        m := make(map[string]int,99)
        cap(m) //error
    }

#### Compile Error:

> /tmp/sandbox326543983/main.go:5: invalid argument m (type map[string]int) for cap

---

### 字符串不能是nil

这对那些曾经把nil赋给字符串变量的程序员来说是一个'坑'.

#### Fails:

    package main

    func main() {  
        var x string = nil //error

        if x == nil { //error
            x = "default"
        }
    }

#### Compile Errors:

> /tmp/sandbox630560459/main.go:4: cannot use nil as type string in assignment /tmp/sandbox630560459/main.go:6: invalid operation: x == nil (mismatched types string and nil)

#### Works:

    package main

    func main() {  
        var x string //defaults to "" (zero value)

        if x == "" {
            x = "default"
        }
    }

---

### 数组类型的函数参数

如果你是一个C/C++程序员, 那么对你来说数组其实是指针, 将数组作为参数传递其实是同一块内存的引用, 所以函数里对参数的操作也会影响外面的原始值. 但是数组在Go里是```置类型```的, 所以将数组作为参数传递的时候会复制一份这个数组的内容.

    package main

    import "fmt"

    func main() {  
        x := [3]int{1,2,3}

        func(arr [3]int) {
            arr[0] = 7
            fmt.Println(arr) //prints [7 2 3]
        }(x)

        fmt.Println(x) //prints [1 2 3] (not ok if you need [7 2 3])
    }

如果你需要改变原始数组里的数据, 那么在传参的时候请使用数组指针.

    package main

    import "fmt"

    func main() {  
        x := [3]int{1,2,3}

        func(arr *[3]int) {
            (*arr)[0] = 7
            fmt.Println(arr) //prints &[7 2 3]
        }(&x)

        fmt.Println(x) //prints [7 2 3]
    }

另一个方案就是使用Slice, Slice作为参数传递的时候是传引用的.

    package main

    import "fmt"

    func main() {  
        x := []int{1,2,3}

        func(arr []int) {
            arr[0] = 7
            fmt.Println(arr) //prints [7 2 3]
        }(x)

        fmt.Println(x) //prints [7 2 3]
    }

---

### Slice和Array使用range语句时的意外值

这种情况会发生在你在其他语言中使用```for-in```或者```foreach```语句的时候, 而Go语言中的range语句是与众不同的: 它的第一个返回值是项目的索引, 第二个返回值是具体值.

#### Bad:

    package main

    import "fmt"

    func main() {  
        x := []string{"a","b","c"}

        for v := range x {
            fmt.Println(v) //prints 0, 1, 2
        }
    }

#### Good:

    package main

    import "fmt"

    func main() {  
        x := []string{"a","b","c"}

        for _, v := range x {
            fmt.Println(v) //prints a, b, c
        }
    }

---

### Slice和Array是一维的

可能看上去Go支持多维的数组和Slice, 但是其实它并不支持, 创建数组的数组或者Slice的Slice是不可能的. 对于数值计算的应用而言, 依赖动态多维数组无论是在性能还是复杂度上都是不够理想的.

You can build dynamic multi-dimensional arrays using raw one-dimensional arrays, slices of "independent" slices, and slices of "shared data" slices.
你可以通过这些方式来创建一个动态多维数组: 1. 

If you are using raw one-dimensional arrays you are responsible for indexing, bounds checking, and memory reallocations when the arrays need to grow.

Creating a dynamic multi-dimensional array using slices of "independent" slices is a two step process. First, you have to create the outer slice. Then, you have to allocate each inner slice. The inner slices are independent of each other. You can grow and shrink them without affecting other inner slices.

package main

func main() {  
    x := 2
    y := 4

    table := make([][]int,x)
    for i:= range table {
        table[i] = make([]int,y)
    }
}
Creating a dynamic multi-dimensional array using slices of "shared data" slices is a three step process. First, you have to create the data "container" slice that will hold raw data. Then, you create the outer slice. Finally, you initialize each inner slice by reslicing the raw data slice.

package main

import "fmt"

func main() {  
    h, w := 2, 4

    raw := make([]int,h*w)
    for i := range raw {
        raw[i] = i
    }
    fmt.Println(raw,&raw[4])
    //prints: [0 1 2 3 4 5 6 7] <ptr_addr_x>

    table := make([][]int,h)
    for i:= range table {
        table[i] = raw[i*w:i*w + w]
    }

    fmt.Println(table,&table[1][0])
    //prints: [[0 1 2 3] [4 5 6 7]] <ptr_addr_x>
}
There's a spec/proposal for multi-dimensional arrays and slices, but it looks like it's a low priority feature at this point in time.

---

### 访问Map中不存在的key

大部分程序员都会认为这个操作会像很多其他语言一样返回一个```nil```, 其实这个操作返回的是map中那个数据类型的```零值```, 当然, 如果零值就是nil的话的确是返回nil, 而其他类型则不一定了. 最可靠的方式是通过判断Map取值操作的第二个返回值.

#### Bad:

    package main

    import "fmt"

    func main() {  
        x := map[string]string{"one":"a","two":"","three":"c"}

        if v := x["two"]; v == "" { //incorrect
            fmt.Println("no entry")
        }
    }

#### Good:

    package main

    import "fmt"

    func main() {  
        x := map[string]string{"one":"a","two":"","three":"c"}

        if _,ok := x["two"]; !ok {
            fmt.Println("no entry")
        }
    }

---

### 字符串是不可变的

Trying to update an individual character in a string variable using the index operator will result in a failure. Strings are read-only byte slices (with a few extra properties). If you do need to update a string then use a byte slice instead converting it to a string type when necessary.


Fails:

package main

import "fmt"

func main() {  
    x := "text"
    x[0] = 'T'

    fmt.Println(x)
}
Compile Error:

/tmp/sandbox305565531/main.go:7: cannot assign to x[0]

Works:

package main

import "fmt"

func main() {  
    x := "text"
    xbytes := []byte(x)
    xbytes[0] = 'T'

    fmt.Println(string(xbytes)) //prints Text
}
Note that this isn't really the right way to update characters in a text string because a given character could be stored in multiple bytes. If you do need to make updates to a text string convert it to a rune sclice first. Even with rune slices a single character might span multiple runes, which can happen if you have characters with grave accent, for example. This complicated and ambiguous nature of "characters" is the reason why Go strings are represented as byte sequences.

---

### 字符串和字节码Slice的转换

当你把一个字符串转换成字节码Slice或者反过来时, 你会得到一份原始数据的拷贝, 这个不同于别的语言里的转换操作, 也不是基于同样的底层原始数据产生新的Slice和数组.

Go已经对字符串和字节码Slice互转提供了一些优化操作以避免额外的内存分配.

The first optimization avoids extra allocations when []byte keys are used to lookup entries in map[string] collections: m[string(key)].

The second optimization avoids extra allocations in for range clauses where strings are converted to []byte: for i,v := range []byte(str) {...}.

---

### 字符串和索引操作

给一个字符串使用索引取值得到的是一个字节值, 而不是像很多别的语言那样得到一个字符.

    package main

    import "fmt"

    func main() {  
        x := "text"
        fmt.Println(x[0]) //print 116
        fmt.Printf("%T",x[0]) //prints uint8
    }

如果你需要访问字符串中的特殊字符(比如Unicode符号), 可以使用for range语句, 官方的```unicode/utf8```以及```utf8string(golang.org/x/exp/utf8string)```包都是非常有用的, utf8string这个包甚至包含一个非常方便的```At()```方法, 当然另一个方案就是把字符串转换成字符Slice.

---

### 字符串并不总是UTF8编码

字符串的值并不是必须得是UTF8文本, 它们可以包含任意的字节, 唯一可以确定字符串是UTF8编码就是当时用字符串字面量的时候, 当然即使这样字符串里也可以通过escape的方式包含别的编码的文本.

可以通过```unicode/utf8```的```ValidString()```方法来判断一个字符串是否是UTF8格式的文本.

    package main

    import (  
        "fmt"
        "unicode/utf8"
    )

    func main() {  
        data1 := "ABC"
        fmt.Println(utf8.ValidString(data1)) //prints: true

        data2 := "A\xfeC"
        fmt.Println(utf8.ValidString(data2)) //prints: false
    }

---

### 字符串的长度

假设你是一个Python程序员, 那么你肯定会写下面这样一段代码:

    data = u'♥'  
    print(len(data)) #prints: 1  

当你把它转换成Go代码的时候结果可能让你惊讶:

    package main

    import "fmt"

    func main() {  
        data := "♥"
        fmt.Println(len(data)) //prints: 3
    }

内建的```len()```函数返回的是一个字符串里的字节数, 而不是像别的语言处理Unicode字符串一样返回的字符数量.

如果需要打到这样的效果请使用```unicode/utf8```包里的```RuneCountInString()```函数.

    package main

    import (  
        "fmt"
        "unicode/utf8"
    )

    func main() {  
        data := "♥"
        fmt.Println(utf8.RuneCountInString(data)) //prints: 1
    }

当然从技术层面来讲```RuneCountInString()```函数返回的并不是字符的数量因为一个字符可能跨越多个符号.

    package main

    import (  
        "fmt"
        "unicode/utf8"
    )

    func main() {  
        data := "é"
        fmt.Println(len(data))                    //prints: 3
        fmt.Println(utf8.RuneCountInString(data)) //prints: 2
    }

---

### 使用多行Slice/Array/Map字面量缺少逗号

#### Fails:

    package main

    func main() {  
        x := []int{
        1,
        2 //error
        }
        _ = x
    }

#### Compile Errors:

> /tmp/sandbox367520156/main.go:6: syntax error: need trailing comma before newline in composite literal /tmp/sandbox367520156/main.go:8: non-declaration statement outside function body /tmp/sandbox367520156/main.go:9: syntax error: unexpected }

#### Works:

    package main

    func main() {  
        x := []int{
        1,
        2,
        }
        x = x

        y := []int{3,4,} //no error
        y = y
    }

这里注意到, 使用多行声明时, 最后一个元素也要带上逗号, 当然, 使用单行声明时这个逗号是可以省略的.

---

### log.Fatal和log.Panic可以比log做的更多

Logging库通常会提供各个级别的log. 和其他logging库不一样的是, 调用内建```log```的```Fatal*()```和```Panic*()```方法不仅会打印log, 而且会导致程序直接被终止.

    package main

    import "log"

    func main() {  
        log.Fatalln("Fatal Level: log entry") //app exits here
        log.Println("Normal Level: log entry")
    }

---

### 内置数据结构的操作并不是同步的

虽然Go已经有很多内建功能来原生地支持并发, 但是却并没有一个并发安全的数据结构. 所以你需要确保数据的改动是原子性的, 推荐使用Goroutine和Channel来实现原子操作, 当然你也可以使用```sync```包如果它的确对你的应用有所裨益.

---

### 字符串使用range语句时的迭代值

索引值是第二个返回值中字符第一个字节的索引, 这并不是这个字符在字符串中的位置, 注意一个实际的字符可能又多个UTF8 rune组成, 当然如果你真的需要操作字符, 那么可以使用```norm(golang.org/x/text/unicode/norm)```包.

对字符串使用```for range```会尝试将字符串解释成UTF8文本, 这时所有无法被理解的内容会被转换成0xfffd rune(也就是Unicode replacement characters)而不是实际的值, 如果你有任意类型的数据存储在字符串变量里, 可以事先将其转换成字节Slice以获得真正被存储的值.

    package main

    import "fmt"

    func main() {  
        data := "A\xfe\x02\xff\x04"
        for _,v := range data {
            fmt.Printf("%#x ",v)
        }
        //prints: 0x41 0xfffd 0x2 0xfffd 0x4 (not ok)

        fmt.Println()
        for _,v := range []byte(data) {
            fmt.Printf("%#x ",v)
        }
        //prints: 0x41 0xfe 0x2 0xff 0x4 (good)
    }

---

### 使用for range语句来遍历一个Map

简单的说, 使用```for range```语句来遍历一个Map, 重新编译之后顺序是不确定的.

    package main

    import "fmt"

    func main() {  
        m := map[string]int{"one":1,"two":2,"three":3,"four":4}
        for k,v := range m {
            fmt.Println(k,v)
        }
    }

不过如果你使用[Go Playground](https://play.golang.org/), 你一般都会得到相同的结果, 因为除非有所改动, 不然你的代码并不会被重新编译.

---

### switch语句中的Fallthrough行为

```switch```语句中的```case```会默认执行完结束, 而不像其他一些语言会执行到下一个case条件.

    package main

    import "fmt"

    func main() {  
        isSpace := func(ch byte) bool {
            switch(ch) {
            case ' ': //error
            case '\t':
                return true
            }
            return false
        }

        fmt.Println(isSpace('\t')) //prints true (ok)
        fmt.Println(isSpace(' '))  //prints false (not ok)
    }

当然你可以在```case```中最后使用```fallthrough```语句来实现Fallthrough操作, 或者将若干条件写在一个case里以获得类似的效果. 

    package main

    import "fmt"

    func main() {  
        isSpace := func(ch byte) bool {
            switch(ch) {
            case ' ', '\t':
                return true
            }
            return false
        }

        fmt.Println(isSpace('\t')) //prints true (ok)
        fmt.Println(isSpace(' '))  //prints true (ok)
    }

---

### 自增和自减

很多语言都有自增自减操作符, 但是和别的语言不同的是, Go并没有操作符前置的版本, 而且不能把这两个操作符混用在别的语句中.

#### Fails:

    package main

    import "fmt"

    func main() {  
        data := []int{1,2,3}
        i := 0
        ++i //error
        fmt.Println(data[i++]) //error
    }

#### Compile Errors:

> /tmp/sandbox101231828/main.go:8: syntax error: unexpected ++ /tmp/sandbox101231828/main.go:9: syntax error: unexpected ++, expecting :

#### Works:

    package main

    import "fmt"

    func main() {  
        data := []int{1,2,3}
        i := 0
        i++
        fmt.Println(data[i])
    }

---

### '否'位操作

Many languages use ~ as the unary NOT operator (aka bitwise complement), but Go reuses the XOR operator (^) for that.

Fails:

package main

import "fmt"

func main() {  
    fmt.Println(~2) //error
}
Compile Error:

/tmp/sandbox965529189/main.go:6: the bitwise complement operator is ^

Works:

package main

import "fmt"

func main() {  
    var d uint8 = 2
    fmt.Printf("%08b\n",^d)
}
Go still uses ^ as the XOR operator, which may be confusing for some people.

If you want you can represent a unary NOT operation (e.g, NOT 0x02) with a binary XOR operation (e.g., 0x02 XOR 0xff). This could explain why ^ is reused to represent unary NOT operations.

Go also has a special 'AND NOT' bitwise operator (&^), which adds to the NOT operator confusion. It looks like a special feature/hack to support A AND (NOT B) without requiring parentheses.

package main

import "fmt"

func main() {  
    var a uint8 = 0x82
    var b uint8 = 0x02
    fmt.Printf("%08b [A]\n",a)
    fmt.Printf("%08b [B]\n",b)

    fmt.Printf("%08b (NOT B)\n",^b)
    fmt.Printf("%08b ^ %08b = %08b [B XOR 0xff]\n",b,0xff,b ^ 0xff)

    fmt.Printf("%08b ^ %08b = %08b [A XOR B]\n",a,b,a ^ b)
    fmt.Printf("%08b & %08b = %08b [A AND B]\n",a,b,a & b)
    fmt.Printf("%08b &^%08b = %08b [A 'AND NOT' B]\n",a,b,a &^ b)
    fmt.Printf("%08b&(^%08b)= %08b [A AND (NOT B)]\n",a,b,a & (^b))
}
Operator Precedence Differences

level: beginner
Aside from the "bit clear" operators (&^) Go has a set of standard operators shared by many other languages. The operator precedence is not always the same though.

package main

import "fmt"

func main() {  
    fmt.Printf("0x2 & 0x2 + 0x4 -> %#x\n",0x2 & 0x2 + 0x4)
    //prints: 0x2 & 0x2 + 0x4 -> 0x6
    //Go:    (0x2 & 0x2) + 0x4
    //C++:    0x2 & (0x2 + 0x4) -> 0x2

    fmt.Printf("0x2 + 0x2 << 0x1 -> %#x\n",0x2 + 0x2 << 0x1)
    //prints: 0x2 + 0x2 << 0x1 -> 0x6
    //Go:     0x2 + (0x2 << 0x1)
    //C++:   (0x2 + 0x2) << 0x1 -> 0x8

    fmt.Printf("0xf | 0x2 ^ 0x2 -> %#x\n",0xf | 0x2 ^ 0x2)
    //prints: 0xf | 0x2 ^ 0x2 -> 0xd
    //Go:    (0xf | 0x2) ^ 0x2
    //C++:    0xf | (0x2 ^ 0x2) -> 0xf
}
