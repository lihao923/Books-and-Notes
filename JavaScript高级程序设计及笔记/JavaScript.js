/*
 *
 *JavaScript高级程序设计
 *
*/


/*
 * 第5章 引用类型
*/


// 5.2.6 操作方法

// concat()方法
var colors = ['red', 'green', 'blue'];
var colors2 = colors.concat('yellow', ['black', 'brown']);

alert(colors); // red,green,blue
alert(colors2); // red,green,yellow,black,brown


// slice()方法，该方法可以接受一或两个参数，即要返回项的起始和结束位置。在只有一个参数的情况下，slice()方法返回从该参数指定位置开始到当前数组末尾的所有项。如果有两个参数，该方法返回起始和结束位置之间的项——但不包括结束位置的项

var colors = ['red', 'green', 'blue', 'yellow', 'purple'];
var colors2 = colors.slice(1);
var colors3 = colors.slice(1, 4);

alert(colors2); // green,blue,yellow,purple
alert(colors3); // green,blue,yellow

// splice()方法，可以删除，插入，替换

// 删除第一项
var colors = ['red', 'green', 'blue'];
var removed = colors.splice(0, 1);
alert(colors);  // green,blue
alert(removed); // red, 返回的数组中只包含一项

// 从位置1开始插入两项
removed = colors.splice(1, 0, 'yellow', 'orange');
alert(colors); // green,yellow,orange,blue
alert(removed); // 返回一个空数组

// 插入两项，删除一项
removed = colors.splice(1, 1, 'red', 'purple');
alert(colors); // green,red,purple,orange,blue
alert(removed); // yellow，返回的数组中只包含一项


// 5.2.7 位置方法

// indexOf(), lastIndexOf()
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
alert(numbers.indexOf(4)); // 3
alert(numbers.lastIndexOf(4)); // 5
alert(numbers.indexOf(4, 4)); // 5
alert(numbers.lastIndexOf(4, 4)); // 3

var person = {name: 'Nicholas'};
var people = [{name: 'Nicholas'}];

var morePeople = [people];

alert(people.indexOf(person)); // -1
alert(morePeople.indexOf(person)); // 0


// 5.2.8 迭代方法

// every(): 对数组中的每一项运行给定函数，如果该函数对每一项都返回true，则返回true
// filter(): 对数组中的每一项运行给定函数，如果该函数对每一项都返回true，则返回true
// forEach(): 对数组中的每一项运行给定函数。这个方法没有返回值
// map(): 对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组
// some(): 对数组中的每一项运行给定函数，如果该函数对任一项返回true，则返回true

// 例子：

var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];


var everyResult = numbers.every(function(item, index, array) {
    return (item > 2);
});
alert(everyResult); //false


var someResult = numbers.some(function(item, index, array) {
    return (item > 2);
});
alert(someResult); //true


var filterResult = numbers.filter(function(item, index, array) {
    return (item > 2)
});
alert(filterResult); //[3, 4, 5, 4, 3]


var mapResult = numbers.map(function(item, index, array) {
    return item * 2;
});
alert(mapResult);  //[2, 4, 6, 10, 8, 6, 4, 2]


var myArr = []
numbers.forEach(function(item, index, array) { // forEach本身没有返回值
    myArr[index] = item * 2;
});

alert(myArr); //[2, 4, 6, 10, 8, 6, 4, 2]



// 5.2.9 归并方法
// reduce(), reduceRight()

var values = [1, 2, 3, 4, 5, 4, 3, 2, 1];

var sum = values.reduce(function(prev, cur, index, array) {
    return prev + cur;
});
alert(sum); // 25


var sumRight = values.reduceRight(function(prev, cur, index, array) {
    return prev + cur;
});
alert(sumRight); // 25



/*
 * 5.3 Data类型
*/

var someDate = new Date(Date.parse('May 25, 2004'));
// 等价于
var someDate = new Date('May 25, 2004');


var y2k = new Date(Date.UTC(2000, 0));
// GMT时间2000年1月1日午夜零时
var allFives = new  Date(Date.UTC(2005, 4, 5, 17, 55, 55));
// GMT时间2005年5月5日下午5:55:55

var y2k = new Date(2000, 0);
// 本地时间2000年1月1日午夜零时
var allFives = new Date(2005, 4, 5, 17, 55, 55);
// 本地时间2005年5月5日下午5:55:55


