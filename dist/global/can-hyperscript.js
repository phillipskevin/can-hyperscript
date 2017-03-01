/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*lib/can-hyperscript*/
define('can-hyperscript/lib/can-hyperscript', [
    'exports',
    'hyperscript',
    'can-compute',
    'can-view-live'
], function (exports, _hyperscript, _canCompute, _canViewLive) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.parseArgs = undefined;
    var _hyperscript2 = _interopRequireDefault(_hyperscript);
    var _canCompute2 = _interopRequireDefault(_canCompute);
    var _canViewLive2 = _interopRequireDefault(_canViewLive);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
    }
    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
    };
    var parseArgs = exports.parseArgs = function parseArgs(tagName) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var attrs = {}, children = [];
        var isNode = function isNode(el) {
            return el && el.nodeName && el.nodeType;
        };
        var parseArg = function parseArg(arg) {
            if (Array.isArray(arg) || typeof arg === 'function') {
                children = children.concat(arg);
            } else if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && !isNode(arg)) {
                attrs = arg;
            } else {
                children.push(arg);
            }
        };
        while (args.length) {
            parseArg(args.shift());
        }
        return {
            tagName: tagName,
            attrs: attrs,
            children: children
        };
    };
    var h = function h() {
        var _parseArgs = parseArgs.apply(undefined, arguments), tagName = _parseArgs.tagName, attrs = _parseArgs.attrs, children = _parseArgs.children;
        if (typeof children === 'function') {
            var origChildren = children;
            var frag = document.createDocumentFragment();
            var textNode = document.createTextNode('');
            frag.appendChild(textNode);
            var childrenCompute = (0, _canCompute2.default)(function () {
                return origChildren();
            });
            _canViewLive2.default.html(textNode, childrenCompute);
            children = [frag];
        }
        children = children.map(function (child) {
            if (typeof child === 'function') {
                var _frag = document.createDocumentFragment();
                var _textNode = document.createTextNode('');
                _frag.appendChild(_textNode);
                var textCompute = (0, _canCompute2.default)(function () {
                    return child();
                });
                _canViewLive2.default.html(_textNode, textCompute);
                return _frag;
            }
            return child;
        });
        var liveAttrs = {};
        var eventHandlers = {};
        for (var attr in attrs) {
            var attrValue = attrs[attr];
            var isEventHandler = attr.startsWith('on');
            if (typeof attrValue === 'function') {
                if (isEventHandler) {
                    eventHandlers[attr.slice(2).toLowerCase()] = attrValue;
                } else {
                    liveAttrs[attr] = attrValue;
                }
                delete attrs[attr];
            }
        }
        var el = (0, _hyperscript2.default)(tagName, attrs, children);
        var _loop = function _loop(_attr) {
            var attrValue = liveAttrs[_attr];
            var attrCompute = (0, _canCompute2.default)(function () {
                return attrValue();
            });
            _canViewLive2.default.attr(el, _attr, attrCompute);
        };
        for (var _attr in liveAttrs) {
            _loop(_attr);
        }
        for (var eventName in eventHandlers) {
            var handler = eventHandlers[eventName];
            el.addEventListener(eventName, handler);
        }
        return el;
    };
    exports.default = h;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();