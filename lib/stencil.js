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
			attrs: attrs,
			callbacks: [],
			children: flatten(children)
		}]);

		return target.hydrate(scope);
	};
};

export const text = text => {
	return interpolate(text);
};

const flatten = arr => arr.reduce((arr, item) => {
	if (Array.isArray(item)) {
		arr.push(...item);
	} else {
		arr.push(item);
	}
	return arr;
}, []);

const interpolate = text => {
	return function(map) {
		const textCompute = compute(() => {
			return text.replace(/{([^{}]*)}/g, (orig, key) => {
				const scope = getScope(map);
				return scope.read(key).value || orig;
			});
		});

		live.text(this, textCompute);
	};
}

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
