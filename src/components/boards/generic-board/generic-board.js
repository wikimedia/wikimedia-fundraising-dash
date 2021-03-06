define( [
	'knockout',
	'jquery',
	'text!components/boards/generic-board/generic-board.html',
	'momentjs'
], function ( ko, $, template, moment ) {

	function GenericBoardViewModel( params ) {

		var self = this,
			timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

		self.sharedContext = {};
		self.displayedBoard = params.displayedBoard;
		self.boardName = ko.observable();
		self.widgetLoads = ko.observableArray( [] );

		function setWidgetLoads() {
			self.widgetLoads.removeAll();
			$.each( self.displayedBoard().widgets, function ( i, widget ) {
				widget.dataLoading = ko.observable( false );
				self.widgetLoads.push( widget.dataLoading );
			} );
		}

		setWidgetLoads();
		self.displayedBoard.subscribe( setWidgetLoads );

		// TODO: be able to change board name
		// self.boardName(self.displayedBoard().displayName);

		// This will return true if any child widget is loading
		self.dataLoading = ko.computed( function () {
			var i,
				loads = self.widgetLoads(),
				widgetCount = loads.length;

			for ( i = 0; i < widgetCount; i++ ) {
				if ( loads[ i ]() === true ) {
					return true;
				}
			}
			return false;
		} ).extend( { throttle: 50 } ); // don't flip too often

		self.dataLoading.subscribe( function ( value ) {
			if ( value ) {
				$( '#loadingModal' ).modal( 'show' ); // todo: knockout-style!
			} else {
				$( '#loadingModal' ).modal( 'hide' ); // todo: knockout-style!
			}
		} );

		$( '#loadingModal' ).on( 'hidden.bs.modal', function () {
			$( this ).css( 'display', 'none' );
			$( '.modal-backdrop' ).remove();
		} );

		// Get the date
		self.displayDate = ko.observable( moment().format( timeFormat ) );
	}

	return { viewModel: GenericBoardViewModel, template: template };

} );
