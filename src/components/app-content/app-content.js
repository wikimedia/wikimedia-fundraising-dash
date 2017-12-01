define( [
	'hasher',
	'jquery',
	'knockout',
	'text!./app-content.html'
], function ( hasher, $, ko, templateMarkup ) {
	function AppContent() {
		var self = this,
			pages = [ 'Library', 'Profile', 'Home' ];

		hasher.prependHash = '';

		self.displayedBoard = ko.observable();
		self.hashValue = location.hash.substring( 1 );
		self.userBoards = ko.observableArray();
		self.userdata = ko.observable();
		self.displayedPage = ko.observable( 'Home' );
		self.loggedIn = ko.observable( false );
		self.welcome = ko.observable( '' );
		self.widgetTemplates = ko.observableArray();
		self.widgetInstances = ko.observableArray();
		self.currentBoardWidgets = ko.computed( function () {
			var widgets = [];
			if ( self.displayedBoard() ) {
				$.each( self.displayedBoard().widgets, function ( idx, widget ) {
					widgets[ widget.widgetId ] = true;
				} );
			}
			return widgets;
		} );

		self.displayPage = function ( view ) {
			if ( pages.indexOf( view ) > -1 ) {
				self.displayedPage( view );
			} else if ( !isNaN( parseInt( view, 10 ) ) ) {
				$.get( 'board/' + view, function ( bdata ) {
					self.displayedPage( 'Home' );
					self.displayedBoard( bdata );
				} );
			} else {
				return false;
			}
		};

		$.get( '/user/info', function ( userInfo ) {
			if ( userInfo && !userInfo.error ) {
				self.userdata( userInfo );
				self.welcome( userInfo.name.charAt( 0 ).toUpperCase() + userInfo.name.slice( 1 ) );
				self.loggedIn( true );
				$.get( 'board/' + self.userdata().defaultBoard, function ( moredata ) {
					self.displayedBoard( moredata );
					self.displayPage( self.hashValue );
				} );
				$.get( 'board/', function ( boards ) {
					self.userBoards( boards );
				} );
			}
		} );

		self.addWidgetToBoard = function ( event, data ) {
			$.ajax( {
				method: 'POST',
				url: '/widget-instance',
				contentType: 'application/json; charset=UTF-8',
				data: JSON.stringify( {
					widgetId: event.id,
					displayName: 'My ' + event.displayName,
					isShared: false
				} ),
				success: function ( data ) {
					$.ajax( {
						method: 'POST',
						url: '/board/' + self.displayedBoard().id + '/widgets',
						contentType: 'application/json; charset=UTF-8',
						data: JSON.stringify( {
							instanceId: data.id
						} ),
						success: function ( stuff ) {
							// refresh the displayed board
							$.get( 'board/' + self.displayedBoard().id, function ( moredata ) {
								self.displayedBoard( moredata );
							} );
						}
					} );
				}
			} );

		};

		self.removeWidgetFromBoard = function ( event, data ) {
			var removingBoard = self.displayedBoard().id;
			$.ajax( {
				method: 'DELETE',
				url: '/board/' + removingBoard + '/widgets/' + event.instanceID,
				success: function () {
					$.get( 'board/' + removingBoard, function ( moredata ) {
						self.displayedBoard( moredata );
						$( '.modal-backdrop' ).remove();
					} );
				}
			} );
		};

		self.setDisplayPage = function ( e, data ) {
			var view = data.target.id;
			hasher.setHash( view );
			if ( !self.displayPage( view ) ) {
				self.displayedPage( $.trim( $( data.target ).text() ) );
			}
		};

		$.get( '/widget', function ( widgetTemplates ) {

			var wt = $.map( widgetTemplates, function ( n ) {
				n.onBoard = ko.computed( function () {
					return ( self.currentBoardWidgets()[ n.id ] );
				} );
				return n;
			} );

			self.widgetTemplates( wt );
		} );

		self.getUsersWidgetInstances = function () {
			$.get( '/widget-instance', function ( widgetInstances ) {

				var wi = $.map( widgetInstances, function ( n ) {
					return n;
				} );

				self.widgetInstances( wi );
			} );
		};
		self.getUsersWidgetInstances();

		self.handleChanges = function ( newHash ) {
			self.displayPage( newHash );
		};

		hasher.changed.add( self.handleChanges );
		hasher.init();
	}

	return { viewModel: AppContent, template: templateMarkup };
} );
