define([
	'jquery',
	'knockout',
	'momentjs'
], function( $, ko, moment ){

	function zeroPad( number ) {
		if ( number < 10 ) {
			return '0' + number;
		}
		return number;
	}
	function WidgetBase( params ){

		var self = this;

		self.retrievedResults 	= ko.observable();
		self.queryStringSQL 	= ko.observable('This widget hasn\'t been set up yet!');
		self.tempConfig			= ko.observable();
		self.config 			= params.configuration || {};
		self.instanceID 		= params.widgetInstance;
		self.widgetCode			= params.widgetCode;
		self.preDataLoading		= ko.observable(true);
		self.dataLoading 		= params.dataLoading;
		self.chartSaved 		= ko.observable(!!params.configuration);
		self.optionStateChanged = ko.observable(false);
		self.chartWidth 		= ko.observable('900');
		self.chartHeight 		= ko.observable('550');
		self.chartLoaded		= ko.observable(false);
		self.title				= ko.observable(params.title);

		self.getChartData = function( qs ){
			self.dataLoading(true);
			return $.ajax({
				url: '/data/' + self.widgetCode + '?' + ( qs ).replace( /\+/g, '%20' ),
				success: function ( dataget ) {
					self.dataLoading(false);
					self.retrievedResults( dataget.results );
					self.queryStringSQL( dataget.sqlQuery );
				}
			});
		};

		self.saveWidgetConfig = function(){
			var data = JSON.stringify( {
				configuration: self.config,
				isShared: false,
				displayName: self.title()
			} );

			if( self.instanceID ){
				$.ajax({
					method: 'PUT',
					url: '/widget-instance/' + self.instanceID,
					contentType: 'application/json; charset=UTF-8',
					data: data,
					success: function( data ) {
						self.chartSaved(true);
						self.logStateChange(false);
					}
				});
			} else {
				$.ajax({
					method: 'POST',
					url: '/widget-instance/',
					contentType: 'application/json; charset=UTF-8',
					data: data,
					success: function( data ) {
						self.instanceID = data.id;
						self.chartSaved(true);
						self.logStateChange(false);
					}
				});
			}

		};

		self.processData = function( rawdata, timescale, timestamp ){

			var timeWord = ( timescale === 'Day' ? 'Dai' : timescale ) + 'ly',
				totals = [ timeWord + ' Total'],
				counts = [ timeWord + ' Count'],
				xs = [ 'x' ],
				defaultYear = new Date().getFullYear(),
				defaultMonth = new Date().getMonth() + 1,
				tempDate, timeFormat, now = new Date( timestamp );
		
			// coerce UTC into the default timezone.  Comparing offset values
			// so we only have to adjust 'now', not each data point
			now.setHours( now.getHours() + now.getTimezoneOffset() / 60 );
			$.each( rawdata, function( index, dataPoint ) {
				var year = dataPoint.Year || defaultYear,
					month = dataPoint.Month || defaultMonth,
					day = dataPoint.Day || 1,
					hour = dataPoint.Hour || 0;

				// Filter bogons
				if ( year < 2004 || new Date( year, month - 1, day, hour ) > now ) {
					return;
				}
				totals.push( dataPoint.usd_total );
				counts.push( dataPoint.donations );

				tempDate = year + '-';
				tempDate += zeroPad( month ) + '-';
				tempDate += zeroPad( day );
				tempDate += ' ' + zeroPad( hour );

				xs.push( tempDate );
			} );

			switch(timescale){
				case 'Year':
					timeFormat = '%Y';
					break;
				case 'Month':
					timeFormat = '%b \'%y';
					break;
				case 'Day':
					timeFormat = '%b %e';
					break;
				case 'Hour':
					timeFormat = '%H:00';
					break;
			}
			return {
				timescale: timescale,
				totals: totals,
				counts: counts,
				xs: xs,
				timeFormat: timeFormat
			};
		};

		self.convertToQuery = function( userChoices ){

			var timeArray = ['Year', 'Month', 'Day', 'Hour'],
				index = timeArray.indexOf( userChoices.timeBreakout ),
				query = 'group=' + userChoices.timeBreakout,
				levelDiff;

			// If we're grouping by anything finer than year, add a filter and
			// also group by the next levels up.
			for ( levelDiff = 1; index - levelDiff >= 0; levelDiff++ ) {
				query = query + '&group=' + timeArray[index - levelDiff];
			}
			if ( index > 0 ) {
				query = query + '&$filter=' + timeArray[index - 1] + 'sAgo lt \'1\'';
			}
			//groupStr = timeBreakout + '&group=' + userChoices.xSlice;

			// if( userChoices.additionalFilters.length > 0 ){

			//	 var filterStr = '$filter=', filterObj = {}, haveMultipleSubfilters = [];

			//	 $.each( userChoices.additionalFilters, function( el, subfilter ){
			//		 var filter = subfilter.substr(0, subfilter.indexOf(' '));
			//		 if(!filterObj[ filter ]){
			//		   filterObj[ filter ] = subfilter;
			//		 } else {
			//		   filterObj[ filter ] += ' or ' + subfilter;
			//		   haveMultipleSubfilters.push( filter );
			//		 }
			//	 });

			//	 $.each( filterObj, function( el, s ){
			//		 if( haveMultipleSubfilters.indexOf( el ) > -1){
			//		   filterStr += '(' + filterObj[ el ] + ')';
			//		 } else {
			//		   filterStr += filterObj[ el ];
			//		 }
			//		 filterStr += ' and ';
			//	 });

			//	 if( filterStr !== '$filter=' ){
			//		 return groupStr + '&' + ( filterStr.slice(0, -5) );
			//	 } else {
			//		 return groupStr;
			//	 }
			// } else {
			//	 return groupStr;
			// }
			return query;
		};

		self.logStateChange = function(n){
			self.optionStateChanged(n);
			if ( n !== false ) {
				self.chartSaved(false);
			}
		};

		self.subscribe = function( parent, member, callback ) {
			if ( !parent[member] ) {
				window.setTimeout( function () {
					self.subscribe( parent, member, callback );
				}, 50 );
				return;
			}
			parent[member].subscribe( callback );
			callback();
		};

		return this;
	}

	return( WidgetBase );

});
