var persistence = require( '../persistence.js' );

module.exports = {
	list: function( req, res ) {
		persistence.listWidgets().then( function ( widgets ) {
			res.json( widgets );
		});
	},
	saveInstance: function( req, res ) {
		var instance = {
			widgetId: req.body.widgetId,
			ownerId: req.session.passport.user.localId,
			displayName: req.body.displayName,
			description: req.body.description,
			isShared: req.body.isShared,
			configuration: JSON.stringify( req.body.configuration )
		};
		if ( req.params.id ) {
			instance.id = req.params.id;
		}
		persistence.saveWidgetInstance( instance ).then( function() {
			res.json( { success: true, id: instance.id } );
		}, function( error ) {
			res.json( { error: error } );
		});
	},
	getInstance: function( req, res ) {
		persistence.getWidgetInstance( req.params.id, req.session.passport.user.localId ).then( function( instance ) {
			res.json( instance );
		}, function( error ) {
			res.json( { error: error } );
		});
	}
};
