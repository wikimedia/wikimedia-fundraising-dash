define( [
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'routers/routes.js',
    'justGage',
    'views/nav',
    'views/appContent'
], function( $, _, Backbone, Bootstrap, Routes, justGage, navView, appContentView ){

    var App = Backbone.View.extend({

        el: $('.container-fluid #dashApp'),

        initialize: function(){

            //always display the navigation
            this.nav = new navView({el: $('#navContainer')});

            //this app content view takes care of which page to display:
            //the user's selected Board, or the Library (or filtered Libraries)
            this.appView = new appContentView({el: $('.row-fluid #appContent')});


        },

        render: function(){

            this.nav.render();
            this.appView.render();

        }

    });

    return App;
});