define( [
	'knockout',
	'text!components/widgets/x-by-y/x-by-y.html',
	'momentjs',
	'numeraljs',
	'c3',
	'select2',
	'WidgetBase'
], function( ko, template, moment, numeral, c3, select2, WidgetBase ){

	function XByYChartViewModel( params ){

		WidgetBase.call( this, params );
		var self = this;

		if ( self.chartSaved() ) {
			var chartDataCall = self.getChartData(self.config.queryString);

			$.when( chartDataCall ).then( function( dataArray ){
				self.retrievedResults(dataArray.results);
				self.dataLoading(false);
				self.preDataLoading(false);

				self.chartData = self.processData(self.retrievedResults(), params.configuration.timeBreakout);

				self.makeChart(self.chartData);
			});
		}

		self.showSlice = ko.observable();
		self.bySlice = ko.observable();
		self.timeChoice = ko.observable();
		self.queryRequest = {};
		self.queryString = '';
		self.chosenFilters = ko.observableArray();
		self.subChoices = ko.observableArray();
		self.chartWidth(950);

		self.title = ko.computed(function(){
			return self.showSlice(); //+ ' by ' + self.bySlice();
		});

		self.makeChart = function(data){

			self.chartLoaded(true);

			self.monthlyChart = function(d,i){

				var monthNamesArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

				return {
					bindto: '#x-by-yChart',
					size: {
						height: 450,
						width: window.width
					},
					zoom: { enabled: true },
					data: {
						columns: [ data.monthlyCountArray, data.monthlyDataArray ],
						type: 'bar',
						colors: { 'Monthly Total': 'rgb(92,184,92)', 'Monthly Count': '#f0ad4e' },
						axes: {
							'Monthly Total': 'y',
							'Monthly Count': 'y2'
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
								format: function(x){ return monthNamesArray[x]; }
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
							title: function (d) {
								return monthNamesArray[d];
							},
							value: function (value, ratio, id) {
								var display;
								if(id === 'Monthly Total'){
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

			self.hourlyChart = function(d,i){
				var hourlyData = data.dayObj[d.x + 1 ],
					hourlyCountArray = ['Hourly Count'],
					hourlyTotalArray = ['Hourly Total'];
				for(var j=1; j<25; j++){
					hourlyCountArray.push(hourlyData[j].count);
					hourlyTotalArray.push(hourlyData[j].total);
				}
				return {
					bindto: '#x-by-yChart',
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
					bindto: '#x-by-yChart',
					size: {
						height: 450,
						width: window.width
					},
					zoom: { enabled: true },
					data: {
						columns: [ data.dailyDataArray, data.dailyCountArray ],
						type: 'bar',
						colors: { 'Daily Total': 'rgb(49,176,213)', 'Daily Count': '#f0ad4e' },
						onclick: function (d, i) {
							self.xByYChart = c3.generate(self.hourlyChart(d,i));
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


			switch(data.timescale){
				case 'Year':
				case 'Month':
					self.xByYChart = c3.generate(self.monthlyChart());
					break;
				case 'Day':
					self.xByYChart = c3.generate(self.dailyChart());
					break;
				case 'Hour':
					self.xByYChart = c3.generate(self.hourlyChart());
					break;
			}
		};

		self.showPanelBody = function(area){
			$('#'+area+'body').toggleClass('hide');
		};

		//saved charts
		//TODO: these will trigger a saved set of parameters to draw the chart with.
		self.presetTitles = ko.observableArray([
			'This does not work yet.',
			'Donations During Big English 2014',
			'Donations for Fiscal Year 2014'
		]);
		///////

		self.ySlices = ko.observableArray([
			'Donations'
			//'Failed Donations'
		]);

		self.xSlices = ko.observableArray();
		self.timeChoices = ko.observableArray();
		self.groupChoices = ko.observableArray();

		//populate user choices dynamically
		self.populateChoices = (function(){
			//populate y slices
			$.get( 'metadata/x-by-y', function(reqData){
				self.metadata = reqData;

				var xArray = [], timeArray = ['Year', 'Month', 'Day'], groupArray = [];

				$.each(self.metadata.filters, function(prop, obj){

					if(obj.type !== 'number' || prop === 'Amount'){

						if(obj.canGroup){
							if(obj.values){
								groupArray.push({ 'name': prop, 'choices': obj.values });
							}

							$('select #'+prop).select2();

							//TODO: later this will do something different/more specific.
							xArray.push(prop);
						}

					}
				});
				self.xSlices(xArray);
				self.timeChoices(timeArray);
				self.groupChoices(groupArray);

			});

		})();

		self.submitXY = function(){

			$('#loadingModal').modal('show');
			self.queryRequest.ySlice = self.showSlice();
			//self.queryRequest.xSlice = self.bySlice();
			//self.queryRequest.additionalFilters = self.chosenFilters();
			self.queryRequest.timeBreakout = self.timeChoice();

			self.queryString		 = self.convertToQuery(self.queryRequest);
			self.config.queryString  = self.queryString;
			self.config.timeBreakout = self.queryRequest.timeBreakout;
			self.config.chartData	= self.chartData;

			var chartDataCall = self.getChartData(self.queryString);

			$.when( chartDataCall ).then( function( dataArray ){
				self.retrievedResults(dataArray.results);
				self.dataLoading(false);

				self.chartData = self.processData(self.retrievedResults(), self.timeChoice());

				self.makeChart(self.chartData);
				$('#loadingModal').modal('hide');

				self.chartSaved(false);
			});


		};

		return(this);

	}

	return { viewModel: XByYChartViewModel, template: template };

});
