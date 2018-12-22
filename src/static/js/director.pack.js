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
/******/ 	return __webpack_require__(__webpack_require__.s = 125);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var baseInput = exports.baseInput = {
    linetext: {
        props: ['row', 'head'],
        template: '<div :style="head.style">\n            \t\t\t<span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t\t<input v-else type="text" class="form-control input-sm" v-model="row[head.name]"\n            \t\t \t    :id="\'id_\'+head.name" :name="head.name"\n                        \t:placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>\n                       </div>'
    },
    number: {
        props: ['row', 'head'],
        template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t<input v-else type="number" class="form-control input-sm" v-model="row[head.name]"\n            \t\t    style="ime-mode:disabled"\n            \t\t    @keypress="isNumber($event)"\n            \t    \t:id="\'id_\'+head.name"\n            \t\t    :name="head.name" :step="head.step" :min=\'head.min\' :max="head.max"\n                        :placeholder="head.placeholder" :autofocus="head.autofocus"></div>',
        methods: {
            isNumber: function isNumber(evt) {
                evt = evt ? evt : window.event;
                var charCode = evt.which ? evt.which : evt.keyCode;
                //if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                if (charCode == 101 || charCode == 69) {
                    // 排除掉E
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        }
    },
    fields_ele_number: {
        props: ['row', 'head'],
        template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t<el-input-number v-else  v-model="inn_value" :id="\'id_\'+head.name"\n            \t\t    :name="head.name" :step="head.step"\n                        :placeholder="head.placeholder" :autofocus="head.autofocus"></el-input-number> </div>',
        data: function data() {
            return {
                inn_value: this.row[this.head.name]
            };
        },
        watch: {
            inn_value: function inn_value(nv) {
                this.row[this.head.name] = nv;
            }
        }
    },
    password: {
        props: ['row', 'head'],
        template: '<input type="password" :id="\'id_\'+head.name" class="form-control input-sm" v-model="row[head.name]"\n                :name="head.name" :placeholder="head.placeholder" :readonly=\'head.readonly\'>'
    },
    blocktext: {
        props: ['row', 'head'],
        template: '<div>\n            <span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            <textarea :style="head.style" v-else :maxlength="head.maxlength" class="form-control input-sm"\n                :name="head.name"\n                :id="\'id_\'+head.name" v-model="row[head.name]" :placeholder="head.placeholder"\n                :readonly=\'head.readonly\'></textarea>\n            </div>'
    },
    color: {
        props: ['name', 'row', 'kw'],
        template: '<input type="text" v-model="row[name]" :id="\'id_\'+name" :readonly=\'kw.readonly\'>',
        methods: {
            init_and_listen: function init_and_listen() {
                var self = this;
                Vue.nextTick(function () {
                    $(self.$el).spectrum({
                        color: self.row[self.name],
                        showInitial: true,
                        showInput: true,
                        preferredFormat: "name",
                        change: function change(color) {
                            self.src_color = color.toHexString();
                            self.row[self.name] = color.toHexString();
                        }
                    });
                });
            }
        },
        watch: {
            input_value: function input_value(value) {
                if (this.src_color != value) {
                    this.init_and_listen();
                }
            }
        },
        computed: {
            input_value: function input_value() {
                return this.row[this.name];
            }
        },
        mounted: function mounted() {
            var self = this;
            ex.load_css('/static/lib/spectrum1.8.0.min.css');
            ex.load_js('/static/lib/spectrum1.8.0.min.js', function () {
                self.init_and_listen();
            });
        }
    },
    logo: { // absolate
        props: ['name', 'row', 'kw'],
        template: '<logo-input :up_url="kw.up_url" :web_url.sync="row[name]" :id="\'id_\'+name"></logo-input>'
    },
    'com-field-picture': {
        props: ['row', 'head'],
        template: '<div class="picture">\n            <input class="virtual_input" style="position:absolute;height: 0;width: 0;" type="text"  :name="head.name" v-model="row[head.name]">\n            <img class="img-uploador" v-if=\'head.readonly\' :src=\'row[head.name]\'/>\n\t\t\t<img-uploador @select="on_uploader_click()" v-else :up_url="head.up_url" v-model="row[head.name]" :id="\'id_\'+head.name" :config="head.config"></img-uploador></div>',
        methods: {
            on_uploader_click: function on_uploader_click() {
                $(this.$el).find('.virtual_input').focus();
            }
        }
    },
    sim_select: {
        props: ['row', 'head'],
        data: function data() {
            var inn_config = {
                //orgin_order:true,
                order: false
            };
            if (this.head.config) {
                ex.assign(inn_config, this.head.config);
            }
            return {
                model: this.row[this.head.name],
                cfg: inn_config
            };
        },
        template: '<div>\n            <span v-if=\'head.readonly\' v-text=\'get_label(head.options,row[head.name])\'></span>\n            <select v-else v-model=\'row[head.name]\'  :id="\'id_\'+head.name" :name="head.name"  class="form-control input-sm">\n                <option v-if="head.placeholder" :value="place_value" disabled selected style=\'display:none;color: grey;\' class="placeholder" v-text="head.placeholder"></option>\n            \t<option v-for=\'opt in normed_options\' :value=\'opt.value\' v-text=\'opt.label\'></option>\n            </select>\n            </div>',
        mounted: function mounted() {
            if (this.head.default && !this.row[this.head.name]) {
                Vue.set(this.row, this.head.name, this.head.default);
                //this.row[this.name]=this.kw.default
            }
        },
        computed: {
            place_value: function place_value() {
                var v = this.row[this.head.name];
                if (v === undefined) {
                    return undefined;
                } else if (v === null) {
                    return null;
                } else {
                    return '';
                }
            },
            normed_options: function normed_options() {
                var self = this;
                if (this.head.hide_related_field) {
                    var array = ex.filter(this.head.options, function (item) {
                        return item.value != self.row[self.head.hide_related_field];
                    });
                } else {
                    var array = self.head.options;
                }
                return self.orderBy(array, 'label');
            }
        },
        methods: {
            get_label: function get_label(options, value) {
                var option = ex.findone(options, { value: value });
                if (!option) {
                    return '---';
                } else {
                    return option.label;
                }
            },
            orderBy: function orderBy(array, key) {
                if (this.head.order || this.cfg.order) {
                    return order_by_key(array, key);
                } else {
                    return array;
                }
            }
        }
    },
    search_select: {
        props: ['row', 'head'],
        data: function data() {
            return {
                model: this.row[this.head.name]
            };
        },
        template: '<div>\n            <span v-if=\'head.readonly\' v-text=\'get_label(head.options,row[head.name])\'></span>\n            <select v-else v-model=\'row[head.name]\'  :id="\'id_\'+head.name"  class="selectpicker form-control" data-live-search="true">\n            \t<option v-for=\'opt in orderBy(head.options,"label")\' :value=\'opt.value\'\n            \t :data-tokens="opt.label" v-text=\'opt.label\'></option>\n            </select>\n            </div>',
        mounted: function mounted() {
            var self = this;
            if (this.head.default && !this.row[this.head.name]) {
                Vue.set(this.row, this.head.name, this.head.default);
            }
            ex.load_css("/static/lib/bootstrap-select.min.css");
            ex.load_js("/static/lib/bootstrap-select.min.js", function () {
                $(self.$el).find('.selectpicker').selectpicker();
            });
        },
        methods: {
            get_label: function get_label(options, value) {
                var option = ex.findone(options, { value: value });
                if (!option) {
                    return '---';
                } else {
                    return option.label;
                }
            },
            orderBy: function orderBy(array, key) {
                return order_by_key(array, key);
            }
        }
    },

    check_select: {
        props: ['row', 'head'],
        computed: {
            selected: {
                get: function get() {
                    var data = this.row[this.head.name];
                    if (data) {
                        return data.split(',');
                    } else {
                        return [];
                    }
                },
                set: function set(v) {
                    this.row[this.head.name] = v.join(',');
                }

            }
        },
        template: '<div>\n                <ul>\n                <li v-for=\'option in head.options\' v-if="option.value"><input type="checkbox" :value="option.value" v-model="selected"/><span v-text="option.label"></span></li>\n                </ul>\n            </div>'
    },
    field_multi_chosen: {
        props: ['row', 'head'],
        template: '<div>\n\t        \t<ul v-if=\'head.readonly\'><li v-for=\'value in row[head.name]\' v-text=\'get_label(value)\'></li></ul>\n\t        \t<div v-else>\n\t        \t<input type="text" style="display: none" v-model=\'row[head.name]\' :name="head.name">\n\t        \t<multi-chosen  v-model=\'row[head.name]\' :id="\'id_\'+head.name" :options=\'head.options\'></multi-chosen>\n\t        \t</div>\n\n\t        \t</div>',
        methods: {
            get_label: function get_label(value) {
                for (var i = 0; i < this.head.options.length; i++) {
                    if (this.head.options[i].value == value) {
                        return this.head.options[i].label;
                    }
                }
            }
        }
    },

    tow_col: {
        props: ['row', 'head'],
        template: '<div>\n\t        \t<ul v-if=\'head.readonly\'><li v-for=\'value in row[head.name]\' v-text=\'get_label(value)\'></li></ul>\n\t        \t<tow-col-sel v-else v-model=\'row[head.name]\' :id="\'id_\'+head.name" :choices=\'head.options\' :size=\'head.size\' ></tow-col-sel>\n\t        \t</div>',
        methods: {
            get_label: function get_label(value) {
                for (var i = 0; i < this.head.options.length; i++) {
                    if (this.head.options[i].value == value) {
                        return this.head.options[i].label;
                    }
                }
            }
        }
    },
    bool: {
        props: ['row', 'head'],
        template: '<div class="checkbox">\n\t        <input type="checkbox" :id="\'id_\'+head.name" v-model=\'row[head.name]\' :disabled="head.readonly">\n\t\t\t <label :for="\'id_\'+head.name"><span v-text=\'my_label\'></span></label>\n\t\t\t\t\t  </div>',
        computed: {
            my_label: function my_label() {
                if (this.head.check_label) {
                    return this.head.check_label;
                } else {
                    return this.head.label;
                }
            }
        }
    },
    date: {
        // 被 com-field-date 替代
        props: ['row', 'head'],
        template: '<div class="com-field com-field-date"><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n                                <date v-else v-model="row[head.name]" :id="\'id_\'+head.name"\n                                    :placeholder="head.placeholder"></date>\n                               </div>'
    },

    datetime: {
        props: ['row', 'head'],
        template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t\t<datetime  v-model="row[head.name]" :id="\'id_\'+head.name"\n                        \t:placeholder="head.placeholder"></datetime>\n                       </div>'
    },
    richtext: {
        props: ['row', 'head'],
        template: '<div >\n            <span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            <div v-else>\n                <ckeditor ref="ck" :style="head.style" v-model="row[head.name]"\n                :maxlength=\'head.maxlength\'\n                :id="\'id_\'+head.name" :set="head.set" :config="head.config"></ckeditor>\n                <div style="height: 1em;width: 0;position: relative">\n                <input type="text" :name=\'head.name\' style="display: none"  v-model="row[head.name]">\n                </div>\n            </div>\n         </div>',
        methods: {
            commit: function commit() {
                Vue.set(this.row, this.head.name, this.$refs.ck.editor.getData());
            }
        }
    }

};

window._baseInput = baseInput;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(78);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file_uploader.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file_uploader.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ajax_fun = __webpack_require__(25);

var _file = __webpack_require__(30);

var f = _interopRequireWildcard(_file);

var _ckeditor = __webpack_require__(26);

var ck = _interopRequireWildcard(_ckeditor);

var _multi_sel = __webpack_require__(33);

var multi = _interopRequireWildcard(_multi_sel);

var _inputs = __webpack_require__(31);

var inputs = _interopRequireWildcard(_inputs);

var _link = __webpack_require__(32);

var ln = _interopRequireWildcard(_link);

var _com_form_btn = __webpack_require__(27);

var form_btn = _interopRequireWildcard(_com_form_btn);

var _fields_base = __webpack_require__(29);

var _field_fun = __webpack_require__(28);

var _order = __webpack_require__(34);

var _table_fields = __webpack_require__(35);

var _table_fields2 = _interopRequireDefault(_table_fields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
 >->front/fields.rst>
 =========
 fields
 =========

 fields模块的目标是利用vuejs快速生成form表单。

 主要结构
 ===========
 1. field_base
 基类，包括操作逻辑，专用input组件。如果需要修改整个field的外观，可以继承field_base，然后自定义wrap template

 2. field
 wrap功能，在field_base外面套上了一层外观template，例如label，error,help_text等的显示。

 参数结构
 ==============
 field_base的参数都是采用的关键字参数，结构如下：
 使用的 kw 结构
 kw={
 errors:{},
 row:{
 username:'',
 password:'',
 pas2:'',
 },
 heads:[
 {name:'username',label:'用户名',type:'text',required:true,autofocus:true},
 ]
 }
 <field name='username' :kw='kw' ></field>


 <-<
 *配合jsonpost使用，效果最好
 */

/*
 自动处理form.errors
 $.post('',JSON.stringify(post_data),function (data) {
 is_valid(data.do_login,self.meta.errors,function () {
 location=next;
 })
 */

//import {use_color} from '../dosome/color.js'
//import {load_js,load_css} from '../dosome/pkg.js'
__webpack_require__(99);
//import * as fb from './field_base.js'
//import * as js from './adapt.js'


(0, _ajax_fun.hook_ajax_msg)();
(0, _ajax_fun.hook_ajax_csrf)();

var field = {
  mixins: [_fields_base.field_base],
  methods: {
    show_msg: function show_msg(msg, event) {
      layer.tips(msg, event.target);
    }
  },
  template: '\n    \t\t<div :class=\'["form-group field",{"error":head.error}]\' v-if="head" style="position: relative;">\n                <label :for="\'id_\'+head.name"  class="control-label" v-if=\'head.label && head.label!=""\'>\n                    <span class="label-content" v-html="head.label"></span>\n                    <span class="req_star" v-if=\'head.required\'>*</span>\n                </label>\n                <div class="field_input">\n                    <component :is=\'head.editor\'\n                        @field-event="$emit(\'field-event\',$event)"\n                        :row=\'row\'\n                        :head=\'head\'>\n                    </component>\n                </div>\n                <slot></slot>\n                <!--<i class="help-text" v-if="head.help_text" v-text="head.help_text"></i>-->\n                <span class="help-text clickable">\n                    <i style="color: #3780af;position: relative;"  v-if="head.help_text" @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n                </span>\n\n                 <!--<div class="msg" style="position: absolute;right: 5px;top: 1px;">-->\n\n                        <!--&lt;!&ndash;<i v-if="head.help_text" @click="show_msg(head.help_text,$event)" class="fa fa-shield" ></i>&ndash;&gt;-->\n\n                        <!--<span class="fa-stack error" v-if="head.error" @click="show_msg(head.error,$event)" style="font-size: 0.5em;">-->\n                              <!--<i class="fa fa-cloud fa-stack-2x" style="color: black"></i>-->\n                              <!--<i class="fa fa-close fa-stack-1x" style="color: red"></i>-->\n                        <!--</span>-->\n\n                        <!--&lt;!&ndash;<i v-if="head.error" @click="show_msg(head.error,$event)" class="fa fa-shield  error" ></i>&ndash;&gt;-->\n                        <!--&lt;!&ndash;<span class="help_text" v-text="head.help_text"></span>&ndash;&gt;-->\n                        <!--&lt;!&ndash;<span v-if="head.error_msg" class="error_msg error"  v-text=\'head.error_msg\'></span>&ndash;&gt;-->\n                 <!--</div>-->\n\t\t</div>\n\n\n\t'

};

Vue.component('field', field);

window.field_fun = _field_fun.field_fun;
window.hook_ajax_msg = _ajax_fun.hook_ajax_msg;
//window.update_vue_obj=update_vue_obj
//window.use_ckeditor= ck.use_ckeditor
window.show_upload = _ajax_fun.show_upload;
window.hide_upload = _ajax_fun.hide_upload;
//window.merge=merge;
//window.BackOps=BackOps
//window.back_ops=back_ops
window.order_by_key = _order.order_by_key;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _date = __webpack_require__(37);

var date = _interopRequireWildcard(_date);

var _file_uploader = __webpack_require__(44);

var file_uploaer = _interopRequireWildcard(_file_uploader);

var _multi_chosen = __webpack_require__(46);

var multi_chosen = _interopRequireWildcard(_multi_chosen);

var _bool = __webpack_require__(36);

var field_bool = _interopRequireWildcard(_bool);

var _int_bool = __webpack_require__(45);

var int_bool = _interopRequireWildcard(_int_bool);

var _number = __webpack_require__(47);

var number = _interopRequireWildcard(_number);

var _field_blocktext = __webpack_require__(38);

var field_blocktext = _interopRequireWildcard(_field_blocktext);

var _field_search_select = __webpack_require__(40);

var field_search_select = _interopRequireWildcard(_field_search_select);

var _field_single_chosen = __webpack_require__(42);

var field_single_chosen = _interopRequireWildcard(_field_single_chosen);

var _field_select = __webpack_require__(41);

var field_select = _interopRequireWildcard(_field_select);

var _field_date = __webpack_require__(39);

var field_date = _interopRequireWildcard(_field_date);

var _field_single_select = __webpack_require__(43);

var field_single_select2 = _interopRequireWildcard(_field_single_select);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(3);
__webpack_require__(104);
__webpack_require__(105);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _com_table = __webpack_require__(48);

var com_table = _interopRequireWildcard(_com_table);

var _table_fun = __webpack_require__(65);

var table_fun = _interopRequireWildcard(_table_fun);

var _table_filter = __webpack_require__(64);

var table_filter = _interopRequireWildcard(_table_filter);

var _table_btn = __webpack_require__(63);

var table_btn = _interopRequireWildcard(_table_btn);

var _pagenator = __webpack_require__(61);

var pagenator = _interopRequireWildcard(_pagenator);

var _sort_mark = __webpack_require__(62);

var sort_mark = _interopRequireWildcard(_sort_mark);

var _first_col = __webpack_require__(60);

var first_col = _interopRequireWildcard(_first_col);

var _main = __webpack_require__(58);

var filter_main = _interopRequireWildcard(_main);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(113);
__webpack_require__(112);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _auto_more = __webpack_require__(66);

var auto_more = _interopRequireWildcard(_auto_more);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(116);
__webpack_require__(117);

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(80);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(81);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab_group.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab_group.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(82);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./vue.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./vue.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hook_ajax_msg = hook_ajax_msg;
exports.hook_ajax_csrf = hook_ajax_csrf;
exports.show_upload = show_upload;
exports.hide_upload = hide_upload;
/**
 * Created by zhangrong on 2016/8/6.
 */

/*
 新增一个wrap函数，用户封装调用函数
 */

function def_proc_error(jqxhr) {
    if (!window.iclosed) {
        if (jqxhr.status != 0) {
            alert(jqxhr.statusText + ':code is;' + jqxhr.status + jqxhr.responseText);
        } else {
            alert('maybe server offline,error code is ' + jqxhr.status);
        }
        //hide_upload()
        cfg.hide_load();
    }
}

//window.__proc_port_error=def_proc_port_msg
window.__proc_ajax_error = def_proc_error;

function hook_ajax_msg(proc_port_error, proc_ajax_error) {
    if (proc_port_error) {
        window.__proc_port_error = proc_port_error;
    }
    if (proc_ajax_error) {
        window.__proc_ajax_error = proc_ajax_error;
    }
    if (window.hook_ajax_msg_mark) {
        return;
    }
    window.hook_ajax_msg_mark = true;
    $(window).bind('beforeunload', function () {
        window.iclosed = true;
    });

    //$(document).ajaxSuccess(function (event,data) {
    //    window.__proc_port_error(data,event)
    //})
    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        window.__proc_ajax_error(jqxhr);
    });
    //hook_ajax_csrf()
}

