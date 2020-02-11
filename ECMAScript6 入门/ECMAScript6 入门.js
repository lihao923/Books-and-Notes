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


function throwIfMissing() {
	throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
	return mustBeProvided;
}

foo() // Error: Missing parameter

function foo(optional = undefined) { // ... }



/* 2.rest参数 */
function add(...values) {
	let sum = 0;
	for(var val of values) {
		sum += val;
	}
	return sum;
}

add(2, 5, 3) // 10




// arguments变量的写法
function sortNumbers() {
	return Array.prototype.slice.call(arguments).sort();
}
// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();




function push(array, ...items) {
	items.forEach(function(item) {
		array.push(item);
		console.log(item);
	});
}
var a = [];
push(a, 1, 2, 3)



// 报错
function f(a, ...b, c) {
	// ...
}



(function(a) {}).length // 1
(function(...a) {}).length // 0
(function(a, ...b) {}).length // 1



/* 3.严格模式 */
function doSomething(a, b) {
	'use strict';
	// code
}

// 报错
function doSomething(a, b = a) {
	'use strict';
	// code
}

// 报错
const doSomething = function({a, b}) {
	'use strict';
	// code
}

// 报错
const doSomething = (...a) => {
	'use strict';
	// code
}

const obj = {
	// 报错
	doSomething({a, b}) {
		'use strict';
		// code
	}
};


// 报错
function doSomething(value = 070) {
	'use strict';
	return value;
}


'use strict';
function doSomething(a, b = a) {
	// code
}

const doSomething = (function () {
	'use strict';
	return function(value = 42) {
		return value;
	};
}());



/* 4.name属性 */

function foo() {}
foo.name // 'foo'



var f = function() {};
// ES5
f.name // ''

// ES6
f.name // 'f'




var bar = function baz() {};
// ES5
bar.name // 'baz'

// ES6
bar.name // 'baz'


(new Function).name // 'anonymous'


function foo() {};
foo.bind({}).name // 'bound foo'
(function {}).bind({}).name // 'bound'



/* 5.箭头函数 */

var f = v => v;
// 等同于
var f = function(v) {
	return v
}


var f = () => 5;
// 等同于
var f = function() {
	return 5;
}

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
	return num1 + num2;
}

var sum = (num1, num2) => {
	return num1 + num2
}


// 报错
let getTempItem = id => {id: id, name: 'Temp'};

// 不报错
let getTempItem = id => ({id: id, name: 'Temp'});


let fn = () => void doesNotReturn();


const full = ({first, last}) => first + '' + last;
// 等同于
function full(person) {
	return person.first + '' + person.last
}


// 正常函数写法
[1, 2, 3].map(function(x) {
	return x * x;
});
// 箭头函数写法
[1, 2, 3].map(x => x * x);


// 正常函数写法
var result = values.sort(function(a, b) {
	return a - b;
});
// 箭头函数写法
var result = values.sort((a, b) => a - b );


const numbers = (...nums) => nums;
numbers.(1, 2, 3, 4, 5) // [1, 2, 3, 4, 5]

const headAndTail = (head, ...tail) => [head, tail];
headAndTail(1, 2, 3, 4, 5) // [1, [2, 3, 4, 5]]



function foo() {
	setTimeout(() => {
		console.log('id: ', this.id)
	}, 100);
}
var id = 21;
foo.call({id: 42}); // id: 42



function Timer() {
	this.s1 = 0;
	this.s2 = 0;

	//箭头函数
	setInterval(() => this.s1++, 1000);

	//普通函数
	setInterval(function() {
		this.s2++;
	}, 1000);
}
var timer = new Timer();
setTimeout(() => console.log('s1:', timer.s1), 3100);
setTimeout(() => console.log('s2:', timer.s2), 3100);
// s1: 0
// s2: 0


var handler = {
	id:'12345',
	init: function() {
		document.addEventListener('click', event => this.doSomething(event.type), false);
	},

	doSomething: function(type) {
		console.log('Handling ' + type + ' for ' + this.id);
	}
};



// ES6
function foo() {
	setTimeout(() => {
		console.log('id:', this.id);
	}, 100);
}

// ES5
function foo() {
	var _this = this;
	setTimeout(function() {
		console.log('id:', _this.id);
	}, 100)
}



function foo() {
	return () => {
		return () => {
			return () => {
				console.log('id:', this.id);
			}
		}
	}
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1



function foo() {
	setTimeout(() => {
		console.log('args:', arguments);
	}, 100);
}
foo(2, 4, 6, 8)
// args: [2, 4, 6, 8]


(function() {
	return [
		(() => this.x).bind({x: 'inner'})()
	];
}).call({x: 'outer'});
// ['outer']




/* 6.尾调用优化 */

function f(x) {
	return g(x)
}

// 情况一
function f(x) {
	let y = g(x);
	return y;
}
// 情况二
function f(x) {
	return g(x) + 1;
}
// 情况三
function f(x) {
	g(x);
}

function f(x) {
	g(x);
	return undefined;
}

function f(x) {
	if(x > 0) {
		return m(x)
	}
	return n(x);
}


function f() {
	let m = 1;
	let n = 2;
	return (m + n);
}
f();
// 等同于
function f() {
	return g(3);
}
f();

// 等同于
g(3);


function addOne(a) {
	var one = 1;
	function inner(b) {
		return b + one;
	}
	return inner(a)
}


// 尾递归
function factorial(a) {
	if(n === 1) {
		return 1;
	}
	return n * factorial(n - 1);
}
factorial(5) // 120


function factorial(n, total) {
	if(n === 1) {
		return total;
	}

	return factorial(n - 1, n * total);
}
factorial(5, 1) // 120


// 非尾递归
function Fibonacci(n) {
	if( n <= 1) {
		return 1;
	}
	return Fibonacci(n - 1) + Fibonacci(n - 2)
}

Fibonacci(10) // 89
Fibonacci(100) // 超时
Fibonacci(500) // 超时

// 尾递归
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
	if(n <= 1) {
		return ac2;
	}

	return Fibonacci2(n - 1, ac2, ac1 + ac2);
}
Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity



function tailFactorial(n, total) {
	if(n === 1) {
		return total;
	}

	return tailFactorial(n - 1, n * total);
}

function factorial(n) {
	return tailFactorial(n, 1);
}

factorial(5) // 120



function currying(fn, n) {
	return function(m) {
		return fn.call(this, m, n);
	};
}

function tailFactorial(n, total) {
	if(n === 1) {
		return total
	}
	return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorail, 1);
factorial(5) // 120



function factorial(n, total = 1) {
	if(n === 1) {
		return total;
	}

	return factorial(n - 1, n * total);
}
factorial(5) // 120


function restricted() {
	'use strict';
	restricted.caller; //报错
	restricted.arguments; // 报错
}
restricted()


function sum(x, y) {
	if(y > 0) {
		return sum(x + 1, y - 1);
	} else {
		return x;
	}
}
sum(1, 10000)
// Uncaught RangeError: Maximum call stack size exceeded(…)

// 蹦床函数
function trampoline(f) {
	while (f && f instanceof Function) {
		f = f();
	}
	return f;
}

function sum(x, y) {
	if(y > 0) {
		return sum.bind(null, x + 1, y - 1);
	} else {
		return x;
	}
}

trampoline(sum(1, 100000)) // 100001



function tco(f) {
	var value;
	var active = false;
	var accumulated = [];

	return function accumulator() {
		accumulated.push(arguments);
		if(!active) {
			active = true;
			while(accumulated.length) {
				value = f.apply(this, accumulated.shift());
			}
			active = false;
			return value;
		}
	};
}

var sum = tco(function(x, y) {
	if(y > 0) {
		return sum(x + 1, y - 1) 
	} else {
		return x;
	}
});

sum(1, 100000)
// 100001


/* 7.函数参数的尾逗号 */
function clownsEverywhere(param1, param2) {
	//... 
}
clownsEverywhere('foo', 'bar');

// ES2017
function clownsEverywhere(param1, param2,) {
	//... 
}
clownsEverywhere('foo', 'bar',);



/* 8.Function.prototype.toString() */

function /* foo comment */ foo() {}
foo.toString()
// function foo() {}

// ES2019
function /* foo comment */ foo() {}
foo.toString()
// 'function /* foo comment */ foo() {}'



/* 9.catch命令的参数省略 */
try {
	// ...
} catch(err) {
	// 处理错误
}

// ES2019
try {
	// ...
} catch {
	// ...
}










/*
* 第九章 数组的扩展
*/


/* 1.扩展运算符 */
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>] 




function push(array, ...items) {
	array.push(...items);
}

function add(x, y) {
	return x + y;
}

const numbers = [1, 48];
add(...numbers)



function f(v, w, x, y, z) {
	const args = [0, 1]
}
f(-1, ...args, 2, ...[3]);



const arr = [
	...(x > 0 ? ['a']:[]),
	'b',
];


[...[], 1]
// [1]

(...[1, 2])
// Uncaught SyntaxError: Unexpected number

console.log((...[1, 2]))
// Uncaught SyntaxError: Unexpected number

console.log(...[1, 2])
// 1 2


// ES5的写法
function f(x, y, z) {
	// ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
	// ...
}
let args = [0, 1, 2];
f(...args);



// ES5的写法
Math.max.apply(null, [14, 3, 77])

// ES6的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77)



// ES5的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);


// ES5
new (Date.bind.apply(Date, [null, 2015, 1, 1]))
// ES6
new Date(...[2015, 1, 1])


const a1 = [1, 2];
const a2 = a1;
a2[0] = 2;
a1 // [2, 2]

// ES5
const a1 = [1, 2];
const a2 = a1.concat();
a2[0] = 2;
a1 // [1, 2]

// ES6
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;


const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5的合并数组
arr1.concat(arr2, arr3);
// ['a', 'b', 'c', 'd', 'e']

// ES6的合并数组
[...arr1, ...arr2, ...arr3]
// ['a', 'b', 'c', 'd', 'e']


const a1 = [{foo: 1}]
const a2 = [{bar: 2}]

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true


//ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list


const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest // [2, 3, 4, 5]

const [first, ...rest] = []
first // undefined
rest // []

const [first, ...rest] = ['foo']
first // 'foo'
rest // []


const [...butLast, last] = [1, 2, 3, 4, 5]
// 报错
const [first, ..middle, last] = [1, 2, 3, 4, 5]
// 报错


[...'hello'] // ['h', 'e', 'l', 'l', 'o']

functin length(str) {
	return [...str].length;
}
length('x\uD83D\uDE80y') // 3

let str = 'x\uD83D\uDE80y';
str.split('').reverse().join('')
// 'y\uDE80\uD83Dx'

[...str].reverse().join('')
// 'y\uDE80\uD83Dx'


let nodelist = document.querySelectorAll('div');
let array = [...nodelist];

Number.prototype[Symbol.iterator] = function*() {
	let i = 0;
	let num = this.valueOf();
	while (i < num) {
		yield i++;
	}
}
console.log([...5]) // [0, 1, 2, 3, 4]


function arrayLike = {
	'0': 'a',
	'1': 'b',
	'2': 'c',
	length: 3
};

// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike];

let map = new Map([
	[1, 'one'],
	[2, 'two'],
	[3, 'three'],
]);
let arr = [...map.keys()]; // [1, 2, 3]


const go = function*() {
	yield 1;
	yield 2;
	yield 3;
};
[...go()] // [1, 2, 3]


const obj = {a: 1, b: 2};
let arr = [...obj]; // TypeError: Cannot spread non-iterable object




/* 2.Array.from() */

let arrayLike = {
	'0': 'a',
	'1': 'b',
	'2': 'c',
	length: 3
};
// ES5
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']


// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
	return p.textContent.length > 100;
});

// arguments对象
function foo() {
	var args = Array.from(arguments)
}


Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

let nameSet = new Set(['a', 'b'])
Array.from(nameSet) // ['a', 'b']



// arguments对象
function foo() {
	const args = [...arguments];
}
// NodeList对象
[...document.querySelectorAll('div')]


Array.from({length: 3});
// [undefined, undefined, undefined]



const toArray = (() => {
	Array.from ? Array.from : obj => [].slice.call(obj)
})();



Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x)
Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]


let spans = document.querySelectorAll('span.name');
// map()
let names1 = Array.prototype.map.call(spans, s => s.textContent);
// Array.from()
let names2 = Array.from(spans, s => s.textContent)


Array.from([1, , 2, , 3], (n) => n || 0)
// [1, 0, 2, 0, 3]

function typesOf() {
	return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']



Array.from({length: 2}, () => 'jack')
// ['jack', 'jack']


function countSymbols(string) {
	return Array.from(string).length;
}


/* 3.Array.of() */

Array.of(3, 11, 8) // [3, 11, 8]
Array.of(3) // [3]
Array.of(3).length // 1


Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]


Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]


function ArrayOf() {
	return [].slice.call(arguments);
}


/* 4.数组实例的copyWithin() */
Array.prototype.copyWithin(target, start = 0, end = this.length);

[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]

[].copyWithin.call({length: 5, 3:1}, 0, 3)
// {0: 1, 3: 1, length: 5}


[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]




/* 5.数组实例的find()和findIndex() */
[1, 4, -5, 10].find((n) => n < 0)
// -5

