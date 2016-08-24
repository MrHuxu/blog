# Learn bind, call and apply in Javascript

### bind
这个函数是绑定在```Function```上的一个函数，用来改变函数运行的上下文环境，只起到绑定作用，而不会立即执行.

最关键的作用就是改变```this```产生作用的上下文环境。

    var Rectangle = {
      width: 5,
    	height: 10
		};
    
		// NaN，this is undefined
    console.log((function () {
        return this.width * this.height;
    }()));

    // 50，this means Rectangle
    console.log((function () {
        return this.width * this.height;
    }.bind(Rectangle)()));
	
```bind```函数允许运行一个别的对象里的函数，然后也可以动态的改变这个函数的上下文环境.
    
    // bind a function to other object
    data  = [
      {name: 'Samantha', age: 12},
      {name: 'Alexis', age: 14}
    ];

    var user = {
      data: [
        {name: 'T. Woods', age: 27},
        {name: 'P. Mickelson', age: 43}
      ],
      showData: function (event) {
        var randomNum = ((Math.random() * 2 | 0) + 1) - 1;
        console.log(this.data[randomNum].name + ' ' + this.data[randomNum].age);
      }
    };

    var showDataVar = user.showData
    // 'this' will be the global object
    showDataVar(); // Samantha 12

    showDataVar = user.showData.bind(user);
    // 'this' will be user
    showDataVar(); // T. Woods 27
        
也可以让函数的运行对象和this指向的对象完全没有关系.
    
    var cars = {
      data: [
        {name: 'Honda Accord', age: 14},
        {name: 'Tesla Model S', age: 2}
      ]
    }

    cars.showData = user.showData.bind(cars);
    // use function of other object but bind to itself
    cars.showData(); // Honda Accord 14
    
函数柯里化：而且bind在绑定this环境的时候，不用一次性绑定所有变量，而是可以分次绑定来改变运行上下文, 把多参数函数的参数减少.
    
            // use bind to curry function
            function greet (gender, age, name) {
                var salutation = gender === 'male' ? 'Mr. ' : 'Ms. ';
                if (age > 25) {
                    return 'Hello, ' + salutation + name + '.';
                } else {
                    return 'Hey, ' + name + '.';
                }
            }

            var greetAnAdultMale = greet.bind(null, 'male', 45);
            console.log(greetAnAdultMale()); // Hello, Mr. undefined
            console.log(greetAnAdultMale('John Hartlove')); // Hello, Mr. John Hartlove
            var greetAYoungster = greet.bind(null, '', 16);
            console.log(greetAYoungster('Alex')); // Hey, Alex
            console.log(greetAYoungster('Emma Waterloo')); // Hey, Emma Waterloo

---

### call

这个函数也是```Function```上的一个函数，可以传递一系列参数，其中第一个将作为上下文里的```this```对象，后面将作为函数的参数传递进去.

在没有指定作用域的情况下，函数很可能在```global```环境下执行，这样可以通过```call```来指定一个对象来作为```this```.
    
    // a quick example to show how apply and call works
    avgScore = 'global avgScore';

    function avg (arrayOfScores) {
      var sumOfScores = arrayOfScores.reduce(function (prev, cur, index, array) {
        return prev + cur;
      });
      this.avgScore = sumOfScores / arrayOfScores.length;
    }

    var gameController = {
      scores: [20, 34, 55, 46, 77],
      avgScore: null
    };

    // avg will run in the global object, so the global avgScore will change
    avg(gameController.scores);
    console.log(avgScore); // 46.4
    console.log(gameController.avgScore); // null

    avgScore = 'global avgScore'
    // avg will run in the gameController object
    avg.call(gameController, gameController.scores);
    console.log(avgScore); // global avgScore
    console.log(gameController.avgScore); // 46.4
        
因为```call```和```apply```是立即执行的，所以会用这两个函数对```callback```进行处理，以让其获得需要的作用域和参数:
    
    // use apply or call in callback functions
    var clientData = {
        id: 094545,
        fullName: 'Not Set',

        setUserName: function (firstName, lastName) {
            console.log(arguments.length); // 2
            this.fullName = firstName + ' ' + lastName;
        }
    };

    function getUserInput (firstName, lastName, callback, callbackObj) {
        // same as 'callback.call(callbackobj, firstName, lastName);'
        callback.apply(callbackObj, [firstName, lastName]);
    }

    getUserInput('Barack', 'Obama', clientData.setUserName, clientData);
    console.log(clientData.fullName); // Barack Obama
            
