'use strict';

function $(arg) {
	return new Chloe(arg);
}

function Chloe(arg) {
	this.elements = [];		// 存选择的元素
	this.domString = '';	// 存创建的元素
	switch(typeof arg) {
		// 方法
		case 'function':
			domReady(arg);
			break;
		// 选择器
		case 'string':
			if(arg.indexOf('<') != -1) {
				this.domString = arg;	// 创建元素
			} else {
				this.elements = getEle(arg);	// 选择元素
			}
			break;
		// 原生转化
		default:
			if(arg instanceof Array) {
				this.elements = this.elements.concat(arg);
			} else {
				this.elements.push(arg);
			}
			break;
	}
}

Chloe.prototype.css = function(name, value) {
	if( arguments.length == 2) {	// 设置css
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].style[name] = value;
		}
	} else {
		if(typeof name == 'string') {	// 获取css，默认获取一组元素中的第一个的css
			return getStyle(this.elements[0], name);
		} else {	// 设置一组css
			var json = name;
			for(var i = 0; i < this.elements.length; i++) {
				for(var name in json) {
					this.elements[i].style[name] = json[name];
				}
			}
		}
	}
	return this;
};

Chloe.prototype.attr = function(name, value) {
	if( arguments.length == 2) {	// 设置属性
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].setAttribute(name, value);
		}
	} else {
		if(typeof name == 'string') {	// 获取属性，默认获取一组元素中的第一个的属性
			return this.elements[0].getAttribute(name);
		} else {	// 设置一组属性
			var json = name;
			for(var i = 0; i < this.elements.length; i++) {
				for(var name in json) {
					this.elements[i].setAttribute(name, value);
				}
			}
		}
	}
	return this;
};

// DOM操作
Chloe.prototype.html = function(str) {
	if(str || str == '') {	// 空字符串''的length为0
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].innerHTML = str;
		}
	} else {
		return this.elements[0].innerHTML;
	}
	return this;
};

Chloe.prototype.val = function(str) {
	if(str || str == '') {	// 空字符串''的length为0
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].value = str;
		}
	} else {
		return this.elements[0].value;
	}
	return this;
};


// insertAjacentHTML(where, [el], [html]);
// beforeBegin:插入到标签开始前
// afterBegin: 插入到标签开始标记之后
// beforeEnd:  插入到标签结束标记前
// afterEnd:   插入到标签结束标记后

Chloe.prototype.appendTo = function(str) {
	var aParent = getEle(str);
	for(var i = 0; i < aParent.length; i++) {
		aParent[i].insertAjacentHTML('beforeEnd', this.domString);
	}
	return this;
};

Chloe.prototype.prependTo = function(str) {
	var aParent = getEle(str);
	for(var i = 0; i < aParent.length; i++) {
		aParent[i].insertAjacentHTML('afterBegin', this.domString);
	}
	return this;
};

Chloe.prototype.insertBefore = function(str) {
	var aParent = getEle(str);
	for(var i = 0; i < aParent.length; i++) {
		aParent[i].insertAjacentHTML('beforeBegin', this.domString);
	}
	return this;
};

Chloe.prototype.insertBefore = function(str) {
	var aParent = getEle(str);
	for(var i = 0; i < aParent.length; i++) {
		aParent[i].insertAjacentHTML('afterEnd', this.domString);
	}
	return this;
};

Chloe.prototype.remove = function() {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
	return this;
};

Chloe.prototype.addClass = function(cName) {
	var reg = new RegExp('\\b'+cName+'\\b');
	for(var i = 0; i < this.elements.length; i++) {
		if(cName) {
			if(this.elements[i].className) {
				if(!reg.test(this.elements[i].className)) {
					this.elements[i].className += ' ' + cName;
				}
			} else {
				this.elements[i].className = cName;
			}
		} else {
			console.log('>>>There is no class to add!');
		}
	}
	return this;
};

