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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _myhistory = __webpack_require__(11);

var myhistory = _interopRequireWildcard(_myhistory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var iframe_html = '\n    <div class="navbar">\n    <!-- Top Navbar-->\n        <div class="navbar-inner">\n            <div class="left"><a href="#" class="back link"> <i class="icon icon-back"></i><span>\u8FD4\u56DE</span></a></div>\n            <div class="center"><span style="color: #999999">\u52A0\u8F7D...</span></div>\n            <div class="right pop-menu" style="visibility: hidden;">\n                <!-- Right link contains only icon - additional "icon-only" class-->\n                <a href="#" class="link icon-only"> <i class="icon icon-bars"></i></a>\n            </div>\n        </div>\n    </div>\n    <div class="pages">\n        <!-- Page, data-page contains page name-->\n        <div data-page="{name}" class="page page-cus">\n            <!-- Scrollable page content-->\n            <div class="page-content iframe_content ">\n                <div style="height: 100vh;width: 5vw;position: fixed;z-index: 9000;background: rgba(0,0,0,0);top:0;left: 0;"></div>\n                <iframe class="iframe_wraper"  frameborder="0" width="100%" height="100%"></iframe>\n            </div>\n        </div>\n    </div>';

function load_iframe(url, name, callback) {
    show_load();
    var html = iframe_html;

    html = ex.template(html, { name: name, url: url });
    mainView.router.loadContent(html);

    if (mainView.history.length > 2) {
        mainView.showNavbar();
    } else {
        // 在第二个页面，先隐藏住navbar，500毫秒后，再显示。
        mainView.hideNavbar();
        setTimeout(function () {
            mainView.showNavbar();
        }, 200);
    }
    setTimeout(function () {
        var last_iframe = $('.pages .page').last().find('.page-content.iframe_content iframe');
        last_iframe.attr('src', url);

        last_iframe.on('load', function () {
            hide_load(200);
            if (callback) {
                // 把该回调传给 子frame ，子frame可以利用 window.ret 调用该回调。
                this.contentWindow.ret = function (node) {
                    return callback(node);
                };
            }
        });
    }, 300);
}

var input_vue_com_html = '\n    <div class="navbar">\n      <!-- Top Navbar-->\n        <div class="navbar-inner">\n            <div class="left"><a href="#" class="back link"> <i class="icon icon-back"></i><span>\u8FD4\u56DE</span></a></div>\n            <div class="center"><span style="color: #999999">\u52A0\u8F7D...</span></div>\n            <div class="right pop-menu" style="visibility: hidden;">\n                <!-- Right link contains only icon - additional "icon-only" class-->\n                <a href="#" class="link icon-only"> <i class="icon icon-bars"></i></a>\n            </div>\n        </div>\n    </div>\n    <div class="pages">\n        <!-- Page, data-page contains page name-->\n        <div data-page="{name}" class="page page-cus">\n            <!-- Scrollable page content-->\n\n            <div class="page-content vue_content">\n                {com_html}\n            </div>\n        </div>\n    </div>';

function load_vue_com(kw) {
    /*
     kw={
     url:url string,
     com_html:html string,
     data:{},
     name:string,
     label:string,
     callback:function,
     }
       callback的使用方法：
       #在parent页面触发vue_com页面，
     load_vue_com({other:xxx,  callback:function(com_resp){
     dosomething(com_resp)
     }
       #在vue_com页面中，在返回parent页面时，要调用注册的回调函数。
     methods:{
     back:function(){
     this.$parent.callback(my_resp)
     mainView.router.back()
     }
     }
       * */

    var html = input_vue_com_html;

    html = ex.template(html, { name: kw.name, com_html: kw.com_html });
    mainView.router.loadContent(html);

    if (mainView.history.length > 2) {
        mainView.showNavbar();
    } else {
        // 在第二个页面，先隐藏住navbar，500毫秒后，再显示。
        mainView.hideNavbar();
        setTimeout(function () {
            mainView.showNavbar();
        }, 200);
    }

    setTimeout(function () {
        ex.load_js(kw.url, function () {
            var el = $('.pages .page').last().find('.vue_content')[0];
            new Vue({
                el: el,
                data: kw.data,
                methods: {
                    callback: kw.callback
                }
            });
            set_title(kw.label);
        });
    }, 50);
}

function set_title(title) {
    // 设置当前子页面的标题
    $('.navbar .navbar-inner:last-child .center').html(title);
}

function init_page() {
    window.state_stack = [];
    myhistory.enable_custom_history();
}

window.load_iframe = load_iframe;
window.load_vue_com = load_vue_com;
window.set_title = set_title;
window.init_page = init_page;

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.enable_custom_history = enable_custom_history;

var _win = __webpack_require__(12);

var win = _interopRequireWildcard(_win);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function enable_custom_history() {
    var his = new HistoryManager();
}

var HistoryManager = function () {
    function HistoryManager() {
        _classCallCheck(this, HistoryManager);

        this.add_history();
        this.listen_event();
    }

    _createClass(HistoryManager, [{
        key: 'add_history',
        value: function add_history() {
            for (var i = 0; i < 3; i++) {
                history.pushState({ count: i }, '');
            }
        }
    }, {
        key: 'listen_event',
        value: function listen_event() {
            window.addEventListener('popstate', function (e) {

                if (mainView.history.length == 1 && state_stack.length == 0) {
                    win.info_quit();
                }

                var state = e.state;
                if (state.count < 1) {
                    add_history();
                }
                if (state_stack.length <= 0) {
                    //注意：state_stack只能用来记录“非跨越f7.load”的状态。
                    mainView.router.back();
                } else {
                    var real_state = state_stack.pop();
                    if (typeof real_state === 'function') {
                        real_state();
                    }
                }
                hide_load();
            }, false);
        }
    }]);

    return HistoryManager;
}();

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.info_quit = info_quit;
function cus_close() {
    window.opener = null;
    window.open('', '_self');
    window.close();
}

var quit_ready = false;
function info_quit() {

    if (quit_ready) {
        cus_close();
    } else {
        myApp.addNotification({
            title: 'warning',
            message: '再次点击退出应用程序!',
            hold: 3000,
            closeIcon: false,
            additionalClass: 'bottom_msg'
        });
        quit_ready = true;

        setTimeout(function () {
            quit_ready = false;
        }, 3000);
    }
}

/***/ })

/******/ });