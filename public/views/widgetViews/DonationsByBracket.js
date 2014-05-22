define([
    'jquery',
    'underscore',
    'backbone',
    'utils/colors',
    'text!views/templates/widgets/donationsByBracketWidget.html',
    'chartjs'
],
function($, _, Backbone, Colors, widgetTemplate, chartjs){

  var DonationsByBracketView = Backbone.View.extend({

    template: _.template(widgetTemplate),

    chart: {
        colors: Colors.colorArray(),
        title: 'Donations By Bracket'
    },

    initialize: function(){

        this.el = '#widgetSection';

    },

    render: function(){
        console.log(this.el);
        $(this.el).append( this.template );
        this.renderChart();

    },

    getChartData: function(){

      this.chart.data = [
        {
          "bracket_max":      10,
          "total_usd":7488726.37,
          "average_usd":6.031124,
          "count":1241680
        },
        {
          "bracket_max":      30,
          "total_usd":14147696.07,
          "average_usd":16.580776,
          "count":853259
        },
        {
          "bracket_max":      50,
          "total_usd":9283495.82,
          "average_usd":37.621864,
          "count":246758
        },
        {
          "bracket_max":      100,
          "total_usd":8730643.71,
          "average_usd":64.344470,
          "count":135686
        },
        {
          "bracket_max":      200,
          "total_usd":4932230.30,
          "average_usd":112.057942,
          "count":44015
        },
        {
          "bracket_max":      1000,
          "total_usd":2616208.48,
          "average_usd":331.081812,
          "count":7902
        },
        {
          "bracket_max":      250000,
          "total_usd":3638309.62,
          "average_usd":3907.958776,
          "count":931
        },
        {
          "bracket_max":      1000000,
          "total_usd":3800000.00,
          "average_usd":475000.000000,
          "count":8
        },
        {
          "bracket_max":      -1,
          "total_usd":1800000.00,
          "average_usd":1800000.000000,
          "count":1
        }
      ];

    },

    renderChart: function(){

      var context = $('#DonationsByBracket').get(0).getContext('2d'),
          dataSet = [],
          colorArray = this.chart.colors;

      console.log('colorArray: ', colorArray);

      this.getChartData();

      this.chart.data.forEach( function( row, i ){

        var n = i+1;

        dataSet.push({ value: row.count, color: colorArray[colorArray.length - n] });

        $('#DonationsByBracketLegend').append(
          $( '<div>' ).addClass( 'row' ).append(
            $( '<div>' ).addClass( 'col-xs-1 col-sm-1 col-md-1 col-lg-1' ).append(
              $( '<i>' )
                .addClass( 'glyphicon glyphicon-stop' )
                .css( 'color', colorArray[colorArray.length - n] )
            ),
            $( '<div>' ).addClass( 'col-xs-10 col-sm-10 col-md-10 col-lg-10' ).append(
              $( '<p>' ).text( '$' + row.bracket_max )
            )
          )
        );

      });

      new Chart(context).Doughnut(dataSet);
    }

  });

  return DonationsByBracketView;

});
