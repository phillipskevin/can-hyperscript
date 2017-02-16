import viewTarget from 'can-view-target';
import Scope from 'can-view-scope';
import types from 'can-types';
import compute from 'can-compute';
import live from 'can-view-live';

const stencil = renderer => {
	return (scope, options, nodeList) => {
		scope = getScope(scope);

		const proxyScope = new Proxy(scope, {
			get(target, property, receiver) {
				return target.read(property).value;
			}
		});

		var root = document.createDocumentFragment();
		const textNode = document.createTextNode('');

		const rendererCompute = compute(() => {
			return renderer(proxyScope);
		});

		root.appendChild(textNode);

		live.html(textNode, rendererCompute);

		return root;
	};
};

const makeElementFn = tag => {
	return (attrs, children) => {
		const target = viewTarget([{ tag, attrs, children }]);
		return target.hydrate({});
	};
};

export const h1 = makeElementFn('h1');

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

export default stencil;
