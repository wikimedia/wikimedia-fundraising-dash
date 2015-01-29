define( [
    'knockout',
    'text!components/widgets/totals-earned-chart/totals-earned-chart.html',
    'c3',
    'numeraljs',
    'momentjs'
], function( ko, template, c3, numeral, moment ){


    function TotalsEarnedChartViewModel( params ){

        var self = this,
        	timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

	    self.title = ko.observable(params.title);

		//self.title = ko.observable(params.title);
		self.widgetWidth = ko.observable(params.configuration.width);
		self.dataLoading = ko.observable(true);

		//initialize day/hour data
        self.dayObj = [];
		self.dailyDataArray = ['Daily Total'];
        self.dailyCountArray = ['Daily Count'];
		self.lastDataPoint = { day: 1, hour: 0 };
		self.secondsByHourDonationData = ['Donations Per Second'];

		// Get the date
        self.displayDate = ko.observable( moment().format( timeFormat ) );

        self.goal = ko.observable(20000000);
        self.raised = ko.observable(0);

        self.bigEnglishGoal = ko.computed(function(){
            return numeral(self.goal()).format('$0,0');
        });

        self.totalRaisedToDate = ko.computed(function(){
            return numeral(self.raised()).format('$0,0');
        });

        self.totalRemainingToDate = ko.computed( function(){
            var trtd = self.goal() - self.raised();
            return numeral(trtd >= 0 ? trtd : 0).format('$0,0');
        });

		// params.dataChanged.subscribe(function() {
		// 	self.makeCharts();
		// });

		//get the data needed for this chart
	    self.loadData = function ( decemberData, timestamp ) {
			var runningTotal = 0,
				currentDate = new Date();
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

			self.makeCharts();

			self.raised(runningTotal);
		};

		// Reload the data.  For the automatic reload, we're fine getting
		// something from the cache.
		self.reloadData = function( automatic ){
            self.dataLoading(true);
			var url = '/data/big-english';
			if ( automatic !== true ) {
				url += '/?cache=false';
			}
			$.get( url , function ( dataget ) {
				self.loadData( dataget.results, dataget.timestamp );
                self.dataLoading(false);
			});
			// Do it every 5 minutes as well
			setTimeout( function () {
				self.reloadData( true );
			}, 300000 );
		};

		self.reloadData( true );

		self.makeCharts = function() {
			if (self.dailyDataArray.length < 2) {
				return;
			}
			self.hourlyChart = function(d,i){
				var hourlyData = self.dayObj[d.x + 1 ],
					hourlyCountArray = ['Hourly Count'],
					hourlyTotalArray = ['Hourly Total'];
				for(var j=1; j<25; j++){
					hourlyCountArray.push(hourlyData[j].count);
					hourlyTotalArray.push(hourlyData[j].total);
				}
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
						onclick: function (d, i) { c3.generate(self.dailyChart()); },
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
								text: 'December ' + ( d.x + 1 ),
								position: 'outer-left'
							},
							tick: {
								format: function(x){ return x + ':00'; }
							}
						},
						y: {
							tick: {
								format: function(x){ return numeral(x).format('$0,0'); }
							}
						},
						y2: {
							tick: {
								format: function(x){ return numeral(x).format('0,0'); }
							},
							show: true
						}
					},
					tooltip: {
				        format: {
				            title: function (d) { return 'Hour ' + d; },
				            value: function (value, ratio, id) {
				            	var display;
				                if(id === 'Hourly Total'){
				                	display = numeral(value).format('$0,0');
				                } else {
				                	display = numeral(value).format('0,0');
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
						columns: [ self.dailyDataArray, self.dailyCountArray ],
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
								format: function(x){ return 'Dec ' + (x+1); }
							}
						},
						y: {
							tick: {
								format: function(x){ return numeral(x).format('$0,0'); }
							}
						},
						y2: {
							tick: {
								format: function(x){ return numeral(x).format('0,0'); }
							},
							show: true
						}
					},
					tooltip: {
				        format: {
				            title: function (d) { return 'Day ' + (d+1); },
				            value: function (value, ratio, id) {
				            	var display;
				                if(id === 'Daily Total'){
				                	display = numeral(value).format('$0,0');
				                } else {
				                	display = numeral(value).format('0,0');
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