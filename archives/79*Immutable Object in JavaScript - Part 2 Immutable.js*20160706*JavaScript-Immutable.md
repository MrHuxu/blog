# Immutable Object in JavaScript - Immutable.js

上篇文章里说到了[Immutable.js](https://facebook.github.io/immutable-js/)这个强大的第三方库, 这个库加上Redux, 基本上就是目前React圈子里的三剑客了, 基本上用了各种解决方案后都会回到这上面来, Redux做状态管理, React做组件渲染, Immutable.js则提供了简单高效的不可变对象来使React在订阅Redux状态之后对变化的响应更加快速.

### Why Immutable.js

首先Immutable.js对我们最经常使用的两个Mutable的数据类型即Object和Array提供了非常好的支持, 也就是Immutable.js里的List和Map, 而且还有OrderedSet, Stack和Range这样方便的内置类型, 而且操作方式的改动基本就是把JS里赋值取值符号换成了set/get操作符, 而且每次操作都是产生一个新的对象而不是在原有对象上进行修改.

当然支持完善使用简单是一方面原因, 作为一个要经常读和取操作的库, 性能当然也是非常重要的, 这里我们分别使用JSON转换, Object#assign, 以及Immutable.js对一个对象进行1000000万次的复制以及取值操作:

    var a = { a: 1 };
    var d1 = new Date();
    for (i = 1; i < 1000000; ++i) {
      var b = JSON.parse(JSON.stringify(a));
      b.a = 2
      var c = b.a;
    }
    var d2 = new Date();
    console.log(d2 - d1);    // 606
    
    var a = { a: 1 };
    var d1 = new Date();
    for (i = 1; i < 1000000; ++i) {
      var b = Object.assign({}, a);
      b.a = 2;
      var c = b.a;
    }
    var d2 = new Date();
    console.log(d2 - d1);   // 200
    
    var Immutable = require('immutable');
    var a = Immutable.Map({ a: 1});
    var d1 = new Date();
    for (var i = 1; i < 1000000; ++i) {
      var b = a.set('a', 2);
      var c = b.get('a');
    }
    var d2 = new Date();
    console.log(d2 - d1);   // 164

通过这组数据可以看出, Immutable.js速度比JSON转换快了太多, 甚至比ES6之后原生的浅复制Object#assign还快.

既然这样, 那么使用Immutable.js看来就是水到渠成了, 那接下来我就对这个库做一个简单的讲解.

### Immutable.js - fromJS(), toJS(), is()

一般当我们使用AJAX的方式从后段获取数据的时候, 获得的都是JSON, 然后parse成JSON对象, 但是我们需要将其转换成Immutable对象供Redux和React使用, 这时我们就可以使用```fromJS```这个方法将JS对象转换成Immutable.js对象:

    > var i = require('immutable')
    undefined
    > i.fromJS({a : [1, 2, 3]})
    Map { "a": List [ 1, 2, 3 ] }
    
我们可以看到, 这个方法的行为是深转换, 不仅最外层被转换成了一个Immutable Map, 内部的数组也被转换成了Immutable List.

当然, 如果要把前端的Immutable.js数据转成JS对象传给后段, 也有一个对应的```toJS```方法:

    > var i = require('immutable')
    undefined
    > var map = i.Map({
    ... list: i.List.of(1, 2, 3)
    ... })
    undefined
    > map.toJS()
    { list: [ 1, 2, 3 ] }
    
这个转换同样是深转换, 对内部的Immutable.js对象仍然有效.

有趣的是, 和JS中原生的```Object#is```方法类似, Immutable.js还提供了一个```is```方法, 不过行为却和原生的方法相反, 是把两个Immutable.js对象进行Mutable的比较:

    > var i = require('immutable')
    undefined
    > Object.is({a: 1}, {a: 1})
    false
    > Object.is([1, 2], [1, 2])
    false
    > i.is(i.Map({a: 1}), i.Map({a: 1}))
    true
    > i.is(i.List.of(1, 2), i.List.of(1, 2))
    true

我们可以看到, 原生JS对对象和数组的操作是Mutable的, 但是```Object#is```操作符的比较却是Immutable的, 而Immutable.js中对Map和List的操作是Immutable的, 但是```Immutable#is```操作符却是Mutable的.

### Immutable.js - List

```List```对应的是JS原生的```Array```, 原生的数组操作都可以在List对象中找到对应的方法, 我们可以通过如下的方式初始化一个List:

    var i = require('immutable')

    var list1 = i.List.of(1, 2, 3)
    var list2 = i.List([1, 2, 3])
    var list3 = i.List.of(...[1, 2, 3])

上面分别用```of```方法, List构造函数, 以及ES6生成数组iterator的方式够早了```List [ 1, 2, 3 ]```, 这就是一个基本的List对象了.

对于这个对象, 我们可以做一些和普通数组一样的操作:

    list.size   // 3
    list.set(0, 0)               // List [ 0, 2, 3 ]
    list.delete(0)               // List [ 2, 3 ]
    list.push(4)                 // List [ 1, 2, 3, 4 ]
    list.pop()                   // List [ 1, 2 ]
    list.unshift(0)              // List [ 0, 1, 2, 3 ]
    list.shift()                 // List [ 2, 3 ]
    list.update(1, i => i * i)   // List [ 1, 4, 3 ]
    list.insert(1, 4)            // List [ 1, 4, 2, 3 ]
    list.clear()                 // List []

从上面的例子我们可以看出, 每次在list上执行方法的时候, 返回的都是一个新的List对象, 而且初始的对象并没有被改变.


### Immutable.js - Map


