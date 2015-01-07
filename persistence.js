var config = require( './config.js' ),
	promiseDbLib = require( 'mysql-promise' );

function getConnection() {
	var promiseDb = promiseDbLib();
	promiseDb.configure({
		host: config.dbserver,
		user: config.dblogin,
		password: config.dbpwd,
		database: config.db,
		multipleStatements: true
	});
	return promiseDb;
}

module.exports = {
	/**
	 * Ensures a user exists in the user table and saves the user's local db id
	 * in session.  Creates a default board if none exists.
	 * @param Object user should have displayName, provider, and id set by oauth
	 * @return Object Promise that fulfills on completion or rejects with error
	 */
	loginUser: function( user ) {
		var params = [ user.id, user.provider, user.displayName ],
			insertUser = 'INSERT IGNORE INTO dash_user ( oauth_id, oauth_provider, display_name ) VALUES ( ?, ?, ? )',
			getInfo = 'SELECT id, default_board from dash_user where oauth_id = ? and oauth_provider = ?',
			insertBoard = 'INSERT INTO dash_board ( display_name, owner_id ) VALUES ( ?, ? ); UPDATE dash_user SET default_board = LAST_INSERT_ID() WHERE id = ?; SELECT LAST_INSERT_ID() AS id',
			connection = getConnection();

		return connection.query( insertUser, params ).then( function() {
			return connection.query( getInfo, params ).then( function( dbResults ) {
				var userId = dbResults[0][0].id,
					defaultBoard = dbResults[0][0].default_board;
				user.localId = userId;
				if ( defaultBoard ) {
					user.defaultBoard = defaultBoard;
					return;
				}
				// If user doesn't have a default board, insert one now
				return connection.query( insertBoard, [ 'Default dashboard for ' + user.displayName, userId, userId ] ).then( function( dbResults ) {
					user.defaultBoard = dbResults[0].id;
				});
			});
		});
	}
};
