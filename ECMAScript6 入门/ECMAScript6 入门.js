/*
*
* ECMAScript 6 入门
*
*/











/*
* 第二章 let和const命令
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



















/*
* 第三章 变量的解构赋值
*/


/* 1.数组的解构赋值 */
// 基本用法
// 含义：ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）

let [a, b, c] = [1, 2, 3]; // 模式匹配

// 嵌套数组解构
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ['foo', 'bar', 'baz'];
third // baz

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // 'a'
y // undefined (如果解构不成功，变量的值就等于undefined)
z // []


// 不完全解构，可以成功
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4


// 如果等号的右边不是数组（不是可遍历的结构），那么将会报错
// 报错
let [foo] = 1;
let [foo] = flase;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};


// 对于 Set 结构，也可以使用数组的解构赋值
let [x, y, z] = new Set(['a', 'b', 'c']);
x // 'a'

// 事实上，只要某种数据结构具有Iterator接口，都可以采用数组形式的解构赋值
function*fibs() {
	let a = 0;
	let b = 1;
	while(true) {
		yield a;
		[a, b] = [b, a + b];
	}
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5


// 默认值
// 解构赋值允许指定默认值
let [foo = true] = []
foo // true

let [x, y='b'] = ['a']; // x = 'a', y = 'b'
let [x, y='b'] = ['a', undefined]; // x = 'a', y = 'b'


// ES6 内部使用严格相等运算符（===），判断一个位置是否有值。
// 所以，只有当一个数组成员严格等于undefined，默认值才会生效
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null


// 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值

function f() {
	console.log('aaa');
}

let [x = f()] = [1];

// 上面代码中，因为x能取到值，所以函数f根本不会执行。
// 上面的代码其实等价于下面的代码
let x;
if([1][0] === undefined) {
	x = f();
} else {
	x = [1][0];
}

// 默认值可以引用解构赋值的其他变量，但该变量必须已经声明
let [x = 1, y = x] = []; // x = 1, y = 1
let [x = 1, y = x] = [2]; // x = 2, y = 2
let [x = 1, y = x] = [1, 2]; // x = 1, y = 2
let [x = y, y = 1] = []; // ReferenceError: y is not defined(x用y做默认值时，y还没有声明)




/* 2.对象的结构赋值 */

// 解构赋值用于对象
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // 'aaa'
bar // 'bbb'

// 数组解构赋值必须位置正确，对象不必，只要变量与属性名相同即可
let { bar, foo } = { foo: 'aaa', bar: 'bbb' }
foo // 'aaa'
bar // 'bbb'

let { baz } = { foo: 'aaa', bar: 'bbb' }
baz // undefined


// 对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量
// 例一
let { log, sin, cos } = Math;

// 例二
const { log } = console;
log('hello world!'); // hello world!


// 如果变量名与属性名不一致，必须写成下面这样
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // 'aaa'

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'


// 这实际上说明，对象的解构赋值是下面形式的简写
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
// 也就是说，对象的解构赋值的内部机制，是先找到同名属性，
// 然后再赋给对应的变量。真正被赋值的是后者，而不是前者

let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // 'aaa'
foo // error: foo is not defined
// 上面代码中，foo是匹配的模式，baz才是变量。
// 真正被赋值的是变量baz，而不是模式foo


// 与数组一样，解构也可以用于嵌套结构的对象
let obj = {
	p: [
		'Hello',
		{y: 'World'}
	]
};
let { p: [x, { y }] } = obj;
x // 'Hello'
y // 'World'


// 这时p是模式不是变量，因此不会被赋值。如果p也要作为变量赋值，可以写成下面这样
let obj = {
	p: [
		'Hello',
		{y: 'World'}
	]
};
let { p, p:[x, { y }] } = obj;
x // 'Hello'
y // 'World'
p // ['Hello', { y: 'World' }]

// 下面是另一个例子
const node = {
	loc: {
		start: {
			line: 1,
			column: 5
		}
	}
};
let { loc, loc: { start }, loc: { start: { line } } } = node;
line // 1
loc // Object { start: Object }
start // Object { line: 1, column: 5 }

// 下面是嵌套赋值的例子
let obj = {}, arr = [];
({ foo: obj.prop, bar: arr[0]} = { foo: 123, bar: true }) 
obj // { prop: 123 }
arr // [true]

// 如果解构对象是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错
let { foo: { bar } } = { baz: 'baz' };


// 对象的结构赋值可以取到继承的属性
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo // 'bar'


// 对象的解构也可以指定默认值
var { x = 3 } = {};
x // 3

var { x, y = 5 } = { x: 1 }
x // 1
y // 5

var { x: y = 3 } = {}
y // 3

var { x: y = 3 } = { x: 5 }
y // 5

var { message: msg = 'Something went wrong' } = {}
msg // 'Something went wrong'


// 默认值生效的条件是，对象属性值严格对于undefined
var { x = 3 } = { x: undefined }
x // 3

var { x = 3 } = { x: null }
x // null


// 注意点
//错误的写法
let x;
{ x } = { x: 1 };
// SyntaxError: syntax error

// 正确的写法
let x;
({ x } = { x: 1 });



// 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。
let arr = [1, 2, 3];

let { 0: first, [arr.length -1]: last} = arr
first // 1
last // 3




/* 3.字符串的结构赋值 */
// 字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象。
const [a, b, c, d, e] = 'hello';
a // 'h'
b // 'e'
c // 'l'
d // 'l'
e // 'o'

// 类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值
let { length : len } = 'hello'
len // 5



/* 4.数值和布尔值的结构赋值 */
let { toString: s } = 123
s === Number.prototype.toString // true

let { toString: s } = true;
s === Boolean.prototype.toString // true


let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError



/* 5.函数参数的结构赋值 */

// 函数的参数也可以使用解构赋值
function add([x, y]) {
	return x + y;
}
add([1, 2]) // 3

//另一个例子
[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [3, 7]


// 函数参数的解构也可以使用默认值
function move({ x = 0, y = 0 } = {}) {
	return [x, y]
}
move({ x: 3, y: 8 }); // [3, 8]
move({ x: 3 }); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

// 注意，下面的写法会得到不一样的结果
function move({x, y} = { x: 0, y: 0}) {
	return [x, y]
}
move({ x: 3, y: 8 }); // [3, 8]
move({ x: 3 }); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]

// undefined就会触发函数参数的默认值
[1, undefined, 3].map((x = 'yes') => x);
// [1, 'yes', 3]

/* 6.圆括号问题 */
/* 7.用途 */

// (1)交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x];

// (2) 从函数返回多个值
// 返回一个数组
function example() {
	return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象
function example() {
	return { foo: 1, bar: 2 };
}
let { foo, bar } = example();

// (3) 函数参数的定义
// 解构赋值可以方便地将一组参数与变量名对应起来
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3])

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});

