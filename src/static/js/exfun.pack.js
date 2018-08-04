/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 88);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
setCookie('name', 1111, 5);
setCookie('name1', 22222, 5);

console.log(getCookie('name'));
console.log(getAllCookie());

delCookie('name1');
clearCookie('undefined')    //清除未定义的名的cookie
*/
/*set cookie*/
var cookie = exports.cookie = {
    setCookie: function setCookie(name, value, Days) {
        if (Days == null || Days == '') {
            Days = 300;
        }
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + "; path=/;expires=" + exp.toGMTString();
        //document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },

    /*get cookie*/
    getCookie: function getCookie(name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
    },

    /*get all cookie*/
    getAllCookie: function getAllCookie() {
        return document.cookie;
    },

    /* clear cookie*/
    clearCookie: function clearCookie(name) {
        this.setCookie(name, '', -1);
    },

    /* del cookie*/
    delCookie: function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
    }
};

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var network = exports.network = {
    get: function get(url, callback) {
        //replace $.get
        var self = this;
        var wrap_callback = function wrap_callback(resp) {
            if (resp.msg) {
                self.show_msg(resp.msg);
            }
            if (resp.status && typeof resp.status == 'string' && resp.status != 'success') {
                cfg.hide_load();
                return;
            } else {
                callback(resp);
            }
        };
        return $.get(url, wrap_callback);
    },
    post: function post(url, data, callback) {
        var self = this;
        var wrap_callback = function wrap_callback(resp) {
            var msg = [];
            if (resp.msg) {
                if (typeof resp.msg == 'string') {
                    msg.push(resp.msg);
                } else {
                    msg = msg.concat(resp.msg);
                }
            }
            for (var k in resp) {
                if (resp[k] && resp[k].msg) {
                    if (typeof resp[k].msg == 'string') {
                        msg.push(resp[k].msg);
                    } else {
                        msg = msg.concat(resp[k].msg);
                    }
                }
            }
            if (msg.length != 0) {
                cfg.showMsg(msg.join('\n'));
            }
            if (resp.status && typeof resp.status == 'string' && resp.status != 'success') {
                cfg.hide_load(); // sometime
                return;
            } else {
                callback(resp);
            }
        };
        return $.post(url, data, wrap_callback);
    },
    load_js: function load_js(src, success) {
        success = success || function () {};
        var name = src; //btoa(src)
        if (!window['__js_hook_' + name]) {
            window['__js_hook_' + name] = [];
        }
        window['__js_hook_' + name].push(success);
        var hooks = window['__js_hook_' + name];
        if (window['__js_loaded_' + name]) {
            while (hooks.length > 0) {
                hooks.pop()();
            }
        }
        if (!window['__js_' + name]) {
            window['__js_' + name] = true;
            var domScript = document.createElement('script');
            domScript.src = src;

            domScript.onload = domScript.onreadystatechange = function () {
                if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                    window['__js_loaded_' + name] = true;
                    while (hooks.length > 0) {
                        hooks.pop()();
                    }
                    this.onload = this.onreadystatechange = null;
                    // 让script元素显示出来
                    //this.parentNode.removeChild(this);
                }
            };
            document.getElementsByTagName('head')[0].appendChild(domScript);
        }
    },
    load_css: function load_css(src) {
        var name = btoa(src);
        if (window['__src_' + name]) {
            return;
        }
        window['__src_' + name] = true;
        $('head').append('<link rel="stylesheet" href="' + src + '" type="text/css" />');
    }
};

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var obj_control = exports.obj_control = {
    isEmpty: function isEmpty(obj) {
        for (var k in obj) {
            if (/^[^_]/.exec(k)) {
                return false;
            }
        }
        return true;
    }
};

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

//function para_encode(para_str){
//    return encodeURI(para_str).replace('+','%2B')
//}

