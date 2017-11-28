define( [
	'knockout',
	'text!components/widgets/amt-per-second-chart/amt-per-second-chart.html',
	'numeraljs',
	'WidgetBase'
], function ( ko, template, numeral, WidgetBase ) {

	function AmtPerSecondChartViewModel( params ) {

		var self = this;
		WidgetBase.call( this, params );
		self.hasData = ko.observable( false );
		self.avgUSDperSecondChart = ko.observable( false );

		self.makeChart = function () {
			if ( params.sharedContext.dayObj.length < 2 ) {
				return;
			}
			self.hasData( true );
			var numPoints = ( params.sharedContext.lastDataPoint.day - 1 ) * 24 + params.sharedContext.lastDataPoint.hour + 1,
				xs = new Array( numPoints + 2 ), // label, data to date, final point
				index = 0,
				remainingNeeded = params.sharedContext.goal(),
				d,
				h,
				hoursLeft;
			xs[ 0 ] = 'x1';

			self.needPerSecond = new Array( numPoints + 2 );
			self.needPerSecond[ 0 ] = 'Needed Per Second';

			// secondsByHourDonationData already has a label in [0]
			self.gotPerSecond = params.sharedContext.secondsByHourDonationData.slice( 0, numPoints + 1 );

			for ( d = 1; d < params.sharedContext.dayObj.length; d++ ) {
				for ( h = 0; h < 24; h++ ) {
					index = ( d - 1 ) * 24 + h + 1;
					if ( index > numPoints + 1 ) {
						break;
					}
					remainingNeeded = remainingNeeded - params.sharedContext.dayObj[ d ][ h + 1 ].total;
					if ( remainingNeeded < 0 ) {
						remainingNeeded = 0;
					}
					hoursLeft = ( params.sharedContext.campaignLength - d ) * 24 + ( 24 - h );
					xs[ index ] = index;
					self.needPerSecond[ index ] = ( hoursLeft > 0 ) ?
						( remainingNeeded / hoursLeft ) / 3600
						: 0;
				}
			}
			// extend last point to end of graph unless we're already there
			if ( index >= numPoints ) {
				xs[ numPoints + 1 ] = index;
				self.gotPerSecond[ numPoints + 1 ] = self.gotPerSecond[ numPoints ];
				self.needPerSecond[ numPoints + 1 ] = self.needPerSecond[ numPoints ];
			}

			self.avgUSDperSecondChart( {
				size: {
					height: 250,
					width: window.width / 2
				},
				zoom: { enabled: true },
				data: {
					xs: {
						'Needed Per Second': 'x1',
						'Donations Per Second': 'x1'
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
							count: params.sharedContext.campaignLength,
							format: function ( x ) {
								return params.sharedContext.getDay( Math.floor( x / 24 ) );
							}
						}
					},
					y: {
						tick: {
							format: function ( x ) {
								return numeral( x ).format( '$0,0.00' );
							}
						}
					}
				},
				tooltip: {
					format: {
						title: function ( x ) {
							var day = params.sharedContext.getDay( Math.floor( x / 24 ) ),
								hour = x % 24;
							return day + ' ' + hour + ':00 &ndash; ' + hour + ':59 UTC';
						}
					}
				}
			} );
		};
		self.subscribe( params.sharedContext, 'totalsChanged', self.makeChart );
	}

	return { viewModel: AmtPerSecondChartViewModel, template: template };

} );
