define([
    'knockout',
    'text!components/widgets/fraud-gauge/fraud-gauge.html',
    'gauge',
    'noUISlider',
    'momentjs',
    'bootstrap-datepicker'
    ],
function( ko, template, datePickersTemplate, noUISlider ){

  function FraudGaugeViewModel( params ){

    //temporary data in the correct format
    data = {
      "name": "fraud",
      "filters": {
        "cur": {
          "table": "pi",
          "column": "currency_code",
          "display": "Currency",
          "type": "dropdown",
          "values": [
            "AED",
            "ARS",
            "AUD",
            "BBD",
            "BDT",
            "BGN",
            "BHD",
            "BMD",
            "BOB",
            "BRL",
            "CAD",
            "CHF",
            "CLP",
            "CNY",
            "COP",
            "CRC",
            "CZK",
            "DKK",
            "DOP",
            "DZD",
            "EGP",
            "EUR",
            "GBP",
            "GTQ",
            "HKD",
            "HNL",
            "HRK",
            "HUF",
            "IDR",
            "ILS",
            "INR",
            "JMD",
            "JOD",
            "JPY",
            "KES",
            "KRW",
            "KZT",
            "LKR",
            "LTL",
            "MAD",
            "MKD",
            "MXN",
            "MYR",
            "NIO",
            "NOK",
            "NZD",
            "OMR",
            "PAB",
            "PEN",
            "PHP",
            "PKR",
            "PLN",
            "QAR",
            "RON",
            "RUB",
            "SAR",
            "SEK",
            "SGD",
            "THB",
            "TRY",
            "TTD",
            "TWD",
            "UAH",
            "USD",
            "UYU",
            "VEF",
            "XCD",
            "ZAR"
          ]
        },
        "met": {
          "table": "pf",
          "coulmn": "payment_method",
          "display": "Method",
          "type": "dropdown",
          "values": [
            "cc",
            "paypal",
            "rtbt",
            "amazon",
            "dd",
            "ew",
            "obt",
            "bt"
          ]
        },
        "src": {
          "table": "ct",
          "column": "utm_source",
          "display": "Source",
          "type": "text"
        },
        "cmp": {
          "table": "ct",
          "column": "utm_campaign",
          "display": "Campaign",
          "type": "text"
        },
        "med": {
          "table": "ct",
          "column": "utm_medium",
          "display": "Medium",
          "type": "dropdown",
          "values": [
            "sitenotice",
            "sidebar",
            "email",
            "spontaneous",
            "wmfWikiRedirect",
            "SocialMedia",
            "WaysToGive",
            "event",
            "externalbanner",
            "outage"
          ]
        },
        "ref": {
          "table": "ct",
          "column": "referrer",
          "display": "Referrer",
          "type": "text"
        },
        "gw": {
          "table": "pf",
          "column": "gateway",
          "display": "Gateway",
          "type": "dropdown",
          "values": [
            "globalcollect",
            "worldpay"
          ]
        },
        "fs": {
          "table": "pf",
          "column": "risk_score",
          "display": "Fraud Score",
          "type": "number"
        },
        "dt": {
          "table": "pf",
          "column": "date",
          "display": "Date",
          "type": "datetime",
          "min": "2005-01-01",
          "max": "2099-12-31"
        },
        "amt": {
          "table": "pi",
          "column": "amount",
          "display": "Amount",
          "type": "number",
          "min": 0,
          "max": 10000
        }
      }
    }

    var self = this;
    self.title = 'Fraud Rejections';
    self.selectedTimePeriod = ko.observable();
    self.selectedFilters = ko.observableArray([]);
    self.queryRequest = [];

    //broken down data from above
    self.currency = ko.observableArray(data.filters.cur.values);
    self.filters = ko.observableArray($.map(data.filters, function(val, i){return[val]}));

    // Fetch options
    self.fetchOptions = function(queryString){
      $.get('data/fraud/'+queryString, function( req, res ){

      });
    };

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

    self.validateSubmission = function( times, filters ){

      var validation = {
        validated: '',
        errors: []
      };

      if(!times){
        validation.errors.push('You must submit a valid time.')
      } else {
        validation.validated = true;
      }

      return validation;
    };

    self.submitGaugeModifications = function(){
      //validate values first.
      var validation = self.validateSubmission( self.selectedTimePeriod(), self.selectedFilters() );
      if( !validation.validated ){
        event.stopImmediatePropagation();
        $('#fraudSubmissionErrors').html('<p class="text-danger">you have errors in your submission: ' + validation.errors + '</p>' ).addClass('show');
      } else{
        //TODO: get all values from the form into the SQL query
        //run that query and generate the new widget

        //gauge boundaries
        var rangePoints = [parseInt($('#fraudPercentSlider').val()[0]), parseInt($('#fraudPercentSlider').val()[1])],
            lowRange    = [0, rangePoints[0]],
            midRange    = [rangePoints[0], rangePoints[1]],
            highRange   = [rangePoints[1], 100];

        //gauge time period
        self.queryRequest['timespan'] = self.selectedTimePeriod();

        //gauge filters
        self.queryRequest['selectedFilters'] = self.selectedFilters();

        //put it all into a real query
        //this will be a function call - TODO: make parsing function
        var queryString = 'cur%20eq%20%27USD%27';

        $.get( '/data/fraud', { '$filter': queryString }, function ( data ) {
          console.log('fraud percent:', data[0].fraud_percent);
        } );
      };


    };

  }

  return { viewModel: FraudGaugeViewModel, template: template };

});