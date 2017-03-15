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

  const view = data => {
    return h('h1', {
      class: () => data.class
    }, [
      () => `Hello, ${data.message}`
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

QUnit.test('bindings - can bind viewModel to parent scope', () => {
  const ViewModel = DefineMap.extend({
    message: {
      value: 'World',
      set(val) {
        return `${val}!`;
      }
    },
    class: { value: 'big-h1' }
  });

  const view = data => {
    return h('h1', {
      class: () => data.class
    }, [
      () => `Hello, ${data.message}`
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
  QUnit.equal(frag.firstChild.tagName, 'H1', 'correct tag');
  QUnit.equal(frag.firstChild.className, 'parent-h1', 'parent sets default attribute');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Parent!', 'parent sets default child');

  // to-child binding
  parentScope.class = 'small-h1';
  parentScope.message = 'Kevin';
  QUnit.equal(frag.firstChild.className, 'small-h1', 'parent can change vm through attribute');
  QUnit.equal(frag.firstChild.innerHTML, 'Hello, Kevin!', 'parent can change vm through child');

  // to-parent binding
  const vm = viewModel(frag);
  vm.class = 'big-h1';
  vm.message = 'Connor';
  QUnit.equal(parentScope.class, 'big-h1', 'vm can change parent through attribute');
  QUnit.equal(parentScope.message, 'Connor!', 'vm can change parent through child');
});

QUnit.test('event handling - call viewModel function', () => {
  const ViewModel = DefineMap.extend({
    count: { value: 0 },
    plus() {
      QUnit.ok(true, 'viewModel function called');
      this.count++;
    }
  });

  const view = data => {
    return h('input', { type: 'submit', onclick: data.plus, value: 'Plus 1' }, []);
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

  const view = data => {
    return h('input', { type: 'submit', onclick: () => { data.count = 5; }, value: 'Set to 5' }, []);
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

QUnit.test('lists - work', () => {
  const ViewModel = DefineMap.extend({
    planets: {
      value: [ 'Earth', 'Mars' ]
    }
  });

  const view = data => {
		return h('h1', { },
			data.planets.map(planet =>
				h('p', {}, [ () => `Hello, ${planet}!` ])
			)
		);
  };

  Component.extend({
    tag: 'hello-world',
    ViewModel,
    view: render(view)
  });

  const frag = h('hello-world', {});
  QUnit.equal(frag.firstChild.tagName, 'H1');
	const paragraphs = frag.firstChild.children;
  QUnit.equal(paragraphs.length, 2);

  QUnit.equal(paragraphs[0].innerHTML, 'Hello, Earth!');
  QUnit.equal(paragraphs[1].innerHTML, 'Hello, Mars!');
});
