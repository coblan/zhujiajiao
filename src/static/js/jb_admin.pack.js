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
/******/ 	return __webpack_require__(__webpack_require__.s = 145);
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
__webpack_require__(8);

var com_sim_fields = exports.com_sim_fields = {
    props: {
        heads: '',
        row: '',
        okBtn: {
            default: function _default() {
                return '确定';
            }
        },
        crossBtn: '',
        autoWidth: {
            default: function _default() {
                return true;
            }
        },
        btnCls: {
            default: function _default() {
                return 'btn-primary btn-sm';
            }
        }
    },
    data: function data() {
        return {
            env: cfg.env,
            small: false
            //small_srn:ex.is_small_screen(),
        };
    },
    mounted: function mounted() {
        // 由于与nicevalidator 有冲突，所以等渲染完成，再检测
        var self = this;

        //setTimeout(function(){
        //    console.log('sss')
        //    self.update_small()
        //},5000)
    },
    watch: {
        //'evn.width':function (){
        //    var self=this
        //if($(self.$el).width() <450 ){
        //    self.small=true
        //}else{
        //    self.small=false
        //}
        //self.update_nice()
        //}
    },
    computed: {
        small_srn: function small_srn() {
            return this.env.width < 760;
        },
        normed_heads: function normed_heads() {
            return this.heads;
        },
        label_width: function label_width() {
            if (!this.autoWith) {}
            var max = 4;
            ex.each(this.heads, function (head) {
                if (max < head.label.length) {
                    max = head.label.length;
                }
            });
            max += 1;
            return { width: max + 'em' };
        }
    },
    //created:function(){
    //    if(!this.okBtn){
    //        this.okBtn='确定'
    //    }
    //},
    components: window._baseInput,
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div :class="[\'field-panel sim-fields\',{\'msg-bottom\':small_srn}]"\n    style="text-align:center;">\n           <table class="table-fields">\n        <tr v-for="head in heads">\n            <td class="field-label-td"  valign="top" >\n            <div class="field-label" :style="label_width">\n                <span class="label-content">\n                     <span v-text="head.label"></span>\n                     <span class="req_star" v-if=\'head.required\'>*</span>\n                </span>\n\n\n            </div>\n\n            </td>\n            <td class="field-input-td" >\n                <div class="field-input">\n                    <component v-if="head.editor" :is="head.editor"\n                         @field-event="$emit(\'field-event\',$event)"\n                         :head="head" :row="row"></component>\n\n                </div>\n            </td>\n            <td>\n                <span v-if="head.help_text" class="help-text clickable">\n                            <i style="color: #3780af;position: relative;top:10px;"   @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n                </span>\n            </td>\n        </tr>\n        <slot :row="row">\n            <!--\u6309\u94AE\u6A2A\u8DE8\u4E24\u5217 \uFF01\u5C0F\u5C3A\u5BF8\u65F6 \u5F3A\u5236 -->\n             <tr v-if="crossBtn || small_srn" class="btn-row">\n                <td class="field-input-td" colspan="3">\n                    <div class="submit-block">\n                        <button @click="panel_submit" type="btn"\n                            :class="[\'form-control btn\',btnCls]"><span v-text="okBtn"></span></button>\n                    </div>\n                </td>\n            </tr>\n            <!--\u6309\u94AE\u5728\u7B2C\u4E8C\u5217-->\n               <tr v-else class="btn-row">\n                   <td class="field-label-td"></td>\n                    <td class="field-input-td" colspan="1">\n                        <div class="submit-block">\n                            <button @click="panel_submit" type="btn"\n                                :class="[\'btn\',btnCls]"><span v-text="okBtn"></span></button>\n                        </div>\n                     </td>\n                     <td></td>\n               </tr>\n        </slot>\n\n    </table>\n\n\n        </div>',
    methods: {
        update_small: function update_small() {
            var self = this;
            if ($(self.$el).width() < 450) {
                self.small = true;
            } else {
                self.small = false;
            }

            setTimeout(function () {
                self.update_nice();
            }, 100);
        },
        panel_submit: function panel_submit() {
            if (this.$listeners && this.$listeners.submit) {
                if (this.isValid()) {
                    this.$emit('submit', this.row);
                }
            } else {
                this.submit();
            }
        },
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        },
        after_save: function after_save(row) {
            this.$emit('after-save', row);
        }

    }
};

window.com_sim_fields = com_sim_fields;

Vue.component('com-sim-fields', com_sim_fields);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
* head={
*   inn_editor: com-table-mapper  //【可选】 传入一个 table_editor ，除了具备该editor的显示方式外，还具备点击功能
*   get_row:{
*       fun:'get_table_row',
*   },
*   fields_ctx={},
*   after_save:{
*       fun:'update_or_insert'
*   }
* }
*
* */

var pop_fields = exports.pop_fields = {
    template: '<span @click="edit_me()" class="clickable">\n        <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n        <span v-else v-text="show_text"  ></span>\n    </span>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        this.parStore = ex.vueParStore(this);
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            if (this.head.show_label) {
                return show_label[this.head.show_label.fun](this.rowData, this.head.show_label);
            } else {
                return this.rowData[this.field];
            }
        }
    },
    methods: {
        edit_me: function edit_me() {
            this.open_layer();
        },
        open_layer: function open_layer() {
            var self = this;

            var fun = get_row[this.head.get_row.fun];
            if (this.head.get_row.kws) {
                //  这个是兼顾老的调用，新的调用，参数直接写在get_row里面，与fun平级
                var kws = this.head.get_row.kws;
            } else {
                var kws = this.head.get_row;
            }
            kws.director_name = this.head.fields_ctx.director_name;

            fun(function (pop_row) {
                //pop_fields_layer(pop_row,self.head.fields_heads,ops,self.head.extra_mixins,function(kws){
                var win_index = pop_fields_layer(pop_row, self.head.fields_ctx, function (new_row) {

                    var fun = after_save[self.head.after_save.fun];
                    fun(self, new_row, pop_row);

                    layer.close(win_index);
                });
            }, this.rowData, kws);
        }

    }
};
Vue.component('com-table-pop-fields', pop_fields);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }
};

var get_row = {
    use_table_row: function use_table_row(callback, row, kws) {
        callback(row);
    },
    get_table_row: function get_table_row(callback, row, kws) {
        var cache_row = ex.copy(row);
        callback(cache_row);
    },
    get_with_relat_field: function get_with_relat_field(callback, row, kws) {
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;

        var dc = { fun: 'get_row', director_name: director_name };
        dc[relat_field] = row[relat_field];
        var post_data = [dc];
        cfg.show_load();
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    }
};

