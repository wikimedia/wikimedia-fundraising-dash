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

        // Reload the page
        self.reloadBigEnglish = function(){
			location.reload();
		};
        // Do it every 5 minutes as well
        setTimeout(self.reloadBigEnglish, 300000);

        // TODO: these two will come from the passed in data response
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

        self.decemberData = [];
        self.dailyDonationLabels = [];
        self.secondsByHourDonationData = ['Donations Per Second'];
        self.dailyDonationData = {};
        //initialize day/hour data
        self.dayObj = [];
		self.dailyDataArray = ['Daily Total'];
        self.dailyCountArray = ['Daily Count'];
		for (var d = 1; d < 32; d++) {
			self.dailyDataArray[d] = 0;
            self.dailyCountArray[d] = 0;
			self.dayObj[d] = [ 'Hourly Totals' ];
			for (var h = 1; h < 25; h++) {
				self.dayObj[d][h] = 0;
				self.secondsByHourDonationData[(d - 1) * 24 + h] = 0;
			}
		}

		// Allows components in the board to subscribe to a single property
        // and get notified of any changes to the available data.
        self.dataChanged = ko.computed(function() {
			// For now, we only want to trigger if new money has come in or the
            // goal has been reset.  So the total remaining is a good proxy
            return self.totalRemainingToDate();
        });

		// Only recalculate child boards once per half second
		self.dataChanged.extend( { rateLimit: 500 } );

        $.get( '/data/big-english' , function ( dataget ) {
            self.decemberData = dataget.results;
			var runningTotal = 0;
			for (var d = 1; d < 32; d++) {
				self.dailyDataArray[d] = 0;
				self.dayObj[d] = Array(25);
				self.dayObj[d][0] = 'Hourly Totals';
				for (var h = 1; h < 25; h++) {
					self.dayObj[d][h] = 0;
					self.secondsByHourDonationData[(d - 1) * 24 + h] = 0;
				}
			}
			$.each(self.decemberData, function(el, i){
				var d = self.decemberData[el].day, h = self.decemberData[el].hour;
				self.dayObj[d][h + 1] = { total: self.decemberData[el].usd_total, count: self.decemberData[el].donations };
				//get all seconds into seconds array
				self.secondsByHourDonationData[(d - 1) * 24 + h+1] = self.decemberData[el].usd_per_second;
				runningTotal += self.decemberData[el].usd_total;
			});

			$.each(self.decemberData, function(i, el){

				//get labels from chart based on where we are in December.
				if (self.dailyDonationLabels.indexOf(el.day) < 0){
					self.dailyDonationLabels.push(el.day);
				}

				//get data slice for days: donation amt
				if(self.dailyDonationData[el.day]){
					self.dailyDonationData[el.day]['amount'] += el.usd_total;
                    self.dailyDonationData[el.day]['count'] += el.donations;
				} else {
					self.dailyDonationData[el.day] = { amount: el.usd_total, count: el.donations};
				}

			});

			$.each( self.dailyDonationData, function(el, i){
				self.dailyDataArray[parseInt(el, 10)] = self.dailyDonationData[el]['amount'];
                self.dailyCountArray[parseInt(el, 10)] = self.dailyDonationData[el]['count'];
			});
			self.raised(runningTotal);
        });
    }

    return { viewModel: BigEnglishBoardViewModel, template: template };

});