3. ```apply```: 这个函数基本用法和call一样，不过需要注意的是，同样接收参数来改变函数执行时的```this```
    
    - ```apply```接收的参数列表必须是一个数组，和```call```一样，可以用来借用别的对象的函数
            
            // use apply and call to borrow method from other objects
            var anArrayLikeObj = {
                0: 'Martin',
                1: 78,
                2: 67,
                3: ['Letta', 'Marieta', 'Pauline'],
                length: 4
            };

            var newArray = Array.prototype.slice.apply(anArrayLikeObj, [0]);
            console.log(newArray); // [ 'Martin', 78, 67, [ 'Letta', 'Marieta', 'Pauline' ] ]
            console.log(Array.prototype.indexOf.call(anArrayLikeObj, 'Martin') === -1 ? false : true); // true
            console.log(Array.prototype.reverse.call(anArrayLikeObj)); // { '0': [ 'Letta', 'Marieta', 'Pauline' ], '1': 67, '2': 78, '3': 'Martin', length: 4 }
            Array.prototype.pop.call(anArrayLikeObj);
            console.log(anArrayLikeObj); // { '0': [ 'Letta', 'Marieta', 'Pauline' ], '1': 67, '2': 78, length: 3 }
            Array.prototype.push.call(anArrayLikeObj, 'Jackie');
            console.log(anArrayLikeObj); // { '0': [ 'Letta', 'Marieta', 'Pauline' ], '1': 67, '2': 78, '3': 'Jackie', length: 4 }

    - 一些通过```apply```和```call```借用原生方法的实例
    
            function transitionTo(name) {
                var args = Array.prototype.slice.call(arguments, 1);
                console.log(args);
            }

            transitionTo('contact', 'today', '20'); // [ 'today', '20' ]

            function doSomething () {
                var args = Array.prototype.slice.apply(arguments);
                console.log(args);
            }

            doSomething('Water', 'Salt', 'Glue') // [ 'Water', 'Salt', 'Glue' ]
            
    - 当```apply```第一个参数为空时，表明不改变这个参数的作用域，紧紧是执行这个函数
    
            var gameController = {
                scores: [20, 34, 55, 46, 77],
                avgScore: null,
                players: [
                    {name: 'Tommy', playerID: 987, age: 23},
                    {name: 'Pau', playerID: 87, age: 33}
                ]
            };

            var appController = {
                scores: [900, 845, 809, 950],
                avgScore: null,
                avg: function () {
                    var sumOfScores = this.scores.reduce(function (prev, cur, index, array) {
                        return prev + cur;
                    });
                    this.avgScore = sumOfScores / this.scores.length;
                }
            };

            appController.avg.apply(gameController);
            console.log(gameController.avgScore); // 46.4
            console.log(appController.avgScore); // null

            appController.maxNum = function () {
                this.avgScore = Math.max.apply(null, this.scores);
            };
            appController.maxNum.apply(gameController, gameController.scores);
            console.log(gameController.avgScore); // 77

            var students = ['Peter Alexander', 'Michael Woodruff', 'Judy Archer', 'Malcolm Khan'];

            function welcomeStudents() {
                var args = Array.prototype.slice.call(arguments);
                var lastItem = args.pop();
                console.log('Welcome ' + args.join(', ') + ', and ' + lastItem + '.');
            }

            welcomeStudents.apply(null, students); // Welcome Peter Alexander, Michael Woodruff, Judy Archer, and Malcolm Khan.

4. ###some tips
    - 因为```apply```这个函数的一个特点是，在传入数组类型的参数时，最后运行，会将括号去除，作用和Ruby里的```*Array```操作类似
    
            console.log(Math.max(23, 11, 34, 56)); // 56

            var allNumbers = [23, 11, 34, 56];
            console.log(Math.max(allNumbers)); // NaN
            console.log(Math.max.apply(null, allNumbers)); // 56
            
	- 一个例子来看出```bind```是绑定过程，而```call```和```apply```是执行过程。
	
			var $testObj = {
			    text: 'test text'
			};

			var testAlert = function () {
		      alert(this.text);
		    }

		    $('#btn-bind').click(testAlert.bind($testObj));

		    $('#btn-call').click(function () {
		       testAlert.call($testObj);
		    });

		    $('#btn-apply').click(function () {
		       testAlert.apply($testObj);
		    })