import QUnit from 'steal-qunit';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import domDispatch from 'can-util/dom/dispatch/dispatch';

import { h1, div, p, ul, li, input } from '../../lib/stencil';

QUnit.module('stencil');

QUnit.test('live binding - text node', () => {
  const data = new DefineMap({
    message: 'World'
  });

  const view = data => {
    return h1({ class: 'big-h1' }, [
      () => `Hello, ${data.message}!`
    ]);
  };

  const frag = view(data);
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, World!');
  QUnit.equal(frag.className, 'big-h1');

  data.message = 'Mars';
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, Mars!');
  QUnit.equal(frag.className, 'big-h1');
});

QUnit.test('live binding - attribute', () => {
  const data = new DefineMap({
    class: 'big-h1'
  });

  const view = data => {
    return h1({ class: () => data.class }, [
      'Hello, World!'
    ]);
  };

  const frag = view(data);
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, World!');
  QUnit.equal(frag.className, 'big-h1');

  data.class = 'small-h1';
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, World!');
  QUnit.equal(frag.className, 'small-h1');
});

QUnit.test('live binding - children', () => {
  const Scope = DefineMap.extend({
    children: DefineList
  });
  const data = new Scope({
    children: [ 'First', 'Second' ]
  });

  const view = data => {
    return ul({}, () => data.children.map(child =>
        li({}, [ `${child} List Item` ])));
  };

  const frag = view(data);

  QUnit.equal(frag.tagName, 'UL');

  QUnit.equal(frag.children[0].tagName, 'LI');
  QUnit.equal(frag.children[0].innerHTML, 'First List Item');

  QUnit.equal(frag.children[1].tagName, 'LI');
  QUnit.equal(frag.children[1].innerHTML, 'Second List Item');

  data.children.push('Third');
  QUnit.equal(frag.tagName, 'UL');

  QUnit.equal(frag.children[0].tagName, 'LI');
  QUnit.equal(frag.children[0].innerHTML, 'First List Item');

  QUnit.equal(frag.children[1].tagName, 'LI');
  QUnit.equal(frag.children[1].innerHTML, 'Second List Item');

  QUnit.equal(frag.children[2].tagName, 'LI');
  QUnit.equal(frag.children[2].innerHTML, 'Third List Item');
});

QUnit.test('event handling', () => {
  const data = new DefineMap({
    count: 0,
    plus() {
      QUnit.ok(true, 'plus called');
      this.count++;
    }
  });

  const view = data => {
    return div({}, [
      p({}, [ () => `Count: ${data.count}` ]),
      input({ type: 'submit', onClick: data.plus }, [ 'Click Me!' ])
    ])
  };

  const frag = view(data);

  QUnit.equal(frag.children[0].innerHTML, 'Count: 0');

  const inputEl = frag.children[1];
  domDispatch.call(inputEl, 'click');
});
