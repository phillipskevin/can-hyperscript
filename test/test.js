import QUnit from 'steal-qunit';
import SimpleMap from 'can-simple-map';
import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import stencil, { h1, div, p } from '../../lib/stencil';

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

// QUnit.test('can-components', () => {
//   const ViewModel = DefineMap.extend({
//     message: {
//       set(val) {
//         return `${val}!`;
//       }
//     },
//         class: { value: 'big-h1' }
//   });
// 
//   const view = scope => {
//     return h1({
//       class: scope.class
//     }, [
//     `Hello, ${scope.message}`
//     ]);
//   };
// 
//   Component.extend({
//     tag: 'hello-world',
//     ViewModel,
//     view: stencil(view)
//   });
// 
//   const parentScope = new DefineMap({
//     message: 'World'
//   });
// 
//   const frag =  component('hello-world', parentScope);
//   QUnit.equal(frag.firstChild.className, 'big-h1');
//   QUnit.equal(frag.firstChild.tagName, 'H1');
//   QUnit.equal(frag.firstChild.innerHTML, 'Hello, World!');
// 
//   parentScope.message = 'Kevin';
//   QUnit.equal(frag.firstChild.innerHTML, 'Hello, Kevin!');
// });
