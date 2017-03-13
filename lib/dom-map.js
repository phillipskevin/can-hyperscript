import isArrayLike from 'can-util/js/is-array-like/is-array-like';
import live from 'can-view-live';

const handlers = {
	get(target, property) {
		const prop = target.get(property, { isArgument: true });
		const isListLike = isArrayLike(prop) &&
			typeof prop !== 'string' &&
			typeof prop !== 'number';

		if (isListLike && 'map' in prop) {
			// maybe should check if origMap returns a fragment here
			// const origMap = prop.map;
			Object.defineProperty(prop, 'map', {
				get() {
					return (cb) => {
						const frag = document.createDocumentFragment();
						const el = document.createTextNode('');
						frag.appendChild(el);

						live.list(el, prop, item => {
							item = typeof item === 'function' ? item() : item;
							const itemEl = cb(item);
							return itemEl;
						});

						return frag;
					};
				}
			});
		}

		return prop;
	},
	set(target, property, value) {
		target.set(property, value);
		return true;
	}
};

const DOMMap = map => {
	return new Proxy(map, handlers);
};

export default DOMMap;