[1, 5, 10, 15].find(function(value, index, arr) {
	return value > 9
})
// 10

[1, 5, 10, 11].findIndex(function(value, index, arr) {
	return value > 9
})
// 2

function f(v) {
	return v > this.age
}
let person = {name: 'John', age: 20}
[10, 12, 26, 15].find(f, person); // 26

[NaN].indexOf(NaN) // -1
[NaN].findIndex( y => Object.is(NaN, y)) // 0


/* 6.数组实例的fill() */

['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']

let arr = new Array(3).fill({name: 'Mike'});
arr[0].name = 'Ben';
arr
// [{name: 'Ben'}, {name: 'Ben'}, {name: 'Ben'}]

let arr = new Array(3).fill([]);
arr[0].push(5)
// [[5], [5], [5]]



/* 7.数组实例的entries(), keys()和values() */
for(let index of ['a', 'b'].keys()) {
	console.log(index);
}
// 0
// 1

for(let elem of ['a', 'b'].values()) {
	console.log(elem);
}
// 'a'
// 'b'

for(let [index, elem] of ['a', 'b'].entries()) {
	console.log(index, elem);
}
// 0 'a'
// 1 'b'


let letter = ['a', 'b', 'c'];
let entries = letter.entries()
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']



/* 8.数组实例的includes() */
[1, 2, 3].includes(2) // true
[1, 2, 3].includes(4) // false
[1, 2, NaN].includes(NaN) // true


[1, 2, 3].includes(3, 3) // false
[1, 2, 3].includes(3, -1) // true


if(arr.indexOf(el) !== -1) {
	// ...
}

[NaN].indexOf(NaN) // -1
[NaN].includes(NaN) // true


const contains = (() =>
	Array.prototype.includes 
	? (arr, value) => arr.includes(value)
	: (arr, value) => arr.some(el => el === value)
)();
contains(['foo', 'bar'], 'baz'); // => false


/* 9.数组实例的flat(), flatMap() */
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]

[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]

[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]

[1, 2, 3, 4, 5].flat()
// [1, 2, 4, 5]



// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]


// 相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
[1, 2, 3, 4].flatMap(x => [[x * 2]])
// [[2], [4], [6], [8]]

arr.flatMap(function callback(currentValu[, index[, array]])) {
	// ...
}[, thisArg]


/* 10.数组的空位 */
Array(3) // [, , ,]

0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false

// forEach方法
[, 'a'].forEach((x, i) => console.log(i)); // 1

// filter方法
['a', , 'b'].filter(x => true) // ['a', 'b']

// every
[, 'a'].every(x => x === 'a') // true

// reduce
[1, , 2].reduce((x, y) => x + y) // 3

// some
[, 'a'].some(x => x !== 'a') // false

// map
[, 'a'].map(x => 1) // [, 1]

// join
[, 'a', undefined, null].join('#') // '#a##'

// toString
[, 'a', undefined, null].toString() // ',a,,'


Array.from(['a', , 'b'])
// ['a', undefined, 'b']

[,'a','b',,].copyWithin(2, 0) // [,'a',,'a']

new Array(3).fill('a') // ['a', 'a', 'a']

let arr = [, ,];
for(let i of arr) {
	console.log(1);
}
// 1
// 1

// entries()
[...[, 'a'].entries()] // [[0, undefined], [1, 'a']]

// keys()
[...[, 'a'].keys()] // [0, 1]

// values()
[...[, 'a'].values()] // [undefined, 'a']

// find()
[, 'a'].find(x => true) // undefined

// findIndex()
[, a].findIndex(x => true) // 0


/* 11.Array.prototype.sort()的排序稳定性 */
const arr = ['peach', 'straw', 'apple', 'spork'];
const stableSorting = (s1, s2) => {
	if(s1[0] < s2[0]) {
		return -1;
	}
	return 1;
};

arr.sort(stableSorting)
// ['apple', 'peach', 'straw', 'spork']

const unstableSorting = (s1, s2) => {
	if(s1[0] <= s2[0]) {
		return -1;
	}
	return 1
};
arr.sort(unstableSorting)
// ['apple', 'peach', 'spork', 'straw']










/*
* 第十章 对象的扩展
*/


/* 1.属性的简洁表示法 */
const foo = 'bar'；
cosnt baz = {foo};
baz // {foo: 'bar'}

// 等同于
const baz = {foo: foo}


function f(x, y) {
	return {x, y};
}
// 等同于
function f(x, y) {
	return {x: x, y: y};
}
f(1, 2) // Object {x: 1, y: 2}



cosnt o = {
	method() {
		return 'Hello!';
	}
}
// 等同于
const o = {
	method: function() {
		return 'Hello!'
	}
}


let birth = '2000/01/01';
const Person = {
	name: '张三',
	// 等同于birth: birth
	birth,
	// 等同于hello: function() ...
	hello() {
		console.log('我的名字是',this.name);
	}
}


function getPoint() {
	const x = 1;
	const y = 10;
	return {x, y};
}
getPoint() // {x: 1, y: 10}



let ms = {}
function getItem(key) {
	return key in ms ? ms[key]: null;
}
function setItem(key, value) {
	ms[key] = value;
}
function clear() {
	ms = {};
}

module.exports = {getItem, setItem, clear};
// 等同于
module.exports = {
	getItem: getItem,
	setItem: setItem,
	clear: clear
}


const cart = {
	_wheels: 4,
	
	get wheels() {
		return this._wheels;
	},
	
	set wheels(value) {
		if(value < this._wheels) {
			throw new Error('数值太小了！');
		}
		this._wheels = value;
	}
}
                                                                         

let user = {
	name: 'test'
};
let foo = {
	bar: 'baz'
};
console.log(user, foo);
// {name: 'test'} {bar: 'baz'}
console.log({user, foo});
// {user: {name: 'test'}, foo: {bar: 'baz'}}


const obj = {
	f() {
		this.foo = 'bar';
	}
};
new obj.f() // 报错



/* 2.属性名表达式 */

// 方法一
obj.foo = true;
// 方法二
obj['a' + 'bc'] = 123;



let propKey = 'foo'
let obj = {
	[propKey]: true,
	['a' + 'bc']: 123
}


let lastWord = 'last word'
const a = {
	'first word': 'hello',
	[lastWord]: 'world'
};
a['first word'] // 'hello'
a[lastWord] // 'word'
a['last word'] // 'word'


let obj = {
	['h' + 'ello']() {
		return 'hi'
	}
}
obj.hello() // hi


// 报错
const foo = 'bar';
const bar = 'abc';
const baz = {[foo]};

// 正确
const foo = 'bar';
const baz = {[foo]: 'abc'}


const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
	[keyA]: 'valueA',
	[keyB]: 'valueB'
};
myObject // Object {[object Object]: 'valueB'}



/* 3.方法的name属性 */

const person = {
	sayName() {
		console.log('hello!')
	}
}

person.sayName.name // 'sayName'

const obj = {
	get foo() {},
	set foo(x) {}
};
obj.foo.name // TypeError: Cannot read property 'name' of undefined
const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
descriptor.get.name // 'get foo'
descriptor.set.name // 'set foo'


(new Function()).name // 'anonymous'
var doSomething = function() {
	// ...
};
doSomething.bind().name // 'bound doSomething'


const key1 = Symbol('description')
const key2 = Symbol();
let obj = {
	[key1]() {},
	[key2]() {},
};
obj[key1].name // '[description]'
obj[key2].name // ''




/* 4.属性的可枚举性和遍历 */

let obj = {foo: 123}
Object.getOwnPropertyDescriptor(obj, 'foo')
// {
// 	value: 123,
// 	writable: true,
// 	enumerable: true,
// 	configurable: true
// }


Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable
// false
Object.getOwnPropertyDescriptor(Object.prototype, 'length').enumerable
// false

Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable
// false


Reflect.ownKeys({[Symbol()]: 0, b: 0, 10: 0, 2: 0, a: 0})
// ['2', '10', 'b', 'a', Symbol()]



/* 5.super关键字 */

const proto = {
	foo: 'hello'
};
const obj = {
	foo: 'world',
	find() {
		return super.foo;
	}
};

Object.setPrototypeOf(obj, proto);
obj.find() // 'hello'


// 报错
const obj = {
	foo: super.foo
}
// 报错
const obj = {
	foo: () => super.foo
}
// 报错
const obj = {
	foo: function() {
		return super.foo
	}
}



const proto = {
	x: 'hello',
	foo() {
		console.log(this.x)
	},
};

const obj = {
	x: 'world',
	foo() {
		super.foo();
	}
}

Object.setPrototypeOf(obj, proto);
obj.foo() // 'world'



/* 6.对象的扩展运算符 */

let {x, y, ...z} = {x: 1, y: 2, a: 3, b: 4};
x // 1
y // 2
z // {a: 3, b: 4}


let {...z} = null; // 运行时错误
let {...z} = undefined; // 运行时错误


let {...x, y, z} = someObject; // 句法错误
let {x, ...y, ...z} = someObject // 句法错误


let obj = {a: {b: 1}};
let {...x} = obj;
obj.a.b = 2;
x.a.b // 2


let o1 = {a: 1};
let o2 = {b: 2};
o2.__proto__ = o1;
let {...o3} = o2;
o3 // {b: 2}
o3.a // undefined


const o = Object.create({x: 1, y: 2});
o.z = 3;
let {x, ...newObj} = o;
let {y, z} = newObj;
x // 1
y // undefined
z // 3

let {x, ...{y, z}} = o;
// SyntaxError: ... must be followed by an identifier in declaration contexts


function baseFunction({a, b}) {
	// ...
}
function wrapperFunction({x, y, ..restCofig}) {
	// 使用 x 和 y 参数进行操作
	// 其余参数传给原始函数
	return baseFunction(restConfig);
}



let z = {a: 3, b: 4};
let n = {...z};
n // {a: 3, b: 4}

let foo = {...['a', 'b', 'c']};
foo // {0: 'a', 1: 'b', 2: 'c'}

{...{}, a: 1} // {a: 1}

// 等同于{...Object(1)}
{...1} // {}
// 等同于 {...Object(true)}
{...true} // {}
// 等同于 {...Object(undefined)}
{...undefined} // {}
// 等同于 {...Object(null)}
{...null} // {}

{...'hello'}
// {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}

let aClone = {...a};
// 等同于
let aClone = Object.assign({}, a);


// 写法一
const clone1 = {
	__proto__: Object.getPrototypeOf(obj),
	...obj
};
// 写法二
const clone2 = Object.assign(
	Object.create(Object.getPrototypeOf(obj)),
	obj
);
// 写法三
const clone3 = Object.create(
	Object.getPrototypeOf(obj),
	Object.getOwnPropertyDescriptor(obj)
)



let ab = {...a, ...b};
// 等同于
let ab = Object.assign({}, a, b);




let aWithOverrides = {...a, x: 1, y: 2};
// 等同于
let aWidthOverrides = {...a, ...{x: 1, y: 2}};
// 等同于
let x = 1, y = 2, aWithOverrides = {...a, x, y};
// 等同于
let aWithOverrides = Object.assign({}, a, {x:1, y: 2});


let newVersion = {
	...previousVersion,
	name: 'New Name' // Override the name property
}

let aWithDefaults = {x: 1, y: 2, ...a};
// 等同于
let aWithDefaults = Object.assign({}, {x: 1, y: 2}, a);
// 等同于
let aWithDefaults = Object.assign({x: 1, y: 2}, a);

const obj = {
	...(x > 1 ? {a: 1} : {}),
	b: 2,
}


// 并不会抛出错误，因为 x 属性只是被定义，但没执行
let aWithXGetter = {
	...a,
	get x() {
		throw new Error('not throw yet');
	}
};

// 会抛出错误，因为 x 属性被执行了
let runtimeError = {
	...a,
	...{
		get x() {
			throw new Error('throw now!');
		}
	}
}



/* 7.链判断运算符 */
const firstName = (message
	&& message.body
	&& message.body.user
	&& message.body.user.firstName) || 'default';
)


const fooInput = myForm.querySelector('input[name=foo]')
const fooValue = fooInput ? fooInput.value : undefined


const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value


iterator.return?.()
iterator.return?.()


if(myForm.checkValidity?.() === false) {
	// 表单校验失败
	return;
}


a?.b
// 等同于
a == null ? undefined : a.b

a?.[x]
// 等同于
a == null ? undefined : a[x]

a?.b()
// 等同于
a == null ? undefined : a.b()

a?.()
// 等同于
a == null ? undefined : a()



a?.[++x]
// 等同于
a == null ? undefined : a[++x]

delete a?.b
// 等同于
a == null ? undefined : delete a.b



(a?.b).c
// 等价于
(a == null ? undefined : a.b).c


// 以下写法禁用
// 构造函数
new a?.()
new a?.b()

// 链判断运算符的右侧有模板字符串
a?.`{b}`
a?.b`{c}`

// 链判断运算的左侧是super
super?.()
super?.foo

// 链运算符用于赋值运算符左侧
a?.b =c


/* 8.Null判断运算符 */