var after_save = {
    do_nothing: function do_nothing(self, new_row, old_row, table) {},
    update_or_insert: function update_or_insert(self, new_row, old_row) {
        //self.$emit('on-custom-comp',{name:'update_or_insert',new_row:new_row,old_row:old_row})
        self.parStore.update_or_insert(new_row, old_row);
        //var par_name=ex.vuexParName(self)
        //if(par_name){
        //self.parStore.$emit('row.update_or_insert',{new_row:new_row,old_row:old_row})
        //}
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.suit_fields = undefined;

var _sim_fields = __webpack_require__(2);

var suit_fields = exports.suit_fields = {
    props: ['row', 'heads', 'ops'],
    mixins: [_sim_fields.com_sim_fields],

    template: '<div class="flex-v" style="margin: 0;height: 100%;">\n    <div class = "flex-grow" style="overflow: auto;margin: 0;">\n        <div class="field-panel suit" >\n            <field  v-for="head in normed_heads" :key="head.name" :head="head" :row="row"></field>\n        </div>\n      <div style="height: 1em;">\n      </div>\n    </div>\n    <slot>\n         <div style="text-align: right;padding: 8px 3em;">\n         <button @click="submit" type="btn"\n                            :class="[\'btn\',btnCls]"><span v-text="okBtn">\u4FDD\u5B58</span></button>\n        <!--<component v-for="op in ops" :is="op.editor" @operation="on_operation(op)" :head="op"></component>-->\n        </div>\n    </slot>\n\n     </div>'

};

Vue.component('com-suit-fields', suit_fields);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(9);

var com_fields_panel = exports.com_fields_panel = {
    props: ['ctx'],
    data: function data() {
        return {
            row: this.ctx.row || {},
            heads: this.ctx.heads,
            ops: this.ctx.ops,
            fields_editor: this.ctx.fields_editor || cfg.fields_editor || com_sim_fields,
            small: false,
            small_srn: ex.is_small_screen(),
            cssCls: '',
            crossBtn: this.ctx.crossBtn || '',
            okBtn: this.ctx.okBtn || '确定'
        };
    },
    mounted: function mounted() {
        if ($(this.$el).width() < 600) {
            this.small = true;
        } else {
            this.small = false;
        }
    },
    methods: {
        on_finish: function on_finish(e) {
            this.$emit('finish', e);
        }
    },
    template: '<div :class="[\'flex-v com-fields-panel\',cssCls,{\'small_srn\':small_srn}]">\n     <component class="msg-bottom" :is="fields_editor" :heads="heads" :row="row" :ok-btn="okBtn"\n       :cross-btn="crossBtn" @finish="on_finish($event)"></component>\n     </div>'
};
window.com_fields_panel = com_fields_panel;
Vue.component('com-fields-panel', com_fields_panel);
Vue.component('com-panel-fields', com_fields_panel);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var mix_editor = exports.mix_editor = {
    data: function data() {
        return {
            org_value: this.rowData[this.field]
        };
    },
    computed: {
        is_dirty: function is_dirty() {
            return this.rowData[this.field] != this.org_value;
        }
    },
    watch: {
        'rowData._hash': function rowData_hash() {
            this.org_value = this.rowData[this.field];
        }
    },
    methods: {
        on_changed: function on_changed() {
            var value = this.rowData[this.field];
            if (value == this.org_value) {
                this.$emit('on-custom-comp', { name: 'row_changed_undo_act', row: this.rowData });
            } else {
                this.$emit('on-custom-comp', { name: 'row_changed', row: this.rowData });
            }
        }
    }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(106);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ele_tree_name_layer.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ele_tree_name_layer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(109);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sim_fields.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sim_fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(114);
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


ex.assign(cfg, {
    fields_editor: 'com-suit-fields',
    fields_local_editor: 'com-suit-fields-local'
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var china_address_logic = {
    props: ['row', 'head'],
    template: '<div class="com-field-china-address">\n            <el-cascader\n              :options="options"\n              v-model="row[head.name]"></el-cascader>\n               </div>',
    mounted: function mounted() {},
    data: function data() {
        return {
            options: china_address
        };
    }
};

Vue.component('com-field-china-address', function (resolve, reject) {
    ex.load_js('/static/lib/china_address.js', function () {
        resolve(china_address_logic);
    });
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lay_datetime = {
    props: ['row', 'head'],
    template: '<div><span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n                    <input type="text" :id="\'id_\'+head.name" v-model="row[head.name]"  :placeholder="head.placeholder">\n            \t\t\t<!--<datetime  v-model="row[head.name]" :id="\'id_\'+head.name"-->\n                        \t<!--:placeholder="head.placeholder"></datetime>-->\n               </div>',
    mounted: function mounted() {
        laydate.render({
            elem: $(this.$el).find('input')[0], //指定元素
            type: 'datetime'
        });
    }
};

Vue.component('com-field-datetime', function (resolve, reject) {
    ex.load_js('/static/lib/laydate/laydate.js', function () {
        resolve(lay_datetime);
    });
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_transfer = {
    props: ['row', 'head'],
    template: '<div>\n     <el-transfer v-model="value1" :data="trans_data"></el-transfer>\n     </div>',
    data: function data() {
        return {
            value1: []
        };
    },
    computed: {
        trans_data: function trans_data() {
            return [{ key: 'xx', label: 'bbbb' }];
        }
    }
};
Vue.component('com-field-ele-transfer', ele_transfer);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(7);
var label_shower = {
    props: ['row', 'head'],
    methods: {
        handleCheckChange: function handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
            var ls = this.$refs.et.getCheckedKeys();
            ls = ex.filter(ls, function (itm) {
                return itm != undefined;
            });
            this.row[this.head.name] = ls;
        },
        handleNodeClick: function handleNodeClick(data) {
            console.log(data);
        }
    },
    data: function data() {
        return {
            selected: [1, 2],
            // demon 数据
            data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1',
                        pk: 1
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1',
                        pk: 3
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1',
                        pk: 2
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    template: '<div class="com-field-ele-tree-name-layer">\n        <el-tree ref="et" :data="head.options" :props="defaultProps"\n             @node-click="handleNodeClick"\n             show-checkbox\n             @check-change="handleCheckChange"\n\n             :default-checked-keys="row[head.name]"\n             node-key="value"\n    ></el-tree>\n    </div>',
    //default-expand-all
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-ele-tree', label_shower);
//Vue.component('com-field-ele-tree-name-layer',function(resolve,reject){
//ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//resolve(label_shower)
//})
//})

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(7);
var label_shower = {
    props: ['row', 'head'],

    methods: {
        check_depend: function check_depend(node) {
            var self = this;
            if (node.depend_list) {
                ex.each(node.depend_list, function (dep_node) {
                    self.$refs.et.setChecked(dep_node.value, true);
                    self.check_depend(dep_node);
                });
            }
        },
        walk_check_depend: function walk_check_depend(node) {
            var self = this;
            if (!node.children) {
                this.check_depend(node);
            } else {
                ex.each(node.children, function (item) {
                    self.walk_check_depend(item);
                });
            }
        },
        uncheck_depended: function uncheck_depended(node) {
            var self = this;
            if (node.depended_list) {
                ex.each(node.depended_list, function (dep_node) {
                    self.$refs.et.setChecked(dep_node.value, false);
                    self.uncheck_depended(dep_node);
                });
            }
        },
        walk_uncheck_depended: function walk_uncheck_depended(node) {
            var self = this;
            if (!node.children) {
                this.uncheck_depended(node);
            } else {
                ex.each(node.children, function (item) {
                    self.walk_uncheck_depended(item);
                });
            }
        },
        handleCheckChange: function handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        handleNodeClick: function handleNodeClick(data) {

            //this.last_click=data
            //console.log(data);
        },

        handleCheck: function handleCheck(data, e) {
            console.log(data);
            var self = this;
            if (!data.children) {
                var check = ex.isin(data, e.checkedNodes);
                if (check) {
                    self.check_depend(data);
                } else {
                    self.uncheck_depended(data);
                }
            } else {
                var check = ex.isin(data, e.checkedNodes) || ex.isin(data, e.halfCheckedNodes);
                if (check) {
                    self.walk_check_depend(data);
                } else {
                    self.walk_uncheck_depended(data);
                }
            }

            var ls = this.$refs.et.getCheckedKeys();
            ls = ex.filter(ls, function (itm) {
                return itm != undefined;
            });
            this.row[this.head.name] = ls;

            //var self=this
            //if(ex.isin(data,e.halfCheckedNodes)){
            //
            //    if(data.children){
            //
            //        var grand_childrens=[]
            //        ex.walk(data.children,function(opt){
            //            grand_childrens.push(opt)
            //        })
            //
            //        //self.update_checked(data)
            //        ex.walk(data.children,function(opt){
            //            self.update_checked(opt,grand_childrens)
            //        })
            //    }
            //}
            //
            //
            //var ls =this.$refs.et.getCheckedKeys()
            //
            //ls =ex.filter(ls,function(itm){
            //    return itm!=undefined
            //})
            //
            //var org_ls = self.row[self.head.name]
            //
            //var added_item = ex.filter(ls,function(item){
            //    return ! ex.isin(item,org_ls)
            //})
            //
            //ex.each(added_item,function(value){
            //    if(self.depend[value]){
            //        ex.each(self.depend[value],function(opt){
            //            ex.remove(opt.depend,value)
            //        })
            //    }
            //})
            //
            //var subtract_item = ex.filter(org_ls,function(item){
            //    return ! ex.isin(item,ls)
            //})
            //ex.each(subtract_item,function(value){
            //    if(self.depend[value]){
            //        ex.each(self.depend[value],function(opt){
            //            if(!ex.isin(value,opt.depend)){
            //                opt.depend.push(value)
            //            }
            //        })
            //    }
            //})
            //var final_list = ex.filter(ls,function(value){
            //    for(var i=0;i<self.has_depend_list.length;i++){
            //        var depend_opt = self.has_depend_list[i]
            //        if(depend_opt.value==value && depend_opt.depend.length>0){
            //            return false
            //        }
            //    }
            //    return true
            //})
            //
            //
            //this.update_disable()
            //self.$refs.et.setCheckedKeys(final_list)
            //self.row[self.head.name] = final_list
        }
        //update_disable:function(){
        //    var self=this
        //    ex.each(this.has_depend_list,function(opt){
        //        if(opt.depend.length >0){
        //            Vue.set(opt,'disabled',true)
        //            //self.$refs.et.getCheckedKeys().
        //            //opt.disableb=true
        //        }else{
        //            Vue.set(opt,'disabled',false)
        //        }
        //    })
        //},
        //update_checked:function(node,valid_node_list){
        //    var self=this
        //    var depend_node_list=self.depend[node.value]
        //    if(depend_node_list){
        //        ex.each(depend_node_list,function(depend_node){
        //            if(ex.isin(depend_node,valid_node_list) && self.is_depend_full_checked(depend_node)){
        //                self.$refs.et.setChecked(depend_node.value,true,true)
        //            }
        //        })
        //    }
        //    this.update_disable()
        //},
    },
    mounted: function mounted() {
        var self = this;
        self.depend = {};
        self.has_depend_list = [];

        var options_dict = {};
        ex.walk(this.inn_head.options, function (opt) {
            if (opt.value) {
                options_dict[opt.value] = opt;
            }
        });

        ex.walk(this.inn_head.options, function (opt) {
            if (!opt.depend) {
                return;
            }
            opt.depend_list = [];

            ex.each(opt.depend, function (item_name) {
                var item = options_dict[item_name];
                opt.depend_list.push(item);
                if (!item.depended_list) {
                    item.depended_list = [];
                }
                item.depended_list.push(opt);
            });
        });
    },
    data: function data() {
        var inn_head = ex.copy(this.head);
        return {
            inn_head: inn_head,
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    template: '<div class="com-field-ele-tree-name-layer">\n        <el-tree ref="et" :data="inn_head.options" :props="defaultProps"\n             @node-click="handleNodeClick"\n             @check="handleCheck"\n             show-checkbox\n             @check-change="handleCheckChange"\n             :default-checked-keys="row[head.name]"\n             node-key="value"\n    ></el-tree>\n    </div>',
    //default-expand-all
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-ele-tree-depend', label_shower);
//Vue.component('com-field-ele-tree-name-layer',function(resolve,reject){
//ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//resolve(label_shower)
//})
//})

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var label_shower = {
    props: ['row', 'head'],
    template: '<div><span v-text=\'label\'></span></div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-label-shower', label_shower);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _invite_code = __webpack_require__(84);

var invite_code = _interopRequireWildcard(_invite_code);

var _line_text = __webpack_require__(85);

var line_text = _interopRequireWildcard(_line_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var order_list = {
    props: ['row', 'head'],
    template: '<div>\n    <button @click="add_new()">+</button>\n    <button @click="delete_rows()">-</button>\n                    <el-table ref="core_table" class="table"\n                              :data="rows"\n                              border\n                              :stripe="true"\n                              size="mini"\n                              :summary-method="getSum"\n                               @selection-change="handleSelectionChange"\n                              style="width: 100%">\n                        <el-table-column\n                                type="selection"\n                                width="55">\n                        </el-table-column>\n\n                        <template  v-for="col in heads">\n\n                            <el-table-column v-if="col.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(col) "\n                                             :label="col.label"\n                                             :prop="col.name.toString()"\n                                             :width="col.width">\n                                <template slot-scope="scope">\n                                    <component :is="col.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="col.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(col) "\n                                             :prop="col.name.toString()"\n                                             :label="col.label"\n\n                                             :width="col.width">\n                            </el-table-column>\n\n\n                        </template>\n\n                    </el-table>\n          </div>',
    mixins: [mix_table_data, mix_ele_table_adapter],
    data: function data() {
        if (this.row[this.head.name]) {
            var rows = JSON.parse(this.row[this.head.name]);
        } else {
            var rows = [];
        }

        return {
            rows: rows,
            row_sort: {},
            heads: this.head.table_heads,
            selected: []
        };
    },
    mounted: function mounted() {
        //var self=this
        //ex.assign(this.op_funs, {
        //        edit_over: function () {
        //            self.row[self.head.name] = JSON.stringify(self.rows)
        //        },
        //    }
        //)
        //this.$on('commit',this.on_commit)
    },
    computed: {
        out_row_this_field: function out_row_this_field() {
            return this.row[this.head.name];
        }
    },
    watch: {
        out_row_this_field: function out_row_this_field() {
            if (this.row[this.head.name]) {
                this.rows = JSON.parse(this.row[this.head.name]);
            } else {
                this.rows = [];
            }
        }
    },
    methods: {
        commit: function commit() {
            var self = this;
            self.row[self.head.name] = JSON.stringify(self.rows);
        },
        add_new: function add_new() {
            var self = this;
            self.crt_row = {};

            var fields_ctx = {
                heads: self.head.fields_heads,
                extra_mixin: [],
                ops: [{
                    'name': 'save', 'editor': 'com-field-op-btn', 'label': '确定', 'icon': 'fa-save'
                }]
            };
            var win = pop_edit_local(self.crt_row, fields_ctx, function (resp) {
                //ex.assign(self.row,new_row)
                var new_row = resp;
                ex.vueAssign(self.crt_row, new_row);
                self.rows.push(self.crt_row);
                //self.crt_row.append(resp.new_row)
                self.row[self.head.name] = JSON.stringify(self.rows);
                layer.close(win);
            });

            //this.row[this.head].append({})
        },
        delete_rows: function delete_rows() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '提示' }, function (index) {
                //do something
                ex.remove(self.rows, function (row) {
                    return self.selected.indexOf(row) != -1;
                });

                layer.close(index);
            });
            //alert(this.selected.length)
        },
        norm_head: function norm_head(head, row) {
            if (row._editing) {}
        }
    }

};

Vue.component('com-field-table-list', order_list);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-phone-code', {
    props: ['row', 'head'],
    template: ' <div  style="position: relative;" class="phone-code flex">\n         <input  type="text" class="form-control input-sm" v-model="row[head.name]"\n            :id="\'id_\'+head.name" :name="head.name"\n            :placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>\n\n          <button style="width: 9em" type="button" class="btn btn-default btn-sm"\n              :disabled="vcode_count !=0"\n               @click="sendGetCodeOrder()" v-text="vcodeLabel"></button>\n     </div>\n    ',
    data: function data() {
        return {
            vcode_count: 0
        };
    },
    computed: {
        vcodeLabel: function vcodeLabel() {
            if (this.vcode_count != 0) {
                return '获取验证码(' + this.vcode_count + ')';
            } else {
                return '获取验证码';
            }
        },
        hasValidPhone: function hasValidPhone() {
            var mt = /^1[3-9]\d{9}$/.exec(this.row[this.head.phone_field]);
            if (mt) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        sendGetCodeOrder: function sendGetCodeOrder() {
            var self = this;
            if (!$(this.$parent.$el).find('[name=' + this.head.phone_field + ']').isValid()) {
                return;
            }

            cfg.show_load();
            ex.director_call(this.head.fun, { row: this.row }, function (resp) {
                cfg.hide_load();

                setTimeout(function () {
                    self.countGetVCodeAgain();
                }, 1000);
            });

            //ex.vueParCall(this,'get_phone_code',{com_vcode:this})
            //this.$emit('field-event',{fun:'get_phone_code'})
        },
        //checkImageCode:function(phone,image_key,image_code){
        //    var self=this
        //    $(self.$el).find('input').trigger("hidemsg")
        //
        //    //if(this.row.image_code && this.hasValidPhone){
        //    var data={
        //        Phone:phone,
        //        Key:image_key,
        //        Answer:image_code,
        //    }
        //    cfg.show_load()
        //    service_post('/anonymity/vcode/generate',data,function(resp){
        //        if(resp.error_description){
        //            $(self.$el).find('input').trigger("showmsg", ["error", resp.error_description ])
        //        }else if(resp.success){
        //            //$(self.$el).find('.image_code').trigger("showmsg", ["ok", '正确' ])
        //            setTimeout(function(){
        //                //self.image_valid=true
        //                self.countGetVCodeAgain()
        //            },1000)
        //        }
        //        // else {
        //        //    $(self.$el).find('.image_code').trigger("showmsg", ["error", resp.error_description ])
        //        //}
        //
        //    },false)
        //    //}
        //},
        countGetVCodeAgain: function countGetVCodeAgain() {
            var self = this;
            self.vcode_count = 120;
            var idx = setInterval(function () {
                self.vcode_count -= 1;
                if (self.vcode_count <= 0) {
                    clearInterval(idx);
                    self.vcode_count = 0;
                }
            }, 1000);
        }
    }
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(130);

/*
 * config={
 *    accept:""
 * }
 * */

var field_file_uploader = exports.field_file_uploader = {
    props: ['row', 'head'],
    template: '<div><com-file-uploader-tmp :name="head.name" v-model="row[head.name]" :config="head.config" :readonly="head.readonly"></com-file-uploader-tmp></div>'
};

var com_file_uploader = exports.com_file_uploader = {
    props: ['value', 'readonly', 'config', 'name'],
    data: function data() {

        return {
            picstr: this.value,
            pictures: this.value ? this.value.split(';') : [],
            crt_pic: ''
        };
    },

    template: '<div class="file-uploader">\n    <div v-if="!readonly">\n        <input v-if="cfg.multiple"  v-show="!cfg.com_btn" class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept" multiple="multiple">\n        <input v-else v-show="!cfg.com_btn"  class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept">\n        <input type="text" :name="name" style="display: none" v-model="value">\n    </div>\n\n    <div class="wrap">\n           <a v-for="pic in pictures" :href="pic"><span  v-text="pic"></span></a>\n    </div>\n\n     <!--<component v-if="cfg.com_btn && ! readonly" :is="cfg.com_btn" @click.native="browse()"></component>-->\n\n\n\n    </div>',
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
        //res_url:function(){
        //    return this.cfg.upload_url ? this.to: "/_face/upload"
        //},
        cfg: function cfg() {
            var def_config = {
                upload_url: '/d/upload',
                accept: 'image/*',
                multiple: false,
                sortable: true,
                on_click: function on_click(url) {
                    window.open(url, '_blank' // <- This is what makes it open in a new window.
                    );
                }
            };
            if (this.config) {
                //if(! this.config.hasOwnProperty('multiple') || this.config.multiple){
                //    def_config.com_btn='file-uploader-btn-plus'
                //}
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
            var upload_url = this.cfg.upload_url;

            //show_upload()

            cfg.show_load();
            fl.uploads(file_list, upload_url, function (resp) {
                cfg.hide_load();
                if (resp) {
                    if (self.cfg.multiple) {
                        self.add_value(resp);
                    } else {
                        self.set_value(resp);
                    }
                }
                //hide_upload(300)
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

    //var plus_btn={
    //    props:['accept'],
    //    template:`<div class="file-uploader-btn-plus">
    //        <div class="inn-btn"><span>+</span></div>
    //        <div style="text-align: center">添加文件</div>
    //    </div>`,
    //}
    //Vue.component('file-uploader-btn-plus',plus_btn)

};Vue.component('com-file-uploader-tmp', com_file_uploader);
Vue.component('com-field-plain-file', field_file_uploader);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pop_table_select = {
    props: ['row', 'head'],
    template: '<div>\n        <span  v-text="label"></span>\n        <input type="text" v-model="row[head.name]" style="display: none;" :id="\'id_\'+head.name" :name="head.name">\n        <span v-if="!head.readonly" class="clickable" @click="open_win"><i class="fa fa-search"></i></span>\n    </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    },
    mounted: function mounted() {
        //var self=this
        //var name =this.head.name
        //this.validator=$(this.$el).validator({
        //    fields: {
        //        name:'required;'
        //    }
        //})
    },
    methods: {
        open_win: function open_win() {
            var self = this;
            //pop_table_layer(this.row,this.head.table_ctx,function(foreign_row){
            //    Vue.set(self.row,self.head.name,foreign_row[self.head.name])
            //    Vue.set(self.row,'_'+self.head.name+'_label',foreign_row._label)
            //})
            var win_close = cfg.pop_middle('com-table-panel', this.head.table_ctx, function (foreign_row) {
                Vue.set(self.row, self.head.name, foreign_row[self.head.name]);
                Vue.set(self.row, '_' + self.head.name + '_label', foreign_row._label);
                win_close();
            });
        }
        //isValid:function(){
        //    return this.validator.isValid()
        //}
    }
};

Vue.component('com-field-pop-table-select', pop_table_select);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var validate_code = {
    props: ['row', 'head'],
    template: '<div style="position: relative;">\n    <input type="text" class="form-control input-sm" v-model="row[head.name]" :id="\'id_\'+head.name" :name="head.name">\n    <div>\n    <div style="display: inline-block;border: 1px solid #9e9e9e;">\n        <img  :src="head.code_img" alt="">\n    </div>\n    <span class="clickable" @click="change_code" style="white-space:nowrap;">\u770B\u4E0D\u6E05\uFF0C\u6362\u4E00\u5F20</span>\n    </div>\n    </div>',
    methods: {
        change_code: function change_code() {
            var self = this;
            var post_data = [{ fun: 'new_validate_code' }];
            cfg.show_load();
            ex.post('/d/ajax/authuser', JSON.stringify(post_data), function (resp) {
                self.head.code_img = resp.new_validate_code;
                cfg.hide_load();
            });
        }
    }

};

Vue.component('com-field-validate-code', validate_code);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-op-btn', {
    props: ['head'],
    template: '<button @click="operation_call()" class="btn btn-default">\n        <i v-if="head.icon" :class="[\'fa\',head.icon]"></i><span v-text="head.label"></span>\n        </button>',
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name);
        }
    }
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _com_form = __webpack_require__(86);

var com_form = _interopRequireWildcard(_com_form);

var _suit_fields = __webpack_require__(4);

var suit_fields = _interopRequireWildcard(_suit_fields);

var _suit_fields_local = __webpack_require__(87);

var suit_fields_local = _interopRequireWildcard(_suit_fields_local);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
* 可能无用了。
* */

__webpack_require__(131);

var com_plain_fields = {
    props: {
        heads: '',
        row: '',
        okBtn: {
            default: function _default() {
                return '确定';
            }
        },
        btnCls: {
            default: function _default() {
                return 'btn-primary btn-sm';
            }
        }
    },
    data: function data() {
        return {};
    },
    created: function created() {
        if (!this.okBtn) {
            this.okBtn = '确定';
        }
    },
    components: window._baseInput,
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div class="field-panel plain-field-panel">\n        <div v-for="head in heads">\n            <label for="" v-text="head.label"></label>\n            <span class="req_star" v-if=\'head.required\'>*</span>\n             <span v-if="head.help_text" class="help-text clickable">\n                    <i style="color: #3780af;position: relative;top:10px;" @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n              </span>\n              <div class="field-input">\n                <component v-if="head.editor" :is="head.editor"\n                     @field-event="$emit(\'field-event\',$event)"\n                     :head="head" :row="row"></component>\n            </div>\n\n        </div>\n\n        <div class="submit-block">\n            <button @click="panel_submit" type="btn"\n                :class="[\'btn\',btnCls]"><span v-text="okBtn"></span></button>\n        </div>\n        </div>',
    methods: {
        panel_submit: function panel_submit() {
            if (this.isValid()) {
                this.$emit('submit');
            }
        },
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        }
    }
};

window.com_plain_fields = com_plain_fields;

Vue.component('com-plain-field-panel', com_plain_fields);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
废弃了，采用 cfg.pop_middle('local-panel',ctx,callbank)
* */

function pop_edit_local(row, fields_ctx, callback, layerConfig) {

    var no_sub_to_server = {
        methods: {
            save: function save() {
                //cfg.show_load()
                if (this.isValid()) {
                    this.$emit('submit-success', this.row);
                }
                //cfg.hide_load(2000)
            }
        }
    };

    if (!fields_ctx.extra_mixins) {
        fields_ctx.extra_mixins = [no_sub_to_server];
    } else {
        fields_ctx.extra_mixins = [no_sub_to_server].concat(fields_ctx.extra_mixins);
    }
    var openfields_layer_index = pop_fields_layer(row, fields_ctx, callback, layerConfig);
    return openfields_layer_index;
}
//window.no_sub_to_server=no_sub_to_server
window.pop_edit_local = pop_edit_local;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _sim_fields = __webpack_require__(2);

var com_sim_fields_local = {
    mixins: [_sim_fields.com_sim_fields],
    methods: {
        submit: function submit() {
            if (this.isValid()) {
                this.$emit('finish', this.row);
            }
        }
    }
};

window.com_sim_fields_local = com_sim_fields_local;

Vue.component('com-sim-fields-local', com_sim_fields_local);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(132);

Vue.component('com-head-dropdown', {
    props: ['head'],
    template: '<div class="com-head-userinfo">\n    <div style="z-index:200" class="login" >\n        <el-dropdown class="com-head-userinfo">\n          <span class="el-dropdown-link">\n          <span v-html="head.label"></span>\n            <i class="el-icon-arrow-down el-icon--right"></i>\n          </span>\n          <el-dropdown-menu slot="dropdown">\n            <el-dropdown-item v-for="action in head.options">\n                <a class="com-head-dropdown-action" :href="action.link" v-text="action.label"></a>\n            </el-dropdown-item>\n          </el-dropdown-menu>\n        </el-dropdown>\n    </div>\n    </div>'
});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(133);

// header 上的小链接,例如右上角的  [登录 | 注册  ]
Vue.component('com-head-sm-link', {
    props: ['head'],
    template: '<div class="small-link">\n    <span class="item" v-for="action in head.options">\n        <a  @click="on_click(action)" class="login-link clickable" v-text="action.label"></a>\n        <span class="space" v-if="action != head.options[head.options.length-1]">&nbsp;|&nbsp;</span>\n    </span>\n    </div>',
    methods: {
        on_click: function on_click(action) {
            if (this.$listeners && this.$listeners.jump) {
                this.$emit('jump', action);
            } else {
                location = action.link;
            }
        }
    }
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-widget-el-tab', {
    props: ['ctx'],
    template: '<div class="tab-full active-tab-hightlight-top" style="position: absolute;bottom: 0;top: 0;left: 0;right: 0;" >\n     <el-tabs  v-if="ctx.tabs.length >1" type="border-card"\n                           @tab-click="handleClick"\n                           style="width: 100%;height: 100%;"\n                           :value="ctx.crt_tab_name" >\n\n                    <!--<el-tab-pane v-for="tab in normed_tab( tabgroup.tabs )"-->\n                    <el-tab-pane v-for="tab in normed_tab"\n                                lazy\n                                 :key="tab.name"\n                                 :name="tab.name">\n                        <span slot="label" v-text="tab.label" ></span>\n\n                        <component :is="tab.com" :tab_head="tab"\n                                   :par_row="ctx.par_row"\n                                   :ref="\'_tab_\'+tab.name" @tab-event="up_event($event)"></component>\n\n\n                    </el-tab-pane>\n                </el-tabs>\n\n                <component v-else v-for="tab in ctx.tabs"  :is="tab.com" :tab_head="tab"\n                           :par_row="ctx.par_row"\n                           :ref="\'_tab_\'+tab.name" @tab-event="up_event($event)"></component>\n    </div>',
    watch: {
        'ctx.crt_tab_name': function ctxCrt_tab_name(v) {
            this.show_tab(v);
        }
    },
    mounted: function mounted() {
        this.show_tab(this.ctx.crt_tab_name);
    },
    computed: {
        normed_tab: function normed_tab() {
            var tabs = this.ctx.tabs;
            var par_row = this.ctx.par_row;
            var out_tabs = ex.filter(tabs, function (tab) {
                if (tab.show) {
                    return ex.eval(tab.show, { par_row: par_row });
                    //return ex.boolExpress(par_row,tab.show)
                } else {
                    return true;
                }
            });
            return out_tabs;
        }
    },
    methods: {
        show_tab: function show_tab(name) {
            this.ctx.crt_tab_name = name;
            //this.crt_tab_name = name
            //var self =this
            //Vue.nextTick(function(){
            //    self.$refs['_tab_'+name][0].on_show()
            //})
        },
        handleClick: function handleClick(tab, event) {
            this.show_tab(tab.name);
        },

        up_event: function up_event(event) {
            this.$emit('win-event', event);
        }
    }
});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_fields_layer = pop_fields_layer;

var _com_pop_fields = __webpack_require__(88);

function pop_fields_layer(row, fields_ctx, callback, layerConfig) {
    // row,head ->//model_name,relat_field

    var row = ex.copy(row);
    var heads = fields_ctx.heads;
    var ops = fields_ctx.ops;
    var extra_mixins = fields_ctx.extra_mixins || [];

    if (typeof fields_ctx.fieldsPanel == 'string') {
        var com_fields = window[fields_ctx.fieldsPanel] || _com_pop_fields.com_pop_field;
    } else {
        var com_fields = fields_ctx.fieldsPanel || _com_pop_fields.com_pop_field;
    }

    var id_string = JSON.stringify(com_fields) + JSON.stringify(extra_mixins);
    var com_id = md5(id_string);

    if (!window['_vue_com_' + com_id]) {
        extra_mixins = ex.map(extra_mixins, function (mix) {
            if (typeof mix == 'string') {
                return window[mix];
            } else {
                return mix;
            }
        });
        //var com_pop_field_real = $.extend({}, com_fields);
        //com_pop_field_real.mixins = com_fields.mixins.concat(extra_mixins)
        var com_pop_field_real = ex.vueExtend(com_fields, extra_mixins);
        Vue.component('com-pop-fields-' + com_id, com_pop_field_real);
        window['_vue_com_' + com_id] = true;
    }

    var pop_id = new Date().getTime();

    var layer_config = {
        type: 1,
        area: ['800px', '500px'],
        title: '详细',
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#fields-pop-' + pop_id).parents('.layui-layer').height();
            $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
        },
        //shadeClose: true, //点击遮罩关闭
        content: '<div id="fields-pop-' + pop_id + '" style="height: 100%;">\n                    <component :is="\'com-pop-fields-\'+com_id" @del_success="on_del()" @submit-success="on_sub_success($event)"\n                    :row="row" :heads="fields_heads" :ops="ops" ref="field_panel"></component>\n                </div>',
        end: function end() {

            //eventBus.$emit('openlayer_changed')

        }
    };
    if (layerConfig) {
        ex.assign(layer_config, layerConfig);
    }
    var openfields_layer_index = layer.open(layer_config);

    (function (pop_id, row, heads, ops, com_id, openfields_layer_index) {

        //Vue.nextTick(function(){
        //    var store_id ='store_fields_'+ new Date().getTime()

        var vc = new Vue({
            el: '#fields-pop-' + pop_id,
            data: {
                has_heads_adaptor: false,
                row: row,
                fields_heads: heads,
                ops: ops,
                com_id: com_id

            },
            mounted: function mounted() {
                var vc = this;
                this.childStore = new Vue({
                    data: {
                        fields_obj: vc.$refs.field_panel
                    },
                    methods: {
                        showErrors: function showErrors(errors) {
                            vc.fields_obj.setErrors(errors);
                            vc.fields_obj.showErrors(errors);
                        }
                    }

                });
                //this.$store.registerModule(store_id,{
                //    namespaced: true,
                //    state:{
                //        fields_obj:this.$refs.field_panel
                //    },
                //    mutations:{
                //        showErrors:function(state,errors){
                //            state.fields_obj.setErrors(errors)
                //            state.fields_obj.showErrors(errors)
                //        }
                //    }
                //})
            },
            methods: {
                on_sub_success: function on_sub_success(new_row) {
                    callback(new_row, this.childStore, openfields_layer_index);
                }
            }
        });

        //eventBus.$emit('openlayer_changed')

        //})
    })(pop_id, row, heads, ops, com_id, openfields_layer_index);

    return openfields_layer_index;
} /*
  * root 层面创建Vue组件，形成弹出框
  
   fields_ctx:{
           'heads':[{'name':'matchid','label':'比赛','editor':'com-field-label-shower','readonly':True},
                   {'name':'home_score','label':'主队分数','editor':'linetext'},
              ],
           'ops':[{"fun":'produce_match_outcome','label':'保存','editor':'com-field-op-btn'},],
           'extra_mixins':['produce_match_outcome'],
           'fieldsPanel': 'produceMatchOutcomePanel',
           // 使用extra_mixins与fieldsPanel的区别是，设置fieldPanel可以防止引入com_pop_field对象，如果只设置extra_mixin的话，会默认引入com_pop_field
   }
  
  * */


window.pop_fields_layer = pop_fields_layer;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_layer = pop_layer;
function pop_layer(com_ctx, component_name, callback, layerConfig) {
    // row,head ->//model_name,relat_field


    var pop_id = new Date().getTime();

    var layer_config = {
        type: 1,
        area: ['800px', '500px'],
        title: '详细',
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#fields-pop-' + pop_id).parents('.layui-layer').height();
            if (this.title) {
                $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
            } else {
                $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height);
            }
        },
        //shadeClose: true, //点击遮罩关闭  style="height: 100%;width: 100%"
        content: '<div id="fields-pop-' + pop_id + '" class="pop-layer" style="height: 100%;width: 100%">\n                    <component :is="component_name" :ctx="com_ctx" @finish="on_finish($event)"></component>\n                </div>',
        end: function end() {

            //eventBus.$emit('openlayer_changed')

        }
    };
    if (layerConfig) {
        ex.assign(layer_config, layerConfig);
    }
    var opened_layer_index = layer.open(layer_config);

    new Vue({
        el: '#fields-pop-' + pop_id,
        data: {
            com_ctx: com_ctx,
            component_name: component_name
        },
        methods: {
            on_finish: function on_finish(e) {
                if (callback) {
                    callback(e);
                }
            }
        }
    });
    return opened_layer_index;
}

window.pop_layer = pop_layer;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_table_layer = pop_table_layer;
/*
 * root 层面创建Vue组件，形成弹出框
 * */

function pop_table_layer(row, table_ctx, callback, layer_config) {
    // row,head ->//model_name,relat_field


    var pop_id = new Date().getTime();
    var inn_config = {
        type: 1,
        area: ['800px', '500px'],
        title: '列表',
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#pop-table-' + pop_id).parents('.layui-layer').height();
            $('#pop-table-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
            layer_vue.resize();
            layer_vue.setHeight(total_height - 160);
        },
        shadeClose: true, //点击遮罩关闭
        content: '<div id="pop-table-' + pop_id + '" style="height: 100%;padding-left: 10px">\n\n            <div class="rows-block flex-v" style="height: 100%">\n                <div class=\'flex\' style="min-height: 3em;" v-if="row_filters.length > 0">\n                    <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                                @submit="search()"></com-filter>\n                    <div class="flex-grow"></div>\n                </div>\n                <div class="box box-success flex-grow flex-v" >\n                    <div class="table-wraper flex-grow" style="position: relative">\n                    <div style="position: absolute;top:0;right:0;left:0;bottom: 0">\n                     <el-table class="table" ref="e_table"\n                                      :data="rows"\n                                      border\n                                      show-summary\n                                      :fit="false"\n                                      :stripe="true"\n                                      size="mini"\n                                      @sort-change="sortChange($event)"\n                                      @selection-change="handleSelectionChange"\n                                      :summary-method="getSum"\n                                      height="100%"\n                                      style="width: 100%">\n                                <el-table-column\n                                        v-if="selectable"\n                                        type="selection"\n                                        width="55">\n                                </el-table-column>\n\n                                <template  v-for="head in heads">\n\n                                    <el-table-column v-if="head.editor"\n                                                     :show-overflow-tooltip="is_show_tooltip(head) "\n                                                     :label="head.label"\n                                                     :sortable="is_sort(head)"\n                                                     :width="head.width">\n                                        <template slot-scope="scope">\n                                            <component :is="head.editor"\n                                                       @on-custom-comp="on_td_event($event)"\n                                                       :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                            </component>\n\n                                        </template>\n\n                                    </el-table-column>\n\n                                    <el-table-column v-else\n                                                     :show-overflow-tooltip="is_show_tooltip(head) "\n                                                     :prop="head.name.toString()"\n                                                     :label="head.label"\n                                                     :sortable="is_sort(head)"\n                                                     :width="head.width">\n                                    </el-table-column>\n\n                                </template>\n\n                            </el-table>\n                     </div>\n\n                    </div>\n                    <div style="margin-top: 10px;">\n                         <el-pagination\n                                @size-change="on_perpage_change"\n                                @current-change="get_page"\n                                :current-page="row_pages.crt_page"\n                                :page-sizes="[20, 50, 100, 500]"\n                                :page-size="row_pages.perpage"\n                                layout="total, sizes, prev, pager, next, jumper"\n                                :total="row_pages.total">\n                        </el-pagination>\n                    </div>\n                </div>\n        </div>\n    </div>'
    };
    ex.assign(inn_config, layer_config);
    var opened_layer_indx = layer.open(inn_config);

    if (table_ctx.extra_mixins) {
        var real_extra_mixins = ex.map(table_ctx.extra_mixins, function (item) {
            if (typeof item == 'string') {
                return window[item];
            } else {
                return item;
            }
        });
        var mixins = [mix_table_data, mix_ele_table_adapter].concat(real_extra_mixins);
    } else {
        var mixins = [mix_table_data, mix_ele_table_adapter];
    }
    if (table_ctx.selectable == undefined) {
        table_ctx.selectable = true;
    }

    var layer_vue = new Vue({
        el: '#pop-table-' + pop_id,

        data: {
            par_row: row,
            //table_ctx:table_ctx,
            table_ctx: table_ctx,
            heads: table_ctx.heads,
            selectable: table_ctx.selectable,

            row_filters: table_ctx.row_filters,
            row_sort: table_ctx.row_sort,
            director_name: table_ctx.director_name,
            row_pages: {},
            rows: [],
            footer: [],
            selected: [],
            del_info: [],
            search_args: table_ctx.search_args || {},

            height: 350
        },
        mixins: mixins,
        mounted: function mounted() {
            this.getRows();
            //this.$refs.com_table.getRows()
            //var self =this
            //setTimeout(function(){
            //     self.$refs.com_table.getRows()
            // },1000)

            var self = this;
            ex.assign(this.op_funs, {
                send_select: function send_select(kws) {
                    // 用作选择框时，(只选择一个) 会用到该函数
                    callback(kws.row);
                    layer.close(opened_layer_indx);
                }
            });
        },
        methods: {
            setHeight: function setHeight(height) {
                this.height = height;
            }
            //on_sub_success:function(event){
            //    callback({name:'selected',row:event.row})
            //    //callback({name:'after_save',new_row:event.new_row,old_row:event.old_row})
            //
            //},

        }
    });
}

window.pop_table_layer = pop_table_layer;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(134);

Vue.component('com-widget-stack', {
    props: ['ctx_list'],
    template: '<div class="com-widget-stack">\n        <component v-for="(ctx,index) in ctx_list" v-show="index==ctx_list.length-1"\n            :is="ctx.widget" :ctx="ctx" @win-event="$emit(\'win-event\',$event)"></component>\n    </div>'

});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(135);

var mix_ele_table_adapter = {
    mounted: function mounted() {
        if (!this.search_args._sort) {
            Vue.set(this.search_args, '_sort', '');
        }
    },
    watch: {
        'search_args._sort': function search_args_sort(v) {
            if (!v && this.$refs.e_table) {
                this.$refs.e_table.clearSort();
            }
        }
    },
    methods: {
        is_sort: function is_sort(head) {
            if (ex.isin(head.name, this.row_sort.sortable)) {
                return 'custom';
            } else {
                return false;
            }
        },
        is_show_tooltip: function is_show_tooltip(head) {
            if (head.show_tooltip == undefined) {
                return true;
            } else {
                return head.show_tooltip;
            }
        },
        handleSelectionChange: function handleSelectionChange(val) {
            this.selected = val;
        },

        clearSelection: function clearSelection() {
            this.selected = [];
            this.$refs.e_table.clearSelection();
        },
        sortChange: function sortChange(params) {
            //{ column, prop, order }
            var self = this;
            //                this.$refs.e_table.clearSort()
            //                ex.each(this.row_sort.sortable,function(name){
            if (params.prop) {
                if (params.order == 'ascending') {
                    self.search_args._sort = params.prop;
                } else if (params.order == 'descending') {
                    self.search_args._sort = '-' + params.prop;
                }
            } else {
                self.search_args._sort = '';
            }
            this.search();
            //                })
        },

        getSum: function getSum(param) {
            return this.footer;
        },
        on_perpage_change: function on_perpage_change(perpage) {
            this.search_args._perpage = perpage;
            this.search_args._page = 1;
            this.getRows();
        }
    }
};

window.mix_ele_table_adapter = mix_ele_table_adapter;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_fields_data = {
    data: function data() {
        return {
            op_funs: {}
        };
    },
    mounted: function mounted() {
        var self = this;
        ex.assign(this.op_funs, {
            save: function save() {
                //self.save()
                self.submit();
            },
            submit: function submit() {
                self.submit();
            }
        });
        self.setErrors({});
    },
    created: function created() {
        ex.each(this.heads, function (head) {
            if (typeof head.readonly == 'string') {
                head._org_readonly = head.readonly;
                head.readonly = ex.eval(head._org_readonly, { row: self.row });
            }
            if (typeof head.required == 'string') {
                head._org_required = head.required;
                head.required = ex.eval(head._org_required, { row: self.row });
            }
            if (typeof head.show == 'string') {
                head._org_show = head.show;
                head.show = ex.eval(head._org_show, { row: self.row });
            }
        });
    },
    computed: {
        normed_heads: function normed_heads() {
            var self = this;
            ex.each(self.heads, function (head) {
                if (head._org_readonly) {
                    head.readonly = ex.eval(head._org_readonly, { row: self.row });
                }
                if (head._org_required) {
                    head.required = ex.eval(head._org_required, { row: self.row });
                }
            });
            var heads = ex.filter(self.heads, function (head) {
                if (head._org_show) {
                    return ex.eval(head._org_show, { row: self.row });
                } else {
                    return true;
                }
            });
            return heads;
        }
    },
    //watch:{
    //    row:function(v){
    //        var self=this
    //        Vue.nextTick(function(){
    //            ex.each(self.heads,function(head){
    //                if( head._org_readonly){
    //                    head.readonly=ex.eval(head._org_readonly,{row:v})
    //                }
    //            })
    //        })
    //
    //    }
    //},
    methods: {
        on_operation: function on_operation(op) {
            var fun_name = op.fun || op.name;
            this.op_funs[fun_name](op.kws);
        },
        on_field_event: function on_field_event(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
        },
        get_data: function get_data() {
            this.data_getter(this);
        },
        setErrors: function setErrors(errors) {
            // errors:{field:['xxx','bbb']}
            var errors = ex.copy(errors);
            if (!this.heads) {
                return;
            }
            ex.each(this.heads, function (head) {
                if (errors[head.name]) {
                    Vue.set(head, 'error', errors[head.name].join(';'));
                    delete errors[head.name];
                } else if (head.error) {
                    //delete head.error
                    Vue.delete(head, 'error');
                    //Vue.set(head,'error',null)
                }
            });

            if (!ex.isEmpty(errors)) {
                layer.alert(JSON.stringify(errors));
            }
        },
        dataSaver: function dataSaver(callback) {
            // 该函数已经被废弃
            var post_data = [{ fun: 'save_row', row: this.row }];
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                callback(resp.save_row);
            });
        },
        submit: function submit() {
            var self = this;
            this.setErrors({});
            ex.vueBroadCall(self, 'commit');
            Vue.nextTick(function () {
                if (!self.isValid()) {
                    return;
                }
                self.save();
            });
        },
        save: function save() {
            var self = this;
            cfg.show_load();
            var post_data = [{ fun: 'save_row', row: this.row }];
            this.old_row = ex.copy(this.row);
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                var rt = resp.save_row;
                if (rt.errors) {
                    cfg.hide_load();
                    self.setErrors(rt.errors);
                    self.showErrors(rt.errors);
                } else {
                    if (resp.msg) {
                        cfg.hide_load();
                    } else {
                        cfg.hide_load(2000);
                    }
                    ex.vueAssign(self.row, rt.row);
                    self.after_save(rt.row);
                    self.setErrors({});
                }
            });

            //self.dataSaver(function(rt){
            //    if( rt.errors){
            //        cfg.hide_load()
            //        self.setErrors(rt.errors)
            //        self.showErrors(rt.errors)
            //    }else{
            //        cfg.hide_load(1000)
            //        self.after_save(rt.row)
            //        self.setErrors({})
            //    }
            //})
        },

        after_save: function after_save(new_row) {
            //ex.assign(this.row,new_row)
            console.log('mix_fields_data.after_save');
        },
        showErrors: function showErrors(errors) {
            // 落到 nice validator去
        },
        clear: function clear() {
            this.row = {};
            this.set_errors({});
        }

    }
};

window.mix_fields_data = mix_fields_data;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
用在fields表单里面的mixins

增加nicevalidator功能
* */

var nice_validator = {
    mounted: function mounted() {
        this.update_nice();
    },
    methods: {
        update_nice: function update_nice() {
            var self = this;
            var validator = {};
            ex.each(this.heads, function (head) {
                var ls = [];

                if (head.fv_rule) {
                    ls.push(head.fv_rule);
                }
                if (head.required) {
                    if (!head.fv_rule || head.fv_rule.search('required') == -1) {
                        // 规则不包含 required的时候，再添加上去
                        ls.push('required');
                    }
                }
                validator[head.name] = ls.join(';');
            });
            if ($(this.$el).hasClass('field-panel')) {
                this.nice_validator = $(this.$el).validator({
                    fields: validator
                });
            } else {
                this.nice_validator = $(this.$el).find('.field-panel').validator({
                    fields: validator
                });
            }
        },
        isValid: function isValid() {
            var nice_rt = this.nice_validator.isValid();
            //var totalValid=[nice_rt]
            var totalValid = ex.vueBroadCall(this, 'isValid');
            totalValid.push(nice_rt);

            //ex.each(this.$children,function(child){
            //    if(child.isValid){
            //        totalValid.push(child.isValid())
            //    }
            //})

            var valid = true;
            ex.each(totalValid, function (item) {
                valid = valid && item;
            });
            return valid;
        },
        //before_save:function(){
        //    ex.vueSuper(this,{mixin:nice_validator,fun:'before_save'})
        //    if(this.isValid()){
        //        return 'continue'
        //    }else{
        //        return 'break'
        //    }
        //},
        showErrors: function showErrors(errors) {
            for (var k in errors) {
                //var head = ex.findone(this.heads,{name:k})
                var real_input = $(this.$el).find('.real-input');
                if (real_input.length != 0) {
                    real_input.trigger("showmsg", ["error", errors[k].join(';')]);
                } else {
                    $(this.$el).find('[name=' + k + ']').trigger("showmsg", ["error", errors[k].join(';')]);
                }
            }
        }
    }

    //$.validator.config({
    //    rules: {
    //        error_msg: function(ele,param){
    //
    //        }
    //    }
    //}
    //
    //);

};window.mix_nice_validator = nice_validator;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
被 table_store 替代掉了
* */
var mix_table_data = {
    created: function created() {
        if (!this.search_args) {
            this.search_args = search_args;
        }
    },
    data: function data() {
        return {
            op_funs: {},
            changed_rows: [],
            table_layout: {}
        };
    },
    mounted: function mounted() {
        var self = this;
        //this.childStore=new Vue({
        //
        //})

        ex.assign(this.op_funs, {
            save_changed_rows: function save_changed_rows() {
                self.save_rows(self.changed_rows);
                self.changed_rows = [];
            },
            add_new: function add_new(kws) {
                /*
                * model_name,
                * */
                self.add_new(kws);
            },
            delete: function _delete() {
                self.del_selected();
            },
            get_data: function get_data() {
                self.getRows();
            },
            refresh: function refresh() {
                self.search();
            },
            selected_set_value: function selected_set_value(kws) {
                /* kws ={ field,value }
                * */
                ex.each(self.selected, function (row) {
                    row[kws.field] = kws.value;
                    if (row._hash != ex.hashDict(row)) {
                        if (!ex.isin(row, self.changed_rows)) {
                            self.changed_rows.push(row);
                        }
                    }
                });
            },
            selected_set_and_save: function selected_set_and_save(kws) {
                /*
                这个是主力函数
                 // 路线：弹出->编辑->update前端（缓存的）row->保存->后台->成功->update前端row->关闭窗口
                * */
                // head: row_match:many_row ,
                var row_match_fun = kws.row_match || 'many_row';
                if (!row_match[row_match_fun](self, kws)) {
                    return;
                }

                function bb(all_set_dict, after_save_callback) {
                    var cache_rows = ex.copy(self.selected);
                    ex.each(cache_rows, function (row) {
                        ex.assign(row, all_set_dict);
                        if (kws.fields_ctx && kws.fields_ctx.director_name) {
                            row._cache_director_name = row._director_name; // [1] 有可能是用的特殊的 direcotor
                            row._director_name = kws.fields_ctx.director_name;
                        }
                        row[kws.field] = kws.value;
                    });
                    var post_data = [{ fun: 'save_rows', rows: cache_rows }];
                    cfg.show_load();
                    ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                        if (!resp.save_rows.errors) {
                            ex.each(resp.save_rows, function (new_row) {
                                delete new_row._director_name; // [1]  这里还原回去
                                self.update_or_insert(new_row);
                            });
                            self.clearSelection();

                            cfg.hide_load(2000);
                        } else {
                            cfg.hide_load();
                            // 留到下面的field弹出框，按照nicevalidator的方式去显示错误
                            //cfg.showError(resp.save_rows.msg)
                        }

                        //self.op_funs.update_or_insert_rows({rows:resp.save_rows} )

                        if (after_save_callback) {
                            after_save_callback(resp);
                        }
                    });
                }

                function judge_pop_fun() {
                    if (kws.fields_ctx) {
                        var one_row = ex.copy(self.selected[0]);
                        var win_index = pop_edit_local(one_row, kws.fields_ctx, function (new_row, store_id) {
                            bb(new_row, function (resp) {
                                if (resp.save_rows.errors) {
                                    self.$store.commit(store_id + '/showErrors', resp.save_rows.errors);
                                } else {
                                    layer.close(win_index);
                                }
                            });
                        });
                    } else {
                        bb({});
                    }
                }

                if (kws.confirm_msg) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        judge_pop_fun();
                    });
                } else {
                    judge_pop_fun();
                }
            },
            selected_pop_set_and_save: function selected_pop_set_and_save(kws) {
                // 被  selected_set_and_save 取代了。
                // 路线：弹出->编辑->保存->后台(成功)->update前端row->关闭窗口
                var row_match_fun = kws.row_match || 'one_row';
                if (!row_match[row_match_fun](self, kws)) {
                    return;
                }

                var crt_row = self.selected[0];
                var cache_director_name = crt_row._director_name;
                crt_row._director_name = kws.fields_ctx.director_name;
                var win_index = pop_fields_layer(crt_row, kws.fields_ctx, function (new_row) {
                    ex.assign(crt_row, new_row);
                    crt_row._director_name = cache_director_name;
                    layer.close(win_index);
                });
            },
            ajax_row: function ajax_row(kws) {
                // kws 是head : {'fun': 'ajax_row', 'app': 'maindb', 'ajax_fun': 'modify_money_pswd', 'editor': 'com-op-btn', 'label': '重置资金密码', },
                if (self.selected.length == 0) {
                    cfg.showMsg('请选择一行数据');
                    return;
                }
                var row = self.selected[0];
                var post_data = [{ fun: kws.ajax_fun, row: row }];

                cfg.show_load();
                ex.post('/d/ajax/' + kws.app, JSON.stringify(post_data), function (resp) {
                    cfg.hide_load(2000);
                });
            },
            create_child_row: function create_child_row(kws) {
                /*
                 * */
                if (kws.fields_ctx) {
                    var fields_ctx = kws.fields_ctx;
                    var dc = { fun: 'get_row', director_name: fields_ctx.director_name };
                    if (kws.init_fields) {
                        ex.assign(dc, kws.init_fields);
                    }
                    var post_data = [dc];
                    cfg.show_load();
                    ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                        cfg.hide_load();
                        var crt_row = resp.get_row;
                        self.crt_row = crt_row;
                        crt_row.carry_parents = self.parents;

                        if (kws.tab_name) {
                            self.$emit('operation', { fun: 'switch_to_tab', tab_name: kws.tab_name, row: crt_row });
                        } else {
                            var win = pop_fields_layer(crt_row, fields_ctx, function (new_row) {
                                layer.close(win);
                                if (kws.after_save == 'refresh') {
                                    self.search();
                                } else {
                                    self.update_or_insert(new_row, crt_row);
                                }
                            });
                        }
                    });

                    //var row={
                    //    _director_name:kws.fields_ctx._director_name
                    //}
                    //pop_edit_local(row,kws.fields_ctx,function(new_row){
                    //    cfg.show_load()
                    //    ex.director_call(kws.fields_ctx.director_name,{row:new_row,parents:self.parents},function(resp){
                    //        cfg.hide_load(300)
                    //        self.update_or_insert(resp.row)
                    //    })
                    //})
                }
            },

            director_call: function director_call(kws) {
                function bb() {
                    cfg.show_load();
                    ex.director_call(kws.director_name, {}, function (resp) {
                        if (!resp.msg) {
                            cfg.hide_load(2000);
                        } else {
                            cfg.hide_load();
                        }
                        if (kws.after_call) {
                            self.op_funs[kws.after_call](resp);
                            if (resp.msg) {
                                cfg.showMsg(resp.msg);
                            }
                        }
                    });
                }

                if (kws.confirm_msg) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        bb();
                    });
                } else {
                    bb();
                }
            },
            director_rows: function director_rows(kws) {
                // kws: {after_call:'update_or_insert_rows'}
                var row_match_fun = kws.row_match || 'one_row';
                if (!row_match[row_match_fun](self, kws)) {
                    return;
                }

                function bb() {
                    cfg.show_load();
                    ex.director_call(kws.director_name, { rows: self.selected }, function (resp) {
                        if (!resp.msg) {
                            cfg.hide_load(2000);
                        } else {
                            cfg.hide_load();
                        }
                        if (kws.after_call) {
                            self.op_funs[kws.after_call](resp);
                            if (resp.msg) {
                                cfg.showMsg(resp.msg);
                            }
                        }
                    });
                }

                if (kws.confirm_msg) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        bb();
                    });
                } else {
                    bb();
                }
            },
            emitEvent: function emitEvent(e) {
                self.$emit(e);
            },

            update_or_insert: function update_or_insert(kws) {
                self.update_or_insert(kws.new_row, kws.old_row);
            },
            update_or_insert_rows: function update_or_insert_rows(kws) {
                var rows = kws.rows;
                ex.each(rows, function (row) {
                    self.update_or_insert(row);
                });
            },

            export_excel: function export_excel() {
                var search_args = ex.copy(self.search_args);
                search_args._perpage = 5000;
                var post_data = [{ fun: 'get_excel', director_name: self.director_name, search_args: search_args }];
                cfg.show_load();
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    cfg.hide_load();
                    var url = resp.get_excel.file_url;
                    ex.download(url);
                });
            },

            // 为了刷新界面，付出了清空的代价，这两个函数小心使用，
            row_up: function row_up(kws) {
                var row = kws.row;
                var index = self.rows.indexOf(row);
                if (index >= 1) {
                    var ss = swap(self.rows, index - 1, index);
                    //self.rows=[]
                    //Vue.nextTick(function(){
                    //    self.rows=ss
                    //})
                }
                //self.$refs.core_table.sort()
            },
            row_down: function row_down(kws) {
                var row = kws.row;
                var index = self.rows.indexOf(row);
                if (index < self.rows.length - 1) {
                    //Vue.set(self,'rows',swap(self.rows,index+1,index))
                    //self.rows =
                    var ss = swap(self.rows, index + 1, index);
                    //self.rows=[]
                    //Vue.nextTick(function(){
                    //    self.rows=ss
                    //})
                }
                //self.$refs.core_table.sort()
            }

        });
        //this.$refs.op_save_changed_rows[0].set_enable(false)
        //this.$refs.op_delete[0].set_enable(false)
    },
    computed: {
        changed: function changed() {
            return this.changed_rows.length != 0;
        },
        has_select: function has_select() {
            return this.selected.length != 0;
        }
    },

    methods: {
        on_operation: function on_operation(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
        },
        on_td_event: function on_td_event(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
            //this.op_funs[e.name](e)
        },
        search: function search() {
            this.search_args._page = 1;
            this.getRows();
        },
        add_new: function add_new(kws) {
            var self = this;
            var fields_ctx = kws.fields_ctx;
            var dc = { fun: 'get_row', director_name: fields_ctx.director_name };
            if (kws.init_fields) {
                ex.assign(dc, kws.init_fields);
            }
            var post_data = [dc];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var crt_row = resp.get_row;
                //var pop_id= new Date().getTime()
                // e = {name:'after_save',new_row:event.new_row,old_row:event.old_row}
                //eventBus.$on('pop-win-'+pop_id,function(e){
                //    self.update_or_insert(e.new_row, e.old_row)
                //})
                //pop_fields_layer(new_row,kws.heads,kws.ops,pop_id)
                self.crt_row = crt_row;
                if (kws.tab_name) {
                    //self.switch_to_tab(kws)
                    self.$emit('operation', { fun: 'switch_to_tab', tab_name: kws.tab_name, row: crt_row });
                    //self.switch_to_tab({tab_name:kws.tab_name,row:crt_row})
                } else {
                    var win = pop_fields_layer(crt_row, fields_ctx, function (new_row) {
                        self.update_or_insert(new_row, crt_row);
                        layer.close(win);
                    });
                }
            });
        },
        editRow: function editRow(kws) {
            var row = kws.row;
            var fields_ctx = kws.fields_ctx;
        },
        update_or_insert: function update_or_insert(new_row, old_row) {
            // 如果是更新，不用输入old_row，old_row只是用来判断是否是创建的行为
            if (old_row && !old_row.pk) {

                //var rows = this.rows.splice(0, 0, new_row)

                this.rows = [new_row].concat(this.rows);
                this.row_pages.total += 1;
            } else {
                var table_row = ex.findone(this.rows, { pk: new_row.pk });
                //ex.assign(table_row,new_row)
                for (var key in new_row) {
                    Vue.set(table_row, key, new_row[key]);
                }
            }
        },
        getRows: function getRows() {
            /*
            以后都用这个函数，不用什么get_data 或者 data_getter 了
            * */
            var self = this;

            cfg.show_load();
            self.rows = [];

            var post_data = [{ fun: 'get_rows', director_name: self.director_name, search_args: self.search_args }];
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {

                self.rows = resp.get_rows.rows;
                self.row_pages = resp.get_rows.row_pages;
                //self.search_args=resp.get_rows.search_args
                ex.vueAssign(self.search_args, resp.get_rows.search_args);
                self.footer = resp.get_rows.footer;
                self.parents = resp.get_rows.parents;
                self.table_layout = resp.get_rows.table_layout;
                cfg.hide_load();
            });
        },
        get_page: function get_page(page_number) {
            this.search_args._page = page_number;
            this.getRows();
        },
        get_search_args: function get_search_args() {
            return this.search_args;
        },
        //data_getter:function(){
        //    // 默认的 data_getter
        //    var self=this
        //
        //    cfg.show_load()
        //    var post_data=[{fun:'get_rows',director_name:this.director_name,search_args:this.search_args}]
        //    $.get('/d/ajax',JSON.stringify(post_data),function(resp){
        //        self.rows = resp.rows
        //        self.row_pages = resp.row_pages
        //        cfg.hide_load()
        //    })
        //},
        save_rows: function save_rows(rows) {
            var self = this;
            var post_data = [{ fun: 'save_rows', rows: rows }];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                ex.each(rows, function (row) {
                    var new_row = ex.findone(resp.save_rows, { pk: row.pk });
                    ex.assign(row, new_row);
                });
                cfg.hide_load(2000);
            });
        },
        clear: function clear() {
            this.rows = [];
            this.row_pages = {};
        },

        del_selected: function del_selected() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                //var ss = layer.load(2);
                cfg.show_load();
                var post_data = [{ fun: 'del_rows', rows: self.selected }];
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    //self.row_pages.total -= self.selected.length
                    //ex.each(self.selected,function(item){
                    //    ex.remove(self.rows,{pk:item.pk} )
                    //})
                    //self.selected=[]
                    cfg.hide_load(500);
                    self.search();
                    //layer.msg('删除成功',{time:2000})
                });
            });
        },
        get_attr: function get_attr(name) {
            if (name == undefined) {
                return false;
            }
            if (name.startsWith('!')) {
                name = name.slice(1);
                name = name.trim();
                return !this[name];
            } else {
                name = name.trim();
                return this[name];
            }
        }
        //has_select:function(){
        //    return this.selected.length > 0
        //}

    }
};