var old = exports.old = {

    /*两种调用方式
     var template1="我是{0}，今年{1}了";
     var template2="我是{name}，今年{age}了";
     var result1=template1.format("loogn",22);
     var result2=template2.format({name:"loogn",age:22});
     两个结果都是"我是loogn，今年22了"
     */
    template: function template(string, args) {
        var result = string;
        if (args.length) {
            for (var i = 0; i < args.length; i++) {
                if (args[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, args[i]);
                }
            }
        } else {
            for (var key in args) {
                var value = args[key];
                if (value == undefined) {
                    value = '';
                }

                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, value);
            }
        }
        return result;
    },
    /*
     ex.merge([{name:'dog',age:'18'}],[{name:'dog',label:'dog_label'}])
     >> [{name:'dog',age:'18',label:'dog_label'}]
     */
    merge: function merge(src1, src2) {
        var self = this;
        var dst_list = JSON.parse(JSON.stringify(src1));
        this.each(src2, function (src_item) {
            var obj = self.findone(dst_list, { name: src_item.name });
            if (obj) {
                self.assign(obj, src_item);
            } else {
                dst_list.push(src_item);
            }
        });
        return dst_list;
    },
    product: function product(src1, src2) {
        var out = [];
        for (var i = 0; i < src1.length; i++) {
            for (var j = 0; j < src2.length; j++) {
                out.push([src1[i], src2[j]]);
            }
        }
        return out;
    },
    copy: function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    split: function split(base_str, sep) {
        if (base_str == '') {
            return [];
        } else {
            return base_str.split(sep);
        }
    },

    append_css: function append_css(styles_str) {
        /*
         * @styles_str : css string or <style>css string</style>
         * */
        window._appended_css = window._appended_css || [];
        if (ex.isin(styles_str, window._appended_css)) {
            return;
        } else {
            window._appended_css.push(styles_str);
        }
        var mt = /<style.*>([\s\S]*)<\/style>/im.exec(styles_str);
        if (mt) {
            styles_str = mt[1];
        }
        var style = document.createElement('style');

        //这里最好给ie设置下面的属性
        /*if (isIE()) {
         style.type = “text/css”;
         style.media = “screen”
         }*/
        (document.getElementsByTagName('head')[0] || document.body).appendChild(style);
        if (style.styleSheet) {
            //for ie
            style.styleSheet.cssText = styles_str;
        } else {
            //for w3c
            style.appendChild(document.createTextNode(styles_str));
        }

        //function includeStyleElement(styles,styleId) {
        //
        //	if (document.getElementById(styleId)) {
        //		return
        //	}
        //	var style = document.createElement(“style”);
        //	style.id = styleId;
        //	//这里最好给ie设置下面的属性
        //	/*if (isIE()) {
        //	 style.type = “text/css”;
        //	 style.media = “screen”
        //	 }*/
        //	(document.getElementsByTagName(“head”)[0] || document.body).appendChild(style);
        //	if (style.styleSheet) { //for ie
        //		style.styleSheet.cssText = styles;
        //	} else {//for w3c
        //		style.appendChild(document.createTextNode(styles));
        //	}
        //}
        //var styles = “#div{background-color: #FF3300; color:#FFFFFF }”;
        //includeStyleElement(styles,”newstyle”);
    },

    is_fun: function is_fun(v) {
        return typeof v === "function";
    },

    show_msg: function show_msg(msg) {
        alert(msg);
    },
    access: function access(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    },
    set: function set(par, name, obj) {
        name = name.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        name = name.replace(/^\./, ''); // strip a leading dot
        var a = name.split('.');
        var o = par;
        for (var i = 0; i < a.length - 1; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return null;
            }
        }
        o[a[a.length - 1]] = obj;
        return o;
    },
    tr: function tr(str) {
        var gettext = window.gettext || function (x) {
            return x;
        };
        return gettext(str);
    },
    trList: function trList(strlist) {
        // translate string list to a map object
        var gettext = window.gettext || function (x) {
            return x;
        };
        var map_obj = {};
        ex.each(strlist, function (key) {
            map_obj[key] = gettext(key);
        });
        return map_obj;
    },
    unique: function unique(array) {
        var res = [];
        var json = {};
        for (var i = 0; i < array.length; i++) {
            if (!json[array[i]]) {
                res.push(array[i]);
                json[array[i]] = 1;
            }
        }
        return res;
    },
    group_add: function group_add(old_array, new_array, callback) {
        var out_list = old_array.slice();
        var last_key = null;
        var last_list = null;
        ex.each(new_array, function (item) {
            var key = callback(item);
            if (key != last_key) {
                var obj = ex.findone(out_list, function (old_item) {
                    if (old_item.key == key) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if (!obj) {
                    last_list = [];
                    last_key = key;
                    out_list.push({ key: last_key, list: last_list });
                } else {
                    last_list = obj.list;
                }
            }
            last_list.push(item);
        });
        return out_list;
    }

    //function parseSearch(queryString) {
    //    var queryString = queryString || location.search
    //    if(queryString.startsWith('?')){
    //        var queryString=queryString.substring(1)
    //    }
    //    var params = {}
    //    // Split into key/value pairs
    //    var queries = queryString.split("&");
    //    // Convert the array of strings into an object
    //    for (var i = 0; i < queries.length; i++ ) {
    //        var mt = /([^=]+?)=(.+)/.exec(queries[i])
    //        params[mt[1]] = mt[2];
    //    }
    //    return params;
    //}
    //function searchfy(obj,pre){
    //    var outstr=pre||''
    //    for(x in obj){
    //        if(obj[x]){
    //            outstr+=x.toString()+'='+ obj[x].toString()+'&';
    //        }
    //
    //    }
    //    if(outstr.endsWith('&')){
    //        return outstr.slice(0,-1)
    //    }else{
    //        return outstr
    //    }
    //
    //}
    //function update(dst_obj,src_obj) {
    //    for(x in src_obj){
    //        dst_obj[x]=src_obj[x]
    //    }
    //}

};

/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sortOrder = sortOrder;
function isChinese(temp) {
    var re = /[^\u4E00-\u9FA5]/;
    if (re.test(temp[0])) {
        return false;
    }
    return true;
}
function compare(temp1, temp2) {
    if (temp1 < temp2) {
        return -1;
    } else if (temp1 == temp2) {
        return 0;
    } else {
        return 1;
    }
}

function sortOrder(array, key) {

    return array.slice().sort(function (a, b) {
        if (key) {
            var val_a = a[key];
            var val_b = b[key];
        } else {
            var val_a = a;
            var val_b = b;
        }
        if (isChinese(val_a) && isChinese(val_b)) {
            return val_a.localeCompare(val_b, 'zh');
        } else {
            return compare(val_a, val_b);
        }
    });
}

/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
* 以打补丁的方式，区域那些不兼容的部分
* */
//  startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
    String.prototype.endsWith = function (str) {
        return this.match(str + "$") == str;
    };
}