const headerText = response.settings.headerText || 'Hello, World!';
const animationDuration = response.settings.animationDuration || 300;
const showSplashScreen = response.settings.showSplashScreen || true;
// 错的,属性的值如果为空字符串或false或0，默认值也会生效


const headerText = response.settings.headerText ?? 'Hello, World!';
const animationDuration = response.settings.animationDuration ?? 300;
const showSplashScreen = response.settings.showSplashScreen ?? true;


const animationDuration = response.settings?.animationDuration ?? 300;

function Component(props) {
	const enable = props.enabled ?? true;
	// ...
}
// 等同于
function Component(props) {
	const {
		enabled: enable = true
	} = props;
	// ...
}


// 报错
lhs && middle ?? rhs
lhs ?? middle && rhs
lhs || middle ?? rhs
lhs ?? middle || rhs

// 正确
(lhs && middle) ?? rhs
lhs && (middle ?? rhs)











/*
* 第十一章 对象的新增方法
*/

/* 1.Object.is() */
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false

+0 === -0 // true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true


Object.defineProperty(Object, 'is', {
	value: function(x, y) {
		if(x === y) {
			// 针对+0不等于-0的情况
			return x !== 0 || 1 / x === 1 / y;
		}
		// 针对NaN的情况
		return x !== x && y !== y;
	},
	configurable: true,
	enumerable: false,
	writable: true
});




/* 2.Object.assign() */
const target = {a: 1};
const source1 = {b: 2};
const source2 = {c: 3};

Object.assign(target, sourc1, source2);
target // {a: 1, b: 2, c: 3}


const obj = {a: 1};
Object.assign(obj) === obj // true


typeof Object.assign(2)
Object.assign(undefined) // 报错
Object.assign(null) // 报错



let obj = {a: 1};
Object.assign(obj, undefined) === obj // true
Object.assign(obj, null) === obj // true


const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // {0: 'a', 1: 'b', 2: 'c', length: 3, [[PrimitiveValue]]: 'abc'}


Object(true) // {[[PrimitiveValue]]: true}
Object(10) // {[[PrimitiveValue]]: 10}
Object('abc') // {0: 'a', 1: 'b', 2: 'c', length: 3, [[PrimitiveValue]]: 'abc'}


Object.assign({b: 'c'},
	Object.defineProperty({}, 'invisible', {
		enumerable: false,
		value: 'hello'
	})
)
// {b: 'c'}

Object.assign({a: 'b'}, {[Symbol('c')]: 'd'})
// {a: 'b', Symbol(c): 'd'}




const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
obj2.a.b // 2


const target = {a: {b: 'c', d: 'e'}}
const source = {a: {b: 'hello'}}
Object.assign(target, source)
// {a: {b: 'hello'}}



Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]


const source = {
	get foo() { return 1}
};
const target = {}
Object.assign(target, source)
// {foo: 1}




class Point{
	constructor(x, y) {
		Object.assign(this, {x, y});
	}
}


Object.assign(SomeClass.prototype, {
	someMethod(arg1, arg2) {
		// ...
	},
	anotherMethod() {
		// ...
	}
});
// 等同于下面的写法
SomeClass.prototype.someMethod = function(arg1, arg2) {
	// ...
};
SomeClass.prototype.anotherMethod = function() {
	// ...
};




function clone(origin) {
	return Object.assign({}, origin);
}

function clone(origin) {
	let originProto = Object.getPrototypeOf(origin);
	return Object.assign(Object.create(originProto), origin);
}



const merge = (target, ...sources) => Object.assign(target, ...sources);
const merge = (...source) => Object.assign({}, ...sources);



const DEFAULTS = {
	logLevel : 0,
	outputFormat: 'html'
};
function processContent(options) {
	options = Object.assign({}, DEFAULTS, options);
	console.log(optisons);
	// ...
}

const DEFAULTS = {
	url: {
		host: 'example.com',
		port: 7070
	},
};
processContent({url: {port: 8000}})
// { url: {port: 8000}}



/* 3.Object.getOwnPropertyDescriptors() */

const obj = {
	foo: 123,
	get: bar() {return 'abc'}
};
Object.getOwnPropertyDecscriptors(obj)
//{
//	foo: {
//		value: 123,
//		writable: true,
//		enumerable: true,
//		configurable: true
//	},
//	bar: {
//		get: [Function: get bar],
//		set: undefined,
//		enumerable: true,
//		configurable: true
//	}
//}


function getOwnPropertyDescriptors(obj) {
	const result = {}
	for(let key of Reflect.ownKeys(obj)) {
		result[key] = Object.getOwnPropertyDescriptor(obj, key);
	}
	return result;
}




const source = {
	set foo(value) {
		console.log(value);
	}
};

const target1 = {};
Object.assign(target1, source);
Object.getOwnPropertyDescriptor(target1, 'foo')
// {
// 	value: undefined,
// 	writable: true,
// 	enumerable: true,
// 	configurable: true
// }



const source = {
	set foo(value) {
		console.log(value);
	}
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// {
// 	get: undefined,
// 	set: [Function: set foo],
// 	enumerable: true,
// 	configurable: true
// }


const shallowMerge = (target, source) => Object.defineProperties(
	target,
	Object.getOwnPropertyDescriptors(source)
);



const clone = Object.create(Object.getPrototypeOf(obj),
	Object.getOwnPropertyDescriptors(obj)
);
// 或者
const shallowMerge = (obj) => Object.create(
	Object.getPrototypeOf(obj),
	Object.getOwnPropertyDescriptors(obj)
)



const obj = {
	__proto__: prot,
	foo: 123,
};

const obj = Object.create(prot);
obj.foo = 123;
// 或者
const obj = Object.assign(
	Object.create(prot),
	{
		foo: 123,
	}
)


const obj = Object.create(
	prot,
	Object.getOwnPropertyDescriptors({
		foo: 123
	})
)



let mix = (object) => ({
	with: (...mixins) => mixins.reduce(
		(c, mixin) => Object.create(
			c, Object.getOwnPropertyDescriptors(mixin)
		), object)
})
// multiple mixins example
let a = {a: 'a'};
let b = {b: 'b'};
let c = {c: 'c'};
let d = mix(c).width(a, b)
d.c // 'c'
d.b // 'b'
d.a // 'a'



/* 4.__proto__属性, Object.setPrototypeOf(), Object.getPrototypeOf() */
// es5
const obj = {
	method: function() {/* ... */}
}
obj.__proto__ = someOtherObj;
// es6
var obj = Object.create(someOtherObj);
obj.method = function(){/* ... */}


Object.defineProperties(Object.prototype, '__proto__', {
	get() {
		let _thisObj = Object(this);
		return Object.getPrototypeOf(_thisObj);
	},
	set(proto) {
		if(this === undefined || this === null) {
			throw new TypeError();
		}
		if(!isObject(this)) {
			return undefined;
		}
		if(!isObject(proto)) {
			return undefined;
		}
		let status = Reflect.setPrototypeOf(this, proto);
		if(!status) {
			throw new TypeError();
		}
	},
});
function isObject(value) {
	return Object(value) === value;
}


Object.getPrototypeOf({__proto__: null})  // null






// 格式
Object.setPrototypeOf(object, prototype)
// 用法
const o = Object.setPrototypeOf({}, null);
// 等同于
function setPrototypeOf(obj, proto) {
	obj.__proto__ = proto;
	return obj;
}



let proto = {};
let obj = {x: 10};
Object.setPrototypeOf(obj, proto);

proto.y = 20
proto.z = 40

obj.x // 10
obj.y // 20
obj.z // 40


Object.setPrototypeOf(1, {}) === 1 // true
Object.setPrototypeOf('foo', {}) === 'foo' // true
Object.setPrototypeOf(true, {}) === true // true

Object.setPrototypeOf(undefined, {})
// TypeError: Object.setPrototypeOf called on null or undefined
Object.setPrototypeOf(null, {})
// TypeError: Object.setPrototypeOf called on null or undefined




Object.getPrototypeOf(obj)

function Rectangle() {
	// ...
}
const rec = new Rectangle();
Object.getPrototypeOf(rec) === Rectangle.prototype
// true

Object.setPrototypeOf(rec, Object.prototype);
Object.getPrototypeOf(rec) === Rectangle.prototype
// false



// 等同于 Object.getPrototypeOf(Number(1))
Object.getPrototypeOf(1)
// Number {[[PrimitiveValue]]: 0}

// 等同于 Object.getPrototypeOf(String('foo'))
Object.getPrototypeOf('foo')
// String {length: 0, [[PrimitiveValue]]: ""}

// 等同于 Object.getPrototypeOf(Boolean(true))
Object.getPrototypeOf(true)
// Boolean {[[PrimitiveValue]]: false}

Object.getPrototypeOf(1) === Number.prototype // true
Object.getPrototypeOf('foo') === String.prototype // true
Object.getPrototypeOf(true) === Boolean.prototype // true

Object.getPrototypeOf(null)
// TypeError: Cannot convert undefined or null to object
Object.getPrototypeOf(undefined)
// TypeError: Cannot convert undefined or null to object



/* 5.Object.keys(), Object.vlaues(), Object.entries() */

var ojb = {foo: 'bar', baz: 42};
Object.keys(obj)
// ['foo', 'baz']


let {keys,  values, entries} = Object;
let obj = {a: 1, b: 2, c: 3};
for(let key of keys(obj)) {
	console.log(key); // 'a', 'b', 'c'
}
for(let value of values(obj)) {
	console.log(value); // 1, 2, 3
}
for(let [key, value] of entries(obj)) {
	console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
} 





const obj = {foo: 'bar', baz: 42};
Object.values(obj)
// ['bar', 42]

const obj = {100: 'a', 2: 'b', 7: 'c'};
Object.values(obj)
// ['b', 'c', 'a']


const obj = Object.create({}, {p: {value: 42}});
Object.values(obj) // []


const obj = Object.create({}, {p: {
	value: 42,
	enumerable: true
}});
Object.values(obj) // [42]


Object.values({[Symbol()]: 123, foo: 'abc'});
// ['abc']

Object.values('foo')
// ['f', 'o', 'o']

Object.values(42) // []
Object.values(true) // []



const obj = {foo: 'bar', baz: 42}
Object.entries(obj)
// [['foo', 'bar'], ['baz', 42]]


Object.entries({[Symbol()]: 123, foo: 'abc'});
// [['foo', 'abc']]


let obj = {one: 1, two: 2};
for(let [k, v] of Object.entries(obj)) {
	console.log(`${JSON.stringify(k)}: ${JSON.stringify(v)}`);
}
// 'one': 1
// 'two': 2


const obj = {foo: 'bar', baz: 42};
const map = new Map(Object.entries(obj));
map // Map {foo: 'bar', baz: 42}




// Gnerator
function*entries(obj) {
	for(let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}

// 非Generator函数版本
function entries(obj) {
	let arr = [];
	for(let key of Object.keys(obj)) {
		arr.push([key, obj[key]]);
	}
	return arr;
}



/* 6.Object.fromEntries() */
Object.fromEntries([
	['foo', 'bar'],
	['baz', 42]
])
// {foo: 'bar', baz: 42}



// 例一
const entries = new Map([
	['foo', 'bar'],
	['baz', 42]
]);
Object.fromEntries(entries)
// {foo: 'bar', baz: 42}

// 例二
const map = new Map().set('foo', true).set('bar', false)
Object.fromEntries(map)
// { foo: true, bar: false }


Object.fromEntries(new URLSearchParams('foo=bar$baz=qux'))
// { foo: 'bar', baz: 'qux'}

















/*
* 第十三章 Set和Map数据结构
*/

/* 1.Set */
const s = new Set();
[2,3,4,5,2,2].forEach(x => s.add(x))

for(let i of s) {
	console.log(i);
}
// 2 3 5 4




// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56
// 类似于
const set = new Set();
document.querySelectorAll('div').forEach(div => set.add(div));
set.size // 56



// 去除数组的重复成员
[...new Set(array)]

[...new Set('ababbc')].join('') // 'abc'



let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set{NaN}




let set = new Set();
set.add({});
set.size // 1

set.add({});
set.size // 2



s.add(1).add(2).add(2);
s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false



// 对象的写法
const properties = {
	'width': 1,
	'height': 1
};
if(properties[someName]) {
	// do something
}

// Set的写法
const properties = new Set();
properties.add('width');
properties.add('height');
if(properties.has(someName)) {
	// do something
}



const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);


function dedupe(array) {
	return Array.from(new Set(array));
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]


 

let set = new Set(['red', 'green', 'blue']);
for(let item of set.keys()) {
	console.log(item);
}
// red
// green
// blue

for(let item of set.values()) {
	console.log(item);
}
// red
// green
// blue

for(let item of set.entries()) {
	console.log(item);
}
// ['red', 'red']
// ['green', 'green']
// ['blue', 'blue']


Set.prototype[Symbol.iterator] === Set.prototype.values
// true


let set = new Set(['red', 'green', 'blue']);
for(let x of set) {
	console.log(x);
}
// red
// green
// blue

let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1: 1
// 4: 4
// 9: 9



let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']


let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)];
// [3, 5, 2]



