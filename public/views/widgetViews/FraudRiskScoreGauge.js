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

    getFraudFailurePercent: function(){

      //TODO: run query and get the real percentage ;p
      //for now make it easy to visualize for testing
      var randomishVals = [2222, 5555, 8888];
      var numberOfFails = randomishVals[parseInt(Math.random() * 3)],
          numberOfTransactions = 10000;

      return (numberOfFails/numberOfTransactions) * 100;

    },

    render: function(){

      $(this.el).append( this.template );

      this.gauge = new JustGage({
        id: "FraudRiskScoreGauge",
        value: this.getFraudFailurePercent(),
        min: 0,
        max: 100,
        relativeGaugeSize: true,
        label: "% Failures",
        levelColorsGradient: true
      });
    }

  });

  return View;

});
