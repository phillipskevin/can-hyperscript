import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import { h1, div, p, input } from '../../lib/stencil';
import { component, renderView } from '../../lib/component';

import './styles.css';

const OneCounterViewModel = DefineMap.extend({
  count: { type: 'number', value: 0 },
  plus() { this.count++ },
  minus() { this.count-- }
});

const oneCounterView = (scope) => {
  return div({}, [
      p({}, [ () => `Count: ${scope.count}` ]),
      input({ type: 'submit', onclick: scope.plus, value: '+' }, []),
      input({ type: 'submit', onclick: scope.minus, value: '-' }, [])
  ]);
};

Component.extend({
  tag: 'one-counter',
  ViewModel: OneCounterViewModel,
  view: renderView(oneCounterView)
});

document.body.append(
  div({}, [
    component('one-counter', {}),
    component('one-counter', {})
  ])
);
