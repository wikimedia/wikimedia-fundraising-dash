define([
    'knockout',
    'text!components/widgets/fraud-gauge/fraud-gauge.html',
    'c3',
    'chartjs'
    ],
function( ko, template, c3, Chart ){
  //extend the chart so we can flip the circle
  Chart.types.Doughnut.extend({
    addData: function(segment, atIndex, silent){
    var index = atIndex || this.segments.length;
    this.segments.splice(index, 0, new this.SegmentArc({
      value : segment.value,
      outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
      innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
      fillColor : segment.color,
      highlightColor : segment.highlight || segment.color,
      showStroke : this.options.segmentShowStroke,
      strokeWidth : this.options.segmentStrokeWidth,
      strokeColor : this.options.segmentStrokeColor,
      startAngle : Math.PI * 2.5,
      circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
      label : segment.label
    }));
    if (!silent){
      this.reflow();
      this.update();
    }
  }});

  function FraudGaugeViewModel( params ){

    var self = this;

    $.ajaxSetup({async:false});

    $.get( 'metadata/fraud', function(reqData){
      self.data = reqData;
    });

    self.title = 'Fraud Rejections';
    self.selectedTimePeriod = ko.observable('Last 15 Minutes');
    self.selectedFilters = ko.observableArray([]);
    self.selectedSubFilters = ko.observableArray([]);
    self.queryRequest = [];
    self.gaugeValue = ko.observable(0);
    self.filtersSelected = ko.observable(false);
    self.gaugeIsSetUp = ko.observable(false);
    self.queryString = ko.observable('');
    self.queryStringSQL = ko.observable('This widget hasn\'t been set up yet!');

    //broken down data from above
    self.filters = ko.observableArray($.map(self.data.filters, function(val, i){return [val];}));
    self.filterNames = ko.computed( function(){
      var names = [];
      $.each(self.filters(), function(el, i){
        names.push(i.display);
      });
      return names;
    });

    //default range slider settings
    self.greenHighRange = ko.observable(17);
    self.redLowRange = ko.observable(68);

    self.renderGaugeChart = function(){

      //color selection inside modal
      var canvas = $('#fraudPercentSlider')[0];
      var ctx = canvas.getContext('2d');

      var placeholder = document.createElement('canvas');
      placeholder.width = 200;
      placeholder.height = placeholder.width;
      var placeholderctx = placeholder.getContext('2d');

      var ddata = [{
          value: 90,
          color: '#000000'
      },{
          value: 1.8 * (self.greenHighRange()),
          color: '#4cae4c'
      },{
          value: 1.8 * (self.redLowRange() - self.greenHighRange()),
          color: '#eea236'
      }, {
          value: 1.8 * (100 - self.redLowRange()),
          color: '#c9302c'
      },{
          value: 90,
          color: '#000000'
      }];

      //draw chart
      self.gaugeChart = new Chart(placeholderctx).Doughnut(ddata, {
          animation: false,
          segmentShowStroke: false,

          onAnimationComplete: function() {

            var cropHeight = Math.round(placeholder.height/2);

            ctx.clearRect(0,0,canvas.width,canvas.height);

            ctx.drawImage(
              placeholder,
              0,
              0,
              placeholder.width,
              cropHeight,
              0,
              0,
              placeholder.width,
              cropHeight
            );

          }
      });

    };

    self.renderGaugeChart();

    self.validateSubmission = function( times, filters ){

      var validation = {
         validated: '',
         errors: []
       };

      //there must be a chosen timeframe
       if(!times){
         validation.errors.push('You must submit a valid time.');
         validation.validated = false;
       } else {
         validation.validated = true;
      }

      return validation;
    };

    self.convertToQuery = function( userChoices ){

      var qs            = '',
          ds            = '',
          timePresets   = [ 'Last 15 Minutes',
                            'Last Hour',
                            'Last 24 Hours',
                            'Last 5 Minutes'];

      //match subfilters to filters
      //TODO: this is terrible and needs to be refactored when this piece gets modularized.
      var filterObj = {};
      var haveMultipleSubfilters = [];
      $.each( userChoices.selectedSubFilters, function(el, subfilter){
        var filter = subfilter.substr(0, subfilter.indexOf(' '));

        if(!filterObj[filter]){
          filterObj[filter] = subfilter;
        } else {
          filterObj[filter] += ' or ' + subfilter;
          haveMultipleSubfilters.push(filter);
        }
      });

      $.each( filterObj, function(el, s){
        if( haveMultipleSubfilters.indexOf(el) > -1){
          qs += '(' + filterObj[el] + ')';
        } else {
          qs += filterObj[el];
        }
        qs += ' and ';
      });

      //convert time constraints
      var currentDate = new Date();
      switch( userChoices.timespan[0] ){
        case timePresets[0]:
          var lfm = new Date(currentDate.getTime() - (15 * 60 * 1000));
          ds += 'DT gt \'' + lfm.toISOString() + '\'';
          break;
        case timePresets[1]:
          var lh = new Date(currentDate.getTime() - (60 * 60 * 1000));
          ds += 'DT gt \'' + lh.toISOString() + '\'';
          break;
        case timePresets[2]:
          var ltfh = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
          ds += 'DT gt \'' + ltfh.toISOString() + '\'';
          break;
        case timePresets[3]:
          var lfvm = new Date(currentDate.getTime() - (5 * 60 * 1000));
          ds += 'DT gt \'' + lfvm.toISOString() + '\'';
          break;
        default:
          var lfm2 = new Date(currentDate.getTime() - (15 * 60 * 1000));
          ds += 'DT gt \'' + lfm2.toISOString() + '\'';
          break;

      }

      //if there's already something in the qs, precede new string with 'and'
      var postQS = '';
      if(qs.length > 0){
        postQS = qs + ds;
      } else {
        postQS = ds;
      }

      return postQS;
    };

    self.showSubfilters = function(stuff){
      $('#'+stuff).toggleClass('hide');
    };

    self.resetGaugeSettings = function(){

      //reset gauge settings to defaults
      self.greenHighRange(33);
      self.redLowRange(66);
      self.renderGaugeChart();

      //reset datepicker
      $('#timePeriodDropdown option:eq(0)').prop('selected', true);

      //reset filters
      $('.subfilterSubnav').addClass('hide');
      $('input:checkbox').removeAttr('checked');

    };

    self.submitGaugeModifications = function(){

      //validate values first.
      var validation = self.validateSubmission( self.selectedTimePeriod(), self.selectedFilters() );
      if( !validation.validated ){

        $('#fraudSubmissionErrors').html('<p class="text-danger">you have errors in your submission:</p><ul></ul>' ).addClass('show');
        $.each( validation.errors, function(el, i){
          $('#fraudSubmissionErrors ul').append('<li>' + i + '</li>');
        });

      } else{

        //gauge time period
        self.queryRequest.timespan = self.selectedTimePeriod();

        //gauge filters
        self.queryRequest.selectedFilters = self.selectedFilters();
        if(self.selectedFilters().length > 0){
          self.filtersSelected(true);
        }

        //gauge subfilters
        self.queryRequest.selectedSubFilters = self.selectedSubFilters().sort();

        //put it all into a real query
        //this will be a function call - TODO: make parsing function
        self.queryString( self.convertToQuery(self.queryRequest));

        $.get( '/data/fraud?' + $.param({ '$filter': self.queryString() }).replace(
          /\+/g, '%20' ), function ( dataget ) {
          self.gaugeIsSetUp(true);
          self.gaugeValue(parseFloat(dataget.results[0].fraud_percent).toFixed(2) );
          self.queryStringSQL(dataget.sqlQuery);

          self.gauge = c3.generate({
              bindto: '#FraudRiskScoreGauge',
              size: {
                height: 300,
                width: 390
              },
              data: {
                  columns: [
                      ['failure', self.gaugeValue()]
                  ],
                  type: 'gauge',
                  onclick: function (d, i) { console.log('onclick', d, i); }, //TODO: make these better
                  onmouseover: function (d, i) { console.log('onmouseover', d, i); },
                  onmouseout: function (d, i) { console.log('onmouseout', d, i); }
              },
              gauge: {
                  min: 0,
                  max: 100,
                  units: 'failure rate'
              },
              color: {
                  pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                  threshold: {
                      values: [ 0, self.greenHighRange, self.redLowRange, 100]
                  }
              }
          });
        });
      }

    };


  }

  return { viewModel: FraudGaugeViewModel, template: template };

});