var row_match = {
    one_row: function one_row(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else {
            return true;
        }
    },
    many_row: function many_row(self, head) {
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            return true;
        }
    },
    one_row_match: function one_row_match(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else {
            var field = head.match_field;
            var values = head.match_values;
            var msg = head.match_msg;

            var row = self.selected[0];

            if (!ex.isin(row[field], values)) {
                cfg.showMsg(msg);
                return false;
            } else {
                return true;
            }
        }
    },
    many_row_match: function many_row_match(self, head) {
        // head : @match_field , @match_values ,@match_msg
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            var field = head.match_field;
            var values = head.match_values;
            var msg = head.match_msg;

            for (var i = 0; i < self.selected.length; i++) {
                var row = self.selected[i];
                if (!ex.isin(row[field], values)) {
                    cfg.showMsg(msg);
                    return false;
                }
            }
            return true;
        }
    }
};

function swap(arr, k, j) {
    var c = arr[k];
    arr.splice(k, 1, arr[j]);
    arr.splice(j, 1, c);
    //arr[k] = arr[j];
    //arr[j] = c;
    return arr;
}

window.mix_table_data = mix_table_data;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_v_table_adapter = {

    mounted: function mounted() {
        eventBus.$on('content_resize', this.resize);
        eventBus.$on('openlayer_changed', this.refreshSize);
    },
    computed: {
        columns: function columns() {
            var self = this;
            var first_col = {
                width: 60,
                titleAlign: 'center',
                columnAlign: 'center',
                type: 'selection',
                isFrozen: true
            };
            var cols = [first_col];
            var converted_heads = ex.map(this.heads, function (head) {
                var col = ex.copy(head);
                var dc = {
                    field: head.name,
                    title: head.label,
                    isResize: true
                };
                if (head.editor) {
                    dc.componentName = head.editor;
                }
                if (ex.isin(head.name, self.row_sort.sortable)) {
                    dc.orderBy = '';
                }
                ex.assign(col, dc);
                if (!col.width) {
                    col.width = 200;
                }
                return col;
            });
            cols = cols.concat(converted_heads);
            return cols;
        }
    },
    methods: {
        refreshSize: function refreshSize() {
            this.$refs.vtable.resize();
        },
        resize: function resize() {
            var self = this;
            $(self.$refs.vtable.$el).find('.v-table-rightview').css('width', '100%');
            $(self.$refs.vtable.$el).find('.v-table-header').css('width', '100%');
            $(self.$refs.vtable.$el).find('.v-table-body').css('width', '100%');

            var tmid = setInterval(function () {
                self.$refs.vtable.resize();
            }, 50);
            setTimeout(function () {
                //self.$refs.vtable.resize()
                clearInterval(tmid);
            }, 600);
        },
        on_perpage_change: function on_perpage_change(perpage) {
            this.search_args._perpage = perpage;
            this.search_args._page = 1;
            this.getRows();
        },
        sortChange: function sortChange(params) {
            var self = this;
            ex.each(this.row_sort.sortable, function (name) {
                if (params[name]) {
                    if (params[name] == 'asc') {
                        self.search_args._sort = name;
                    } else {
                        self.search_args._sort = '-' + name;
                    }
                    return 'break';
                }
            });
            this.get_data();
        }
    }
};
window.mix_v_table_adapter = mix_v_table_adapter;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$.validator.config({
    rules: {
        mobile: [/^1[3-9]\d{9}$/, "请填写有效的手机号"],
        chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
        digit: function digit(element, params) {
            var digits = params[0];
            var pattern = "\\.\\d{0," + digits + "}$|^[\\d]+$";
            return RegExp(pattern).test(element.value) || '请确定有效位数为' + digits;
        },
        dot_split_int: function dot_split_int(element, params) {
            return (/^(\d+[,])*(\d+)$/.test(element.value) || '请输入逗号分隔的整数'
            );
        },
        ip: [/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, '请填写有效的 IP 地址']

    }
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _table_store = __webpack_require__(90);

var table_store = _interopRequireWildcard(_table_store);

var _table_page_store = __webpack_require__(89);

var table_page_store = _interopRequireWildcard(_table_page_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var user_info = {
    props: ['ctx'],
    template: ' <li class="dropdown user user-menu">\n                        <!-- Menu Toggle Button -->\n                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n                            <!-- The user image in the navbar-->\n                            <!--<img src="dist/img/user2-160x160.jpg" class="user-image" alt="User Image">-->\n                            <i class="fa fa-user-circle-o"></i>\n\n                            <!-- hidden-xs hides the username on small devices so only the image appears. -->\n                            <span class="hidden-xs" v-text="ctx.first_name || ctx.username">\n                            </span>\n                        </a>\n                        <ul class="dropdown-menu">\n                            <!-- The user image in the menu -->\n                            <li class="user-header" style="font-size: 3em;">\n                                <!--<img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">-->\n                                <i class="fa fa-user-circle-o fa-lg"></i>\n                                <p v-text="ctx.first_name || ctx.username">\n                                </p>\n                            </li>\n                            <!-- Menu Body -->\n                            <!--<li class="user-body">-->\n                                <!--<div class="row">-->\n                                    <!--<div class="col-xs-4 text-center">-->\n                                        <!--<a href="#">Followers</a>-->\n                                    <!--</div>-->\n                                    <!--<div class="col-xs-4 text-center">-->\n                                        <!--<a href="#">Sales</a>-->\n                                    <!--</div>-->\n                                    <!--<div class="col-xs-4 text-center">-->\n                                        <!--<a href="#">Friends</a>-->\n                                    <!--</div>-->\n                                <!--</div>-->\n                                <!--&lt;!&ndash; /.row &ndash;&gt;-->\n                            <!--</li>-->\n                            <!-- Menu Footer-->\n                            <li class="user-footer">\n                                <div class="pull-left">\n                                    <a href="/accounts/pswd" class="btn btn-default btn-flat" v-text="tr.change_password"></a>\n                                </div>\n                                <div class="pull-right">\n                                    <a href="/accounts/logout" class="btn btn-default btn-flat" v-text="tr.logout"></a>\n                                </div>\n                            </li>\n                        </ul>\n                    </li>',
    data: function data() {
        return {
            tr: cfg.tr
        };
    }
};

Vue.component('com-headbar-user-info', user_info);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fields_panel = __webpack_require__(5);

var fields_panel = _interopRequireWildcard(_fields_panel);

var _html_panel = __webpack_require__(93);

var html_panel = _interopRequireWildcard(_html_panel);

var _table_panel = __webpack_require__(96);

var table_panel = _interopRequireWildcard(_table_panel);

var _iframe = __webpack_require__(94);

var iframe = _interopRequireWildcard(_iframe);

var _html_content_panel = __webpack_require__(92);

var html_content_panel = _interopRequireWildcard(_html_content_panel);

var _form_panel = __webpack_require__(91);

var form_panel = _interopRequireWildcard(_form_panel);

var _pop_fields_panel = __webpack_require__(95);

var pop_fields_panel = _interopRequireWildcard(_pop_fields_panel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//var table_store={
//    namespace:true,
//    state(){
//        return {
//            childbus:new Vue(),
//        }
//    },
//    mutations:{
//    }
//}

//window.table_store = table_store


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
以html形式显示  _html_field 的内容
* */
var append_html_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-html="rowData[\'_html_\'+field]"></span>'

};

Vue.component('com-table-append-html-shower', append_html_shower);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
将 pk 数组映射为 label字符串
[1,2,3] -> '小王;小张;小赵'

* */
var array_mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            var self = this;
            var values = self.rowData[self.field];
            if (!values) {
                return values;
            }

            if (this.table_par) {
                if (this.head.parse_input) {
                    var values = parse_input[this.head.parse_input](values);
                }
                var value_labels = ex.map(values, function (value) {
                    var item = ex.findone(self.head.options, { value: value });
                    if (item) {
                        return item.label;
                    } else {
                        return '';
                    }
                    // {value:value,label:self.head.options[value]}
                });
                var ordered_values = ex.sortOrder(value_labels);

                //var str =''
                //ex.each(ordered_values,function(itm){
                //    str+=itm.label
                //    //str+= options[itm]
                //    str+=';'
                //})
                return ordered_values.join(';');
                //return options[value]
            }
        }

    }
};