// Data.now()方法，var 返回表示调用这个方法时的日期和时间的毫秒数

var start = Date.now(); // 取得开始时间
doSomething(); // 调用函数
var stop = Date.now(); // 取得停止时间
var result = stop - start;

var start = +new Date(); // 取得开始时间
doSomething(); // 调用函数
var stop = +new Date(); // 取得停止时间
var result = stop - start;



/*
 * 5.4 RegExp类型
*/

// var expression = / pattern / flags;

var pattern1 = /at/g;
// 匹配字符串中所有"at"的实例

var pattern2 = /[bc]at/i;
// 匹配第一个"bat"或"cat"，不区分大小写

var pattern3 = /.at/gi;
// 匹配所有以"at"结尾的3个字符的组合，不区分大小写

var pattern4 = /[bc]at/i;
// 匹配第一个"bat"或"cat", 不区分大小写

var pattern5 = /\[bc\]at/i;
// 匹配第一个"[bc]at", 不区分大小写

var pattern6 = /.at/gi;
// 匹配所有以"at"结尾的3 个字符的组合，不区分大小写

var pattern7 = /\.at/gi;
// 匹配所有".at"，不区分大小写


// 构造函数方式定义正则表达式
var pattern8 = /[bc]at/i;
// 匹配第一个"bat"或"cat"，不区分大小写

var pattern9 = new RegExp('[bc]at', 'i');
// 与pattern8 相同，只不过是使用构造函数创建的


// 正则表达式test()方法，它接受一个字符串参数。在模式与该参数匹配的情况下返回true；否则，返回false。
var text = '000-00-0000';
var pattern = /\d{3}-\d{2}-\d{4}/;

if (pattern.test(text)) {
    alert('The pattern was matched.');
}




/*
 * 5.5 Function类型
*/

// 5.5.3 作为值的函数

function callSomeFunction(someFunction, someArgument) {
    return someFunction(someArgument);
}

function add10(num) {
    return num + 10;
}

var result1 = callSomeFunction(add10,  10);
alert(result); // 20

function getGreeting(name) {
    reuturn 'Hello, ' + name;
}

var result2 = callSomeFunction(getGreeting,  'Lihao');
alert(result2); // 'Hello, Lihao'

// 假设有一个对象数组，我们想要根据某个对象属性对数组进行排序
// 定义比较函数
function createComparesionFunction(propertyName) {
    return function(object, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }
}

var data = [{name: 'Zachary', age: 28}, {name: 'Nichalas', age: 29}];
data.sort(createComparesionFunction('name'));
alert(data[0].name); // Nicholas

data.sort(createComparesionFunction('age'));
alert(data[0].name);

// 阶乘函数, 高度耦合
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

// 优化后的阶乘函数
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num -1);
    }
}

var  trueFactorial = factorial;
factorial = function() {
    return 0;
};

alert(trueFactorial(5)); // 120
alert(factorial(5)); // 0

// bind()方法会创建一个函数实例，其this值会被绑定到传给bind()函数的值
window.colors = 'red';
var o = {color: 'blue'};

function sayColor() {
    alert(this.color);
}

var objectSayColor = sayColor.bind(o);
objectSayColor(); // blue

/*
 * 5.6 基本包装类型
*/


/*
 * 5.6.3 String类型
*/

// 3.字符串位置方法
var stringValue = 'hello world';
alert(stringValue.indexOf('o')); // 4
alert(stringValue.lastIndexOf('o')); // 7

alert(stringValue.indexOf('o', 6)); // 7
alert(stringValue.lastIndexOf('o', 6)); // 4

// 可以通过循环调用indexOf()或lastIndexOf()来找到所有匹配的子字符串

var stringValue1 = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit';
var positions = new Array();
var pos = stringValue.indexOf('e');

while(pos > -1) {
    positions.push(pos);
    pos = stringValue.indexOf('e', pos+1);
}

alert(positions); // '3, 24, 32, 35, 52'

// 4.trim()方法
var stringValue2 = '  hello world ';
var trimmedStringValue2 = stringValue2.trim();
alert(stringValue2); // ' hello world '
alert(trimmedStringValue2); // 'hello world'