let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构： {2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构： {2, 4}




let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 并集
let union = new Set([...a, ...b]); // Set {1, 2, 3, 4}
// 交集
let intersect = new Set([...a].filter(x => b.has(x))); // Set {2, 3}
// 差集
let difference = new Set([...a].filter(x => !b.has(x))); // Set {1}



// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2， 4， 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2， 4， 6




/* 2.WeakSet */

const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: Invalid value used in weak set


const  a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}


const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)


const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);
ws.has(window); // true
ws.has(foo); // false
ws.delete(window); 
ws.has(window); // false


ws.size // undefined
ws.forEach // undefined
ws.forEach(function(item){ console.log('WeakSet has ' + item )})
// TypeError: undefined is not a function



const foos = new WeakSet();
class Foo {
	constructor() {
		foos.addthis)
	}

	method() {
		if(!foo.has(this)) {
			throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
		}
	}
}



/* 3.Map */

const data = {}
const element = document.getElementById('myDiv');
data[element] = 'metadata';
data['[object HTMLDivElement]'] // 'metadata'

const m = new Map();
const o = {p: 'Hello world!'};

m.set(o, 'content');
m.get(o) // 'content'
m.has(o) // true
m.delete(o) // true
m.has(o) // false



const map = new Map([
	['name', '张三'],
	['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // '张三'
map.has('title') // true
map.get('title') // 'Author'


const items = [
	['name', '张三'],
	['title', 'Author']
];

const map = new Map();
items.forEach(
	([key, value]) => map.set(key, value)
);



const set = new Set([
	['foo', 1],
	['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1
const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3




const map = new Map();
map.set(1, 'aaa').set(1, 'bbb');
map.get(1) // 'bbb'



new Map.get('assdfefeddef')
// undefined


const map = new Map();
map.set(['a'], 555);
map.get(['a']) // undefined




const map = new Map();
const k1 = ['a'];
const k2 = ['a'];

map.set(k1, 111).set(k2, 222);
map.get(k1) // 111
map.get(k2) // 222




let map = new Map();
map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123)
map.get(NaN) // 123




const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2



const m = new Map();
m.set('edition', 6) // 键是字符串
m.set(262, 'standard') // 键是数值
m.set(undefined, 'nah') // 键是undefined



let map = new Map()
	.set(1, 'a')
	.set(2, 'b')
	.set(3, 'c')



const m = new Map();
const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数
m.get(hello) // 'Hello ES6'





const m = new Map();
m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition') // true
m.has('years') // false
m.has(262) // true
m.has(undefined) // true




const m = new Map();
m.set(undefined, 'nah');
m.has(undefined) // true
m.delete(undefined);
m.has(undefined) // false



let map = new Map();
map.set('foo', true);
map.set('bar', false);
map.size // 2
map.clear()
map.size // 0



const map = new Map([
	['F', 'no'],
	['T', 'yes'],
]);

for(let key of map.keys()) {
	console.log(key);
}
// 'F'
// 'T'

for(let key of map.values()) {
	console.log(value);
}
// 'no'
// 'yes'

for(let [key, value] of map.entries()) {
	console.log(key, value);
}
// 'F' 'no'
// 'T' 'yes'

// 等同于使用map.entries()
for(let [key, value] of map) {
	console.log(key, value);
}
// 'F' 'no'
// 'T', 'yes'

map[Symbol.iterator] === map.entries // true



const map = new Map([
	[1, 'one'],
	[2, 'two'],
	[3, 'three'],
]);
[...map.keys()] // [1, 2, 3]
[...map.values()] // ['one', 'two', 'three']
[...map.entries()] // [[1,'one'], [2, 'two'], [3, 'three']]
[...map] // [[1,'one'], [2, 'two'], [3, 'three']]




const map0 = new Map()
	.set(1, 'a')
	.set(2, 'b')
	.set(3, 'c');

const map1 = new Map(
	[...map0].filter((k, v) => k < 3)
);
// 产生Map结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
	[...map0].map(([k, v]) => [k * 2, '_' + v])
);
// 产生Map结构 {2 => '_a', 4 => '_b', 6 => '_c'}


map.forEach(function(value, key, map) {
	console.log('Key: %s, Value: %s', key, value);
});


const reporter = {
	report: function(key, value) {
		console.log('Key: %s, Value: %s', key, value);
	}
};
map.forEach(function(value, key, map) {
	this.report(key, value);
}, reporter)





const myMap = new Map()
	.set(true, 7)
	.set({foo: 3}, ['abc']);
[...myMap] // [[true, 7], [{foo: 3}, ['abc']]]


new Map([
	[true, 7],
	[{foo: 3}, ['abc']]
])

// Map{
// 	true => 7
// 	Object {foo: 3} => ['abc']
// }



function strMapToObj(map) {
	let obj = Object.create(null);
	for(let [k, v] of strMap) {
		obj[k] = v;
	}
	return obj;
}

const myMap = new Map()
	.set('yes', true)
	.set('no', false);
strMap(myMap)
// {yes: true, no: false}


function objToStrMap(obj) {
	let strMap = new Map();
	for(let k of obj.keys(obj)) {
		strMap.set(k, obj[k]);
	}
	return strMap;
}
objToStrMap({yes: true, no: false})
// Map {'yes' => true, 'no' => false}



function strMapToJson(strMap) {
	return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap) // '{"yes": true, "no": false}'


function mapToArrayJson(map) {
	return JSON.stringify([...map]);
}
let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap) // '[[true, 7], [{"true": 3}, ["abc"]]]'



function jsonToStrMap(jsonStr) {
	return objToStrMap(JSON.parse(jsonStr));
}
jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, "no" => false}

function jsonToMap(jsonStr) {
	return new Map(JSON.parse(jsonStr));
}
jsonToMap('[[true, 7], [{"foo": 3}, ["abc"]]]');
// Map {true => 7, Object {foo: 3} => ['abc']};








/* 4 .WeakMap */
// WeakMap可以使用set方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap也可以接受一个数组，作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // 'bar'


const map = new WeakMap();
map.set(1, 2) 
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key



const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information');
wm.get(element) // 'some information'


const wm = new WeakMap();
let key = {};
let obj = {foo: 1}

wm.set(key, obj);
obj = null;
wm.get(key) // Object {foo: 1}



let myElement = document.getElementById('logo')
let myWeakMap = new WeakMap();

myWeakMap.set(myElement, {timesClick: 0});
myElement.addEventListener('click', function() {
	let logoData = myWeakMap.get(myElement);
	logoData.timesClick++;
}, false);

const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
	constructor(counter, action) {
		_counter.set(this, counter);
		_action.set(this, action);
	}
	dec() {
		let counter = _counter.get(this)
		if(counter < 1) {
			return;
		}
		counter--;
		_counter.set(this, counter);
		if(counter === 0) {
			_action.get(this)();
		}
	}
}
const c = new Countdown(2, () => console.log('DONE'));
c.dec()
c.dec()
// DONE




/*
* 第十五章 Reflect
*/

/* 1.概述 */

// 老写法
try {
	Object.defineProperty(target, property, attributes);
	// success
} catch(e) {
	// failure
}
// 新写法
if(Reflect.defineProperty(target, property, attributes)) {
	// success
} else {
	// failure
}


// 老写法
'assign' in Object // true
// 新写法
Reflect.has(Object, 'assign') // true



Proxy(target, {
	set: function(target, name, value, receiver) {
		var success = Reflect.set(target, name, value, receiver);
		if(success) {
			console.log('Propery ' + name + ' on ' + target + ' set to ' + value);
		}
		return success;
	}
})



var loggedObj = new Proxy(obj, {
	get(target, name) {
		console.log('get', target, name);
		return Reflect.get(target, name);
	},
	deleteProperty(target, name) {
		console.log('delete' + name);
		return Reflect.deleteProperty(target, name);
	},
	has(target, name) {
		console.log('has' + name);
		return Reflect.has(target, name);
	}
})


// 老写法
Function.property.apply.call(Math.floor, undefined, [1.75]) // 1
// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1



/* 2.静态方法 */

var myObject = {
	foo: 1,
	bar: 2,
	get baz() {
		return this.foo + this.bar;
	}
}
Reflect.get(myObject, 'foo') // 1
Reflect.get(myObject, 'bar') // 2
Reflect.get(myObject, 'baz') // 3

var myObject = {
	foo: 1,
	bar: 2,
	get baz() {
		return this.foo + this.bar;
	},
};
var myReceiverObject = {
	foo: 4,
	bar: 4,
};
Reflect.get(myObject, 'baz', myReceiverObject) // 8


Reflect.get(1, 'foo')  // 报错
Reflect.get(false, 'foo') // 报错




var myObject = {
	foo: 1,
	set bar(value) {
		return this.foo = value;
	},
}

myObject.foo // 1
Reflect.set(myObject, 'foo', 2);
myObject.foo // 2
Reflect.set(myObject, 'bar', 3);
myObject.foo // 3


var myObject = {
	foo: 4,
	set bar(value) {
		return this.foo = value;
	},
};
var myReceiverObject = {
	foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4
myReceiverObject.foo // 1



let p = { a: 'a'};
let handler = {
	set(target, key, value, receiver) {
		console.log('set');
		Reflect.set(target, key, value, receiver)
	},
	defineProperty(target, key, attribute) {
		console.log('defineProperty');
		Reflect.defineProperty(target, key, attribute);
	}
}
let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty



let p = { a: 'a'};
let handler = {
	set(target, key, value, receiver) {
		console.log('set');
		Reflect.set(target, key, value)
	},
	defineProperty(target, key, attribute) {
		console.log('defineProperty');
		Reflect.defineProperty(target, key, attribute);
	}
}
let obj = new Proxy(p, handler);
obj.a = 'A';
// set

Reflect.set(1, 'foo', {}) // 报错
Reflect.set(false, 'foo', {}) // 报错



var myObj = {
	foo: 1
};
// 旧写法
'foo' in myObj // true
// 新写法
Reflect.has(myObj, 'foo')




const myObj = {foo: 'bar'};
// 旧写法
delete myObj.foo;
// 新写法
Reflect.deleteProperty(myObj, 'foo');




function Greeting(name) {
	this.name = name;
}
// new 的写法
const instance = new Greeting('张三');
// Reflect.construct的写法
const instance = Reflect.construct(Greeting, ['张三']);




const myObj = new FancyThing();
// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype;
// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype;

Object.getPrototypeOf(1); // Number {[[PrimitiveValue]]: 0}
Reflect.getPrototypeOf(1); // 报错



const myObj = {};
// 旧写法
Object.setPrototypeOf(myObj, Array.prototype);
// 新写法
Reflect.setPrototypeOf(myObj, Array.prototype);

myObj.length // 0

Reflect.setPrototypeOf({}, null) // true
Reflect.setPrototypeOf(Object.freeze({}), null) // false

Object.setPrototypeOf(1, {}) // 1
Reflect.setPrototypeOf(1, {}) 
// TypeError: Reflect.setPrototypeOf called on non-object

Object.setPrototypeOf(null, {})
// TypeError: Object.setPrototypeOf called on null or undefined
Reflect.setPrototypeOf(null, {})
// TypeError: Reflect.setPrototypeOf called on null or undefined





const ages = [11, 33, 12, 54, 18, 96]
// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);




function myDate() {
	// ...
}
// 旧写法
Object.defineProperty(myDate, 'now', {
	value: () => Date().now()
})
// 新写法
Reflect.defineProperty(myDate, 'now', {
	value: () => Date().now()
});

const p = new Proxy({}, {
	defineProperty(target, prop, descriptor) {
		console.log(descriptor);
		return Reflect.defineProperty(target, prop, descriptor);
	}
});
p.foo = 'bar';
// {value: 'bar', writable: true, enumerable: true, configurable: true}
p.foo // 'bar'




var myObj = {}
Object.defineProperty(myObj, 'hidden', {
	value: true,
	enumerable: false
});
// 旧写法
var theDescriptor = Object.getOwnPropertyDescriptor(myObj, 'hidden');
// 新写法
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObj, 'hidden');



const myObject = {};
// 旧写法
Object.isExtensible(myObject) // true
// 新写法
Reflect.isExtensible(myObject) // true

Object.isExtensible(1) // false
Reflect.isExtensible(1) // 报错





var myObj = {};
// 旧写法
Object.preventExtensions(myObj) // Object{}
// 新写法
Reflect.preventExtensions(myObj) // true

// es5
Object.preventExtensions(1) // 报错
// es6
Object.preventExtensions(1) // 1
// 新写法
Reflect.preventExtensions(1) // 报错



var myObj = {
	foo: 1,
	bar: 2,
	[symbol.for('baz')]: 3,
	[symbol.for('bing')]: 4
};
// 旧写法
Object.getOwnPropertyNames(myObj);
// ['foo', 'bar']
Object.getOwnPropertySymbols(myObj);
// [Symbol(baz), Symbol(bing)]
// 新写法
Reflect.ownKeys(myObj);
// ['foo', 'bar', Symbol(baz), Symbol(bing)]




/* 3.实例：使用Proxy实现观察者模式 */

const person = observable({
	name: '张三',
	age: 20
});
function print() {
	console.log(`${person.name}, ${person.age}`)
}
observe(print);
person.name = '李四';
// 输出
// 李四， 20

const = queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
	const result = Reflect.set(target, key, value, receiver);
	queuedObservers.forEach(observer => observer());
	return result;
}










