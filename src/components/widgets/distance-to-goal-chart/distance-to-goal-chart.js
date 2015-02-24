define( [
    'knockout',
    'text!components/widgets/distance-to-goal-chart/distance-to-goal-chart.html',
    'c3',
    'momentjs'
], function( ko, template, c3, moment ){


    function DistanceToGoalChartViewModel( params ){

        var self = this;
        self.goal = ko.observable('20,000,000');
        self.dailyDataArray = [ 'Daily Total' ];

        self.loadData = function ( decemberData, timestamp ) {
			var runningTotal = 0,
				currentDate = new Date(),
	        	timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';
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

			//self.makeCharts();

			self.raised(runningTotal);
		};

        // $.get('data/big-english', function(dtgData){

        // 	console.log('dtgData', dtgData);

        // 	self.dailyDataArray;


        // });

        self.title = ko.observable(params.title);
		self.makeCharts = function() {
			if ( self.dailyDataArray.length < 2 ) {
				return;
			}
			self.goal = ko.observable(self.goal);

			self.updatedGoal = self.goal();
			self.neededArray = ['Needed'];
			for(var d = 1; d < self.dailyDataArray.length; d++) {
				self.updatedGoal = self.updatedGoal - self.dailyDataArray[d];
				self.neededArray[d] = self.updatedGoal >= 0 ? self.updatedGoal : 0;
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

		//self.makeCharts();
	}
    return { viewModel: DistanceToGoalChartViewModel, template: template };

});
