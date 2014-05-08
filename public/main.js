require.config({
    'paths': {
        'bootstrap': 'javascripts/vendor/bootstrap/dist/css/bootstrap.css',
        "style": "css/style.css",
        'QUnit': 'javascripts/vendor/qunit/qunit/qunit',
        'jquery': 'javascripts/vendor/jquery/dist/jquery',
        'underscore': 'javascripts/vendor/underscore/underscore',
        'backbone': 'javascripts/vendor/backbone/backbone',
        'text': 'javascripts/vendor/requirejs-text/text'
    },
    shim: {
       'QUnit': {
            exports: 'QUnit',
            init: function() {
              QUnit.config.autoload = false;
              QUnit.config.autostart = false;
           }
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: [
                'jquery'
            ]
        }
    }
});

require([
    'underscore',
    'backbone',
    'text',
    'text!bootstrap',
    'text!css/style.css',
    'views/index.js',
    'routers/home'
    ],
    function( _, Backbone, bootstrap, text, style, App ){
        App.init();
        // run the tests.
        base_test.run();
        maps_test.run();
        // start QUnit.
        QUnit.load();
        QUnit.start();
});