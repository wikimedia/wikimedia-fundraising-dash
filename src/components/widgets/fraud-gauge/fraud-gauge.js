define([
    'knockout',
    'text!components/widgets/fraud-gauge/fraud-gauge.html',
    'gauge',
    'bootstrap-datepicker'],
function( ko, template, datePickersTemplate ){

  function FraudGaugeViewModel( params ){

    var self = this;
    self.title = 'Fraud Rejections';
    self.chosenTimePeriod = ko.observable('Last 15 Minutes');

    self.chosenFilters = [
      { filterName: 'currency: USD'},
      { filterName: 'country: USA'},
      { filterName: 'campaign: big english'},
      { filterName: 'gateway: Global Collect'}
      ];

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
      console.log('submit');
    };

  }

  return { viewModel: FraudGaugeViewModel, template: template };

});