// 5. 字符串大小写转换方法
var stringValue3 = 'hello world';
alert(stringValue3.toLocaleUpperCase()); // 'HELLO WORLD'
alert(stringValue3.toUpperCase()); // 'HELLO WORLD'
alert(stringValue3.toLocaleLowerCase()); // 'hello world'
alert(stringValue3.toLowerCase()); // 'hello world'

// 6. 字符串的模式匹配方法
var text = 'cat, bat, sat, fat';
var pattern = /.at/;

// 与pattern.exec(text)相同
var matches = text.match(pattern);
alert(matches.index); // 0
alert(matches[0]); // 'cat'
alert(pattern.lastIndex); // 0

// search()方法
var text1 = 'cat, bat, sat, fat';
var pos = text.search(/at/);
alert(pos); // 1

// replace()方法
var text3 = 'cat, bat, sat, fat';
var reault = text.replace('at', 'ond');
alert(result); // 'cond, bat, sat, fat'

result = text.replace(/at/g, 'ond');
alert(result); // 'cond, bond, sond, fond'


var text = "cat, bat, sat, fat";
result = text.replace(/(.at)/g, "word($1)");
alert(result);  //word(cat), word(bat), word(sat), word(fat)

// repalce第二个参数可以是函数
function htmlEscape(text) {
    return text.replace(/[<>"&]/g, function(match, pos, originalText) {
        switch(match) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '$amp;';
            case '\"':
                return '&quot;';
        }
    });
}

alert(htmlEscape("<p class=\"greeting\">Hello world!</p>"));
// &lt;p class=&quot;greeting&quot;&gt;Hello world!&lt;p&gt;


// split()方法，这个方法可以基于指定的分隔符将一个字符串分割成多个子字符串，并将结果放在一个数组中
var colorText = 'red, blue, green, yellow';
var colors1 = colorText.split(','); // ['red', 'blue', 'green', 'yellow']
var colors2 = colorText.split(',', 2); // ['red', 'blue']
var reg = /[^\,]+/;
var colors3 = colorText.split(reg); //['', ',', ',', ',', '']


// 7. localeCompare()方法

var stringColorValue = 'yellow';
alert(stringColorValue.localeCompare('brick')); // 1
alert(stringColorValue.localeCompare('yellow')); // 0
alert(stringColorValue.localeCompare('zoo')); // -1

function determineOrder(value) {
    var result = stringValue.localeCompare(value);
    if (result < 0) {
        alert("The string 'yellow' comes before the string '" + value + "'.");
    } else if (result > 0) {
        alert("The string 'yellow' comes after the string '" + value + "'.");
    } else {
        alert("The string 'yellow' is equal to the string '" + value + "'.");
    }
}

/*
* 5.7 单体内置对象
*/

// 5.7.1 Global对象
// encodeURI()主要用于整个URI（例如，http://www.wrox.com/illegal value.htm），而encodeURIComponent()主要用于对URI中的某一段（例如前面URI 中的illegal value.htm）进行编码。
// 它们的主要区别在于，encodeURI()不会对本身属于URI 的特殊字符进行编码，例如冒号、正斜杠、问号和井字号；而encodeURIComponent()则会对它发现的任何非标准字符进行编码

var uri = "http://www.wrox.com/illegal value.htm#start";
alert(encodeURI(uri)); // "http://www.wrox.com/illegal%20value.htm#start"
alert(encodeURIComponent(uri)); // "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start"

// encodeURI()和encodeURIComponent()方法对应的两个方法分别是decodeURI()和decodeURIComponent()
var uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start";
alert(decodeURI(uri)); //http%3A%2F%2Fwww.wrox.com%2Fillegal value.htm%23start
alert(decodeURIComponent(uri)); //http://www.wrox.com/illegal value.htm#start

// eval()方法就像是一个完整的ECMAScript 解析器，它只接受一个参数，即要执行的ECMAScript （或JavaScript）字符串。


// 值 = Math.floor(Math.random() * 可能值的总数 + 第一个可能的值)
// 1到10 之间的数值
var num = Math.floor(Math.random() * 10 + 1);

// 多数情况下，其实都可以通过一个函数来计算可能值的总数和第一个可能的值
function selectFrom(lowerValue, upperValue) {
    var choices = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * choices + lowerValue);
}
var num = selectFrom(2, 10);
aler t(num); // 介于 2 和10 之间（包括 2 和 10）的一个数值

