define( [
    'knockout',
    'text!components/widgets/amt-per-second-chart/amt-per-second-chart.html',
    'c3'
], function( ko, template, c3 ){


    function AmtPerSecondChartViewModel( params ){

        var self = this;

        self.title = ko.observable(params.title);

		self.makeChart = function() {

			self.updatedGoal = params.goal();
			self.needPerSecond = ['Needed Per Second'];
			for( var d = 1; d < 32; d++ ) {
				for ( var h = 1; h < 25; h++ ) {
					self.updatedGoal = self.updatedGoal - params.dayObj[d][h];
					var hoursLeft = ( 31 - d) * 24 + ( 24 - h );
					self.needPerSecond[( d - 1 ) * 24 + h] = ( hoursLeft > 0 ) ? self.updatedGoal / hoursLeft / 3600 : 0;
				}
			}

			self.avgUSDComboChart = c3.generate( {
				bindto: '#avgUSDperSecond',
				size: {
					height: 250,
					width: window.width/2
				},
				zoom: { enabled: true },
				data: {
					columns: [
						params.secondsByHourDonationData,
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
							format: function(x){ return "Dec " + ( Math.floor( x / 24 ) + 1 ) }
						}
					},
					y: {
						tick: {
							format: function(x){ return numeral(x).format('$0,0') }
						}
					}
				},
				tooltip: {
					format: {
						title: function(x) {
							var day = Math.floor( x / 24 ) + 1;
							var hour = x % 24;
							return 'Dec ' + day + ' ' + hour + ':00 &ndash; ' + hour + ':59 UTC';
						},
					}
				}
			} );
		};
		params.dataChanged.subscribe(self.makeChart);
		self.makeChart();
    }

    return { viewModel: AmtPerSecondChartViewModel, template: template };

});