// (4)提取JSON数据
// 解构赋值对提取JSON对象中的数据，尤其有用
let jsonData = {
	id: 42,
	status: 'OK',
	data: [867, 5309]
};
let {id, status, data: number} = jsonData;
console.log(id, status, number);
// 42, 'OK', [867, 5309]

// (5)函数参数的默认值
jQuery.ajax = function(url, {
	async = true,
	beforeSend = function() {},
	cache = true,
	complete = function() {},
	crossDomain = false,
	global = true,
	// ... more config
} = {}) {
	// ... do stuff
}
// 指定参数的默认值，就避免了在函数体内部再写var foo=config.foo||'default foo';这样的语句

// (6) 遍历Map结构

const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for(let [key, value] of map) {
	console.log(key + 'is' + value)
}
// 'first is hello'
// 'second is world'


// (7) 输入模块的指定方法
const { SourceMapConsumer, SourceNode } = require('source-map')


















/*
* 第四章 字符串的扩展
*/

/* 1.字符的Unicode表示法 */
/* 2.字符串的遍历器接口 */
// ES6 为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历
for(let codePoint of 'foo') {
	console.log(codePoint);
}
// 'f'
// 'o'
// 'o'
 
// 这个遍历器最大的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点
let text = String.fromCodePoint(0x20BB7);
for(let i = 0; i < text.length; i++) {
	console.log(text[i]);
}
// ' '
// ' '

