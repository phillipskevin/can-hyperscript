import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import { h1, h2, div, p, input } from '../../lib/stencil';
import { component, renderView } from '../../lib/component';

import viewModel from 'can-view-model';
window.viewModel = viewModel;

import './styles.css';

// App
const AppViewModel = DefineMap.extend({
  count: { type: 'number', value: 0 }
});

const appView = (scope) => {
  return div({}, [
    div({}, [
      h1({}, [ () => `Count: ${scope.count}` ]),
      input({
        type: 'text',
        value: () => scope.count,
        onchange: (ev) => {
          scope.count = ev.target.value;
        }
      }, [])
    ]),
    div({}, [
      h2({}, [ 'Children' ]),
      component('a-counter', scope)
    ])
  ]);
};

Component.extend({
  tag: 'my-app',
  ViewModel: AppViewModel,
  view: renderView(appView)
});

// Counter Component
const CounterViewModel = DefineMap.extend({
  count: { type: 'number', value: 0 },
  plus() { this.count++ },
  minus() { this.count-- }
});

const counterView = (scope) => {
  return div({}, [
      p({}, [ () => `Count: ${scope.count}` ]),
      input({ type: 'submit', onclick: scope.plus, value: '+' }, []),
      input({ type: 'submit', onclick: scope.minus, value: '-' }, [])
  ]);
};

Component.extend({
  tag: 'a-counter',
  ViewModel: CounterViewModel,
  view: renderView(counterView)
});

document.body.append(
  component('my-app', {}),
);
