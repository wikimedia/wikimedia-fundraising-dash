define([
    'jquery',
    'underscore',
    'backbone',
    'models/model',
    'views/nav',
    'views/appContent'],
function($, _, Backbone, model, navView, appContentView){

    var MainRouter = Backbone.Router.extend({

      routes: {
        "":             "index",
        "/":            "index",
        "library":     "library",
        "tests":       "tests"
      },

      initialize: function(){

        //always display the navigation
        this.nav = new navView({el: $('#navContainer')});

        //this app content view takes care of which page to display:
        //the user's selected Board, or the Library (or filtered Libraries)
        this.appView = new appContentView({el: $('.row-fluid #appContent')});

      },

      index: function() {
        alert('index!');
      },

      library: function() {
        alert('library!');
      },

      tests: function() {
        alert('tests!');
      }

    });

    return MainRouter;

});

