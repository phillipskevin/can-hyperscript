import QUnit from 'steal-qunit';
import plugin from './stencil';

QUnit.module('stencil');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the stencil plugin');
});
