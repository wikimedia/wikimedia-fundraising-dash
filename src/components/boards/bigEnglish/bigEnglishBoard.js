define( [
    'knockout',
    'text!components/boards/bigEnglish/bigEnglishBoard.html',
    'momentjs',
    'numeraljs'
], function( ko, template, moment, numeral ){


    function BigEnglishBoardViewModel( params ){

        var self = this,
			timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

        self.dataLoading = ko.observable(true);

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

        self.secondsByHourDonationData = ['Donations Per Second'];

        //initialize day/hour data
        self.dayObj = [];
		self.dailyDataArray = ['Daily Total'];
        self.dailyCountArray = ['Daily Count'];
		self.lastDataPoint = { day: 1, hour: 0 };

		// Allows components in the board to subscribe to a single property
        // and get notified of any changes to the available data.
        self.dataChanged = ko.computed(function() {
			// For now, we only want to trigger if new money has come in or the
            // goal has been reset.  So the total remaining is a good proxy
            return self.goal() - self.raised();
        });

        //todo: this could go elsewhere
        self.ellipsis = ko.observable('');
        self.ellipsisObj = {
            'value' : ['', '.', '..', '...', '....'],
            'count' : 0,
            'run' : false,
            'timer' : null,
            'element' : '.ellipsis',
            'start' : function () {
              var t = this;
                this.run = true;
                this.timer = setInterval(function () {
                    if (t.run) {
                        self.ellipsis(t.value[t.count % t.value.length]);
                        t.count++;
                    }
                }, 400);
            },
            'stop' : function () {
                this.run = false;
                clearInterval(this.timer);
                this.count = 0;
            }
        };
        self.ellipsisObj.start();

		// Only recalculate child boards once per half second
		self.dataChanged.extend( { rateLimit: 500 } );

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

			self.raised(runningTotal);
		};

		// Reload the data.  For the automatic reload, we're fine getting
		// something from the cache.
		self.reloadBigEnglish = function( automatic ){
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
				self.reloadBigEnglish( true );
			}, 300000 );
		};

		self.reloadBigEnglish( true );
    }

    return { viewModel: BigEnglishBoardViewModel, template: template };

});
