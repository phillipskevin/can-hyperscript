import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import h from '../../lib/stencil';
import { component, render } from '../../lib/component';

import viewModel from 'can-view-model';
window.viewModel = viewModel;

import './styles.css';

// App
const AppViewModel = DefineMap.extend({
  count: { type: 'number', value: 0 }
});

const appView = (scope) => {
  return h('div', {}, [
    h('div', {}, [
      h('h1', {}, [ () => `Count: ${scope.count}` ]),
      h('input', {
        type: 'text',
        value: () => scope.count,
        onchange: (ev) => {
          scope.count = ev.target.value;
        }
      }, [])
    ]),
    h('div', {}, [
      h('h2', {}, [ 'Children' ]),
      component('a-counter', scope)
    ])
  ]);
};

Component.extend({
  tag: 'my-app',
  ViewModel: AppViewModel,
  view: render(appView)
});

// Counter Component
const CounterViewModel = DefineMap.extend({
  count: { type: 'number', value: 0 },
  plus() { this.count++ },
  minus() { this.count-- }
});

const counterView = (scope) => {
  return h('div', {}, [
      h('p', {}, [ () => `Count: ${scope.count}` ]),
      h('input', { type: 'submit', onclick: scope.plus, value: '+' }, []),
      h('input', { type: 'submit', onclick: scope.minus, value: '-' }, [])
  ]);
};

Component.extend({
  tag: 'a-counter',
  ViewModel: CounterViewModel,
  view: render(counterView)
});

document.body.append(
  component('my-app', {}),
);