Chloe.prototype.removeClass = function(cName) {
	var reg = new RegExp('\\b'+cName+'\\b');
	for(var i = 0; i < this.elements.length; i++) {
		if(cName) {
			if(reg.test(this.elements[i].className)) {
				this.elements[i].className = this.elements[i].className.replace(reg, '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
			}
		} else {
			console.log('>>>There is no class to remove!');
		}
	}
	return this;
};

Chloe.prototype.eq = function(n) {
	return $(this.elements[n]);
};

Chloe.prototype.get = function(n) {
	return this.elements[n];
};

Chloe.prototype.index = function() {
	var obj = this.elements[0];
	var aSibling = obj.parentNode.children;
	for (var i = 0; i < aSibling.length; i++) {
		if(obj == aSibling[i]) {
			return i;
		}
	}
	return this;
};

Chloe.prototype.find = function(str) {
	var aParent = this.elements;
	var aChild = getEle(str, aParent);
	return $(aChild);
}

Chloe.prototype.animate = function(json, options) {
	for(var i = 0; i < this.elements.length; i++) {
		move(this.elements[i], json, options);
	}
	return this;
}

$.ajax = Chloe.ajax = function(json) {
	ajax(json);
}

$.jsonp = Chloe.jsonp = function(json) {
	jsonp(json);
}


Chloe.prototype.toggle = function() {
	var args = arguments;
	var count = 0;
	var _this = this;
	for(var i = 0; i < this.elements.length; i++) {
		(function(count) {	// 闭包，让每个toggle事件独立完成
			addEvent(_this.elements[i], 'click', function() {	// TODO 事件更改
				var fn = args[count % args.length];
				fn && fn.apply(this, arguments);
				count++;
			})
		})(0);
	}
	return this;
};

Chloe.prototype.show = function() {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'block';
	}
	return this;
};

Chloe.prototype.hide = function() {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none';
	}
	return this;
};

Chloe.prototype.on = function(sEv, fn) {	// TODO 添加第二个参数事件委托
	for(var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i], sEv, fn);
	}
};

Chloe.prototype.hover = function(fnOver, fnOut) {
	this.mouseenter(fnOver);
	this.mouseOut(fnOut);
	return this;
};

// click、mouseover等不需要on的事件
'click mouseover mousedown mousemove mouseout keydown keyup load resize focus blur'.replace(/\w+/g, function(sEv) {
	Chloe.prototype[sEv] = function(fn) {
		for(var i = 0; i < this.elements.length; i++) {
			addEvent(this.elements[i], sEv, fn);
		}
		return this;
	};
});

// onmouseover、onmouseout
// 问题1：移入子级也算重新移入
// 解决1：onmouseover -> onmouseenter
// 问题2：移出子级也算移出
// 解决2：onmouseout -> onmouseleave

Chloe.prototype.mouseenter = function(fn) {
	for(var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i], 'mouseover', function(ev) {
			var fm = ev.fromElement || ev.relatedTarget;
			if(this.contains(fm)) {	// 是子元素就return出去
				return;
			}
			fn && fn.apply(this, arguments);
		});
	}
	return this;
};

Chloe.prototype.mouseleave = function(fn) {
	for(var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i], 'mouseout', function(ev) {
			var to = ev.toElement || ev.relatedTarget;
			if(this.contains(to)) {	// 是子元素就return出去
				return;
			}
			fn && fn.apply(this, arguments);
		});
	}
	return this;
};

$.fn = Chloe.prototype;
$.fn.extend = Chloe.prototype.extend = function(json) {
	for(var name in json) {
		Chloe.prototype[name] = json[name];
	}
}

// 添加事件
function addEvent(obj, sEv, fn) {
	//对象, 事件(不加on), 函数名/函数
	if(obj.addEventListener) {	//高级浏览器 -> function  低级 ->undefined
		obj.addEventListener(sEv, function(ev) {
			var oEvent = ev || event;
			if(fn.apply(obj, arguments) == false) {	// 强制改变fn中的this
				oEvent.cancelBubble = true;	// 阻止冒泡
				oEvent.preventDefault();	// 阻止默认行为
			}
		}, false);
	} else {
		obj.attachEvent('on' + sEv, function(ev) {
			var oEvent = ev || event;
			if(fn.apply(obj, arguments) == false) {	// 强制改变fn中的this
				oEvent.cancelBubble = true;	// 阻止冒泡
				return false;
			}
		});
	}
}