function hook_ajax_csrf() {
    // needed in django context,because django has csrf system enabled by default
    // used for fetch and generate CSRF code for POST ,used with django CSRF middleware
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
        );
    }
    $.ajaxSetup({
        beforeSend: function beforeSend(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}

function show_upload() {
    $('#load_wrap').show();
}
function hide_upload(second) {
    if (second) {
        setTimeout(function () {
            $('#load_wrap').hide();
        }, second);
    } else {
        $('#load_wrap').hide();
    }
}

//ex.load_css( '/static/lib/font-awesome4.7/font-awesome4.7.min.css')

if (!window.__uploading_mark) {
    window.__uploading_mark = true;
    document.write('\n\t\t<style>\n\t\t._popup{\n\t\t\tposition: fixed;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\tbottom: 0;\n\t\t\tdisplay:none;\n\t\t\tz-index: 9000;\n\t\t}\n\t\t#_upload_inn{\n\t\t\tbackground: rgba(88, 88, 88, 0.2);\n\t\t\tborder-radius: 5px;\n\t\t\twidth:180px;\n\t\t\theight:120px;\n\t\t\tz-index: 9500;\n\t\t\t/*padding:30px 80px ;*/\n\t\t}\n\t\t.imiddle{\n\t\t    position: absolute;\n\t        top: 50%;\n\t        left: 50%;\n\t        transform: translate(-50%, -50%);\n\t        -ms-transform:translate(-50%, -50%); \t/* IE 9 */\n\t\t\t-moz-transform:translate(-50%, -50%); \t/* Firefox */\n\t\t\t-webkit-transform:translate(-50%, -50%); /* Safari \u548C Chrome */\n\t\t\t-o-transform:translate(-50%, -50%);\n\n\t        text-align: center;\n\t\t\t/*display: table;*/\n\t        z-index: 10000;\n    \t}\n    \t#_upload_mark{\n    \t\tfloat: left;\n\n    \t}\n\t\t</style>');
    $(function () {
        $('body').append('<div class="_popup" id="load_wrap"><div id=\'_upload_inn\' class="imiddle">\n\t\t<div  id="_upload_mark" class="imiddle"><i class="fa fa-spinner fa-spin fa-3x"></i></div></div></div>');
    });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>->front/ckedit.rst>
==========
ckeditor
==========
源文件:vuejs/ckeditor.js

使用时，引入fields.pack.js即可。

使用示例
=========
::

	bus=new Vue()  //因为ckeditor的数据不是时时同步的，所以提交时，需要触发数据同步
	// 提交时:
	bus.$emit('sync_data')

	<ckeditor set='complex' config='{}'></ckeditor>

set
======

set是指预先定义好的一套设置。可以在Vue component中定义映射。

当前有的set有:

=========   ========
complex     完善
edit        普通编辑
=========   =========

<<<<
 */

var ck_complex = {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	toolbarGroups: [{ name: 'tools' }, { name: 'clipboard', groups: ['clipboard', 'undo'] }, { name: 'editing', groups: ['find', 'selection', 'spellchecker'] }, { name: 'links' }, { name: 'insert' }, { name: 'forms' }, { name: 'document', groups: ['mode', 'document', 'doctools'] }, { name: 'others' }, '/', { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] }, { name: 'styles' }, { name: 'font' }, { name: 'colors' }, { name: 'about' }],

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	removeButtons: 'Underline,Subscript,Superscript',

	// Set the most common block elements.
	format_tags: 'p;h1;h2;h3;pre',

	// Simplify the dialog windows.
	removeDialogTabs: 'image:advanced;link:advanced',
	image_previewText: 'image preview',
	imageUploadUrl: '/d/ckeditor_image', // '/_face/ckeditor_upload_image',
	filebrowserImageUploadUrl: '/d/ckeditor_image', // '/_face/ckeditor_upload_image', // Will be replace by imageUploadUrl when upload_image
	extraPlugins: 'justify,codesnippet,lineutils,mathjax,colorbutton,uploadimage,font,autogrow,html5video,widget,widgetselection,clipboard,lineutils', //autogrow,
	mathJaxLib: 'https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent: 'img[class]',
	autoGrow_maxHeight: 600,
	autoGrow_minHeight: 200,
	autoGrow_onStartup: true,
	autoGrow_bottomSpace: 50
	//height:800,
};

var ckeditor = {
	template: '<div class=\'ckeditor\'>\n\t\t    \t<textarea class="form-control" :maxlength="maxlength"></textarea>\n\t    \t</div>',
	props: {
		value: {},
		config: {},
		set: {
			default: 'edit'
		},
		maxlength: {}
	},
	created: function created() {
		var self = this;
		//if(!window.bus){
		//	window.bus=new Vue()
		//}
		eventBus.$on('sync_data', function () {
			self.$emit('input', self.editor.getData());
		});
	},
	watch: {
		value: function value(v) {
			var self = this;
			if (!self.ckeditor_loaded) {
				self.ckeditor_setvalue_queue = function () {
					self.editor.setData(v);
					self.editor.resetDirty();
				};
			} else {
				self.editor.setData(v);
				self.editor.resetDirty();
			}
		}
	},
	mounted: function mounted() {
		var self = this;
		self.input = $(this.$el).find('textarea')[0];
		var config_obj = {
			//'complex':'//res.enjoyst.com/js/ck/config_complex.js',
			'complex': ck_complex,
			'edit': edit_level
		};
		var config = {};
		ex.assign(config, config_obj[self.set]);
		ex.assign(config, self.config);
		// 4.5.10   4.6.2   ///static/lib/ckeditor4.6.2.js
		//
		//ex.load_js('https://cdn.bootcss.com/ckeditor/4.6.2/ckeditor.js',function(){
		//CKEDITOR.timestamp='GABCDFDGff'
		//self.input.value=self.value

		var editor = CKEDITOR.replace(self.input, config);
		if (self.value) {
			editor.setData(self.value);
			editor.resetDirty();
		}
		self.editor = editor;

		editor.on('instanceReady', function (evt) {
			self.ckeditor_loaded = true;
			if (self.ckeditor_setvalue_queue) {
				self.ckeditor_setvalue_queue();
			}
		});

		//var is_changed=false
		//editor.on( 'change', function( evt ) {
		//	// getData() returns CKEditor's HTML content.
		//	is_changed=true
		//	//self.$emit('input',editor.getData())
		//});
		//
		//setInterval(function(){
		//	if(is_changed){
		//		self.$emit('input',editor.getData())
		//		is_changed=false
		//	}
		//},3000)
		//})
	}
	//events:{
	//	'sync_data':function () {
	//		this.model=this.editor.getData()
	//	}
	//}

	//<script src="//cdn.ckeditor.com/4.10.1/full/ckeditor.js"></script>
};Vue.component('ckeditor', function (resolve, reject) {
	//ex.load_js('https://cdn.bootcss.com/ckeditor/4.6.2/ckeditor.js',function(){
	//ex.load_js('http://cdn.ckeditor.com/4.10.1/full/ckeditor.js',function(){
	//ex.load_js('/static/ckeditor_4.10.1/ckeditor/ckeditor.js',function(){
	ex.load_js(cfg.js_lib.ckeditor, function () {
		resolve(ckeditor);

		//CKEDITOR.plugins.setLang( 'html5video', 'zh-cn', {
		//	button: '插入HTML5视频',
		//	title: 'HTML5 视频',
		//	infoLabel: '视频信息',
		//	allowed: '允许上传格式: MP4, WebM, Ogv',
		//	urlMissing: '视频源地址丢失',
		//	videoProperties: '视频属性',
		//	upload: '上传',
		//	btnUpload: '上传到服务器',
		//	advanced: '高级',
		//	autoplay: '自动播放?',
		//	yes: '是',
		//	no: '否',
		//	responsive: '响应式宽度'
		//} );
	});
});

var edit_level = {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	toolbarGroups: [
	//{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
	//{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
	{ name: 'tools' },

	//'/',
	{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] }, { name: 'styles' }, { name: 'font' }, { name: 'colors' }, { name: 'links' }, { name: 'insert' }, { name: 'forms' }, { name: 'others' }, { name: 'document', groups: ['mode', 'document', 'doctools'] }],

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	removeButtons: 'Underline,Subscript,Superscript',

	// Set the most common block elements.
	format_tags: 'p;h1;h2;h3;pre',

	// Simplify the dialog windows.
	//plugins : 'wysiwygarea,toolbar,basicstyles,...',
	removeDialogTabs: 'image:advanced;link:advanced',
	image_previewText: 'image preview',
	imageUploadUrl: '/d/ckeditor_image', // '/_face/ckeditor_upload_image',
	filebrowserImageUploadUrl: '/d/ckeditor_image', // '/_face/ckeditor_upload_image', // Will be replace by imageUploadUrl when upload_image
	//extraPlugins : 'justify,lineutils,colorbutton,uploadimage,font,autogrow', //,mathjax,codesnippet
	removePlugins: 'html5video,forms,flash,a11yhelp,scayt,wsc,language,preview,print,save,saveall,template,newpage,templates',
	mathJaxLib: '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent: 'img[class]',
	autoGrow_maxHeight: 600,
	autoGrow_minHeight: 200,
	autoGrow_onStartup: true,
	autoGrow_bottomSpace: 50
	//height:800,
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-form-btn', {
    data: function data() {
        return {
            can_add: can_add,
            can_del: can_del
        };
    },
    props: ['form_bus'],
    computed: {
        del_link: function del_link() {
            return this.form_bus.del_row();
        }
    },
    //template:`<div style='overflow: hidden;'>
    //	<div class="btn-group" style='float: right;'>
    //		<button type="button" class="btn btn-default" @click='submit()' v-if='can_add'>保存</button>
    //		<a type="button" class="btn btn-default" v-if='can_del &&del_link' :href='del_link'>删除</a>
    //		<button type="button" class="btn btn-default" @click='cancel()' >取消</button>
    //	</div>
    //</div>`
    template: '<div style="min-height: 1.5em;">\n    <div style="float: right;">\n        <div class="btn-group">\n            <button type="button" class="btn btn-success btn-sm" @click=\'form_bus.submit_return()\' v-if=\'can_add\'>\u4FDD\u5B58\u5E76\u8FD4\u56DE</button>\n            <button type="button" class="btn btn-default btn-sm" @click=\'form_bus.submit()\' v-if=\'can_add\'>\u4FDD\u5B58</button>\n            <button type="button" class="btn btn-default btn-sm" @click=\'form_bus.goto_next()\' >\u53D6\u6D88</button>\n        </div>\n        <!--<div class="btn-group" >-->\n          <!--<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->\n                <!--\u5176\u4ED6 <span class="caret"></span>-->\n              <!--</button>-->\n              <!--<ul class="dropdown-menu">-->\n                <!--&lt;!&ndash;<li><a href="#" @click=\'form_bus.submit()\' v-if=\'can_add\'>\u4FDD\u5B58</a></li>&ndash;&gt;-->\n                <!--<li><a v-if=\'can_del &&del_link\' :href=\'form_bus.del_row()\'>\u5220\u9664</a></li>-->\n\n                <!--&lt;!&ndash;<li role="separator" class="divider"></li>&ndash;&gt;-->\n              <!--</ul>-->\n        <!--</div>-->\n    </div>\n\n</div>'
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
* field_fun 应该会被 mix_table_data 取代,以后不会使用了。
* */

var field_fun = exports.field_fun = {
    data: function data() {
        return {
            kw: {
                heads: heads,
                row: row,
                errors: {}
            },
            menu: menu,
            search_args: search_args,

            can_add: can_add,
            can_del: can_del,
            can_log: can_log,
            can_edit: can_edit,

            page_label: page_label,
            help_url: help_url

        };
    },
    methods: {
        goto: function goto(url) {
            location = url;
        },
        after_sub: function after_sub(new_row) {
            if (search_args.next) {
                location = decodeURIComponent(search_args.next);
            } else {
                location = document.referrer;
            }
        },
        before_sub: function before_sub() {},
        // 退出改页面
        goto_next: function goto_next() {
            if (search_args.next) {
                location = decodeURIComponent(search_args.next);
            } else {
                location = document.referrer;
            }
        },
        submit: function submit() {
            this.before_sub();
            var self = this;
            if (window.bus) {
                window.bus.$emit('sync_data');
            }
            show_upload();
            var search = ex.parseSearch();
            var post_data = [{ fun: 'save', row: this.kw.row }];
            var url = ex.appendSearch('/d/ajax', search_args);
            ex.post(url, JSON.stringify(post_data), function (resp) {
                hide_upload(500);
                if (resp.save.errors) {
                    self.kw.errors = resp.save.errors;
                } else {
                    self.after_sub(resp.save.row);
                }
            });
        },
        submit_return: function submit_return() {
            this.before_sub();
            var self = this;
            if (window.bus) {
                window.bus.$emit('sync_data');
            }
            show_upload();
            var search = ex.parseSearch();
            var post_data = [{ fun: 'save', row: this.kw.row }];
            var url = ex.appendSearch('/d/ajax', search_args);
            ex.post(url, JSON.stringify(post_data), function (resp) {
                hide_upload(500);
                if (resp.save.errors) {
                    self.kw.errors = resp.save.errors;
                } else {
                    self.goto_next(resp.save.row);
                }
            });
        },
        cancel: function cancel() {
            var search = ex.parseSearch(); //parseSearch(location.search)
            if (search._pop) {
                window.close();
            } else {
                history.back();
            }
        },
        get_del_link: function get_del_link() {
            var search_args = ex.parseSearch();
            if (this.kw.row.pk) {
                return ex.template('{engine_url}/del_rows?rows={class}:{pk}&next={next}&_pop={pop}', { class: this.kw.row._class,
                    engine_url: engine_url,
                    pk: this.kw.row.pk,
                    next: search_args.next,
                    pop: search_args._pop

                });
            } else {
                return null;
            }
        },
        del_row: function del_row() {
            return this.get_del_link();
        },
        log_url: function log_url() {
            var obj = {
                pk: this.kw.row.pk,
                _class: this.kw.row._class,
                engine_url: engine_url,
                page_name: page_name
            };
            return ex.template('{engine_url}/log?rows={_class}:{pk}', obj);
        }
    }
};

window.field_fun = field_fun;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.field_base = undefined;

var _basic = __webpack_require__(2);

var field_base = exports.field_base = {
    props: {
        head: {
            required: true
        },
        row: {
            required: true
        }
        //kw:{
        //    required:true
        //},
    },
    computed: {
        //row:function(){return this.kw.row},
        //errors:function() {
        //    if(!this.kw.errors){
        //        Vue.set(this.kw,'errors',{})
        //    }
        //    return this.kw.errors
        //},
        //head:function(){
        //    var heads = this.kw.heads
        //    for (var x=0;x<heads.length;x++) {
        //        var head = heads[x]
        //        if (head.name == this.name) {
        //            return head
        //        }
        //    }
        //
        //}
    },
    methods: {
        //error_data: function (name) {
        //    if (this.errors[name]) {
        //        return this.errors[name]
        //    } else {
        //        return ''
        //    }
        //}
    },
    components: _basic.baseInput

};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>>>front/file.rst>
===========
文件上传
===========

主要内容
========
fl
    包含可以操作file对象的函数，例如上传upload,批量上传uploads.

file-input
    该组件用户收集用户输入。只能返回file list 。所以，如果使用upload上传文件，必须取 [0] 第一个file对象。

img-uploador
    图片选择，自动上传。

多个文件上传步骤
==============

1. Vue.data设置::

    data:{
    files:[],
    },

2. 在html中插入Vue组件::

    <file-input id='jjyy' v-model='files' multiple></file-input>

3. 在Methods中上传::

    fl.uploads(files,url,function(resp){  // url 可以忽略，默认url为 /face/upload
        resp ....
    })

单个文件
=======
1.Vue.data设置::

    data:{
        files:[],
    },

2. 在html中插入Vue组件::

    <file-input id='jjyy' v-model='files'></file-input>

3. 在Methods中上传::

     fl.uploads(this.files[0],url,function(resp){
        resp ....
     })

.. Note:: 默认上传url是/face/upload ，该接口返回的是 file_url_list。

上传进度
=========
进度只是上传进度，判断文件是否被后端接收成功，需要判断是否success回调被调用::

     fl.upload(this.file2[0],'/face/upload',function(url_list){

     },function(progress){
        console.log(progress)
     })

预览图片
=========
从file-input读出数据，然后赋予图片的src ::

    f1.read(this.files[0],function (data) {
            $('#haha')[0].src = data
    }


上传图片
==========
::

    <img-uploador v-model='xxx_url_variable'></img-uploador>   //默认上传，使用的是 fl.upload默认地址 /face/upload
    <img-uploador v-model='xxx_url_variable' up_url='xxx'></img-uploador>

具备裁剪性质::

    <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>


样式技巧
========
1. 自定义样式

    <file-inpu>不支持直接自定义样式。但是可以通过其他方式自定义。最简单的方式是：

    * 隐藏<file-input> ，
    * 然后触发其click事件('.file-input').click()
<<<<
*/

__webpack_require__(100);

var fl = {
    read: function read(file, callback) {
        // 读完文件后，调用callback
        var reader = new FileReader();
        reader.onloadend = function () {
            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            var dataURL = reader.result;
            //var img = new Image();
            //img.src = dataURL;
            // 插入到 DOM 中预览
            //$('#haha')[0].src=dataURL
            callback(dataURL);
        };
        reader.readAsDataURL(file); // 读出 base64
    },
    upload: function upload(file, url, success, progress) {
        if (ex.is_fun(url)) {
            var progress = success;
            var success = url;
            var url = '/d/upload';
        } else {
            var url = url || '/d/upload';
        }

        var fd = new FormData();
        fd.append('file', file);
        $.ajax({
            url: url,
            type: 'post',
            data: fd,
            contentType: false,
            success: success,
            //success:function (data) {
            //    success(data)
            //},
            processData: false,
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (progress && evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        progress(percentComplete);
                        //console.log('进度', percentComplete);
                    }
                }, false);

                return xhr;
            }
        });
    },
    uploads: function uploads(files, url, success, progress) {
        if (ex.is_fun(url)) {
            var progress = success;
            var success = url;
            var url = '/d/upload';
        } else {
            var url = url || '/d/upload';
        }

        var fd = new FormData();
        for (var x = 0; x < files.length; x++) {
            var file = files[x];
            fd.append(file.name, file);
        }
        $.ajax({
            url: url,
            type: 'post',
            data: fd,
            contentType: false,
            success: success,
            processData: false,
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (progress && evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        progress(percentComplete);
                        //console.log('进度', percentComplete);
                    }
                }, false);

                return xhr;
            }
        });
    }
};