// 从数组中随机取出一项
var colors = ["red", "green", "blue", "yellow", "black", "purple", "brown"];
var color = colors[selectFrom(0, colors.length-1)];
alert(color); // 可能是数组中包含的任何一个字符串



/*
*
* 第6章 面向对象的程序设计
*
*/

// ECMA-262 把对象定义为：“无序属性的集合，其属性可以包含基本值、对象或者函数。”严格来讲，这就相当于说对象是一组没有特定顺序的值。对象的每个属性或方法都有一个名字，而每个名字都映射到一个值。正因为这样（以及其他将要讨论的原因），我们可以把ECMAScript 的对象想象成散列表：无非就是一组名值对，其中值可以是数据或函数


/*
* 6.1 理解对象
*/

var person = new Object();
person.name = 'Nicholas';
person.age = 29;
person.job = 'Software Engineer';

person.sayName = function() {
    alert(this.name);
};

// 对象字面量方式
var person = {
    name: 'Nicholas',
    age: 29,
    job: 'Software Engineer',
    sayName: function() {
        alert(this.name);
    }
};

// 6.1.1 属性类型

// 1.数据属性

//[[Configurable]]：表示能否通过delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为true。
// [[Writable]]：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为true。
// [[Writable]]：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为true。
// [[Value]]：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为undefined。

var person = {};
Object.defineProperty(person,  'name', {
    writable: false,
    value: 'Nicholas'
});

alert(person.name); // 'Nicholas'
person.name = 'Greg';
alert(person.name); // 'Nicholas'

var person1 = {};
Object.defineProperty(person1,  'name', {
    configurable: false,
    value: 'Nicholas'
});
alert(person1.name); // 'Nicholas'
delete person1.name;
alert(person1.name); // 'Nicholas'


// 一旦把属性定义为不可配置的，就不能再把它变回可配置了
var person2 = {};
Object.defineProperty(person2, "name", {
    configurable: false,
    value: "Nicholas"
});
//抛出错误
Object.defineProperty(person2, "name", {
    configurable: true,
    value: "Nicholas"
});

// 2.访问器属性

// 访问器属性不包含数据值；它们包含一对儿getter 和setter 函数（不过，这两个函数都不是必需的）。在读取访问器属性时，会调用getter 函数，这个函数负责返回有效的值；在写入访问器属性时，会调用setter 函数并传入新值，这个函数负责决定如何处理数据。访问

// [[Configurable]]：表示能否通过delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为true。
// [[Enumerable]]：表示能否通过for-in 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为true。
// [[Get]]：在读取属性时调用的函数。默认值为undefined。
// [[Set]]：在写入属性时调用的函数。默认值为undefined。



/*
*
* 第7章 函数表达式
*
*/

// 函数声明（可提升）
function functionName(arg0, arg1, arg2) {
    // 函数体
}

// 函数表达式（不可提升）
var functionName1 = function(arg0, arg1, arg2, arg3) {
    // 函数体
}


/*
* 7.1 递归阶乘函数
*/

// 调用自身函数名版本
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1)
    }

    // return num <= 1? 1 : num * factorial(num - 1)
}


// arguments.callee版本， 严格模式下会报错
function factorial1 (num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }

    // return num <= 1? 1 : num * arguments.callee(num - 1);
}

// 函数声明式版本（最完美）
var factorial2 = (function f(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * f(num - 1);
    }
    // return num <= 1? 1 : num * f(num - 1);
})

/*
* 7.2 闭包
*/

闭包是指有权访问另一个函数作用域中的变量的函数.

function createComparisonFunction(propertyName) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		
		if(value1 < value2) {
			return -1;
		} else if(value1 > value2) {
			return 1;
		} else {
			return 0;
		}
	};
}

// 匿名函数可以用来模仿块级作用域并避免这个问题，用作块级作用域（通常称为私有作用域）的匿名函数的语法如下所示：
(function() {
	// 这里是块级作用域
})();





// 检测插件（IE中无效）
function hasPlugin(name) {
	name = name.toLowerCase();
	for(var i = 0; i < navigator.plugins.length; i++) {
		if(navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
			return true;
		}
	}
	return false;
}

// 检测Flash, QuickTime
alert(hasPlugin('Flash'))
alert(hasPlugin('QuickTime'))

// 检测IE中的插件
function hasIEPlugin(name) {
	try {
		new ActiveXObject(name);
		return true;
	} catch (ex){
		return false
	}
}

