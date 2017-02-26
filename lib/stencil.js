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
        return target.read(property, { isArgument: true }).value;
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
    setAttribute(el, attr, attrs[attr]);
  }

  if (typeof children === 'function') {
    const frag = document.createTextNode('');
    el.appendChild(frag);

    const childrenCompute = compute(() => {
      return children();
    });

    live.html(frag, childrenCompute);
  } else {
    children.forEach(child => {
      appendChild(el, child);
    });
  }

  return el;
};

// export element function with shorter name
export const l = makeLiveElement;

// helper for making tag functions like h1, div, span, etc
const makeTagFunction = tagName => {
  return (attrs, children) => {
    return l(tagName, attrs, children);
  };
};

// export helpers
export const h1 = makeTagFunction('h1');
export const div = makeTagFunction('div');
export const p = makeTagFunction('p');
export const ul = makeTagFunction('ul');
export const li = makeTagFunction('li');
export const input = makeTagFunction('input');

// render a can-component to a document fragment
// and bind its viewModel to the scope
export const component = (tagName, scope) => {
  const el = document.createElement(tagName);

  viewCallbacks.tagHandler(el, tagName, {
    scope: scope,
    options: new Scope()
  });

  const vm = viewModel(el);

  // two-way bind passed scope and VM
  if (scope && scope.serialize) {
    const scopeCompute = compute(() => {
      return scope.serialize();
    });
    // TODO - fix this memory leak
    scopeCompute.on('change', (ev, newVal) => {
      vm.set(newVal);
    });
    vm.set(scopeCompute());
  }

  return el;
};

// append a child node
// use live.html if the child is a function
const appendChild = (el, child) => {
  const textNode = document.createTextNode('');
  el.appendChild(textNode);

  const textCompute = compute(() => {
    return typeof child === 'function' ? child() : child;
  });

  live.html(textNode, textCompute);
};

// set an attribute on an element
// use live.attr if the attrValue is a function
const setAttribute = (el, attr, attrValue) => {
  if (attr.startsWith('on')) {
    const fnName = attrValue.name.split(' ').slice(-1);
    const eventName = attr.slice(2).toLowerCase();

    // TODO - fix this memory leak
    el.addEventListener(eventName, attrValue);
  } else {
    const attrCompute = compute(() => {
      return typeof attrValue === 'function' ? attrValue() : attrValue;
    });

    live.attr(el, attr, attrCompute);
  }
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
