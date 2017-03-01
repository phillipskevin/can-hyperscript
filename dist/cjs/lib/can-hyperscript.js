/*lib/can-hyperscript*/
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.parseArgs = undefined;
var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
};
var _hyperscript = require('hyperscript');
var _hyperscript2 = _interopRequireDefault(_hyperscript);
var _canCompute = require('can-compute');
var _canCompute2 = _interopRequireDefault(_canCompute);
var _canViewLive = require('can-view-live');
var _canViewLive2 = _interopRequireDefault(_canViewLive);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
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