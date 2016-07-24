# Immutable Object in JavaScript - 轻度解密 Immutable.js

在我的上一篇文章里, 我已经讲解了Immutable.js的部分用法, 可以看出, 这个库在对于Map这种数据类型的操作效率是略优于原生代码的, 那么现在我们就来通过代码讲解Immutable.js是怎么做到深复制比原生的浅复制还快的.

Immutable.js的代码已经在[GitHub](https://github.com/facebook/immutable-js)上开源, 而Map相关的代码都在```src/Map.js```这个文件里.

## 创建Map

这个文件创建了一个名为Map的继承自KeyedCollection的类, 这个类的构造方法就是我们初始化一个Map的方法.

首先我们看一下```emptyMap```这个方法, 这个方法的用途很简单, 就是生成一个空的Map:

    export var MapPrototype = Map.prototype;

    function makeMap(size, root, ownerID, hash) {
      var map = Object.create(MapPrototype);
      map.size = size;
      map._root = root;
      map.__ownerID = ownerID;
      map.__hash = hash;
      map.__altered = false;
      return map;
    }

    var EMPTY_MAP;
    export function emptyMap() {
      return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
    }

这个方法首先会判断全局的```EMPTY_MAP```这个变量有没有定义, 没有的话, 调用```makeMap```方法.

```makeMap```方法接受四个参数, 这个方法使用```Map```类的prototype创建了一个实例, 然后把几个内部变量置成我们传入的参数. 创建空Map的时候, ```size```为0, ```_root```是undefined, 后面的几个变量涉及到一些更细节的东西, 暂且不表.

再来看看Map类的代码:

    class Map extends KeyedIterable {
      constructor(value) {
        return value === null || value === undefined ? emptyMap() :
          isMap(value) && !isOrdered(value) ? value :
          emptyMap().withMutations(map => {
            var iter = KeyedIterable(value);
            assertNotInfinite(iter.size);
            iter.forEach((v, k) => map.set(k, v));
          });
      }
      ...
      withMutations(fn) {
        var mutable = this.asMutable();
        fn(mutable);
        return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
      }
      ...
    }

可以看到, 这个构造方法会判断我们传进来的初始值:

1. 如果是null或者undefined, 就回调用```emptyMap```这个方法生成一个空的Map
2. 如果已经是一个Map, 那么直接返回value
3. 如果不是的话, 只一个key-value的对象, 那么就通过```withMutations```这个方法, 将一个空的Map暂时作为Mutable类型并逐次调用```set```方法

## Map.set

接下来我们就来看一下Map的关键操作```set```, 为什么可以这么快.

    set(k, v) {
      return updateMap(this, k, v);
    }

Map类里的set方法是很简单的, 接收key和value, 并且将Map和key以及value作为参数传入外部的```updateMap```方法.

    function updateMap(map, k, v) {
      var newRoot;
      var newSize;
      if (!map._root) {
        if (v === NOT_SET) {
          return map;
        }
        newSize = 1;
        newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
      } else {
        var didChangeSize = MakeRef(CHANGE_LENGTH);
        var didAlter = MakeRef(DID_ALTER);
        newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
        if (!didAlter.value) {
          return map;
        }
        newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
      }
      ...
      return newRoot ? makeMap(newSize, newRoot) : emptyMap();
    }

这个方法首先声明了```newRoot```和```newSize```两个变量, 内部根据一个Map是否定义了内部变量_root, 存在两套处理方案

1. 如果内部变量_root没有定义, 那么置newSize为1, 使用传入的key-value对生成一个```ArrayMapNode```类的实例, 并赋给newRoot
2. 如果_root已经被定义, 那么调用```updateNode```方法传入 _root和key-value对生成一个新的root赋给newRoot, 并且根据改动的情况对size进行赋值

处理完后, 使用newSize和newRoot调用makeMap生成一个新的Map实例, 打到Immutable的效果.

那么我们现在着重来看一下ArrayMapNode类和updateNode方法:

    class ArrayMapNode {

      constructor(ownerID, entries) {
        this.ownerID = ownerID;
        this.entries = entries;
      }
      ...
      update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;

        var entries = this.entries;
        var idx = 0;
        for (var len = entries.length; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break;
          }
        }
        var exists = idx < len;
        ...
        var newEntries = isEditable ? entries : arrCopy(entries);

        if (exists) {
          if (removed) {
            idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
          } else {
            newEntries[idx] = [key, value];
          }
        } else {
          newEntries.push([key, value]);
        }
        ...
        return new ArrayMapNode(ownerID, newEntries);
      }
    }

    function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      ...
      return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
    }

ArrayMapNode的构造方法没什么好说的, 就是把定义两个实例变量```ownerID```和```entries```, 注意, 这里的entries是一个```[[k, v]]```这样的key-value对组成的数组.

而updateNode这个方法, 我们可以看到, 其实也就是调用ArrayMapNode的```update```方法, 这个方法其实也很简单, 首先使用```is```函数判断key是否在entries数组中, 然后使用```arrCopy```函数复制entries数组, 并且对新数组里的key进行操作.

其实这里is方法和arrCopy方法都容易成为性能瓶颈, 我们看一下这两个函数:

    export function is(valueA, valueB) {
      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
        return true;
      }
      ...
      return false;
    }

    export function arrCopy(arr, offset) {
      offset = offset || 0;
      var len = Math.max(0, arr.length - offset);
      var newArr = new Array(len);
      for (var ii = 0; ii < len; ii++) {
        newArr[ii] = arr[ii + offset];
      }
      return newArr;
    }