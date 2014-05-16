define([
    'jquery',
    'underscore',
    'backbone',
    '../views/app.js'
    ],
function($, _, Backbone, mainView){

    var MainRouter = Backbone.Router.extend({

      initialize: function(){

        this.mainView = new mainView();

      },

      routes: {
        "": "main"
      },

      main: function() {
        this.mainView.render();
      },

    });

    return MainRouter;

});