var parse_input = {
    dotSplit: function dotSplit(str) {
        return str.split(',');
    }
};

Vue.component('com-table-array-mapper', array_mapper);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array_mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            var self = this;
            var values = self.rowData[self.field];
            if (!values) {
                return values;
            }
            var obj_list = JSON.parse(values);
            var out_list = ex.map(obj_list, function (item) {
                return item[self.head.key || 'label'];
            });
            return out_list.join(';');
        }
    }

};

Vue.component('com-table-array-obj-shower', array_mapper);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*

** 这个文件应该是不用了。。

映射[一个]
 options:{
 key:value
 }
 * */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
    },
    computed: {
        show_data: function show_data() {
            if (this.table_par) {
                var value = this.rowData[this.field];
                var head = ex.findone(this.table_par.heads, { name: this.field });
                var options = head.options;
                var opt = ex.findone(options, { value: value });
                return opt.label;
            }
        }
    }
};

Vue.component('com-table-array-option-mapper', mapper);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n       <el-switch\n              v-model="is_true"\n              active-color="#13ce66"\n              inactive-color="#ff4949">\n        </el-switch>\n    </span>',

    computed: {
        is_true: {
            get: function get() {
                var value = this.rowData[this.field];
                if (value == 1) {
                    return true;
                } else {
                    return value;
                }
            },
            set: function set(newValue) {
                var crt_value = this.rowData[this.field];
                if (crt_value == 0 || crt_value == 1) {
                    this.rowData[this.field] = newValue ? 1 : 0;
                } else {
                    this.rowData[this.field] = newValue;
                }
            }
        }
    }

};

Vue.component('com-table-bool-editor', bool_shower);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n    <i v-if="rowData[field]" style="color: green" class="fa fa-check-circle"></i>\n    <i v-else style="color: red" class="fa fa-times-circle"></i>\n    </span>'

};

Vue.component('com-table-bool-shower', bool_shower);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var call_fun = {
    // head: {fun:'xxx'}
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="rowData[field]" class="clickable" @click="on_click()"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { name: this.head.fun, row: this.rowData, head: this.head });
        }
    }
};

Vue.component('com-table-call-fun', call_fun);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(138);
var change_order = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="change-order">\n    <span class="arrow" @click="up()">\n    <i  class="fa fa-long-arrow-up"></i>\n    </span>\n    <span class="arrow" @click="down()">\n     <i  class="fa fa-long-arrow-down"></i>\n    </span>\n    </span>',
    methods: {
        up: function up() {
            this.$emit('on-custom-comp', { fun: 'row_up', row: this.rowData });
        },
        down: function down() {
            this.$emit('on-custom-comp', { fun: 'row_down', row: this.rowData });
        }
    }

};

Vue.component('com-table-change-order', change_order);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_editor = __webpack_require__(6);

__webpack_require__(139);

var check_box = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-checkbox\',{\'dirty\':is_dirty}]"><input style="width: 100%" @change="on_changed()" type="checkbox" v-model="rowData[field]"></div>',
    mixins: [_mix_editor.mix_editor]
};

Vue.component('com-table-checkbox', check_box);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var money_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_text" ></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    computed: {
        show_text: function show_text() {
            if (this.rowData[this.field]) {
                return parseFloat(this.rowData[this.field]).toFixed(this.head.digit);
            } else {
                return this.rowData[this.field];
            }
        }
    }

};

Vue.component('com-table-digit-shower', money_shower);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
额外的点击列，例如“详情”
head['label']=
head['fun']
* */

var extra_click = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="clickable" v-text="head.label" @click="on_click()"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { name: this.head.fun, row: this.rowData, head: this.head });
        }

    }
};

Vue.component('com-table-extraclick', extra_click);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 与 extra_click的区别是
 1. 可以添加多个按钮
 2. 根据filter返回不同的按钮
 * */

__webpack_require__(140);

var extra_click_plus = {
    props: ['rowData', 'field', 'index'],
    data: function data() {
        return {
            is_mobile: !ex.device.pc
        };
    },
    template: '<div :class="[\'extra-click-plus\',{\'mobile\':is_mobile}]"><span v-for="(ope,index) in operations">\n                <span v-if="ope.icon" class="icon">\n                      <span class="clickable item" v-html="ope.icon" @click="on_click(ope)"\n                      :title="ope.label"></span>\n                </span>\n                <span v-else>\n                    <span class="clickable item" v-text="ope.label" @click="on_click(ope)"></span>\n                    <span v-if="index < operations.length-1">/</span>  </span>\n                </span>\n                </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    computed: {
        operations: function operations() {
            if (this.head.filter) {
                if (typeof this.head.filter == 'string') {
                    var filter_fun = window[this.head.filter];
                } else {
                    var filter_fun = this.head.filter;
                }
                return filter_fun(this.head, this.rowData);
            } else {
                return this.head.operations;
            }
        }
    },

    methods: {
        on_click: function on_click(ope) {
            this.$emit('on-custom-comp', { name: ope.fun, row: this.rowData, head: this.head });
        }

    }
};

Vue.component('com-table-extraclick-plus', extra_click_plus);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var foreign_click_select = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="clickable" v-text="rowData[field]" @click="on_click()"></span>',
    data: function data() {
        return {
            parStore: ex.vueParStore(this),
            label: '_' + this.field + '_label'
        };
    },
    computed: {},
    methods: {
        on_click: function on_click() {
            //this.$emit('on-custom-comp',{fun:'send_select',row:this.rowData})
            this.parStore.$emit('finish', this.rowData);
        }
    }
};

Vue.component('com-table-foreign-click-select', foreign_click_select);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-html="rowData[field]"></span>'

};

Vue.component('com-table-html-shower', bool_shower);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n    <a :href="link" target="_blank" v-text="rowData[field]"></a>\n    </span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        link: function link() {
            return this.rowData[this.head.link_field];
        }
    }

};

Vue.component('com-table-jump-link', bool_shower);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var label_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_text"></span>',
    data: function data() {
        return {
            label: '_' + this.field + '_label'
        };
    },
    computed: {
        show_text: function show_text() {
            return this.rowData[this.label] || '';
        }
    }
};

