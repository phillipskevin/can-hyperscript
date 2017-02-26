import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';

import stencil, { h1, div, p, component } from '../../lib/stencil';

import './styles.css';

const ViewModel = DefineMap.extend({
  message: {
    set(val) {
      return `${val}!`;
    }
  },
  headerClass: 'string',
  list: { Type: DefineList, value: [] }
});

const view = (scope) => {
  return div({}, [
    h1({
      class: () => scope.headerClass
    }, [ () => `Hello, ${scope.message}` ]),
    div({}, () =>
      scope.list.map(item => p({}, [ `${item} Paragraph` ])))
  ]);
};

const parentScope = new DefineMap({
  message: 'World',
  headerClass: 'small-h1',
  list: [ 'First', 'Second' ]
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
  parentScope.headerClass = 'big-h1';
}, 5000);

setTimeout(() => {
  parentScope.list.push('Third');
}, 10000);
