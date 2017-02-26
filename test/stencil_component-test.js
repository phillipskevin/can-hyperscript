import QUnit from 'steal-qunit';
import DefineMap from 'can-define/map/map';
import Component from 'can-component';
import viewModel from 'can-view-model';

import { h1 } from '../../lib/stencil';
import { renderView, component } from '../../lib/component';

QUnit.module('stencil - can-component');

QUnit.test('can-component', () => {
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
    return h1({
      class: () => scope.class
    }, [
      () => `Hello, ${scope.message}`
    ]);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: renderView(view)
  });

  const frag = component('hello-world', {});
  QUnit.equal(frag.firstChild.className, 'big-h1');
  QUnit.equal(frag.firstChild.tagName, 'H1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, World!');

  const vm = viewModel(frag);

  vm.class = 'small-h1';
  vm.message = 'Kevin';
  QUnit.equal(frag.firstChild.className, 'small-h1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Kevin!');
});

QUnit.test('can-component using parent scope', () => {
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
    return h1({
      class: () => scope.class
    }, [
      () => `Hello, ${scope.message}`
    ]);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: renderView(view)
  });

  const parentScope = new DefineMap({
    message: 'Parent',
    class: 'parent-h1'
  });
  const frag = component('hello-world', parentScope);
  QUnit.equal(frag.firstChild.className, 'parent-h1');
  QUnit.equal(frag.firstChild.tagName, 'H1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Parent!');

  parentScope.class = 'small-h1';
  parentScope.message = 'Kevin';
  QUnit.equal(frag.firstChild.className, 'small-h1');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Kevin!');
});
