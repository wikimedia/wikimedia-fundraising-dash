var persistence = require( '../persistence.js' );

module.exports = {
	save: function( req, res ) {
		if ( !req.session || !req.session.passport || !req.session.passport.user ) {
			res.json( { error: 'Error: Not logged in' } );
			return;
		}
		var board = {
			ownerId: req.session.passport.user.localId,
			displayName: req.body.displayName,
			description: req.body.description,
			isShared: req.body.isShared,
			widgets: req.body.widgets
		};
		if ( req.params.id ) {
			board.id = req.params.id;
		}
		persistence.saveBoard( board ).then( function() {
			res.json( { success: true, id: board.id } );
		}, function( error ) {
			res.json( { error: error } );
		});
	},
	get: function( req, res ) {
		if ( !req.session || !req.session.passport || !req.session.passport.user ) {
			res.json( { error: 'Error: Not logged in' } );
			return;
		}
		persistence.getBoard( req.params.id, req.session.passport.user.localId ).then( function( board ) {
			res.json( board );
		}, function( error ) {
			res.json( { error: error } );
		});
	}
};
