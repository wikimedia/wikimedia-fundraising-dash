define( [
    'knockout',
    'text!components/widgets/amt-per-second-chart/amt-per-second-chart.html',
    'c3'
], function( ko, template, c3 ){


    function AmtPerSecondChartViewModel( params ){

        var self = this;

        self.title = ko.observable(params.title);

		self.makeChart = function() {
			var numPoints = ( params.lastDataPoint.day - 1 ) * 24 + params.lastDataPoint.hour + 1,
				xs = new Array( numPoints + 2 ), // label, data to date, final point
				index = 0,
				remainingNeeded = params.goal();
			xs[0] = 'x1';

			self.needPerSecond =  new Array( numPoints + 2 );
			self.needPerSecond[0] = 'Needed Per Second';

			// secondsByHourDonationData already has a label in [0]
			self.gotPerSecond = params.secondsByHourDonationData.slice( 0, numPoints + 1 );

			for( var d = 1; d < params.dayObj.length; d++ ) {
				for ( var h = 0; h < 24; h++ ) {
					index = ( d - 1 ) * 24 + h + 1;
					if ( index > numPoints + 1 ) {
						break;
					}
					remainingNeeded = remainingNeeded - params.dayObj[d][h + 1].total;
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
		params.dataChanged.subscribe(self.makeChart);
		self.makeChart();
    }

    return { viewModel: AmtPerSecondChartViewModel, template: template };

});