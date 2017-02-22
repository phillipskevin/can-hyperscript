import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import stencil, { h1, component } from '../../lib/stencil';

import './styles.css';

const ViewModel = DefineMap.extend({
  message: {
    set(val) {
      return `${val}!`;
    }
  },
  class: { value: 'big-h1' }
});

const view = (scope) => {
  return h1({
    class: scope.class
  }, [
    `Hello, ${scope.message}`
  ]);
};

const parentScope = new DefineMap({
  message: 'World'
});

Component.extend({
  tag: 'hello-world',
  ViewModel,
  view: stencil(view)
});

document.body.append(
  component('hello-world', parentScope)
);

setTimeout(() => {
  parentScope.message = 'Kevin';
}, 2000);
