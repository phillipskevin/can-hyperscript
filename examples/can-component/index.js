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
  headerClass: { value: 'big-h1' }
});

const view = (scope) => {
  return h1({
    class: () => scope.headerClass
  }, [
    () => `Hello, ${scope.message}`
  ]);
};

const parentScope = new DefineMap({
  message: 'World',
  headerClass: 'small-h1'
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
  console.log('changing message');
  parentScope.message = 'Kevin';
}, 5000);

setTimeout(() => {
  console.log('changing header class');
  parentScope.headerClass = 'big-h1';
}, 10000);