Array.prototype.each = function (fn) {
    return this.length ? [fn(this.slice(0, 1))].concat(this.slice(1).each(fn)) : [];
};

/*两种调用方式
 var template1="我是{0}，今年{1}了";
 var template2="我是{name}，今年{age}了";
 var result1=template1.format("loogn",22);
 var result2=template2.format({name:"loogn",age:22});
 两个结果都是"我是loogn，今年22了"
 */
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && (typeof args === "undefined" ? "undefined" : _typeof(args)) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function encode(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    decode: function decode(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = Base64._utf8_decode(output);

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function _utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                i += 3;
            }
        }
        return string;
    }
};

if (!window.atob) {
    window.atob = Base64.decode;
    window.btoa = Base64.encode;
}

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(86);
__webpack_require__(85);

/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var urlparse = exports.urlparse = {
    parseSearch: function parseSearch(queryString) {
        var queryString = queryString || location.search;
        if (queryString.startsWith('?')) {
            var queryString = queryString.substring(1);
        }
        var params = {};
        // Split into key/value pairs
        var queries = queryString.split("&");
        // Convert the array of strings into an object
        for (var i = 0; i < queries.length; i++) {
            var mt = /([^=]+?)=(.+)/.exec(queries[i]);
            if (mt) {
                params[mt[1]] = decodeURI(mt[2]);
            }
        }
        return params;
    },
    searchfy: function searchfy(obj, pre) {
        var outstr = pre || '';
        for (var x in obj) {
            var value = obj[x];
            if (value === true) {
                value = '1';
            }
            if (value === false) {
                value = '0';
            }
            if (value !== '' && value != null) {
                outstr += x.toString() + '=' + value.toString() + '&';
            }
        }
        if (outstr.endsWith('&')) {
            return para_encode(outstr.slice(0, -1));
        } else if (outstr == pre) {
            return '';
        } else {
            return para_encode(outstr);
        }
    },
    appendSearch: function appendSearch(url, obj) {
        if (!obj) {
            var obj = url;
            var url = location.href;
        }
        if (url) {
            var url_obj = ex.parseURL(url);
            var search = url_obj.params;
        } else {
            url = location.href;
            var search = ex.parseSearch();
        }
        ex.assign(search, obj);
        return url.replace(/(\?.*)|()$/, ex.searchfy(search, '?'));
    },
    parseURL: function parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            search: a.search,
            params: function () {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = decodeURI(s[1]);
                }
                return ret;
            }(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            pathname: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    }

};

function para_encode(para_str) {
    return encodeURI(para_str).replace('+', '%2B');
}

