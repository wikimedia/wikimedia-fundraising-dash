define([
    'jquery',
    'underscore',
    'backbone',
    'models/model',
    'text!views/templates/welcome.html'],
function($, _, Backbone, model, template){

  var View = Backbone.View.extend({

    el: '#appContent',

    template: _.template( template ),

    initialize: function(){

      this.el = '#appContent';

    },

    render: function(){

      $(this.el).append( this.template );

    }

  });

  return View;

});
