关于Golang你需要知道的50件事 - Part 1 入门

### Source
- [50 Shades of Go: Traps, Gotchas, and Common Mistakes for New Golang Devs](http://devs.cloudimmunity.com/gotchas-and-common-mistakes-in-go-golang/)

---

目录:

1. [关闭HTTP响应体](#case1)

---

<a id="case1" name="case1"/>
### 关闭HTTP响应体

当你使用标准HTTP库发送请求的时候, 你将会获得一个HTTP响应变量, 即使你不需要从响应体中读取内容了你也应该关闭它, 注意, 对于空的响应也需要这么做, 新手总是很容易忘记这一点.

有些Go开发者认识到了这一点, 却在错误的地方关闭了响应体:

    package main

    import (  
        "fmt"
        "net/http"
        "io/ioutil"
    )

    func main() {  
        resp, err := http.Get("https://api.ipify.org?format=json")
        defer resp.Body.Close()//not ok
        if err != nil {
            fmt.Println(err)
            return
        }

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            fmt.Println(err)
            return
        }

        fmt.Println(string(body))
    }

This code works for successful requests, but if the http request fails the resp variable might be nil, which will cause a runtime panic.

The most common why to close the response body is by using a defer call after the http response error check.

package main

import (  
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {  
    resp, err := http.Get("https://api.ipify.org?format=json")
    if err != nil {
        fmt.Println(err)
        return
    }

    defer resp.Body.Close()//ok, most of the time :-)
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println(string(body))
}
Most of the time when your http request fails the resp variable will be nil and the err variable will be non-nil. However, when you get a redirection failure both variables will be non-nil. This means you can still end up with a leak.

You can fix this leak by adding a call to close non-nil response bodies in the http response error handling block. Another option is to use one defer call to close response bodies for all failed and successful requests.

package main

import (  
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {  
    resp, err := http.Get("https://api.ipify.org?format=json")
    if resp != nil {
        defer resp.Body.Close()
    }

    if err != nil {
        fmt.Println(err)
        return
    }

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println(string(body))
}
The orignal implementation for resp.Body.Close() also reads and discards the remaining response body data. This ensured that the http connection could be reused for another request if the keepalive http connection behavior is enabled. The latest http client behavior is different. Now it's your responsibility to read and discard the remaining response data. If you don't do it the http connection might be closed instead of being reused. This little gotcha is supposed to be documented in Go 1.5.

If reusing the http connection is important for your application you might need to add something like this at the end of your response processing logic:

_, err = io.Copy(ioutil.Discard, resp.Body)  
It will be necessary if you don't read the entire response body right away, which might happen if you are processing json API responses with code like this:

json.NewDecoder(resp.Body).Decode(&data)  
Closing HTTP Connections

level: intermediate
Some HTTP servers keep network connections open for a while (based on the HTTP 1.1 spec and the server "keep-alive" configurations). By default, the standard http library will close the network connections only when the target HTTP server asks for it. This means your app may run out of sockets/file descriptors under certain conditions.

You can ask the http library to close the connection after your request is done by setting the Close field in the request variable to true.

Another option is to add a Connection request header and set it to close. The target HTTP server should respond with a Connection: close header too. When the http library sees this response header it will also close the connection.

package main

import (  
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {  
    req, err := http.NewRequest("GET","http://golang.org",nil)
    if err != nil {
        fmt.Println(err)
        return
    }

    req.Close = true
    //or do this:
    //req.Header.Add("Connection", "close")

    resp, err := http.DefaultClient.Do(req)
    if resp != nil {
        defer resp.Body.Close()
    }

    if err != nil {
        fmt.Println(err)
        return
    }

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println(len(string(body)))
}
You can also disable http connection reuse globally. You'll need to create a custom http transport configuration for it.

package main

import (  
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {  
    tr := &http.Transport{DisableKeepAlives: true}
    client := &http.Client{Transport: tr}

    resp, err := client.Get("http://golang.org")
    if resp != nil {
        defer resp.Body.Close()
    }

    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println(resp.StatusCode)

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println(len(string(body)))
}
If you send a lot of requests to the same HTTP server it's ok to keep the network connection open. However, if your app sends one or two requests to many different HTTP servers in a short period of time it's a good idea to close the network connections right after your app receives the responses. Increasing the open file limit might be a good idea too. The correct solution depends on your application though.

Unmarshalling JSON Numbers into Interface Values

level: intermediate
By default, Go treats numeric values in JSON as float64 numbers when you decode/unmarshal JSON data into an interface. This means the following code will fail with a panic:

package main

import (  
  "encoding/json"
  "fmt"
)

func main() {  
  var data = []byte(`{"status": 200}`)

  var result map[string]interface{}
  if err := json.Unmarshal(data, &result); err != nil {
    fmt.Println("error:", err)
    return
  }

  var status = result["status"].(int) //error
  fmt.Println("status value:",status)
}
Runtime Panic:

panic: interface conversion: interface is float64, not int 

If the JSON value you are trying to decode is an integer you have serveral options.

Option one: use the float value as-is :-)

Option two: convert the float value to the integer type you need.

package main

import (  
  "encoding/json"
  "fmt"
)

func main() {  
  var data = []byte(`{"status": 200}`)

  var result map[string]interface{}
  if err := json.Unmarshal(data, &result); err != nil {
    fmt.Println("error:", err)
    return
  }

  var status = uint64(result["status"].(float64)) //ok
  fmt.Println("status value:",status)
}
Option three: use a Decoder type to unmarshal JSON and tell it to represent JSON numbers using the Number interface type.

package main

import (  
  "encoding/json"
  "bytes"
  "fmt"
)

func main() {  
  var data = []byte(`{"status": 200}`)

  var result map[string]interface{}
  var decoder = json.NewDecoder(bytes.NewReader(data))
  decoder.UseNumber()

  if err := decoder.Decode(&result); err != nil {
    fmt.Println("error:", err)
    return
  }

  var status,_ = result["status"].(json.Number).Int64() //ok
  fmt.Println("status value:",status)
}
You can use the string representation of your Number value to unmarshal it to a different numeric type:

package main

import (  
  "encoding/json"
  "bytes"
  "fmt"
)

func main() {  
  var data = []byte(`{"status": 200}`)

  var result map[string]interface{}
  var decoder = json.NewDecoder(bytes.NewReader(data))
  decoder.UseNumber()

  if err := decoder.Decode(&result); err != nil {
    fmt.Println("error:", err)
    return
  }

  var status uint64
  if err := json.Unmarshal([]byte(result["status"].(json.Number).String()), &status); err != nil {
    fmt.Println("error:", err)
    return
  }

  fmt.Println("status value:",status)
}
Option four: use a struct type that maps your numeric value to the numeric type you need.

package main

import (  
  "encoding/json"
  "bytes"
  "fmt"
)

func main() {  
  var data = []byte(`{"status": 200}`)

  var result struct {
    Status uint64 `json:"status"`
  }

  if err := json.NewDecoder(bytes.NewReader(data)).Decode(&result); err != nil {
    fmt.Println("error:", err)
    return
  }

  fmt.Printf("result => %+v",result)
  //prints: result => {Status:200}
}
Option five: use a struct that maps your numeric value to the json.RawMessage type if you need to defer the value decoding.

This option is useful if you have to perform conditional JSON field decoding where the field type or structure might change.

package main

import (  
  "encoding/json"
  "bytes"
  "fmt"
)

func main() {  
  records := [][]byte{
    []byte(`{"status": 200, "tag":"one"}`),
    []byte(`{"status":"ok", "tag":"two"}`),
  }

  for idx, record := range records {
    var result struct {
      StatusCode uint64
      StatusName string
      Status json.RawMessage `json:"status"`
      Tag string             `json:"tag"`
    }

    if err := json.NewDecoder(bytes.NewReader(record)).Decode(&result); err != nil {
      fmt.Println("error:", err)
      return
    }

    var sstatus string
    if err := json.Unmarshal(result.Status, &sstatus); err == nil {
      result.StatusName = sstatus
    }

    var nstatus uint64
    if err := json.Unmarshal(result.Status, &nstatus); err == nil {
      result.StatusCode = nstatus
    }

    fmt.Printf("[%v] result => %+v\n",idx,result)
  }
}
Comparing Structs, Arrays, Slices, and Maps

level: intermediate
You can use the equality operator, ==, to compare struct variables if each structure field can be compared with the equality operator.

package main

import "fmt"

type data struct {  
    num int
    fp float32
    complex complex64
    str string
    char rune
    yes bool
    events <-chan string
    handler interface{}
    ref *byte
    raw [10]byte
}

func main() {  
    v1 := data{}
    v2 := data{}
    fmt.Println("v1 == v2:",v1 == v2) //prints: v1 == v2: true
}
If any of the struct fields are not comparable then using the equality operator will result in compile time errors. Note that arrays are comparable only if their data items are comparable.

package main

import "fmt"

type data struct {  
    num int                //ok
    checks [10]func() bool //not comparable
    doit func() bool       //not comparable
    m map[string] string   //not comparable
    bytes []byte           //not comparable
}

func main() {  
    v1 := data{}
    v2 := data{}
    fmt.Println("v1 == v2:",v1 == v2)
}
Go does provide a number of helper functions to compare variables that can't be compared using the comparison operators.

The most generic solution is to use the DeepEqual() function in the reflect package.

package main

import (  
    "fmt"
    "reflect"
)

type data struct {  
    num int                //ok
    checks [10]func() bool //not comparable
    doit func() bool       //not comparable
    m map[string] string   //not comparable
    bytes []byte           //not comparable
}

func main() {  
    v1 := data{}
    v2 := data{}
    fmt.Println("v1 == v2:",reflect.DeepEqual(v1,v2)) //prints: v1 == v2: true

    m1 := map[string]string{"one": "a","two": "b"}
    m2 := map[string]string{"two": "b", "one": "a"}
    fmt.Println("m1 == m2:",reflect.DeepEqual(m1, m2)) //prints: m1 == m2: true

    s1 := []int{1, 2, 3}
    s2 := []int{1, 2, 3}
    fmt.Println("s1 == s2:",reflect.DeepEqual(s1, s2)) //prints: s1 == s2: true
}
Aside from being slow (which may or may not be a deal breaker for your application), DeepEqual() also has its own gotchas.

package main

import (  
    "fmt"
    "reflect"
)

func main() {  
    var b1 []byte = nil
    b2 := []byte{}
    fmt.Println("b1 == b2:",reflect.DeepEqual(b1, b2)) //prints: b1 == b2: false
}
DeepEqual() doesn't consider an empty slice to be equal to a "nil" slice. This behavior is different from the behavior you get using the bytes.Equal() function. bytes.Equal() considers "nil" and empty slices to be equal.

package main

import (  
    "fmt"
    "bytes"
)

func main() {  
    var b1 []byte = nil
    b2 := []byte{}
    fmt.Println("b1 == b2:",bytes.Equal(b1, b2)) //prints: b1 == b2: true
}
DeepEqual() isn't always perfect comparing slices.

package main

import (  
    "fmt"
    "reflect"
    "encoding/json"
)

func main() {  
    var str string = "one"
    var in interface{} = "one"
    fmt.Println("str == in:",str == in,reflect.DeepEqual(str, in)) 
    //prints: str == in: true true

    v1 := []string{"one","two"}
    v2 := []interface{}{"one","two"}
    fmt.Println("v1 == v2:",reflect.DeepEqual(v1, v2)) 
    //prints: v1 == v2: false (not ok)

    data := map[string]interface{}{
        "code": 200,
        "value": []string{"one","two"},
    }
    encoded, _ := json.Marshal(data)
    var decoded map[string]interface{}
    json.Unmarshal(encoded, &decoded)
    fmt.Println("data == decoded:",reflect.DeepEqual(data, decoded)) 
    //prints: data == decoded: false (not ok)
}
If your byte slices (or strings) contain text data you might be tempted to use  ToUpper() or ToLower() from the "bytes" and "strings" packages when you need to compare values in a case insensitive manner (before using  ==,bytes.Equal(), or bytes.Compare()). It will work for English text, but it will not work for text in many other languages. strings.EqualFold() and  bytes.EqualFold() should be used instead.

If your byte slices contain secrets (e.g., cryptographic hashes, tokens, etc.) that need to be validated against user-provided data, don't use reflect.DeepEqual(),  bytes.Equal(), or bytes.Compare() because those functions will make your application vulnerable to timing attacks. To avoid leaking the timing information use the functions from the 'crypto/subtle' package (e.g.,  subtle.ConstantTimeCompare()).

Recovering From a Panic

level: intermediate
The recover() function can be used to catch/intercept a panic. Calling  recover() will do the trick only when it's done in a deferred function.

Incorrect:

package main

import "fmt"

func main() {  
    recover() //doesn't do anything
    panic("not good")
    recover() //won't be executed :)
    fmt.Println("ok")
}
Works:

package main

import "fmt"

func main() {  
    defer func() {
        fmt.Println("recovered:",recover())
    }()

    panic("not good")
}
The call to recover() works only if it's called directly in your deferred function.

Fails:

package main

import "fmt"

func doRecover() {  
    fmt.Println("recovered =>",recover()) //prints: recovered => <nil>
}

func main() {  
    defer func() {
        doRecover() //panic is not recovered
    }()

    panic("not good")
}
Updating and Referencing Item Values in Slice, Array, and Map "range" Clauses

level: intermediate
The data values generated in the "range" clause are copies of the actual collection elements. They are not references to the original items. This means that updating the values will not change the original data. It also means that taking the address of the values will not give you pointers to the original data.

package main

import "fmt"

func main() {  
    data := []int{1,2,3}
    for _,v := range data {
        v *= 10 //original item is not changed
    }

    fmt.Println("data:",data) //prints data: [1 2 3]
}
If you need to update the original collection record value use the index operator to access the data.

package main

import "fmt"

func main() {  
    data := []int{1,2,3}
    for i,_ := range data {
        data[i] *= 10
    }

    fmt.Println("data:",data) //prints data: [10 20 30]
}
If your collection holds pointer values then the rules are slightly different. You still need to use the index operator if you want the original record to point to another value, but you can update the data stored at the target location using the second value in the "for range" clause.

package main

import "fmt"

func main() {  
    data := []*struct{num int} {{1},{2},{3}}

    for _,v := range data {
        v.num *= 10
    }

    fmt.Println(data[0],data[1],data[2]) //prints &{10} &{20} &{30}
}
"Hidden" Data in Slices

level: intermediate
When you reslice a slice, the new slice will reference the array of the original slice. If you forget about this behavior it can lead to unexpected memory usage if your application allocates large temporary slices creating new slices from them to refer to small sections of the original data.

package main

import "fmt"

func get() []byte {  
    raw := make([]byte,10000)
    fmt.Println(len(raw),cap(raw),&raw[0]) //prints: 10000 10000 <byte_addr_x>
    return raw[:3]
}

func main() {  
    data := get()
    fmt.Println(len(data),cap(data),&data[0]) //prints: 3 10000 <byte_addr_x>
}
To avoid this trap make sure to copy the data you need from the temporary slice (instead of reslicing it).

package main

import "fmt"

func get() []byte {  
    raw := make([]byte,10000)
    fmt.Println(len(raw),cap(raw),&raw[0]) //prints: 10000 10000 <byte_addr_x>
    res := make([]byte,3)
    copy(res,raw[:3])
    return res
}

func main() {  
    data := get()
    fmt.Println(len(data),cap(data),&data[0]) //prints: 3 3 <byte_addr_y>
}
Slice Data "Corruption"

level: intermediate
Let's say you need to rewrite a path (stored in a slice). You reslice the path to reference each directory modifying the first folder name and then you combine the names to create a new path.

package main

import (  
    "fmt"
    "bytes"
)

func main() {  
    path := []byte("AAAA/BBBBBBBBB")
    sepIndex := bytes.IndexByte(path,'/')
    dir1 := path[:sepIndex]
    dir2 := path[sepIndex+1:]
    fmt.Println("dir1 =>",string(dir1)) //prints: dir1 => AAAA
    fmt.Println("dir2 =>",string(dir2)) //prints: dir2 => BBBBBBBBB

    dir1 = append(dir1,"suffix"...)
    path = bytes.Join([][]byte{dir1,dir2},[]byte{'/'})

    fmt.Println("dir1 =>",string(dir1)) //prints: dir1 => AAAAsuffix
    fmt.Println("dir2 =>",string(dir2)) //prints: dir2 => uffixBBBB (not ok)

    fmt.Println("new path =>",string(path))
}
It didn't work as you expected. Instead of "AAAAsuffix/BBBBBBBBB" you ended up with "AAAAsuffix/uffixBBBB". It happened because both directory slices referenced the same underlying array data from the original path slice. This means that the original path is also modified. Depending on your application this might be a problem too.

This problem can fixed by allocating new slices and copying the data you need. Another option is to use the full slice expression.

package main

import (  
    "fmt"
    "bytes"
)

func main() {  
    path := []byte("AAAA/BBBBBBBBB")
    sepIndex := bytes.IndexByte(path,'/')
    dir1 := path[:sepIndex:sepIndex] //full slice expression
    dir2 := path[sepIndex+1:]
    fmt.Println("dir1 =>",string(dir1)) //prints: dir1 => AAAA
    fmt.Println("dir2 =>",string(dir2)) //prints: dir2 => BBBBBBBBB

    dir1 = append(dir1,"suffix"...)
    path = bytes.Join([][]byte{dir1,dir2},[]byte{'/'})

    fmt.Println("dir1 =>",string(dir1)) //prints: dir1 => AAAAsuffix
    fmt.Println("dir2 =>",string(dir2)) //prints: dir2 => BBBBBBBBB (ok now)

    fmt.Println("new path =>",string(path))
}
The extra parameter in the full slice expression controls the capacity for the new slice. Now appending to that slice will trigger a new buffer allocation instead of overwriting the data in the second slice.

"Stale" Slices

level: intermediate
Multiple slices can reference the same data. This can happen when you create a new slice from an existing slice, for example. If your application relies on this behavior to function properly then you'll need to worry about "stale" slices.

At some point adding data to one of the slices will result in a new array allocation when the original array can't hold any more new data. Now other slices will point to the old array (with old data).

import "fmt"

func main() {  
    s1 := []int{1,2,3}
    fmt.Println(len(s1),cap(s1),s1) //prints 3 3 [1 2 3]

    s2 := s1[1:]
    fmt.Println(len(s2),cap(s2),s2) //prints 2 2 [2 3]

    for i := range s2 { s2[i] += 20 }

    //still referencing the same array
    fmt.Println(s1) //prints [1 22 23]
    fmt.Println(s2) //prints [22 23]

    s2 = append(s2,4)

    for i := range s2 { s2[i] += 10 }

    //s1 is now "stale"
    fmt.Println(s1) //prints [1 22 23]
    fmt.Println(s2) //prints [32 33 14]
}
Type Declarations and Methods

level: intermediate
When you create a type declaration by defining a new type from an existing (non-interface) type, you don't inherit the methods defined for that existing type.

Fails:

package main

import "sync"

type myMutex sync.Mutex

func main() {  
    var mtx myMutex
    mtx.Lock() //error
    mtx.Unlock() //error  
}
Compile Errors:

/tmp/sandbox106401185/main.go:9: mtx.Lock undefined (type myMutex has no field or method Lock) /tmp/sandbox106401185/main.go:10: mtx.Unlock undefined (type myMutex has no field or method Unlock)

If you do need the methods from the original type you can define a new struct type embedding the original type as an anonymous field.

Works:

package main

import "sync"

type myLocker struct {  
    sync.Mutex
}

func main() {  
    var lock myLocker
    lock.Lock() //ok
    lock.Unlock() //ok
}
Interface type declarations also retain their method sets.

Works:

package main

import "sync"

type myLocker sync.Locker

func main() {  
    var lock myLocker = new(sync.Mutex)
    lock.Lock() //ok
    lock.Unlock() //ok
}
Breaking Out of "for switch" and "for select" Code Blocks

level: intermediate
A "break" statement without a label only gets you out of the inner switch/select block. If using a "return" statement is not an option then defining a label for the outer loop is the next best thing.

package main

import "fmt"

func main() {  
    loop:
        for {
            switch {
            case true:
                fmt.Println("breaking out...")
                break loop
            }
        }

    fmt.Println("out!")
}
A "goto" statement will do the trick too...

Iteration Variables and Closures in "for" Statements

level: intermediate
This is the most common gotcha in Go. The iteration variables in for statements are reused in each iteration. This means that each closure (aka function literal) created in your for loop will reference the same variable (and they'll get that variable's value at the time those goroutines start executing).

Incorrect:

package main

import (  
    "fmt"
    "time"
)

func main() {  
    data := []string{"one","two","three"}

    for _,v := range data {
        go func() {
            fmt.Println(v)
        }()
    }

    time.Sleep(3 * time.Second)
    //goroutines print: three, three, three
}
The easiest solution (that doesn't require any changes to the goroutine) is to save the current iteration variable value in a local variable inside the for loop block.

Works:

package main

import (  
    "fmt"
    "time"
)

func main() {  
    data := []string{"one","two","three"}

    for _,v := range data {
        vcopy := v //
        go func() {
            fmt.Println(vcopy)
        }()
    }

    time.Sleep(3 * time.Second)
    //goroutines print: one, two, three
}
Another solution is to pass the current iteration variable as a parameter to the anonymous goroutine.

Works:

package main

import (  
    "fmt"
    "time"
)

func main() {  
    data := []string{"one","two","three"}

    for _,v := range data {
        go func(in string) {
            fmt.Println(in)
        }(v)
    }

    time.Sleep(3 * time.Second)
    //goroutines print: one, two, three
}
Here's a slightly more complicated version of the trap.

Incorrect:

package main

import (  
    "fmt"
    "time"
)

type field struct {  
    name string
}

func (p *field) print() {  
    fmt.Println(p.name)
}

func main() {  
    data := []field{{"one"},{"two"},{"three"}}

    for _,v := range data {
        go v.print()
    }

    time.Sleep(3 * time.Second)
    //goroutines print: three, three, three
}
Works:

package main

import (  
    "fmt"
    "time"
)

type field struct {  
    name string
}

func (p *field) print() {  
    fmt.Println(p.name)
}

func main() {  
    data := []field{{"one"},{"two"},{"three"}}

    for _,v := range data {
        v := v
        go v.print()
    }

    time.Sleep(3 * time.Second)
    //goroutines print: one, two, three
}
What do you think you'll see when you run this code (and why)?

package main

import (  
    "fmt"
    "time"
)

type field struct {  
    name string
}

func (p *field) print() {  
    fmt.Println(p.name)
}

func main() {  
    data := []*field{{"one"},{"two"},{"three"}}

    for _,v := range data {
        go v.print()
    }

    time.Sleep(3 * time.Second)
}
Deferred Function Call Argument Evaluation

level: intermediate
Arguments for a deferred function call are evaluated when the defer statement is evaluated (not when the function is actually executing).

package main

import "fmt"

func main() {  
    var i int = 1

    defer fmt.Println("result =>",func() int { return i * 2 }())
    i++
    //prints: result => 2 (not ok if you expected 4)
}
Deferred Function Call Execution

level: intermediate
The deferred calls are executed at the end of the containing function and not at the end of the containing code block. It's an easy mistake to make for new Go developers confusing the deferred code execution rules with the variable scoping rules. It can become a problem if you have a long running function with a for loop that tries to defer resource cleanup calls in each iteration.

package main

import (  
    "fmt"
    "os"
    "path/filepath"
)

func main() {  
    if len(os.Args) != 2 {
        os.Exit(-1)
    }

    start, err := os.Stat(os.Args[1])
    if err != nil || !start.IsDir(){
        os.Exit(-1)
    }

    var targets []string
    filepath.Walk(os.Args[1], func(fpath string, fi os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        if !fi.Mode().IsRegular() {
            return nil
        }

        targets = append(targets,fpath)
        return nil
    })

    for _,target := range targets {
        f, err := os.Open(target)
        if err != nil {
            fmt.Println("bad target:",target,"error:",err) //prints error: too many open files
            break
        }
        defer f.Close() //will not be closed at the end of this code block
        //do something with the file...
    }
}
One way to solve the problem is by wrapping the code block in a function.

package main

import (  
    "fmt"
    "os"
    "path/filepath"
)

func main() {  
    if len(os.Args) != 2 {
        os.Exit(-1)
    }

    start, err := os.Stat(os.Args[1])
    if err != nil || !start.IsDir(){
        os.Exit(-1)
    }

    var targets []string
    filepath.Walk(os.Args[1], func(fpath string, fi os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        if !fi.Mode().IsRegular() {
            return nil
        }

        targets = append(targets,fpath)
        return nil
    })

    for _,target := range targets {
        func() {
            f, err := os.Open(target)
            if err != nil {
                fmt.Println("bad target:",target,"error:",err)
                return
            }
            defer f.Close() //ok
            //do something with the file...
        }()
    }
}
Another option is to get rid of the defer statement :-)

Failed Type Assertions

level: intermediate
Failed type assertions return the "zero value" for the target type used in the assertion statement. This can lead to unexpected behavior when it's mixed with variable shadowing.

Incorrect:

package main

import "fmt"

func main() {  
    var data interface{} = "great"

    if data, ok := data.(int); ok {
        fmt.Println("[is an int] value =>",data)
    } else {
        fmt.Println("[not an int] value =>",data) 
        //prints: [not an int] value => 0 (not "great")
    }
}
Works:

package main

import "fmt"

func main() {  
    var data interface{} = "great"

    if res, ok := data.(int); ok {
        fmt.Println("[is an int] value =>",res)
    } else {
        fmt.Println("[not an int] value =>",data) 
        //prints: [not an int] value => great (as expected)
    }
}
Blocked Goroutines and Resource Leaks

level: intermediate
Rob Pike talked about a number of fundamental concurrency patterns in his "Go Concurrency Patterns" presentation at Google I/O in 2012. Fetching the first result from a number of targets is one of them.

func First(query string, replicas ...Search) Result {  
    c := make(chan Result)
    searchReplica := func(i int) { c <- replicas[i](query) }
    for i := range replicas {
        go searchReplica(i)
    }
    return <-c
}
The function starts a goroutines for each search replica. Each goroutine sends its search result to the result channel. The first value from the result channel is returned.

What about the results from the other goroutines? What about the goroutines themselves?

The result channel in the First() function is unbuffered. This means that only the first goroutine returns. All other goroutines are stuck trying to send their results. This means if you have more than one replica each call will leak resources.

To avoid the leaks you need to make sure all goroutines exit. One potential solution is to use a buffered result channel big enough to hold all results.

func First(query string, replicas ...Search) Result {  
    c := make(chan Result,len(replicas))
    searchReplica := func(i int) { c <- replicas[i](query) }
    for i := range replicas {
        go searchReplica(i)
    }
    return <-c
}
Another potential solution is to use a select statement with a default case and a buffered result channel that can hold one value. The default case ensures that the goroutines don't get stuck even when the result channel can't receive messages.

func First(query string, replicas ...Search) Result {  
    c := make(chan Result,1)
    searchReplica := func(i int) { 
        select {
        case c <- replicas[i](query):
        default:
        }
    }
    for i := range replicas {
        go searchReplica(i)
    }
    return <-c
}
You can also use a special cancellation channel to interrupt the workers.

func First(query string, replicas ...Search) Result {  
    c := make(chan Result)
    done := make(chan struct{})
    defer close(done)
    searchReplica := func(i int) { 
        select {
        case c <- replicas[i](query):
        case <- done:
        }
    }
    for i := range replicas {
        go searchReplica(i)
    }

    return <-c
}
Why did the presentation contain these bugs? Rob Pike simply didn't want to comlicate the slides. It makes sense, but it can be a problem for new Go developers who would use the code as is without thinking that it might have problems.