/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var vuetool = exports.vuetool = {
    vueSuper: function vueSuper(self, kws) {
        var mixin = kws.mixin;
        var name = kws.fun;
        var args = kws.args || [];
        if (mixin) {
            var index = self.$options.mixins.indexOf(mixin);
        } else {
            var index = self.$options.mixins.length;
        }
        for (var i = index - 1; i > -1; i--) {
            var mix = self.$options.mixins[i];
            var methods = mix.methods[name];
            if (methods) {
                return methods.apply(self, args);
            }
        }
    },
    vueBroadCall: function vueBroadCall(self, fun, kws) {
        var rt = [];
        cusBroadCall(self, fun, kws, rt);
        return rt;
    },
    vueParCall: function vueParCall(self, fun, kws) {
        var rt = [];
        cusParCall(self, fun, kws, rt);
        return rt;
    },
    vueExtend: function vueExtend(par, mixins) {
        var real_par = $.extend({}, par);
        var orgin_mixins = real_par.mixins;
        delete real_par.mixins;
        if (orgin_mixins) {
            var list = orgin_mixins;
        } else {
            var list = [];
        }
        list.push(real_par);
        list = list.concat(mixins);
        var final_obj = list[list.length - 1];
        final_obj.mixins = list.slice(0, list.length - 1);
        return final_obj;
    }
};

function cusBroadCall(self, fun, kws, rt) {
    if (!self.$children) {
        return;
    }
    for (var i = 0; i < self.$children.length; i++) {
        var child = self.$children[i];
        if (child[fun]) {
            rt.push(child[fun](kws));
        }
        cusBroadCall(child, fun, kws, rt);
    }
}
function cusParCall(self, fun, kws, rt) {
    if (!self.$parent) {
        return;
    }
    var par = self.$parent;
    if (par[fun]) {
        rt.push(par[fun](kws));
    }
    cusParCall(par, fun, kws, rt);

    //for(var i =0;i<self.$parent.length;i++){
    //    var par =self.$parent[i]
    //    if(par[fun]){
    //        rt.push(par[fun](kws))
    //    }
    //    cusParCall(par,fun,kws,rt)
    //}
}

/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".abs-full {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 0; }\n\n.abs-middle {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%); }\n", ""]);

// exports


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".clickable {\n  cursor: pointer;\n  color: #4da8cd; }\n", ""]);

// exports


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var code = exports.code = {
    //hashCode:function (str){
    //    var str =btoa(str)
    //    var h = 0, off = 0;
    //    var len = str.length;
    //    for(var i = 0; i < len; i++){
    //        h = 31 * h + str.charCodeAt(off++);
    //    }
    //    var t=-2147483648*2;
    //    while(h>2147483647){
    //        h+=t
    //    }
    //    return h;
    //}

    hashDict: function hashDict(dc) {
        var ls = [];
        for (var k in dc) {
            if (k.startsWith('_')) {
                continue;
            }
            if ($.isFunction(dc[k])) {
                continue;
            }
            ls.push(k);
        }
        ls = ls.sort();
        var lsl = [];
        for (var i = 0; i < ls.length; i++) {
            lsl.push(ls[i] + ':' + dc[ls[i]]);
        }
        var dc_str = lsl.join(';');
        return md5(dc_str);
    }
    //hashCode: function (input){
    //    var I64BIT_TABLE =
    //        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    //    var hash = 5381;
    //    var i = input.length - 1;
    //
    //    if(typeof input == 'string'){
    //        for (; i > -1; i--)
    //            hash += (hash << 5) + input.charCodeAt(i);
    //    }
    //    else{
    //        for (; i > -1; i--)
    //            hash += (hash << 5) + input[i];
    //    }
    //    var value = hash & 0x7FFFFFFF;
    //
    //    var retValue = '';
    //    do{
    //        retValue += I64BIT_TABLE[value & 0x3F];
    //    }
    //    while(value >>= 6);
    //
    //    return retValue;
    //}
};

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(68);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./pos_size.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./pos_size.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(69);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./text.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./text.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 88:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _old = __webpack_require__(13);

var _network = __webpack_require__(11);

var _urlparse = __webpack_require__(17);

var _collection = __webpack_require__(9);

var _patch = __webpack_require__(15);

var path = _interopRequireWildcard(_patch);

var _cookie = __webpack_require__(10);

var _obj = __webpack_require__(12);

var _vuetools = __webpack_require__(18);

var _code = __webpack_require__(8);

var _order = __webpack_require__(14);

var _main = __webpack_require__(16);

var uis = _interopRequireWildcard(_main);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ex = {
    assign: function assign(dst, src) {
        for (var key in src) {
            dst[key] = src[key];
        }
    }

    //import {md5} from  './md5.min'

};ex.assign(ex, _old.old);
ex.assign(ex, _network.network);
ex.assign(ex, _urlparse.urlparse);
ex.assign(ex, _collection.collection);
ex.assign(ex, _cookie.cookie);
ex.assign(ex, _obj.obj_control);
ex.assign(ex, _vuetools.vuetool);
ex.assign(ex, _code.code);
ex.sortOrder = _order.sortOrder;