// 检测Flash, QuickTime
alert(hasIEPlugin('ShockwaveFlash.ShockwaveFlash'));
alert(hasIEPlugin('QuickTime.QuickTime'));


// 检测所有浏览器中的Flash
function hasFlash() {
	var result = hasPlugin('Flash');
	if(!result) {
		result = hasIEPlugin('ShockwaveFlash.ShockwaveFlash');
	}
	return result;
}

// 检测所有浏览器中的QuickTime
function hasQuickTime() {
	var result = hasPlugin('QuickTime');
	if(!result) {
		result hasIEPlugin('QuickTime.QuickTime');
	}
	return result;
}

// 检测Flash, QuickTime
alert(hasFlash());
alert(hasQuickTime());


// 调整浏览器窗口大小，使其占据屏幕的可用空
window.resizeTo(screen.availWidth, screen.availHeight); // 有可能被禁用


// 后退一页
history.go(-1);

// 前进一页
history.go(1);

// 前进两页
history.go(2)

if(history.length == 0) {
	// 这应该是用户打开窗口后的第一个页面
}






/*
*
* 第9章 客户端检测
*
*/


/*
* 9.1 能力检测
*/

// 能力检测的基本模式如下：
if (object.propertyInQuestion) {
	// 使用object.propertyInQuestion
}


function getElement(id) {
	if(document.getElementById) {
		return document.getElementById(id);
	} else if(document.all) {
		return document.all[id];
	} else {
		throw new Error('No way to retrieve element!')
	}
}

// 检测sort是不是函数
function isSortable(object) {
	return typeof object.sort == 'function';
}

// 在浏览器环境下测试任何对象的某个特性是否存在，要使用下面的函数

function isHostMethod(object, property) {
	var t = typeof object[property];
	return t == 'function' || (!!(t=='object' && object[property])) || t == 'unknown';
}

// 使用
result = isHostMethod(xhr, 'open'); // true
result = isHostMethod(xhr, 'foo'); // false



/*
*
* 第10章 DOM
*
*/


/*
*
* 第13章 事件
*
*/

var div = document.getElementById('myDiv');
EventUtil.addHandler(div, 'click', function(event) {
	event = EventUtil.getEvent(event);
	alert('client coordinates:' + event.clientX + ',' + event.clientY);
});

// 以下代码可以取得鼠标事件在页面（而非视口）中的坐标，
var div = document.getElementById('myDiv');
EventUtil.addHandler(div, 'click', function(event) {
	event = EventUtil.getEvent(event);
	alert('Page coordinates：' + event.pageX + ',' + event.pageY);
});

// 鼠标事件的屏幕坐标
var div = document.getElementById('myDiv');
EventUtil.addHandler(div, 'click', function(event) {
	event = EventUtil.getEvent(event);
	alert('Screen coordinatesL：' + event.screenX + ',' + event.screenY);
})


// 修改键
var div = document.getElementById('myDiv');
EventUtil.addHandler(div, 'click', function(event) {
	event = EventUtil.getEvent(event);
	var keys = new Array();

	if(event.shiftKey) {
		keys.push('shift');
	}

	if(event.ctrlKey) {
		keys.push('ctrl');
	}

	if(event.altKey) {
		keys.push('alt');
	}

	if(event.metaKey) {
		keys.push('meta');
	}

	alert('Keys:' + keys.join(','));
})


// 13.4.4 键盘与文本事件

// keyup事件获取keyCode
var textbox = document.getElementById('myText');
EventUtil.addHandler(textbox, 'keyup', function(event) {
	event = EventUtil.getEvent(event);
	alert(event.keyCode);
});



// 13.6 模拟事件

// 模拟对按钮的单击事件
var btn = document.getElementById('myBtn');
var event = document.createEvent('MouseEvents');
event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, fase, 0, null); // 初始化事件对象
btn.dispatchEvent(event); // 触发事件

// 模拟键盘keydown事件(这个例子模拟的是按住Shift的同时又按下A键)
var textbook = document.getElementById('myTextbox'), event;
if (document.implementation.hasFeature('KeyboardEvents', '3.0')) {
	event = document.createEvent('KeyboardEvent');
	event.initKeyboardEvent('keydown', true, true, document.defaultView, 'a', 0, 'Shift', 0);
	textbox.dispatchEvent(event);
}

