/**
 * @type Neatness
 */
var Neatness = require('neatness').newContext(true);

/**
 * @namespace
 * @name mylib
 * @global mylib
 */
var mylib = module.exports = window.mylib = Neatness.namespace('mylib');

/**
 * @type Neatness
 */
mylib.Neatness = Neatness;

// Load files
require('./base/Model');
require('./models/Item');

// Initialize
// ...