for(let i of text) {
	console.log(i);
}
// "𠮷"

/* 3.直接输入U+2028 和 U+2029 */
/* 4.JSON.stringify()的改造 */
/* 5.模板字符串 */
// 如果在模板字符串中需要使用反引号，则前面要用反斜杠转义
let greeting = `\`Yo\` World!`

// 模板字符串中嵌入变量，需要将变量名写在${}之中
function athorize(user, action) {
	if(!user.hasPrivilege(action)) {
		throw new Error(
			// 传统写法
			// 'User '
			// + user.name
			// + ' is not authorize to do '
			// + action
			// + '.'
			`User ${user.name} is not authorzie to do ${action}.`
		)
	}
}

// 大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性
let x = 1;
let y = 2;

`${x} + ${y} = ${x + y}`
// '1 + 2 = 3'
`${x} + ${y * 2} = ${x + y * 2}`
// '1 + 4 = 5'

let obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// 3

// 模板字符串中还能调用函数
function fn() {
	return 'Hello World!';
}

`foo ${fn()} bar`
// 'foo Hello World! bar'

// 如果大括号中的值不是字符串，将按照一般的规则转为字符串。
// 比如，大括号中是一个对象，将默认调用对象的toString方法


// 模板字符串甚至还能嵌套
const tmpl = addrs => 
`<table>
	${addrs.map(addr => 
		`<tr><td>${addr.first}</td></tr>
		<tr><td>${addr.last}</td></tr>`
	).join('')}
</table>`;

// 上面代码中，模板字符串的变量之中，又嵌入了另一个模板字符串，使用方法如下
const data = [
    { first: '<Jane>', last: 'Bond' },
    { first: 'Lars', last: '<Croft>' },
];

console.log(tmpl(data));
// <table>
//
//   <tr><td><Jane></td></tr>
//   <tr><td>Bond</td></tr>
//
//   <tr><td>Lars</td></tr>
//   <tr><td><Croft></td></tr>
//
// </table>


// 如果需要引用模板字符串本身，在需要时执行，可以写成函数
let func = (name) => `Hello ${name}!`;
func('Jack') // 'Hello Jack!'

/* 6.实例：模板编译 */

//
let template = `
<ul>
	<% for(let i = 0; i < data.supplies.length; i++) { %>
		<li><%= data.supplies[i] %></li>
	<% } %>
</ul>
`;

// 
echo('<ul>');
for(let i = 0; i < data.supplies.length; i++) {
	echo('<li>');
	echo(data.supplies[i]);
	echo('</li>');
};
echo('</ul>');

//
let evalExpr = /<%= (.+?)%>/g;
let expr = /<%([\s\S]+?)%>/g;
template = template
	.replace(evalExpr, '`); \n echo( $1); \n echo(`')
	.replace(expr, '`); \n $1 \n echo(`');

template = 'echo(`' + template + '`);';

// 
let script = 
`(function parse(data) {
	let output = '';
	function echo(html) {
		output += html;
	}

	${ template }

	return output;
})`;

return script;

// 
function compile(template) {
	const evalExpr = /<%= (.+?)%>/g;
	const expr = /<%([\s\S]+?)%>/g;

	template = template
		.replace(evalExpr, '`); \n echo( $1 ); \n echo(`')
		.replace(expr, '`); \n $1 \n echo(`');

	template = 'echo(`' + template +'`);';

	let script = 
	`(function parse(data) {
		let output = '';

		function echo(html) {
			output += html;
		}

		${ template }

		return output;
	})`

	return script;
}

// 
let parse = eval(compile(template));
div.innerHTML = parse({ supplies: ['broom', 'mop', 'cleaner'] });
//   <ul>
//     <li>broom</li>
//     <li>mop</li>
//     <li>cleaner</li>
//   </ul>


/* 7.标签模板 */

alert `123`
// 等同于
alert(123)

let a = 5;
let b = 10;
tag`Hello ${ a + b } world ${ a * b }`;
// tag是函数， 等同于
tag(['Hello ', ' world ', ''], 150, 50);
// 上面代码中，模板字符串前面有一个标识名tag，它是一个函数。
// 整个表达式的返回值，就是tag函数处理模板字符串后的返回值。

