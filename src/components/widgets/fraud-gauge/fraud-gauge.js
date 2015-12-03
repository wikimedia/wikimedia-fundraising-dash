define([
	'knockout',
	'text!components/widgets/fraud-gauge/fraud-gauge.html',
	'c3',
	'select2',
	'chartjs',
	'WidgetBase'
	],
function( ko, template, c3, select2, Chart, WidgetBase ){

	//extend the chart so we can flip the circle
	Chart.types.Doughnut.extend({
		addData: function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;
			this.segments.splice(index, 0, new this.SegmentArc({
				value : segment.value,
				outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
				innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
				fillColor : segment.color,
				highlightColor : segment.highlight || segment.color,
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				startAngle : Math.PI * 2.5,
				circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
				label : segment.label
			}));

			if (!silent){
				this.reflow();
				this.update();
			}
		}
	});

	function FraudGaugeViewModel( params ){

		WidgetBase.call( this, params );

		var self 		= this,
			wasSaved  	= self.chartSaved();

		self.queryString			= '';
		self.columnSize 			= ko.observable('col-lg-' + ( self.config.width || 6 ) + ' fraudGauge');
		self.selectedTimePeriod 	= ko.observable( self.config.timeBreakout || 'Last 15 Minutes');
		self.queryRequest 			= [];
		self.gaugeValue 			= ko.observable(0);
		self.queryStringSQL 		= ko.observable('This widget hasn\'t been set up yet!');
		self.greenHighRange 		= ko.observable( self.config.greenHighRange || 17 );
		self.redLowRange 			= ko.observable( self.config.redLowRange || 68 );
		self.configSet				= ko.observable(Object.keys(self.config).length > 0);
		self.gauge					= ko.observable(false);
		self.showFilterText			= ko.computed( function() {
			return !( $.isEmptyObject( self.userChoices() ) );
		} );

		self.renderPercentRangeChart = function(){

			var canvas 		= $('#fraudPercentRanges')[0],
				ctx 		= canvas.getContext('2d');

			var placeholder 		= document.createElement('canvas');
			placeholder.width	 	= 200;
			placeholder.height 		= placeholder.width;
			var placeholderctx 		= placeholder.getContext('2d');

			var ddata = [{
				value: 90,
				color: '#000000'
			},{
				value: 1.8 * (self.greenHighRange()),
				color: '#4cae4c'
			},{
				value: 1.8 * (self.redLowRange() - self.greenHighRange()),
				color: '#eea236'
			}, {
				value: 1.8 * (100 - self.redLowRange()),
				color: '#c9302c'
			},{
				value: 90,
				color: '#000000'
			}];

			self.gaugeChart = new Chart( placeholderctx ).Doughnut( ddata, {
				animation: false,
				segmentShowStroke: false,
				onAnimationComplete: function() {
					var cropHeight = Math.round(placeholder.height/2);
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx.drawImage(
						placeholder,
						0,
						0,
						placeholder.width,
						cropHeight,
						0,
						0,
						placeholder.width,
						cropHeight
					);
				}
			});
		};

		self.makeChart = function(){
			self.gauge({
				size: {
					height: 300,
					width: 390
				},
				data: {
					columns: [
						['failure', self.gaugeValue()]
					],
					type: 'gauge'
				},
				gauge: {
					min: 0,
					max: 100,
					units: 'failure rate'
				},
				color: {
					pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
					threshold: {
						values: [ 0, self.greenHighRange(), self.redLowRange(), 100]
					}
				}
			});
		};

		self.validateSubmission = function( times ){
			var validation = {
				validated: '',
				errors: []
			};

			if( !times ){
				validation.errors.push('You must submit a valid time.');
				validation.validated = false;
			} else {
				validation.validated = true;
			}

			return validation;
		};

		self.createQueryString = function(){
			var qs            	= self.filterQueryString(),
				ds            	= '',
				timePresets		= [ 'Last 15 Minutes',
									'Last Hour',
									'Last 24 Hours',
									'Last 5 Minutes'];

			var currentDate = new Date();
			switch( self.selectedTimePeriod() ){
				case timePresets[0]:
					var lfm = new Date(currentDate.getTime() - (15 * 60 * 1000));
					ds += 'DT gt \'' + lfm.toISOString() + '\'';
					break;
				case timePresets[1]:
					var lh = new Date(currentDate.getTime() - (60 * 60 * 1000));
					ds += 'DT gt \'' + lh.toISOString() + '\'';
					break;
				case timePresets[2]:
					var ltfh = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
					ds += 'DT gt \'' + ltfh.toISOString() + '\'';
					break;
				case timePresets[3]:
					var lfvm = new Date(currentDate.getTime() - (5 * 60 * 1000));
					ds += 'DT gt \'' + lfvm.toISOString() + '\'';
					break;
				default:
					var lfm2 = new Date(currentDate.getTime() - (15 * 60 * 1000));
					ds += 'DT gt \'' + lfm2.toISOString() + '\'';
					break;

			}

			var postQS = '';
			if(qs.length > 0){
				postQS = qs + ' and ' + ds;
			} else {
				postQS = '$filter=' + ds;
			}

			return postQS;
		};

		self.resetGaugeSettings = function(){
			self.greenHighRange(33);
			self.redLowRange(66);
			self.renderPercentRangeChart();

			$('#timePeriodDropdown option:eq(0)').prop('selected', true);
		};

		self.submitGaugeModifications = function(btn){

			if(btn){self.logStateChange(true);}

			var validation = self.validateSubmission( self.selectedTimePeriod() );
			if( !validation.validated ){

				$('#fraudSubmissionErrors').html('<p class="text-danger">you have errors in your submission:</p><ul></ul>' ).addClass('show');
				$.each( validation.errors, function(el, i){
					$('#fraudSubmissionErrors ul').append('<li>' + i + '</li>');
				});

			} else{
				self.configSet( true );

				self.queryString = self.createQueryString();

				//put gauge mods into temp config to be pushed if/when saved
				//width, queryString, timeBreakout, showSlice
				self.config = {
					width: self.config.width,
					queryString: self.queryString,
					timeBreakout: self.selectedTimePeriod().toString(),
					greenHighRange: self.greenHighRange(),
					redLowRange: self.redLowRange(),
					userChoices: self.userChoices()
				};

				var chartDataCall = self.getChartData( self.queryString );
				$.when( chartDataCall ).then( function( dataget ){
					self.gaugeValue( parseFloat( dataget.results[0].fraud_percent ).toFixed( 2 ) );
					self.queryStringSQL( dataget.sqlQuery );
					self.makeChart();
				});
			}
		};

		self.metadataRequest.then( function() {
			self.preDataLoading( false );

			if ( wasSaved ) {
				// restore choices and show the chart
				if(self.config !== 'NULL') {
					self.selectedTimePeriod( self.config.timeBreakout );
					self.userChoices( self.config.userChoices );
				}
				self.chartSaved( true );
				self.submitGaugeModifications();
			}
		});

		return this;
	}

	return { viewModel: FraudGaugeViewModel, template: template };
});
