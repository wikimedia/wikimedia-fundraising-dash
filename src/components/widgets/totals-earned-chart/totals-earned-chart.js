define( [
    'knockout',
    'text!components/widgets/totals-earned-chart/totals-earned-chart.html',
    'c3'
], function( ko, template, c3 ){


    function TotalsEarnedChartViewModel( params ){

        var self = this;
		self.title = ko.observable(params.title);

		params.dataChanged.subscribe(function() {
			self.makeCharts();
		});
		self.makeCharts = function() {
			if (params.dailyDataArray.length < 2) {
				return;
			}
			self.hourlyChart = function(d,i){
				return {
					bindto: '#totalsEarnedChart',
					size: {
						height: 450,
						width: window.width
					},
					zoom: { enabled: true },
					data: {
						columns: [ params.dayObj[d['x'] + 1]],
						type: 'bar',
						colors: { 'Hourly Totals': 'rgb(92,184,92)'},
						onclick: function (d, i) { c3.generate(self.dailyChart()) },
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
							label: {
								text: 'December ' + ( d['x'] + 1 ),
								position: 'outer-left'
							},
							tick: {
								format: function(x){ return x + ':00'; }
							}
						},
						y: {
							label: {
								text: 'Dollars'
							}
						}
					},
					bar: {
						width: {
							ratio: 0.5
						}
					}
				};
			};
			self.dailyChart = function(d,i){
				return {
					bindto: '#totalsEarnedChart',
					size: {
						height: 450,
						width: window.width
					},
					zoom: { enabled: true },
					data: {
						columns: [ params.dailyDataArray ],
						type: 'bar',
						colors: { 'Daily Total': 'rgb(49,176,213)'},
						onclick: function (d, i) {
							self.totalsEarnedChart = c3.generate(self.hourlyChart(d,i));
						},
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
								format: function(x){ return "Dec " + (x+1) }
							}
						},
						y: {
							label: {
								text: 'Dollars'
							},
							tick: {
								format: function(x){ return numeral(x).format('$0,0') }
							}
						}
					},
					bar: {
						width: {
							ratio: 0.5
						}
					}
				};
			};
			self.totalsEarnedChart = c3.generate(self.dailyChart());
		};
		self.makeCharts();
    }

    return { viewModel: TotalsEarnedChartViewModel, template: template };

});