var file_input = {
    template: "<input class='file-input' type='file' @change='on_change($event)'>",
    props: ['value', 'name'],
    data: function data() {
        return {
            files: []
        };
    },
    watch: {
        value: function value(v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                $(this.$el).val('');
                //this.$el.value = v
            }
        }

    },
    methods: {
        on_change: function on_change(event) {
            this.files = event.target.files;
            this.$emit('input', this.files);
        },
        clear: function clear() {
            $(this.$el).val('');
        }
    }
};

Vue.component('file-input', file_input);

/*
<img-uploader v-model='xxx'></img-uploader>
 <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>

 accept='image/gif,image/jpeg,image/png'
*/

var img_uploader = {
    props: ['value', 'up_url', 'config'],
    data: function data() {
        return {
            img_files: '',
            url: this.value,
            disable: false
        };
    },
    computed: {
        cfg: function cfg() {
            var dc = {
                crop: false,
                crop_config: {}
            };
            if (this.config) {
                ex.assign(dc, this.config);
            }
            return dc;
        },
        //real_url:function(){
        //    if(this.config.url_prefix){
        //        var mt = /\w+:\/\//.exec(this.url)
        //        // 表示地址没有域名
        //        if(!mt){
        //            return this.config.url_prefix + this.url
        //        }else {
        //            return this.url
        //        }
        //    }else{
        //        return this.url
        //    }
        //
        //},
        //is_crop:function(){
        //    return this.config && this.config.crop
        //},
        crop_config: function crop_config() {
            // 用cfg来代表内部设置，本来不应该有这个属性了，但是没弄清楚，以后来整个这个属性。
            if (this.config && this.config.crop) {
                var temp_config = ex.copy(this.config);
                delete temp_config.crop;
                return temp_config;
            } else {
                return {};
            }
        }
    },

    template: '\n          <div :class=\'["up_wrap logo-input img-uploader",{"disable":disable}]\'>\n            <file-input v-if="!cfg.crop"\n                ref="file_input"\n                accept=\'image/*\'\n                v-model= \'img_files\'>\n            </file-input>\n            <img-crop class=\'input\' v-if=\'cfg.crop\' v-model=\'img_files\' :config="crop_config">\n            </img-crop>\n            <div style="padding: 40px" @click="select()">\n                <a class=\'choose\'>Choose</a>\n            </div>\n            <div v-if=\'url\' class="closeDiv">\n            <div class="close" @click=\'clear()\'><i class="fa fa-times-circle" aria-hidden="true" style="color:red;position:relative;left:30px;"></i></div>\n            <img :src="url" alt="" class="logoImg">\n            </div>\n            </div>\n        ',
    watch: {
        value: function value(v) {
            this.url = v;
        },
        img_files: function img_files(v) {
            var self = this;
            console.log('start upload');
            if (v == "") {
                return;
            }
            if (!self.validate(v[0])) {
                return;
            }
            fl.upload(v[0], this.up_url, function (url_list) {
                self.url = url_list[0];
                self.$emit('input', self.url);
                self.$emit('select');
            });
        }
    },
    methods: {
        clear: function clear() {
            console.log('clear image data');
            this.img_files = '';
            //this.url=''
            this.$emit('input', '');
            this.$refs.file_input.clear();
        },
        validate: function validate(img_fl) {
            //重载该函数，验证文件

            if (this.cfg.maxsize) {
                if (img_fl.size > this.cfg.maxsize) {
                    var msg = ex.template(cfg.tr.picture_size_excceed, { maxsize: this.cfg.maxsize });
                    cfg.showMsg(msg);
                    this.clear();
                    return false;
                }
            }
            //console.log(img_fl.size)
            return true;
        },
        select: function select() {
            console.log('before select');
            var self = this;
            if (!this.disable) {
                $(this.$el).find('input[type=file]').click();
                this.disable = true;
                setTimeout(function () {
                    self.disable = false;
                }, 3000);
            }

            console.log('after select');
        }
    }
};

Vue.component('img-uploador', img_uploader);

/*
具备裁剪功能
==============
 img_crop是一种input

    <img-crop v-model='xxx' :config='{aspectRatio: 8 / 10}'></img-crop>
*
*  上传:
*  ======
*  fl.upload(xxx[0],function(urls){
*         ...
*  ))
* */

