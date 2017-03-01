import Component from 'can-component';
import DefineMap from 'can-define/map/map';

import hyperscript from '../../lib/can-hyperscript';
import hyperComponents, { render } from '../../lib/component';

import viewModel from 'can-view-model';

import './styles.css';

const h = hyperComponents(hyperscript);

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
      h('a-counter', scope)
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
  h('my-app', {}),
);
