import viewTarget from 'can-view-target';
import { interpolateAttrs, interpolateText } from './utils';

const makeElementFn = tagName => (attrs, children) => {
	return (scope, options, nodeList) => {
		const target = viewTarget([{
			tag: tagName,
			attrs: interpolateAttrs(attrs),
			children: children.map(child =>
				typeof child === 'string' ? interpolateText(child) : child
			)
		}]);

		return target.hydrate(scope);
	};
};

export const h1 = makeElementFn('h1');