/*
* 第十六章 Promise对象
*/

/* 1.Promise的含义 */
/* 2.基本用法 */

const promise = new Promise(function(resolve, reject) {
	// ...some code
	if(/*异步操作成功*/) {
		resolve(value);
	} else {
		reject(error);
	}
})


promise.then(function(value) {
	// success
}, function(error) {
	// failure
})




function timeout(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms, 'done');
	});
}
timeout(100).then((value) => {
	console.log(value)
})




let promise = new Promise(function(resolve, reject) {
	console.log('Promise');
	resolve();
});

promise.then(function() {
	console.log('resolved')
});

console.log('Hi')

// Promise
// Hi
// resolved


function loadImageAsync(url) {
	return new Promise(function(resolve, reject) {
		const image = new Image();
		image.onload = function() {
			resolve(image);
		};

		image.onerror = function() {
			reject(new Error('Could not load image at' + url));
		};

		image.src = url;
	});
}



const getJSON = function(url) {
	const promise = new Promise(function(resolve, reject) {
		const handler = function() {
			if(this.readyState !== 4) {
				return;
			}
			if(this.status === 200) {
				resolve(this.response);
			} else {
				reject(new Error(this.statusText));
			}
		};

		const client = new XMLHttpRequest();
		client.open('GET', url);
		client.onreadystatechange = handler;
		client.responseType = 'json';
		client.setRequestHeader('Accept', 'application/json');
		client.send();
	});
	return promise;
};

getJSON('/posts.json').then(function(json) {
	console.log('Contents: ' + json);
}, function(error) {
	console.error('出错了', error);
})




const p1 = new Promise(function(resolve, reject) {
	// ...
})
const p2 = new Promise(function(resolve, reject) {
	// ...
	resolve(p1);
})



const p1 = new Promise(function(resolve, reject) {
	setTimeout(() => reject(new Error('fail')), 3000)
})
 const p2 = new Promise(function(resolve, reject) {
		setTimeout(() => resolve(p1), 1000)
})

p2
	.then(result => console.log(result))
	.catch(error => console.log(error))



new Promise((resolve, reject) => {
	resolve(1);
	console.log(2);
}).then(r => {
	console.log(r)
})



new Promise((resolve, reject) => {
	return resolve(1);
	// 后面的语句不会执行
	console.log(2);
})





/* 3.Promise.prototype.then() */
getJSON('/posts.json').then(function(json) {
	return json.post;
}).then(function(post) {
	// ...
})


getJSON('/post/1.json').then(function(post) {
	return getJSON(post.commentURL);
}).then(function(comments) {
	console.log('resolve: ' + comments);
}, function(err) {
	console.log('rejected: ', err)
})



getJSON('post/1.json').then(
	post => getJSON(post.commentURL)
).then(
	comments => console.log('resovled: ', comments),
	err => console.log('rejected: ', err)
);



/* 4.Promise.prototype.catch() */
getJSON('/posts.json').then(function(posts) {
	// ...
}).catch(function(error) {
	// 处理 getJSON 和 前一个回调函数运行时发生的错误
	console.log('发生错误！', error)
});



p.then((val) => console.log('fulfilled: ', val))
	.catch((err) => console.log('rejected: ', err));

// 等同于
p.then((val) => console.log('fulfilled: ', val))
	.then(null, (err) => console.log('rejected: ', err));


const promise = new Promise(function(resovle, reject) {
	throw new Error('test');
});
promise.catch(function(error) {
	console.log(error);
});
// Error: test



// 写法一
const promise = new Promise(function(resolve, reject) {
	try {
		throw new Error('test');
	} catch(e) {
		reject(e)
	}
});
promise.catch(function(error) {
	console.log(error);
})

// 写法二
const promise = new Promise(function(resolve, reject) {
	reject(new Error('test'));
});
promise.catch(function(error) {
	console.log(error);
})



const promise = new Promise(function(resove, reject) {
	resolve('ok');
	throw new Error('test');
});
promise
	.then(function(value) { console.log(value) })
	.catch(function(error) { console.log(error) })
// ok


getJSON('/post/1.json').then(function(post) {
	return getJSON(post.commentURL);
}).then(function(comments) {
	// some code
}).catch(function(error) {
	// 处理前面三个Promise产生的错误
});



// bad
promise
	.then(function(data) {
		// success
	}, function(err) {
		// error
	});
// good
promise
	.then(function(data) {
		// success
	})
	.catch(function(err) {
		// error
	});


const someAsyncTing = function() {
	return new Promise(function(resolve, reject) {
		// 下面一行会报错，因为x没有声明
		resolve(x + 2);
	});
};
someAsyncThing().then(function() {
	console.log('everything is great');
});
setTimeout(() => console.log(123), 2000);
// Uncaught(in promise) ReferenceError: x is not defined
// 123



process.on('unhandleRejection', function(err, p) {
	throw err;
})



const promise = new Promise(function(resolve, reject) {
	resolve('ok');
	setTimeout(function() {throw new Error('test')}, 0)
});
promise.then(function(value){console.log(value)});
// ok
// Uncaught Error: test



const someAsyncThing = function() {
	return new Promise(function(resolve, reject) {
		// 下面一行会报错，因为x没有声明
		resolve(x + 2);
	});
};
someAsyncThing()
	.catch(function(error) {
		console.log('oh no', error)
	})
	.then(function() {
		console.log('carry on')
	})
// oh no [ReferenceError: x is not defined]
// carry on

Promise.resolve()
	.catch(function(err) {
		console.log('oh no', err)
	})
	.then(function() {
		console.log('carry on')
	});
// carry on





const someAsyncThing = function() {
	return new Promise(function(resolve, reject) {
		// 下面一行会报错，因为x没有声明
		resolve(x + 2);
	});
};
someAsyncThing().then(function() {
	return someOtherAsyncThing();
}).catch(function(error) {
	console.log('oh no', error);
	// 下面一行会报错，因为y没有声明
	y + 2
}).then(function() {
	console.log('carry on');
})
// oh no [ReferenceError: x is not defined]



someAsyncThing().then(function() {
	return someOtherAsyncThing();
}).catch(function(error) {
	console.log('oh no', error);
	// 下面一行会报错，因为y没有声明
	y + 2;
}).catch(function(error) {
	console.log('carry on', error);
});
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]



/* 5.Promise.prototype.finally() */

promise
	.then(result => { ... })
	.catch(error => { ... })
	.finally(() => { ... })

server.listen(port)
	.then(function() {
		// ...
	})
	.finally(server.stop);




promise
	.finally(() => {
	// ...
});
// 等同于
promise
	.then(result => {
		// ...
		return result;
	}, error => {
		// ...
		throw error;
	});



Promise.prototype.finally = function(callback) {
	let P = this.constructor;
	return this.then(
		value => P.resolve(callback()).then(() => value),
		reason => P.resolve(callback()).then(() => {throw reason})
	)
}


// resolve的值是undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve的值是2
Promise.resolve(2).finally(() => {})

// reject的值是undefined
Promise.reject(3).then(() => {}, () => {})

// reject的值是3
Promise.reject(3).finally(() => {})




/* 6.Promise.all() */

const p = Promise.all([p1, p2, p3]);



// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function(id) {
	return getJSON('/post/' + id + '.json');
});
Promise.all(promises).then(function(posts) {
	// ...
}).catch(function(reason)) {
	// ...
}

const databasePromise = connectDatabase();
const booksPromise = databasePromise.then(findAllBooks);
const userPromise = databasePromise.then(getCurrentUser);

Promise.all([
	booksPromise,
	userPromise
]).then(([books, user]) => pickTopRecommendations(books, user));


const p1 = new Promise((resolve, reject) => {
	resolve('hello');
})
	.then(result => result)
	.catch(e => e);

cosnt p2 = new Promise((resolve, reject) => {
	throw Error('报错了');
})
	.then(result => result)
	.catch(e => e);

Promise.all([p1, p2])
	.then(result => console.log(result))
	.catch(e => console.log(e));
// ['hello', Error: 报错了]



const p1 = new Promise((resolve, reject) => {
	resolve('hello');
}).then(result => result)

cosnt p2 = new Promise((resolve, reject) => {
	throw Error('报错了');
}).then(result => result)

Promise.all([p1, p2])
	.then(result => console.log(result))
	.catch(e => console.log(e));
// Error: 报错了





/* 7.Promise.race() */

const p = Promise.race([p1, p2, p3]);



const p = Promise.race([
	fetch('/resource-that-may-take-a-while'),
	new Promise(function(resolve, reject) {
		setTimeout(() => reject(new Error('request timeout')), 5000)
	})
]);

p.then(console.log).catch(console.error);



/* 8.Promise.allSettleed() */
const promises = [
	fetch('/api-1'),
	fetch('/api-2'),
	fetch('/api-3'),
]
await Promise.allSettled(promises)
removeLoadingIndicator();



const resolved = Promise.resolve(42);
cosnt rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function(results) {
	console.log(results);
})
// [
// 	 {status: 'fulfilled', value: 42}
// 	 {status: 'rejected', reason: -1}
// ]



const promises = [fetch('index.html'), fetch('https://does-not-exist/')];
const results = await Promise.allSettled(promises)

// 过滤出成功的请求
const successfulPromises = results.filter(p => p.status === 'fulfilled');

// 过滤出失败的请求，并输出原因
const errors = results.filter(p => p.status === 'rejected').map(p => p.reason);



const url = [ /* ... */]
const requests = url.map(x => fetch(x));

try {
	await Promise.all(requests);
	console.log('所有请求都成功。');
} catch {
	console.log('至少一个请求失败，其他请求可能还没结束。');
}



/* 9.Promise.any() */

const promise = [
	fetch('endpoint-a').then(() => 'a'),
	fetch('endpoint-b').then(() => 'b'),
	fetch('endpoint-c').then(() => 'c'),
];
try {
	const first = await Promise.any(promises);
	console.log(first);
} catch {
	console.log(error);
}



new AggregateError() extends Array -> AggregateError
const err = new AggregateError();
err.push(new Error('first error'));
err.push(new Error('second error'));
throw err;


Promise.any(promises).then((first) => {
	// Any of the promises was fulfilled.
}, (error) => {
	// All of the promises were rejected.
})


var resolved = Promises.resolve(42);
var rejected = Promises.rejected(-1);
var alsoRejected = Promise.reject(Infinity);
Promise.any([resolved, rejected, alsoRejected]).then(function(result) {
	console.log(result); // 42
});
Promise.any([rejected, alsoRejected]).catch(function(results) {
	console.log(results)// [-1, Infinity]
});



/* 10.Promise.resolve() */
const jsPromise = Promise.resolve($.ajax('/whatever.json'));

Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))


let thenable = {
	then: function(resolve, reject) {
		resolve(42);
	}
}
let p1 = Promise.resolve(thenable);
p1.then(function(value) {
	console.log(value);
})



const p = Promise.resolve('Hello');
p.then(function(s) {
	console.log(s)
});
// Hello



const p = Promise.resolve();
p.then(function(){/* ... */})




setTimeout(function() {
	console.log('time');
}, 0);
Promise.resolve().then(function() {
	console.log('two');
});

console.log('one');
// one
// two
// three

// 上面代码中，setTimeout(fn, 0)在下一轮“事件循环”开始时执行，
// Promise.resolve()在本轮“事件循环”结束时执行，
// console.log('one')则是立即执行，因此最先输出



/* 11.Promise.reject() */
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
p.then(null, function(s) {
	console.log(s);
});
// 出错了


const thenable = {
	then(resolve, reject) {
		reject('出错了');
	}
};

Promise.reject(thenable).catch(e => {
	console.log(e === thenable)
})
// true


/* 12.应用 */

const preloadImage = function(path) {
	return new Promise(function(resolve, reject) {
		const image = new Image();
		image.onload = resolve;
		image.onerror = reject;
		image.src = path;
	})
}



function getFoo() {
	return new Promise(function(resolve, reject) {
		resolve('foo');
	});
}
const g = function*() {
	try {
		const foo = yield getFoo();
		console.log(foo);
	} catch(e) {
		console.log(e);
	}
};

function run(generator) {
	const it = generator();
	function go(result) {
		if(result.done) {
			return result.value;
		}
		return result.value.then(function(value) {
			return go(it.next(value));
		}, function(error) {
			return go(it.throw(error))
		});
	}
	go(it.next());
}
run(g);



/* 13.Promise.try() */

Promise.resolve().then(f)

const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now


const f = () => console.log('now');
(async () => f())();
console.log('next');
// now
// next


(async () => f())().then(...).catch(...)


const f = () => console.log('now');
(() => new Promise(resolve => resolve(f())))();
console.log('next');
// now
// next


const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next



function getUsername(userId) {
	return database.users.get({id: userId}).then(function(user) {return user.name});
}

database.users.get({id: userId}).then(...).catch(...)

try{
	database.users.get({id: userId})
		.then(...)
		.catch(...)
} catch{
	// ...
}


Promise.try(() => database.users.get({id: userId}))
	.then(...)
	.catch(... )




