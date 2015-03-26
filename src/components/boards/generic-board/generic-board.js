define( [
    'knockout',
    'text!components/boards/generic-board/generic-board.html',
    'momentjs',
    'numeraljs'
], function( ko, template, moment, numeral ){


    function GenericBoardViewModel( params ){

        var self = this,
            timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

        self.sharedContext          = {};
        self.displayedBoard         = params.displayedBoard;
        self.boardName              = ko.observable();
        self.widgetLoads            = ko.observableArray([]);

		function setWidgetLoads() {
			self.widgetLoads.removeAll();
			$.each( self.displayedBoard().widgets, function( i, widget ) {
				widget.dataLoading = ko.observable( false );
				self.widgetLoads.push( widget.dataLoading );
			} );
		}
		setWidgetLoads();
		self.displayedBoard.subscribe( setWidgetLoads );

        //TODO: be able to change board name
        //self.boardName(self.displayedBoard().displayName);

        //This will return true if any child widget is loading
        self.dataLoading = ko.computed( function() {
            var i,
				loads = self.widgetLoads(),
				widgetCount = loads.length;

            for ( i = 0; i < widgetCount; i++ ) {
                if ( loads[i]() === true ) {
                    return true;
                }
            }
            return false;
        } ).extend( { throttle: 10 } ); // don't flip too often

        self.dataLoading.subscribe( function( value ) {
            if ( value ) {
                $('#loadingModal').modal('show'); //todo: knockout-style!
            } else {
                $('#loadingModal').modal('hide'); //todo: knockout-style!
            }
        } );
        // Get the date
        self.displayDate = ko.observable( moment().format( timeFormat ) );

        // Reload the data.  For the automatic reload, we're fine getting
        // something from the cache.
        self.reloadBoard = function( automatic ){
   //          self.dataLoading(true);
            // var url = '/data/' + self.widgetize(self.boardName());
            // if ( automatic !== true ) {
            //  url += '/?cache=false';
            // }
            // $.get( url , function ( dataget ) {
            //  self.loadData( dataget.results, dataget.timestamp );
   //              self.dataLoading(false);
            // });
            // // Do it every 5 minutes as well
            // setTimeout( function () {
            //  self.reloadBoard( true );
            // }, 300000 );
        };

        self.reloadBoard( true );
    }

    return { viewModel: GenericBoardViewModel, template: template };

});
