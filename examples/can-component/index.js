import Component from 'can-component';
import stache from 'can-stache';
import DefineMap from 'can-define/map/map';

import stencil, { h1 } from '../../lib/stencil';

import './styles.css';

const ViewModel = DefineMap.extend({
	message: { value: 'World' },
	class: { value: 'big-h1' }
});

const view = (scope) => {
	return h1({
		class: scope.class
	}, [
		`Hello, ${scope.message}!`
	]);
};

Component.extend({
	tag: 'hello-world',
	ViewModel,
	view: stencil(view),
	events: {
		inserted() {
			setTimeout(() => {
				this.viewModel.message = 'Kevin';
				this.viewModel.class = 'bigger-h1';
			}, 2000);
		}
	}
});

document.body.append(
	stache('<hello-world></hello-world>')()
);