/*
* 第十七章 Iterator和for...of循环
*/

/* 1.Iterator(遍历器)的概念 */

var it = makeIterator(['a', 'b']);
it.next() // {value: 'a', done: false}
it.next() // {value: 'b', done: false}
it.next() // {value: undefined, done: true}
function makeIterator(array) {
	var nextIndex = 0;
	return {
		next: function() {
			return nextIndex < array.length ?
			{value: array[nextIndex++], done: false} :
			{value: undefined, done: true}
		}
	}
}



function makeIterator(array) {
	var nextIndex = 0;
	return {
		next: function() {
			return nextIndex < array.length ?
			{value: array[nextIndex++]}: {done: true}
		}
	}
}





var it = idMaker();
it.next().value // 0
it.next().value // 1
it.next().value // 2
// ...

function idMaker() {
	var index = 0;
	return {
		next: function() {
			return {value: index++, done: false}
		}
	}
}




/* 2.默认Iterator接口 */
const obj = {
	[Symbol.iterator]: function() {
		return {
			next: function() {
				return {
					value: 1,
					done: true
				}
			}
		}
	}
}




let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // {value: 'a', done: false}
iter.next() // {value: 'b', done: false}
iter.next() // {value: 'c', done: false}
iter.next() // {value: undefined, done: true}




class RangeIterator {
	construct(start, stop) {
		this.value = start;
		this.stop = stop;
	}

	[Symbol.iterator]() {return this;}

	next() {
		var value = this.value;
		if(value < this.stop) {
			this.value++;
			return {done: false, value: value};
		}
		return {done: true, value: undefined};
	}
}
function range(start, stop) {
	return new RangeIterator(start, stop);
}
for(var value of range(0, 3)) {
	console.log(value) // 0, 1, 3
}