// IE模拟按钮触发click事件的过程
var btn = document.getElementById('myBtn');
var event = document.createEventObject();

event.screenX = 100;
event.screenY = 0;
event.clientX = 0;
event.clientY = 0;
event.ctrlKey = false;
event.altKey = false;
event.shiftKey = false;
event.button = 0;
btn.fireEvent('onclick', event);

// IE模拟keypress事件
var textbox = document.getElementById('myTextbox');
var event = document.createEventObject();

event.altKey = false;
event.ctrlKey = false;
event.shiftKey = false;
event.keyCode = 65;
textbox.fireEvent('onKeypress', event);



/*
*
* 第14章 表单脚本
*
*/


// 14.1.3 表单字段


// change(), focus(), blur()
var textbox = document.forms[0].elements[0];
EventUtil.addHandler(textbox, 'focus', function(event) {
	event = EventUtil.getEvent(event);
	var target EventUtil.getTarget(event);
	if(target.style.backgroundColor != 'red') {
		target.style.backgroundColor = 'yellow';
	}
});

EventUtil.addHandler(textbox, 'blur', function(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	
	if(/[^\d]/.test(target.value)) {
		target.style.backgroundColor = 'red';
	} else {
		target.style.backgroundColor = '';
	}
});

EventUtil.addHandler(textbox, 'change', function(evnet) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);

	if(/[^\d]/.test(target.value)) {
		target.style.backgroundColor = 'red';
	} else {
		target.style.backgroundColor = 'yellow';
	}
})

// 14.2.2 过滤输入

// 屏蔽所有按键
EventUtil.addHandler(textbox, 'keypress', function(event) {
	event = EventUtil.getEvent(event);
	EventUtil.preventDefault(event);
});

// 只允许用户输入数值
EventUtil.addHandler(textbox, 'keypress', function(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var charCode = EventUtil.getCharCode(event);

	if(!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 && !event.ctrlKey) {
		EventUtil.preventDefault(event);
	}
})

// 添加粘贴事件相关内容
var EventUtil = {
	// 省略的代码
	
	getClipboardText: function(event) {
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData('text');
	},

	// 省略的代码

	setClipboardText: function(event, value) {
		if(event.clipboardData) {
			return event.clipboardData.setData('text/plain', value);
		} else if(window.clipboardData) {
			return window.clipboardData.setData('text', value);
		}
	}

	// 省略的代码
};

// 在paste事件中，检测剪贴板的值是否有效
EventUtil.addHandler(textbox, 'paste', function(event) {
	event = EventUtil.getEvent(event);
	var text = EventUtil.getClipboardText(event);

	if(!/^\d*$/.test(text)) {
		EventUtil.preventDefault(event);
	}
});


// 自动切换焦点
(function() {
	function tabForward(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);

		if(target.value.length == target.maxLength) {
			var form = target.form;
			
			for(var i = 0; len = form.elements.length; i < len; i++) {
				if(form.elements[i] == target) {
					if(form.elements[i + 1]) {
						form.elements[i + 1].focus();
					}
					return;
				}
			}
		}
	}

	var textbox1 = document.getElementById('textTel1');
	var textbox2 = document.getElementById('textTel2');
	var textbox3 = document.getElementById('textTel3');

	EventUtil.addHandler(textbox1, 'keyup', tabForward);
	EventUtil.addHandler(textbox2, 'keyup', tabForward);
	EventUtil.addHandler(textbox3, 'keyup', tabForward);
})();

// 检测表单是否为必填字段
var isUsernameRequired = document.forms[0].elements['username'].required;

// 检测浏览器是否支持表单required属性
var isRequiredSupported = 'required' in document.createElement('input');

// 使用checkValidity()方法可以检测表单中的某个字段是否有效
if(document.forms[0].elements[0].checkValidity()) {
	// 字段有效，继续
} else {
	// 字段无效
}

// 通过validity属性检测表单的有效性
if(input.validity && !input.validity.valid) {
	if(input.validity.valueMissing) {
		alert('Please specify a value!');
	} else if(input.validity.typeMismatch) {
		alert('Please enter an email address!');
	} else {
		alert('Value is invalid!')
	}
}

// 禁用验证
document.forms[0].elements['btnNoValidate'].formNoValidate = true;
document.forms[0].elements['btnNoValidate'].formNoValidate = true;

