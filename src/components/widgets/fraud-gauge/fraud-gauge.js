define([
    'knockout',
    'text!components/widgets/fraud-gauge/fraud-gauge.html',
    'gauge',
    'noUISlider',
    'selectize',
    'momentjs',
    'bootstrap-datepicker'
    ],
function( ko, template, datePickersTemplate, noUISlider ){

  function FraudGaugeViewModel( params ){

    var self = this;

    $.ajaxSetup({async:false});

    var widgetData = $.get( 'metadata/fraud', function(reqData){
      self.data = reqData;
    });

    self.title = 'Fraud Rejections';
    self.selectedTimePeriod = ko.observable();
    self.selectedFilters = ko.observableArray([]);
    self.selectedSubFilters = ko.observableArray([]);
    self.queryRequest = [];
    self.gaugeValue = ko.observable(3);
    self.filtersSelected = ko.observable(false);
    self.gaugeIsSetUp = ko.observable(false);
    self.queryString = ko.observable('This widget hasn\'t been set up yet!');

    //broken down data from above
    self.filters = ko.observableArray($.map(self.data.filters, function(val, i){return[val]}));
    self.filterNames = ko.computed( function(){
      var names = [];
      $.each(self.filters(), function(el, i){
        names.push(i.display);
      });
      return names;
    });

    //default range slider settings
    self.lowRange = ko.observable(33);
    self.highRange = ko.observable(66);
    $('#fraudPercentSlider').noUiSlider({
      start: [ self.lowRange(), self.highRange() ],
      range: {
        'min': [0],
        'max': [100]
      },
      step: 1,
      connect: true
    });
    $('#fraudPercentSlider').on({
      slide: function(){
        var sliderValArray = $('#fraudPercentSlider').val();
        self.lowRange(parseInt(sliderValArray[0]));
        self.highRange(parseInt(sliderValArray[1]));
      },
    });

    //Gauge options
    self.opts = {
      lines: 12,
      angle: 0,
      lineWidth: 0.44,
      pointer: {
        strokeWidth: 0
      },
      limitMax: 'true',
      colorStop: '#c12e2a',
      strokeColor: '#E0E0E0',
      generateGradient: true
    };

    self.getFraudFailurePercent = function(lowHi, midHi){
      //get color thresholds
      //TODO: these vals to come from user's choices via slider.
      if(self.gaugeValue() < lowHi){
        self.opts.colorStop = '#89CC23';
      } else if(self.gaugeValue() >= lowHi && self.gaugeValue() < midHi){
        self.opts.colorStop = '#FFA722';
      } else {
        self.opts.colorStop = '#c12e2a';
      }

      self.gauge.setOptions(self.opts);

      return self.gaugeValue();
    };

    //#FraudRiskScoreGauge
    self.context = document.getElementById('FraudRiskScoreGauge');
    self.gauge = new Gauge(self.context).setOptions(self.opts);
    self.gauge.maxValue = 100;
    self.gauge.animationSpeed = 32;
    self.gauge.set(self.getFraudFailurePercent());
    ///////////////////

    self.validateSubmission = function( times, filters ){

      var validation = {
         validated: '',
         errors: []
       };

      //there must be a chosen timeframe
       if(!times){
         validation.errors.push('You must submit a valid time.')
        validation.validated = false;
       } else {
         validation.validated = true;
      }

      return validation;
    };

    self.convertToQuery = function( userChoices ){

      var qs            = '',
          ds            = '',
          timePresets   = [ "Last 15 Minutes",
                            "Last Hour",
                            "Last 24 Hours",
                            "Last 5 Minutes"];

      $.each( self.selectedSubFilters(), function(i, el){
        //add the filters' parent filter
        if(i===0){
          qs += el;
        } else {
          qs += ' and ' + el;
        }
      });

      //convert time constraints
      var currentDate = new Date();
      switch( userChoices.timespan[0] ){
        case timePresets[0]:
          var lfm = new Date(currentDate.getTime() - (15 * 60 * 1000));
          ds += 'dt gt ' + moment(lfm).format();
          break;
        case timePresets[1]:
          var lh = new Date(currentDate.getTime() - (60 * 60 * 1000));
          ds += 'dt gt ' + moment(lh).format();
          break;
        case timePresets[2]:
          var ltfh = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
          ds += 'dt gt ' + moment(ltfh).format();
          break;
        case timePresets[3]:
          var lfvm = new Date(currentDate.getTime() - (5 * 60 * 1000));
          ds += 'dt gt ' + moment(lfvm).format();
          break;
      }

      //if there's already something in the qs, precede new string with 'and'
      var postQS = '';
      if(qs.length > 0){
        postQS = qs + ' and ' + ds;
      } else {
        postQS = ds;
      }

      self.queryString(postQS);
      console.log('query string: ', self.queryString());

      return postQS;
    };

    self.showSubfilters = function(stuff){
      $('#'+stuff).toggleClass('hide');
    };

    self.submitGaugeModifications = function(){

      //validate values first.
      var validation = self.validateSubmission( self.selectedTimePeriod(), self.selectedFilters() );
      if( !validation.validated ){
        console.log(validation);
        event.stopImmediatePropagation();
        $('#fraudSubmissionErrors').html('<p class="text-danger">you have errors in your submission:</p><ul></ul>' ).addClass('show');
        $.each( validation.errors, function(el, i){
          $('#fraudSubmissionErrors ul').append('<li>' + i + '</li>');
        });

      } else{

        //gauge boundaries
        var rangePoints = [parseInt($('#fraudPercentSlider').val()[0]), parseInt($('#fraudPercentSlider').val()[1])],
            lowRange    = [0, rangePoints[0]],
            midRange    = [rangePoints[0], rangePoints[1]],
            highRange   = [rangePoints[1], 100];

        //gauge time period
        self.queryRequest['timespan'] = self.selectedTimePeriod();

        //gauge filters
        self.queryRequest['selectedFilters'] = self.selectedFilters();
        self.filtersSelected(true);

        //gauge subfilters
        self.selectedSubFilters();

        //put it all into a real query
        //this will be a function call - TODO: make parsing function
        self.queryString( self.convertToQuery(self.queryRequest));

        $.get( '/data/fraud?' + $.param({ '$filter': "Currency eq 'USD'" }).replace(
          /\+/g, '%20' ), function ( dataget ) {
          self.gaugeIsSetUp(true);
          self.gaugeValue( parseFloat(dataget[0].fraud_percent).toFixed(2) );
          self.gauge.set(self.getFraudFailurePercent(parseInt($('#fraudPercentSlider').val()[0]), parseInt($('#fraudPercentSlider').val()[1])));
        } );
      };


    };


  }

  return { viewModel: FraudGaugeViewModel, template: template };

});