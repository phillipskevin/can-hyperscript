import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';

import hyperscript from '../../lib/can-hyperscript';
import hyperComponents, { render } from '../../lib/component';

import viewModel from 'can-view-model';

import './styles.css';

const h = hyperComponents(hyperscript);

// App
const AppViewModel = DefineMap.extend({
	count: { type: 'number', value: 0 },
	planets: {
		Type: DefineList,
		value: [ 'Earth', 'Neptune', 'Jupiter', 'Saturn', 'Uranus', 'Venus', 'Mercury' ]
	}
});

const appView = data => {
	return h('div', {}, [
		h('div', {}, [
			h('h2', {}, 'A Counter'),
			h('h3', {}, [ () => `Count: ${data.count}` ]),
			h('input', {
				type: 'text',
				value: () => data.count,
				onchange: (ev) => {
					data.count = ev.target.value;
				}
			}, []),
			h('h2', {}, 'A List of Planets'),
		]),
		h('div', {}, [
			h('h2', {}, [ 'Children' ]),
			h('a-counter', data),
			h('div', { },
				data.planets.map(planet =>
					h('p', {}, [ () => `Hello, ${planet}!` ])
				)
			)
		])
	]);
};

Component.extend({
	tag: 'my-app',
	ViewModel: AppViewModel,
	view: render(appView),
	events: {
		inserted() {
			setTimeout(() => {
				this.viewModel.planets.splice(3, 0, 'Mars');
			}, 5000);
		}
	}
});

// Counter Component
const CounterViewModel = DefineMap.extend({
	count: { type: 'number', value: 0 },
	plus() { this.count++ },
	minus() { this.count-- }
});

const counterView = data => {
	return h('div', {}, [
		h('p', {}, [ () => `Count: ${data.count}` ]),
		h('input', { type: 'submit', onclick: data.plus, value: '+' }, []),
		h('input', { type: 'submit', onclick: data.minus, value: '-' }, [])
	]);
};

Component.extend({
	tag: 'a-counter',
	ViewModel: CounterViewModel,
	view: render(counterView)
});

document.body.append(
	h('my-app', {}),
);