Vue.component('com-table-label-shower', label_shower);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(141);
var line_text = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-linetext\',{\'dirty\':is_dirty}]">\n        <span v-if="readonly" v-text="rowData[field]"></span>\n        <input v-else @change="on_changed()" style="width: 100%" type="text" v-model="rowData[field]">\n    </div>',
    data: function data() {
        return {
            org_value: this.rowData[this.field]
        };
    },
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        is_dirty: function is_dirty() {
            return this.rowData[this.field] != this.org_value;
        },
        readonly: function readonly() {
            if (this.head.readonly) {
                return _readonly[this.head.readonly.fun](this, this.head.readonly);
            } else {
                return false;
            }
        }
    },
    watch: {
        'rowData._hash': function rowData_hash() {
            this.org_value = this.rowData[this.field];
        }
    },
    methods: {
        getRowValue: function getRowValue(field) {
            return this.rowData[field];
        },
        on_changed: function on_changed() {
            var value = this.rowData[this.field];
            if (value == this.org_value) {
                this.$emit('on-custom-comp', { name: 'row_changed_undo_act', row: this.rowData });
            } else {
                this.$emit('on-custom-comp', { name: 'row_changed', row: this.rowData });
            }
        }
    }
};

Vue.component('com-table-linetext', line_text);

var _readonly = {
    checkRowValue: function checkRowValue(self, kws) {
        var field = kws.field;
        var target_value = kws.target_value;
        return self.rowData[field] == target_value;
    }
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _pop_fields_from_row = __webpack_require__(97);

var pop_fields_from_row = _interopRequireWildcard(_pop_fields_from_row);

var _sequence = __webpack_require__(98);

var sequence = _interopRequireWildcard(_sequence);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
options:{
    key:value
}
* */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            if (this.table_par) {
                var value = this.rowData[this.field];
                var options = this.head.options;
                var opt = ex.findone(options, { value: value });
                if (opt) {
                    return opt['label'];
                } else {
                    return value;
                }
            }
        }
    }
};

Vue.component('com-table-mapper', mapper);

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 额外的点击列，例如“详情”
 * */

/*
* head={
*
* }
* */
var operations = {
    props: ['rowData', 'field', 'index'],
    template: '<div>\n        <span style="margin-right: 1em" v-for="op in head.operations" v-show="! rowData[\'_op_\'+op.name+\'_hide\']" class="clickable" v-text="op.label" @click="on_click()"></span>\n    </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { name: this.head.extra_fun, row: this.rowData });
        }

    }
};

Vue.component('com-table-operations', operations);

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
var picture = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n        <img @load=\'loaded=true\' :style="cusStyle"  @click="open()" :src="src" alt="" height="96px" style="cursor: pointer;">\n        </span>',
    data: function data() {
        return {
            loaded: false
        };
    },
    watch: {
        src: function src() {
            this.loaded = false;
        }
    },
    computed: {
        src: function src() {
            return this.rowData[this.field];
        },
        cusStyle: function cusStyle() {
            if (!this.loaded) {
                return {
                    visibility: 'hidden'
                };
            } else {
                return {
                    visibility: 'visible'
                };
            }
        }
    },
    methods: {
        open: function open() {
            window.open(this.rowData[this.field]);
        }
    }
};

Vue.component('com-table-picture', picture);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var pop_fields = exports.pop_fields = {
    template: '<span v-text="show_text" @click="edit_me()" class="clickable"></span>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            if (this.head.show_label) {
                return show_label[this.head.show_label.fun](this.rowData, this.head.show_label);
            } else {
                return this.rowData[this.field];
            }
        }
    },
    methods: {
        edit_me: function edit_me() {
            this.open_layer();
        },
        open_layer: function open_layer() {
            var self = this;
            var fields_ctx = {
                heads: self.table_par.head.fields_heads,
                ops: [{
                    'name': 'save', 'editor': 'com-field-op-btn', 'label': '确定', 'icon': 'fa-save'
                }],
                extra_mixin: []
            };

            var win = pop_edit_local(self.rowData, fields_ctx, function (new_row) {
                ex.assign(self.rowData, new_row);
                //self.$emit('on-custom-comp',{fun:'edit_over'} )
                layer.close(win);
            });
        }

    }
};
Vue.component('com-table-pop-fields-local', pop_fields);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }

    //var get_row={
    //    use_table_row:function(callback,row,kws){
    //        callback(row)
    //    },
    //    get_table_row:function(callback,row,kws){
    //        var cache_row=ex.copy(row)
    //        callback(cache_row)
    //    },
    //    get_with_relat_field:function(callback,row,kws){
    //        var director_name=kws.director_name
    //        var relat_field = kws.relat_field
    //
    //        var dc ={fun:'get_row',director_name:director_name}
    //        dc[relat_field] = row[relat_field]
    //        var post_data=[dc]
    //        cfg.show_load()
    //        ex.post('/d/ajax',JSON.stringify(post_data),function(resp){
    //            cfg.hide_load()
    //            callback(resp.get_row)
    //        })
    //
    //    }
    //}
    //
    //var after_save={
    //    do_nothing:function(self,new_row,old_row,table){
    //    },
    //    update_or_insert:function(self,new_row,old_row){
    //        self.$emit('on-custom-comp',{name:'update_or_insert',new_row:new_row,old_row:old_row})
    //        //if(! old_row.pk) {
    //        //    table.rows.splice(0, 0, new_row)
    //        //}else{
    //        //    ex.assign(table.rowData,new_row)
    //        //}
    //
    //
    //    }
    //}

};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*

 * */

var pop_table = exports.pop_table = {
    template: '<span @click="open_layer()" class="clickable">\n        <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n        <span v-else v-text="show_text"  ></span>\n    </span>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            return this.rowData[this.field];
        }
    },
    methods: {
        open_layer: function open_layer() {
            var table_ctx = init_table_ctx(this.head.table_ctx);
            pop_table_layer(this.rowData, table_ctx, function () {});
        }

    }
};
Vue.component('com-table-pop-table', pop_table);

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_editor = __webpack_require__(6);

__webpack_require__(142);


var select = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-select\',{\'dirty\':is_dirty}]">\n            <el-dropdown trigger="click" placement="bottom" @command="handleCommand">\n                <span class="el-dropdown-link clickable" v-html="show_label"></span>\n                <el-dropdown-menu slot="dropdown">\n                    <el-dropdown-item v-for="op in head.options"\n                    :command="op.value"\n                    :class="{\'crt-value\':rowData[field]==op.value}" >\n                    <div v-text="op.label"></div>\n                    </el-dropdown-item>\n                </el-dropdown-menu>\n            </el-dropdown>\n        </div>\n\n    ',
    data: function data() {
        return {};
    },
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    mixins: [_mix_editor.mix_editor],
    computed: {
        show_label: function show_label() {
            var value = this.rowData[this.field];
            var opt = ex.findone(this.head.options, { value: value });
            return opt.html_label || opt.label;
        }
    },
    methods: {
        handleCommand: function handleCommand(command) {
            //this.$message('click on item ' + command);
            if (this.rowData[this.field] != command) {
                this.rowData[this.field] = command;
                this.on_changed();
            }
        },

        setSelect: function setSelect(value) {
            if (this.rowData[this.field] != value) {
                this.rowData[this.field] = value;
                this.on_changed();
            }
        }
        //on_changed:function(){
        //    this.$emit('on-custom-comp',{name:'row_changed',row:this.rowData})
        //}
    }
};

Vue.component('com-table-select', select);

//Vue.component('com-table-select',function(resolve,reject){
//    ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//    ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//        resolve(select)
//    })
//})


//var select = {
//    props:['rowData','field','index'],
//    template:`<div >
//    <select style="width: 100%" @change="on_changed()"  v-model="rowData[field]">
//        <option v-for="op in head.options" :value="op.value" v-text="op.label"></option>
//    </select>
//    </div>`,
//    data:function(){
//        return {
//        }
//    },
//    created:function(){
//        // find head from parent table
//        var table_par = this.$parent
//        while (true){
//            if (table_par.heads){
//                break
//            }
//            table_par = table_par.$parent
//            if(!table_par){
//                break
//            }
//        }
//        this.table_par = table_par
//        this. head  = ex.findone(this.table_par.heads,{name:this.field})
//    },
//    methods:{
//        on_changed:function(){
//            this.$emit('on-custom-comp',{name:'row_changed',row:this.rowData})
//        }
//    }
//}

//Vue.component('com-table-select',select)

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var switch_to_tab = {
    props: ['rowData', 'field', 'index'],
    template: '<span @click="goto_tab()" class="clickable">\n     <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n    <span v-else v-text="rowData[field]"></span>\n    </span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        var head = ex.findone(table_par.heads, { name: this.field });
        this.head = head;
    },
    methods: {
        goto_tab: function goto_tab() {
            this.$emit('on-custom-comp', {
                fun: 'switch_to_tab',
                tab_name: this.head.tab_name,
                ctx_name: this.head.ctx_name,
                named_tabs: this.head.named_tabs, // 准备淘汰
                par_row: this.rowData
            });
            //eventBus.$emit('switch_to_tab',
            //    {
            //        name:'switch_to_tab',
            //        tab_name:this.head.tab_name,
            //        named_tabs:this.head.named_tabs,
            //        row:this.rowData
            //    })
        }
    }
};

Vue.component('com-table-switch-to-tab', switch_to_tab);

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _table_grid = __webpack_require__(103);

var table_grid = _interopRequireWildcard(_table_grid);

var _operations = __webpack_require__(100);

var operations = _interopRequireWildcard(_operations);

var _filter = __webpack_require__(99);

var filter = _interopRequireWildcard(_filter);

var _pagination = __webpack_require__(101);

var pagination = _interopRequireWildcard(_pagination);

var _parents = __webpack_require__(102);

var parents = _interopRequireWildcard(_parents);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 无用了。准备删除
var delete_op = {
    props: ['name'],
    template: ' <a class="clickable" @click="delete_op()" :disabled="!enable">\u5220\u9664</a>',
    data: function data() {
        return {
            enable: false
        };
    },
    methods: {
        delete_op: function delete_op() {
            this.$emit('operation', this.name);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-delete', delete_op);

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head'],
    template: ' <a class="clickable" @click="operation_call()"  :style="head.style">\n    <i v-if="head.icon" :class=\'["fa",head.icon]\'></i> <span  v-text="head.label"></span></a>',
    data: function data() {
        return {
            enable: true
        };
    },
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-a', op_a);

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head', 'disabled'],
    template: ' <span style="margin-left: 3px">\n    <button :class="norm_class" @click="operation_call()"  :style="head.style" :disabled="disabled">\n        <i v-if="head.icon" :class=\'["fa",head.icon]\'></i>\n        <span  v-text="head.label"></span>\n    </button>\n    </span>',
    data: function data() {
        return {
            enable: true
        };
    },
    computed: {
        norm_class: function norm_class() {
            if (this.head.class) {
                return 'btn btn-sm ' + this.head.class;
            } else {
                return 'btn btn-sm btn-default';
            }
        }
    },
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name || this.head.fun);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-btn', op_a);

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function init_table_ctx(ctx) {
    ctx.search_args = ctx.search_args || {};

    ctx.row_sort = ctx.row_sort || { sortable: [] };
    ctx.footer = ctx.footer || [];
    ctx.ops = ctx.ops || [];
    ctx.row_pages = ctx.row_pages || { crt_page: 1, total: 0, perpage: 20 };

    ctx.row_filters = ctx.row_filters || [];
    ctx.director_name = ctx.director_name || '';

    if (ctx.selectable == undefined) {
        ctx.selectable = true;
    }

    return ctx;
}

function init_table_bus(bus) {
    //bus.search_args= bus.search_args || {}
    //bus.row_sort =bus.row_sort || {sortable:[]}
    //bus.footer =bus.footer || []
    //bus.ops = bus.ops || []
    //bus.row_pages= bus.row_pages || {crt_page:1,total:0,perpage:20}

    bus = init_table_ctx(bus);
    bus.eventBus = new Vue();
    return bus;
}

var ele_table = {
    props: ['bus'],
    created: function created() {
        this.bus.table = this;
    },
    data: function data() {
        return {
            heads: this.bus.heads,
            //rows:this.bus.rows,
            search_args: this.bus.search_args,
            row_sort: this.bus.row_sort
            //footer:this.bus.footer
        };
    },
    mounted: function mounted() {
        this.bus.eventBus.$on('search', this.bus_search);
        this.bus.eventBus.$on('pageindex-change', this.get_page);
        this.bus.eventBus.$on('operation', this.on_operation);
        this.bus.eventBus.$on('perpage-change', this.on_perpage_change);
    },
    methods: {
        bus_search: function bus_search(search_args) {
            ex.assign(this.search_args, search_args);
            this.search();
        }
    },
    //watch:{
    //    bus_serarch_count:function(){
    //        this.search()
    //    }
    //},
    computed: {
        //bus_serarch_count:function(){
        //    return this.bus.search_count
        //},
        rows: {
            get: function get() {
                return this.bus.rows;
            },
            set: function set(v) {
                this.bus.rows = v;
            }
        },
        footer: {
            get: function get() {
                return this.bus.footer;
            },
            set: function set(v) {
                this.bus.footer = v;
            }
            //search_args:{
            //    get:function(){
            //        return this.bus.search_args
            //    },
            //    set:function(v){
            //        this.bus.search_args=v
            //    }
            //}
        } },
    // height="100%"
    //style="width: 100%"
    mixins: [mix_table_data, mix_ele_table_adapter],
    template: '  <el-table class="table flat-head" ref="e_table"\n                              :data="rows"\n                              border\n                              show-summary\n                              :fit="false"\n                              :stripe="true"\n                              size="mini"\n                              @sort-change="sortChange($event)"\n                              @selection-change="handleSelectionChange"\n                              :summary-method="getSum">\n                        <el-table-column v-if="bus.selectable"\n                                type="selection"\n                                width="55">\n                        </el-table-column>\n\n                        <template  v-for="head in heads">\n\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :label="head.label"\n                                             :prop="head.name.toString()"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :prop="head.name.toString()"\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n\n                    </el-table>\n'
};
var ele_operations = {
    props: ['bus'],
    //                      :disabled="get_attr(op.disabled)"
    //v-show="! get_attr(op.hide)"
    template: '<div class="oprations" style="padding: 5px;">\n                <component v-for="op in ops"\n                           :is="op.editor"\n                           :ref="\'op_\'+op.name"\n                           :head="op"\n                           @operation="on_operation(op)"></component>\n            </div>',
    data: function data() {
        return {
            ops: this.bus.ops
        };
    },
    methods: {
        get_attr: function get_attr(attr) {
            return this.bus.table.get_attr(attr);
        },
        on_operation: function on_operation(op) {
            this.bus.eventBus.$emit('operation', op);
        }
    }
};

var ele_filter = {
    props: ['bus'],
    computed: {},
    template: ' <com-filter class="flex" :heads="bus.row_filters" :search_args="bus.search_args"\n                        @submit="search()"></com-filter>',
    methods: {
        search: function search() {
            this.bus.eventBus.$emit('search', this.bus.search_args);
        }
    }
};

var ele_page = {
    props: ['bus'],
    data: function data() {
        return {
            row_pages: this.bus.row_pages,
            search_args: this.bus.search_args
        };
    },
    methods: {
        on_page_change: function on_page_change(v) {
            this.bus.eventBus.$emit('pageindex-change', v);
        },
        on_perpage_change: function on_perpage_change(v) {
            this.bus.eventBus.$emit('perpage-change', v);
        }
    },
    //  @size-change="on_perpage_change"
    //@current-change="get_page"
    template: ' <el-pagination\n                         @size-change="on_perpage_change"\n                        @current-change="on_page_change"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>'
};

Vue.component('com-table-bus', ele_table);
Vue.component('com-table-bus-ops', ele_operations);
Vue.component('com-table-bus-filter', ele_filter);
Vue.component('com-table-bus-page', ele_page);

window.init_table_ctx = init_table_ctx;
window.init_table_bus = init_table_bus;

window.bus_ele_table_logic = ele_table;

window.ele_table_logic = ele_table;
window.ele_table_page_logic = ele_page;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ajax_fields = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var data_row = this.tab_head.row || {};
        return {
            heads: this.tab_head.heads,
            ops: this.tab_head.ops,
            errors: {},
            row: data_row
        };
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: '<div class="flex-v"  style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 3em;">\n\n    <div>\n        <div class=\'field-panel suit\' id="form" >\n            <field  v-for=\'head in normed_heads\' :key="head.name" :head="head" :row=\'row\'></field>\n        </div>\n    </div>\n\n    <div class="oprations" style="margin-left: 3em;margin-top: 2em;">\n        <component v-for="op in ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    </div>\n    </div>',

    //created:function(){
    //    // find head from parent table
    //    var table_par = this.$parent
    //    while (true){
    //        if (table_par.heads){
    //            break
    //        }
    //        table_par = table_par.$parent
    //        if(!table_par){
    //            break
    //        }
    //    }
    //    this.table_par = table_par
    //},

    mounted: function mounted() {
        if (!this.tab_head.row) {
            this.get_data();
        }
    },
    methods: {
        //on_show:function(){
        //    if(! this.fetched){
        //        this.get_data()
        //        this.fetched = true
        //    }
        //},
        data_getter: function data_getter() {
            var self = this;
            var fun = get_data[self.tab_head.get_data.fun];
            var kws = self.tab_head.get_data.kws;
            fun(self, function (row) {
                //ex.assign(self.row,row)
                self.row = row;
            }, kws);

            //var self=this
            //cfg.show_load()
            //var dt = {fun:'get_row',model_name:this.model_name}
            //dt[this.relat_field] = this.par_row[this.relat_field]
            //var post_data=[dt]
            //$.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //    self.row=resp.get_row
            //    cfg.hide_load()
            //})
        },
        after_save: function after_save(new_row) {
            if (this.tab_head.after_save) {
                var fun = _after_save[this.tab_head.after_save.fun];
                var kws = this.tab_head.after_save.kws;
                // new_row ,old_row
                fun(this, new_row, kws);

                //if(  self.par_row._director_name == row._director_name){
                //    // ，应该将新的属性值 去更新par_row
                //    ex.vueAssign(self.par_row,row)
                //}
            }
            this.row = new_row;
        }
        // data_getter  回调函数，获取数据,


    } };

Vue.component('com_tab_fields', ajax_fields);

var get_data = {
    get_row: function get_row(self, callback, kws) {
        //kws={model_name ,relat_field}
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;
        var dt = { fun: 'get_row', director_name: director_name };
        dt[relat_field] = self.par_row[relat_field];
        var post_data = [dt];
        cfg.show_load();
        $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    },
    table_row: function table_row(self, callback, kws) {
        callback(self.par_row);
    }
};

var _after_save = {
    update_or_insert: function update_or_insert(self, new_row, kws) {
        var old_row = self.old_row;
        // 要update_or_insert ，证明一定是 更新了 par_row
        ex.vueAssign(self.par_row, new_row);
        self.$emit('tab-event', { name: 'update_or_insert', new_row: self.par_row, old_row: old_row });
    },
    do_nothing: function do_nothing(self, new_row, kws) {},

    update_par_row_from_db: function update_par_row_from_db(self, new_row, kws) {
        //
        var post_data = [{ fun: 'get_row', director_name: self.par_row._director_name, pk: self.par_row.pk }];
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            ex.vueAssign(self.par_row, resp.get_row);
        });
    }
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ajax_table = {
    props: ['tab_head', 'par_row'], //['heads','row_filters','kw'],
    data: function data() {
        var heads_ctx = this.tab_head.table_ctx;
        return {
            heads: heads_ctx.heads,
            row_filters: heads_ctx.row_filters,
            row_sort: heads_ctx.row_sort,
            director_name: heads_ctx.director_name,
            footer: heads_ctx.footer || [],
            ops: heads_ctx.ops || [],
            rows: [],
            row_pages: {},
            selectable: heads_ctx.selectable == undefined ? true : heads_ctx.selectable,

            selected: [],
            del_info: [],

            search_args: {}
        };
    },
    mixins: [mix_table_data, mix_ele_table_adapter],
    //watch:{
    //    // 排序变换，获取数据
    //    'row_sort.sort_str':function(v){
    //        this.search_args._sort=v
    //        this.get_data()
    //    }
    //},
    template: '<div class="rows-block flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;" >\n        <div class=\'flex\' style="min-height: 3em;" v-if="row_filters.length > 0">\n            <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                        @submit="search()"></com-filter>\n            <div class="flex-grow"></div>\n        </div>\n\n        <div  v-if="ops.length>0">\n            <div class="oprations" style="padding: 5px">\n                <component v-for="op in ops"\n                           :is="op.editor"\n                           :ref="\'op_\'+op.name"\n                           :head="op"\n                           :disabled="get_attr(op.disabled)"\n                           v-show="! get_attr(op.hide)"\n                           @operation="on_operation(op)"></component>\n            </div>\n        </div>\n\n        <div class="box box-success flex-grow">\n            <div class="table-wraper" style="position: absolute;top:0;left:0;bottom: 0;right:0;">\n               <el-table class="table" ref="e_table"\n                              :data="rows"\n                              border\n                              show-summary\n                              :span-method="arraySpanMethod"\n                              :fit="false"\n                              :stripe="true"\n                              size="mini"\n                              @sort-change="sortChange($event)"\n                              @selection-change="handleSelectionChange"\n                              :summary-method="getSum"\n                              height="100%"\n                              style="width: 100%">\n\n                            <el-table-column\n                                    v-if="selectable"\n                                     type="selection"\n                                    :width="55">\n                            </el-table-column>\n                        <template  v-for="head in heads">\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :prop="head.name"\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n\n                    </el-table>\n            </div>\n\n        </div>\n          <div v-if="row_pages.crt_page">\n                    <el-pagination\n                        @size-change="on_perpage_change"\n                        @current-change="get_page"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>\n            </div>\n    </div>',

    mounted: function mounted() {
        this.search();
    },
    methods: {
        //on_show:function(){
        //    if(! this.fetched){
        //        this.search()
        //        this.fetched = true
        //    }
        //},
        getRows: function getRows() {
            //
            var self = this;
            if (self.tab_head.tab_field) {
                self.search_args[self.tab_head.tab_field] = self.par_row[self.tab_head.par_field];
            } else {
                self.search_args[self.tab_head.par_field] = self.par_row[self.tab_head.par_field];
            }

            ex.vueSuper(self, { fun: 'getRows' });
            //var fun = get_data[this.tab_head.get_data.fun ]
            //fun(function(rows,row_pages,footer){
            //    self.rows = rows
            //    self.row_pages =row_pages
            //    self.footer = footer
            //
            //},this.par_row,this.tab_head.get_data.kws,this.search_args)
        },
        add_new: function add_new(kws) {
            var self = this;
            var inn_kws = ex.copy(kws);
            var init_fields = {};
            if (self.tab_head.tab_field) {
                init_fields[self.tab_head.tab_field] = self.par_row[self.tab_head.par_field];
            } else {
                init_fields[self.tab_head.par_field] = self.par_row[self.tab_head.par_field];
            }
            var dc = { fun: 'add_new', init_fields: init_fields };
            ex.assign(inn_kws, dc);
            ex.vueSuper(this, inn_kws);
        },
        arraySpanMethod: function arraySpanMethod(_ref) {
            var row = _ref.row,
                column = _ref.column,
                rowIndex = _ref.rowIndex,
                columnIndex = _ref.columnIndex;

            if (this.table_layout) {
                return this.table_layout[rowIndex + ',' + columnIndex] || [1, 1];
            } else {
                return [1, 1];
            }
            //var head = this.heads[columnIndex]

            //return [1,1]
        }
    }
};

