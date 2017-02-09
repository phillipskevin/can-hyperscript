import QUnit from 'steal-qunit';
import { h1 } from '../lib/stencil';

QUnit.module('stencil');

QUnit.test('stencil', function(){
	const view = h1('Hello, World!');
	const frag = view();
	QUnit.equal(frag.firstChild.tagName, 'H1');
	QUnit.equal(frag.firstChild.innerHTML, 'Hello, World!');
});