var img_crop = {
    template: '<div class="img-crop">\n    <input type=\'file\' @change=\'on_change($event)\'\n            accept=\'image/*\'>\n    <modal v-show=\'cropping\' >\n        <div class="total-wrap flex-v" style="width:80vw;height: 80vh;background-color: white;">\n            <div class="crop-wrap flex-grow">\n                <img class="crop-img" :src="org_img" >\n            </div>\n            <div style="padding: 5px;">\n            <div class="btn-group" role="group">\n                <button class="btn btn-primary" @click="rotato_90()"><i class="fa fa-repeat" aria-hidden="true"></i></button>\n                <button class="btn btn-primary" @click="zoom_in()"><i class="fa fa-search-plus" aria-hidden="true"></i></button>\n                <button class="btn btn-primary" @click="zoom_out()"><i class="fa fa-search-minus" aria-hidden="true"></i></button>\n            </div>\n            <div class="btn-group" role="group">\n                <button class="btn btn-primary" @click="make_sure()"><i class="fa fa-check" aria-hidden="true"></i></button>\n                <button class="btn btn-primary" @click="cancel()"><i class="fa fa-times" aria-hidden="true"></i></button>\n            </div>\n            </div>\n        </div>\n    </modal>\n    </div>',
    props: ['value', 'config'],
    data: function data() {
        var inn_config = {
            size: {}
        };
        ex.assign(inn_config, this.config);

        return {
            files: [],
            org_img: '',
            cropping: false,
            inn_config: inn_config
        };
    },
    mounted: function mounted() {
        ex.load_css('/static/lib/cropper2.3.4.min.css');
        ex.load_js('/static/lib/cropper2.3.4.min.js');
    },
    watch: {
        value: function value(v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v;
            }
        }

    },

    methods: {
        cancel: function cancel() {
            $(this.$el).find('input[type=file]').val('');
            this.cropping = false;
        },
        zoom_in: function zoom_in() {
            $(this.$el).find('.crop-img').cropper('zoom', 0.1);
        },
        zoom_out: function zoom_out() {
            $(this.$el).find('.crop-img').cropper('zoom', -0.1);
        },
        rotato_90: function rotato_90() {
            $(this.$el).find('.crop-img').cropper('rotate', 90);
        },
        move_img: function move_img() {
            $(this.$el).find('.crop-img').cropper('setDragMode', 'move');
        },
        move_crop: function move_crop() {
            $(this.$el).find('.crop-img').cropper('setDragMode', 'crop');
        },
        on_change: function on_change(event) {

            if ($(this.$el).find('input[type=file]').val() == '') {
                return;
            }
            var self = this;
            this.cropping = true;
            var img_file = event.target.files[0];

            //fl.read(img_file)
            //this.$emit('input', this.files)
            fl.read(img_file, function (data) {
                self.org_img = data;
                Vue.nextTick(function () {
                    self.init_crop();
                });
            });
        },
        init_crop: function init_crop() {
            //$(this.$el).find('.crop-img').cropper({
            //    aspectRatio: 8 / 10,
            //});
            if (this.inn_config.aspectRatio) {
                $(this.$el).find('.crop-img').cropper({ aspectRatio: this.inn_config.aspectRatio });
            }

            $(this.$el).find('.crop-img').cropper('replace', this.org_img);
            $(this.$el).find('.crop-img').cropper('setDragMode', 'move');
        },
        make_sure: function make_sure() {
            var self = this;
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`

            //$(this.$el).find('.crop-img').cropper('getCroppedCanvas',this.inn_config.size).toBlob(function (blob) {
            //    //var formData = new FormData();
            //    self.$emit('input',[blob])
            //    self.cropping=false
            //
            //});
            var data_url = $(this.$el).find('.crop-img').cropper('getCroppedCanvas', this.inn_config.size).toDataURL('image/jpeg');
            var blob = dataURLtoBlob(data_url);
            self.$emit('input', [blob]);
            self.cropping = false;
        }
    }

};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

Vue.component('img-crop', img_crop);

/*
* 下面是为了老代码的兼容性，以后不会用了。
*
*/

Vue.component('file-obj', {
    template: "<input model='filebody' type='file' @change='changed'>",
    props: {
        up_url: {
            type: String,
            required: true
        },
        //url:{
        //    type: String,
        //    twoWay:true
        //},
        ready: {}
    },
    methods: {
        changed: function changed(changeEvent) {
            var file = changeEvent.target.files[0];
            if (!file) return;
            this.fd = new FormData();
            this.fd.append('file', file);
            this.ready = true;
            this.upload();
        },
        upload: function upload() {
            var self = this;
            $.ajax({
                url: this.up_url,
                type: 'post',
                data: this.fd,
                contentType: false,
                cache: false,
                success: function success(data) {
                    if (data.url) {
                        self.$dispatch('rt_url', data.url);
                    }

                    //alert(data);
                    //self.url=data.url;
                    //self.$emit('url.changed',data.url)
                },
                //error:function (data) {
                //	alert(data.responseText)
                //},
                processData: false
            });
        }
    }
});

Vue.component('logo-input', {
    props: ['up_url', 'web_url', 'id'],
    template: '\n          <div class=\'up_wrap logo-input\'>\n            <file-obj :id=\'id\'\n                accept=\'image/gif,image/jpeg,image/png\'\n                :up_url=\'up_url\'\n                @rt_url= \'get_web_url\'>\n            </file-obj>\n            <div style="padding: 40px">\n                <a class=\'choose\'>Choose</a>\n            </div>\n            <div v-if=\'web_url\' class="closeDiv">\n            <div class="close" @click=\'clear()\'>X</div>\n            <img :src="web_url" alt="" class="logoImg">\n            </div>\n            </div>\n        ',
    methods: {
        get_web_url: function get_web_url(e) {
            this.web_url = e;
        },
        clear: function clear() {
            this.web_url = '';
            $('#' + this.id).val('');
        }
    }
});

window.fl = fl;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by heyulin on 2017/1/24.
 *
>->front/input.rst>
=======
inputs
=======


color
======

forign-edit
============
示例::

    <forign-edit :kw="person.emp_info" name="user" page_name="user" ></forign-edit>

<-<
 */

var color = {
    props: ['value'],
    template: '<input type="text">',
    methods: {
        init_and_listen: function init_and_listen() {
            var self = this;
            Vue.nextTick(function () {
                $(self.$el).spectrum({
                    color: self.value,
                    showInitial: true,
                    showInput: true,
                    preferredFormat: "name",
                    change: function change(color) {
                        self.src_color = color.toHexString();
                        self.$emit('input', self.src_color);
                    }
                });
            });
        }
    },
    watch: {
        value: function value(_value) {
            if (this.src_color != _value) {
                this.init_and_listen();
            }
        }
    },
    mounted: function mounted() {
        var self = this;
        ex.load_css('/static/lib/spectrum1.8.0.min.css');
        ex.load_js('/static/lib/spectrum1.8.0.min.js', function () {
            self.init_and_listen();
        });
    }
};

Vue.component('color', color);

ex.append_css('<style type="text/css" media="screen">\n    /*.datetime-picker{*/\n        /*position: relative;*/\n        /*display: inline-block;*/\n    /*}*/\n    .datetime-picker input[readonly]{\n        background-color: white;\n    }\n\t/*.datetime-picker .cross{*/\n\t    /*display: none;*/\n\t/*}*/\n\t/*.datetime-picker:hover .cross{*/\n\t    /*display: inline-block;*/\n\t    /*position: absolute;*/\n\t    /*right: 8px;*/\n\t    /*top:3px;*/\n\t    /*cursor: pointer;*/\n\n\t/*}*/\n</style>\n ');

var forignEdit = {
    template: '<div class="forign-key-panel">\n        <button v-if="has_pk()" @click="jump_edit(kw.row[name])" title="edit">\n            <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>\n        <button @click="jump_edit()" title="create new"><i class="fa fa-plus" aria-hidden="true"></i></button>\n    </div>',
    props: ['kw', 'name', 'page_name'],
    methods: {
        jump_edit: function jump_edit(pk) {
            var name = this.name;
            var kw = this.kw;
            var page_name = this.page_name || this.name;
            var options = ex.findone(kw.heads, { name: name }).options;
            var row = kw.row;
            var pk = pk || '';

            var url = ex.template('{engine_url}/{page_name}.edit?pk={pk}', {
                engine_url: engine_url,
                page_name: page_name,
                pk: pk
            });
            ln.openWin(url, function (resp) {
                if (resp.del_rows) {
                    ex.remove(options, function (option) {
                        return ex.isin(option, resp.del_rows, function (op, del_row) {
                            return op.value == del_row.pk;
                        });
                    });
                } else if (resp.row) {
                    if (pk) {
                        var option = ex.findone(options, { value: pk });
                        option.label = resp.row._label;
                    } else {
                        options.push({ label: resp.row._label, value: resp.row.pk });
                        row[name] = resp.row.pk;
                    }
                }
            });
        },
        has_pk: function has_pk() {
            if (this.kw.row[this.name]) {
                return true;
            } else {
                return false;
            }
        }
    }
};

ex.append_css('\n<style type="text/css">\n    .forign-key-panel{\n        padding: 6px;\n    }\n</style>');

Vue.component('forign-edit', forignEdit);

var check_box = {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: ['value', 'checked'],
    methods: {
        on_click: function on_click() {
            $(this.$el).find('input').click();
            this.$emit('change', this.checked);
        }
    },
    data: function data() {
        var checked = this.checked || [];
        return {
            inn_checked: checked
        };
    },
    watch: {
        inn_checked: function inn_checked(v) {
            this.$emit('change', v);
        },
        checked: function checked(v) {
            this.inn_checked = v;
        }
    },
    computed: {
        is_checked: function is_checked() {
            if (this.value) {
                return this.inn_checked.indexOf(this.value) != -1;
            } else {
                return this.inn_checked;
            }
        }
    },
    template: ' <span class="com-checkbox" @click="on_click()">\n                <input type="checkbox" :value="value" v-model=\'inn_checked\' style="display: none"/>\n                  <i class="fa fa-check-circle" aria-hidden="true" v-if=\'is_checked\' style="color: #009926"></i>\n                  <i class="fa fa-circle-thin" aria-hidden="true" v-else></i>\n              </span>'
};
Vue.component('com-check-box', check_box);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>->front/link.rst>
=========
link
=========

利用SessionStorage跳转页面
===========================
基本思想：将对象保存在sessionStorage中，切换到其他页面，当完成选择等任务后，再利用history.back()切换回原来的页面。这时将保存的信息恢复回来。
::

    // origin.html页面
    // 以window为访问root，将对象的path保存下来。
    var save_list=['row']
    url=ex.template('{engine_url}/home.wx',{engine_url:engine_url,})
    ln.getFromTab(url,save_list)

    //在页面的初始阶段调用:
    ln.readCache()  // 读取对应自身url的cache，如果有cache则恢复对应window属性。
                   // 在页面加载后2秒，自动删除 cache 和_rt　值

    // select.html页面
    // 判断是否是 _pop=1，返回row对象。
    ln.rt(row)  // 该函数是将结果存在sessionStorage中，以key=_rt存储。


以前的SessionStorage
=========================
示例::

     var director = '{% url 'director' %}'

     var cache_meta={
     cache:['person.emp_info.row',
            'person.bas_info.row',
            'crt_view'],
     rt_key:{'auth.user':'person.emp_info.row.user'}
     }

    //auth.user 是返回的值在storage中的key，person.emp_info.row.user是还原的对象路径

     ln.cache(cache_meta)

     // 下面是构造跳转的url,其中最重要的是需要appendSearch({cache:1})),表明返回时，需要读取cache
     var back_url=btoa(ex.appendSearch({cache:1}))
     if(pk){
     location=ex.template('{director}model/{name}/edit/{pk}?next={encode_url}',{director:director,name:name,pk:pk,encode_url:back_url})
     }else{
     location=ex.template('{director}model/{name}/edit?next={encode_url}',{director:director,name:name,encode_url:back_url})
     }

readCache
	@root_obj

cache
	@cache_meta
	@root_obj : 如果没写，默认是window


history
========
利用h5的history功能，是的地址栏发生变化，并且不会触发服务器请求。该功能可以用在ajax请求，将ajax请求记录在history中，可以达到前进后退的功能。

pushUrl
    url入栈

popUrlListen:
    监听pop history事件，点击前进后退按钮时，刷新整个页面。如果需要精细的控制，在不刷新页面的情况下，切换状态，需要自定义事件handler

<-<
 */

__webpack_require__(101);

var ln = {
    history_handle: function history_handle(obj) {
        this._his_handler = obj.handler;
        window.addEventListener('popstate', function (e) {
            if (e.state) {
                obj.handler(e.state);
            } else {
                history.back();
            }
        }, false);

        if (obj.init) {
            // && !history.state){
            if (!history.state) {
                history.pushState(obj.init, '');
            }
            //else{
            //    history.replaceState(obj.init,'')
            //}
        }
    },
    pushState: function pushState(state, url) {
        url = url || '';
        history.pushState(state, '', url);
        this._his_handler(state);
    },

    getFromTab: function getFromTab(url, cache_name_list, rt_obj_path) {

        cache_name_list = cache_name_list || [];
        var cache_obj = {
            _scroll: { x: scrollX, y: scrollY },
            name_list: cache_name_list,
            obj_list: [],
            rt_obj_path: rt_obj_path
        };
        ex.each(cache_name_list, function (name) {
            cache_obj.obj_list.push(ex.access(window, name));
        });

        sessionStorage.setItem('_stack_' + location.href, JSON.stringify(cache_obj));
        location = ex.appendSearch(url, { _pop: 1 });
    },
    ret: function ret(value) {
        if (window.opener) {
            this._ret_win(value);
        } else {
            this._ret_frame(value);
        }
    },
    _ret_frame: function _ret_frame(value) {
        // 在iframe中运行
        //var search_args=ex.parseSearch()
        if (search_args._pop) {
            if (window.parent.__fram_back) {
                window.parent.__fram_back(value);
            }

            //if(search_args._frame){
            //    if(parent.__fram_back){
            //        parent.__fram_back(value)
            //    }
            //}else if(window.opener){
            //    this.rtWin(value)
            //}else{
            //    sessionStorage.setItem('_rt',JSON.stringify(value))
            //    history.back()
            //}
            //return  true
        }

        //else{
        //    return false
        //}
    },

    readCache: function readCache() {
        var cache_obj_str = sessionStorage.getItem('_stack_' + location.href);

        if (cache_obj_str) {
            var cache_obj = JSON.parse(cache_obj_str);

            var name_list = cache_obj.name_list;
            var obj_list = cache_obj.obj_list;
            for (var i = 0; i < name_list.length; i++) {
                ex.set(window, name_list[i], obj_list[i]);
            }

            // 将返回值赋予对应的window对象
            var rt_value = sessionStorage.getItem('_rt');

            if (rt_value) {
                if (cache_obj.rt_obj_path) {
                    ex.set(window, cache_obj.rt_obj_path, JSON.parse(rt_value));
                }
            }

            //var cache_meta=cache_obj.cache_meta
            //if(cache_meta && cache_meta.rt_key){
            //    for(var key in cache_meta.rt_key){
            //        var value = sessionStorage.getItem(key)
            //        if(value){
            //            var targ_key=cache_meta.rt_key[key]
            //            sessionStorage.removeItem(key)
            //            ex.set(root_obj,targ_key,value)
            //        }
            //
            //    }
            //}

            // 尝试滚动到原来的位置
            if (cache_obj._scroll) {
                $(function () {
                    setTimeout(function () {
                        window.scrollTo(cache_obj._scroll.x, cache_obj._scroll.y);
                    }, 10);
                });
            }
            //onload=function(){
            //    setTimeout(function(){
            //        console.log(cache_obj._scroll.y)
            //        window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
            //    },10)
            //}
            //$(function(){
            //setTimeout(function(){
            //    console.log(cache_obj._scroll.y)
            //    window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
            //},3000)

            //})

            $(function () {
                setTimeout(function () {
                    sessionStorage.removeItem('_stack_' + location.href);
                    sessionStorage.removeItem('_rt');
                }, 2000);
            });
        }
        //}
    },

    cache: function cache(cache_meta, root_obj) {

        var root_obj = root_obj || window;
        var cache_obj = {
            cache_meta: cache_meta,
            window: {},
            _scroll: { x: scrollX, y: scrollY }
        };

        if (cache_meta.cache) {
            ex.each(cache_meta.cache, function (key) {
                cache_obj.window[key] = ex.access(root_obj, key);
            });
        }
        sessionStorage.setItem(location.href, JSON.stringify(cache_obj));
    },

    openWin: function openWin(url, callback) {
        /*
          * */
        var norm_url = ex.appendSearch(url, { _pop: 1 });
        window.open(norm_url, url, 'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300');
        window.__on_subwin_close = callback;
    },
    _ret_win: function _ret_win(resp) {
        if (window.opener && window.opener.__on_subwin_close) {
            window.opener.__on_subwin_close(resp);
        }
        window.opener.__on_subwin_close = null;
        window.close();
    },
    pushUrl: function pushUrl(url) {
        window.history.pushState(url, 0, url);
    },
    popUrlListen: function popUrlListen() {
        window.addEventListener('popstate', function (e) {
            /// <summary>
            ///　　　&#10;　在页面初始化加载完成中添加该事件，则可以监听到onpopstate事件，而浏览器进行前进、后退、刷新操作都会触发本事件
            ///　　　&#10;　linkFly原创，引用请注明出处，谢谢
            /// </summary>/// <returns type="void" />
            if (e.state) {
                location = e.state;
                //e.state就是pushState中保存的Data，我们只需要将相应的数据读取下来即可
            }
        });
    },
    openFrame: function openFrame(url, title, callback, css) {
        var self = this;
        if (!window.__load_frame) {
            $('body').append('<div id="_load_frame_wrap">\n            <div class="imiddle popframe flex-v">\n                <span class="title"><b>' + title + '</b></span>\n                <span class="close-btn" onclick="ln.closeFrame()"><i class="fa fa-times fa-2x" aria-hidden="true"></i></span>\n                <iframe id="_load_frame" frameborder="0" class="flex-grow"></iframe>\n            </div>\n            </div>');
            window.__load_frame = true;
        }
        var url = ex.appendSearch(url, { _pop: 1, _frame: 1 });
        $('#_load_frame').attr('src', url);
        if (!callback) {
            window.__fram_back = null;
        } else {
            window.__fram_back = function (v) {
                callback(v);
                self.closeFrame();
            };
        }

        if (css) {
            $('.popframe').css(css);
        }
        $('#_load_frame_wrap').show();
    },
    closeFrame: function closeFrame() {
        $('#_load_frame').attr('src', '');
        $('#_load_frame_wrap').hide();
    }

};

window.ln = ln;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!window.__multi_sel) {
	document.write('\n\t\n<style type="text/css" media="screen" id="test">\n\n._tow-col-sel{\n\tdisplay: flex;\n\talign-items: stretch;\n\n}\n\n._tow-col-sel .sel{\n\tmin-width:250px;\n\tmax-width: 400px;\n\n\tdisplay: flex;\n\tflex-direction: column;\n\t/*display: inline-block;*/\n\t/*vertical-align: middle;*/\n}\n._tow-col-sel .sel select{\n\twidth: 100%;\n\n\tflex: 1;\n}\n._tow-col-sel .sel.right{\n\tborder-width:2px;\n}\n._tow-col-sel .arrow{\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content:center;\n\tpadding: 5px;\n}\n._tow-col-sel ._small_icon{\n\twidth:15px;\n}\n._tow-col-sel ._small_icon.deactive{\n\topacity: 0.5;\n\t-moz-opacity: 0.5;\n\tfilter:alpha(opacity=50);\n}\n</style>\n\n\t');
}

var temp_tow_col_sel = '\n<div class=\'_tow-col-sel\'>\n\t\t<div class="sel">\n\t\t\t<b>\u53EF\u9009\u9879</b>\n\t\t\t<select name="" id="" multiple="multiple" :size="size" class=\'left\' v-model=\'left_sel\' @dblclick=\'batch_add()\'>\n\t\t\t\t<option v-for=\'opt in orderBy(can_select,"label")\' :value="opt.value" v-text=\'opt.label\'  ></option>\n\t\t\t</select>\n\t\t</div>\n\n\t\t<div class="arrow">\n\t\t\t<img src="//res.enjoyst.com/image/right_02.png" alt=""\n\t\t\t\t:class=\'["_small_icon",{"deactive":left_sel.length==0}]\' @click=\'batch_add()\'>\n\t\t\t<br>\n\t\t\t<img src="//res.enjoyst.com/image/left_02.png" alt=""\n\t\t\t\t:class=\'["_small_icon",{"deactive":right_sel.length==0}]\' @click=\'batch_rm()\'>\n\t\t</div>\n\t\t<div class="sel">\n\t\t\t<b>\u9009\u4E2D\u9879</b>\n\t\t\t<select name="" id="" multiple="multiple" :size="size" class=\'right\' v-model=\'right_sel\' @dblclick=\'batch_rm()\'>\n\t\t\t\t<option v-for=\'opt in orderBy(selected,"label")\' :value="opt.value" v-text=\'opt.label\' ></option>\n\t\t\t</select>\n\t\t</div>\n\n</div>\n';

Vue.component('tow-col-sel', {
	template: temp_tow_col_sel,
	props: {
		choices: {},
		value: {
			default: function _default() {
				return [];
			}
		},
		size: {
			default: 6
		}
	},
	data: function data() {
		var self = this;
		if (!this.value) {
			var norm_selected = [];
		} else {
			norm_selected = ex.filter(this.choices, function (choice) {
				return ex.isin(choice.value, self.value);
			});
		}
		return {
			selected: norm_selected,
			//can_select:JSON.parse(JSON.stringify(this.choices)),
			left_sel: [],
			right_sel: []
		};
	},
	mounted: function mounted() {
		//var self=this
		//this.can_select=ex.filter(this.choices,function(choice){
		//	return !ex.isin(choice,self.selected)
		//})
		//this.selected__ = ex.remove(this.can_select,function (item) {
		//		return ex.isin(item.value,self.value)
		//	})
	},
	watch: {
		selected: function selected(v) {
			this.$emit('input', ex.map(v, function (choice) {
				return choice.value;
			}));
		}
	},
	computed: {
		can_select: function can_select() {
			var self = this;
			return ex.filter(this.choices, function (choice) {
				return !ex.isin(choice, self.selected);
			});
		}
	},
	methods: {
		orderBy: function orderBy(array, key) {
			return order_by_key(array, key);
		},
		batch_add: function batch_add() {
			var self = this;
			var added_choice = ex.remove(this.can_select, function (choice) {
				return ex.isin(choice.value, self.left_sel);
			});
			ex.extend(this.selected, added_choice);
		},
		batch_rm: function batch_rm() {
			var self = this;
			var del_choice = ex.remove(this.selected, function (choice) {
				return ex.isin(choice.value, self.right_sel);
			});
			//ex.extend(this.can_select,del_choice)
		}
	}
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.order_by_key = order_by_key;
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

function order_by_key(array, key) {
    return array.slice().sort(function (a, b) {
        if (isChinese(a[key]) && isChinese(b[key])) {
            return a[key].localeCompare(b[key], 'zh');
        } else {
            return compare(a[key], b[key]);
        }
    });
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _basic = __webpack_require__(2);

__webpack_require__(102);

var table_fields = {
    props: ['heads', 'row', 'inputWidth', 'labelWidth'],
    template: '<table class="table-fields">\n        <tr v-for="(head,index) in heads" :class="{\'last-input\':index==heads.length-1}">\n            <td class="field-label-td" :style="{width:labelWidth}" valign="top">\n            <div class="field-label" style="position: relative">\n                <span v-text="head.label"></span>\n                <span class="req_star" v-if=\'head.required\'>*</span>\n            </div>\n\n            </td>\n            <td class="field-input-td"  :style="{width:inputWidth}">\n            <div class="field-input">\n                <component v-if="head.editor" :is="head.editor"\n                     @field-event="$emit(\'field-event\',$event)"\n                     :head="head" :row="row"></component>\n                <span v-else v-text="row[head.name]"></span>\n                <span class="help-text clickable">\n                    <i style="color: #3780af;position: relative;top:10px;"  v-if="head.help_text" @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n                </span>\n            </div>\n\n            </td>\n        </tr>\n        <slot></slot>\n    </table>',
    methods: {
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        }
    },
    components: _basic.baseInput
};

Vue.component('com-table-fields', table_fields);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var field_bool = {
    props: ['row', 'head'],
    template: '<div class="checkbox">\n\t        <input type="checkbox" :id="\'id_\'+head.name" v-model=\'row[head.name]\' :disabled="head.readonly">\n\t\t\t <label :for="\'id_\'+head.name"><span v-text=\'my_label\'></span></label>\n\t\t\t\t\t  </div>',
    computed: {
        my_label: function my_label() {
            if (this.head.check_label) {
                return this.head.check_label;
            } else {
                return this.head.label;
            }
        }
    }
};
Vue.component('com-field-bool', field_bool);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by heyulin on 2017/1/24.
 *
 >->front/input.rst>
 =======
 inputs
 =======

 date
 ========
 ::

 <date v-model='variable'></date>  // 选择默认set=date ,即选择日期

 <date v-model='variable' set='month'></date> // 选择 set=month ,即选择月份

 <date v-model='variable' set='month' :config='{}'></date>  //  config 是自定义的配置对象，具体需要参加帮助文件

 datetime
 ===========
 ::

 <datetime v-model='variable' :config='{}'></datetime> // 选择日期和时间

 color
 ======

 forign-edit
 ============
 示例::

 <forign-edit :kw="person.emp_info" name="user" page_name="user" ></forign-edit>

 <-<
 */

var date_config_set = {
    date: {
        language: "zh-CN",
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true

    },
    month: {
        language: "zh-CN",
        format: "yyyy-mm",
        startView: "months",
        minViewMode: "months",
        autoclose: true
    }
};

var com_input_date = {
    //template:'<input type="text" class="form-control">',
    template: " <div class=\"com-date input-group datetime-picker\">\n                <input type=\"text\" class=\"form-control input-sm real-input\"\n                readonly :placeholder=\"placeholder\"/>\n\n                <div class=\"input-group-addon\" >\n                    <i v-if=\"! value\" @click=\"click_input()\" class=\"fa fa-calendar\" aria-hidden=\"true\"></i>\n                    <i v-else @click=\"$emit('input','')\" class=\"fa fa-calendar-times-o\" aria-hidden=\"true\"></i>\n                </div>\n                </div>",
    props: ['value', 'set', 'config', 'placeholder'],
    mounted: function mounted() {
        this.init();
    },
    methods: {
        init: function init() {
            var self = this;
            if (!this.set) {
                var def_conf = date_config_set.date;
            } else {
                var def_conf = date_config_set[this.set];
            }
            if (this.config) {
                ex.assign(def_conf, this.config);
            }
            self.input = $(this.$el).find('input');

            ex.load_css('/static/lib/bootstrap-datepicker1.6.4.min.css');

            //ex.load_js('/static/lib/bootstrap-datepicker1.6.4.min.js',function(){
            //    ex.load_js('/static/lib/bootstrap-datepicker1.6.4.zh-CN.min.js',function(){
            //        self.input.datepicker(def_conf).on('changeDate', function(e) {
            //            self.$emit('input',self.input.val())
            //        })
            //        // if has init value,then init it
            //        if(self.value){
            //            self.input.datepicker('update',self.value)
            //            self.input.val(self.value)
            //        }
            //    })
            //})
            ex.load_js('/static/lib/bootstrap-datepicker1.6.4.min.js').then(function () {
                return ex.load_js('/static/lib/bootstrap-datepicker1.6.4.zh-CN.min.js');
            }).then(function () {
                self.input.datepicker(def_conf).on('changeDate', function (e) {
                    self.$emit('input', self.input.val());
                });
                // if has init value,then init it
                if (self.value) {
                    self.input.datepicker('update', self.value);
                    self.input.val(self.value);
                }
            });
        },
        click_input: function click_input() {
            this.input.focus();
        },
        watch_value: function watch_value(n) {
            this.input.datepicker('update', n);
            this.input.val(n);
        }
    },
    watch: {
        value: function value(n) {
            this.watch_value(n);
        }
    }
};
window.com_input_date = com_input_date;
Vue.component('date', com_input_date);

Vue.component('datetime', {
    template: " <div class=\"com-datetime input-group datetime-picker\">\n                <input type=\"text\" class=\"form-control input-sm\" readonly :placeholder=\"placeholder\"/>\n                <div class=\"input-group-addon\" >\n                    <i v-if=\"! value\" @click=\"click_input()\" class=\"fa fa-calendar\" aria-hidden=\"true\"></i>\n                    <i v-else @click=\"$emit('input','')\" class=\"fa fa-calendar-times-o\" aria-hidden=\"true\"></i>\n                </div>\n                </div>",

    //props:['value','config'],
    props: ['value', 'set', 'config', 'placeholder'],
    mounted: function mounted() {
        var self = this;
        var def_conf = {
            language: "zh-CN",
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayHighlight: true,
            minuteStep: 1
        };
        if (self.config) {
            ex.assign(def_conf, this.config);
        }
        self.input = $(this.$el).find('input');

        ex.load_css('/static/lib/smalot-bootstrap-datetimepicker2.4.3.min.css');
        ex.load_js('/static/lib/moment2.17.1.min.js');
        ex.load_js('/static/lib/smalot-bootstrap-datetimepicker2.4.3.min.js', function () {

            $.fn.datetimepicker.dates['zh-CN'] = {
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                today: "今天",
                suffix: [],
                meridiem: ["上午", "下午"]
            };

            self.input.datetimepicker(def_conf).on('changeDate', function (e) {
                self.$emit('input', self.input.val());
            });

            // if has init value,then init it
            if (self.value) {
                self.input.datepicker('update', self.value);
                self.input.val(self.value);
            }
        });
    },
    methods: {
        click_input: function click_input() {
            this.input.focus();
        }
    },
    watch: {
        value: function value(n) {
            this.input.val(n);
            this.input.val(n);
        }
        //input_value:function(n){
        //    this.$emit('input',n)
        //}
    }
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(103);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var field_date = {
    props: ['row', 'head'],
    template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n                                <date v-else v-model="row[head.name]" :id="\'id_\'+head.name"\n                                    :placeholder="head.placeholder"></date>\n                               </div>'
};
Vue.component('com-field-date', field_date);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var search_select = {
    props: ['row', 'head'],
    data: function data() {
        return {
            model: this.row[this.head.name]
        };
    },
    template: '<div>\n                <span v-if=\'head.readonly\' v-text=\'get_label(head.options,row[head.name])\'></span>\n                <select v-else v-model=\'row[head.name]\'  :id="\'id_\'+head.name"  class="selectpicker form-control" data-live-search="true">\n                    <option v-for=\'opt in orderBy(head.options,"label")\' :value=\'opt.value\'\n                     :data-tokens="opt.label" v-text=\'opt.label\'></option>\n                </select>\n                </div>',
    mounted: function mounted() {
        var self = this;
        if (this.head.default && !this.row[this.head.name]) {
            Vue.set(this.row, this.head.name, this.head.default);
        }
        ex.load_css("/static/lib/bootstrap-select.min.css");
        ex.load_js("/static/lib/bootstrap-select.min.js", function () {
            $(self.$el).find('.selectpicker').selectpicker();
        });
    },
    methods: {
        get_label: function get_label(options, value) {
            var option = ex.findone(options, { value: value });
            if (!option) {
                return '---';
            } else {
                return option.label;
            }
        },
        orderBy: function orderBy(array, key) {
            return order_by_key(array, key);
        }
    }
};

Vue.component('com-field-search-select', search_select);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sim_select = {
    props: ['row', 'head'],
    data: function data() {
        var inn_config = {
            //orgin_order:true,
            order: false
        };
        if (this.head.config) {
            ex.assign(inn_config, this.head.config);
        }

        this.head.placeholder = this.head.placeholder || '请选择';

        return {
            model: this.row[this.head.name],
            cfg: inn_config
        };
    },
    template: '<div>\n            <span v-if=\'head.readonly\' v-text=\'get_label(head.options,row[head.name])\'></span>\n            <select v-else v-model=\'row[head.name]\'  :id="\'id_\'+head.name" :name="head.name"  class="form-control input-sm">\n                <option v-if="head.placeholder" :value="place_value" disabled selected style=\'display:none;\' class="placeholder" v-text="head.placeholder"></option>\n            \t<option v-for=\'opt in normed_options\' :value=\'opt.value\' v-text=\'opt.label\'></option>\n            </select>\n            </div>',
    mounted: function mounted() {
        // 如果有默认值，
        if (this.head.default && !this.row[this.head.name]) {
            Vue.set(this.row, this.head.name, this.head.default);
        }
        var self = this;
        // 下面这个淘汰了,暂时为了兼容性，放在这里
        if (this.head.remote_options) {
            ex.director_call(this.head.remote_options, { crt_value: this.row[this.head.name] }, function (resp) {
                self.head.options = resp;
            });
        }
        if (this.head.ctx_name) {
            self.head.options = named_ctx[this.head.ctx_name];
        }
    },

    watch: {
        my_value: function my_value() {
            if (this.head.remote_options) {
                var self = this;
                ex.director_call(this.head.remote_options, { row: self.row }, function (data) {
                    Vue.set(self.head, 'options', data);
                });
            }
        }
    },

    computed: {
        my_value: function my_value() {
            return this.row[this.head.name];
        },
        is_select: function is_select() {
            var v = this.row[this.head.name];
            return v != undefined;
        },
        place_value: function place_value() {
            var v = this.row[this.head.name];
            if (v === undefined) {
                return undefined;
            } else if (v === null) {
                return null;
            } else {
                return '';
            }
        },
        normed_options: function normed_options() {
            /*
             head.hide_related_field设置 隐藏与 row.hide_related_field 相等的选项
              * */
            var self = this;
            if (this.head.hide_related_field) {
                var array = ex.filter(this.head.options, function (item) {
                    return item.value != self.row[self.head.hide_related_field];
                });
            } else {
                var array = self.head.options;
            }

            return self.orderBy(array, 'label');
        }
    },
    methods: {
        get_label: function get_label(options, value) {
            var option = ex.findone(options, { value: value });
            if (!option) {
                return '---';
            } else {
                return option.label;
            }
        },
        orderBy: function orderBy(array, key) {
            if (this.head.order || this.cfg.order) {
                return order_by_key(array, key);
            } else {
                return array;
            }
        }
    }
};
Vue.component('com-field-select', sim_select);

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(106);

var field_sigle_chosen = {
    props: ['row', 'head'],
    template: '<div  :style="head.style">\n    <select  class="chosen field-single-chosen form-control"\n        :data-placeholder="head.placeholder" >\n         <option  :value="undefined" ></option>\n        <option v-for="option in order_options" :value="option.value" v-text="option.label"></option>\n    </select>\n    </div>',
    mounted: function mounted() {
        var self = this;
        ex.load_css(cfg.js_lib.chosen_css);
        ex.load_js(cfg.js_lib.chosen, function () {
            $(self.$el).find('select').chosen({
                search_contains: true,
                allow_single_deselect: true,
                width: '100%'
            }).change(function (event) {
                //self.$emit('input',$(this).val())
                if ($(this).val() == '') {
                    delete self.row[self.head.name];
                } else {
                    self.row[self.head.name] = $(this).val();
                }
            });
            self.setValue(self.value);
        });
    },
    watch: {
        value: function value(nv) {
            this.setValue(nv);
        }
    },
    computed: {
        order_options: function order_options() {
            if (this.head.order) {
                return ex.sortOrder(this.head.options, 'label');
            } else {
                return this.head.options;
            }
        }
    },
    methods: {
        setValue: function setValue(val) {
            $(this.$el).val(val);
            $(this.$el).trigger("chosen:updated");
        }
    }
};

Vue.component('com-field-single-chosen', field_sigle_chosen);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(107);

var field_sigle_chosen = {
    props: ['row', 'head'],
    template: '<div  :style="head.style">\n    <span v-if="head.readonly" v-text="label_text" ></span>\n    <input type="text" :name="head.name" style="display: none" v-model="row[head.name]">\n    <div v-show="!head.readonly">\n        <select  class="select2 field-single-select2 form-control" :id="\'id_\'+head.name">\n             <option  :value="undefined" ></option>\n            <option v-for="option in order_options" :value="option.value" v-text="option.label"></option>\n        </select>\n    </div>\n\n    </div>',
    mounted: function mounted() {
        var self = this;
        ex.load_css('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css');
        ex.load_js('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js', function () {

            $(self.$el).find('select').select2({
                placeholder: self.head.placeholder || '请选择',
                allowClear: true
            });
            self.setValue(self.row[self.head.name]);
            $(self.$el).find('.select2').change(function (e) {
                var value = $(self.$el).find('.select2').val();
                if (value == '') {
                    Vue.delete(self.row, self.head.name);
                } else {
                    Vue.set(self.row, self.head.name, value);
                }
            });
        });
    },
    watch: {
        //value:function(nv){
        //    this.setValue(nv)
        //}
    },
    computed: {
        label_text: function label_text() {
            var opt = ex.findone(this.head.options, { value: this.row[this.head.name] });
            if (opt) {
                return opt.label;
            } else {
                return '';
            }
        },
        order_options: function order_options() {
            if (this.head.order) {
                return ex.sortOrder(this.head.options, 'label');
            } else {
                return this.head.options;
            }
        }
    },
    methods: {
        setValue: function setValue(val) {
            $(this.$el).find('.select2').val(val);
            $(this.$el).find('.select2').trigger('change');
            Vue.set(this.row, this.head.name, val);
        }
    }
};

Vue.component('com-field-single-select2', field_sigle_chosen);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(3);

/*
* config={
*    accept:"xx.jpg",
*     multiple:true,
*
* }
* */

var field_file_uploader = exports.field_file_uploader = {
    props: ['row', 'head'],
    template: '<div><com-file-uploader v-model="row[head.name]" :config="head.config" :readonly="head.readonly"></com-file-uploader></div>'
};

var com_file_uploader = exports.com_file_uploader = {
    props: ['to', 'value', 'readonly', 'config'],
    data: function data() {

        return {
            picstr: this.value,
            pictures: this.value ? this.value.split(';') : [],
            crt_pic: ''
        };
    },

    template: '<div class="file-uploader">\n    <div v-if="!readonly">\n        <input v-if="cfg.multiple" v-show="!cfg.com_btn" class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept" multiple="multiple">\n        <input v-else v-show="!cfg.com_btn" class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept">\n    </div>\n\n\n    <div class="wrap">\n        <ul class="sortable">\n            <li  v-for="pic in pictures" class="item" >\n                <img v-if="is_image(pic)" :src="pic" alt="" @click="cfg.on_click(pic)"/>\n                <div class="file-wrap" @click="cfg.on_click(pic)" v-else>\n                    <span class="file-type" v-text="get_res_type(pic)"></span>\n                    <!--<span v-text="get_res_basename(pic)"></span>-->\n                </div>\n\n                <span v-if="! readonly" v-show="cfg.multiple" class="remove-btn" title="remove image" @click="remove(pic)">\n                    <!--<i class="fa fa-window-close" aria-hidden="true"></i>-->\n                    <i class="fa fa-times" aria-hidden="true"></i>\n                </span>\n\n            </li>\n        </ul>\n    </div>\n\n\n     <component v-if="cfg.com_btn && ! readonly" :is="cfg.com_btn" @click.native="browse()"></component>\n\n\n\n    </div>',
    mounted: function mounted() {
        var self = this;
        if (this.cfg.sortable) {
            ex.load_js("/static/lib/sortable.min.js", function () {
                new Sortable($(self.$el).find('.sortable')[0], {
                    onSort: function onSort( /**Event*/evt) {
                        self.ajust_order();
                    }
                });
            });
        }
    },
    computed: {
        res_url: function res_url() {
            return this.to ? this.to : "/d/upload";
        },
        cfg: function cfg() {
            var def_config = {
                accept: 'image/*',
                multiple: true,
                sortable: true,
                on_click: function on_click(url) {
                    window.open(url, '_blank' // <- This is what makes it open in a new window.
                    );
                }
            };
            if (this.config) {
                if (!this.config.hasOwnProperty('multiple') || this.config.multiple) {
                    def_config.com_btn = 'file-uploader-btn-plus';
                }
                ex.assign(def_config, this.config);
            }

            return def_config;
        }

    },
    watch: {
        value: function value(new_val, old_val) {
            if (this.picstr != new_val) {
                this.picstr = new_val;
                this.pictures = this.value ? this.value.split(';') : [];
            }
            if (!this.picstr) {
                $(this.$el).find('.pic-input').val("");
            }
        }
    },
    methods: {
        browse: function browse() {
            $(this.$el).find('input').click();
        },
        enter: function enter(pic) {
            this.crt_pic = pic;
        },
        out: function out() {
            this.crt_pic = '';
        },
        upload_pictures: function upload_pictures(event) {
            var self = this;
            var file_list = event.target.files;
            if (file_list.length == 0) {
                return;
            }
            var upload_url = this.res_url;

            show_upload();

            fl.uploads(file_list, upload_url, function (resp) {
                if (resp) {
                    if (self.cfg.multiple) {
                        self.add_value(resp);
                    } else {
                        self.set_value(resp);
                    }
                }
                hide_upload(300);
            });
        },
        set_value: function set_value(value) {
            //@value: [url1,url2]
            var val = value.join(';');
            this.$emit('input', val);
        },
        add_value: function add_value(value) {
            var self = this;
            var real_add = ex.filter(value, function (item) {
                return !ex.isin(item, self.pictures);
            });
            var real_list = self.pictures.concat(real_add);
            var val = real_list.join(';');
            self.$emit('input', val);
        },
        ajust_order: function ajust_order() {
            var list = $(this.$el).find('ul.sortable img');
            var url_list = [];
            for (var i = 0; i < list.length; i++) {
                var ele = list[i];
                url_list.push($(ele).attr('src'));
            }
            var val = url_list.join(';');
            this.picstr = val;
            this.$emit('input', val);
        },
        remove: function remove(pic) {
            var pics = this.picstr.split(';');
            ex.remove(pics, function (item) {
                return pic == item;
            });
            var val = pics.join(';');
            this.$emit('input', val);
        },
        is_image: function is_image(url) {
            var type = this.get_res_type(url);
            return ex.isin(type.toLowerCase(), ['jpg', 'png', 'webp', 'gif', 'jpeg', 'ico']);
        },
        get_res_type: function get_res_type(url) {
            var mt = /[^.]+$/.exec(url);
            if (mt.length > 0) {
                return mt[0];
            } else {
                return "";
            }
        },
        get_res_basename: function get_res_basename(url) {
            var mt = /[^/]+$/.exec(url);
            if (mt.length > 0) {
                return mt[0];
            } else {
                return mt[0];
            }
        }
    }
};

var plus_btn = {
    props: ['accept'],
    template: '<div class="file-uploader-btn-plus">\n        <div class="inn-btn"><span>+</span></div>\n        <div style="text-align: center">\u6DFB\u52A0\u6587\u4EF6</div>\n    </div>'
};
Vue.component('file-uploader-btn-plus', plus_btn);

Vue.component('com-file-uploader', com_file_uploader);
Vue.component('field-file-uploader', field_file_uploader);

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var field_bool = {
    props: ['row', 'head'],
    template: '<div class="checkbox">\n\t        <input type="checkbox" :id="\'id_\'+head.name" v-model=\'my_value\' :disabled="head.readonly">\n\t\t\t <label :for="\'id_\'+head.name"><span v-text=\'my_label\'></span></label>\n\t\t\t\t\t  </div>',
    computed: {
        my_label: function my_label() {
            if (this.head.check_label) {
                return this.head.check_label;
            } else {
                return this.head.label;
            }
        },
        my_value: {
            set: function set(v) {
                if (v) {
                    this.row[this.head.name] = 1;
                } else {
                    this.row[this.head.name] = 0;
                }
            },
            get: function get() {
                return Boolean(parseInt(this.row[this.head.name]));
            }
        }
    }
};
Vue.component('com-field-int-bool', field_bool);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(108);

var multi_chosen = {
    props: ['value', 'options'],
    template: '<select  multiple="multiple" class="multi-chosen form-control">\n    <option v-for="option in options" :value="option.value" v-text="option.label"></option>\n</select>',
    mounted: function mounted() {
        var self = this;
        ex.load_css('https://cdn.bootcss.com/chosen/1.8.2/chosen.min.css');
        ex.load_js('https://cdn.bootcss.com/chosen/1.8.2/chosen.jquery.min.js', function () {
            $(self.$el).chosen({
                search_contains: true
            }).change(function (event) {
                self.$emit('input', $(this).val());
            });
            self.setValue(self.value);
            $(self.$el).siblings('.chosen-container').removeAttr('style');
        });
    },
    watch: {
        value: function value(nv) {
            this.setValue(nv);
        }
    },
    methods: {
        setValue: function setValue(val) {
            $(this.$el).val(val);
            $(this.$el).trigger("chosen:updated");
        }
    }
};

Vue.component('multi-chosen', multi_chosen);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var number = {
    props: ['row', 'head'],

    template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t<input v-else type="number" class="form-control input-sm" v-model="row[head.name]" :id="\'id_\'+head.name"\n            \t\t    :name="head.name" :step="head.step"\n                        :placeholder="head.placeholder" :autofocus="head.autofocus"></div>'
};

Vue.component('com-field-number', number);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_table = {
    props: {
        has_check: {},
        heads: {},
        rows: {
            default: function _default() {
                return [];
            }
        },
        map: {},
        row_sort: {
            default: function _default() {
                return { sort_str: '', sortable: [] };
            }
        },
        value: {}
    },
    computed: {
        selected: {
            get: function get() {
                return this.value;
            },
            set: function set(v) {
                this.$emit('input', v);
            }
        }
    },
    watchs: {
        selected: function selected(v) {
            this.$emit('input', v);
        }
    },
    methods: {
        m_map: function m_map(name, row) {
            if (this.map) {
                return this.map(name, row);
            } else {
                return row[name];
            }
        },
        is_sorted: function is_sorted(sort_str, name) {
            var ls = sort_str.split(',');
            var norm_ls = this.filter_minus(ls);
            return ex.isin(name, norm_ls);
        },
        filter_minus: function filter_minus(array) {
            return ex.map(array, function (v) {
                if (v.startsWith('-')) {
                    return v.slice(1);
                } else {
                    return v;
                }
            });
        },
        is_sortable: function is_sortable(name) {
            return ex.isin(name, this.row_sort.sortable);
        },
        toggle: function toggle(sort_str, name) {
            if (sort_str == name) {
                return '-' + name;
            } else {
                return name;
            }
            //var ls=ex.split(sort_str,',')
            //var norm_ls=this.filter_minus(ls)
            //var idx = norm_ls.indexOf(name)
            //if(idx!=-1){
            //    ls[idx]=ls[idx].startsWith('-')?name:'-'+name
            //}else{
            //    ls.push(name)
            //}
            //return ls.join(',')
        },
        toggle_all: function toggle_all(e) {
            var checked = e.currentTarget.checked;
            if (checked) {
                this.selected = ex.map(this.rows, function (row) {
                    return row.pk;
                });
            } else {
                this.selected = [];
            }
        }

    },
    template: '\t<table data-toggle="table">\n\t\t<thead>\n\t\t\t<tr >\n\t\t\t\t<th style=\'width:50px\' v-if=\'has_check\'>\n\t\t\t\t\t<input type="checkbox" name="test" value="" @click="toggle_all($event)"/>\n\t\t\t\t</th>\n\t\t\t\t<th v-for=\'head in heads\' :class=\'["td_"+head.name,{"selected":is_sorted(row_sort.sort_str ,head.name )}]\'>\n\t\t\t\t\t<div v-if=\'is_sortable(head.name)\'  class=\'clickable\' style="white-space: nowrap;"\n\t\t\t\t\t\t@click=\'row_sort.sort_str = toggle( row_sort.sort_str,head.name)\'>\n\t\t\t\t\t\t    <span v-text=\'head.label\'></span>\n\t\t\t\t\t\t    <div style="font-size: 0.7em;display: inline-block;margin: 0 0.2em;">\n                                <i :class=\'["fa fa-caret-up sortmark",{"sort-col":row_sort.sort_str==head.name}]\' style="position: relative;top: 0.7em;"></i><br>\n                                <i :class=\'["fa fa-caret-down sortmark",{"sort-col":row_sort.sort_str=="-"+head.name}]\' class="fa fa-caret-down"></i>\n\t\t\t\t\t\t    </div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<span v-else v-text=\'head.label\'></span>\n\t\t\t\t\t<!--<sort-mark class=\'sort-mark\' v-model=\'row_sort.sort_str\' :name=\'head.name\'></sort-mark>-->\n\t\t\t\t</th>\n\t\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n\t\t\t<tr v-for=\'row in rows\'>\n\t\t\t\t<td v-if=\'has_check\'>\n\t\t\t\t\t<input type="checkbox" name="test" :value="row" v-model=\'selected\'/>\n\t\t\t\t</td>\n\t\t\t\t<td v-for=\'head in heads\' :class=\'"td_"+head.name\'>\n\t\t\t\t    <component v-if="head.type" :is="head.type" :name="head.name" :row="row"></component>\n\t\t\t\t\t<span v-else v-html=\'m_map(head.name,row)\'></span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>'
};

Vue.component('com-table', com_table);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(109);

var com_date_range = {
    props: ['head', 'search_args'],
    data: function data() {
        if (!this.search_args['_start_' + this.head.name]) {
            Vue.set(this.search_args, '_start_' + this.head.name, '');
        }
        if (!this.search_args['_end_' + this.head.name]) {
            Vue.set(this.search_args, '_end_' + this.head.name, '');
        }
        return {};
    },
    template: '<div  class="com-date-range-filter flex flex-ac">\n                    <date v-model="search_args[\'_start_\'+head.name]" :placeholder="head.label"></date>\n                    <div style="display: inline-block;margin: 0 2px;" >-</div>\n                    <date  v-model="search_args[\'_end_\'+head.name]" :placeholder="head.label"></date>\n                </div>'

};
window.com_filter_date_range = com_date_range;
Vue.component('com-date-range-filter', com_date_range);

//var com_date_range={
//    props:['head','search_args'],
//    template:`<div  v-for='filter in heads' v-if="['time','date','month'].indexOf(filter.type)!=-1" class="date-filter flex flex-ac">
//                    <span v-text="filter.label"></span>
//                    <span>{From}</span>
//                    <div>
//                        <date v-if="filter.type=='month'" set="month" v-model="search['_start_'+filter.name]"></date>
//                        <date v-if="filter.type=='date'"  v-model="search['_start_'+filter.name]"></date>
//                    </div>
//                    <span>{To}</span>
//                    <div>
//                        <date v-if="filter.type=='month'" set="month" v-model="search['_end_'+filter.name]"></date>
//                        <date v-if="filter.type=='date'"  v-model="search['_end_'+filter.name]"></date>
//                    </div>
//                </div>`,
//
//}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_search = {
    props: ['head', 'search_args'],
    data: function data() {
        if (!this.search_args._q) {
            Vue.set(this.search_args, '_q', '');
        }
        return {};
    },
    template: '<div>\n    <input style="max-width: 20em;min-width: 10em;"\n             type="text"\n             name="_q"\n             v-model=\'search_args._q\'\n             :placeholder=\'head.search_tip\'\n             @keyup.13="$emit(\'submit\')"\n             maxlength="500"\n             class=\'form-control input-sm\'/>\n    </div> '
};
Vue.component('com-search-filter', com_search);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(110);

var com_search = {
    props: ['head', 'search_args'],
    data: function data() {
        if (!this.search_args._q) {
            Vue.set(this.search_args, '_q', '');
        }
        if (!this.search_args._qf) {
            Vue.set(this.search_args, '_qf', this.head.options[0].value);
        }
        return {};
    },
    template: '<div class="search-select">\n    <!--<input style="max-width: 20em;min-width: 10em;"-->\n             <!--type="text"-->\n             <!--name="_q"-->\n             <!--v-model=\'search_args._q\'-->\n             <!--:placeholder=\'head.search_tip\'-->\n             <!--@keyup.13="$emit(\'submit\')"-->\n             <!--class=\'form-control input-sm\'/>-->\n             <el-input class="input-with-select"\n                :placeholder="normed_placeholder"\n                prefix-icon="el-icon-search"\n                @keyup.native.13="$emit(\'submit\')"\n                size="small"\n                maxlength="200"\n                v-model="search_args._q">\n                 <!--<el-select v-model="search_args.qf" slot="append" placeholder="\u8BF7\u9009\u62E9">-->\n                      <!--<el-option label="\u9910\u5385\u540D" value="1"></el-option>-->\n                      <!--<el-option label="\u8BA2\u5355\u53F7" value="2"></el-option>-->\n                      <!--<el-option label="\u7528\u6237\u7535\u8BDD" value="3"></el-option>-->\n                <!--</el-select>-->\n\n                   <el-dropdown trigger="click" slot="append" @command="handleCommand">\n                      <span class="el-dropdown-link">\n                        <i class="el-icon-arrow-down el-icon--right"></i>\n                      </span>\n                      <el-dropdown-menu slot="dropdown">\n                        <!--<el-dropdown-item command="1"><span :class="{\'active-search-item\':isActive(1)}">\u9EC4\u91D1\u7CD5</span></el-dropdown-item>-->\n                        <el-dropdown-item v-for="opt in head.options" :command="opt.value"><span :class="{\'active-search-item\':isActive(opt.value)}" v-text="opt.label"></span></el-dropdown-item>\n\n                      </el-dropdown-menu>\n                    </el-dropdown>\n              </el-input>\n    </div> ',
    computed: {
        normed_placeholder: function normed_placeholder() {
            var crt = ex.findone(this.head.options, { value: this.search_args._qf });
            return crt.label;
        }
    },
    methods: {
        handleCommand: function handleCommand(cmd) {
            Vue.set(this.search_args, '_qf', cmd);
        },
        //set_value:function(v){
        //    this.search_args._qf=v
        //},
        isActive: function isActive(v) {
            return this.search_args._qf == v;
        }
    }
};
Vue.component('com-search-select', com_search);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(111);

var com_select = {
    props: ['head', 'search_args', 'config'],
    template: '<select v-model=\'search_args[head.name]\' class="form-control input-sm com-filter-select" >\n        <option v-if="head.forbid_select_null" :value="undefined" disabled v-text=\'head.label\'></option>\n        <option v-else :value="undefined" v-text=\'head.label\' ></option>\n        <option :value="null" disabled >---</option>\n        <option v-for=\'option in orderBy(options,"label")\' :value="option.value" v-text=\'option.label\'></option>\n    </select>\n    ',
    data: function data() {
        var self = this;
        return {
            order: this.head.order || false,
            parStore: ex.vueParStore(this)
        };
    },

    computed: {
        myvalue: function myvalue() {
            return this.search_args[this.head.name];
        },
        options: function options() {
            if (this.head.ctx_name) {
                return named_ctx[this.head.ctx_name];
            } else {
                return this.head.options;
            }
        }
    },
    watch: {
        myvalue: function myvalue(v) {
            this.$emit('input', v);
            //if(this.head.changed_emit ){
            //    this.parStore.$emit(this.head.changed_emit,v)
            //}
            //if(this.head.on_changed_express){
            //    ex.eval(this.head.on_changed_express,{ts:this.parStore,value:v})
            //}
        },
        options: function options(v) {
            delete this.search_args[this.head.name];
        }
    },
    mounted: function mounted() {
        //var parName = ex.vuexParName(this)
        var self = this;

        // 更新值
        //if(this.head.update_options_on ){
        //    //ex.vuexOn(this,this.head.update_options_on,this.get_options)
        //    this.parStore.$on(this.head.update_options_on,this.get_options)
        //}
        // 清空值
        //if(this.head.clear_value_on){
        //    //ex.vuexOn(this,this.head.update_options_on,this.clear_value)
        //    this.parStore.$on(this.head.update_options_on,this.clear_value)
        //}
        if (this.head.event_slots) {
            this.set_event_slot();
        }
    },
    methods: {
        set_event_slot: function set_event_slot() {
            var self = this;
            ex.each(this.head.event_slots, function (router) {
                if (router.event) {
                    self.$on(router.event, function (e) {
                        ex.eval(router.express, { event: e, ts: self.parStore, vc: self });
                    });
                }
                if (router.par_event) {
                    self.parStore.$on(router.par_event, function (e) {
                        ex.eval(router.express, { event: e, ts: self.parStore, vc: self });
                    });
                }
            });
        },
        get_options: function get_options(_ref) {
            var _ref$post_data = _ref.post_data,
                post_data = _ref$post_data === undefined ? {} : _ref$post_data;

            //this.clear_value()
            var self = this;
            //if(this.head.post_data){
            //    var post_data=ex.eval(this.head.post_data,{event:event,vc:self})
            //}else{
            //    var post_data={}
            //}
            ex.director_call(this.head.director_name, post_data, function (resp) {
                self.head.options = resp;
            });
        },
        clear_value: function clear_value() {
            delete this.search_args[this.head.name];
        },
        orderBy: function orderBy(array, key) {
            if (!this.order) {
                return array;
            } else {
                return array.slice().sort(function (a, b) {
                    if (isChinese(a[key]) && isChinese(b[key])) {
                        return a[key].localeCompare(b[key], 'zh');
                    } else {
                        return compare(a[key], b[key]);
                    }
                });
            }
        }
    }
};
Vue.component('com-select-filter', com_select);
// 以后替换为下面的标准名
Vue.component('com-filter-select', com_select);

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

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_date_datetimefield_range = {
    props: ['head', 'search_args'],
    data: function data() {
        if (!this.search_args['_start_' + this.head.name]) {
            Vue.set(this.search_args, '_start_' + this.head.name, '');
            var start = '';
        } else {
            var start = this.search_args['_start_' + this.head.name].slice(0, 10);
            this.search_args['_start_' + this.head.name] = start + ' 00:00:00';
        }
        if (!this.search_args['_end_' + this.head.name]) {
            Vue.set(this.search_args, '_end_' + this.head.name, '');
            var end = '';
        } else {
            var end = this.search_args['_end_' + this.head.name].slice(0, 10);
            this.search_args['_end_' + this.head.name] = end + ' 23:59:59';
        }
        return {
            start: start,
            end: end
        };
    },
    template: '<div  class="com-date-range-filter date-filter flex flex-ac">\n                     <!--<date v-model="start" :placeholder="head.label"></date>-->\n                     <span v-text="head.label" style="white-space: nowrap"></span>:\n                        <input class="start form-control input-sm " v-model="start" readonly\n                        style="background-color: white"\n                        placeholder="\u5F00\u59CB\u65E5\u671F">\n                    <div style="display: inline-block;margin: 0 2px;" >-</div>\n                        <!--<date  v-model="end" :placeholder="head.label"></date>-->\n                        <input class="end form-control input-sm"  v-model="end"  readonly\n                         style="background-color: white"\n                         placeholder="\u7ED3\u675F\u65E5\u671F">\n                </div>',
    mounted: function mounted() {
        var self = this;
        ex.load_js('/static/lib/laydate/laydate.js', function () {
            laydate.render({
                elem: $(self.$el).find('.start')[0],
                type: 'date',
                done: function done(value, date, endDate) {
                    //self.search_args['_start_'+self.head.name]=value
                    self.start = value;
                }
            });
            laydate.render({
                elem: $(self.$el).find('.end')[0],
                type: 'date',
                done: function done(value, date, endDate) {
                    //self.search_args['_end_'+self.head.name]=value
                    self.end = value;
                }
            });
        });
    },
    watch: {
        start: function start(nv, ov) {
            if (nv && this.end) {
                if (nv > this.end) {
                    cfg.showError('开始时间必须小于结束时间');
                    var self = this;
                    Vue.nextTick(function () {
                        self.start = ov;
                    });
                    return;
                }
            }
            if (nv) {
                Vue.set(this.search_args, '_start_' + this.head.name, nv + ' 00:00:00');
            } else {
                Vue.set(this.search_args, '_start_' + this.head.name, nv);
            }
        },
        end: function end(nv, ov) {
            if (nv && this.start) {
                if (nv < this.start) {
                    cfg.showError('结束时间必须大于开始时间');
                    var self = this;
                    Vue.nextTick(function () {
                        self.end = ov;
                    });
                    return;
                }
            }
            if (nv) {
                Vue.set(this.search_args, '_end_' + this.head.name, nv + ' 23:59:59');
            } else {
                Vue.set(this.search_args, '_end_' + this.head.name, nv);
            }
        }
    }

};
window.com_date_datetimefield_range = com_date_datetimefield_range;
Vue.component('com-date-datetimefield-range-filter', com_date_datetimefield_range);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_datetime_range = {
    props: ['head', 'search_args'],
    data: function data() {

        var start = this.search_args['_start_' + this.head.name];
        var end = this.search_args['_end_' + this.head.name];
        return {
            start: start,
            end: end
        };
    },
    template: '<div  class="com-filter-datetime-range flex flex-ac">\n                <span v-text="head.label" style="white-space: nowrap"></span>:\n                    <input class="start form-control input-sm " v-model="start" readonly\n                        style="background-color: white;width: 12em"\n                        placeholder="\u5F00\u59CB\u65F6\u95F4">\n                    <div style="display: inline-block;margin: 0 2px;" >-</div>\n                    <input class="end form-control input-sm"  v-model="end"  readonly\n                     style="background-color: white;width: 12em"\n                     placeholder="\u7ED3\u675F\u65F6\u95F4">\n                </div>',
    //template:`<div  class="com-filter-datetime flex flex-ac">
    //                <input type="text" class="form-control input-sm" style="width: 23em" readonly
    //                    :placeholder="head.placeholder">
    //            </div>`,
    mounted: function mounted() {
        var self = this;
        ex.load_js('/static/lib/laydate/laydate.js', function () {
            laydate.render({
                elem: $(self.$el).find('.start')[0],
                type: 'datetime',
                done: function done(value, date, endDate) {
                    //self.search_args['_start_'+self.head.name]=value
                    self.start = value;
                    //console.log(value); //得到日期生成的值，如：2017-08-18
                    //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                    //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                }
            });
            laydate.render({
                elem: $(self.$el).find('.end')[0],
                type: 'datetime',
                done: function done(value, date, endDate) {
                    self.end = value;
                    //console.log(value); //得到日期生成的值，如：2017-08-18
                    //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                    //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                }
            });
        });
    },
    watch: {
        start: function start(nv, ov) {
            if (nv && this.end) {
                if (nv > this.end) {
                    cfg.showError('开始时间必须小于结束时间');
                    var self = this;
                    Vue.nextTick(function () {
                        self.start = ov;
                    });
                    return;
                }
            }
            Vue.set(this.search_args, '_start_' + this.head.name, nv);
        },
        end: function end(nv, ov) {
            if (nv && this.start) {
                if (nv < this.start) {
                    cfg.showError('结束时间必须大于开始时间');
                    var self = this;
                    Vue.nextTick(function () {
                        self.end = ov;
                    });
                    return;
                }
            }
            Vue.set(this.search_args, '_end_' + this.head.name, nv);
        }
    }

};

Vue.component('com-filter-datetime-range', com_datetime_range);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_date = {
    props: ['head', 'search_args'],
    template: '<com-field-date :head="head" :row="search_args"></com-field-date>\n    '
};

Vue.component('com-filter-date', com_date);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_select = {
    props: ['head', 'search_args'],
    template: '<com-field-single-chosen :head="head" :row="search_args"></com-field-single-chosen>\n    '
};

Vue.component('com-filter-search-select', com_select);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_select = {
    props: ['head', 'search_args'],
    template: '<com-field-single-select2 :head="head" :row="search_args"></com-field-single-select2>\n    '
};

Vue.component('com-filter-single-select2', com_select);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _datetime_range = __webpack_require__(54);

var datetime_range = _interopRequireWildcard(_datetime_range);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_select = {
    props: ['head', 'search_args', 'config'],
    template: '<select v-model=\'search_args[head.name]\' class="form-control input-sm" >\n        <option :value="null_value" v-text=\'head.label\'></option>\n        <option  disabled >---</option>\n        <option v-for=\'option in orderBy( head.options,"label")\' :value="option.value" v-text=\'option.label\'></option>\n    </select>\n    ',
    data: function data() {
        return {};
    },
    computed: {
        watchedValue: function watchedValue() {
            return this.search_args[this.head.related];
        },
        null_value: function null_value() {
            if (this.search_args[this.head.name] === null) {
                return null;
            } else {
                return undefined;
            }
        }
    },
    watch: {
        myvalue: function myvalue(v) {
            this.$emit('input', v);
        },
        watchedValue: function watchedValue(nv) {
            var self = this;
            if (nv) {
                var post_data = [{ fun: "director_call", director_name: this.head.director_name, kws: { related: nv } }];
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    self.head.options = resp.director_call;
                });
            } else {
                self.head.options = [];
            }
            self.search_args[self.head.name] = null;
        }
    },
    methods: {

        orderBy: function orderBy(array, key) {
            if (!this.head.order) {
                return array;
            } else {
                return array.slice().sort(function (a, b) {
                    if (isChinese(a[key]) && isChinese(b[key])) {
                        return a[key].localeCompare(b[key], 'zh');
                    } else {
                        return compare(a[key], b[key]);
                    }
                });
            }
        }
    }
};
Vue.component('com-related-select-filter', com_select);

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

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
以后都不用这个组件了。现在暂时放在这里
* */

var first_col = {
    props: ['row', 'name'],
    methods: {
        ret: function ret(row) {
            ln.ret(row);
        },
        form_link: function form_link(name, row) {
            return ex.template('{edit}?pk={pk}', { edit: page_name + '.edit',
                pk: row.pk
            });
        },
        is_pop: function is_pop() {
            return search_args._pop;
        }
    },
    template: '<div>\n    <span v-if="is_pop()"  v-text="row[name]" @click="ret(row)" style="cursor: pointer;color: #5d9cd3"></span>\n    <a v-else :href="form_link(name,row)" v-text="row[name]"></a>\n    </div>'
};

Vue.component('first-col', first_col);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 Argments:
 ==========

 nums = ['1','...','6_a','7','8','...','999']

 Events:
 =======

 goto_page,num

 */

Vue.component('paginator', {
    props: ['nums', 'crt', 'set'],
    data: function data() {
        return {
            input_num: this.crt || 1
        };
    },

    methods: {
        goto_page: function goto_page(num) {
            if (!isNaN(parseInt(num))) {
                this.$emit('goto_page', num);
            }
        }
    },
    template: ex.template('\n    <div class="paginator">\n    <ul class="pagination page-num">\n    <li v-for=\'num in nums\' track-by="$index" :class=\'{"clickable": !isNaN(parseInt(num))}\' @click=\'goto_page(num)\'>\n    <span v-text=\'!isNaN(parseInt(num))? parseInt(num):num\' :class=\'{"active":parseInt(num) ==parseInt(crt)}\'></span>\n    </li>\n    </ul>\n    <div v-if="set==\'jump\'" class="page-input-block">\n        <input type="text" v-model="input_num"/>\n        <button type="button" class="btn btn-success btn-xs" @click="goto_page(input_num)">{jump}</button>\n    </div>\n    </div>\n    ', ex.trList(['jump']))
});

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('sort-mark', {
    props: ['value', 'name'],
    data: function data() {
        return {
            index: -1,
            sort_str: this.value
        };
    },
    //mixins:[table_fun],
    template: '<span class=\'sort-mark\'>\n\t\t\t<span v-if=\'index>0\' v-text=\'index\'></span>\n\t\t\t<img v-if=\'status=="up"\' src=\'http://res.enjoyst.com/image/up_01.png\'\n\t\t\t\t\t @click=\'sort_str=toggle(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t<img v-if=\'status=="down"\' src=\'http://res.enjoyst.com/image/down_01.png\'\n\t\t\t\t\t @click=\'sort_str=toggle(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t<img v-if=\'status!="no_sort"\' src=\'http://res.enjoyst.com/image/cross.png\'\n\t\t\t\t\t@click=\'sort_str=remove_sort(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t</span>\n\t',
    computed: {
        status: function status() {
            var sorted = this.value.split(',');
            for (var x = 0; x < sorted.length; x++) {
                var org_name = sorted[x];
                if (org_name.startsWith('-')) {
                    var name = org_name.slice(1);
                    var minus = 'up';
                } else {
                    var name = org_name;
                    var minus = 'down';
                }
                if (name == this.name) {
                    this.index = x + 1;
                    return minus;
                }
            }
            return 'no_sort';
        }
    },
    methods: {
        remove_sort: function remove_sort(sort_str, name) {
            var ls = ex.split(sort_str, ',');
            ls = ex.filter(ls, function (v) {
                return v != '-' + name && v != name;
            });
            return ls.join(',');
        },
        toggle: function toggle(sort_str, name) {
            var ls = ex.split(sort_str, ',');
            var norm_ls = this.filter_minus(ls);
            var idx = norm_ls.indexOf(name);
            if (idx != -1) {
                ls[idx] = ls[idx].startsWith('-') ? name : '-' + name;
            } else {
                ls.push(name);
            }
            return ls.join(',');
        }
        //methods:{

        //	get_status:function () {
        //		var sorted=this.sort_str.split(',')
        //		for(var x=0;x<sorted.length;x++){
        //			var org_name=sorted[x]
        //			if(org_name.startsWith('-')){
        //				var name=org_name.slice(1)
        //				var minus='up'
        //			}else{
        //				var name=org_name
        //				var minus='down'
        //			}
        //			if(name==this.name){
        //				this.index=x+1
        //				return minus
        //			}
        //		}
        //		return 'no_sort'
        //	}
        //}

    } });

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_table_btn = {
    data: function data() {
        return {
            can_add: can_add,
            can_del: can_del
        };
    },
    props: ['add_new', 'del_item', 'table_bus'],
    template: '<div class=\'btn-group\'>\n            <slot></slot>\n\t\t\t<button type="button" class="btn btn-success btn-sm" @click=\'add_new()\' v-if=\'can_add\'>\u521B\u5EFA</button>\n\t\t\t<button type="button" class="btn btn-danger btn-sm" @click=\'del_item()\' v-if=\'can_del\' :disabled="table_bus.selected.length==0">\u5220\u9664</button>\n\n\t\t</div>'
};

Vue.component('com-table-btn', com_table_btn);

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _com_search = __webpack_require__(50);

var com_search = _interopRequireWildcard(_com_search);

var _com_search_select = __webpack_require__(51);

var com_search_select = _interopRequireWildcard(_com_search_select);

var _com_select = __webpack_require__(52);

var com_select = _interopRequireWildcard(_com_select);

var _com_date_range = __webpack_require__(49);

var com_date_range = _interopRequireWildcard(_com_date_range);

var _related_select = __webpack_require__(59);

var related_select = _interopRequireWildcard(_related_select);

var _date_datetimefield_range = __webpack_require__(53);

var date_datetimefield_range = _interopRequireWildcard(_date_datetimefield_range);

var _filter_search_select = __webpack_require__(56);

var filter_search_select = _interopRequireWildcard(_filter_search_select);

var _filter_date = __webpack_require__(55);

var filter_date = _interopRequireWildcard(_filter_date);

var _filter_single_select = __webpack_require__(57);

var filter_single_select2 = _interopRequireWildcard(_filter_single_select);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(114); /**
                                      >5>front/table.rst>
                                     
                                      table的过滤器
                                      ============
                                      ::
                                     
                                      class SalaryFilter(RowFilter):
                                      names=['is_checked']
                                      range_fields=[{'name':'month','type':'month'}]
                                      model=SalaryRecords
                                     
                                     
                                      <-<
                                      */


Vue.component('com-filter', {
    /*
    * 过滤器的 容器
    * */
    props: ['heads', 'search_args'],
    template: '<div v-if=\'heads.length>0\' class="com-filter flex flex-grow flex-ac" >\n            <com-auto-more org-height="2.8em">\n                <div class="flex" style="flex-wrap: wrap;padding: 0.3em">\n                     <div v-for="filter in heads" :id="\'filter-\'+filter.name" class="filter-item" style="margin-bottom: 0.3em">\n                            <component @submit="m_submit()" :is="filter.editor" :head="filter" :search_args=\'search_args\' > </component>\n                     </div>\n                </div>\n            </com-auto-more>\n\n                <button name="go" type="button" class="btn btn-success btn-sm" @click=\'m_submit()\' >\n                  <i class="fa fa-search"></i>\n                  <span v-text="search_lable"></span>\n                </button>\n        </div>\n    ',
    created: function created() {
        var self = this;
        ex.each(self.heads, function (filter) {
            if (ex.isin(filter.type, ['month', 'date'])) {
                if (!self.search['_start_' + filter.name]) {
                    Vue.set(self.search, '_start_' + filter.name, '');
                }
                if (!self.search['_end_' + filter.name]) {
                    Vue.set(self.search, '_end_' + filter.name, '');
                }
            }
        });
    },
    computed: {
        search_lable: function search_lable() {
            return cfg.tr.search;
        }
    },
    methods: {
        m_submit: function m_submit() {
            this.$emit('submit');
        },
        orderBy: function orderBy(array, key) {
            return array.slice().sort(function (a, b) {
                if (isChinese(a[key]) && isChinese(b[key])) {
                    return a[key].localeCompare(b[key], 'zh');
                } else {
                    return compare(a[key], b[key]);
                }
            });
        }
    }
});

var sim_filter_with_search = {
    props: ['filter', 'value'],
    data: function data() {
        return {
            myvalue: this.value
        };
    },
    mounted: function mounted() {
        var self = this;
        ex.load_js("/static/lib/bootstrap-select.min.js", function () {
            $(self.$el).selectpicker();
        });
        ex.load_css("/static/lib/bootstrap-select.min.css");
    },
    watch: {
        myvalue: function myvalue(v) {
            this.$emit('input', v);
        }
    },
    methods: {
        orderBy: function orderBy(array, key) {
            return array.slice().sort(function (a, b) {
                if (isChinese(a[key]) && isChinese(b[key])) {
                    return a[key].localeCompare(b[key], 'zh');
                } else {
                    return compare(a[key], b[key]);
                }
            });
        }
    },
    template: '<select class="selectpicker form-control"  data-live-search="true" v-model=\'myvalue\'>\n        <option :value="undefined" v-text=\'filter.label\'></option>\n        <option value="">-------</option>\n        <option v-for=\'option in orderBy( filter.options,"label")\' :value="option.value"\n           :data-tokens="option.label" v-text=\'option.label\'>\n        </option>\n        </select>\n    '
};
Vue.component('sel-search-filter', sim_filter_with_search);

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var table_fun = exports.table_fun = {
    data: function data() {

        if (table_fun_config.detail_link) {
            heads.push({ name: '_detail_link', label: '' });
        }

        return {
            heads: heads,
            rows: rows,
            row_filters: row_filters,
            row_sort: row_sort,
            row_pages: row_pages,
            search_tip: search_tip,
            selected: [],
            del_info: [],
            menu: menu,

            can_add: can_add,
            can_del: can_del,
            can_edit: can_edit,

            search_args: ex.parseSearch(),
            ex: ex,
            help_url: help_url,
            page_label: page_label
        };
    },
    watch: {
        'row_sort.sort_str': function row_sortSort_str(v) {
            this.search_args._sort = v;
            this.search();
        }
    },
    methods: {
        goto: function goto(url) {
            location = url;
        },
        search: function search() {
            location = ex.appendSearch(this.search_args);
            //location =ex.template('{path}{search}',{path:location.pathname,
            //    search: encodeURI(ex.searchfy(this.search_args,'?')) })
        },
        //rt_win:function(row){
        //    ln.rtWin(row)
        //},
        filter_minus: function filter_minus(array) {
            // 移到 com-table 中去了
            return ex.map(array, function (v) {
                if (v.startsWith('-')) {
                    return v.slice(1);
                } else {
                    return v;
                }
            });
        },
        is_sorted: function is_sorted(sort_str, name) {
            // 该函数被移到 com-table 中去了。
            var ls = sort_str.split(',');
            var norm_ls = this.filter_minus(ls);
            return ex.isin(name, norm_ls);
        },
        // 移到sort_mark
        toggle: function toggle(sort_str, name) {
            var ls = ex.split(sort_str, ',');
            var norm_ls = this.filter_minus(ls);
            var idx = norm_ls.indexOf(name);
            if (idx != -1) {
                ls[idx] = ls[idx].startsWith('-') ? name : '-' + name;
            } else {
                ls.push(name);
            }
            return ls.join(',');
        },
        //remove_sort:function (sort_str,name) {
        // 移到sort_mark.js 去了
        //    var ls=ex.split(sort_str,',')
        //    ls=ex.filter(ls,function (v) {
        //        return v!='-'+name && v!=name
        //    })
        //    return ls.join(',')
        //},
        map: function map(name, row) {
            if (name == this.heads[0].name && !table_fun_config.detail_link) {
                return ex.template('<a href="{edit}?pk={pk}&next={next}">{text}</a>', {
                    text: row[name],
                    edit: page_name + '.edit',
                    pk: row.pk,
                    next: encodeURIComponent(ex.appendSearch(location.pathname, search_args))
                });
            }
            if (name == '_detail_link') {
                return ex.template('<a href="{edit}?pk={pk}&next={next}">{text}</a>', {
                    text: table_fun_config.detail_link,
                    edit: page_name + '.edit',
                    pk: row.pk,
                    next: encodeURIComponent(ex.appendSearch(location.pathname, search_args))
                });
            }
            if (row[name] === true) {
                return '<img src="//res.enjoyst.com/true.png" width="15px" />';
            } else if (row[name] === false) {
                return '<img src="//res.enjoyst.com/false.png" width="15px" />';
            } else {
                return row[name];
            }
        },
        form_link: function form_link(name, row) {
            return ex.template('<a href="{edit}?pk={pk}&next={next}">{value}</a>', { edit: page_name + '.edit',
                pk: row.pk,
                next: encodeURIComponent(location.href),
                value: row[name]
            });
        },

        del_item: function del_item() {
            if (this.selected.length == 0) {
                return;
            }
            var del_obj = {};
            for (var j = 0; j < this.selected.length; j++) {
                var pk = this.selected[j].pk;
                for (var i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].pk.toString() == pk) {
                        if (!del_obj[this.rows[i]._director_name]) {
                            del_obj[this.rows[i]._director_name] = [];
                        }
                        del_obj[this.rows[i]._director_name].push(pk);
                    }
                }
            }
            var out_str = '';
            for (var key in del_obj) {
                out_str += key + ':' + del_obj[key].join(':') + ',';
            }
            location = ex.template("{engine_url}/del_rows?rows={rows}&next={next}", { engine_url: engine_url,
                rows: encodeURI(out_str),
                next: encodeURIComponent(location.href) });
        },
        goto_page: function goto_page(page) {
            this.search_args._page = page;
            this.search();
        },
        add_new: function add_new() {
            var url = ex.template('{engine_url}/{page}.edit/?next={next}', {
                engine_url: engine_url,
                page: page_name,
                next: encodeURIComponent(ex.appendSearch(location.pathname, search_args))
            });
            location = url;
        }
    }

};

