import viewTarget from 'can-view-target';

export const h1 = function(text/*attributes, children*/) {
    return function(scope, options, nodeList) {
      const target = viewTarget([{
        tag: 'h1',
        callbacks: [],
        children: [
          text
        ]
      }]);

      return target.hydrate(scope);
    };
};