function Obj(value) {
	this.value = value;
	this.next = null;
}
Obj.prototype[Symbol.iterator] = function() {
	var iterator = { next: next };

	var current = this;

	function next() {
		if(current) {
			var value = current.value;
			current = current.next;
			return {done: false, value: value}
		} else {
			return {done: true};
		}
	}
	return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for(var i of one) {
	console.log(i) // 1, 2, 3
}




let obj = {
	data: ['hello', 'world'],
	[Symbol.iterator]() {
		const self = this;
		let index = 0;
		return {
			next() {
				if(index < self.data.length) {
					return {
						value: self.data.[index++],
						done: false
					};
				} else {
					return {value: undefined, done: true}
				}
			}
		}
	}
}




NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
[...document.querySelectorAll('div')]// 可以执行了


let iterable = {
	0: 'a',
	1: 'b',
	2: 'c',
	length: 3,
	[Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for(let item of iterable) {
	console.log(item) // 'a', 'b', 'c'
}


let iterable = {
	a: 'a',
	b: 'b',
	c: 'c',
	length: 3,
	[Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for(let item of iterable) {
	console.log(item) // undefined, undefined, undefined
}


var obj = {};
obj[Symbol.iterator] = () => 1;
[...obj] // TypeError: [] is not a function


var $iterator = ITERABLE[Symbol.iterator]();
var $result = $iterator.next();
while(!$result.done) {
	var x = $result.value;
	// ...
	$result = $iterator.next()
}



/* 3.调用Iterator接口的场合 */
(1)解构赋值
let set = new Set().add('a').add('b').add('c')

let [x, y] = set;
// x = 'a'; y = 'b'

let[first, ...rest] = set;
// first = 'a'; rest = ['b', 'c'];

(2)扩展运算符
// 例一
var str = 'hello';
[...str] // ['h', 'e', 'l', 'l', 'o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd'] // ['a', 'b', 'c', 'd']


let arr = [...iterable];

(3)yield*

let generator = function* () {
	yield 1;
	yield*[2, 3, 4];
	yield 5;
};
var iterator = generator();
iterator.next() // {value: 1, done: false}
iterator.next() // {value: 2, done: false}
iterator.next() // {value: 3, done: false}
iterator.next() // {value: 4, done: false}
iterator.next() // {value: 5, done: false}
iterator.next() // {value: undefined, done: true}


(4)其他场合
- for ... of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()
- Promise.all()
- Promise.race()




/* 4.字符串的Iterator接口 */
var someString = 'hi';
typeof someString[Symbol.iterator] // 'function'

var iterator = someString[Symbol.iterator]();
iterator.next() // {value: 'h', done: false}
iterator.next() // {value: 'i', done: false}
iterator.next() // {value: undefined, done: true}



var str = new String('hi');
[...str] // ['h', 'i']

str[Symbol.iterator] = function() {
	return {
		next: function() {
			if(this._first) {
				this._first = false;
				return {value: 'bye', done: false}
			} else {
				return {done: true};
			}
		},
		_first: true
	};
};
[...str] // ['bye']
str // 'hi'



/* 5.Iterator接口与Generator函数 */
let myIterable = {
	[Symbol.iterator]: function* () {
		yield 1;
		yield 2;
		yield 3;
	}
}
[...myIterable] // [1, 2, 3]
// 或者采用下面的简洁写法
let obj = {
	* [Symbol.iterator]() {
		yield 'hello';
		yield 'world';
	}
};

for(let x of obj) {
	console.log(x);
}
// 'hello'
// 'world'


/* 6.遍历器对象的return(), throw() */

function readLinesSync(file) {
	return {
		[Symbol.iterator]() {
			return {
				next() {
					return {done: false};
				},
				return() {
					file.close();
					return {done: true}
				}
			};
		},
	};
}


// 情况一
for(let line of readLinesSync(fileName)) {
	console.log(line);
	break;
}

// 情况二
for(let line of readLineSync(fileName)) {
	console.log(line);
	throw new Error();
}




/* 7.for...of循环 */

const arr = ['red', 'green', 'blue'];
for(let v of arr) {
	console.log(v); // red green blue
}
const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);

for(let v of obj) {
	console.log(v); // red green blue
}


const arr = ['red', 'green', 'blue'];
arr.forEach(function(element, index) {
	console.log(element); // red green blue
	console.log(index); // 0 1 2
})



var arr = ['a', 'b', 'c', 'd'];
for(let a in arr) {
	console.log(a); // 0 1 2 3
}

for(let a of arr) {
	console.log(a) // a b c d
}



let arr = [3, 5, 7];
arr.foo = 'hello';
for(let i in arr) {
	console.log(i) // '0', '1', '2', 'foo'
}
for(let i of arr) {
	console.log(i); // '3', '5', '7'
}




var engines = new Set(['Gecko', 'Trident', 'Webkit', 'Webkit']);
for(var e of engines) {
	console.log(e);
}
// Gecko
// Trident
// Webkit

var es6 = new Map();
es6.set('edition', 6);
es6.set('committee', 'TC39');
es6.set('standard', 'ECAM-262');
for(var [name, value] of es6) {
	console.log(name + ':' + value);
}
// edition: 6
// committee: TC39
// standard: ECMA-262


let map = new Map().set('a', 1).set('b', 2);
for(let pair of map) {
	console.log(pair);
}
// ['a', 1]
// ['b', 2]

for(let [key, value] of map) {
	console.log(key + ':' + value)
}
// a:1
// b:2


let arr = ['a', 'b', 'c'];
for(let pair of arr.entries()) {
	console.log(pair);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']




// 字符串
let str = 'hello';
for(let s of str) {
	console.log(s); // h e l l o
}
// DOM NodeList对象
let paras = document.querySelectorAll('p');
for(let p of paras) {
	p.classList.add('test');
}
// arguments对象
function printArgs() {
	for(let x of arguments) {
		console.log(x);
	}
}
printArgs('a', 'b')
// 'a'
// 'b'

let arrayLike = {length: 2, 0: 'a', 1: 'b'};
// 报错
for(let x of arrayLike) {
	console.log(x);
}
// 正确
for(let x of Array.from(arrayLike)) {
	console.log(0);
}




let es6 = {
	edition: 6,
	committee: 'TC39',
	standard: 'ECMA-262'
};
for(let e in es6) {
	console.log(e);
}
// edition
// committee
// standard
for(let e of es6) {
	console.log(e);
}
// TypeError: es6[Symbol.iterator] is not a function


for(var key of Object.keys(someObject)) {
	console.log(key + ':' + someObject[key]);
}

function*entries(obj) {
	for(let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}

for(let [key, value] of entries(obj)) {
	console.log(key, '->', value);
}
// a -> 1
// b -> 2
// c -> 3



for(var n of fibonacci) {
	if(n > 1000) {
		break;
	}
	console.log(n);
}



/*
*
* 第十八章 Generator函数的语法
*
*/


/* 1.简介 */

function* helloWorldGenerator() {
	yield 'hello';
	yield 'world';
	return 'ending';
}
var hw = helloWorldGenerator();

hw.next() // {value: 'hello', done: false}
hw.next() // {value: 'world', done: false}
hw.next() // {value: 'ending', done: true}
hw.next() // {value: undefined, done: true}


function* f() {
	console.log('执行了！')
}
var generator = f();
setTimeout(function() {
	generator.next()
}, 2000); 


var arr = [1, [[2, 3], 4], [5, 6]];
var flat = function* (a) {
	a.forEach(function(item) {
		if(typeof item !== 'number') {
			yield* flat(item);
		} else {
			yield item;
		}
	});
};
for(var f of flat(arr)) {
	console.log(f);
}



var arr = [1, [[2, 3], 4], [5, 6]];
var flat = function* (a) {
	var length = a.length;
	for(var i = 0; i < length; i++) {
		var item = a[i];
		if(typeof item !== 'number') {
			yield* flat(item);
		} else {
			yield item
		}
	}
};
for(var f of flat(arr)) {
	console.log(f);
}
// 1, 2, 3, 4, 5, 6


function* demo() {
	console.log('Hello' + yield); // SyntaxError
	console.log('Hello' + yield 123); // SyntaxError

	console.log('Hello' + (yield)); // OK
	console.log('Hello' + (yield 123)); // OK
}


var myIterable = {}
myIterable[Symbol.iterator] = function* () {
	yield 1;
	yield 2;
	yield 3;
};
[...myIterable] // [1, 2, 3]



function* gen() {
	// some code
}
var g = gen();
g[Symbol.iterator]() === g
// true


/* 2.next方法的参数 */
function* f() {
	for(var i = 0; true; i++) {
		var reset = yield i;
		if(reset) { i = -1; }
	}
}
var g = f();
g.next(); // {value: 0, done: false}
g.next(); // {value: 1, done: false}
g.next(true); // {value: 0, done: false}


function* foo(x) {
	var y = 2 * (yield (x + 1));
	var z = yield (y / 3);
	return (x + y + z);
}
var a = foo(5);
a.next() // Object{value: 6, done: false}
a.next() // Object{value: NaN, done: false}
a.next() // Object{value: NaN, done: true}

var b = foo(5);
b.next() // {value: 6, done: false}
b.next() // {value: 8, done: false}
b.next() // {vlaue: 42, done: true}


function* dataConsumer() {
	console.log('Started');
	console.log(`1. ${yield}`);
	console.log(`2. ${yield}`);
	return 'result';
}
let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a');
// 1.a
genObj.next('b');
// 2.b



function wrapper(generatorFunction) {
	return function(...args) {
		let generatorOject = generatorFunction(...args);
		generatorObject.next();
		return generatorObject;
	};
}
const wrapped = wrapper(function* () {
	console.log(`First input; ${yield}`);
	return 'DONE';
});
wrapped().next('hello!')
// First input: hello!



/* 3.for...of循环 */

function* foo() {
	yield 1;
	yield 2;
	yield 3;
	yield 4;
	yield 5;
	return 6;
}
for(let v of foo()) {
	console.log(v);
}
// 1 2 3 4 5


function* fibonacci() {
	let [prev, curr] = [0, 1]
	for(;;) {
		yield curr;
		[prev, curr] = [curr, prev + curr];
	}
}
for(let n of fibonacci()) {
	if(n > 1000) break;
	console.log(n);
}



function* objectEntries(obj) {
	let propKeys = Reflect.ownKeys(obj);
	for(let propKey of propKeys) {
		yield [propKey, obj[propKey]];
	}
}
let jane = {first: 'Jane', last: 'Doe'};
for(let [key, value] of objectEntries(jane)) {
	console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe


function* objectEntries() {
	let propKeys = Object.keys(this);
	for(let propKey of propKeys) {
		yield [propKey, this[propKey]];
	}
}
let jane = {first: 'Jane', last: 'Doe'};
jane[Symbol.iterator] = objectEntries;

for(let [key, value] of jane) {
	console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe


function* numbers() {
	yield 1
	yield 2
	return 3
	yield 4
}
// 扩展运算符
[...numbers()] // [1, 2]

// Array.from方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of循环
for(let n of numbers()) {
	console.log(n);
}
// 1
// 2


/* 4.Generator.prototype.throw() */

var g = function* () {
	try {
		yield;
	} catch(e) {
		console.log('内部捕获', e);
	}
};

var i = g();
i.next();

try {
	i.throw('a');
	i.throw('b');
} catch(e) {
	console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b



var g = function* () {
	try {
		yield;
	} catch(e) {
		console.log(e);
	}
};
var i = g();
i.next();
i.throw(new Error('出错了！'))；
// Error：出错了！


var g = function* () {
	while(true) {
		try{
			yield;
		} catch(e) {
			if(e != 'a') {
				throw e;
			}
			console.log('内部捕获', e);
		}
	}
};

var i = g();
i.next();

try{
	throw new Error('a');
	throw new Error('b');
} catch(e) {
	console.log('外部捕获', e);
}
// 外部捕获 [Error: a]


var g = function* () {
	while(true) {
		yield;
		console.log('内部捕获', e);
	}
};
var i = g();
i.next();

try {
	i.throw('a');
	i.throw('b');
} catch(e) {
	console.log('外部捕获', e);
}
// 外部捕获 a



var gen = function* gen() {
	yield console.log('hello');
	yield console.log('world');
}
var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined


function* gen() {
	try {
		yield 1;
	} catch(e) {
		console.log('内部捕获');
	}
}
var g = gen();
g.throw(1);
// Uncaught 1



var gen = function* gen() {
	try {
		yield console.log('a');
	} catch(e) {
		// ...
	}
	yield console.log('b');
	yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b
g.next() // c




var gen = function* gen() {
	yield console.log('hello');
	yield console.log('world');
}
var g = gen();
g.next();

try {
	throw new Error();
} catch(e) {
	g.next();
}
// hello
// world



function* foo() {
	var x = yield 3;
	var y = x.toUpperCase();
	yield y;
}
var it = foo();
it.next(); // {value: 3, done: false}

try{
	it.next(42);
} catch(err) {
	console.log(err);
}




function* g() {
	yield 1;
	console.log('throwing an exception');
	throw new Error('generator broke!');
	yield 2;
	yield 3;
}
function log(generator) {
	var v;
	console.log(`starting generator`);
	try{
		v = generator.next();
		console.log('第一次运行next方法', v);
	} catch(err) {
		console.log('捕捉错误', v);
	}

	try{
		v = generator.next();
		console.log('第二次运行next方法', v);
	} catch(err) {
		console.log('捕捉错误', v);
	}

	try{
		v = generator.next();
		console.log('第三次运行next方法', v);
	} catch(err) {
		console.log('捕捉错误', v);
	}

	console.log('caller done');
}
log(g());
// starting generator
// 第一次运行next方法 {value: 1, done: false}
// throwing an exception
// 捕捉错误 {value: 1, done: false}
// 第三次运行next方法 {value: undefined, done: true}
// caller done



/* 5.Generator.prototype.return() */

function* gen() {
	yield 1;
	yield 2;
	yield 3;
}
var g = gen();
g.next() // {value: 1, done: false}
g.return('foo') // {value: 'foo', done: true}
g.next() // {value: undefined, done: true}



function* gen() {
	yield 1;
	yield 2;
	yield 3;
}
var g = gen();
g.next() // {value: 1, done: false}
g.return // {value: undefined, done: true}


function* numbers() {
	yield 1;
	try{
		yield 2;
		yield 3;
	} finally {
		yield 4;
		yield 5;
	}
	yield 6;
}
var g = numbers();
g.next() // {value: 1, done: false}
g.next() // {value: 2, done: false}
g.return(7) // {value: 4, done: false}
g.next() // {value: 5, done: false}
g.next() // {value: 7, done: true}




/* 6.next(), throw(), return()的共同特点 */
const g = function* (x, y) {
	let result = yield x + 7;
	return result;
};
const gen = g(1, 2);
gen.next(); // Object{vlaue: 3, done: false}
gen.next(1); // Object{}
// 相当于将 let result =  yield x + y
// 替换成 let result = 1

gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));

gen.return(2); // Object(value: 2, done: true)
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;




/* 7.yield*表达式 */
function* foo() {
	yield 'a';
	yield 'b';
}
function* bar() {
	yield 'x';
	// 手动遍历foo()
	for(let i of foo()) {
		console.log(i);
	}
	yield 'y';
}
for(let v of bar()) {
	console.log(v);
}
// x
// a
// b
// y



function* bar() {
	yield 'x';
	yield* foo();
	yield 'y';
}

// 等同于
function* bar() {
	yield 'x';
	yield 'a';
	yield 'b';
	yield 'y';
}

// 等同于
function* bar() {
	yield 'x';
	for(let v of foo()) {
		yield v;
	}
	yield 'y';
}

for(let v of bar()) {
	console.log(v);
}
// 'x'
// 'a'
// 'b'
// 'y'



function* inner() {
	yield 'hello!';
}
function* outer1() {
	yield 'open';
	yield inner();
	yield 'close';
}

var gen = outer1();
gen.next().value // 'open'
gen.next().value // 返回一个遍历器对象
gen.next().value // 'close'

function* outer2() {
	yield 'open';
	yield* inner();
	yield 'close';
}
var gen = outer2()
gen.next().value // 'open'
gen.next().value // 'hello!'
gen.next().value // 'close'



let delegatedIterator = (function* (){
	yield 'Hello!';
	yield 'Bye';
}());
let delegatingIterator = (function* (){
	yield 'Greetings!';
	yield* delegatedIterator;
	yield 'Ok, bye.';
}());

for(let value of delegatingIterator) {
	console.log(value);
}
// 'Greetings!'
// 'Hello!'
// 'Bye!'
// 'Ok, bye.'




function* concat(iter1, iter2) {
	yield* iter1;
	yield* iter2;
}
// 等同于
function* concat(iter1, iter2) {
	for(var value of iter1) {
		yield value;
	}
	for(var value of iter2) {
		yield value;
	}
}



function* gen() {
	yield* ['a', 'b', 'c'];
}
gen().next() // [value: 'a', done: false]




let read = (function* () {
	yield 'hello';
	yield* 'hello';
})();
read.next().value // 'hello'
read.next().value // 'h'





function* foo() {
	yield 2;
	yield 3;
	return 'foo';
}

function* bar() {
	yield 1;
	var v = yield* foo();
	console.log('v: ' + v);
	yield 4;
}
var it = bar();

it.next() // {value: 1, done: false}
it.next() // {value: 2, done: false}
it.next() // {value: 3, done: false}
it.next() // 'v: foo' {value: 4, done: false}
it.next() // {value: undefined, done: true}






function* iterTree(tree) {
	if(Array.isArray(tree)) {
		for(let i = 0; i < tree.length; i++) {
			yield* iterTree(tree[i]);
		}
	} else {
		yield tree;
	}
}
const tree = ['a', ['b', 'c'], ['d', 'e']];
for(let x of iterTree(tree)) {
	console.log(x);
}
// a
// b
// c
// d
// e

[...iterTree(tree)] // ['a', 'b', 'c', 'd', 'e']



/* 8.作为对象属性的Generator函数 */

let obj = {
	* myGeneratorMethod() {
		// ...
	}
};
// 等价于
let obj = {
	myGeneratorMethod: function* () {
		// ...
	}
}



/* 9.Generator函数的this */
function* g() {}
g.prototype.hello = function() {
	return 'hi!';
};

let obj = g();
obj instanceof g // true
obj.hello() // 'hi!'

function* g() {
	this.a = 11;
}
let obj = g();
obj.next();
obj.a // undefined


function* F() {
	yield this.x = 2;
	yield this.y = 3;
}
new F()
// TypeError: F is not a constructor



function* F() {
	this.a = 1;
	yield this.b = 2;
	yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next(); // Object{value: 2, done: false}
f.next(); // Object{value: 3, done: false}
f.next(); // Object{value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3




function* F() {
	this.a = 1;
	yield this.b = 2;
	yield this.c = 3;
}
var f = F.call(F.prototype);

f.next(); // Object{value: 2, done: false}
f.next(); // Object{value: 3, done: false}
f.next(); // Object{value: undefined, done: true}
f.a // 1
f.b // 2
f.c // 3



function* gen() {
	this.a = 1;
	yield this.b = 2;
	yield this.c = 3;
}
var f = F.call(F.prototype);

f.next(); // Object{value: 2, done: false}
f.next() // Object{value: 3, done: false}
f.next() // Object{value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3





/* 10.含义 */
var ticking = true;
var clock = function() {
	if(ticking) {
		console.log('Tick!');
	} else {
		console.log('Tock!');
		ticking = !ticking;
	}
}



var clock = function* () {
	while(true) {
		console.log('Tick!');
		yield;
		console.log('Tock!');
		yield;
	}
}




/* 11.应用 */
function* loadUI() {
	showLoadingScreen();
	yield loadUIDataAsynchronously();
	hideLoadingScreen();
}

var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()



function* main() {
	var result = yield request('http://some.url');
	var resp = JSON.parse(result);
	console.log(resp.value);
}
function request(url) {
	makeAjaxCall(url, function(response) {
		it.next(response);
	});
}
var it = main();
it.next();




function* numbers() {
	let file = new FileReader('numbers.txt')
	try{
		while(!file.eof) {
			yield parseInt(file.readLine(), 10)
		}
	} finally {
		file.close();
	}
}



/*
*
* 第十九章 Generator 函数的异步应用
*
*/

/* 1.传统方法 */

/* 2.基本概念 */
fs.readFile('/etc/passwd', 'utf-8', function(err, data) {
	if(err) {
		throw err;
	}
	console.log(data);
})



fs.readFile(fileA, 'utf-8', function(err, data) {
	fs.readFile(fileB, 'utf-8', function(err, data) {
		// ...
	})
})



var readFile = require('fs-readfile-promise');
readFile(fileA)
.then(function(data) {
	console.log(data.toString());
})
.then(function() {
	return readFile(fileB);
})
.then(function(data) {
	console.log(data.toString());
})
.catch(function(err) {
	console.log(err);
});




/* 3.Generator函数 */
function* asyncJob() {
	// ...其他代码
	var f = yield readFile(fileA);
	// ...其他代码
}



function* gen(x) {
	var y = yield x + 2;
	return y;
}
var g = gen(1);
g.next() // {value: 3, done: false}
g.next() // {value: undefind, done: true}



function* gen(x) {
	var y = yield x + 2;
	return y;
}
var g = gen(1);
g.next() // {value: 3, done: false}
g.next(2) // {value: 2, done: true}



function* gen(x) {
	try{
		var y = yield x + 2;
	} catch(e) {
		console.log(e);
	}
	return y;
}
var g = gen(1);
g.next();
g.throw('出错了！')
// 出错了！



var fetch = require('node-fetch');
function* gen(){
	var url = 'https://api.github.com/users/github';
	var result = yield fetch(url);
	console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data) {
	return data.json();
}).then(function(data) {
	g.next(data);
})



/* 4.Thunk函数 */
var x = 1;
function f(m) {
	return m * 2;
}
f(x + 5)

f(x + 5)
// 调用时传值，等同于
f(6)


f(x + 5)
// 传名调用时，等同于
(x + 5) * 2


function(a, b) {
	return b;
}
f(x * x * x - 2 * x - 1, x);



function f(m) {
	return m * 2;
}
f(x + 5);

// 等同于
var thunk = function() {
	return x + 5;
};
function f(thunk) {
	return thunk() * 2;
}


// 正常版本的readFile(多参数版本)
fs.readFile(fileName, callback);

// Thunk版本的readFile(但参数版本)
var Thunk = function(fileName) {
	return function(callback) {
		return fs.readfile(filename, callback);
	};
};
var readFileThunk = Thunk(fileName);
readFileThunk(callback);




// ES5版本
var Thunk = function(fn) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		return function(callback) {
			args.push(callback);
			return fn.apply(this, args);
		}
	};
};

// ES6版本
const Thunk = function(fn) {
	return function(...args) {
		return function(callback) {
			return fn.call(this, ...args, callback);
		}
	};
};



var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);

function f(a, cb) {
	cb(a);
}
const ft = Thunk(f);
ft(1)(console.log);




var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str) {
	// ...
})



function thunkify(fn) {
	return function() {
		var args = new Array(argunments.length);
		var ctx = this;

		for(var i = 0; i < args.length; ++i) {
			args[i] = arguments[i];
		}

		return function(done) {
			var called;
			
			args.push(function() {
				if(called) return;
				called = true;
				done.apply(null, arguments);
			});

			try{
				fn.apply(ctx, args);
			}catch(err) {
				done(err);
			}
		}
	}
};


function f(a, b, callback) {
	var sum = a + b;
	callback(sum);
	callback(sum);
}

var ft = thunkify(f);
var print = console.log.bind(console);
ft(1, 2)(print);
// 3


function* gen() {
	// ...
}
var g = gen();
var res = g.next();

while(!res.done) {
	console.log(res.value);
	res = g.next;
}


var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
	var r1 = yield readFileThunk('/etc/fstab');
	console.log(r1.toString());
	var r2 = yield readFileThunk('/etc/shells');
	console.log(r2.toString());
}



var g = gen();

var r1 = g.next();
r1.value(function(err, data) {
	if(err) {
		throw err;
	}
	r2.value(function(err, data) {
		if(err) {
			throw err;
		}
		g.next(data);
	})
})




function run(fn) {
	var gen = fn();
	function next(err, data) {
		var result = gen.next(data);
		if(result.done) return;
		result.value(next);
	}
	next();
}
function* g() {
	// ...
}
run(g);



var g = function* (){
	var f1 = yield readFileThunk('fileA');
	var f2 = yield readFileThunk('fileB');
	// ...
	var fn = yield readFileThunk('fileN');
};

run(g);



/* 5.co模块 */
var gen = function* () {
	var f1 = yield readFile('/etc/fstab');
	var f2 = yield readFile('/etc/shells');
	console.log(f1.toString());
	console.log(f2.toString());
};

var co = require('co');
co(gen);

co(gen).then(function() {
	console.log('Generator 函数执行完成！');
});




var fs = require('fs');
var readFile = function(fileName) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, function(error, data) {
			if(error) {
				return reject(error);
			}
			resolve(data);
		});
	});
};

