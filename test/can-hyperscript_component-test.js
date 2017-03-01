import QUnit from 'steal-qunit';
import DefineMap from 'can-define/map/map';
import Component from 'can-component';
import viewModel from 'can-view-model';
import domDispatch from 'can-util/dom/dispatch/dispatch';

import hyperscript from '../lib/can-hyperscript';
import hyperComponents, { render } from '../../lib/component';

const h = hyperComponents(hyperscript);

QUnit.module('can-hyperscript - can-component');

QUnit.test('render', () => {
  const ViewModel = DefineMap.extend({
    message: {
      value: 'World',
      set(val) {
        return `${val}!`;
      }
    },
    class: { value: 'big-h1' }
  });

  const view = scope => {
    return h('h1', {
      class: () => scope.class
    }, [
      () => `Hello, ${scope.message}`
    ]);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: render(view)
  });

  const frag = h('hello-world', {});
  QUnit.equal(frag.firstChild.className, 'big-h1');
  QUnit.equal(frag.firstChild.tagName, 'H1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, World!');

  const vm = viewModel(frag);

  vm.class = 'small-h1';
  vm.message = 'Kevin';
  QUnit.equal(frag.firstChild.className, 'small-h1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Kevin!');
});

QUnit.test('can bind viewModel to parent scope', () => {
  const ViewModel = DefineMap.extend({
    message: {
      value: 'World',
      set(val) {
        return `${val}!`;
      }
    },
    class: { value: 'big-h1' }
  });

  const view = scope => {
    return h('h1', {
      class: () => scope.class
    }, [
      () => `Hello, ${scope.message}`
    ]);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: render(view)
  });

  const parentScope = new DefineMap({
    message: 'Parent',
    class: 'parent-h1'
  });
  const frag = h('hello-world', parentScope);
  QUnit.equal(frag.firstChild.className, 'parent-h1');
  QUnit.equal(frag.firstChild.tagName, 'H1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Parent!');

  // to-child binding
  parentScope.class = 'small-h1';
  parentScope.message = 'Kevin';
  QUnit.equal(frag.firstChild.className, 'small-h1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Kevin!');

  // to-parent binding
  const vm = viewModel(frag);
  vm.class = 'big-h1';
  vm.message = 'Connor';
  QUnit.equal(frag.firstChild.className, 'big-h1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Connor!');
});

QUnit.test('event handling - call viewModel function', () => {
  const ViewModel = DefineMap.extend({
    count: { value: 0 },
    plus() {
      QUnit.ok(true, 'viewModel function called');
      this.count++;
    }
  });

  const view = scope => {
    return h('input', { type: 'submit', onclick: scope.plus, value: 'Plus 1' }, []);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: render(view)
  });

  const frag = h('hello-world', {});

  const button = frag.children[0];
  domDispatch.call(button, 'click');
});

QUnit.test('event handling - set viewModel property from event handler', () => {
  const ViewModel = DefineMap.extend({
    count: { set(val) { QUnit.equal(val, 5, 'viewmodel property set'); } }
  });

  const view = scope => {
    return h('input', { type: 'submit', onclick: () => { scope.count = 5; }, value: 'Set to 5' }, []);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: render(view)
  });

  const frag = h('hello-world', {});

  const button = frag.children[0];
  domDispatch.call(button, 'click');
});
