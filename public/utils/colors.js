define([
    'jquery',
    'underscore'
    ],
function($, _){

  //these colors have been consciously curated for better visualizations.
  var colors = {

    colorObj: {
       'gray'   : '#4D4D4D',
       'blue'   : '#5DA5DA',
       'orange' : '#FAA43A',
       'green'  : '#60BD68',
       'pink'   : '#F17CB0',
       'brown'  : '#B2912F',
       'purple' : '#B276B2',
       'yellow' : '#DECF3F',
       'red'    : '#F15854',
    },

    colorArray: function(){

      var colorArray = _.map( this.colorObj, function(n){

        return n;

      });

      return colorArray;
    }


  };

  return colors;
});