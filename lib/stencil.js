import compute from 'can-compute';
import live from 'can-view-live';

// create a document fragment for an html tag
// and make its html live
const l = (tagName, attrs, children) => {
  const el = document.createElement(tagName);

  for (let attr in attrs) {
    setAttribute(el, attr, attrs[attr]);
  }

  if (typeof children === 'function') {
    const frag = document.createTextNode('');
    el.appendChild(frag);

    const childrenCompute = compute(() => {
      return children();
    });

    live.html(frag, childrenCompute);
  } else {
    children.forEach(child => {
      appendChild(el, child);
    });
  }

  return el;
};

// append a child node
// use live.html if the child is a function
const appendChild = (el, child) => {
  const textNode = document.createTextNode('');
  el.appendChild(textNode);

  const textCompute = compute(() => {
    return typeof child === 'function' ? child() : child;
  });

  live.html(textNode, textCompute);
};

// set an attribute on an element
// use live.attr if the attrValue is a function
const setAttribute = (el, attr, attrValue) => {
  if (attr.startsWith('on')) {
    const fnName = attrValue.name.split(' ').slice(-1);
    const eventName = attr.slice(2).toLowerCase();

    // TODO - fix this memory leak
    el.addEventListener(eventName, attrValue);
  } else {
    const attrCompute = compute(() => {
      return typeof attrValue === 'function' ? attrValue() : attrValue;
    });

    live.attr(el, attr, attrCompute);
  }
};

export default l;

export * from './helpers';
