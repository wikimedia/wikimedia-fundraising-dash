define([
    'jquery',
    'underscore',
    'backbone',
    'models/model',
    'justGage',
    'text!views/templates/widgets/fraudRiskScoreGauge.html'],
function($, _, Backbone, model, justGage, template){

  var View = Backbone.View.extend({

    el: '#appContent',

    template: _.template( template ),

    initialize: function(){

      this.el = '#appContent';


    },

    render: function(){

      $(this.el).append( this.template );

      this.gauge = new JustGage({
        id: "gauge",
        value: getRandomInt(350, 980),
        min: 0,
        max: 100,
        title: "Green",
        label: "",
        levelColorsGradient: false
      });
    }

  });

  return View;

});