// 运动
function move(obj, json, options) {
	//obj, {attr1: val1, attr2: val2}, {[duration], [easing], [complete]}
	options = options || {};
	options.duration = options.duration || 700;
	options.easing = options.easing || 'linear';

	clearInterval(obj.timer);

	var start = {};
	var dis = {};

	for(var name in json) {
		start[name] = parseFloat(getStyle(obj, name));
		dis[name] = json[name] - start[name];
	}

	var count = Math.floor(options.duration / 30);
	var n = 0;
	obj.timer = setInterval(function(){
		n++;
		for(var name in json) {
			switch(options.easing) {	// TODO：运动形式扩展
				case 'linear':
					var a = n / count;
					var cur = start[name] + dis[name] * a;
					break;
				case 'ease-in':
					var a = n / count;
					var cur = start[name] + dis[name] * Math.pow(a, 3);
					break;
				case 'ease-out':
					var a = 1 - n / count;
					var cur = start[name] + dis[name] * (1 - Math.pow(a, 3));
					break;
			}

			if(name == 'opacity') {
				obj.style.opacity = cur;
				obj.style.filter = 'alpha(opacity:' + cur * 100 + ')';
			} else {
				obj.style[name] = cur + 'px';
			}
		}

		if( n == count) {
			clearInterval(obj.timer);
			options.complete && options.complete();
		}
	}, 30);
}

// ajax
function ajax(json) {
	//url, data, type, success, error
	json = json || {};
	if(!json.url) {
		console.log('>>>url is null!');
		return;
	}
	json.data = json.data || {};
	json.type = json.type || 'get';
	json.time = json.time || 1000;

	if (window.XMLHttpRequest) {
		var oAjax = new XMLHttpRequest();
	} else {
		var oAjax = new ActiveXObject("Microsoft.XMLHTTP");
	}

	switch (json.type.toLowerCase()) {
		case 'get':
			oAjax.open('GET', json.url + '?' + jsonToURL(json.data), true);
			oAjax.send();
			break;
		case 'post':
			oAjax.open('POST', json.url, true);
			oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			oAjax.send(jsonToURL(json.data));
			break;
	}

	json.loading && json.loading();
	oAjax.onreadystatechange = function() {
		if (oAjax.readyState == 4) {
			if (oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
				json.success && json.success(oAjax.responseText);
			} else {
				json.error && json.error(oAjax.status);
			}
			json.complete && json.complete();
			clearTimeout(timer);
		}
	};

	var timer = null;
	timer = setTimeout(function() {
		console.log('>>>请求超时!');
		oAjax.onreadystatechange = null;
	}, json.time);
}

// json -> url
function jsonToURL(json) {
	json.t = new Date().getTime();
	var arr = [];
	for (var name in json) {
		arr.push(name + '=' + json[name]);
	}
	return arr.join('&');
}

// jsonp
function jsonp(json) {
	// url, data, cbName, success
	//路径，参数，回调函数名字，回调函数
	json = json || {};
	if(!json.url) {
		console.log('>>>url is null!');
		return;
	}
	json.data = json.data || {};
	json.cbName = json.cbName || 'cb';

	var fnName = 'jsonp_' + Math.random();
	fnName = fnName.replace('.', '');

	//全局函数防止与外部函数jsonp()重名
	window[fnName] = function(json2) {
		json.success && json.success(json2);
		oHead.removeChild(oS);
	};

	var arr = [];
	json.data[json.cbName] = fnName;

	for(var name in json.data) {
		arr.push(name + '=' + json.data[name]);
	}

	var oS = document.createElement('script');
	var oHead = document.getElementsByTagName('head')[0];

	oS.src = json.url + '?' + arr.join('&');
	oHead.appendChild(oS);
}