// 实现表单序列化代码
function serialize(form) {
	var parts = [],
		filed = null,
		i,
		len,
		j,
		optLen,
		option
		optValue;
	for(i = 0; len = form.elements.length; i < len; i++) {
		field = form.elements[i];

		switch(field.type) {
			case 'select-one':
			case 'select-multiple':
				if(filed.name.length) {
				for(j = 0; optLen = field.options.length; j < optLen; j++) {
					option = field.options[j];
					if(option.selected) {
						optValue = '';
						if(option.hasAttribute) {
							optValue = (option.hasAttribute('value') ? option.value : option.text);
						} else {
							optValue = (option.attribute['value'].specified ? option.value : option.text);
						}

						parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
					}
				}
			}
			break;

		case undefined:
		case 'file':
		case 'submit':
		case 'reset':
		case 'button':
			break;
		
		case 'radio':
		case 'checkbox':
			if(!field.checked) {
				break;
			}
			// 执行默认操作
		default:
			// 不包含任何表单字段
			if(field.name.length) {
				parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(filed.value));
			}
		}
	}
	return parts.join('&');
}


/*
*
* 第16章 HTML5脚本编程
*
*/


/*
* 16.1 跨文档消息传递
*/
var iframeWindow = document.getElementById('myframe').contentWindow;
iframeWindow.postMessage('a secret!', 'http://www.wrox.com');

// 接收到消息后验证发送窗口的来源
EventUtil.addHandler(window, 'message', function(event) {
	// 确保发送消息的域是已知的域
	if(event.origin == 'http://www.wrox.com') {
		// 处理接收到的数据
		processMessage(event.data);

		// 可选：向来源窗口发送回执
		event.source.postMessage('Received!', 'http://p2p.wrox.com');
	}
});

/*
* 16.2 原生拖放
*/

/*
* 16.3 媒体元素
*/

// 嵌入视频
<video src="conference.mpg" id="myVideo">Video player not available.</video>

// 嵌入音频
<audio src="song.mp3" id="myAudio">Audio player not available.</video>












/*
*
* 第17章 错误处理与调试
*
*/

try {
	window.someNonexistentFunction();
} catch(error) {
	alert(error.message);
}

// finally子句
function testFinally() {
	try {
		return 2;
	} catch(error) {
		return 1;
	} finally {
		return 0; // 无论如何一定会执行
	}
}
// 0


// 在 try-catch 语句的 catch 语句中使用 instanceof 操作符
try {
	someFunction();
} catch(error) {
	if(error instanceof TypeError) {
		// 处理类型错误
	} else if(error instanceof ReferenceError) {
		// 处理引用错误
	} else {
		// 处理其他类型的错误
	}
}

// 自定义错误类型
function CustomError(message) {
	this.name = 'CustomError';
	this.message = message;
}
CustomError.prototype = new Error();
throw new CustomError('My message!')

//
function process(values) {
	if(!(values instanceof Array)) {
		throw new Error('process(): Argument must be an Array.');
	}

	values.sort();
	for(var i = 0; i < values.length; i++) {
		if(values[i] > 100) {
			return values[i];
		}
	}

	return -1;
}

// 处理查询字符串的函数
function addQueryStringArg(url, name, value) {
	if(url.indexOf('?') == -1) {
		url += '?';
	} else {
		url += '&';
	}

	url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
	return url;
}

// 使用
var url = 'http://www.somedomain.com';
var newUrl = addQueryStringArg(url, 'redir', 'http://www.someotherdomain.com?a=b&c=d');
alert(newUrl);


// 通过在 for 循环中添加 try-catch 语句，任何模块初始化时出错，都不会影响其他模块的初始化。
for(var i = 0, len = mods.length; i < len; i++) {
	try {
		mods[i].init();
	} catch(err) {
		// 在这里处理错误
	}
}

// 将数据写入错误日志中
function logError(sev, msg) {
	var img = new Image();
	img.src = 'log.php?sev=' + encodeURIComponent(sev) + '&msg=' + encodeURIComponent(msg);
}

// 只要使用try-catch语句，就应该把相应错误记录到日志中
for(var i = 0, len = mods.length; i < len; i++) {
	try {
		mods[i].init();
	} catch(err) {
		logError('nonfatal', 'Module init failed: ' + err.message);
	}
}










































