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
		var self      = this,
			wasSaved  = self.chartSaved(); //populateChoices() may overwrite

		self.showSlice                = ko.observable();
		self.bySlice                  = ko.observable();
		self.timeChoice               = ko.observable();
		self.displayedTimeChoice      = ko.observable('');
		self.queryRequest             = {};
		self.queryString              = '';
		self.chosenFilters            = ko.observableArray(); // FIXME: remove, maybe adapt display to use filterText
		self.xByYChart				  = ko.observable( false );
		self.chartWidth(950);

		self.title = ko.computed( function(){
			if( self.displayedTimeChoice()==='Year' ){
				return self.showSlice() + ' Over All Time';
			} else {
				return self.showSlice() + ' by ' + self.displayedTimeChoice();
			}
		});

		self.subtitle = ko.computed( function(){
			var from = '';
			switch(self.displayedTimeChoice()){
				case 'Year':
					return;
				case 'Month':
					from = moment().subtract(1, 'year').format('MMMM Do, YYYY');
					break;
				case 'Day':
					from = moment().subtract(1, 'month').format('MMMM Do, YYYY');
					break;
			}

			return from + ' to ' + moment().format('MMMM Do, YYYY');
		});

		self.makeChart = function(data){
			var colors = {},
				axes = {},
				settings,
				columns = [],
				isGrouped = !!data.groupValues,
				numValues;

			settings = {
				size: {
					height: 450,
					width: window.width
				},
				zoom: { enabled: true },
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
						type: 'timeseries',
						tick: {
							format: data.timeFormat
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
				bar: {
					width: {
						ratio: 0.4
					}
				}
			};

			if ( isGrouped ) {
				columns = [data.xs];
				numValues = data.groupValues.length;
				$.each( data.groupValues, function( index, groupVal ) {
					var hue = index * 360 / numValues,
						totalColumnName = data.totals[groupVal][0],
						countColumnName = data.counts[groupVal][0];
					columns[index + 1] = data.totals[groupVal];
					columns[index + 1 + numValues] = data.counts[groupVal];
					axes[totalColumnName] = 'y';
					axes[countColumnName] = 'y2';
					colors[totalColumnName] = 'hsl(' + hue + ',100%,50%)';
					colors[countColumnName] = 'hsl(' + hue + ',100%,65%)';
				} );
				settings.data = {
					columns: columns,
					groups: [
						data.totalGroups,
						data.countGroups
					],
					colors: colors
				};
			} else {
				colors[data.totals[0]] = 'rgb(92,184,92)';
				colors[data.counts[0]] = '#f0ad4e';
				axes[data.totals[0]] = 'y';
				axes[data.counts[0]] = 'y2';

				settings.data = {
					columns: [ data.xs, data.totals, data.counts ],
					colors: colors
				};
			}
			settings.data.x = 'x';
			settings.data.type = 'bar';
			settings.data.xFormat = '%Y-%m-%d %H';
			settings.data.axes = axes;

			self.xByYChart( false );

			self.xByYChart( settings );
			self.chartLoaded(true);
		};

		self.showPanelBody = function(area){
			$('#'+area+'body').toggleClass('hide');
		};

		//saved charts
		//TODO: these will trigger a saved set of parameters to draw the chart with.
		self.presetTitles = ko.observableArray([
			'This does not work yet.',
			'Donations During Big English 2015',
			'Donations for Fiscal Year 2015'
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
		self.populateChoices = function(){
			//populate y slices
			return self.metadataRequest.then( function( reqData ) {
				self.metadata = reqData;

				var xArray = [],
					timeArray = ['Year', 'Month', 'Day', 'Hour'],
					groupArray = [];

				$.each(self.metadata.filters, function(prop, obj){
					if(obj.type !== 'number' || prop === 'Amount'){
						if(obj.canGroup){
							xArray.push( { text: obj.display, value: prop } );
						}
					}
				});
				self.xSlices(xArray);
				self.timeChoices(timeArray);
				self.groupChoices(groupArray);
			});

		};

		self.submitXY = function(){

			self.queryRequest.ySlice = self.showSlice();
			self.queryRequest.xSlice = self.bySlice();
			//self.queryRequest.additionalFilters = self.chosenFilters();
			self.queryRequest.timeBreakout = self.timeChoice();

			self.queryString		 = self.convertToQuery(self.queryRequest);
			self.config.showSlice	 = self.showSlice();
			self.config.bySlice		 = self.bySlice();
			self.config.queryString  = self.queryString;
			self.config.timeBreakout = self.queryRequest.timeBreakout;
			self.config.chartData	 = self.chartData;

			var chartDataCall = self.getChartData(self.queryString);

			$.when( chartDataCall ).then( function( dataArray ){
				self.displayedTimeChoice(self.timeChoice());
				self.retrievedResults(dataArray.results);

				self.chartData = self.processData( self.retrievedResults(), self.timeChoice(), self.bySlice(), dataArray.timestamp );

				self.makeChart(self.chartData);

			});


		};

		self.populateChoices().then(function() {
			self.preDataLoading(false);
			if ( wasSaved ) {
				// restore choices and show the chart
				self.bySlice( self.config.bySlice );
				self.showSlice( self.config.showSlice );
				self.timeChoice( self.config.timeBreakout );
				self.chartSaved( true );
				self.submitXY();
			}
		});

		return this;

	}

	return { viewModel: XByYChartViewModel, template: template };

});
