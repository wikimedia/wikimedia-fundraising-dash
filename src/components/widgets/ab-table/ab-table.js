define([
    'knockout',
    'text!components/widgets/ab-table/ab-table.html'],
function( ko, template ){

  function ABTableViewModel( params ){

    var self = this;
    self.title = 'A/B Test Reports';

    //this is test data for A/B tests widget for now
    //TODO: connect to data layer
    self.getTestData = function(){
        self.testA = ko.observable({
        testName: '50k',
        donations: 302,
        impressions: 1261800,
        clicks: 1439,
        amount: 2732.34,
        avg: 9.05,
        conversion: .21
      });
      self.testB = ko.observable({
        testName: '35k',
        donations: 358,
        impressions: 1269700,
        clicks: 1537,
        amount: 2979.73,
        avg: 8.32,
        conversion: .233
      });
    }();

    self.A = ko.observable({});
    self.B = ko.observable({});
    self.setupChartData = function(){
      for(datum in self.testA()){
        self.A[datum] = self.testA()[datum];
      }
      for(datum in self.testB()){
        self.B[datum] = self.testB()[datum];
      }
    }();

  }

  return { viewModel: ABTableViewModel, template: template };

});
