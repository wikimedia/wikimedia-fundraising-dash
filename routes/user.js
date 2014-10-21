module.exports = function( req, res ) {
	if ( !req.session || !req.session.passport || !req.session.passport.user ) {
		res.json( false );
		return;
	}

	var user = req.session.passport.user;
	
	res.json( {
		name: user.displayName
	} );
}