window.table_fun = table_fun;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(115);

Vue.component('com-auto-more', {
    props: ['orgHeight'],
    data: function data() {
        return {
            expanded: false
        };
    }, //onmousewheel="return false;"
    template: '<div class="com-auto-more" :style="{height:orgHeight}">\n        <div class="outer-wrap" :style="{height:orgHeight}">\n            <div class="inn-wrap">\n                <slot></slot>\n            </div>\n        </div>\n\n        <div class="toggle-btn clickable" @click="toggle()">\n            <span v-if="expanded">\u6536\u8D77</span>\n            <span v-else>\u66F4\u591A</span>\n        </div>\n    </div>',
    mounted: function mounted() {
        var self = this;
        setTimeout(function () {
            if ($(self.$el).find('.inn-wrap').height() > $(self.$el).height() + 10) {
                // 10是为了去噪
                $(self.$el).addClass('has-overflow');
            }
        }, 100);
    },
    methods: {
        on_scroll: function on_scroll() {
            return false;
        },
        toggle: function toggle() {
            if (this.expanded) {
                $(this.$el).find('.outer-wrap').css('height', this.orgHeight);
                $(this.$el).removeClass('expanded');
            } else {
                $(this.$el).find('.outer-wrap').css('height', $(this.$el).find('.inn-wrap').height() + 2 + 'px');
                $(this.$el).addClass('expanded');
            }
            this.expanded = !this.expanded;
        }
    }
});

