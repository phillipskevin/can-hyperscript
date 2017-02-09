import QUnit from 'steal-qunit';
import stencil from '../lib/stencil';

QUnit.module('stencil');

QUnit.test('stencil', function(){
  QUnit.equal(typeof stencil, 'function');
  QUnit.equal(stencil(), 'This is the stencil plugin');
});
