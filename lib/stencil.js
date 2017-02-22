import viewTarget from 'can-view-target';
import Scope from 'can-view-scope';
import types from 'can-types';
import compute from 'can-compute';
import live from 'can-view-live';
import viewCallbacks from 'can-view-callbacks';
import viewModel from 'can-view-model';

const stencil = renderer => {
  return (scope, options, nodeList) => {
    scope = getScope(scope);

    const proxyScope = new Proxy(scope, {
      get(target, property, receiver) {
        return target.read(property).value;
      }
    });

    const root = document.createDocumentFragment();
    const textNode = document.createTextNode('');
    root.appendChild(textNode);

    const rendererCompute = compute(() => {
      return renderer(proxyScope);
    });
    live.html(textNode, rendererCompute);

    return root;
  };
};

export const component = (tagName, scope) => {
  const frag = document.createDocumentFragment();

  viewCallbacks.tagHandler(frag, tagName, {
    scope: scope,
    options: new Scope()
  });

  const vm = viewModel(frag);

  const scopeCompute = compute(() => {
    return scope.serialize();
  });
  // TODO - remove this memory leak
  scopeCompute.on('change', (ev, newVal) => {
    vm.set(newVal);
  });

  vm.set(scopeCompute());

  return frag;
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
  let scope;
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