Vue.component('com_tab_table', ajax_table);

//var get_data={
//    get_rows:function(callback,row,kws,search_args){
//        var relat_field = kws.relat_field
//        var director_name = kws.director_name
//
//        var self=this
//        var relat_pk = row[kws.relat_field]
//        var relat_field = kws.relat_field
//        search_args[relat_field] = relat_pk
//        var post_data=[{fun:'get_rows',search_args:search_args,director_name:director_name}]
//        cfg.show_load()
//        $.post('/d/ajax',JSON.stringify(post_data),function(resp){
//            cfg.hide_load()
//            callback(resp.get_rows.rows,resp.get_rows.row_pages,resp.get_rows.footer)
//            //self.rows = resp.get_rows.rows
//            //self.row_pages =resp.get_rows.row_pages
//        })
//    }
//}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tab_table = __webpack_require__(105);

var tab_table = _interopRequireWildcard(_tab_table);

var _tab_fields = __webpack_require__(104);

var tab_fields = _interopRequireWildcard(_tab_fields);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(117);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./element_ex.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./element_ex.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(118);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(119);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(120);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(121);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_page.scss", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_page.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(127);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_editor_base.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_editor_base.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_field_invite_code = {
    props: ['row', 'head'],
    created: function created() {

        if (search_args[this.head.key]) {
            this.row[this.head.name] = search_args[this.head.key];
        }
    },
    template: '<div class="com-field-invite-code">\n        <com-field-linetext :head="head" :row="row"></com-field-linetext>\n    </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-invite-code', com_field_invite_code);

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var line_text = {
        props: ['row', 'head'],
        template: '<div :style="head.style">\n            \t\t\t<span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t\t<input v-else type="text" class="form-control input-sm" v-model="row[head.name]"\n            \t\t \t    :id="\'id_\'+head.name" :name="head.name"\n                        \t:placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>\n                       </div>'
};
Vue.component('com-field-linetext', line_text);

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(8);

var com_form = exports.com_form = {
    props: {
        heads: '',
        row: '',
        options: {}
        //autoWidth:{
        //    default:function(){
        //        return true
        //    }
        //},
        //btnCls:{
        //    default:function(){
        //        return 'btn-primary btn-sm'
        //    }
        //}
    },
    data: function data() {
        return {
            okBtn: this.option.okBtn || '确定',
            //autoWidth:this.option.autoWidth==undefined?true:this.option.autoWidth,
            small_srn: ex.is_small_screen(),
            small: false
        };
    },
    mounted: function mounted() {
        // 由于与nicevalidator 有冲突，所以等渲染完成，再检测
        setTimeout(function () {
            if ($(this.$el).width() < 600) {
                this.small = true;
            } else {
                this.small = false;
            }
        }, 10);
    },
    computed: {
        normed_heads: function normed_heads() {
            return this.heads;
        },
        label_width: function label_width() {
            if (!this.autoWith) {}
            var max = 4;
            ex.each(this.heads, function (head) {
                if (max < head.label.length) {
                    max = head.label.length;
                }
            });
            max += 1;
            return { width: max + 'em' };
        }
    },
    //created:function(){
    //    if(!this.okBtn){
    //        this.okBtn='确定'
    //    }
    //},
    components: window._baseInput,
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div :class="[\'field-panel sim-fields\',{\'small\':small,\'msg-bottom\':small}]"\n    style="text-align:center;">\n           <table class="table-fields">\n        <tr v-for="head in heads">\n            <td class="field-label-td"  valign="top" >\n            <div class="field-label" :style="label_width">\n                <span class="label-content">\n                     <span v-text="head.label"></span>\n                     <span class="req_star" v-if=\'head.required\'>*</span>\n                </span>\n\n\n            </div>\n\n            </td>\n            <td class="field-input-td" >\n                <div class="field-input">\n                    <component v-if="head.editor" :is="head.editor"\n                         @field-event="$emit(\'field-event\',$event)"\n                         :head="head" :row="row"></component>\n\n                </div>\n            </td>\n            <td>\n                <span v-if="head.help_text" class="help-text clickable">\n                            <i style="color: #3780af;position: relative;top:10px;"   @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n                </span>\n            </td>\n        </tr>\n        <slot :row="row">\n            <!--\u6309\u94AE\u6A2A\u8DE8\u4E24\u5217 \uFF01\u5C0F\u5C3A\u5BF8\u65F6 \u5F3A\u5236 -->\n             <tr v-if="crossBtn || small" class="btn-row">\n                <td class="field-input-td" colspan="3">\n                    <div class="submit-block">\n                        <button @click="submit" type="btn"\n                            :class="[\'form-control btn\',btnCls]"><span v-text="okBtn"></span></button>\n                    </div>\n                </td>\n            </tr>\n            <!--\u6309\u94AE\u5728\u7B2C\u4E8C\u5217-->\n               <tr v-else class="btn-row">\n                   <td class="field-label-td"></td>\n                    <td class="field-input-td" colspan="1">\n                        <div class="submit-block">\n                            <button @click="panel_submit" type="btn"\n                                class="btn "><span v-text="okBtn"></span></button>\n                        </div>\n                     </td>\n                     <td></td>\n               </tr>\n        </slot>\n\n    </table>\n\n\n        </div>',
    methods: {

        panel_submit: function panel_submit() {
            if (this.$listeners && this.$listeners.submit) {
                if (this.isValid()) {
                    this.$emit('submit', this.row);
                }
            } else {
                this.submit();
            }
        },
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        },
        after_save: function after_save(row) {
            this.$emit('after-save', row);
        }

    }
};

window.com_form = com_form;

Vue.component('com-form', com_form);

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _suit_fields = __webpack_require__(4);

var suit_fields_local = {
    mixins: [_suit_fields.suit_fields],
    methods: {
        submit: function submit() {
            if (this.isValid()) {
                this.$emit('finish', this.row);
            }
        }
    }
};

window.suit_fields_local = suit_fields_local;

Vue.component('com-suit-fields-local', suit_fields_local);

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var com_pop_field = exports.com_pop_field = {
    props: ['row', 'heads', 'ops'],
    mixins: [mix_fields_data, mix_nice_validator],
    //computed:{
    //    real_heads:function(){
    //        if(this.dict_heads){
    //            return this.dict_heads
    //        }else{
    //            return this.heads
    //        }
    //    }
    //},
    methods: {
        after_save: function after_save(new_row) {
            //this.$emit('sub_success',{new_row:new_row,old_row:this.row})
            this.$emit('submit-success', new_row);
            ex.assign(this.row, new_row);
            this.$emit('finish', new_row);
        },
        del_row: function del_row() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                var ss = layer.load(2);
                var post_data = [{ fun: 'del_rows', rows: [self.row] }];
                $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    layer.close(ss);
                    self.$emit('del_success', self.row);
                });
            });
        }
    },
    template: '<div class="flex-v com-pop-fields" style="margin: 0;height: 100%;">\n    <div class = "flex-grow" style="overflow: auto;margin: 0;">\n        <div class="field-panel suit" >\n            <field  v-for="head in normed_heads" :key="head.name" :head="head" :row="row"></field>\n        </div>\n      <div style="height: 1em;">\n      </div>\n    </div>\n     <div style="text-align: right;padding: 8px 3em;">\n        <component v-for="op in ops" :is="op.editor" @operation="on_operation(op)" :head="op"></component>\n    </div>\n     </div>',
    data: function data() {
        return {
            fields_kw: {
                heads: this.heads,
                row: this.row,
                errors: {}
            }
        };
    }
};

window.com_pop_field = com_pop_field;
//Vue.component('com-pop-fields',)

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_page_store = {
    data: function data() {
        return {
            tab_stack: [],
            tabs: [],
            //named_tabs:[],
            childStore_event_slot: childStore_event_slot
        };
    },
    created: function created() {
        var self = this;
        // 这个不用了，转到 table_store 里面去了
        ex.each(this.childStore_event_slot, function (router) {
            self.$on(router.event, function (e) {
                var kws = ex.eval(router.kws, e);
                self[router.fun](kws);
            });
        });
    },
    methods: {
        hello: function hello(mm) {
            alert(mm);
        },
        update_ctx: function update_ctx(kws) {
            var post_data = kws.post_data || {};
            ex.director_call(kws.director_name, post_data, function (resp) {

                //Vue.set(named_ctx,router.ctx_name,resp)
                named_ctx[kws.ctx_name] = resp;
            });
        },
        switch_to_tab: function switch_to_tab(kws) {
            var self = this;
            var tabs = named_ctx[kws.ctx_name];
            //if(kws.named_tabs){
            //    // 传入named_tabs，造成tabs的切换
            //    var next_tabs = self.named_tabs[kws.named_tabs]
            //}else {
            //    var next_tabs = self.tabs
            //}
            self.tab_stack.push({
                widget: 'com-widget-el-tab',
                tabs: tabs,
                crt_tab_name: kws.tab_name,
                par_row: kws.par_row

            });
            self.crt_row = kws.row;
        },
        pop_tab_stack: function pop_tab_stack() {

            if (this.tab_stack.length != 0) {
                this.tab_stack.pop();
            }
            //                if(this.tab_stack.length==0){
            //                    this.tabgroup.crt='_main'
            //                    this.tabgroup.crt_tabs=[]
            //                }
            var self = this;
            Vue.nextTick(function () {
                // 返回table页面时，可能是由于布局原因，造成table看不见
                self.e_table.doLayout();
            });
        }
    }
};

window.table_page_store = table_page_store;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_store = {
    data: function data() {
        return {
            parents: [],
            heads: [],
            rows: [],
            row_filters: {},
            row_sort: {},
            row_pages: {},
            director_name: '',
            footer: [],
            selected: [],
            search_args: {}, //ex.parseSearch(),
            ops: [],
            crt_row: {},
            selectable: true,
            changed_rows: [],
            event_slots: []
        };
    },
    mixins: [mix_ele_table_adapter],
    created: function created() {
        var self = this;
        ex.each(this.event_slots, function (router) {
            self.$on(router.event, function (e) {
                ex.eval(router.express, { event: e, ts: self });
            });
        });
    },
    computed: {
        changed: function changed() {
            return this.changed_rows.length != 0;
        },
        has_select: function has_select() {
            return this.selected.length != 0;
        }
    },
    methods: {
        express: function express(kws) {
            var self = this;
            var row_match_fun = kws.row_match;
            if (row_match_fun && !row_match[row_match_fun](self, kws)) {
                return;
            }
            if (kws.confirm_msg) {
                layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                    layer.close(index);
                    ex.eval(kws.express, self);
                });
            } else {
                var real_kws = ex.copy(kws);
                if (kws.update_kws) {
                    ex.assign(real_kws, ex.eval(real_kws, { ts: self, kws: kws }));
                }
                ex.eval(real_kws.express, { ts: self, kws: real_kws });
            }
        },
        search: function search() {
            this.search_args._page = 1;
            this.getRows();
        },
        getRows: function getRows() {
            /*
             以后都用这个函数，不用什么get_data 或者 data_getter 了
             * */
            var self = this;

            cfg.show_load();
            self.rows = [];

            var post_data = [{ fun: 'get_rows', director_name: self.director_name, search_args: self.search_args }];
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {

                self.rows = resp.get_rows.rows;
                ex.vueAssign(self.row_pages, resp.get_rows.row_pages);
                //self.row_pages = resp.get_rows.row_pages
                //self.search_args=resp.get_rows.search_args
                ex.vueAssign(self.search_args, resp.get_rows.search_args);
                self.footer = resp.get_rows.footer;
                self.parents = resp.get_rows.parents;
                self.table_layout = resp.get_rows.table_layout;
                cfg.hide_load();
            });
        },
        add_new: function add_new(kws) {
            var self = this;
            var fields_ctx = kws.fields_ctx;
            var dc = { fun: 'get_row', director_name: fields_ctx.director_name };
            if (kws.init_fields) {
                ex.assign(dc, kws.init_fields);
            }
            var post_data = [dc];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var crt_row = resp.get_row;
                if (self.search_args._par) {
                    crt_row.meta_par = self.search_args._par;
                }
                //var pop_id= new Date().getTime()
                // e = {name:'after_save',new_row:event.new_row,old_row:event.old_row}
                //eventBus.$on('pop-win-'+pop_id,function(e){
                //    self.update_or_insert(e.new_row, e.old_row)
                //})
                //pop_fields_layer(new_row,kws.heads,kws.ops,pop_id)
                self.crt_row = crt_row;
                if (kws.tab_name) {
                    // 需要继承table_page_store
                    //self.switch_to_tab(kws)
                    var bb = ex.copy(kws);
                    bb.par_row = crt_row;
                    self.switch_to_tab(bb);
                    //self.$emit('operation',{fun:'switch_to_tab',tab_name:kws.tab_name,row:crt_row})
                    //self.switch_to_tab({tab_name:kws.tab_name,row:crt_row})
                } else {
                    var win = pop_fields_layer(crt_row, fields_ctx, function (new_row) {
                        self.update_or_insert(new_row, crt_row);
                        layer.close(win);
                        if (kws.after_save) {
                            ex.eval(kws.after_save, self);
                        }
                    });
                }
            });
        },
        clearSelection: function clearSelection() {
            this.selected = [];
            // 在mix_ele_table_adaptor 中会触发 element table 自动清除选择。
        },
        get_childs: function get_childs(par) {
            this.search_args._par = par;
            this.search();
        },
        update_or_insert: function update_or_insert(new_row, old_row) {
            // 如果是更新，不用输入old_row，old_row只是用来判断是否是创建的行为
            // 不用 old_row 了， 只需要判断 pk 是否在rows里面即可。
            var table_row = ex.findone(this.rows, { pk: new_row.pk });
            if (table_row) {
                ex.vueAssign(table_row, new_row);
            } else {
                this.rows = [new_row].concat(this.rows);
                this.row_pages.total += 1;
            }

            //if(old_row && ! old_row.pk) {
            //
            //    //var rows = this.rows.splice(0, 0, new_row)
            //    this.rows=[new_row].concat(this.rows)
            //    this.row_pages.total+=1
            //}else{
            //    var table_row = ex.findone(this.rows,{pk:new_row.pk})
            //    if(table_row){
            //        ex.vueAssign(table_row,new_row)
            //    }
            //}
            this.$emit('row.update_or_insert', [new_row]);
        },
        update_rows: function update_rows(rows) {
            var self = this;
            ex.each(rows, function (row) {
                var table_row = ex.findone(self.rows, { pk: row.pk });
                ex.vueAssign(table_row, row);
            });
            self.$emit('row.update_or_insert', [rows]);
        },
        selected_set_and_save: function selected_set_and_save(kws) {
            /*
             这个是主力函数
             // 路线：弹出->编辑->update前端（缓存的）row->保存->后台->成功->update前端row->关闭窗口
             * */
            // head: row_match:many_row ,
            var self = this;
            var row_match_fun = kws.row_match || 'many_row';
            if (!row_match[row_match_fun](self, kws)) {
                return;
            }

            function bb(all_set_dict, after_save_callback) {
                var cache_rows = ex.copy(self.selected);
                ex.each(cache_rows, function (row) {
                    ex.assign(row, all_set_dict);
                    if (kws.fields_ctx && kws.fields_ctx.director_name) {
                        row._cache_director_name = row._director_name; // [1] 有可能是用的特殊的 direcotor
                        row._director_name = kws.fields_ctx.director_name;
                    }
                    //row[kws.field]=kws.value
                });
                var post_data = [{ fun: 'save_rows', rows: cache_rows }];
                cfg.show_load();
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    if (!resp.save_rows.errors) {
                        ex.each(resp.save_rows, function (new_row) {
                            // [1]  这里还原回去
                            if (new_row._cache_director_name) {
                                new_row._director_name = new_row._cache_director_name;
                            }
                            if (kws.after_save) {
                                ex.eval(kws.after_save, { new_row: new_row, ts: self });
                            } else {
                                self.update_or_insert(new_row);
                            }
                        });
                        self.clearSelection();

                        cfg.hide_load(2000);
                    } else {
                        cfg.hide_load();
                        // 留到下面的field弹出框，按照nicevalidator的方式去显示错误
                        if (!after_save_callback) {
                            if (resp.save_rows.msg) {
                                cfg.showError(resp.save_rows.msg);
                            } else {
                                cfg.showError(JSON.stringify(resp.save_rows.errors));
                            }
                        }
                        //
                    }

                    //self.op_funs.update_or_insert_rows({rows:resp.save_rows} )

                    if (after_save_callback) {
                        after_save_callback(resp);
                    }
                });
            }

            //row[kws.field]=kws.value

            function judge_pop_fun() {
                var one_row = {};
                if (kws.field) {
                    // 兼容老的，新的采用eval形式，
                    one_row[kws.field] = kws.value;
                } else {
                    ex.assign(one_row, ex.eval(kws.pre_set));
                }

                if (kws.fields_ctx) {
                    ex.map(kws.fields_ctx.heads, function (head) {
                        if (!head.name.startsWith('_') && one_row[head.name] == undefined) {
                            one_row[head.name] = self.selected[0][head.name];
                        }
                    });
                    var win_index = pop_edit_local(one_row, kws.fields_ctx, function (new_row, store) {
                        bb(new_row, function (resp) {
                            if (resp.save_rows.errors) {
                                cfg.showError(JSON.stringify(resp.save_rows.errors));
                                //self.$store.commit(store_id+'/showErrors',resp.save_rows.errors)
                            } else {
                                layer.close(win_index);
                            }
                        });
                    });
                } else {
                    bb(one_row);
                }
            }
            if (kws.confirm_msg) {
                layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                    layer.close(index);
                    judge_pop_fun();
                });
            } else {
                judge_pop_fun();
            }
        },
        export_excel: function export_excel() {
            var self = this;
            var search_args = ex.copy(self.search_args);
            search_args._perpage = 5000;
            var post_data = [{ fun: 'get_excel', director_name: self.director_name, search_args: search_args }];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var url = resp.get_excel.file_url;
                ex.download(url);
            });
        },
        director_call: function director_call(kws) {
            var self = this;
            var row_match_fun = kws.row_match;
            if (row_match_fun && !row_match[row_match_fun](self, kws)) {
                return;
            }

            function bb(new_row, callback) {
                cfg.show_load();
                ex.director_call(kws.director_name, { rows: self.selected, new_row: new_row }, function (resp) {
                    if (!resp.msg) {
                        cfg.hide_load(2000);
                    } else {
                        cfg.hide_load();
                    }
                    //if(resp.msg){
                    //    cfg.showMsg(resp.msg)
                    //}

                    if (kws.after_save) {
                        ex.eval(kws.after_save, { resp: resp, ts: self });
                    } else {
                        // 兼容老的调用
                        // 返回rows ，默认更新
                        if (resp.rows) {
                            self.update_rows(resp.rows);
                        }
                        if (resp.row) {
                            self.update_or_insert(resp.row);
                        }
                    }

                    self.clearSelection();
                    if (callback) {
                        callback(resp);
                    }
                });
            }

            function judge_pop_fun() {
                var one_row = {};
                ex.assign(one_row, ex.eval(kws.pre_set));
                if (kws.fields_ctx) {
                    ex.map(kws.fields_ctx.heads, function (head) {
                        if (!head.name.startsWith('_') && one_row[head.name] == undefined) {
                            one_row[head.name] = self.selected[0][head.name];
                        }
                    });
                    var win_index = pop_edit_local(one_row, kws.fields_ctx, function (new_row, store) {
                        bb(new_row, function (resp) {
                            layer.close(win_index);
                        });
                    });
                } else {
                    bb(one_row);
                }
            }

            if (kws.confirm_msg) {
                layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                    layer.close(index);
                    judge_pop_fun();
                });
            } else {
                judge_pop_fun();
            }
        },
        arraySpanMethod: function arraySpanMethod(_ref) {
            var row = _ref.row,
                column = _ref.column,
                rowIndex = _ref.rowIndex,
                columnIndex = _ref.columnIndex;

            // 计算布局
            if (this.table_layout) {
                return this.table_layout[rowIndex + ',' + columnIndex] || [1, 1];
            } else {
                return [1, 1];
            }
        },
        delete_selected: function delete_selected() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                //var ss = layer.load(2);
                cfg.show_load();
                var post_data = [{ fun: 'del_rows', rows: self.selected }];
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    cfg.hide_load();
                    self.search();
                });
            });
        },
        pop_panel: function pop_panel(kws) {
            var self = this;
            var row_match_fun = kws.row_match || 'many_row';
            if (!row_match[row_match_fun](self, kws)) {
                return;
            }
            if (kws.panel) {
                var panel = kws.panel;
            } else {
                var panel = ex.eval(kws.panel_express, { ts: self, kws: kws });
            }
            var ctx = ex.copy(kws);
            if (kws.ctx_express) {
                var cus_ctx = ex.eval(kws.ctx_express, { ts: self, kws: kws });
                ex.assign(ctx, cus_ctx);
            }
            var winclose = cfg.pop_middle(panel, ctx, function (resp) {
                if (ctx.after_express) {
                    ex.eval(ctx.after_express, { ts: self, resp: resp });
                } else {
                    self.update_or_insert(resp);
                }
                self.clearSelection();
                winclose();
            });
        }
    }

};

