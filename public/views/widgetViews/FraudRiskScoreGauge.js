define([
    'jquery',
    'underscore',
    'backbone',
    'models/model',
    'justGage',
    'models/FraudScore',
    'handlebars',
    'text!views/templates/widgets/fraudRiskScoreGauge.html'],
function($, _, Backbone, model, justGage, FraudScoreModel, Handlebars, template){

  var View = Backbone.View.extend({

    el: $('#appContent'),

    model: FraudScoreModel,

    template: _.template( template ),

    events: {
      'click .filterCheckbox': 'showFilters',
      'click .subfilterCheckbox': 'addFilters',
      'click #submitFraudGaugeOptions': 'submit'
    },

    initialize: function(){

      this.setElement($('#appContent'));
      //set up defaults
      this.setupRangeSlider();
      this.updateFilterValues();
      this.getWidgetParams();

      this.template = Handlebars.compile(template);
      this.context = {
        chosenTimePeriod: this.chosenTimePeriod,
        chosenFilters:    this.chosenFilters
      };
      this.html = this.template(this.context);

    },

    getWidgetParams: function(){
      //default
      this.chosenFilters = "by Currency";
      this.chosenTimePeriod = "Last 15 Minutes";

      //when changed, do the things.
    },

    showFilters: function(event){
      var filterType = event.target.id,
          subFilters = "$('#" + filterType + "Subfilters'" + ')';

      $("#" + event.target.id + 'Subfilters').toggleClass('hide');
    },

    selectTimePeriod: function(){
      console.log('time period');
    },

    setupRangeSlider: function(){

      //uses jQuery UI slider to allow user to set up own ranges
      //for red/yellow/green values
      $('#fraudPercentSlider').slider({
        range: true,
        min: 0,
        max: 100,
        //default is to split into thirds evenly
        values: [ 33, 66 ],
        slide: function( event, ui ){
          $('#fraudPercent').val( $('#fraudPercentSlider').slider( "values", 0 ) + " - " + $('#fraudPercentSlider').slider( "values", 0 ) + "%" );
        },
      });

    },

    updateFilterValues: function(){
      //TODO: check to see if these values have changed in the db
      //if not, use cached values
    },

    getFraudFailurePercent: function(){

      //TODO: run query and get the real percentage ;p
      //for now make it easy to visualize for testing
      var randomishVals = [2222, 5555, 8888];
      var numberOfFails = randomishVals[parseInt(Math.random() * 3)],
          numberOfTransactions = 10000;

      return (numberOfFails/numberOfTransactions) * 100;

    },

    submit: function(event){
      event.preventDefault();
      console.log('submit');

      //get all the selections into options object

      //uncollapse setup area
      $("#filterCollapse").removeClass('in');

      //update options display

    },

    render: function(){

      $(this.el).append(this.html);

      this.gauge = new JustGage({
        id: "FraudRiskScoreGauge",
        value: this.getFraudFailurePercent(),
        min: 0,
        max: 100,
        relativeGaugeSize: true,
        label: "% Failures",
        levelColorsGradient: true
      });

      this.events = {
        'click .filterCheckbox': this.addFilters
      };

    }

  });

  return View;

});
