import QUnit from 'steal-qunit';
import SimpleMap from 'can-simple-map';
import stencil, { h1 } from '../../lib/stencil';

QUnit.module('stencil');

QUnit.test('basics', () => {
	const scope = new SimpleMap({
		message: 'World',
		class: 'big-h1'
	});

	const view = (scope) => {
		return h1({
			class: scope.class
		}, [
			`Hello, ${scope.message}!`
		]);
	};

	const template = stencil(view);
	const frag = template(scope);
	QUnit.equal(frag.firstChild.className, 'big-h1');
	QUnit.equal(frag.firstChild.tagName, 'H1');
	QUnit.equal(frag.firstChild.innerHTML, 'Hello, World!');

	scope.attr('message', 'Mars');
	scope.attr('class', 'small-h1');
	QUnit.equal(frag.firstChild.className, 'small-h1');
	QUnit.equal(frag.firstChild.tagName, 'H1');
	QUnit.equal(frag.firstChild.innerHTML, 'Hello, Mars!');
});
