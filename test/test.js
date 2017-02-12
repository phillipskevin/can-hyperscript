import QUnit from 'steal-qunit';
import SimpleMap from 'can-simple-map';
import { h1 } from '../lib/stencil';

QUnit.module('stencil');

QUnit.test('basics', () => {
	const scope = new SimpleMap({ msg: 'World', class: 'big-h1' });
	const template = h1({
		class: '{class}'
	}, [
		'Hello, {msg}!'
	]);
	const frag = template(scope);
	QUnit.equal(frag.firstChild.className, 'big-h1');
	QUnit.equal(frag.firstChild.tagName, 'H1');
	QUnit.equal(frag.firstChild.innerHTML, 'Hello, World!');

	scope.attr('msg', 'Mars');
	scope.attr('class', 'small-h1');
	QUnit.equal(frag.firstChild.className, 'small-h1');
	QUnit.equal(frag.firstChild.tagName, 'H1');
	QUnit.equal(frag.firstChild.innerHTML, 'Hello, Mars!');
});
