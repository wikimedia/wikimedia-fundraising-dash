var persistence = require( '../persistence.js' );

module.exports = {
	save: function( req, res ) {
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
		persistence.getBoard( req.params.id, req.session.passport.user.localId ).then( function( board ) {
			res.json( board );
		}, function( error ) {
			res.json( { error: error } );
		});
	},
	addWidget: function( req, res ) {
		var board = {
			ownerId: req.session.passport.user.localId,
			id: req.params.id,
			addWidget: req.body.instanceId
		};
		persistence.saveBoard( board ).then( function() {
			res.json( { success: true, id: board.id } );
		} );
	},
	deleteWidget: function( req, res ) {
		var board = {
			ownerId: req.session.passport.user.localId,
			id: req.params.id,
			deleteWidget: req.params.instanceId
		};
		persistence.saveBoard( board ).then( function() {
			res.json( { success: true, id: board.id } );
		} );
	}
};
