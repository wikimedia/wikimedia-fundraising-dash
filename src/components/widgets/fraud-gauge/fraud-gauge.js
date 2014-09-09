define([
    'knockout',
    'text!components/widgets/fraud-gauge/fraud-gauge.html',
    'gauge',
    'bootstrap-datepicker',
    'jquery-ui'],
function( ko, template, datePickersTemplate ){

  function FraudGaugeViewModel( params ){

    var self = this;
    self.title = 'Fraud Rejections';
    self.selectedTimePeriod = ko.observable();
    self.chosenFilters = ko.observableArray([]);

    self.lowRange = ko.observable(33);
    self.highRange = ko.observable(66);
    $('#fraudPercentSlider').slider({
      range: true,
      min: 0,
      max: 100,
      //default is to split into thirds evenly
      values: [ 33, 66 ],
      slide: function( event, ui ){
        var l = $('#fraudPercentSlider').slider( "values", 0),
            h = $('#fraudPercentSlider').slider( "values", 1);
        self.lowRange  = ko.observable(l);
        self.highRange = ko.observable(h);
      },
    });

    self.getFilters = ko.computed( function(){
      //TODO: make this happen via database (hardcode for now)
      //TODO: check to see if db has changed then fetch

      var filterNamesFromDB = ['Currency','Method','Source','Campaign','Medium','Referrer','Gateway','Fraud Score'],
      subfilterNamesFromDB  = [
                              [ 'USD', 'AUD', 'ESB', 'ABC', 'DEF' ],
                              [ 'Credit Card', 'Bank Transfer', 'Check' ],
                              [ 'Source 1', 'Source 2' ],
                              [ 'Big English', 'Another Campaign' ],
                              [ 'Medium 1', 'Medium 2', 'Medium 3' ],
                              [ 'Banner', 'Donate', 'Adam' ],
                              [ 'Global Collect', 'WorldPay', 'Another Gateway' ],
                              [ '0-100', '100-150', '150-200', '200+', 'or whatever' ] ];

      filters = [];

      for(var i=0; i<filterNamesFromDB.length; i++){
        var filterObj = {filterName: filterNamesFromDB[i]};
        filters.push(filterObj);
      }

      for(var j=0; j<subfilterNamesFromDB.length; j++){
        for(var filter in filters){
          filters[j].subfilter = subfilterNamesFromDB[j];
        }
      }

      self.filters = ko.observableArray(filters);

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

    self.hasMadeSelection = ko.observable(false);

    //TODO: connect with database
    self.getFraudFailurePercent = function(){
      //TODO: run query and get the real percentage ;p
      //for now make it easy to visualize for testing
      var randomishVals = [2222, 5555, 8888];
      var numberOfFails = randomishVals[parseInt(Math.random() * 3)],
          numberOfTransactions = 10000;
      var value = (numberOfFails/numberOfTransactions) * 100;
      self.value = ko.observable(parseInt(value) + "%");
      //get color thresholds
      //TODO: these vals to come from user's choices via slider.
      if(value < 33){
        self.opts.colorStop = '#89CC23';
      } else if(value >= 33 && value < 66){
        self.opts.colorStop = '#FFA722';
      } else {
        self.opts.colorStop = '#c12e2a';
      }

      self.gauge.setOptions(self.opts);

      return value;
    };

    // self.setSubfilter = function(subfilter){
    //   self.filterChecked = ko.observable(subfilter);
    // };

    self.filterChecked = ko.observable();

    //#FraudRiskScoreGauge
    //TODO: cleanup
    self.context = document.getElementById('FraudRiskScoreGauge');
    self.gauge = new Gauge(self.context).setOptions(self.opts);
    self.gauge.maxValue = 100;
    self.gauge.animationSpeed = 32;
    self.gauge.set(self.getFraudFailurePercent());
    ///////////////////

    self.getSQL = function(){
      //get SQL query into popover (fake SQL for now)

      self.selfQuery = "SELECT SUM(total_amount) FROM civicrm_contribution WHERE receive_date BETWEEN '20130701' AND '20140701';";

      $('#sqlModal .modal-body').html(self.selfQuery);

    };

    self.submitGaugeModifications = function(){
      //TODO: get all values from the form into the SQL query
      //run that query and generate the new widget

      console.log('selected date: ', self.selectedTimePeriod());
    };

  }

  return { viewModel: FraudGaugeViewModel, template: template };

});
