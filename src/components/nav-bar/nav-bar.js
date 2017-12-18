define( [
	'hasher',
	'jquery',
	'knockout',
	'text!components/nav-bar/nav-bar.html'
], function ( hasher, $, ko, template ) {

	function NavBarViewModel( params ) {
		var self = this;

		self.loggedIn = params.loggedIn;
		self.welcome = params.welcome;
		self.userBoards = params.userBoards;
		self.displayedPage = ko.observable( 'filler' );
		self.newBoardName = ko.observable( '' );
		self.boardError = ko.observable( '' );

		self.hideNav = function () {
			// make the nav menu fold out of view.
			$( '#navContainer .navWrapper' ).toggleClass( 'hide' );
			$( '#showNavMenu' ).css( 'display', 'inline' );
			$( '#dashApp' ).css( 'padding', '0 0 0 10px' );
		};

		self.showNav = function () {
			window.setTimeout( function () {
				$( '#navContainer .navWrapper' ).toggleClass( 'hide' );
				$( '#dashApp' ).css( 'padding-left', '175px' );
			}, 200 );
		};

		$( '.mainNavButton' ).click( function ( e ) {
			self.button = e.target;
			self.toggleNav( self.button );
		} );

		self.toggleNav = function ( button ) {
			$( '.mainNavButton' ).removeClass( 'selectedSubNav' );
			if ( $( button ).hasClass( 'mainNavButton' ) ) {
				$( button ).addClass( 'selectedSubNav' );
			} else {
				$( button.parentElement ).addClass( 'selectedSubNav' );
			}
		};

		self.toggleBoardList = function ( e, data ) {
			$( '#boards.subNavBoardOpts' ).slideDown( 200, 'swing', function () {
				$( '#boards.subNavBoardOpts' ).toggleClass( 'hide' );
			} );
		};

		self.toggleProfileList = function () {
			$( '#profileLinks.subNavBoardOpts' ).slideDown( 200, 'swing', function () {
				$( '#profileLinks.subNavBoardOpts' ).toggleClass( 'hide' );
			} );
		};

		self.addBoard = function () {
			var board, name = self.newBoardName();
			self.boardError( '' );
			if ( name === '' ) {
				self.boardError( 'Enter new board name' );
				return;
			}
			board = {
				displayName: name,
				description: '',
				isShared: false,
				widgets: []
			};
			$.ajax( {
				method: 'POST',
				url: '/board',
				contentType: 'application/json; charset=UTF-8',
				data: JSON.stringify( board ),
				success: function ( returned ) {
					if ( returned.error ) {
						self.boardError( returned.error );
						return;
					}
					board.id = returned.id;
					self.userBoards.push( board );
					self.newBoardName( '' );
				}
			} );
		};
		self.readHashValue = function ( hashValue ) {
			if ( hashValue.length ) {
				self.button = '#' + hashValue;
				self.toggleNav( self.button );
			}
		};
		hasher.initialized.add( self.readHashValue );
		hasher.changed.add( self.readHashValue );
	}

	return { viewModel: NavBarViewModel, template: template };

} );