//ex.md5=md5
window.ex = ex;

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var collection = exports.collection = {
    findone: function findone(collection, obj_or_func) {

        for (var i = 0; i < collection.length; i++) {
            var now_obj = collection[i];
            if (typeof obj_or_func == 'function') {
                var func = obj_or_func;
                var match = func(now_obj);
            } else {
                var obj = obj_or_func;
                var match = true;
                for (var key in obj) {
                    if (key.startsWith('_')) {
                        continue;
                    }
                    if (obj[key] !== now_obj[key]) {
                        match = false;
                        break;
                    }
                }
            }

            if (match) {
                return now_obj;
            }
        }

        return null;
    },
    find: function find(collection, obj) {
        out = [];
        for (var i = 0; i < collection.length; i++) {
            var now_obj = collection[i];
            var match = true;
            for (var key in obj) {
                if (obj[key] !== now_obj[key]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                out.push(now_obj);
            }
        }
        return out;
    },
    each: function each(array, func) {
        for (var i = 0; i < array.length; i++) {
            var rt = func(array[i]);
            if (rt == 'break') {
                break;
            } else if (rt == 'continue') {
                continue;
            }
        }
    },
    map: function map(array, func) {
        var out = [];
        for (var i = 0; i < array.length; i++) {
            out.push(func(array[i]));
        }
        return out;
    },
    isin: function isin(obj, array, func) {
        if (func) {
            for (var i = 0; i < array.length; i++) {
                if (func(array[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return array.indexOf(obj) != -1;
        }
    },
    filter: function filter(array, func_or_obj) {
        var out = [];
        if (typeof func_or_obj == 'function') {
            for (var x = 0; x < array.length; x++) {
                if (func_or_obj(array[x])) {
                    out.push(array[x]);
                }
            }
        } else {
            var obj = func_or_obj;
            ex.each(array, function (doc) {
                var match = true;
                for (var key in obj) {
                    if (doc[key] !== obj[key]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    out.push(doc);
                }
            });
        }
        return out;
    },
    exclude: function exclude(array, func_or_obj) {
        var out = [];
        if (typeof func_or_obj == 'function') {
            for (var x = 0; x < array.length; x++) {
                if (!func_or_obj(array[x])) {
                    out.push(array[x]);
                }
            }
        } else {
            var obj = func_or_obj;
            ex.each(array, function (doc) {
                var match = true;
                for (var key in obj) {
                    if (doc[key] !== obj[key]) {
                        match = false;
                        break;
                    }
                }
                if (!match) {
                    out.push(doc);
                }
            });
        }
        return out;
    },
    any: function any(array, func) {
        for (var x = 0; x < array.length; x++) {
            if (func(array[x])) {
                return true;
            }
        }
        return false;
    },
    extend: function extend(array1, array2) {
        array1.push.apply(array1, array2);
        return array1;
    },
    remove: function remove(array, func_or_obj) {
        var index_ls = [];
        if (typeof func_or_obj == 'function') {
            var func = func_or_obj;
            for (var i = 0; i < array.length; i++) {
                if (func(array[i])) {
                    index_ls.push(i);
                }
            }
        } else {
            var obj = func_or_obj;
            for (var i = 0; i < array.length; i++) {
                var match = true;
                for (var key in obj) {
                    if (obj[key] !== array[i][key]) {
                        match = false;
                    }
                }
                if (match) {
                    index_ls.push(i);
                }
            }
        }
        var rm_item = [];
        index_ls.reverse();
        for (var x = 0; x < index_ls.length; x++) {
            var rm = array.splice(index_ls[x], 1);
            rm_item = rm.concat(rm_item);
        }
        return rm_item;
    },
    sort_by_names: function sort_by_names(array, name_list, keep) {
        /*按照name_list来筛选和排列array，如果keep=true，落选的项会append到array后面。
         @array: [{name:'age',..},{contry:'china'}]
         @name_list:['contry','name']
         返回:按照name_list排序后的array
         * */
        var out_list = [];
        ex.each(name_list, function (name) {
            var item = ex.findone(array, { name: name });
            if (item) {
                out_list.push(item);
            }
        });
        if (keep) {
            ex.each(array, function (item) {
                if (!ex.isin(item, out_list)) {
                    out_list.push(item);
                }
            });
        }
        return out_list;
    }

};

/***/ })

/******/ });