import QUnit from 'steal-qunit';
import SimpleMap from 'can-simple-map';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import domDispatch from 'can-util/dom/dispatch/dispatch';

import stencil, { h1, div, p, ul, li, input } from '../../lib/stencil';

QUnit.module('stencil');

QUnit.test('element with live text', () => {
  const scope = new SimpleMap({
    message: 'World'
  });

  const view = scope => {
    return h1({ class: 'big-h1' }, [
      () => `Hello, ${scope.message}!`
    ]);
  };

  const template = stencil(view);
  const frag = template(scope);
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, World!');
  QUnit.equal(frag.className, 'big-h1');

  scope.attr('message', 'Mars');
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, Mars!');
  QUnit.equal(frag.className, 'big-h1');
});

QUnit.test('element with live attribute', () => {
  const scope = new SimpleMap({
    class: 'big-h1'
  });

  const view = scope => {
    return h1({ class: () => scope.class }, [
      'Hello, World!'
    ]);
  };

  const template = stencil(view);
  const frag = template(scope);
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, World!');
  QUnit.equal(frag.className, 'big-h1');

  scope.attr('class', 'small-h1');
  QUnit.equal(frag.tagName, 'H1');
  QUnit.equal(frag.innerHTML, 'Hello, World!');
  QUnit.equal(frag.className, 'small-h1');
});

QUnit.test('element with multiple children', () => {
  const view = scope => {
    return div({}, [
      p({}, [ 'First Paragraph' ]),
      p({}, [ 'Second Paragraph' ])
    ]);
  };

  const template = stencil(view);
  const frag = template({});

  QUnit.equal(frag.tagName, 'DIV');

  QUnit.equal(frag.children[0].tagName, 'P');
  QUnit.equal(frag.children[0].innerHTML, 'First Paragraph');

  QUnit.equal(frag.children[1].tagName, 'P');
  QUnit.equal(frag.children[1].innerHTML, 'Second Paragraph');
});

QUnit.test('element with multiple children from scope', () => {
  const Scope = DefineMap.extend({
    children: DefineList
  });
  const scope = new Scope({
    children: [ 'First', 'Second' ]
  });

  const view = scope => {
    return ul({}, () => scope.children.map(child =>
        li({}, [ `${child} List Item` ])));
  };

  const template = stencil(view);
  const frag = template(scope);

  QUnit.equal(frag.tagName, 'UL');

  QUnit.equal(frag.children[0].tagName, 'LI');
  QUnit.equal(frag.children[0].innerHTML, 'First List Item');

  QUnit.equal(frag.children[1].tagName, 'LI');
  QUnit.equal(frag.children[1].innerHTML, 'Second List Item');

  scope.children.push('Third');
  QUnit.equal(frag.tagName, 'UL');

  QUnit.equal(frag.children[0].tagName, 'LI');
  QUnit.equal(frag.children[0].innerHTML, 'First List Item');

  QUnit.equal(frag.children[1].tagName, 'LI');
  QUnit.equal(frag.children[1].innerHTML, 'Second List Item');

  QUnit.equal(frag.children[2].tagName, 'LI');
  QUnit.equal(frag.children[2].innerHTML, 'Third List Item');
});

QUnit.test('element with live text', () => {
  const scope = new DefineMap({
    count: 0,
    plus() {
      QUnit.ok(true, 'plus called');
      this.count++;
    }
  });

  const view = scope => {
    return div({}, [
      p({}, [ () => `Count: ${scope.count}` ]),
      input({ type: 'submit', onClick: scope.plus }, [ 'Click Me!' ])
    ])
  };

  const template = stencil(view);
  const frag = template(scope);

  QUnit.equal(frag.children[0].innerHTML, 'Count: 0');

  const inputEl = frag.children[1];
  domDispatch.call(inputEl, 'click');
});
