define([
	'jquery',
	'underscore',
	'backbone'
],
function( $, _, Backbone ){

	var dispatcher = _.clone( Backbone.Events );

	// Turn JSON into datasets usable by widgets.
	// Accepts JSON file names (the JSON files need
	// to be located in the collections/static/ folder)
	// Outputs an asynchronously-sound bundle of requests that,
	// once finished, will return the datasets.
	dispatcher.setupDataFromJSONFiles = function( JSONFiles ){

		  var objectData = [], promises = [], bigDeferred = $.Deferred();

		  JSONFiles.forEach(function(el, i){

			var xhr, deferred = $.Deferred(), url = "collections/static/" + el;

			xhr = $.ajax({
			  url : url,
			  type: 'get',
			  async: true
			});
			xhr
			  .done( function ( data ) {
				objectData.push( { 'file': el, 'data': data } );
				deferred.resolve();
			  } )
			  .fail( function () {
				deferred.resolve();
			  } );

			promises.push( deferred.promise() );

		  });

		  $.when.apply( $, promises ).done( function () {
			bigDeferred.resolve( objectData );
		  } );

		  return bigDeferred.promise();

	},

	dispatcher.convertStringDatesToMoments = function(dataSet){

		_.each( dataSet, function( row, i ){

			var d = row.date,
			dateString = d.slice(0,10),
			newDate = moment( dateString );
			row['date'] = newDate;

		});

		return dataSet;

	}

	return dispatcher;

});

