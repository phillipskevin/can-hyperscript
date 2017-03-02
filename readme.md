# can-hyperscript

[![Build Status](https://travis-ci.org/phillipskevin/can-hyperscript.png?branch=master)](https://travis-ci.org/phillipskevin/can-hyperscript)

Create HyperText with JavaScript and CanJS live binding.

This is an experimental library and all APIs are subject to change. Feedback is welcome - feel free to open issues with suggestions and feature requests.

## What is HyperScript

[HyperScript](https://github.com/hyperhype/hyperscript) is a way to create HyperText (the HT in HTML) with JavaScript. It looks something like this:

```js
import h from 'hyperscript';

h('div#menu', { style: { 'background-color': 'orange' } },
    h('ul',
        h('li', 'Burger'),
        h('li', 'Hot Dog'),
        h('li', 'French Fries')
    )
);
```

## Use with CanJS Observables

can-hyperscript allows you to use HyperScript with live-binding to CanJS observables.

### can-compute

If a compute is passed as an attribute or child, [can-view-live](http://canjs.com/doc/can-view-live.html) will be used to update the HTML whenever the value of the compute changes.

```js
import h from 'can-hyperscript';
import compute from 'can-compute';

const message = compute('Hello, World!');
const headerClass = compute('big-h1');
const frag = h('h1', { class: headerClass }, [ message ]);

frag.outerHTML; // <h1 class="big-h1">Hello, World!</h1>

message('Hello, Mars!');
headerClass('bigger-h1');

frag.outerHTML; // <h1 class="bigger-h1">Hello, Mars!</h1>
```

### Map / DefineMap

To use with other CanJS observable types, pass functions for attributes or children (this example is using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)):

```js
import h from 'can-hyperscript';
import DefineMap from 'can-define/map/map';

const data = new DefineMap({
  message: 'World',
  class: 'big-h1'
});
const frag = h('h1', { class: () => data.class }, [ () => `Hello, ${data.message}!` ]);

frag.outerHTML; // <h1 class="big-h1">Hello, World!</h1>

data.class = 'bigger-h1';
data.message = 'Mars';

frag.outerHTML; // <h1 class="bigger-h1">Hello, Mars!</h1>
```

## Use with CanJS Components

can-hyperscript provides a few helpers to make working with can-components simple.

### render

`can-hyperscript/lib/component` provides a `render` function for rendering a view for a component.

```js
import h from 'can-hyperscript';
import { render } from 'can-hyperscript/lib/component';
import DefineMap from 'can-define/map/map';
import Component from 'can-component';

const ViewModel = DefineMap.extend({
  message: { value: 'Hello, World!' }
});

const view = data => {
	return h('h1', () => data.message);
};

Component.extend({
  tag: 'my-component',
  ViewModel: ViewModel,
  view: render(view)
});
```

### hyperComponents mixin

There is also a mixin available to allow you to render `can-component`s:

```js
import baseH from 'can-hyperscript';
import { hyperComponents } from 'can-hyperscript/lib/component';

const h = hyperComponents(baseH);

document.body.appendChild(
  h('my-component', {})
);
```