var gen = function* () {
	var f1 = yield readFile('/etc/fstab');
	var f2 = yield readFile('/etc/shells');
	console.log(f1.toString());
	console.log(f2.toString());
}

var g = gen();
g.next().value.then(function(data){
	g.next(data).value.then(function(data) {
		g.next(data);
	});
});


function run(gen){
	var g = gen();
	
	function next(data) {
		var result = g.next(data);
		if(result.done) {
			return result.value;
		}
		result.value.then(function(data) {
			next(data);
		})
	}
	next();
}
run(gen);





function co(gen) {
	var ctx = this;
	
	return new Promise(function(resolve, reject) {
		if(typeof gen === 'function') {
			gen = gen.call(ctx);
		}
		if(!gen || typeof gen.next !== 'function') {
			return resolve(gen);
		}

		onFullfilled();
		function onFullfilled(res) {
			var ret;
			try{
				ret = gen.next(res);
			} catch(e) {
				return reject(e);
			}
			next(ret);
		}
	});
}


function next(ret) {
	if(ret.done) {
		return resolve(ret.value);
	}
	var value = toPromise.call(ctx, ret.value);
	if(value && isPromise(value)) {
		return value.then(onFullfilled, onRejected);
	}
	return onRejected(
		new TypeError(
			'You may only yield a function, promise, generator, array, or object, '
			+ 'but the following object was passed: "'
			+ String(ret.value)
			+ '"'
		)
	)
}




// 数组的写法
co(function* () {
	var res = yield [
		Promise.resolve(1);
		Promise.resolve(2);
	];
	console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
	var res = yield {
		1: Promise.resolve(1),
		2: Promise.resolve(2),
	};
	console.log(res);
}).catch(onerror);


co(function* () {
	var values = [n1, n2, n3];
	yield values.map(somethingAsync);
});

function* somethingAsync(x) {
	// do something async
	return y
}



const co = require('co');
const fs = require('fs');

const stream = fs.createReadStream('./les_miserables.txt');
let valjeanCount = 0;

co(function* (){
	while(true) {
		const res = yield Promise.race([
			new Promise(resolve => stream.once('data', resolve)),
			new Promise(resolve => stream.once('end', resolve)),
			new Promise((resolve, reject) => stream.once('error', reject))
		]);
		if(!res) {
			break;
		}

		stream.removeAllListeners('data');
		stream.removeAllListeners('end');
		stream.removeAllListeners('error');
		valjeanCount += (res.toString().match(/valjean/ig) || []).length
	}
	console.log('count: '. valjeanCount); // count: 1120
});





/*
*
* 第二十章 async函数
*
*/


/* 1.含义 */

const fs = require('fs');

const readFile = function(fileName) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, function(error, data) {
			if(error) {
				return reject(error);
			}
			resolve(data);
		});
	});
};

const gen = function* () {
	const f1 = await readFile('/etc/fstab');
	const f2 = await readFile('/etc/shells');
	console.log(f1.toString());
	console.log(f2.toString());
}

const asyncReadFile = async function() {
	const f1 = await readFile('/etc/fstab');
	const f2 = await readFile('/etc/shells');
	console.log(f1.toString());
	console.log(f2.toString());
}



/* 2.基本用法 */

async function getStockPriceByName(name) {
	const symbol = await getStockSymbol(name);
	const stockPrice = await getStockPrice(symbol);

	return stockPrice;
}

getStockPriceByName('goog').then(function(result) {
	console.log(result);
})






function timeout(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function asyncPrint(value, ms) {
	await timeout(ms);
	console.log(value);
}

asyncPrint('hello world', 50)




async function timeout(ms) {
	await new Promise((resolve) => {
		setTimout(resolve, ms);
	});
}

async function asyncPrint(value, ms) {
	await timeout(ms);
	console.log(value);
}

asyncPrint('hello world', 50)



// 函数声明
async function foo() {}

// 函数表达式
const foo = async function() {};

// 对象的方法
let obj = {async foo() {}};
obj.foo().then()

// Class的方法
class Storage {
	constructor() {
		this.cachePromise = caches.open('avatars');
	}

	async getAvatar(name) {
		const cache = await this.cachePromise;
		return cache.match(`/avatars/${name}.jpg`);
	}
}

const storage = new Storage();
storage.getAvatar('jake').then(...);

// 箭头函数
const foo = async ()=> {}



/* 3.语法 */
async function f() {
	return 'hello world';
}

f().then(v => console.log(v));
// 'hello world'



async function f() {
	throw new Error('出错了！');
}

f().then(
	v => console.log(v),
	e => console.log(e)
)
// Error: 出错了




async function getTitle(url) {
	let response = await fetch(url);
	let html = await response.text();
	return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}

getTitle('https//tc39.github.io/ecma262/').then(console.log);
// 'ECMAScript 2017 Language Specification'



async function f() {
	// 等同于
	// return 123;
	return await 123;
}

f().then(v => console.log(v));
// 123



class Sleep{
	constructor(timeout) {
		this.timeout = timeout;
	}
	then(resolve, reject) {
		const startTime = Date.now();
		setTimeout(
			() => resolve(Data.now() - startTime),
			this.timeout
		);
	}
}

(async () => {
	const sleepTime = await new Sleep(1000);
	console.log(sleepTime);
})();
// 1000




function sleep(interval) {
	return new Promise(resolve => {
		setTimeout(resolve, interval);
	})
}

// 用法
async function one2FiveInAsync() {
	for(let i = 1; i <= 5; i++) {
		console.log(i);
		await sleep(1000);
	}
}

one2FiveInAsync()




asynct function f() {
	await Promise.reject('出错了！');
}
f().then(v => console.log(v))
	.catch(e => console.log(e))
// 出错了



async function f() {
	await Promise.reject('出错了');
	await Promise.resolve('hello world'); // 不会执行
} 




async function f() {
	try{
		await Promise.reject('出错了');
	}catch(e){}
	return await Promise.resolve('hello world!');
}

f().then(v => console.log(v));
// hello world!



async function f() {
	await Promise.reject('出错了')
		.catch(e => console.log(e));
	return await Promise.resolve('hello world!');
}
f().then(v => console.log(v));
// 出错了
// hello world



async function f() {
	await new Promise(function(resolve, reject) {
		throw new Error('出错了');
	});
}

f().then(v => console.log(v))
	.catch(e => console.log(e))
// Error: 出错了




async function f() {
	try{
		await new Promise(function(resolve, reject) {
			throw new Error('出错了');
		})
	} catch(e) {}
	
	return await('hello world!');
}


async function main() {
	try {
		const val1 = await firstStep();
		const val2 = await secondStep(val1);
		const val3 = await thirdStep(val1, val2);

		console.log('Final: ', val3);
	} catch(err) {
		console.log(err);
	}
}



const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
	let i;
	for(i = 0; i < NUM_RETRIES; ++i) {
		try {
			await superagent.get('http://google.com/this-throws-an-error');
			break;
		} catch(err) {}
	}
	console.log(i); // 3
}

test();




async function myFunction() {
	try {
		await somethingThatReturnsAPromise();
	} catch(err) {
		console.log(err);
	}
}

// 另一种写法
async function myFunction() {
	await somethingThatReturnsAPromise()
		.catch(function(err) {
			console.log(err);
		})
}



let foo = await getFoo();
let bar = await getBar();


// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;



async function dbFunc(db) {
	let docs = [{}, {}, {}];

	// 报错
	docs.forEach(function(doc) {
		await db.post(doc);
	})
}


fnction dbFunc(db) { // 这里不需要async
	let docs = [{}, {}, {}]
	
	// 可能得到错误的结果
	docs.forEach(async function(doc) {
		await db.post(doc)
	});
}



async function dbFunc(db) {
	let docs = [{}, {}, {}];

	for(let doc of docs) {
		await db.post(doc);
	}
}




async function dbFunc(db) {
	let docs = [{}, {}, {}];
	let promises = docs.map((doc) => db.post(doc));

	let results = await Promise.all(promises);
	console.log(results);
}

// 或者使用下面的写法

async function dbFunc(db) {
	let docs = [{}, {}, {}];
	let promises = docs.map((doc) => db.post(doc));

	let results = [];
	for(let promise of promises) {
		resutls.push(await promise);
	}
	console.log(results);
}





const a = () => {
	b().then(() => c());
};

const a = async () => {
	await b();
	c();
}



/* 4.async函数的实现原理 */

async function fn(args) {
	// ...
}
// 等同于
function fn(args) {
	return spawn(function* () {
		// ...
	});
}


function spawn(genF) {
	return new Promise(function(resolve, reject) {
		const gen = genF();
		function step(nextF) {
			let next;
			try {
				next = nextF();
			} catch(e) {
				return reject(e);
			}
			if(next.done) {
				return resolve(next.value);
			}

			Promise.resolve(next.value).then(function(v) {
				step(function() { return gen.next(v); });
			}, function(e) {
				step(function() { return gen.throw(e); });
			});
		}
		step(function() { return gen.next(undefined); });
	})
}




/* 5.与其他异步处理方法的比较 */

// Promise
function chainAnimationsPromise(elem, animations) {
	// 变量ret用来保存上一个动画的返回值
	let ret = null;

	// 新建一个空的Promise
	let p = Promise.resolve();

	// 使用then方法，添加所有动画
	for(let anim of animations) {
		p = p.then(function(val) {
			ret = val;
			return anim(elem);
		});
	}

	// 返回一个部署了错误捕捉机制的Promise
	return p.catch(function(e) {
		// 忽略错误，继续执行
	}).then(function() {
		return ret;
	})
}



function chainAnimationsGenerator(elem, animations) {
	return spawn(function* () {
		let ret = null;
		try {
			for(let anim of animations) {
				ret = yield anim(elem)
			}
		} catch(e) {
			// 忽略错误， 继续执行
		}

		return ret;
	})
}




async function chainAnimationsAsync(elem, animations) {
	let ret = null;
	try {
		for(let anim of animations) {
			ret = await anim(elem);
		}
	} catch(e) {
		// 忽略错误， 继续执行
	}
	return ret;
}





/* 6.实例：按顺序完成异步操作 */
function logInOrder(urls) {
	// 远程读取所有URL
	const textPromises = urls.map(url => {
		return fetch(url).then(response => response.text());
	});
	
	// 按次序输出
	textPromises.reduce((chain, textPromise) => {
		return chain.then(() => textPromise)
			.then(text => console.log(text));
	}, Promise.resolve());
}



async function logInOrder(urls) {
	for(const url of urls) {
		const response = await fetch(url);
		console.log(await response.text());
	}
}



async function logInOrder(urls) {
	// 并发读取远程URL
	const textPromises = urls.map(async url => {
		const response = await fetch(url);
		return response.text();
	});

	// 按次序输出
	for(const textPromise of textPromises) {
		console.log(await textPromise);
	}
}




/* 7.顶层await */
// awaiting.js
let output;
async function main() {
	const dynamic = await import(someMission);
	const data = await fetch(url);
	output = someProcess(dynamic.default, data);
}
main();
export { output }




// awaiting.js
let output;
(async function main() {
	const dynamic = await import(someMission);
	const data = await fetch(url);
	output = someProcess(dynamic.default, data);
})();
export { output }


usage.js
import { output } from './awating.js';
function outputPlusValue(value) {
	return output + value
}

console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100), 1000)



// awaiting.js
let output;
export default(async function main() {
	const dynamic = await import(someMission);
	const data = await fetch(url);
	output = someProcess(dynamic.default, data);
})();
export { output };


// usage.js
import promise, { output } from './awaiting.js';
function outputPlusValue(value) {
	return output + v
}
promise.then(() => {
	console.log(outputPlusValue(100));
	setTimeout(() => console.log(outputPlusValue(100), 1000);
});



// awaiting.js
const dynamic = import(someMission);
const data = fetch(url);
export const output = someProcess((await dynamic).default, await data);

// usage.js
import { output } from './awaiting.js';
function outputPlusValue(value) {
	return output + value
}
console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100), 1000)




// import()方法加载
const strings = await import(`/i18n/${navigator.language}`);

// 数据库操作
const connection = await dbConnector();

// 依赖回滚
let jQuery
try {
	jQuery = await import('https://cdn-a.com/jQuery');
} catch {
	jQuery = await import('https://cdn-b.com/jQuery');
}



// x.js
console.log('X1');
await new Promise(r => setTimeout(r, 1000));
console.log('X2');

// y.js
console.log('Y');

// z.js
import './x.js';
import './y.js';
console.log('Z');

















