require.config({
    'paths': {
        'bootstrap':            'javascripts/vendor/bootstrap/dist/js/bootstrap',
        'style':                'css/style.css',
        'QUnit':                'javascripts/vendor/qunit/qunit/qunit',
        'jquery':               'javascripts/vendor/jquery/dist/jquery',
        'd3':                   'javascripts/vendor/d3/d3',
        'underscore':           'javascripts/vendor/underscore/underscore',
        'backbone':             'javascripts/vendor/backbone/backbone',
        'text':                 'javascripts/vendor/requirejs-text/text',
        'chartjs':              'javascripts/vendor/chartjs/Chart',
        'momentjs':             'javascripts/vendor/moment/moment',
        'handlebars':           'javascripts/vendor/handlebars/handlebars',
        'jquery.ui.widget':     'javascripts/vendor/jquery.ui/ui/jquery.ui.widget',
        'jquery.ui.mouse':      'javascripts/vendor/jquery.ui/ui/jquery.ui.mouse',
        'jquery.ui.core':       'javascripts/vendor/jquery.ui/ui/jquery.ui.core',
        'jquery.ui.slider':     'javascripts/vendor/jquery.ui/ui/jquery.ui.slider',
        'flot':                 'javascripts/vendor/flot/jquery.flot',
        'flot.pie':             'javascripts/vendor/flot/jquery.flot.pie',
        'flot.stack':           'javascripts/vendor/flot/jquery.flot.stack',
        'flot.resize':          'javascripts/vendor/flot/jquery.flot.resize',
        'flot.time':            'javascripts/vendor/flot/jquery.flot.time',
        'raphael':              'javascripts/vendor/raphael/raphael',
        'justGage':             'javascripts/vendor/justgage/justgage',
        'bootstrap-datepicker': 'javascripts/bootstrap-datepicker/js/bootstrap-datepicker'
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
        'jquery.ui.mouse': {
            deps: [
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.slider': {
            deps: [
                'jquery',
                'jquery.ui.core',
                'jquery.ui.mouse'
            ]
        },
        'flot': {
            deps: [
                'flot.pie',
                'flot.stack',
                'flot.resize',
                'flot.time'
            ]
        },
        'justGage': {
            deps: [
                'raphael'
            ]
        },
    }
});

require([
    'backbone',
    'bootstrap',
    'views/app',
    'handlebars'
    ],
    function(Backbone, Bootstrap, App, Handlebars){

        var app = new App();
        app.render();

});