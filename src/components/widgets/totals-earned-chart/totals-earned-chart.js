define( [
	'knockout',
	'text!components/widgets/totals-earned-chart/totals-earned-chart.html',
	'c3',
	'numeraljs',
	'momentjs',
	'WidgetBase'
], function( ko, template, c3, numeral, moment, WidgetBase ){


	function TotalsEarnedChartViewModel( params ){

		var self = this,
			timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

		WidgetBase.call( this, params );

		//initialize day/hour data
		//sharing these for other widgets
		params.sharedContext.dayObj = [];
		params.sharedContext.dailyDataArray = ['Daily Total'];
		params.sharedContext.dailyCountArray = ['Daily Count'];
		params.sharedContext.lastDataPoint = { day: 1, hour: 0 };
		params.sharedContext.secondsByHourDonationData = ['Donations Per Second'];

		// Get the date
		self.displayDate = ko.observable( moment().format( timeFormat ) );
		self.showChart = ko.observable( '' );
		self.hourlyChart = ko.observable( false );
		self.dailyChart = ko.observable( false );

		self.goal = params.sharedContext.goal = ko.observable( self.config.goal || 20000000 );
		params.sharedContext.goal.subscribe( function() {
			self.config.goal = params.sharedContext.goal();
			self.logStateChange();
		} );

		self.raised = ko.observable(0);

		// Let other widgets subscribe to changes in the goal or the totals
		params.sharedContext.totalsChanged = ko.computed( function() {
			return self.raised() - params.sharedContext.goal();
		} );

		self.formattedGoal = ko.computed(function(){
			return numeral(params.sharedContext.goal()).format('$0,0');
		});

		self.totalRaisedToDate = ko.computed(function(){
			return numeral(self.raised()).format('$0,0');
		});

		self.totalRemainingToDate = ko.computed( function(){
			var trtd = params.sharedContext.goal() - self.raised();
			return numeral(trtd >= 0 ? trtd : 0).format('$0,0');
		});

		//get the data needed for this chart
		self.loadData = function ( data, timestamp ) {
			var runningTotal = 0,
				currentDate = new Date();
			currentDate.setTime( timestamp );
			self.displayDate( moment( currentDate ).format( timeFormat ) );
			params.sharedContext.lastDataPoint.day = currentDate.getUTCDate();
			params.sharedContext.lastDataPoint.hour = currentDate.getUTCHours();

			for (var d = 1; d < 32; d++) {
				params.sharedContext.dailyDataArray[d] = 0;
				params.sharedContext.dailyCountArray[d] = 0;
				if (!params.sharedContext.dayObj[d]) {
					params.sharedContext.dayObj[d] = new Array(25);
					params.sharedContext.dayObj[d][0] = 'Hourly Totals';
					for (var h = 0; h < 24; h++) {
						params.sharedContext.dayObj[d][h + 1] = { total: 0, count: 0 };
						params.sharedContext.secondsByHourDonationData[(d - 1) * 24 + h + 1] = 0;
					}
				}
			}

			var dataCount = data.length;
			for (var i = 0; i < dataCount; i++ ) {

				var el = data[i],
						day = el.day,
						hour = el.hour,
						total = el.usd_total;
				params.sharedContext.dayObj[day][hour + 1] = { total: total, count: el.donations };

				params.sharedContext.secondsByHourDonationData[(day - 1) * 24 + hour + 1] = el.usd_per_second;
				runningTotal += total;
				params.sharedContext.dailyDataArray[day] += total;
				params.sharedContext.dailyCountArray[day] += el.donations;
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
				self.dataLoading( false );
				self.queryStringSQL( dataget.sqlQuery );
			});
			// Do it every 5 minutes as well
			setTimeout( function () {
				self.reloadData( true );
			}, 300000 );
		};

		self.reloadData( true );

		self.makeCharts = function() {
			if (params.sharedContext.dailyDataArray.length < 2) {
				return;
			}
			self.showChart( '' );
			self.dailyChart( self.makeDailyChart() );
			self.showChart( 'daily' );
		};

		self.makeHourlyChart = function(d,i){
			var hourlyData = params.sharedContext.dayObj[d.x + 1 ],
				hourlyCountArray = ['Hourly Count'],
				hourlyTotalArray = ['Hourly Total'];
			for(var j=1; j<25; j++){
				hourlyCountArray.push(hourlyData[j].count);
				hourlyTotalArray.push(hourlyData[j].total);
			}
			return {
				size: {
					height: 450,
					width: window.width
				},
				zoom: { enabled: true },
				data: {
					columns: [ hourlyTotalArray, hourlyCountArray ],
					type: 'bar',
					colors: { 'Hourly Total': 'rgb(92,184,92)', 'Hourly Count': '#f0ad4e' },
					onclick: function (d, i) {
						self.showChart( '' );
						self.dailyChart( self.makeDailyChart() );
						self.showChart( 'daily' );
					},
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

		self.makeDailyChart = function(d,i){
			return {
				size: {
					height: 450,
					width: window.width
				},
				zoom: { enabled: true },
				data: {
					columns: [ params.sharedContext.dailyDataArray, params.sharedContext.dailyCountArray ],
					type: 'bar',
					colors: { 'Daily Total': 'rgb(49,176,213)', 'Daily Count': '#f0ad4e' },
					onclick: function ( d, i ) {
						self.showChart( '' );
						self.hourlyChart( self.makeHourlyChart( d, i ) );
						self.showChart( 'hourly' );
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
		self.makeCharts();
	}

	return { viewModel: TotalsEarnedChartViewModel, template: template };

});
