define( [
    'knockout',
    'text!components/boards/bigEnglish/bigEnglishBoard.html',
    'momentjs'
], function( ko, template, moment ){


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

    }

    return { viewModel: BigEnglishBoardViewModel, template: template };

});