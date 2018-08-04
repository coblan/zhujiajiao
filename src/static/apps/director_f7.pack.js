/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//function popup_close(){
//    window._popup_close()
//}
//function popup_assure(){
//    window._popup_assure()
//}

window._popup_close = function () {};
window._popup_assure = function () {};

var popup_page = exports.popup_page = {
    methods: {
        selector: function selector() {
            alert('must custom selector');
        },
        assure: function assure() {
            alert('should assure function');
            this.close();
        },
        open: function open() {
            var self = this;
            f7_app.popup(self.selector());
            self.add_nav();
            ff.push(this.close_);

            this.old_popup_close = window._popup_close;
            this.old_popup_assure = window._popup_assure;
            window._popup_close = this.close;
            window._popup_assure = function () {
                self.assure();
            };
        },
        close: function close() {
            ff.pop();
            this.close_();
        },
        close_: function close_() {
            f7_app.closeModal(this.selector());
            this.rm_nav();
            window._popup_close = this.old_popup_close;
            window._popup_assure = this.old_popup_assure;
        },

        //            search:function () {
        //                setTimeout(function(){
        //                    parent.replace_iframe(ex.appendSearch(search_args))
        //                },300)
        //            },
        add_nav: function add_nav() {
            ff.add_nav('<div class="navbar-inner temp-navbar" style="background-color: inherit;">\
                            <div class="left"><a href=" javascript:void(0)" onclick="call_iframe(\'_popup_close\')" style="padding-left: 1em;">取消</a></div>\
                            <div class="center"></div>\
                            <div class="right"><a href=" javascript:void(0)" onclick="call_iframe(\'_popup_assure\')" style="padding-right: 1em;">确定 </a></div>\
                            </div>');
        },
        rm_nav: function rm_nav() {
            parent.remove_nav();
        }

    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _base = __webpack_require__(2);

var base = _interopRequireWildcard(_base);

var _f = __webpack_require__(3);

var f7 = _interopRequireWildcard(_f);

var _filter_win = __webpack_require__(4);

var filter_win = _interopRequireWildcard(_filter_win);

var _table_time_group = __webpack_require__(5);

var _popup = __webpack_require__(0);

var _try = __webpack_require__(6);

var try01 = _interopRequireWildcard(_try);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.base = base;
window.filter_win = filter_win;
window.table_time_group = _table_time_group.table_time_group;
window.popup_page = _popup.popup_page;

window.ff = f7.ff;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.bye = bye;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dog = function () {
    function Dog() {
        _classCallCheck(this, Dog);
    }

    _createClass(Dog, [{
        key: 'say',
        value: function say() {
            alert('my name is dog');
        }
    }]);

    return Dog;
}();

function bye() {
    var obj = new Dog();
    obj.say();
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ff = {
    app: parent.myApp,
    push: function push(obj) {
        parent.state_stack.push(obj);
    },
    pop: function pop() {
        parent.state_stack.pop();
    },
    back: function back(callback) {
        parent.back(callback);
    },
    load: function load(url, name) {
        var name = name.replace(/\./g, '_');
        parent.show_load();
        parent.load_iframe(url, name);
    },
    load_vue_com: function load_vue_com(kw) {
        parent.load_vue_com(kw);
    },
    replace: function replace(url) {
        parent.show_load();
        parent.replace_iframe(url);
    },
    pop_menu: function pop_menu(buttons) {
        parent.pop_menu(buttons);
    },
    show_load: function show_load() {
        parent.show_load();
    },
    hide_load: function hide_load(time) {
        parent.hide_load(time);
    },
    init_page: function init_page(str) {
        ff.hide_load(200);
        var str = str || page_label;
        parent.init_page();
        parent.set_title(str);
    },
    show_nav: function show_nav() {
        parent.show_nav();
    },
    hide_nav: function hide_nav() {
        parent.hide_nav();
    },
    add_nav: function add_nav(str) {
        parent.add_nav(str);
    },
    alert: function alert(str) {
        parent.myApp.alert(str);
    },
    confirm: function confirm(info, callback) {
        parent.myApp.confirm(info, callback);
    },
    open_image: function open_image(str) {
        var myPhotoBrowser = parent.myApp.photoBrowser({
            zoom: 400,
            photos: [str]
        });
        myPhotoBrowser.open(); // open photo browser
        ff.push(function () {
            myPhotoBrowser.close();
        });
    }

};

if (!parent.myApp) {
    exports.ff = ff = {
        app: {
            actions: function actions() {}
        },
        push: function push(obj) {},
        pop: function pop() {},
        back: function back(callback) {},
        load: function load(url, name) {
            location = url;
        },
        replace: function replace(url) {
            location = url;
        },
        pop_menu: function pop_menu(buttons) {},
        show_load: function show_load() {},
        hide_load: function hide_load(time) {},
        init_page: function init_page() {},
        show_nav: function show_nav() {},
        hide_nav: function hide_nav() {},
        add_nav: function add_nav(str) {},
        alert: function (_alert) {
            function alert(_x) {
                return _alert.apply(this, arguments);
            }

            alert.toString = function () {
                return _alert.toString();
            };

            return alert;
        }(function (str) {
            alert(str);
        }),
        confirm: function (_confirm) {
            function confirm(_x2, _x3) {
                return _confirm.apply(this, arguments);
            }

            confirm.toString = function () {
                return _confirm.toString();
            };

            return confirm;
        }(function (info, callback) {
            confirm(info, callback);
        }),
        open_image: function open_image(str) {
            alert(str);
        }
    };
}

var ff = exports.ff = ff;

var F7Manager = exports.F7Manager = function () {
    function F7Manager(app, mainView) {
        _classCallCheck(this, F7Manager);

        this.app = app;
        this.mainView = mainView;
        this.state_stack = [];
        this.load_timer = null;
    }

    _createClass(F7Manager, [{
        key: 'load_iframe',
        value: function load_iframe(url, name) {
            var _this = this;

            this.show_load();
            var html = this.get_template();
            html = ex.template(html, { name: name, url: url });
            this.mainView.router.loadContent(html);
            if (this.mainView.history.length > 2) {
                this.mainView.showNavbar();
            } else {
                // �ڵڶ���ҳ�棬������סnavbar��500������������ʾ��
                this.mainView.hideNavbar();
                setTimeout(function () {
                    _this.mainView.showNavbar();
                }, 200);
            }
            setTimeout(function () {
                $('.pages .page').last().find('.page-content.iframe_content iframe').attr('src', url);
            }, 300);
        }
    }, {
        key: 'get_template',
        value: function get_template() {
            return '\n        <div class="navbar">\n            <div class="navbar-inner">\n                <div class="left"><a href="#" class="back link"> <i class="icon icon-back"></i><span>\uFFFD\uFFFD\uFFFD\uFFFD</span></a></div>\n                <div class="center"><span style="color: #999999">\uFFFD\uFFFD\uFFFD\uFFFD...</span></div>\n                <div class="right pop-menu" style="visibility: hidden;">\n                    <!-- Right link contains only icon - additional "icon-only" class-->\n                    <a href="#" class="link icon-only"> <i class="icon icon-bars"></i></a>\n                </div>\n            </div>\n        </div>\n        <div class="pages">\n            <!-- Page, data-page contains page name-->\n            <div data-page="{name}" class="page page-cus">\n                <div class="page-content iframe_content ">\n                    <div style="height: 100vh;width: 5vw;position: fixed;z-index: 9000;background: rgba(0,0,0,0);top:0;left: 0;"></div>\n                    <iframe class="iframe_wraper"  frameborder="0" width="100%" height="100%"></iframe>\n                </div>\n            </div>\n        </div>';
        }
    }, {
        key: 'set_title',
        value: function set_title(title) {
            $('.navbar .navbar-inner:last-child .center').html(title);
        }
    }, {
        key: 'on_pop_menu',
        value: function on_pop_menu(callback) {
            $('.view .navbar .navbar-inner:last-child .pop-menu').css('visibility', 'visible');
            if (callback) {
                $('.view .navbar .navbar-inner').last().find('.pop-menu')[0].onclick = callback;
            }
        }
    }, {
        key: 'back',
        value: function back(callback) {
            // ��formҳ���޸�item���ݺ󣬷��ػ�tableҳ��ʱ����Ҫ����table�ж�Ӧitem������
            if (callback) {
                var last_win = $(this.mainView.activePage.fromPage.container).find('.iframe_wraper')[0].contentWindow;
                callback(last_win);
            }
            this.mainView.router.back();
        }
    }, {
        key: 'call_iframe',
        value: function call_iframe(callback_name) {
            var args = Array.prototype.slice.call(arguments);
            $('.page-on-center .iframe_wraper')[0].contentWindow[callback_name].apply(this, args.slice(1, args.length));
        }
    }, {
        key: 'add_nav',
        value: function add_nav(str) {
            $('.view .navbar .navbar-inner').last().after(str);
        }
    }, {
        key: 'remove_nav',
        value: function remove_nav() {
            $('.view .navbar .navbar-inner').last().remove();
        }
    }, {
        key: 'mount_history',
        value: function mount_history() {
            var _this2 = this;

            this._add_history();
            window.addEventListener('popstate', function (e) {
                var state = e.state;
                if (state.count < 1) {
                    _this2._add_history();
                }
                if (_this2.state_stack.length <= 0) {
                    _this2.mainView.router.back();
                } else {
                    var real_state = _this2.state_stack.pop();
                    if (typeof real_state === 'function') {
                        real_state();
                    }
                }
                _this2.hide_load();
            }, false);
        }
    }, {
        key: '_add_history',
        value: function _add_history() {
            for (var i = 0; i < 3; i++) {
                history.pushState({ count: i }, '');
            }
        }
    }, {
        key: 'show_load',
        value: function show_load(timeout) {
            var timeout = timeout || 10 * 1000;
            $('.general-loader').removeClass('hide');

            if (this.load_timer) {
                clearTimeout(this.load_timer);
            }
            this.load_timer = setTimeout(function () {
                this.app.alert('��������������', '���س�ʱ');
                this.hide_load();
            }, timeout);
        }
    }, {
        key: 'hide_load',
        value: function hide_load(time) {
            if (this.load_timer) {
                clearTimeout(this.load_timer);
                this.load_timer = null;
            }
            var time = time || 20;
            setTimeout(function () {
                $('.general-loader').addClass('hide');
            }, time);
        }
    }]);

    return F7Manager;
}();

//
//var load_timer=null
//
//function show_load(timeout){
//    var timeout= timeout || 10*1000
//    $('.general-loader').removeClass('hide')
//
//    if(load_timer){
//        clearTimeout(load_timer)
//    }
//    load_timer =setTimeout(function(){
//        myApp.alert('��������������', '���س�ʱ');
//        hide_load()
//    },timeout)
//}
//function hide_load(time){
//    if(load_timer){
//        clearTimeout(load_timer)
//        load_timer=null
//    }
//    var time= time || 20
//    setTimeout(function(){
//        $('.general-loader').addClass('hide')
//    },time)
//}
//
//
//
//function pop_menu(callback){
//    $('.view .navbar .navbar-inner:last-child .pop-menu').css('visibility','visible')
//    if(callback){
//        $('.view .navbar .navbar-inner').last().find('.pop-menu')[0].onclick=callback
////            $('.view .navbar-custom').last().find('.pop-menu')[0].onclick=callback
//    }
////        $('.navbar-on-center .pop-menu').css('visibility','visible')
////        if(callback){
////            $('.navbar-on-center .pop-menu')[0].onclick=callback
////        }
//}
//function back(callback){
//    if(callback){
//        var last_win= $(mainView.activePage.fromPage.container).find('.iframe_wraper')[0].contentWindow
//        callback(last_win)
//    }
//    mainView.router.back()
//}
//function iframe_full_screen(value,second){
//    var second= second || 300
//    if(value){
//        $('.page-on-center .iframe_wraper').addClass('full-screen')
//        $('.toolbar').hide()
//        setTimeout(function(){
//            $('.navbar').hide()
//        },second)
//
//    }else{
//        $('.page-on-center .iframe_wraper').removeClass('full-screen')
//        $('.page-on-center .page-content').addClass('_no_bottom')
//        $('.navbar').show()
//        setTimeout(function(){
//            $('.toolbar').show()
//            $('.page-on-center .page-content').removeClass('_no_bottom')
//        },second)
//    }
//}
//
//function show_toolbar(){
//    $('.page-content').removeClass('_no_bottom')
//    $('.toolbar').show()
//}
//function hide_toolbar(){
//    $('.toolbar').hide()
//    $('.page-content').addClass('_no_bottom')
//
//}
//function show_nav(){
//    mainView.showNavbar()
//    $('.pages .page-content').last().removeClass('_no_top')
//}
//function hide_nav(){
//    mainView.hideNavbar()
//    $('.pages .page-content').last().addClass('_no_top')
//}
//
//function call_iframe(callback_name){
//    var args=Array.prototype.slice.call(arguments)
//    $('.page-on-center .iframe_wraper')[0].contentWindow[callback_name].apply(this,args.slice(1,args.length))
//}
//function add_nav(str){
//    $('.view .navbar .navbar-inner').last().after(str)
//}
//function remove_nav(){
//    $('.view .navbar .navbar-inner').last().remove()
//}
//
//function init_page(){
//    state_stack=[]
//    add_history()
//}
//
//function add_history(){
//    for(var i=0;i<3;i++){
//        history.pushState({count:i},'')
//    }
//}
//
//add_history()
//
//window.addEventListener('popstate', function (e) {
//    var state= e.state
//    if(state.count<1){
//        add_history()
//    }
//    if(state_stack.length<=0){
//        mainView.router.back()
//    }else{
//        var real_state= state_stack.pop()
//        if(typeof(real_state) === 'function'){
//            real_state()
//        }
//    }
//    hide_load()
//
//}, false);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.open = open;

var _popup = __webpack_require__(0);

function open(info, callback) {
    var timestamp = Date.now();
    var uniq_id = 'uniq_' + timestamp;

    var callback = callback || function (search_args) {
        location = ex.appendSearch(search_args);
    };
    var filter_logic = {
        el: '#' + uniq_id,
        data: {
            row_filters: info.row_filters,
            search_args: info.search_args,
            search_tip: info.search_tip
        },
        mixins: [_popup.popup_page],
        methods: {
            selector: function selector() {
                return '.popup-filter';
            },
            assure: function assure() {
                this.search();
                this.close();
            },
            search: function search() {
                var self = this;
                //setTimeout(function(){  // popup关闭时，会有向下的滑动动画，如果向下滑动的动画卡顿，可以把这行加上
                callback(self.search_args);
                //},100)
            },
            close: function close() {
                ff.pop();
                this.close_();
                $('#' + uniq_id).remove();
            }

        }
    };
    var mount_str = '<div class="filter-block" id="' + uniq_id + '">\n        <div class="popup popup-filter">\n            <div class="content-block">\n                <com-filter :row_filters="row_filters" :search_args="search_args" :search_tip=\'search_tip\'></com-filter>\n            </div>\n        </div>\n        </div>';

    $('body').append(mount_str);

    setTimeout(function () {
        var filter_win = new Vue(filter_logic);
        Vue.nextTick(function () {
            filter_win.open();
        });
    });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var table_time_group = exports.table_time_group = {
    data: {
        grouped_rows: []
    },
    mounted: function mounted() {
        this.grouped_rows = ex.group_add([], this.rows, this.get_group_key);
    },
    computed: {
        //            grouped_rows:function(){
        //                var new_rows = ex.group_add([],this.rows,function(row){return row.create_time.slice(0,10)})
        //                return new_rows
        //            },

    },
    methods: {
        append_rows: function append_rows(new_rows) {
            this.rows = this.rows.concat(new_rows);
            this.grouped_rows = ex.group_add(this.grouped_rows, new_rows, this.get_group_key);
        },
        get_group_key: function get_group_key(row) {
            alert('must custom get_group_key callback');
        },
        norm_date: function norm_date(date) {
            var span = moment() - moment(date);
            var span_days = moment.duration(span).days();
            if (span_days < 1) {
                return '今天';
            } else if (span_days < 2) {
                return '昨天';
            } else {
                return date;
            }
        },
        norm_time: function norm_time(date_time) {
            return date_time.slice(11, 19);
        },
        load_next_page: function load_next_page() {
            var self = this;
            ex.get(ex.appendSearch({ _page: row_pages.crt_page + 1 }), function (resp) {
                ex.assign(row_pages, resp.row_pages);
                self.append_rows(resp.rows);
            });
        }
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-fuck-try', {
    props: ['name'],
    template: '<span v-text="name" @click="back()"></span>',
    methods: {
        back: function back() {
            this.$parent.callback();
            history.back();
        }
    }

});

/***/ })
/******/ ]);