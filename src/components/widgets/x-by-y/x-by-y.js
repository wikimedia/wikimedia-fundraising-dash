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
		self.chosenFilters            = ko.observableArray();
		self.subChoices               = ko.observableArray();
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
			var colors = {}, axes = {};
			colors[data.totals[0]] = 'rgb(92,184,92)';
			colors[data.counts[0]] = '#f0ad4e';
			axes[data.totals[0]] = 'y';
			axes[data.counts[0]] = 'y2';

			self.xByYChart( false );
			self.xByYChart( {
				size: {
					height: 450,
					width: window.width
				},
				zoom: { enabled: true },
				data: {
					x: 'x',
					columns: [ data.xs, data.totals, data.counts ],
					type: 'bar',
					colors: colors,
					axes: axes,
					xFormat: '%Y-%m-%d %H'
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
			} );
			self.chartLoaded(true);
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
		self.populateChoices = function(){
			//populate y slices
			return $.get( 'metadata/x-by-y', function(reqData){
				self.metadata = reqData;

				var xArray = [], timeArray = ['Year', 'Month', 'Day', 'Hour'], groupArray = [];

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

		};

		self.submitXY = function(){

			self.queryRequest.ySlice = self.showSlice();
			//self.queryRequest.xSlice = self.bySlice();
			//self.queryRequest.additionalFilters = self.chosenFilters();
			self.queryRequest.timeBreakout = self.timeChoice();

			self.queryString		 = self.convertToQuery(self.queryRequest);
			self.config.showSlice	 = self.showSlice();
			self.config.queryString  = self.queryString;
			self.config.timeBreakout = self.queryRequest.timeBreakout;
			self.config.chartData	 = self.chartData;

			var chartDataCall = self.getChartData(self.queryString);

			$.when( chartDataCall ).then( function( dataArray ){
				self.displayedTimeChoice(self.timeChoice());
				self.retrievedResults(dataArray.results);

				self.chartData = self.processData( self.retrievedResults(), self.timeChoice(), dataArray.timestamp );

				self.makeChart(self.chartData);

			});


		};

		self.populateChoices().then(function() {
			self.preDataLoading(false);
			if ( wasSaved ) {
				// restore choices and show the chart
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
