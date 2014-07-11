define([
	'jquery',
	'underscore',
	'backbone',
	'utils/dispatcher',
	'utils/colors',
	'text!views/templates/widgets/dailyBreakdowns.html',
	'handlebars',
	'jquery.ui.slider',
	'flot',
	'd3',
	'momentjs'
],
function($, _, Backbone, Dispatcher, Colors, widgetTemplate, Handlebars, slider, d3, flot){

	var DailyBreakdownsView = Backbone.View.extend({

			initialize: function(){

				this.JSONFiles = [
					'2012-13-fiscal-donationdata-medium-breakdown.json',
					'2012-13-fiscal-donationdata-method-breakdown.json'
				];

				this.el = '#widgetSection';
				this.template = _.template( widgetTemplate );

			},

			getData: function(){
				//get medium, method, range data from JSON files.
				//(TODO: get from Fredge)
				//translate json into arrays.
				var that = this;
				Dispatcher.setupDataFromJSONFiles( this.JSONFiles ).done( function(sets){

					var dailyBreakdownsChartSet = [];

					_.each(sets, function( el, i ){
						var formattedData = Dispatcher.convertStringDatesToMoments(el.data);
						dailyBreakdownsChartSet.push(formattedData);
					});

					that.masterDataSet = dailyBreakdownsChartSet;
					that.displayDailyBreakdownsChart(that.masterDataSet);
				});

			},

			render: function(){

				$(this.el).append( this.template );
				this.getData();

			},

			displayDailyBreakdownsChart: function(data){

				var chartSeries = {
					paymentFamiliesData:  data[1],
					mediumData:           data[0],
					rangeData:            data[2],
					continentData:        "no continents yet",
					colors:               Colors.colorArray,
					days:                 {},

					drawByMedium: function(){
						var mediums = {};

						//break out into dates
						_.each( this.mediumData, function( row ) {
							if( !mediums[row.date] ){
								mediums[row.date] = [row];
							} else {
								mediums[row.date].push(row);
							}
						});

						//groupedMediums is an object containing each month's formatted data arrays.
						var groupedMediums = {};
						for(holder in mediums){
							var dayObj = mediums[holder];
							for (key in dayObj){
								var d = dayObj[key]['date'];
								var c = dayObj[key]['count'];

								if(!dayObj[key]['utm_medium']){
									var m = "Other";
								} else {
									var m = dayObj[key]['utm_medium'];
								}

								var mm = parseInt( moment(d).format('M') ) - 1;
								if(groupedMediums['month' + mm]){
									if(groupedMediums['month' + mm][m]){
										groupedMediums['month' + mm][m].push([d.format('D'), c]);
									} else {
										groupedMediums['month' + mm][m] = {};
										groupedMediums['month' + mm][m] = [ [d.format('D'), c] ];
									}

								} else {
									groupedMediums['month' + mm] = {};
									groupedMediums['month' + mm][m] = {};
									groupedMediums['month' + mm][m] = [ [d.format('D'), c] ];
								}

							}
						}

						var megaArray = _.map(groupedMediums, function(d){
							keyObjs = [];
							for( key in d ){
								keyObjs.push({ label: key, data: d[key] });
							}
							return keyObjs;
						});

						var bdChart = {
								january: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[0], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>January 2013</h1>');
								},
								february: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[1], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>February 2013</h1>');
									},
									march: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[2], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>March 2013</h1>');
									},
									april: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[3], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>April 2013</h1>');
									},
									may: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[4], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>May 2013</h1>');
									},
									june: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[5], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>June 2013</h1>');
									},
									july: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[6], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>July 2012</h1>');
									},
									august: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[7], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>August 2012</h1>');
									},
									september: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[8], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>September 2012</h1>');
									},
									october: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[9], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>October 2012</h1>');
									},
									november: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[10], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>November 2012</h1>');
									},
									december: function () {
										$.plot($("#daily_breakdowns_chart"), megaArray[11], {
											series: {
												stack: stack,
												label: 'hi',
												hoverable: true,
												lines: { show: lines, fill: true, steps: steps },
												bars: { show: bars, barWidth: 0.6 },
											},
											colors: [ chartSeries.colors.blue,
																chartSeries.colors.purple,
																chartSeries.colors.green,
																chartSeries.colors.pink,
																chartSeries.colors.yellow
															]
										});
										$('#breakdown-header').html('<h1>December 2012</h1>');
									}
								}

						if($("#daily_breakdowns_chart").length)
						{
							var stack = 0, bars = true, lines = false, steps = false;

							bdChart.january();

							$(".stackControls input").click(function (e) {
								e.preventDefault();
								stack = $(this).val() == "With stacking" ? true : null;
								plotWithOptions();
							});
							$(".graphControls input").click(function (e) {
								e.preventDefault();
								bars = $(this).val().indexOf("Bars") != -1;
								lines = $(this).val().indexOf("Lines") != -1;
								steps = $(this).val().indexOf("steps") != -1;
								plotWithOptions();
							});
						}

						//the slider
						$( "#breakdown-slider" ).slider({
							value: 1,
							min: 1,
							max: 12,
							step: 1,
							slide: function( event, ui ) {
								switch (ui.value) {
									case 1:
										bdChart.january();
										break;
									case 2:
										bdChart.february();
										break;
									case 3:
										bdChart.march();
										break;
									case 4:
										bdChart.april();
										break;
									case 5:
										bdChart.may();
										break;
									case 6:
										bdChart.june();
										break;
									case 7:
										bdChart.july();
										break;
									case 8:
										bdChart.august();
										break;
									case 9:
										bdChart.september();
										break;
									case 10:
										bdChart.october();
										break;
									case 11:
										bdChart.november();
										break;
									case 12:
										bdChart.december();
										break;
									}
							}
						})
							.each(function(){
								var opt = $(this).data().uiSlider.options;
								var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
								var vals = opt.max - opt.min;
								for(i=0; i<=vals; i++){
									var el = $('<label>'+months[i]+'</label>').css('left',(i/vals*100)+'%');
									$( "#breakdown-slider" ).append(el);
								}
							});

					},
					drawByPaymentFamily: function(){

						var groupedPaymentMethods = [{'Credit Card': 0}];
						for(dayObj in paymentMethods){

							if(dayObj.method){
								var creditCard = new RegExp('Credit Card: ').test(dayObj.method)===true;
								if(creditCard){
									groupedPaymentMethods["Credit Card"] += 1;
								} else if(groupedPaymentMethods[dayObj.method]){
									groupedPaymentMethods[dayObj.method] += 1;
								} else {
									groupedPaymentMethods[dayObj.method] = 1;
								}
							}

						}

						var groupedDataArray = []
						for(key in groupedPaymentMethods){
							groupedDataArray.push({label: key, data: groupedPaymentMethods[key]});
						}


					},
					drawByRanges: function(){

					},
					drawByContinent: function(){

					}
				};

				//display the default chart.
				chartSeries.drawByMedium();

				//handle clicks by displaying the corresponding charts.
				$('.breakdownFacet input').click(function(e) {
						e.preventDefault();
						switch (this.value) {
							case "by Continent":
								chartSeries.drawByContinent();
								break;
							case "by Payment Family":
								chartSeries.drawByPaymentFamily();
								break;
							case "by Medium":
								chartSeries.drawByMedium();
								break;
							case "by Donation Range":
								chartSeries.drawByRanges();
								break;
						}
				});

			}

	});

	return DailyBreakdownsView;

});
