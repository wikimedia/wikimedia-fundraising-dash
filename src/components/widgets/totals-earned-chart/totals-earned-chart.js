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
				var hourlyData = params.dayObj[d['x'] + 1 ],
					hourlyCountArray = ['Hourly Count'],
					hourlyTotalArray = ['Hourly Total'];
				for(var i=1; i<25; i++){
					hourlyCountArray.push(hourlyData[i]['count']);
					hourlyTotalArray.push(hourlyData[i]['total']);
				};
				return {
					bindto: '#totalsEarnedChart',
					size: {
						height: 450,
						width: window.width
					},
					zoom: { enabled: true },
					data: {
						columns: [ hourlyTotalArray, hourlyCountArray ],
						type: 'bar',
						colors: { 'Hourly Total': 'rgb(92,184,92)', 'Hourly Count': '#f0ad4e' },
						onclick: function (d, i) { c3.generate(self.dailyChart()) },
						axes: {
							'Hourly Total': 'y',
							'Hourly Count': 'y2'
						}
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
							tick: {
								format: function(x){ return numeral(x).format('0,0') }
							}
						},
						y2: {
							show: true
						}
					},
					tooltip: {
				        format: {
				            title: function (d) { return 'Hour ' + d; },
				            value: function (value, ratio, id) {
				            	var display;
				                if(id === 'Hourly Total'){
				                	display = numeral(value).format('$0,0')
				                } else {
				                	display = numeral(value).format('0,0')
				                }
				                return display;
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
						columns: [ params.dailyDataArray, params.dailyCountArray ],
						type: 'bar',
						colors: { 'Daily Total': 'rgb(49,176,213)', 'Daily Count': '#f0ad4e' },
						onclick: function (d, i) {
							self.totalsEarnedChart = c3.generate(self.hourlyChart(d,i));
						},
						axes: {
							'Daily Total': 'y',
							'Daily Count': 'y2'
						}
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
							tick: {
								format: function(x){ return numeral(x).format('0,0') }
							}
						},
						y2: {
							show: true
						}
					},
					tooltip: {
				        format: {
				            title: function (d) { return 'Day ' + (d+1); },
				            value: function (value, ratio, id) {
				            	var display;
				                if(id === 'Daily Total'){
				                	display = numeral(value).format('$0,0')
				                } else {
				                	display = numeral(value).format('0,0')
				                }
				                return display;
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