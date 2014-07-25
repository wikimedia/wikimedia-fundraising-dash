define([
    'jquery',
    'underscore',
    'backbone',
    'models/model',
    'justGage',
    'models/FraudScore',
    'handlebars',
    'bootstrap-datepicker',
    'text!views/templates/datePickers.html',
    'text!views/templates/widgets/fraudRiskScoreGauge.html'],
function($, _, Backbone, model, justGage, FraudScoreModel, Handlebars, DatePicker, datePickersTemplate, template){

  var DatePickerSubView = Backbone.View.extend({

    el: $('#fraudDatePickers'),

    template: _.template( datePickersTemplate ),

    events: {
      'click input[type="radio"]':        'selectDateType',
      'click .datepicker':                'pickDates',
      'click #submitTimePeriod':          'submitTimePeriod'
    },

    initialize: function(){

      this.chosenTimePeriod = "Last 15 Minutes";

      this.setElement($('#fraudDatePickers'));

      this.setupTemplate();

    },

    setupTemplate: function(){
      console.log('setting up...');
      console.log(this.chosenTimePeriod);
      this.template = Handlebars.compile(datePickersTemplate);
      this.context = {
        chosenTimePeriod: this.chosenTimePeriod
      };
      this.html = this.template(this.context);
    },

    selectDateType: function(event){
      var dateType = event.target.id;
      switch(dateType) {
        case 'byIncrement':
          console.log('its by increment');
          break;
        case 'byPreset':
          console.log('its by preset');
          break;
        case 'byTwoValues':
          console.log('its by two values');
          break;
      }
    },

    pickDates: function(){
      console.log('pickin dates');
      $('.datepicker').datepicker();
    },

    submitTimePeriod: function(){
      this.chosenTimePeriod = "hi";
      this.setupTemplate();
    },

    render: function(){

      this.setupTemplate();
      $(this.el).append(this.html);

    }

  });

  var View = Backbone.View.extend({

    el: $('#appContent'),

    model: FraudScoreModel,

    template: _.template( template ),

    events: {
      'click .filterCheckbox':                  'showFilters',
      'click .subfilterCheckbox':               'addFilters',
      'click #submitFraudGaugeOptions':         'submit',
      'click #queryButton':                     'togglePopover'
    },

    initialize: function(){

      //set up default values
      this.setElement($('#appContent'));
      this.setupRangeSlider();
      this.updateFilterValues();

      //update default options
      this.chosenFilters = [];

      //initialize query popover
      //this.initializeQueryPopover();


      this.template = Handlebars.compile(template);
      this.context = {
        //fix this to bubble up, or refactor
        chosenTimePeriod: 'Last 15 minutes',
        chosenFilters:    this.chosenFilters
      };
      this.html = this.template(this.context);

    },

    togglePopover: function(){
      //get SQL query into popover (fake SQL for now)
      this.thisQuery = "SELECT SUM(total_amount) FROM civicrm_contribution WHERE receive_date BETWEEN '20130701' AND '20140701';";
      $('#queryButton').attr('data-content', this.thisQuery).popover('toggle');
    },

    updateOptions: function(){
      //time period
      this.chosenTimePeriod = $('#fraudTimePeriodDropdown').val();
      console.log('chosenTimePeriod: ', this.chosenTimePeriod);
    },

    showFilters: function(event){
      var filterType = event.target.id,
          subFilters = "$('#" + filterType + "Subfilters'" + ')';

      $("#" + event.target.id + 'Subfilters').toggleClass('hide');
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

      //subviews
      this.renderDatePickers();

      this.gauge = new JustGage({
        id: "FraudRiskScoreGauge",
        value: this.getFraudFailurePercent(),
        min: 0,
        max: 100,
        relativeGaugeSize: true,
        label: "% Failures",
        levelColors: ['#89CC23', '#FFE146', '#c12e2a'],
        levelColorsGradient: true
      });

      this.events = {
        'click .filterCheckbox': this.addFilters
      };

    },

    renderDatePickers: function(){
      this.datepickers = new DatePickerSubView();
      $(this.el).append(this.datepickers.render());
      return this.datepickers;
    }

  });

  return View;

});
