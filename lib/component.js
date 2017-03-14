import Scope from 'can-view-scope';
import viewCallbacks from 'can-view-callbacks';
import viewModel from 'can-view-model';

import events from 'can-util/dom/events/events';
import 'can-util/dom/events/removed/removed';

// create a renderer function from a view
//
// will take the scope passed to renderer function,
// turn it into a data object, and render the view
export const render = view => {
	return scope => {
		const data = new Proxy(scope, {
			get(target, property) {
				return target.get(property, { isArgument: true });
			},
			set(target, property, value) {
				target.set(property, value);
				return true;
			}
		});

		return view(data);
	};
};

// render a can-component to a document fragment
// and bind its viewModel to the scope
const handleCustomTag = (tagName, scope) => {
	const el = document.createElement(tagName);
	const teardownFns = [];

	viewCallbacks.tagHandler(el, tagName, {
		scope: scope,
		options: new Scope()
	});

	const vm = viewModel(el);

	// set up two-way binding
	const setupBinding = (from, to, prop) => {
		const handler = (ev, newVal) => {
			if (to.get(prop) !== newVal) {
				to.set(prop, newVal);
			}
		};

		from.on(prop, handler);

		teardownFns.push(() => {
			from.removeEventListener(prop, handler);
		});
	};

	// set default vm values from scope
	// and two-way bind property between vm and scope
	for (let prop in scope) {
		if (scope.hasOwnProperty(prop)) {
			vm[prop] = scope[prop];

			setupBinding(vm, scope, prop);
			setupBinding(scope, vm, prop);
		}
	}

	// clean up bindings on `removed`
	events.addEventListener.call(el, 'removed', () => {
		teardownFns.forEach(fn => { fn(); });
	});

	return el;
};

// mixin can-component handling to hyperscript function
export const hyperComponents = (h) => {
	return (tagName, attrs, children) => {
		const isCustomTag = viewCallbacks.tag(tagName);

		if (isCustomTag) {
			return handleCustomTag(tagName, attrs);
		} else {
			return h(tagName, attrs, children);
		}
	};
};

export default hyperComponents;