// 获取某元素的某样式
function getStyle(obj, name) {
	return (obj.currentStyle || getComputedStyle(obj, false))[name];
}

// domReady
function domReady(fn) {
	if(document.addEventListener) {
		document.addEventListener('DOMContentLoaded', fn, false);
	} else {
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState == 'complete'){
				fn && fn();
			}
		});
	}
}

// 从某父元素下获取某子元素
function getEle(str, aParent) {
	var arr = str.replace(/^\s+|\s+$/g, '').split(/\s+/);
	var aParent = aParent || [document];
	var aChild = [];
	for(var i = 0; i < arr.length; i++) {
		aChild = getStr(aParent, arr[i]);
		aParent = aChild;
	}
	return aChild;
}

// 选择器
function getStr(aParent, str) {
	var aChild = [];
	for (var i = 0; i < aParent.length; i++) {
		switch(str.charAt(0)) {
			// id
			case '#':
				var obj = document.getElementById(str.substring(1));
				aChild.push(obj);
				break;
			// class
			case '.':
				var aEle = getByClass(aParent[i], str.substring(1));
				for(var j = 0; j < aEle.length; j++) {
					aChild.push(aEle[j]);
				}
				break;
			// 含标签
			default:
				if(/\w+\.\w+/.test(str)) {		// eg:li.red
					var arr = str.split('.');
					var aEle = aParent[i].getElementsByTagName(arr[0]);
					var reg = new RegExp('\\b' + arr[1] + '\\b');
					for (var j = 0; j < aEle.length; j++) {
						if(reg.test(aEle[j].className)) {
							aChild.push(aEle[j]);
						}
					}
				} else if(/\w+:\w+(\(\d+\))?/.test(str)) {	// 伪类 eg:li:first
					var arr = str.split(/:|\(|\)/g);
					var aEle = aParent[i].getElementsByTagName(arr[0]);
					switch(arr[1]) {
						case 'first':
							aChild.push(aEle[0]);
							break;
						case 'last':
							aChild.push(aEle[aEle.length - 1]);
							break;
						case 'odd':  // 得到数组的第奇数个 aEle[1] aEle[3] 对应视图的第2个 第4个
							// 选取每个带有奇数 index 值的元素
							for(var j = 1; j < aEle.length; j += 2) {
								aChild.push(aEle[j]);
							}
							break;
						case 'even':
							for(var j = 0; j < aEle.length; j += 2) {
								aChild.push(aEle[j]);
							}
							break;
						case 'eq':
							var index = arr[2];
							aChild.push(aEle[index]);
							break;
						case 'lt':
							var index = arr[2];
							for(var j = 0; j < index; j++) {
								aChild.push(aEle[j]);
							}
							break;
						case 'gt':
							var index = arr[2];
							for(var j = index; j < index; j++) {
								aChild.push(aEle[j]);
							}
							break;
						default:
							break;
					}
				} else if(/\w+\[\w+=\w+\]/.test(str)) {		// input[type=text]
					var arr = str.split(/\[|=|\]/g);
					var aEle = aParent[i].getElementsByTagName(arr[0]);
					for(var j = 0; j < aEle.length; j++) {
						if(aEle[j].getAttribute(arr[1]) == arr[2]) {
							aChild.push(aEle[j]);
						}
					}
				} else {	// tag
					var aEle = aParent[i].getElementsByTagName(str);
					for(var j = 0; j < aEle.length; j++) {
						aChild.push(aEle[j]);
					}
					break;
				}
		}
	}

	return aChild;
}

// getByClass兼容IE8-
function getByClass(oP, sClass) {
	if(oP.getElementsByClassName) {
		return oP.getElementsByClassName(sClass);
	} else {
		var arr = [];
		var aEle = oP.getElementsByTagName('*');
		var reg = new RegExp('\\b' + sClass + '\\b');
		for (var i = 0; i < aEle.length; i++) {
			if(reg.test(aEle[i].className)) {
				arr.push(aEle[i]);
			}
		}
		return arr;
	}
}
