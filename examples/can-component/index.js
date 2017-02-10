import Component from 'can-component';
import stache from 'can-stache';
import DefineMap from 'can-define/map/map';
import { h1, text } from '../../lib/stencil';

import './styles.css';

const view = h1({
	class: 'big-h1'
}, [
	text('Hello, {message}!')
]);

const ViewModel = DefineMap.extend({
	message: { value: 'World' }
});

Component.extend({
	tag: 'hello-world',
	ViewModel,
	view
});

document.body.append(
	stache('<hello-world></hello-world>')()
);