var row_match = {
    one_row: function one_row(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else if (head.match_express) {
            var matched = ex.eval(head.match_express, { row: self.selected[0] });
            if (!matched) {
                cfg.showError(head.match_msg);
                return false;
            }
        }
        return true;
    },
    many_row: function many_row(self, head) {
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            if (head.match_express) {
                for (var i = 0; i < self.selected.length; i++) {
                    var row = self.selected[i];
                    if (!ex.eval(head.match_express, { row: row })) {
                        cfg.showError(head.match_msg);
                        return false;
                    }
                }
            }
            return true;
        }
    },
    one_row_match: function one_row_match(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else {
            var field = head.match_field;
            var values = head.match_values;
            var msg = head.match_msg;

            var row = self.selected[0];

            if (!ex.isin(row[field], values)) {
                cfg.showMsg(msg);
                return false;
            } else {
                return true;
            }
        }
    },
    // 这个函数被 many_row 替代了。 只需要加上 match_express 就可以替换这个函数
    many_row_match: function many_row_match(self, head) {
        // head : @match_field , @match_values ,@match_msg
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            if (head.match_field) {
                // 老的用法，准备剔除  ,现在全部改用 match_express
                var field = head.match_field;
                var values = head.match_values;
                var msg = head.match_msg;

                for (var i = 0; i < self.selected.length; i++) {
                    var row = self.selected[i];
                    if (!ex.isin(row[field], values)) {
                        cfg.showMsg(msg);
                        return false;
                    }
                }
                return true;
            } else {
                for (var i = 0; i < self.selected.length; i++) {
                    var row = self.selected[i];
                    if (!ex.eval(head.match_express)) {
                        cfg.showMsg(head.match_msg);
                        return false;
                    }
                }
                return true;
            }
        }
    }
};

window.table_store = table_store;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(9);

var com_form_panel = exports.com_form_panel = {
    props: ['ctx'],
    data: function data() {
        var self = this;
        var option = {
            okBtn: self.ctx.okBtn || '确定',
            ops: self.ctx.ops
        };
        if (this.ctx.option) {
            ex.assign(option, this.ctx.option);
        }

        return {
            row: this.ctx.row || {},
            heads: this.ctx.heads,
            form: this.ctx.form || cfg.form || com_form,
            small: false,
            small_srn: ex.is_small_screen(),
            option: option

        };
    },
    mounted: function mounted() {
        if ($(this.$el).width() < 600) {
            this.small = true;
        } else {
            this.small = false;
        }
    },
    methods: {
        on_finish: function on_finish(e) {
            this.$emit('finish', e);
        }
    },
    template: '<div :class="[\'flex-v com-fields-panel\',option.cssCls,{\'small_srn\':small_srn}]">\n     <component class="msg-bottom" :is="form" :heads="heads" :row="row" :option="option" @finish="on_finish($event)"></component>\n     </div>'
};
window.com_form_panel = com_form_panel;
Vue.component('com-form-panel', com_form_panel);

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(136);

var html_panel = {
    props: ['ctx'],
    template: '<div class="com-html-content-panel" v-html="ctx.content"></div>'

};
Vue.component('com-html-content-panel', html_panel);

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html_panel = {
    props: ['ctx'],
    template: '<div class="com-html-panel" v-html="ctx.content"></div>'

};
Vue.component('com-html-panel', html_panel);

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(137);

var iframe_panel = {
    props: ['ctx'],
    template: '<div class="com-iframe-panel">\n        <iframe :src="ctx.url" style="width: 100%;height:100%;vertical-align:top" scrolling="auto"></iframe>\n    </div>'

};
Vue.component('com-iframe-panel', iframe_panel);

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fields_panel = __webpack_require__(5);

var com_pop_fields_panel = {
    props: ['ctx'],
    data: function data() {
        return {
            fields_editor: this.ctx.fields_editor || com_pop_field
        };
    },
    mixins: [_fields_panel.com_fields_panel],
    template: '<div :class="[\'flex-v com-fields-panel\',cssCls,{\'small_srn\':small_srn}]" style="height: 100%">\n     <component class="msg-bottom"  :is="fields_editor" :heads="heads" :row="row" :ops="ops"\n       :cross-btn="crossBtn" @finish="on_finish($event)"></component>\n     </div>'
};

Vue.component('com-panel-pop-fields', com_pop_fields_panel);

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_panel = {
    props: ['ctx'],

    data: function data() {
        var self = this;
        if (this.ctx.selectable == undefined) {
            this.ctx.selectable = true;
        }
        var base_table_panel_store = {
            props: ['ctx'],
            propsData: {
                ctx: self.ctx
            },
            data: function data() {
                return {
                    par_row: self.ctx.par_row || {},
                    heads: self.ctx.heads || [],
                    selectable: self.ctx.selectable,
                    search_args: self.ctx.search_args || {},
                    row_filters: self.ctx.row_filters || {},
                    row_sort: self.ctx.row_sort || { sortable: [] },
                    director_name: self.ctx.director_name || '',
                    ops: self.ctx.ops || [],
                    row_pages: self.ctx.row_pages || { crt_page: 1, total: 0, perpage: 20 },
                    rows: [],
                    footer: [],
                    selected: []
                };
            },
            mixins: [table_store]
        };
        var this_table_store = this.get_custom_store(base_table_panel_store);
        //var this_table_store =  {
        //    mixins:[table_store,base_table_store].concat(custom_store)
        //}
        return {
            childStore: new Vue(this_table_store),
            par_row: this.ctx.par_row || {},
            del_info: []
        };
    },
    mixins: [mix_table_data, mix_ele_table_adapter],

    mounted: function mounted() {
        this.childStore.$on('finish', this.emit_finish);
        this.childStore.search();
    },
    methods: {
        get_custom_store: function get_custom_store() {
            return [];
        },
        emit_finish: function emit_finish(event) {
            this.$emit('finish', event);
        }
    },
    template: '<div class="com-table-panel" style="height: 100%;">\n\n            <div class="rows-block flex-v" style="height: 100%">\n\n\n              <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n\n                     <com-table-filters></com-table-filters>\n\n               </div>\n\n               <div  v-if="childStore.ops.length>0 && childStore.tab_stack.length ==0">\n                        <com-table-operations></com-table-operations>\n               </div>\n\n                <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n                    <div class="table-wraper flex-grow" style="position: relative;">\n\n                        <com-table-grid></com-table-grid>\n                    </div>\n                </div>\n            <div style="background-color: white;">\n                <com-table-pagination></com-table-pagination>\n            </div>\n\n        </div>\n    </div>'
};

window.com_table_panel = table_panel;
Vue.component('com-table-editor', table_panel);

//window.com_table_panel=table_panel
Vue.component('com-table-panel', table_panel);

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _pop_fields = __webpack_require__(3);

var pop_fields_from_row = {
    // fields 的 所有 ctx 从row中获取 。
    // 因为有时，需要根据不同的row，显示不同的 forms。 
    mixins: [_pop_fields.pop_fields],
    methods: {
        open_layer: function open_layer() {
            var self = this;
            var ctx_name = this.rowData[this.head.ctx_field];
            var allinone_ctx = named_ctx[ctx_name];
            var fun = get_row[allinone_ctx.get_row.fun];
            if (allinone_ctx.get_row.kws) {
                //  这个是兼顾老的调用，新的调用，参数直接写在get_row里面，与fun平级
                var kws = allinone_ctx.get_row.kws;
            } else {
                var kws = allinone_ctx.get_row;
            }
            kws.director_name = allinone_ctx.fields_ctx.director_name;

            fun(function (pop_row) {
                //pop_fields_layer(pop_row,self.head.fields_heads,ops,self.head.extra_mixins,function(kws){
                var win_index = pop_fields_layer(pop_row, allinone_ctx.fields_ctx, function (new_row) {

                    var fun = after_save[allinone_ctx.after_save.fun];
                    fun(self, new_row, pop_row);

                    layer.close(win_index);
                });
            }, this.rowData, kws);
        }
    }

};

Vue.component('com-table-pop-fields-from-row', pop_fields_from_row);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }
};

var get_row = {
    use_table_row: function use_table_row(callback, row, kws) {
        callback(row);
    },
    get_table_row: function get_table_row(callback, row, kws) {
        var cache_row = ex.copy(row);
        callback(cache_row);
    },
    get_with_relat_field: function get_with_relat_field(callback, row, kws) {
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;

        var dc = { fun: 'get_row', director_name: director_name };
        dc[relat_field] = row[relat_field];
        var post_data = [dc];
        cfg.show_load();
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    }
};

var after_save = {
    do_nothing: function do_nothing(self, new_row, old_row, table) {},
    update_or_insert: function update_or_insert(self, new_row, old_row) {
        self.parStore.update_or_insert(new_row, old_row);
        //self.$emit('on-custom-comp',{name:'update_or_insert',new_row:new_row,old_row:old_row})
        //var par_name=ex.vuexParName(self)
        //if(par_name){
        //self.parStore.$emit('row.update_or_insert',{new_row:new_row,old_row:old_row})
        //}
    }
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_table_sequence = {
    props: ['rowData', 'field', 'index'],
    template: '<div><span v-text="show_text" ></span></div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
        this.parStore = ex.vueParStore(this);
    },
    computed: {
        show_text: function show_text() {
            var perpage = this.parStore.row_pages.perpage;
            var crt_page = this.parStore.row_pages.crt_page;
            return this.index + 1 + (crt_page - 1) * perpage;
        }
    }
};
Vue.component('com-table-sequence', com_table_sequence);

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_filter = {
    data: function data() {
        this.parStore = ex.vueParStore(this);
        return {
            row_filters: this.parStore.row_filters,
            search_args: this.parStore.search_args
        };
    },
    template: ' <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                        @submit="search()"></com-filter>',
    methods: {
        search: function search() {
            this.parStore.search();
            //this.bus.eventBus.$emit('search',this.bus.search_args)
        }
    }
};

Vue.component('com-table-filters', ele_filter);

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_operations = {

    //                      :disabled="get_attr(op.disabled)"
    //v-show="! get_attr(op.hide)"
    template: '<div class="oprations" style="padding: 5px;">\n                <component v-for="(op,index) in ops"\n                           :is="op.editor"\n                           :ref="\'op_\'+op.name"\n                           :head="op"\n                           :key="index"\n                           :disabled="is_disable(op)"\n                           v-show="is_show(op)"\n                           @operation="on_operation(op)"></component>\n            </div>',
    data: function data() {
        var self = this;
        this.parStore = ex.vueParStore(this);
        return {
            ops: this.parStore.ops
        };
    },

    methods: {
        is_disable: function is_disable(op) {
            if (op.disabled == undefined) {
                return false;
            } else {
                return ex.eval(op.disabled, { ts: this.parStore });
            }
        },
        is_show: function is_show(op) {
            count += 1;
            console.log(count);
            console.log(op.label);
            if (op.show == undefined) {
                return true;
            } else {
                return ex.eval(op.show, { ts: this.parStore });
            }
        },
        eval: function _eval(express) {
            if (express == undefined) {
                return false;
            } else {
                return ex.eval(express, this.parStore);
            }
        },
        on_operation: function on_operation(op) {
            var fun_name = op.fun || op.name; // 以后都使用 fun
            this.parStore[fun_name](op);
            //this.bus.eventBus.$emit('operation',op)
        }
    }
};

var count = 0;
Vue.component('com-table-operations', ele_operations);

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_page = {

    data: function data() {
        var parStore = ex.vueParStore(this);
        this.parStore = parStore.table ? parStore.table : parStore;
        return {
            row_pages: this.parStore.row_pages,
            search_args: this.parStore.search_args
        };
    },
    methods: {
        on_page_change: function on_page_change(v) {
            this.search_args._page = v;
            this.parStore.getRows();
            //this.bus.eventBus.$emit('pageindex-change',v)
        },
        on_perpage_change: function on_perpage_change(v) {
            this.search_args._perpage = v;
            this.parStore.search();
            //this.bus.eventBus.$emit('perpage-change',v)
        }
    },
    //  @size-change="on_perpage_change"
    //@current-change="get_page"
    template: ' <el-pagination\n                         @size-change="on_perpage_change"\n                        @current-change="on_page_change"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>'
};

Vue.component('com-table-pagination', ele_page);

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_parents = {
    data: function data() {
        var self = this;
        return {
            parStore: ex.vueParStore(self)
        };
    },
    template: '<div class="com-table-parents">\n          <ol v-if="parStore.parents.length>0" class="breadcrumb jb-table-parent">\n            <li v-for="par in parStore.parents"><a href="#" @click="on_click(par)"  v-text="par.label"></a></li>\n        </ol>\n    </div>',
    methods: {
        on_click: function on_click(par) {
            this.parStore.$emit('parent_changed', par);
            this.parStore.get_childs(par.value);
        }
    }
};
Vue.component('com-table-parents', table_parents);

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(143);
var ele_table = {
    props: ['bus'],
    created: function created() {
        //this.bus.table = this

    },
    data: function data() {
        this.parStore = ex.vueParStore(this);
        return {
            heads: this.parStore.heads,
            //rows:this.parStore.rows,
            search_args: this.parStore.search_args,
            row_sort: this.parStore.row_sort
            //selectable:this.parStore.selectable,

        };
    },
    mounted: function mounted() {
        //this.bus.eventBus.$on('search', this.bus_search)
        //this.bus.eventBus.$on('pageindex-change', this.get_page)
        //this.bus.eventBus.$on('operation', this.on_operation)
        //this.bus.eventBus.$on('perpage-change', this.on_perpage_change)
        this.parStore.e_table = this.$refs.e_table;
    },

    computed: {
        rows: function rows() {
            return this.parStore.rows;
        },
        selected: function selected() {
            return this.parStore.selected;
        },
        footer: function footer() {
            return this.parStore.footer;
        }
        //bus_serarch_count:function(){
        //    return this.bus.search_count
        //},
        //rows: {
        //    get: function () {
        //        return this.bus.rows
        //    },
        //    set: function (v) {
        //        this.bus.rows = v
        //    }
        //},
        //footer: {
        //    get: function () {
        //        return this.bus.footer
        //    },
        //    set: function (v) {
        //        this.bus.footer = v
        //    }
        //}
        //search_args:{
        //    get:function(){
        //        return this.bus.search_args
        //    },
        //    set:function(v){
        //        this.bus.search_args=v
        //    }
        //}
    },
    watch: {
        selected: function selected(newvalue, old) {
            if (newvalue.length == 0 && old.length != 0) {
                this.$refs.e_table.clearSelection();
            }
        }
    },
    // height="100%"
    //style="width: 100%"
    // :row-class-name="tableRowClassName"  行标记颜色，效果不好，暂时不用
    mixins: [mix_table_data, mix_ele_table_adapter],
    template: '  <div style="position: absolute;top:0;left:0;bottom: 0;right:0;">\n        <el-table class="table flat-head" ref="e_table"\n                              :data="rows"\n                              border\n                              show-summary\n                              :span-method="parStore.arraySpanMethod"\n                              :fit="false"\n                              :stripe="true"\n                              size="mini"\n                              height="100%"\n                              style="width: 100%"\n                              @sort-change="parStore.sortChange($event)"\n                              @selection-change="parStore.handleSelectionChange"\n                              :summary-method="getSum">\n                        <el-table-column v-if="parStore.selectable"\n                                type="selection"\n                                width="55">\n                        </el-table-column>\n\n                        <template  v-for="head in parStore.heads">\n\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                             :label="head.label"\n                                             :prop="head.name.toString()"\n                                             :sortable="parStore.is_sort(head)"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                             :prop="head.name.toString()"\n                                             :label="head.label"\n                                             :sortable="parStore.is_sort(head)"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n\n                    </el-table>\n                    </div>\n',
    methods: {
        tableRowClassName: function tableRowClassName(_ref) {
            var row = _ref.row,
                rowIndex = _ref.rowIndex;

            return row._css_class;
        },
        bus_search: function bus_search(search_args) {
            ex.assign(this.search_args, search_args);
            this.search();
        },
        on_td_event: function on_td_event(e) {
            var fun_name = e.fun || e.name; // 以后都用fun
            if (e.head && e.head.arg_filter) {
                var filter_fun = arg_filter[e.head.arg_filter];
                var normed_args = filter_fun(e.row, e.head);
                this.parStore[fun_name](normed_args);
            } else {
                this.parStore[fun_name](e);
            }
        }
    }
    //watch:{
    //    bus_serarch_count:function(){
    //        this.search()
    //    }
    //},
};
Vue.component('com-table-grid', ele_table);

var arg_filter = {
    field: function field(row, head) {
        return row[head.field];
    }
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(144);

var tab_fields = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var data_row = this.tab_head.row || {};
        return {
            heads: this.tab_head.heads,
            ops: this.tab_head.ops,
            errors: {},
            row: data_row
        };
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: '<div class="com-tab-fields flex-v"  style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;">\n\n   <div class="oprations" >\n        <component v-for="op in ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    <div style="overflow: auto;" class="flex-grow">\n        <div class=\'field-panel suit\' id="form" >\n            <field  v-for=\'head in normed_heads\' :key="head.name" :head="head" :row=\'row\'></field>\n        </div>\n    </div>\n    </div>',

    //created:function(){
    //    // find head from parent table
    //    var table_par = this.$parent
    //    while (true){
    //        if (table_par.heads){
    //            break
    //        }
    //        table_par = table_par.$parent
    //        if(!table_par){
    //            break
    //        }
    //    }
    //    this.table_par = table_par
    //},

    mounted: function mounted() {
        if (!this.tab_head.row) {
            this.get_data();
        }
    },
    methods: {

        data_getter: function data_getter() {
            var self = this;
            var fun = get_data[self.tab_head.get_data.fun];
            var kws = self.tab_head.get_data.kws;
            fun(self, function (row) {
                //ex.assign(self.row,row)
                self.row = row;
            }, kws);

            //var self=this
            //cfg.show_load()
            //var dt = {fun:'get_row',model_name:this.model_name}
            //dt[this.relat_field] = this.par_row[this.relat_field]
            //var post_data=[dt]
            //$.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //    self.row=resp.get_row
            //    cfg.hide_load()
            //})
        },
        after_save: function after_save(new_row) {
            if (this.tab_head.after_save) {
                var fun = _after_save[this.tab_head.after_save.fun];
                var kws = this.tab_head.after_save.kws;
                // new_row ,old_row
                fun(this, new_row, kws);

                //if(  self.par_row._director_name == row._director_name){
                //    // ，应该将新的属性值 去更新par_row
                //    ex.vueAssign(self.par_row,row)
                //}
            }
            this.row = new_row;
        }
        // data_getter  回调函数，获取数据,


    } };

