import viewTarget from 'can-view-target';
import getDocument from 'can-util/dom/document/document';
import live from 'can-view-live';
import compute from 'can-compute';
import Scope from 'can-view-scope';
import types from 'can-types';

const document = getDocument();

export const h1 = (attrs, children) => {
	return (scope, options, nodeList) => {
		const target = viewTarget([{
			tag: 'h1',
			attrs: interpolateAttrs(attrs),
			children: children
		}]);

		return target.hydrate(scope);
	};
};

export const text = text => {
	return interpolateText(text);
};

/*
 * returns an array of interpolation functions
 * this will be called back by can-view-target with the scope
 */
const interpolateAttrs = attrs => {
	var callbacks = {};

	for (let attr in attrs) {
		callbacks[attr] = function interpolateAttrsFn(map) {
			const attrCompute = compute(() => {
				return attrs[attr].replace(/{([^{}]*)}/g, (orig, key) => {
					const scope = getScope(map);
					return scope.read(key).value || orig;
				});
			});

			live.attr(this, attr, attrCompute);
		};
	}
	return callbacks;
}

/*
 * returns an interpolation function
 * this will be called back by can-view-target with the scope
 */
const interpolateText = text => {
	return function interpolateTextFn(map) {
		const textCompute = compute(() => {
			return text.replace(/{([^{}]*)}/g, (orig, key) => {
				const scope = getScope(map);
				return scope.read(key).value || orig;
			});
		});

		live.text(this, textCompute);
	};
}

/*
 * Handle any type of Scope
 * Scope, Map, DefineMap, Object, etc
 */
const getScope = map => {
	var scope;
	if(map instanceof Scope) {
		scope = map;
	} else {
		if(!types.isMapLike(map)) {
			map = new types.DefaultMap(map);
		}
		scope = new Scope().add(map);
	}
	return scope;
}
