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

function insertWidgetList( board, connection ) {
	var numWidgets = board.widgets.length,
		i,
		insertWidgets = 'INSERT INTO dash_widget_instance_board ( instance_id, board_id, widget_position ) VALUES ',
		placeholders = '',
		values = [];

	if ( numWidgets === 0 ) {
		return;
	}
	for ( i = 0; i < numWidgets; i++ ) {
		if ( i > 0 ) {
			placeholders += ',';
		}
		placeholders += ' ( ?, ?, ? )';
		values.push( board.widgets[i] );
		values.push( board.id );
		values.push( i );
	}
	return connection.query( insertWidgets + placeholders, values );
}

module.exports = {
	/**
	 * Ensures a user exists in the user table and saves the user's local db id
	 * in session.  Creates a default board if none exists.
	 * @param Object user should have displayName, provider, and id set by oauth
	 * @return Promise that fulfills on completion or rejects with error
	 */
	loginUser: function( user ) {
		var params = [ user.id, user.provider, user.displayName ],
			insertUser = 'INSERT IGNORE INTO dash_user ( oauth_id, oauth_provider, display_name ) VALUES ( ?, ?, ? )',
			getInfo = 'SELECT id, default_board from dash_user where oauth_id = ? and oauth_provider = ?',
			insertBoard = 'INSERT INTO dash_board ( display_name, description, owner_id ) VALUES ( ?, \'\', ? ); UPDATE dash_user SET default_board = LAST_INSERT_ID() WHERE id = ?; SELECT LAST_INSERT_ID() AS id',
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
	},
	/**
	 * Saves a widget configuration
	 * @param Object instance should have ownerId, widgetId, displayName,
	 * isShared, and configuration set.  If id is not set, this function creates
	 * a new instance and sets the id.
	 * @return Promise that fulfills on completion or rejects with error
	 */
	saveWidgetInstance: function( instance ) {
		var insert = 'INSERT INTO dash_widget_instance ( widget_id, owner_id, display_name, description, is_shared, configuration ) VALUES ( ?, ?, ?, ?, ?, ? )',
			update = 'UPDATE dash_widget_instance set display_name = ?, description = ?, is_shared = ?, configuration = ? WHERE id = ? AND owner_id = ?',
			insertParams = [ instance.widgetId, instance.ownerId, instance.displayName, instance.description, instance.isShared ? 1 : 0, instance.configuration ],
			updateParams = [ instance.displayName, instance.description, instance.isShared ? 1 : 0, instance.configuration, instance.id, instance.ownerId ],
			connection = getConnection();

		if ( instance.id ) {
			return connection.query( update, updateParams ).then( function( dbResults ) {
				if ( dbResults[0].affectedRows !== 1 ) {
					// Either the instance doesn't exist or it's not ours
					throw new Error('Instance ' + instance.id  + ' with owner ' + instance.ownerId + ' not found' );
				}
			});
		}
		return connection.query( insert, insertParams ).then( function( dbResults ) {
			instance.id = dbResults[0].insertId;
		});
	},
	/**
	 * @param number boardId ID of board to fetch
	 * @param number userId local ID of user
	 * @returns Promise that resolves with a JSON representation of all
	 * board widgets or rejects with error
	 */
	getWidgetInstance: function( instanceId, userId ) {
		var connection = getConnection(),
			select = 'SELECT widget_id, owner_id, display_name, description, is_shared, configuration FROM dash_widget_instance WHERE id = ? and ( is_shared OR owner_id = ? )';

		return connection.query( select, [ instanceId, userId ] ).then( function( dbResults ) {
			var result = dbResults[0][0];
			if ( result.owner_id ) {
				return {
					id: instanceId,
					widgetId: result.widget_id,
					ownerId: result.owner_id,
					displayName: result.display_name,
					description: result.description,
					isShared: result.is_shared === 1,
					configuration: JSON.parse( result.configuration )
				};
			} else {
				throw new Error( 'Instance ' + instanceId  + ' for user ' + userId + ' not found' );
			}
		});
	},
	/**
	 * List all widget instances available to a user
	 * @param number userId local ID of user
	 * @returns Promise that resolves with a JSON representation of all
	 * widget instances owned by or shared with the user, or rejects with error
	 */
	listWidgetInstances: function( userId ) {
		var connection = getConnection(),
			select = 'SELECT id, widget_id, owner_id, display_name, description, is_shared, configuration FROM dash_widget_instance WHERE is_shared OR owner_id = ?';

		return connection.query( select, [ userId ] ).then( function( dbResults ) {
			var rows = dbResults[0],
				count = rows.length,
				i,
				result = [];

			for ( i = 0; i < count; i++ ) {
				result[i] = {
					id: rows[i].id,
					widgetId: rows[i].widget_id,
					ownerId: rows[i].owner_id,
					displayName: rows[i].display_name,
					description: rows[i].description,
					isShared: rows[i].is_shared === 1,
					configuration: JSON.parse( rows[i].configuration )
				};
			}
			return result;
		});
	},
	/**
	 * Saves a board
	 * @param Object instance should have ownerId, displayName, description,
	 * isShared, and widgets (an ordered array of widget instance ids) set.
	 * If id is not set, this function creates a new board and sets the id.
	 * @return Promise that fulfills on completion or rejects with error
	 * @TODO: transactional!
	 */
	saveBoard: function( board ) {
		var connection = getConnection(),
			insert = 'INSERT INTO dash_board ( owner_id, display_name, description, is_shared ) VALUES ( ?, ?, ?, ? )',
			insertParams = [ board.ownerId, board.displayName, board.description, board.isShared ? 1 : 0 ],
			update = 'UPDATE dash_board set display_name = ?, description = ?, is_shared = ? WHERE id = ? AND owner_id = ?',
			updateParams = [ board.displayName, board.description, board.isShared ? 1 : 0, board.id, board.ownerId ],
			deleteWidgets = 'DELETE FROM dash_widget_instance_board WHERE board_id = ?';

		if ( board.id ) {
			return connection.query( update, updateParams ).then( function( dbResults ) {
				if ( dbResults[0].affectedRows !== 1 ) {
					// Either the board doesn't exist or it's not ours
					throw new Error( 'Board ' + board.id  + ' with owner ' + board.ownerId + ' not found' );
				}
				return connection.query( deleteWidgets, [ board.id ] ).then( function() {
					return insertWidgetList( board, connection );
				});
			});
		}
		return connection.query( insert, insertParams ).then( function( dbResults ) {
			board.id = dbResults[0].insertId;
			return insertWidgetList( board, connection );
		});
	},
	/**
	 * @param number boardId ID of board to fetch
	 * @param number userId local ID of user
	 * @returns Promise that resolves with a JSON representation of all
	 * board widgets or rejects with error
	 */
	getBoard: function( boardId, userId ) {
		var connection = getConnection(),
			select = 'SELECT owner_id, display_name, description, is_shared FROM dash_board WHERE id = ? AND ( is_shared OR owner_id = ? )';

		return connection.query( select, [ boardId, userId ] ).then( function( dbResults ) {
			var result = dbResults[0][0],
				board,
				widgetSelect = 'SELECT wi.id, widget_id, owner_id, display_name, description, is_shared, configuration FROM dash_widget_instance wi INNER JOIN dash_widget_instance_board dwib ON wi.id = dwib.instance_id WHERE board_id = ? ORDER BY dwib.widget_position';

			if ( !result.owner_id ) {
				throw new Error('Board ' + boardId  + ' with owner ' + userId + ' not found' );
			}
			board = {
				id: boardId,
				ownerId: userId,
				displayName: result.display_name,
				description: result.description,
				isShared: result.is_shared === 1,
				widgets: []
			};
			return connection.query( widgetSelect, [ boardId ] ).then( function( dbResults ) {
				var rows = dbResults[0],
					count = rows.length,
					i;

				for ( i = 0; i < count; i++ ) {
					board.widgets[i] = {
						id: rows[i].id,
						widgetId: rows[i].widget_id,
						ownerId: rows[i].owner_id,
						displayName: rows[i].display_name,
						description: rows[i].description,
						isShared: rows[i].is_shared === 1,
						configuration: JSON.parse( rows[i].configuration )
					};
				}
				return board;
			});
		});
	},
	/**
	 * Retrieve all boards available to a user (theirs and shared boards)
	 * @param number userId local id of the user
	 * @returns array of boards available to the user
	 */
	listBoards: function( userId ) {
		var connection = getConnection(),
			select = 'SELECT id, owner_id, display_name, description, is_shared FROM dash_board WHERE ( is_shared OR owner_id = ? )';

		return connection.query( select, [ userId ] ).then( function( dbResults ) {
			var rows = dbResults[0],
				count = rows.length,
				i,
				result = [];

			for ( i = 0; i < count; i++ ) {
				result[i] = {
					id: rows[i].id,
					ownerId: rows[i].owner_id,
					displayName: rows[i].display_name,
					description: rows[i].description,
					isShared: rows[i].is_shared === 1
				};
			}
			return result;
		});
	},
	/**
	 * Retrieve widget types with name, description, code, and preview
	 * @returns Promise that resolves with a list of all available widget types
	 */
	listWidgets: function() {
		var connection = getConnection();
		return connection.query( 'SELECT id, code, display_name, description, preview_path FROM dash_widget').then( function( dbResults ) {
			var rows = dbResults[0],
				count = rows.length,
				i,
				result = {};

			for ( i = 0; i < count; i++ ) {
				result[rows[i].code] = {
					id: rows[i].id,
					code: rows[i].code,
					displayName: rows[i].display_name,
					description: rows[i].description,
					previewPath: rows[i].preview_path
				};
			}
			return result;
		});
	}
};
