define( [
	'knockout',
	'text!components/widgets/amt-per-second-chart/amt-per-second-chart.html',
	'c3',
	'numeraljs',
	'momentjs'
], function( ko, template, c3, numeral, moment ){


	function AmtPerSecondChartViewModel( params ){

		var self = this;

		//TODO: make dayObj (and other params) come from data
		self.dayObj = [];

		self.loadData = function ( decemberData, timestamp ) {
			var runningTotal = 0,
				currentDate = new Date(),
				timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

			currentDate.setTime( timestamp );
			self.displayDate( moment( currentDate ).format( timeFormat ) );
			self.lastDataPoint.day = currentDate.getUTCDate();
			self.lastDataPoint.hour = currentDate.getUTCHours();

			for (var d = 1; d < 32; d++) {
				self.dailyDataArray[d] = 0;
				self.dailyCountArray[d] = 0;
				if (!self.dayObj[d]) {
					self.dayObj[d] = new Array(25);
					self.dayObj[d][0] = 'Hourly Totals';
					for (var h = 0; h < 24; h++) {
						self.dayObj[d][h + 1] = { total: 0, count: 0 };
						self.secondsByHourDonationData[(d - 1) * 24 + h + 1] = 0;
					}
				}
			}

			var dataCount = decemberData.length;
			for (var i = 0; i < dataCount; i++ ) {

				var el = decemberData[i],
						day = el.day,
						hour = el.hour,
						total = el.usd_total;
				self.dayObj[day][hour + 1] = { total: total, count: el.donations };

				self.secondsByHourDonationData[(day - 1) * 24 + hour + 1] = el.usd_per_second;
				runningTotal += total;
				self.dailyDataArray[day] += total;
				self.dailyCountArray[day] += el.donations;
			}

			self.raised(runningTotal);
		};

		self.makeChart = function() {
			if ( self.dayObj.length < 2 ) {
				return;
			}
			var numPoints = ( self.lastDataPoint.day - 1 ) * 24 + self.lastDataPoint.hour + 1,
				xs = new Array( numPoints + 2 ), // label, data to date, final point
				index = 0,
				remainingNeeded = self.goal();
			xs[0] = 'x1';

			self.needPerSecond =  new Array( numPoints + 2 );
			self.needPerSecond[0] = 'Needed Per Second';

			// secondsByHourDonationData already has a label in [0]
			self.gotPerSecond = self.secondsByHourDonationData.slice( 0, numPoints + 1 );

			for( var d = 1; d < self.dayObj.length; d++ ) {
				for ( var h = 0; h < 24; h++ ) {
					index = ( d - 1 ) * 24 + h + 1;
					if ( index > numPoints + 1 ) {
						break;
					}
					remainingNeeded = remainingNeeded - self.dayObj[d][h + 1].total;
					if ( remainingNeeded < 0 ) {
						remainingNeeded = 0;
					}
					var hoursLeft = ( 31 - d) * 24 + ( 24 - h );
					xs[index] = index;
					self.needPerSecond[index] = ( hoursLeft > 0 ) ?
						( remainingNeeded / hoursLeft ) / 3600
						: 0;
				}
			}
			// extend last point to end of graph unless we're already there
			if ( index > numPoints + 1 ) {
				xs[numPoints + 1] = index;
				self.gotPerSecond[ numPoints + 1 ] = self.gotPerSecond[ numPoints ];
				self.needPerSecond[ numPoints + 1 ] = self.needPerSecond[ numPoints ];
			}
			self.avgUSDComboChart = c3.generate( {
				bindto: '#avgUSDperSecond',
				size: {
					height: 250,
					width: window.width/2
				},
				zoom: { enabled: true },
				data: {
					xs: {
						'Needed Per Second' : 'x1',
						'Donations Per Second' : 'x1'
					},
					columns: [
						xs,
						self.gotPerSecond,
						self.needPerSecond
					],
					type: 'area',
					types: {
						'USD per second': 'line'
					}
				},

				axis: {
					x: {
						tick: {
							count: 31,
							format: function(x){ return 'Dec ' + ( Math.floor( x / 24 ) + 1 ); }
						}
					},
					y: {
						tick: {
							format: function(x){ return numeral(x).format('$0,0'); }
						}
					}
				},
				tooltip: {
					format: {
						title: function(x) {
							var day = Math.floor( x / 24 ) + 1;
							var hour = x % 24;
							return 'Dec ' + day + ' ' + hour + ':00 &ndash; ' + hour + ':59 UTC';
						}
					}
				}
			} );
		};
		self.makeChart();
	}

	return { viewModel: AmtPerSecondChartViewModel, template: template };

});
