define( [
    'knockout',
    'text!components/boards/generic-board/generic-board.html',
    'momentjs',
    'numeraljs'
], function( ko, template, moment, numeral ){


    function GenericBoardViewModel( params ){

        var self = this,
            timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

        self.sharedContext = {};

        self.displayedBoard = params.displayedBoard;
        self.widgetLoads = [];
        $.each( self.displayedBoard().widgets, function( i, widget ) {
            widget.dataLoading = ko.observable( false );
            self.widgetLoads.push( widget.dataLoading );
        } );

        //This will return true if any child widget is loading
        self.dataLoading = ko.computed( function() {
            var i, widgetCount = self.widgetLoads.length;
            for ( i = 0; i < widgetCount; i++ ) {
                if ( self.widgetLoads[i]() === true ) {
                    $('#loadingModal').modal('show'); //todo: knockout-style!
                    return true;
                }
            }
            $('#loadingModal').modal('hide'); //todo: knockout-style!
            return false;
        } );

        // Get the date
        self.displayDate = ko.observable( moment().format( timeFormat ) );

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
