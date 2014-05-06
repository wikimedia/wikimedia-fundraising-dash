"use strict";
require.config({
    paths: {
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

// require the unit tests.
require(
    ['QUnit', 'tests/base_test', 'tests/maps_test'],
    function(QUnit, base_test, maps_test) {
        // run the tests.
        base_test.run();
        maps_test.run();
        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);