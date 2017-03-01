/*lib/can-hyperscript*/
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _hyperscript = require('hyperscript');
var _hyperscript2 = _interopRequireDefault(_hyperscript);
var _canCompute = require('can-compute');
var _canCompute2 = _interopRequireDefault(_canCompute);
var _canViewLive = require('can-view-live');
var _canViewLive2 = _interopRequireDefault(_canViewLive);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
var h = function h(tagName, attrs, children) {
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