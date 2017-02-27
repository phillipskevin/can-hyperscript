import l from './stencil';

// helper for making tag functions
// like h1, div, span, etc
const makeTagFunction = tagName => {
  return (attrs, children) => {
    return l(tagName, attrs, children);
  };
};

// export helpers
export const h1 = makeTagFunction('h1');
export const h2 = makeTagFunction('h2');
export const div = makeTagFunction('div');
export const p = makeTagFunction('p');
export const ul = makeTagFunction('ul');
export const li = makeTagFunction('li');
export const input = makeTagFunction('input');
