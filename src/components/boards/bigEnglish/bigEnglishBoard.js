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

        // TODO: these two will come from the passed in data response
        self.goal = ko.observable(20000000);
        self.raised = ko.observable(147890);

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

    }

    return { viewModel: BigEnglishBoardViewModel, template: template };

});