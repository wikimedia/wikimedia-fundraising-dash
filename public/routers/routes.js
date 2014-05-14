define([
    'jquery',
    'underscore',
    'backbone',
    'models/model',
    'text!templates/main.html'],
function($, _, Backbone, model, template){

    var MainRouter = Backbone.Router.extend({

      routes: {
        "":             "index",
        "/":            "index",
        "/library":     "library",
        "/tests":       "tests"
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
