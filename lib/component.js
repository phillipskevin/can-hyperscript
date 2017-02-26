import compute from 'can-compute';
import Scope from 'can-view-scope';
import viewCallbacks from 'can-view-callbacks';
import viewModel from 'can-view-model';

// create a renderer function from a view
//
// will take the scope passed to renderer function,
// turn it into a data object, and render the view
export const renderView = view => {
  return (scope, options, nodeList) => {
    const data = new Proxy(scope, {
      get(target, property, receiver) {
        return target.read(property, { isArgument: true }).value;
      }
    });

    return view(data);
  };
};

// render a can-component to a document fragment
// and bind its viewModel to the scope
export const component = (tagName, scope) => {
  const el = document.createElement(tagName);

  viewCallbacks.tagHandler(el, tagName, {
    scope: scope,
    options: new Scope()
  });

  const vm = viewModel(el);

  // two-way bind passed scope and VM
  if (scope && scope.serialize) {
    const scopeCompute = compute(() => {
      return scope.serialize();
    });
    // TODO - fix this memory leak
    scopeCompute.on('change', (ev, newVal) => {
      vm.set(newVal);
    });
    vm.set(scopeCompute());
  }

  return el;
};

export default renderView;