/***/ }),
/* 67 */,
/* 68 */,
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/*\r\nclass的用法：\r\n================\r\nfield-panel  用于nice validator 捕捉\r\n\r\nsuit 模仿django-suit的样式，例如有线条\r\nplain 普通模式，没有线条\r\n\r\nmsg-bottom  nice validator的位置在下面，默认在右侧\r\n\r\n*/\n.error {\n  color: red; }\n\n.field_input {\n  position: relative; }\n\n.field-panel.no-label label {\n  display: none; }\n\n.field-panel.suit {\n  background-color: #F5F5F5;\n  margin: auto;\n  padding: 20px 30px;\n  position: relative;\n  border: 1px solid #D9D9D9; }\n  .field-panel.suit:after {\n    content: '';\n    display: block;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    width: 190px;\n    border-radius: 6px;\n    background-color: #fff;\n    z-index: 0; }\n  .field-panel.suit .form-group.field {\n    display: flex;\n    align-items: stretch;\n    margin-bottom: 0; }\n    .field-panel.suit .form-group.field .label-content {\n      word-break: break-all; }\n    .field-panel.suit .form-group.field .field_input {\n      flex-grow: 0;\n      align-self: center;\n      padding: 5px 20px;\n      /*.ckeditor{*/\n      /*padding: 20px;*/\n      /*}*/ }\n      .field-panel.suit .form-group.field .field_input input {\n        /*max-width:25em;*/ }\n      .field-panel.suit .form-group.field .field_input .multi-chosen {\n        width: 30em; }\n    .field-panel.suit .form-group.field:first-child .control-label {\n      border-top: 5px solid #FFF; }\n    .field-panel.suit .form-group.field .control-label {\n      width: 160px;\n      text-align: right;\n      padding: 5px 30px;\n      z-index: 100;\n      flex-shrink: 0;\n      border-top: 1px solid #EEE;\n      padding-top: 10px; }\n\n.field-panel.plain {\n  background-color: white;\n  margin: auto;\n  padding: 20px 30px;\n  position: relative; }\n  .field-panel.plain .form-group.field {\n    display: flex;\n    align-items: flex-start;\n    margin-bottom: 10px; }\n  .field-panel.plain .field_input {\n    flex-grow: 0;\n    padding: 5px 10px;\n    width: 20em; }\n  .field-panel.plain .control-label {\n    min-width: 8em;\n    text-align: right;\n    padding: 5px 10px;\n    padding-top: 8px;\n    flex-shrink: 0;\n    font-weight: 400; }\n\n.field-panel .msg-box.n-right {\n  position: absolute;\n  left: 100%;\n  transform: translateX(40px); }\n\n.field-panel.msg-bottom .msg-box.n-right {\n  position: absolute;\n  left: 3px;\n  bottom: 0;\n  transform: translateX(0); }\n\n.field_input {\n  position: relative; }\n\n._tow-col-sel select {\n  min-height: 7em; }\n\nimg.img-uploador {\n  max-width: 100px;\n  max-height: 100px; }\n\n.req_star {\n  color: red;\n  position: absolute; }\n", ""]);

// exports


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".img-uploader input {\n  display: none !important; }\n\n.img-uploader.disable {\n  background-color: #e3e2e1; }\n\n.up_wrap {\n  position: relative;\n  text-align: center;\n  border: 2px dashed #ccc;\n  background: #FDFDFD;\n  width: 200px; }\n\n.closeDiv {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-color: #ffffff; }\n\n.choose {\n  display: inline-block;\n  text-decoration: none;\n  padding: 5px;\n  border: 1px solid #0092F2;\n  border-radius: 4px;\n  font-size: 14px;\n  color: #0092F2;\n  cursor: pointer; }\n\n.choose:hover, .choose:active {\n  text-decoration: none;\n  color: #0092F2; }\n\n.close {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #242424; }\n\n.logoImg {\n  max-height: 100% !important;\n  max-width: 100% !important;\n  /*margin-top: 5px;*/\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%); }\n\n.img-crop .total-wrap {\n  padding: 30px; }\n\n.img-crop .crop-wrap {\n  max-width: 100%;\n  max-height: 90%;\n  overflow: hidden; }\n\n.img-crop .crop-img {\n  max-width: 100%;\n  max-height: 100%; }\n", ""]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n#_load_frame_wrap {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: none;\n  z-index: 1000;\n  background: rgba(88, 88, 88, 0.2); }\n\n#_load_frame {\n  width: 100%;\n  height: 100%;\n  border-top: 1px solid #b6b6b6; }\n\n.imiddle {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n  /* IE 9 */\n  -moz-transform: translate(-50%, -50%);\n  /* Firefox */\n  -webkit-transform: translate(-50%, -50%);\n  /* Safari 和 Chrome */\n  -o-transform: translate(-50%, -50%);\n  text-align: center;\n  /*display: table;*/\n  z-index: 10000; }\n\n.popframe {\n  max-width: 90vw;\n  max-height: 90vh;\n  min-width: 40em;\n  min-height: 30em;\n  border: 2px solid #8e8e8e;\n  -moz-box-shadow: 2px 2px 20px #d0d0d0;\n  -webkit-box-shadow: 2px 2px 20px #b7b698;\n  box-shadow: 2px 2px 20px #828282;\n  border-radius: 1em;\n  padding-top: 3em;\n  background-color: white; }\n  .popframe .close-btn {\n    position: absolute;\n    right: 0.5em;\n    top: 0.4em;\n    cursor: pointer; }\n  .popframe .title {\n    position: absolute;\n    top: 0.5em;\n    left: 50%;\n    transform: translate(-50%, 0); }\n", ""]);

