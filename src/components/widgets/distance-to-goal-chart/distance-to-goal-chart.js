define( [
    'knockout',
    'text!components/widgets/distance-to-goal-chart/distance-to-goal-chart.html',
    'c3'
], function( ko, template, c3 ){


    function DistanceToGoalChartViewModel( params ){

        var self = this;

        self.title = ko.observable(params.title);
		self.makeCharts = function() {
			if ( params.dailyDataArray.length < 2 ) {
				return;
			}
			self.goal = ko.observable(params.goal);

			self.updatedGoal = params.goal();
			self.neededArray = ['Needed'];
			for(var d = 1; d < params.dailyDataArray.length; d++) {
				self.updatedGoal = self.updatedGoal - params.dailyDataArray[d];
				self.neededArray[d] = self.updatedGoal;
			}

			self.distanceToGoalChart = c3.generate({
				bindto: '#distanceToGoalChart',
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
							format: function(x){ return '$' + x/1000000 + 'm'; }
						}
					}
				}
			});
		};
		params.dataChanged.subscribe(function() {
			self.makeCharts();
		});
		self.makeCharts();
	}
    return { viewModel: DistanceToGoalChartViewModel, template: template };

});