Vue.component('com-tab-fields', tab_fields);

var get_data = {
    get_row: function get_row(self, callback, kws) {
        //kws={model_name ,relat_field}
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;
        var dt = { fun: 'get_row', director_name: director_name };
        dt[relat_field] = self.par_row[relat_field];
        var post_data = [dt];
        cfg.show_load();
        $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    },
    table_row: function table_row(self, callback, kws) {
        callback(self.par_row);
    }
};

var _after_save = {
    update_or_insert: function update_or_insert(self, new_row, kws) {
        var old_row = self.old_row;
        var parStore = ex.vueParStore(self);
        parStore.update_or_insert(new_row, old_row);
        // 要update_or_insert ，证明一定是 更新了 par_row
        //ex.vueAssign(self.par_row,new_row)
        //self.$emit('tab-event',{name:'update_or_insert',new_row:self.par_row,old_row:old_row})
    },
    do_nothing: function do_nothing(self, new_row, kws) {},

    update_par_row_from_db: function update_par_row_from_db(self, new_row, kws) {
        //
        var post_data = [{ fun: 'get_row', director_name: self.par_row._director_name, pk: self.par_row.pk }];
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            ex.vueAssign(self.par_row, resp.get_row);
        });
    }
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab_table = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var vc = this;
        var heads_ctx = this.tab_head.table_ctx;
        var my_table_store = {
            data: function data() {
                return {
                    heads: heads_ctx.heads,
                    row_filters: heads_ctx.row_filters,
                    row_sort: heads_ctx.row_sort,
                    director_name: heads_ctx.director_name,
                    footer: heads_ctx.footer || [],
                    ops: heads_ctx.ops || [],
                    rows: [],
                    row_pages: {},
                    selectable: heads_ctx.selectable == undefined ? true : heads_ctx.selectable,
                    selected: [],
                    del_info: [],
                    search_args: {},

                    parStore: ex.vueParStore(vc)
                };
            },
            mixins: [table_store],
            watch: {
                search_args: function search_args(v) {
                    console.log(v);
                }
            },
            methods: {
                switch_to_tab: function switch_to_tab(kws) {
                    this.parStore.switch_to_tab(kws);
                },
                getRows: function getRows() {
                    if (vc.tab_head.tab_field) {
                        this.search_args[vc.tab_head.tab_field] = vc.par_row[vc.tab_head.par_field];
                    } else {
                        this.search_args[vc.tab_head.par_field] = vc.par_row[vc.tab_head.par_field];
                    }
                    table_store.methods.getRows.call(this);
                }
            }
        };
        return {
            childStore: new Vue(my_table_store)
            //return {
            //    parents:parents,
            //    page_label:page_label,
            //    heads:heads,
            //    rows:rows,
            //    row_filters:row_filters,
            //    row_sort:row_sort,
            //    row_pages:row_pages,
            //    director_name:director_name,
            //    footer:footer,
            //    ops:ops,
            //    search_args:search_args,
            //}
        };
    },
    mounted: function mounted() {
        this.childStore.search();
    },

    template: '<div class="com-tab-table flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;">\n       <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n            <com-table-filters></com-table-filters>\n        </div>\n        <div  v-if="childStore.ops.length>0 ">\n            <com-table-operations></com-table-operations>\n        </div>\n\n        <div v-if="childStore.parents.length>0">\n            <com-table-parents></com-table-parents>\n        </div>\n\n        <!--<ol v-if="parents.length>0" class="breadcrumb jb-table-parent">-->\n            <!--<li v-for="par in parents"><a href="#" @click="get_childs(par)"  v-text="par.label"></a></li>-->\n        <!--</ol>-->\n\n        <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n            <div class="table-wraper flex-grow" style="position: relative;">\n                <com-table-grid></com-table-grid>\n               </div>\n        </div>\n        <div style="background-color: white;">\n            <com-table-pagination></com-table-pagination>\n        </div>\n    </div>'
};

Vue.component('com-tab-table', tab_table);

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-ele-tree-name-layer {\n  min-width: 20em;\n  border: 1px solid #b1b1b1; }\n  .com-field-ele-tree-name-layer .el-tree {\n    min-height: 20em; }\n", ""]);

// exports


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".file-uploader .item img {\n  max-width: 300px;\n  cursor: pointer; }\n\n.file-uploader .wrap {\n  display: inline-block; }\n\n.file-uploader .sortable {\n  display: flex;\n  flex-wrap: wrap; }\n  .file-uploader .sortable li {\n    display: block;\n    margin: 0.5em;\n    padding: 0.3em;\n    position: relative; }\n    .file-uploader .sortable li:hover .remove-btn {\n      visibility: visible; }\n    .file-uploader .sortable li .file-wrap {\n      width: 10em;\n      height: 12em;\n      border: 2em solid #68abff;\n      text-align: center;\n      padding: 1em 0;\n      background-color: white;\n      box-shadow: 10px 10px 5px #888888;\n      color: #68abff;\n      display: table-cell;\n      vertical-align: middle;\n      cursor: pointer; }\n      .file-uploader .sortable li .file-wrap .file-type {\n        font-size: 250%;\n        font-weight: 700;\n        text-transform: uppercase; }\n\n.file-uploader .remove-btn {\n  font-size: 2em;\n  position: absolute;\n  top: -1em;\n  right: 0.3em;\n  visibility: hidden; }\n  .file-uploader .remove-btn i {\n    color: red; }\n\n.file-uploader-btn-plus {\n  display: inline-block;\n  vertical-align: top; }\n  .file-uploader-btn-plus .inn-btn {\n    width: 5em;\n    height: 5em;\n    display: table-cell;\n    text-align: center;\n    vertical-align: middle;\n    border: 1px solid #e1e1e1;\n    cursor: pointer; }\n    .file-uploader-btn-plus .inn-btn span {\n      font-size: 300%; }\n    .file-uploader-btn-plus .inn-btn:hover {\n      background-color: #e1e1e1; }\n", ""]);

// exports


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".plain-field-panel .submit-block {\n  text-align: center;\n  margin-top: 2em; }\n  .plain-field-panel .submit-block .btn {\n    min-width: 10em; }\n", ""]);

// exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".sim-fields .table-fields {\n  width: 100%; }\n\n.sim-fields .field-label-td {\n  padding-right: 1em;\n  padding-bottom: 1em;\n  text-align: left; }\n\n.sim-fields .field-input-td {\n  padding-bottom: 1em; }\n\n.sim-fields .field-label {\n  text-align: left; }\n  .sim-fields .field-label .label-content {\n    max-width: 12rem;\n    word-break: break-all;\n    position: relative;\n    display: inline-block; }\n    .sim-fields .field-label .label-content .req_star {\n      top: -0.3em;\n      right: -0.6em; }\n\n.sim-fields .field-input {\n  text-align: left;\n  position: relative; }\n\n.sim-fields .help-text {\n  position: relative;\n  top: -2rem;\n  right: auto; }\n\n.sim-fields .submit-block {\n  margin-top: 1em;\n  text-align: left; }\n  .sim-fields .submit-block button {\n    min-width: 10em;\n    padding-left: 2em;\n    padding-right: 2em; }\n\n.sim-fields.no-label .field-label-td {\n  display: none; }\n\n.sim-fields.no-label .field-input {\n  width: 100%;\n  text-align: left; }\n\n.sim-fields.no-label .table-fields {\n  width: 100%; }\n\n.sim-fields.no-label .submit-block {\n  margin-top: 1em;\n  text-align: left; }\n  .sim-fields.no-label .submit-block button {\n    width: 100%; }\n\n.sim-fields.field-panel.pop {\n  padding-top: 8px; }\n  .sim-fields.field-panel.pop .field-input {\n    width: 20em; }\n  .sim-fields.field-panel.pop .submit-block {\n    margin-top: 10px; }\n    .sim-fields.field-panel.pop .submit-block button {\n      min-width: 8em; }\n\n.sim-fields.field-panel.mb {\n  padding: 1em; }\n  .sim-fields.field-panel.mb .field-label {\n    min-width: 5em;\n    text-align: right; }\n  .sim-fields.field-panel.mb .field-input {\n    width: auto; }\n  .sim-fields.field-panel.mb .submit-block {\n    margin-top: 10px; }\n    .sim-fields.field-panel.mb .submit-block button {\n      width: 100%; }\n", ""]);

// exports


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-head-dropdown-action {\n  display: inline-block;\n  min-width: 8em;\n  text-align: center; }\n", ""]);

// exports


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@media (max-width: 900px) {\n  /*.small-link{*/\n  /*.item{*/\n  /*display: block;*/\n  /*color:white;*/\n  /*margin: 0.6em 1.2em;*/\n  /*a{*/\n  /*color: white;*/\n  /*}*/\n  /*.space{*/\n  /*display: none;*/\n  /*}*/\n  /*}*/\n  /*}*/ }\n\n.small-link.vertical .item {\n  display: block;\n  color: white;\n  margin: 0.6em 1.2em; }\n  .small-link.vertical .item a {\n    color: white; }\n  .small-link.vertical .item .space {\n    display: none; }\n", ""]);

// exports


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-widget-stack {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 0; }\n", ""]);

// exports


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table .el-table__row > td, .table tr > th, table.el-table__footer tr > td {\n  padding: 2px 0; }\n", ""]);

// exports


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-fields-panel {\n  padding: 2rem;\n  border-radius: 0.3rem;\n  background-color: white; }\n", ""]);

// exports


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-html-content-panel {\n  padding: 4rem 3rem; }\n  .com-html-content-panel img {\n    max-width: 100%; }\n", ""]);

// exports


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-iframe-panel {\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-select-dropdown {\n  z-index: 99891020 !important; }\n", ""]);

// exports


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".msg-hide .field .msg {\n  display: none; }\n\n.field .picture {\n  position: relative; }\n  .field .picture .msg-box {\n    position: absolute;\n    left: 260px; }\n", ""]);

// exports


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".active-tab-hightlight-top .el-tabs__item.is-top.is-active {\n  color: #3e8ebd; }\n\n.active-tab-hightlight-top .el-tabs__item.is-top.is-active:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 3px;\n  background-color: #3e8ebd; }\n\n.tab-full .el-tabs {\n  display: flex;\n  flex-direction: column;\n  height: 100%; }\n  .tab-full .el-tabs .el-tabs__content {\n    flex-grow: 10;\n    position: relative; }\n\nbody {\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table.flat-head th .cell {\n  white-space: nowrap; }\n", ""]);

// exports


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".jb-table-parent {\n  margin-bottom: 0; }\n", ""]);

// exports


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".change-order .arrow {\n  cursor: pointer;\n  display: inline-block;\n  padding: 0.2em 0.6em; }\n\n.change-order .arrow:hover {\n  color: #00c000; }\n", ""]);

// exports


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-checkbox.dirty input {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".extra-click-plus .icon .item {\n  display: inline-block;\n  margin-right: 0.5em; }\n\n.extra-click-plus.mobile .item {\n  display: inline-block;\n  margin-left: 0.5rem;\n  margin-right: 0.5rem; }\n", ""]);

// exports


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-linetext.dirty input {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-dropdown-menu__item.crt-value {\n  background-color: #eaf8ff; }\n\n.com-table-select.dirty {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".dirty {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-table .success {\n  background: #f0f9eb; }\n\n.el-table--striped .el-table__body tr.success.el-table__row--striped > td {\n  background: #f0f9eb; }\n", ""]);

// exports


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-tab-fields .oprations {\n  background: #fbfbf8;\n  padding: 0.2rem 1rem;\n  margin: 0.2rem 0; }\n", ""]);

// exports


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(107);
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
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(108);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./plain_field_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./plain_field_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(110);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./dropdown.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./dropdown.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(111);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sm_link.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sm_link.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(112);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./stack_widget.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./stack_widget.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./mix_ele_table_adapter.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./mix_ele_table_adapter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(115);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./html_content_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./html_content_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(116);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ifram_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ifram_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(122);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./change_order.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./change_order.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(123);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./check_box.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./check_box.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(124);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./extra_click_plus.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./extra_click_plus.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(125);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./linetext.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./linetext.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(126);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./select.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./select.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(128);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_grid.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_grid.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(129);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab_fields.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab_fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _config = __webpack_require__(10);

var config = _interopRequireWildcard(_config);

var _mix_table_data = __webpack_require__(38);

var mix_table_data = _interopRequireWildcard(_mix_table_data);

var _mix_v_table_adapter = __webpack_require__(39);

var mix_v_table_adapter = _interopRequireWildcard(_mix_v_table_adapter);

var _mix_nice_validator = __webpack_require__(37);

var mix_nice_validator = _interopRequireWildcard(_mix_nice_validator);

var _mix_fields_data = __webpack_require__(36);

var mix_fields_data = _interopRequireWildcard(_mix_fields_data);

var _mix_ele_table_adapter = __webpack_require__(35);

var mix_ele_table_adapter = _interopRequireWildcard(_mix_ele_table_adapter);

var _ajax_fields = __webpack_require__(75);

var ajax_fields = _interopRequireWildcard(_ajax_fields);

var _ajax_table = __webpack_require__(76);

var ajax_table = _interopRequireWildcard(_ajax_table);

var _ele_tree = __webpack_require__(14);

var ele_tree = _interopRequireWildcard(_ele_tree);

var _picture = __webpack_require__(65);

var table_picture = _interopRequireWildcard(_picture);

var _label_shower = __webpack_require__(60);

var table_label_shower = _interopRequireWildcard(_label_shower);

var _mapper = __webpack_require__(63);

var table_mapper = _interopRequireWildcard(_mapper);

var _call_fun = __webpack_require__(51);

var call_fun = _interopRequireWildcard(_call_fun);

var _pop_fields = __webpack_require__(3);

var table_pop_fields = _interopRequireWildcard(_pop_fields);

var _pop_fields_local = __webpack_require__(66);

var pop_fields_local = _interopRequireWildcard(_pop_fields_local);

var _linetext = __webpack_require__(61);

var table_linetext = _interopRequireWildcard(_linetext);

var _check_box = __webpack_require__(53);

var table_checkbox = _interopRequireWildcard(_check_box);

var _switch_to_tab = __webpack_require__(69);

var switch_to_tab = _interopRequireWildcard(_switch_to_tab);

var _select = __webpack_require__(68);

var select = _interopRequireWildcard(_select);

var _extra_click = __webpack_require__(55);

var extra_click = _interopRequireWildcard(_extra_click);

var _extra_click_plus = __webpack_require__(56);

var extra_click_plus = _interopRequireWildcard(_extra_click_plus);

var _array_mapper = __webpack_require__(46);

var array_mapper = _interopRequireWildcard(_array_mapper);

var _operations = __webpack_require__(64);

var operations = _interopRequireWildcard(_operations);

var _bool_shower = __webpack_require__(50);

var bool_shower = _interopRequireWildcard(_bool_shower);

var _foreign_click_select = __webpack_require__(57);

var foreign_click_select = _interopRequireWildcard(_foreign_click_select);

var _array_option_mapper = __webpack_require__(48);

var array_option_mapper = _interopRequireWildcard(_array_option_mapper);

var _html_shower = __webpack_require__(58);

var html_shower = _interopRequireWildcard(_html_shower);

var _bool_editor = __webpack_require__(49);

var bool_editor = _interopRequireWildcard(_bool_editor);

var _jump_link = __webpack_require__(59);

var jump_link = _interopRequireWildcard(_jump_link);

var _change_order = __webpack_require__(52);

var change_order = _interopRequireWildcard(_change_order);

var _digit = __webpack_require__(54);

var digit = _interopRequireWildcard(_digit);

var _append_html_shower = __webpack_require__(45);

var append_html_shower = _interopRequireWildcard(_append_html_shower);

var _array_obj_shower = __webpack_require__(47);

var array_obj_shower = _interopRequireWildcard(_array_obj_shower);

var _pop_table = __webpack_require__(67);

var pop_table = _interopRequireWildcard(_pop_table);

var _main = __webpack_require__(17);

var fields_editor_main = _interopRequireWildcard(_main);

var _label_shower2 = __webpack_require__(16);

var field_label_shower = _interopRequireWildcard(_label_shower2);

var _ele_transfer = __webpack_require__(13);

var ele_transfer = _interopRequireWildcard(_ele_transfer);

var _datetime = __webpack_require__(12);

var datetime = _interopRequireWildcard(_datetime);

var _pop_table_select = __webpack_require__(21);

var pop_table_select = _interopRequireWildcard(_pop_table_select);

var _plain_file = __webpack_require__(20);

var plain_file = _interopRequireWildcard(_plain_file);

var _validate_code = __webpack_require__(22);

var validate_code = _interopRequireWildcard(_validate_code);

var _order_list_table = __webpack_require__(18);

var order_list_table = _interopRequireWildcard(_order_list_table);

var _phon_code = __webpack_require__(19);

var phon_code = _interopRequireWildcard(_phon_code);

var _ele_tree_depend = __webpack_require__(15);

var ele_tree_depend = _interopRequireWildcard(_ele_tree_depend);

var _china_address = __webpack_require__(11);

var com_china_address = _interopRequireWildcard(_china_address);

var _operator_a = __webpack_require__(72);

var op_a = _interopRequireWildcard(_operator_a);

var _delete_op = __webpack_require__(71);

var delete_op = _interopRequireWildcard(_delete_op);

var _operator_btn = __webpack_require__(73);

var operator_btn = _interopRequireWildcard(_operator_btn);

var _btn = __webpack_require__(23);

var btn = _interopRequireWildcard(_btn);

var _pop_table_layer = __webpack_require__(33);

var pop_table_layer = _interopRequireWildcard(_pop_table_layer);

var _pop_fields_layer = __webpack_require__(31);

var pop_fields_layer = _interopRequireWildcard(_pop_fields_layer);

var _pop_layer = __webpack_require__(32);

var pop_layer = _interopRequireWildcard(_pop_layer);

var _main2 = __webpack_require__(43);

var panels_main = _interopRequireWildcard(_main2);

var _sim_fields = __webpack_require__(2);

var sim_fields = _interopRequireWildcard(_sim_fields);

var _sim_fields_local = __webpack_require__(27);

var sim_fields_local = _interopRequireWildcard(_sim_fields_local);

var _pop_edit_local = __webpack_require__(26);

var pop_edit_local = _interopRequireWildcard(_pop_edit_local);

var _plain_field_panel = __webpack_require__(25);

var plain_field_panel = _interopRequireWildcard(_plain_field_panel);

var _ele_table = __webpack_require__(74);

var ele_table = _interopRequireWildcard(_ele_table);

var _user_info = __webpack_require__(42);

var user_info = _interopRequireWildcard(_user_info);

var _nice_validator_rule = __webpack_require__(40);

var nice_validator_rule = _interopRequireWildcard(_nice_validator_rule);

var _dropdown = __webpack_require__(28);

var dropdown = _interopRequireWildcard(_dropdown);

var _sm_link = __webpack_require__(29);

var sm_link = _interopRequireWildcard(_sm_link);

var _stack_widget = __webpack_require__(34);

var stack_widget = _interopRequireWildcard(_stack_widget);

var _el_tab_widget = __webpack_require__(30);

var el_tab_widget = _interopRequireWildcard(_el_tab_widget);

var _table_store = __webpack_require__(44);

var table_store = _interopRequireWildcard(_table_store);

var _main3 = __webpack_require__(24);

var fields_panels_main = _interopRequireWildcard(_main3);

var _main4 = __webpack_require__(62);

var table_editor_main = _interopRequireWildcard(_main4);

var _main5 = __webpack_require__(70);

var table_group_main = _interopRequireWildcard(_main5);

var _main6 = __webpack_require__(41);

var node_store_main = _interopRequireWildcard(_main6);

var _main7 = __webpack_require__(77);

var tabs_main = _interopRequireWildcard(_main7);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(79);
__webpack_require__(83);
__webpack_require__(80);
__webpack_require__(81);
__webpack_require__(82);
__webpack_require__(78);
//table mix

//import * as com_pop_fields from './com_pop_fields.js'

// table editor


// field editor


// table operator


//fields operator


//import * as validate from  './validator'

//import * as com_table from  './misc/com_table.js'

//misc


//fields_panels


// top_heads


//ui


// store

/***/ })
/******/ ]);