// exports


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table-fields {\n  /*.field-input{*/\n  /*margin-bottom: 1em;*/\n  /*position: relative;*/\n  /*}*/ }\n  .table-fields td.field-label {\n    padding-bottom: 1em;\n    padding-right: 1em;\n    text-align: right; }\n  .table-fields .help-text {\n    position: absolute;\n    right: -1.2em;\n    top: -0.2em; }\n", ""]);

// exports


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".field_input textarea {\n  width: 400px;\n  height: 100px; }\n", ""]);

// exports


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field {\n  max-width: 30em; }\n", ""]);

// exports


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-date {\n  max-width: 20em; }\n", ""]);

// exports


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".chosen-container-single a.chosen-single {\n  height: 30px;\n  line-height: 28px;\n  border: 1px solid #d2d6de;\n  border-radius: 0; }\n", ""]);

// exports


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".select2-container--open {\n  z-index: 99999999; }\n", ""]);

// exports


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".file-uploader .item img {\n  max-width: 300px;\n  cursor: pointer; }\n\n.file-uploader .wrap {\n  display: inline-block; }\n\n.file-uploader .sortable {\n  display: flex;\n  flex-wrap: wrap; }\n  .file-uploader .sortable li {\n    display: block;\n    margin: 0.5em;\n    padding: 0.3em;\n    position: relative; }\n    .file-uploader .sortable li:hover .remove-btn {\n      visibility: visible; }\n    .file-uploader .sortable li .file-wrap {\n      width: 10em;\n      height: 12em;\n      border: 2em solid #68abff;\n      text-align: center;\n      padding: 1em 0;\n      background-color: white;\n      box-shadow: 10px 10px 5px #888888;\n      color: #68abff;\n      display: table-cell;\n      vertical-align: middle;\n      cursor: pointer; }\n      .file-uploader .sortable li .file-wrap .file-type {\n        font-size: 250%;\n        font-weight: 700;\n        text-transform: uppercase; }\n\n.file-uploader .remove-btn {\n  font-size: 2em;\n  position: absolute;\n  top: -1em;\n  right: 0.3em;\n  visibility: hidden; }\n  .file-uploader .remove-btn i {\n    color: red; }\n\n.file-uploader-btn-plus {\n  display: inline-block;\n  vertical-align: top; }\n  .file-uploader-btn-plus .inn-btn {\n    width: 5em;\n    height: 5em;\n    display: table-cell;\n    text-align: center;\n    vertical-align: middle;\n    border: 1px solid #e1e1e1;\n    cursor: pointer; }\n    .file-uploader-btn-plus .inn-btn span {\n      font-size: 300%; }\n    .file-uploader-btn-plus .inn-btn:hover {\n      background-color: #e1e1e1; }\n", ""]);

