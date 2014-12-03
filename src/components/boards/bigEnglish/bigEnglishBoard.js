define( [
    'knockout',
    'text!components/boards/bigEnglish/bigEnglishBoard.html',
    'momentjs',
    'numeraljs'
], function( ko, template, moment, numeral ){


    function BigEnglishBoardViewModel( params ){

        var self = this;

        // Get the date
        self.getTodaysDate = ko.computed( function(){
			return moment().format( "dddd, MMMM Do YYYY, h:mm:ss a" );
		});

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
            return numeral(trtd).format('$0,0');
        });

        self.secondsByHourDonationData = ['Donations Per Second'];

        //initialize day/hour data
        self.dayObj = [];
		self.dailyDataArray = ['Daily Total'];
        self.dailyCountArray = ['Daily Count'];

		// Allows components in the board to subscribe to a single property
        // and get notified of any changes to the available data.
        self.dataChanged = ko.computed(function() {
			// For now, we only want to trigger if new money has come in or the
            // goal has been reset.  So the total remaining is a good proxy
            return self.totalRemainingToDate();
        });

		// Only recalculate child boards once per half second
		self.dataChanged.extend( { rateLimit: 500 } );

		self.loadData = function ( decemberData ) {
			var runningTotal = 0;
			for (var d = 1; d < 32; d++) {
				self.dailyDataArray[d] = 0;
				self.dailyCountArray[d] = 0;
				if (!self.dayObj[d]) {
					self.dayObj[d] = Array(25);
					self.dayObj[d][0] = 'Hourly Totals';
					for (var h = 1; h < 25; h++) {
						self.dayObj[d][h] = { total: 0, count: 0 };
						self.secondsByHourDonationData[(d - 1) * 24 + h] = 0;
					}
				}
			}

			var dataCount = decemberData.length;
			for (var i = 0; i < dataCount; i++ ) {

				var el = decemberData[i],
						d = el.day,
						h = el.hour,
						total = el.usd_total;
				self.dayObj[d][h + 1] = { total: total, count: el.donations };


				runningTotal += total;
				self.dailyDataArray[d] += total;
				self.dailyCountArray[d] += el.donations;

			};

			self.raised(runningTotal);
		};

		// Reload the data
		self.reloadBigEnglish = function(){
			$.get( '/data/big-english' , function ( dataget ) {
				self.loadData( dataget.results );
			});
		};
		// Do it every 5 minutes as well
		setTimeout(self.reloadBigEnglish, 300000);

		self.reloadBigEnglish();
    }

    return { viewModel: BigEnglishBoardViewModel, template: template };

});
