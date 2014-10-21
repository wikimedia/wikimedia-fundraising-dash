define([
    'knockout',
    'text!components/widgets/ABTesting/ABTestingMain.html',
    'gauge',
    'bootstrap-datepicker'],
function( ko, template, datePickersTemplate ){

  function ABTestingViewModel( params ){

    var self = this;
    self.title = 'A/B Test Results';

    //get the data for the tests
    self.table1 = ko.observableArray([
        {
          "name":"leafy.green",
          "donations":147,
          "impressions":"502,813",
          "don/K bi":0.29,
          "$/K bi":"$6.98 ",
          "clicks":216,
          "amount":"$3,510 ",
          "amount20/K bi":"$4.84 ",
          "avgDonation":"$23.88 ",
          "avg20":"$16.56 ",
          "median":"$20 ",
          "max":"$100 ",
          "conversionrate":"0.68%",
          "mode":"$20 ",
          "mode_s":"$20 "
        },
        {
          "name":"green",
          "donations":143,
          "impressions":"503,249",
          "don/K bi":0.28,
          "$/K bi":"$7.76 ",
          "clicks":201,
          "amount":"$3,905 ",
          "amount20/K bi":"$4.58 ",
          "avgDonation":"$27.31 ",
          "avg20":"$16.13 ",
          "median":"$20 ",
          "max":"$250 ",
          "conversionrate":"0.71%",
          "mode":"$20 ",
          "mode_s":"$20 "
        },
        {
          "name":"Absolute change:",
          "donations":4,
          "impressions":"-436",
          "don/K bi":0.01,
          "$/K bi":"($0.78)",
          "clicks":15,
          "amount":"($395)",
          "amount20/K bi":"$0.26 ",
          "avgDonation":"($3.43)",
          "avg20":"$0.44 ",
          "median":"$0 ",
          "max":"($150)",
          "conversionrate":"-0.03%",
          "mode":"$0 ",
          "mode_s":"$0 "
        }
      ]);

      self.table2 = ko.observableArray([
        {
          "winner":"leafy.green",
          "donations/impression":"2.89%",
          "Donation increase / 1000bi":0.01,
          "$/impression":"-10.05%",
          "Dollar increase / 1000bi":"($0.78)",
          "Impression Anomaly":"-0.09%",
          "a20diff":"$0.26 ",
          "p":0.85,
          "power":0.05,
          "lower 95% confidence (donation)":"-20.62%",
          "upper 95% confidence (donations)":"26.39%",
          "lower 95% confidence ($)":"-41.90%",
          "upper 95% confidence ($)":"21.80%"
        }
      ]);

      self.table3 = ko.observableArray([
        {
          "name":"leafy.green",
          "amount3/1000bi":"$0.88 ",
          "avg3":"$3 ",
          "amount5/1000bi":"$1.46 ",
          "avg5":"$5 ",
          "amount10/1000bi":"$2.80 ",
          "avg10":"$9.59 ",
          "amount50/1000bi":"$6.48 ",
          "avg50":"$22.18 "
        },
        {
          "name":"green",
          "amount3/1000bi":"$0.85 ",
          "avg3":"$2.98 ",
          "amount5/1000bi":"$1.41 ",
          "avg5":"$4.95 ",
          "amount10/1000bi":"$2.69 ",
          "avg10":"$9.48 ",
          "amount50/1000bi":"$6.37 ",
          "avg50":"$22.41 "
        }
      ]);

      var table4 = ko.observableArray([
        {
          "name":"cc",
          "donations":123,
          "clicks":195,
          "conversion":"63.08%",
          "avg":"$30.90 ",
          "amount":"$3,801 "
        },
        {
          "name":"pp",
          "donations":167,
          "clicks":222,
          "conversion":"75.23%",
          "avg":"$21.64 ",
          "amount":"$3,614 "
        }
      ]);

    self.winner = ko.observable(self.table1()[0].name);
    self.runnerUp = ko.observable(self.table1()[1].name);

    //put the data into objects for use on screen



  };


  return { viewModel: ABTestingViewModel, template: template };

});