// exports


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "div.chosen-drop > ul.chosen-results > li.result-selected {\n  display: none; }\n\n.chosen-container-multi {\n  width: 420px; }\n", ""]);

// exports


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".head-item {\n  display: inline-block; }\n  .head-item.brand {\n    font-size: 150%;\n    width: 10em;\n    padding: 0.3em 1em; }\n\n#menu ._expand_menu {\n  margin-top: 1em; }\n  #menu ._expand_menu > ul > li {\n    margin-bottom: 0.2em; }\n", ""]);

// exports


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".scss-comment {\n  content: 'director/scss/tab_group.scss'; }\n\n.nav.tabs {\n  align-items: center; }\n  .nav.tabs li {\n    display: inline-block;\n    margin-left: 5px;\n    vertical-align: bottom; }\n    .nav.tabs li:first-child {\n      margin-left: 15px; }\n    .nav.tabs li > a {\n      padding: 8px 18px 5px 18px;\n      background-color: #f6f7f8;\n      border: 1px solid #dddddd;\n      border-bottom: none;\n      position: relative;\n      margin-bottom: 1px;\n      font-weight: 400; }\n      .nav.tabs li > a:hover {\n        text-underline: blue;\n        text-decoration: underline; }\n  .nav.tabs li.active > a:after {\n    content: ' ';\n    position: absolute;\n    width: 100%;\n    height: 4px;\n    bottom: -4px;\n    left: 0;\n    background-color: #eee; }\n  .nav.tabs li.active a {\n    text-decoration: none;\n    background-color: #eeeeee;\n    font-weight: 500; }\n  .nav.tabs li.active a:hover {\n    border-bottom: none;\n    text-decoration: none;\n    color: #a2a2a2;\n    font-weight: 500;\n    background-color: #eeeeee; }\n", ""]);

// exports


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "[v-cloak] {\n  display: none; }\n", ""]);

// exports


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-date-range-filter {\n  width: 30rem;\n  position: relative; }\n  .com-date-range-filter .com-date {\n    width: 14rem; }\n", ""]);

// exports


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".search-select {\n  width: 200px; }\n  .search-select .el-input-group__append {\n    padding-left: 1px;\n    padding-right: 4px; }\n  .search-select .input-with-select input {\n    height: 30px; }\n\n.el-dropdown-menu .active-search-item {\n  color: blue; }\n", ""]);

// exports


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-filter-select {\n  max-width: 25em; }\n", ""]);

// exports


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "table.fake-suit {\n  border: 1px solid #DDD;\n  border-radius: 6px; }\n  table.fake-suit th {\n    font-weight: bold;\n    background-color: #e5e5e5;\n    background-image: linear-gradient(to bottom, #f3f3f3, #e5e5e5); }\n  table.fake-suit td {\n    border-left: 1px solid #F5F5F5; }\n  table.fake-suit tr > td:first-child {\n    border-left: none; }\n  table.fake-suit tbody tr {\n    background-color: white; }\n  table.fake-suit tbody td {\n    border-top: 1px solid #E7E7E7;\n    padding-top: 3px;\n    padding-bottom: 3px; }\n  table.fake-suit tbody tr:nth-child(even) {\n    background-color: #FAFAFA; }\n  table.fake-suit tbody tr:hover {\n    background-color: #F5F5F5; }\n\n.paginator input {\n  width: 20px; }\n\n.paginator .page-input-block {\n  display: inline-block; }\n\n.paginator button {\n  vertical-align: top; }\n\n.sort-mark img {\n  width: 10px; }\n\nul.pagination li {\n  display: inline;\n  cursor: pointer; }\n\nul.pagination li span {\n  color: black;\n  float: left;\n  padding: 4px 10px;\n  text-decoration: none;\n  border: 1px solid #ddd; }\n\nul.pagination li span.active {\n  background-color: #4CAF50;\n  color: white; }\n\nul.pagination li span:hover:not(.active) {\n  background-color: #ddd; }\n\n.sortmark {\n  color: #d9d9de; }\n  .sortmark.sort-col {\n    color: black; }\n", ""]);

// exports


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table-btn-group {\n  min-width: 9em; }\n", ""]);

// exports


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".filter-item {\n  margin: auto 0.3em; }\n\n.row-filter .bootstrap-select {\n  min-width: 10em; }\n", ""]);

// exports


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-auto-more {\n  position: relative;\n  flex-shrink: 0;\n  flex-grow: 10; }\n  .com-auto-more .outer-wrap {\n    padding: 0.2rem;\n    transition: height .3s;\n    z-index: 100;\n    position: absolute;\n    overflow: hidden;\n    width: 100%;\n    background-color: white; }\n  .com-auto-more .inn-wrap {\n    width: 100%;\n    background-color: white;\n    padding: 0 3rem 1rem 1rem; }\n  .com-auto-more .toggle-btn {\n    display: none;\n    position: absolute;\n    z-index: 101; }\n  .com-auto-more.has-overflow .toggle-btn {\n    display: block;\n    position: absolute;\n    right: 1rem;\n    top: 0.7rem; }\n  .com-auto-more.expanded .outer-wrap {\n    border-top: 1px solid #f2f2f2;\n    box-shadow: 0px 2px 4px #9c9c9c;\n    -moz-box-shadow: 0px 2px 4px #9c9c9c;\n    -webkit-box-shadow: 0px 2px 4px #9c9c9c; }\n", ""]);

// exports


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n.no-scroll-bar {\n  -ms-overflow-style: none;\n  overflow: -moz-scrollbars-none; }\n  .no-scroll-bar::-webkit-scrollbar {\n    width: 0;\n    /* 滚动条宽度为0 */\n    height: 0;\n    /* 滚动条高度为0 */\n    display: none;\n    /* 滚动条隐藏 */ }\n", ""]);

// exports


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".fade-enter-active, .fade-leave-active {\n  transition: opacity .5s; }\n\n.fade-enter, .fade-leave-to {\n  opacity: 0; }\n", ""]);

// exports


/***/ }),
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */
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
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./link.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./link.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(72);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_fields.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(73);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./blocktext.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./blocktext.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(74);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(75);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field_date.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field_date.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(76);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field_single_chosen.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field_single_chosen.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(77);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field_single_select2.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./field_single_select2.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(79);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./multi_chosen.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./multi_chosen.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(83);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./com_date_range_filter.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./com_date_range_filter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(84);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./com_search_select.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./com_search_select.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(85);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./filter_select.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./filter_select.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(86);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(87);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_btn_group.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_btn_group.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(88);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_filter.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_filter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(89);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./auto_more.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./auto_more.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(90);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./scroll_bar.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./scroll_bar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./vue_animation.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./vue_animation.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(5);

var inputs = _interopRequireWildcard(_main);

var _main2 = __webpack_require__(6);

var table = _interopRequireWildcard(_main2);

var _main3 = __webpack_require__(4);

var fields = _interopRequireWildcard(_main3);

var _main4 = __webpack_require__(7);

var uis_main = _interopRequireWildcard(_main4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(23);
__webpack_require__(22);
__webpack_require__(24);

/***/ })
/******/ ]);