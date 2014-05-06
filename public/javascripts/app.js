/**
 * Wikimedia Foundation
 *
 * LICENSE
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 */


// define( ['routers/home'], function( router ){

//   var init = function(){
// 	this.router = new router();
//   };

//   return { init: init };

// });

require.config({
	appDir: "../",
	app: "../app",
	baseUrl: "javascripts",
	dir: "../../app-build/",
	optimize: "none",
	'paths': {
		"jquery": "jquery",
		"underscore": "libs/underscore",
		"backbone": "libs/backbone",
		"text": "libs/text",
    'QUnit': 'libs/qunit'
	},
	shim: {
       'QUnit': {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       }
    }
});

require([
	'underscore',
	'backbone',
	'text',
	'text!stylesheets/style.css',
	'QUnit',
	'tests/base_test',
	'tests/maps_test'
	],
	function( _, Backbone, text, style, QUnit, base_test, maps_test ){
		app.init();
		// run the tests.
    base_test.run();
    maps_test.run();
    // start QUnit.
    QUnit.load();
    QUnit.start();
});