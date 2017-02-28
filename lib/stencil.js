import hyperscript from 'hyperscript';
import compute from 'can-compute';
import live from 'can-view-live';

const h = (tagName, attrs, children) => {
  // handle children as a function so you can programmatically
  // generate children and have it respond to compute changes
  if (typeof children === 'function') {
    const origChildren = children;
    const frag = document.createDocumentFragment();
    const textNode = document.createTextNode('');
    frag.appendChild(textNode);

    const childrenCompute = compute(() => {
      return origChildren();
    });

    live.html(textNode, childrenCompute);

    children = [ frag ];
  }

  // Handle live bound text nodes
  children = children.map(child => {
    if (typeof child === 'function') {
      const frag = document.createDocumentFragment();
      const textNode = document.createTextNode('');
      frag.appendChild(textNode);

      const textCompute = compute(() => {
        return child();
      });

      live.html(textNode, textCompute);

      return frag;
    }

    return child;
  });

  // Remove attributes that should be live bound
  // these will be added back with live.attr after calling hyperscript
  // Also remove event handlers, so they can be registered separtely
  const liveAttrs = {};
  const eventHandlers = {};
  for (let attr in attrs) {
    const attrValue = attrs[attr];
    const isEventHandler = attr.startsWith('on');

    if (typeof attrValue === 'function') {
      if (isEventHandler) {
        eventHandlers[attr.slice(2).toLowerCase()] = attrValue;
      } else {
        liveAttrs[attr] = attrValue;
      }

      delete attrs[attr];
    }
  }

  // create hyperscript element
  const el = hyperscript(tagName, attrs, children);

  // Add live bound attributes
  for (let attr in liveAttrs) {
    const attrValue = liveAttrs[attr];

    const attrCompute = compute(() => {
      return attrValue();
    });

    live.attr(el, attr, attrCompute);
  }

  // Add event handlers
  for (let eventName in eventHandlers) {
    const handler = eventHandlers[eventName];
    el.addEventListener(eventName, handler);
  }

  return el;
};

export default h;
