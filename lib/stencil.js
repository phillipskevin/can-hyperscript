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

    return renderer(proxyScope);
  };
};

// create a document fragment for an html tag
// and make its html live
const makeLiveElement = (tagName, attrs, children) => {
  const el = document.createElement(tagName);

  for (let attr in attrs) {
    addAttribute(el, attr, attrs[attr]);
  }

  children.forEach(child => {
    addChildNode(el, child);
  });

  return el;
};

// export shorter name
export const l = makeLiveElement;

// render a can-component to a document fragment
// and bind its viewModel to the scope
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
  // TODO - fix this memory leak
  scopeCompute.on('change', (ev, newVal) => {
    vm.set(newVal);
  });

  vm.set(scopeCompute());

  return frag;
};

const addChildNode = (el, child) => {
  switch (typeof child) {
    case 'string':
      el.appendChild(document.createTextNode(child));
      break;
    case 'function':
      const textNode = document.createTextNode('');
      el.appendChild(textNode);

      const textCompute = compute(() => {
        return child();
      });

      live.html(textNode, textCompute);
      break;
    default:
      return child;
  }
};

const addAttribute = (el, attr, attrValue) => {
  el.setAttribute(attr, attrValue);
};

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
