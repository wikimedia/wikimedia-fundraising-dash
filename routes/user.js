var persistence = require( '../persistence.js' );

module.exports = {
	info: function( req, res ) {
		if ( !req.session || !req.session.passport || !req.session.passport.user ) {
			res.json( false );
			return;
		}

		var user = req.session.passport.user;

		res.json( {
			name: user.displayName,
			id: user.localId,
			defaultBoard: user.defaultBoard
		} );
	},
	boards: function( req, res ) {
		if ( !req.session || !req.session.passport || !req.session.passport.user ) {
			res.json( { error: 'Error: Not logged in' } );
			return;
		}

		persistence.listBoards( req.session.passport.user.localId ).then( function( boards ) {
			res.json( boards );
		}, function( error ) {
			res.json( { error: error } );
		});
	}
};