// 函数tag依次会接收到多个参数
function tag(stringArr, value1, value2) {
	// ...
}
// 等同于
function tag(stringArr, ...values) {
	// ...
}

// 
let a = 5;
let b = 10;
function tag(s, v1, v2) {
	console.log(s[0]);
	console.log(s[1]);
	console.log(s[2]);
	console.log(v1);
	console.log(v2);

	return 'OK';
}

tag`Hello ${ a + b } world ${ a * b }`;
// 'Hello '
// ' world '
// ''
// 15
// 50
// 'OK'

// 下面这个例子展示了，如何将各个参数按照原来的位置拼合回去
let total = 30;
let msg = passthru`The total is ${total} (${total*1.05} with tax)`;

function passthru(literals) {
	let result = '';
	let i = 0;

	while(i < literals.length) {
		result += literals[i++];
		if(i < arguments.length) {
			result += arguments[i];
		}
	}
	return result;
}
msg // 'The total is 30(31.5 with tax)'

// passthru函数采用 rest 参数的写法如下
function passthru(literals, ...value) {
	let output = '';
	let index;
	for(index = 0; index < value.length; index++) {
		output += literals[index] + values[index];
	}
	output += literals[index]
	return output;
}

// “标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
function SaferHTML(tempateData) {
	let s = templateData[0];
	for(let i = 0; i < arguments.length; i++) {
		let arg = String(arguments[i]);

		// Escape special characters in the substitution.
		s += arg.replace(/$/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');

		// Don't escape special characters in the template.
		s += templateData[i];
	}
	return s;
}

// 
let sender = '<script>alert('abc')</script>'; // 恶意代码
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

message
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>

// 标签模板的另一个应用，就是多语言转换（国际化处理）
i18n`Welcome to &{siteName}, you are visitor nunber ${visitorNumber}!`
// '欢迎访问xxx， 您是第xxx位访问者！'



/* 8.模板字符串的限制 */

















/*
* 第五章 字符串的新增方法
*/


/* 1.String.fromCodePpint() */

// ES5 提供"String.fromCharCode()"方法，用于从 Unicode 码点返回对应字符
// 但是这个方法不能识别码点大于0xFFFF的字符
String.fromCharCode(0x20BB7)
// "ஷ"


// ES6 提供了"String.fromCodePoint()"方法，可以识别大于0xFFFF的字符
String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true

/* 2.String.raw() */

String.raw`Hi\n${2+3}!`
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

String.raw`Hi\u000A!`
// 实际返回 "Hi\\u000A!"，显示的是转义后的结果 "Hi\u000A!"

String.raw`Hi\\n`
// 返回 "Hi\\\\n"

String.raw`Hi\\n` === 'Hi\\\\n' // true

// `foo${1 + 2}bar`
// 等同于
String.raw({raw: ['foo', 'bar']}, 1 + 2) // 'foo3bar'


String.raw = function(strings, ...values) {
	let output = '';
	let index;
	for(index = 0; index < values.length; index++) {
		output += strings.raw[index] + values[index];
	}

	output += strings.raw[index]
	return output;
}

/* 3.实例方法: codePointAt() */
// ES6 提供了codePointAt()方法，能够正确处理4个字节储存的字符
// 返回一个字符的码点

let s = '𠮷a';
s.codePointAt(0); // 134071
s.codePointAt(1); // 57271

s.codePointAt(2); // 97


let s = '𠮷a';
for(let ch of s) {
	console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61

let arr = [...'𠮷a'];
arr.forEach(
	ch => console.log(ch.codePointAt(0).toString(16));
);
// 20bb7
// 61

function is32Bit(c) {
	return c.codePointAt(0) > 0xFFFF;
}

is32Bit('𠮷'); // true
is32Bit('a'); // false


/* 4.实例方法：normalize() */
/* 5.实例方法：includes(), startsWith(), endsWidth() */
let s = 'Hello world!';
s.startsWith('Hello'); // true
s.endsWith('!'); // true
s.includes('o'); // true

let s = 'Hello world!';
s.startsWith('world', 6); // true
s.endsWith('Hello', 5); // true
s.includes('Hello', 6); // false


/* 6.实例方法：repeat() */
'x'.repeat(3) // 'xxx'
'hello'.repeat(2) // 'hellohello'
'na'.repeat(0) // ''
'nana'.repeat(2.9) // 'nana'
'na'.repeat(Infinity) // RangeError
'na'.repeat(-1) // RangeError
'na'.repeat(-0.9) // ''
'na'.repeat(NaN) // ''
'na'.repeat('na') // ''
'na'.repeat('3') // 'nanana'


/* 7.实例方法：padStart(), padEnd() */
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'


'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

'abc'.padStart(10, '0123456789') // '0123456abc'
'x'.padStart(4) // '   x'
'x'.padEnd(4) // '   x'

'1'.padStart(10, '0') // '0000000001'
'12'.padStart(10, '0') // '0000000012'
'123456'.padStart(10, '0') // '0000123456'

'12'.padStart(10, 'YYYY-MM-DD') // 'YYYY-MM-12'
'09-12'.padStart(10, 'YYYY-MM-DD') // 'YYYY-09-12'


/* 8.实例方法：trimStart(), trimEnd() */
const s = ' abc ';
s.trim() // 'abc'
s.trimStart() // 'abc '
s.trimEnd() // ' abc'

/* 9.实例方法：matchAll() */












/*
* 第六章 正则的扩展(略)
*/

/*
* 第七章 数值的扩展
*/


/* 1.二进制和八进制表示法 */

/* 2.Number.isFinite(), Number.isNaN */
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false

Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true


isFinite(25) // true
isFinite('25') // true
Number.isFinite(25) // true
Number.isFinite('25') // false

isNaN(NaN) // true
isNaN('NaN') // true
Number.isNaN(NaN) // true
Number.isNaN('NaN') // false
Number.isNaN(1) // false


/* 3.Number.parseInt(), Number.parseFloat() */
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45

Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true

/* 4.Number.isInteger() */
Number.isInteger(25) // true
Number.isInteger(25.1) // false

Number.isInteger(25) // true
Number.isInteger(25.0) // true

Number.isInteger() // false
Number.isInteger(null) // false
Number.isInteger('15') // false
Number.isInteger(true) // false

Number.isInteger(3.0000000000000002) // true
Number.isInteger(5E-324) // false
Number.isInteger(5E-325) // true

/* 5.Number.EPSILON */
Number.EPSILON === Math.pow(2, -52) // true
Number.EPSILON // 2.220446049250313e-16
Number.EPSILON.toFixed(20) // "0.00000000000000022204"

function withinErrorMargin(left, right) {
	return Math.abs(left - right) < Number.EPSILON*Math.pow(2, 2);
}

0.1 +0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true

/* 6.安全数和Number.isSafeInteger() */

Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false

Number.isSafeInteger(3) // true
Number.isSafeInteger(1.2) // false
Number.isSafeInteger(9007199254740990) // true
Number.isSafeInteger(9007199254740992) // false

Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false

Number.isSafeInteger = function(n) {
	return (typeof n === 'number' &&
		Math.round(n) === n &&
		Number.MIN_SAFE_INTEGER < = N &&
		n <= Number.MAX_SAFE_INTEGER);
}

function trusty(left, right, result) {
	if(
		Number.isSafeInteger(left) &&
		Number.isSafeInteger(right) &&
		Number.isSafeInteger(result)
	) {
		return result;
	}
	throw new RangeError('Operation cannot be trusted!')
}

trusty(9007199254740993, 990, 9007199254740993 - 990)
// RangeError: Operation cannot be trusted!

trusty(1, 2, 3) // 3


/* 7.Math对象的扩展 */

Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.12345) // -0

Math.trunc('123.45') // 123
Math.trunc(true) // 1
Math.trunc(false) // 0
Math.trunc(null) // 0

Math.trunc(NaN) // NaN
Math.trunc('foo') // NaN
Math.trunc() // NaN
Math.trunc(undefined) // NaN

Math.trunc = Math.trunc || function(x) {
	return x < 0 ? Math.ceil(x) : Math.floor(x);
}


Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN

Math.sign('') // 0
Math.sign(true) // +1
Math.sign(false) // 0
Math.sign(null)  // 0
Math.sign('9') // +1
Math.sign('foo') // NaN
Math.sign() // NaN
Math.sign(undefined) // NaN

Math.sign = Math.sin || function(x) {
	x = +x; // convert to a number
	if(x === 0 || isNaN(X)) {
		return x;
	}
	return x > 0 ? 1 : -1;
};

...















/*
* 第八章 函数的扩展
*/


/* 1.函数参数的默认值 */
function log(x, y) {
	y = y || 'World';
	console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World

if(typeof y === 'undefined') {
	y = 'World';
}

function log(x, y = 'World') {
	console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello

function Point(x = 0, y = 0) {
	this.x = x;
	this.y = y;
}
const p = new Point();
p // {x: 0, y: 0}

function foo(x = 5) {
	let x = 1; // error
	const x = 2; // error
}

// 不报错
function foo(x, x, y) {
	// ...
}

// 报错
function foo(x, x, y) {
	// ...
}
// SyntaxError: Duplicate parameter name not allowed in this context



let x = 99;
function foo(p = x + 1) {
	console.log(p);
}
foo() // 100

x = 100;
foo() // 101

function foo(x, y = 5) {
	console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined

function foo({x, y = 5} = {}) {
	console.log(x, y);
}

foo() // undefined 5

function fetch(url, { body = '', method = 'GET', headers = {} }) {
	console.log(method);
}

fetch('http://example.com', {})
// GET

fetch('http://example.com')
// 报错

function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
	console.log(method);
}
fetch('http://example.com')
// 'GET'

// 写法一
function m1({x = 0, y = 0} = {}) {
	return [x, y]
}
// 写法二
function m2({x, y} = {x: 0, y: 0}) {
	return [x, y];
}


// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x和y都有值的情况
m1({x:3, y:8}) // [3, 8]
m2({x:3, y:8}) // [3, 8]

// x有值，y无值的情况
m1({x:3}) // [3, 0]
m2({x:3}) // [3, undefined]

// x和y都无值的情况
m1({}) // [0, 0]
m2({}) // [undefined, undefined]

m1({z:3}) // [0, 0]
m2({z:3}) // [undefined, undefined]


// 例一
function f(x = 1, y) {
	return [x, y];
}
f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) // 报错
f(undefined, 1) // [1, 1]

// 例二
function f(x, y = 5, z) {
	return[x, y, z];
}
f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, , 2) // 报错
f(1, undefined, 2) // [1, 5, 2]


function foo(x = 5, y = 6) {
	console.log(x, y);
}
foo(undefined, null) // 5 null


(function(a) {}).length // 1
(function(a = 5) {}).length // 0
(function(a, b, c = 5)).length

(function(...args) {}).length // 0
(function(a = 0, b, c) {}).length // 0
(function(a, b = 1, c) {}).length // 1

var x = 1;
function f(x, y = x) {
	console.log(y);
}
f(2) // 2

let x = 1;
function f(y = x) {
	let x = 2;
	console.log(y);
}
f() // 1

function f(y = x) {
	let x = 2;
	console.log(y);
}
f() // ReferenceError: x is not defined

var x = 1;
function foo(x = x) {
	// ...
}
foo() // ReferenceError: x is not defined

let foo = 'outer';
function bar(func = () => foo) {
	let foo = 'inner';
	console.log(func());
}

bar(); // outer

function bar(func = () => foo) {
	let foo = 'inner';
	console.log(func());
}
bar() // ReferenceError: foo is not defined

var x = 1;
function foo(x, y = function() {x = 2;}) {
	var x = 3;
	y();
	console.log(x);
}
foo() // 3
x // 1


var x = 1;
function foo(x, y = function() {x = 2; }) {
	x = 3;
	y();
	console.log(x);
}
foo() // 2
x // 1




/* 1.函数参数的默认值 */
/* 1.函数参数的默认值 */
/* 1.函数参数的默认值 */
/* 1.函数参数的默认值 */
/* 1.函数参数的默认值 */
/* 1.函数参数的默认值 */
/* 1.函数参数的默认值 */





















































