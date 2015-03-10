define([
	'jquery',
	'knockout',
	'momentjs'
], function( $, ko, moment ){

	function WidgetBase( params ){

		var self = this;

		self.retrievedResults 	= ko.observable();
		self.queryStringSQL 	= ko.observable('This widget hasn\'t been set up yet!');
		self.config 			= params.configuration;
		self.instanceID 		= params.widgetInstance;
		self.widgetCode			= params.widgetCode;
		self.preDataLoading		= ko.observable(true);
		self.dataLoading 		= ko.observable(!!self.config);
		self.chartSaved 		= ko.observable(!!self.config);
		self.optionStateChanged = ko.observable(false);
		self.chartWidth 		= ko.observable('900');
		self.chartHeight 		= ko.observable('550');
		self.chartLoaded		= ko.observable(false);

		self.getChartData = function( qs ){
			self.dataLoading(true);
			return $.ajax({
				url: '/data/' + self.widgetCode + '?' + ( qs ).replace( /\+/g, '%20' ),
				success: function ( dataget ) {
					self.retrievedResults( dataget.results );
					self.queryStringSQL( dataget.sqlQuery );
				}
			});
		};

		self.saveWidgetConfig = function(){

			if( self.instanceID ){
				$.ajax({
					method: 'PUT',
					url: '/widget-instance/' + self.instanceID,
					contentType: 'application/json; charset=UTF-8',
					data: JSON.stringify({
						configuration: self.config,
						isShared: false
					}),
					success: function( data ) {
						self.chartSaved(true);
					}
				});
			} else {
				$.ajax({
					method: 'POST',
					url: '/widget-instance/',
					contentType: 'application/json; charset=UTF-8',
					data: JSON.stringify({
						configuration: self.config,
						isShared: false
					}),
					success: function( data ) {
						self.instanceID = data.id;
						self.chartSaved(true);
					}
				});
			}

		};

		self.processData = function(rawdata, timescale){

			var dailyDataArray 				= ['Daily Total'],
				dailyCountArray 			= ['Daily Count'],
				secondsByHourDonationData 	= ['Donations Per Second'],
				dayObj 						= {}, returnObj;

			switch(timescale){
				case 'Year':
				case 'Month':
					var monthlyDataArray = ['Monthly Total'],
					monthlyCountArray = ['Monthly Count'],
					months = rawdata;

					$.each(months, function(i, el){
						monthlyDataArray.push(el.usd_total);
						monthlyCountArray.push(el.donations);
					});

					returnObj = {
										timescale: timescale,
										monthlyDataArray: monthlyDataArray,
										monthlyCountArray: monthlyCountArray
					};
					return returnObj;
				case 'Day':
				case 'Hour':
					for (var d = 1; d < 32; d++) {
						dailyDataArray[d] = 0;
						dailyCountArray[d] = 0;
						if (!dayObj[d]) {
							dayObj[d] = new Array(25);
							dayObj[d][0] = 'Hourly Totals';
							for (var h = 0; h < 24; h++) {
								dayObj[d][h + 1] = { total: 0, count: 0 };
								secondsByHourDonationData[(d - 1) * 24 + h + 1] = 0;
							}
						}
					}

					var dataCount = rawdata.length;
					for (var i = 0; i < dataCount; i++ ) {

						var el = rawdata[i],
								day = el.Day,
								hour = el.hour,
								total = el.usd_total,
								runningTotal = 0;

						if(!hour){
							dayObj[day+1] = { total: total, count: el.donations };
						} else {
							dayObj[day][hour + 1] = { total: total, count: el.donations };
						}

						secondsByHourDonationData[(day - 1) * 24 + hour + 1] = el.usd_per_second;
						runningTotal += total;
						dailyDataArray[day] += total;
						dailyCountArray[day] += el.donations;
					}

					returnObj = {
										timescale: timescale,
										dailyDataArray: dailyDataArray,
										dailyCountArray: dailyCountArray,
										secondsByHourDonationData: secondsByHourDonationData,
										dayObj: dayObj
					};

					return returnObj;
			}

		};

		self.convertToQuery = function( userChoices ){

			var timeBreakout = 'group=' + userChoices.timeBreakout;
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
			return timeBreakout;
		};

		// Generate chart label arrays for time increment types
		self.chartLabels = function(type){
			var chartLabels;
			switch(type){
				case 'Year':
					chartLabels = ['Year'];
					break;
				case 'Month':
					chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					break;
				case 'Day':
					chartLabels = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
									'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
									'21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
					break;
				case 'Hour':
					chartLabels = [ '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
									'11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
									'22:00', '23:00'];
					break;
			}
			return chartLabels;
		};

		self.logStateChange = function(n){
			self.optionStateChanged(n);
			self.chartSaved(false);
		};

		return(this);
	}

	return( WidgetBase );

});
