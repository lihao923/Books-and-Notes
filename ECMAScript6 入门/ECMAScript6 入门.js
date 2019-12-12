/*
*
* ECMAScript 6 入门
*
*/


/*
* 第一章 let和const命令
*/



/* 1. let命令 */
// 基本用法

{
	let a = 10;
	var b = 1;
}
a // ReferenceError: a is not defined.
b // 1



// let用于for循环,计数器i只在for循环体内有效，在循环体外引用就会报错
for(let i = 0; i < 10; i++) {
	// ...
}
console.log(i); // ReferenceError: i is not defined

// var用于for循环，变量i是var命令声明的，在全局范围内都有效，所以全局只有一个变量i

var a = [];
for (var i = 0; i < 10; i++) {
	a[i] = function() {
		console.log(i)
	};
}

a[6](); // 10

// 换成let
var a = []
for(let i = 0; i < 10; i++) {
	a[i] = function() {
		console.log(i);
	};
}
a[6](); // 6

// for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域
for(let i = 0; i < 3; i++) {
	let i = 'abc';
	console.log(i);
}
//abc
//abc
//abc

// 上面代码正确运行，输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域





// 不存在变量提升

// var的情况
console.log(foo); // 输出undefined
var foo = 2;

// let的情况
console.log(bar); // 报错ReferenceError
let bar = 2;



// 暂时性死区
var temp = 123;
if(true) {
	tmp = 'abc'; // ReferenceError
	let tmp;
}
// 上面代码中，存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp，
// 导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错


// 下面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”
if(true) {
	// TDZ开始
	tmp = 'abc'; // ReferenceError 
	console.log(tmp); // ReferenceError

	let tmp;  // TDZ结束
	console.log(tmp); // undefined

	tmp = 123;
	console.log(tmp); // 123
}


// 有些“死区”比较隐蔽，不太容易发现
function bar(x = y, y = 2) {
	return [x, y];
}
bar(); // 报错
// 上面代码中，调用bar函数之所以报错（某些实现可能不报错），是因为参数x默认值等于另一个参数y，
// 而此时y还没有声明，属于“死区”。如果y的默认值是x，就不会报错，因为此时x已经声明了。
function bar(x = 2; y = x) {
	return [x, y]
}
bar(); // [2, 2]



// 不允许重复声明

// 报错
function func() {
	let a = 10;
	var a = 1;
}

// 报错
function func() {
	let a = 10;
	let a = 1;
}

function func(arg) {
	let arg;
}
func(); // 报错

function func(arg) {
	{
		let arg;
	}
}
func(); // 不报错






/* 2.块级作用域 */
// 为什么需要块级作用域？
// ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

// 场景1.内层变量可能会覆盖外层变量
var tmp = new Date();
function f() {
	console.log(tmp);
	if(false) {
		var tmp = 'hello world!';
	}
}
f(); // undefined

// 上面代码的原意是，if代码块的外部使用外层的tmp变量，内部使用内层的tmp变量
// 但是，函数f执行后输出为undefined，原因在于变量提升，导致内层tmp覆盖了外层tmp

// 场景2.用来计数的循环变量泄露为全局变量
var s = 'hello';
for(var i = 0; i < s.length; i++) {
	console.log(s[i]);
}
console.log(i); // 5
// 上面代码中，变量i只用来控制循环，
// 但是循环结束后，它并没有消失，泄露成了全局变量。


// ES6的块级作用域

function f1() {
	let n = 5;
	if(true) {
		let n = 10;
	}
	console.log(n); // 5, 块级作用域中外层代码块不受内层代码块的影响
}


// 块级作用域的出现，使得匿名立即执行函数表达式(匿名IIFE)不再必要了

// IIFE写法
(function() {
	var tmp = ...;
	...
}());

// 块级作用域写法
{
	let tmp = ...;
	...
}


// 块级作用域与函数声明

// ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明
// 下面两种函数声明，根据 ES5 的规定都是非法的
// 浏览器没有遵守这个规定，为了兼容旧代码
// 情况1
if(true) {
	function f(){}
}

// 情况2
try {
	function f() {}
} catch(e) {
	// ...
}

// ES6 引入了块级作用域，明确允许在块级作用域之中声明函数
function f() {console.log('I am outside!');}

(function() {
	if(false) {
		// 重复声明一次函数f
		function f() {console.log('I am inside!')}
	}

	f();
}());

// ES5环境实际运行过程...
function f() {console.log('I am outside!');}
(function() {
	function f() {console.log('I am inside!');} // 函数声明提前了
	if(false) {}
	f();
}());

// ES6环境实际运行过程...
function f() {console.log('I am outside!');}
(function() {
	if(false) {
		// 重复声明一次函数f
		function f() {console.log('I am inside!');}
	}
	f();
}());
// Uncaught TypeError: f is not a function

// ES6环境中，理论上会得到“I am outside!”
// 为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，
// 浏览器的实现可以不遵守上面的规定，有自己的行为方式
// - 允许在块级作用域内声明函数。
// - 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
// - 同时，函数声明还会提升到所在的块级作用域的头部。

// 浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量
function f() {console.log('I am outside!');}
(function() {
	var f = undefined;
	if(false) {
		function f() {console.log('I am inside!');}
	}
	f();
}());

// 块级作用域内部的函数声明语句，建议不要使用
{
	let a = 'secret';
	function() f() {
		return a;
	}
}

// 块级作用域内部，优先使用函数表达式
{
	let a = 'secret';
	let f = function() {
		return a;
	};
}




/* 3. const命令 */
// const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
// 对于复合类型的数据（对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，
// const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了
const foo = {}
// 为foo添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

//将foo指向另一个对象，就会报错
foo = {}; // TypeError: 'foo' is read-only

// 如果真的想将对象冻结，应该使用Object.freeze方法
const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，该行报错
foo.prop = 123;

// 下面是一个将对象彻底冻结的函数
var constantize = (obj) => {
	Object.freeze(obj);
	Object.keys(obj).forEach((key, i) => {
		if(typeof obj[key] === 'object') {
			constantize(obj[key]);
		}
	});
};




/* 4. 顶层对象的属性 */
// 从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩
var a = 1;
// 如果在Node的REPL环境里，可以写成global.a
// 或者采用通用方法， 写成this.a
window.a // 1

let b = 1;
window.b // undefined




/* 5. globalThis对象 */

// 在各种环境里取到顶层对象的方法(勉强)
// 方法一
(typeof window !== 'undifined' ? window: 
	(typeof process === 'object' && 
	typeof require === 'function' && 
	typeof global === 'object' ? global: 
	this));

// 方法二
var getGlobal = function() {
	if(typeof self !== 'undefined') {return self;}
	if(typeof window !== 'undefined') {return window;}
	if(typeof global !== 'undefined') {return global;}
	throw new Error('unable to locate global object');
};





























































































































































































