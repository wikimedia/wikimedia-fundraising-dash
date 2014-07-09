require.config({
    'paths': {
        'bootstrap':        'javascripts/vendor/bootstrap/dist/css/bootstrap.css',
        'style':            'css/style.css',
        'QUnit':            'javascripts/vendor/qunit/qunit/qunit',
        'jquery':           'javascripts/vendor/jquery/dist/jquery',
        'd3':               'javascripts/vendor/d3/d3',
        'underscore':       'javascripts/vendor/underscore/underscore',
        'backbone':         'javascripts/vendor/backbone/backbone',
        'text':             'javascripts/vendor/requirejs-text/text',
        'chartjs':          'javascripts/vendor/chartjs/Chart',
        'momentjs':         'javascripts/vendor/moment/moment',
        'handlebars':       'javascripts/vendor/handlebars/handlebars',
        'jquery.ui.core':   'javascripts/vendor/jquery.ui/ui/jquery.ui.core',
        'jquery.ui.widget': 'javascripts/vendor/jquery.ui/ui/jquery.ui.widget',
        'jquery.ui.mouse':  'javascripts/vendor/jquery.ui/ui/jquery.ui.mouse',
        'jquery.ui.slider': 'javascripts/vendor/jquery.ui/ui/jquery.ui.slider',
        'flot':             'javascripts/vendor/flot/jquery.flot',
        'flot.pie':         'javascripts/vendor/flot/jquery.flot.pie',
        'flot.stack':       'javascripts/vendor/flot/jquery.flot.stack',
        'flot.resize':      'javascripts/vendor/flot/jquery.flot.resize',
        'flot.time':        'javascripts/vendor/flot/jquery.flot.time'
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
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'momentjs': {
            exports: 'moment'
        },
        'jquery.ui.slider': {
            deps: [
                'jquery',
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget'
            ]
        },
        'flot': {
            deps: [
                'flot.pie',
                'flot.stack',
                'flot.resize',
                'flot.time'
            ]
        }
    }
});

require([
    'backbone',
    'views/app',
    'handlebars'
    ],
    function( Backbone, App, Handlebars ){

        var app = new App();
        app.render();

});