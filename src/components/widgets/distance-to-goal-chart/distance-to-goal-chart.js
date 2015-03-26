define( [
	'knockout',
	'text!components/widgets/distance-to-goal-chart/distance-to-goal-chart.html',
	'c3',
	'numeraljs',
	'WidgetBase'
], function( ko, template, c3, numeral, WidgetBase ){

	function DistanceToGoalChartViewModel( params ){

		var self = this;
		WidgetBase.call( this, params );
		self.hasData = ko.observable( false );
		self.distanceToGoalChart = ko.observable( false );

		self.makeCharts = function() {
			if ( params.sharedContext.dailyDataArray.length < 2 ) {
				return;
			}
			self.hasData( true );

			self.updatedGoal = params.sharedContext.goal();
			self.neededArray = ['Needed'];
			for(var d = 1; d < params.sharedContext.dailyDataArray.length; d++) {
				self.updatedGoal = self.updatedGoal - params.sharedContext.dailyDataArray[d];
				self.neededArray[d] = self.updatedGoal >= 0 ? self.updatedGoal : 0;
			}

			self.distanceToGoalChart({
				size: {
					height: 250,
					width: window.width/2
				},
				data: {
					columns: [ self.neededArray ],
					type: 'area-spline',
					colors: { Needed: 'rgb(217,83,79)'}
				},
				grid: {
					x: {
						show: true
					},
					y: {
						show: true
					}
				},
				axis: {
					x: {
						tick: {
							format: function(x){ return 'Dec ' + (x+1); }
						}
					},
					y: {
						label: {
							text: 'Dollars',
							position: 'outer-middle'
						},
						tick: {
							format: function(x){ return numeral(x).format( '$0.[00]a' ); }
						}
					}
				}
			});
		};
		self.subscribe( params.sharedContext, 'totalsChanged', self.makeCharts );
	}
	return { viewModel: DistanceToGoalChartViewModel, template: template };
});
