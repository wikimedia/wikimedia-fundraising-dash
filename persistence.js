var config = require( './config.js' ),
	promiseDbLib = require( 'mysql-promise' );

function getConnection() {
	var promiseDb = promiseDbLib();
	promiseDb.configure({
		host: config.userDbServer,
		user: config.userDbLogin,
		password: config.userDbPwd,
		database: config.userDb,
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
			getInfo = 'SELECT id, default_board, avatar, title, email from dash_user where oauth_id = ? and oauth_provider = ?',
			insertBoard = 'INSERT INTO dash_board ( display_name, description, owner_id ) VALUES ( ?, \'\', ? );' +
				'UPDATE dash_user SET default_board = LAST_INSERT_ID() WHERE id = ?;' +
				'SELECT LAST_INSERT_ID() AS id',
			insertBigEnglish = 'SET @uid = ?;\n' +
				'INSERT INTO dash_board ( display_name, description, owner_id ) VALUES ( \'Big English\', \'\', @uid );\n' +
				'SET @beboard = LAST_INSERT_ID();\n' +
				'INSERT INTO dash_widget_instance ( widget_id, owner_id, display_name, description )\n' +
				'SELECT id, @uid, display_name, description FROM dash_widget WHERE code IN ( \'totals-earned-chart\', \'distance-to-goal-chart\', \'amt-per-second-chart\' );\n' +
				'INSERT INTO dash_widget_instance_board ( instance_id, board_id, widget_position )\n' +
				'SELECT dwi.id, @beboard, 1 FROM dash_widget_instance dwi JOIN dash_widget dw ON dwi.widget_id = dw.id WHERE owner_id = @uid AND code = \'totals-earned-chart\';\n' +
				'INSERT INTO dash_widget_instance_board ( instance_id, board_id, widget_position )\n' +
				'SELECT dwi.id, @beboard, 2 FROM dash_widget_instance dwi JOIN dash_widget dw ON dwi.widget_id = dw.id WHERE owner_id = @uid AND code = \'distance-to-goal-chart\';\n' +
				'INSERT INTO dash_widget_instance_board ( instance_id, board_id, widget_position )\n' +
				'SELECT dwi.id, @beboard, 3 FROM dash_widget_instance dwi JOIN dash_widget dw ON dwi.widget_id = dw.id WHERE owner_id = @uid AND code = \'amt-per-second-chart\';',
			connection = getConnection(),
			defaultBoard,
			userId;

		return connection.query( insertUser, params )
		.then( function() {
			return connection.query( getInfo, params );
		} )
		.then( function( dbResults ) {
			var avatar 			= dbResults[0][0].avatar,
				title 			= dbResults[0][0].title,
				email 			= dbResults[0][0].email;

			userId = dbResults[0][0].id;
			defaultBoard = dbResults[0][0].default_board;
			user.localId = userId;
			user.avatar = avatar;
			user.title = title;
			user.email = email;
			if ( defaultBoard ) {
				user.defaultBoard = defaultBoard;
				return;
			}
			// If user doesn't have a default board, insert one now
			var username = user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1);
			return connection.query( insertBoard, [ username + '\'s Board', userId, userId ] );
		} )
		.then( function( dbResults ) {
			if ( !dbResults ) {
				return;
			}
			user.defaultBoard = dbResults[0][2][0].id;
			return connection.query( insertBigEnglish, [ userId ] );
		} );
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
			return connection.query( update, updateParams )
			.then( function( dbResults ) {
				if ( dbResults[0].affectedRows !== 1 ) {
					// Either the instance doesn't exist or it's not ours
					throw new Error('Instance ' + instance.id  + ' with owner ' + instance.ownerId + ' not found' );
				}
			} );
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
			select = 'SELECT wi.widget_id, w.code, wi.owner_id, wi.display_name, wi.description, wi.is_shared, wi.configuration FROM dash_widget_instance wi INNER JOIN dash_widget w ON w.id = wi.widget_id WHERE wi.id = ? AND ( wi.is_shared OR wi.owner_id = ? )';

		return connection.query( select, [ instanceId, userId ] )
		.then( function( dbResults ) {
			var result = dbResults[0][0];
			if ( result.owner_id ) {
				return {
					id: instanceId,
					widgetId: result.widget_id,
					widgetCode: result.code,
					ownerId: result.owner_id,
					displayName: result.display_name,
					description: result.description,
					isShared: result.is_shared === 1,
					configuration: JSON.parse( result.configuration )
				};
			} else {
				throw new Error( 'Instance ' + instanceId  + ' for user ' + userId + ' not found' );
			}
		} );
	},
	/**
	 * List all widget instances available to a user
	 * @param number userId local ID of user
	 * @returns Promise that resolves with a JSON representation of all
	 * widget instances owned by or shared with the user, or rejects with error
	 */
	listWidgetInstances: function( userId ) {
		var connection = getConnection(),
			select = 'SELECT wi.id, wi.widget_id, w.code, wi.owner_id, wi.display_name, wi.description, wi.is_shared, wi.configuration, w.preview_path FROM dash_widget_instance wi INNER JOIN dash_widget w on w.id = wi.widget_id WHERE wi.is_shared OR wi.owner_id = ?';

		return connection.query( select, [ userId ] )
		.then( function( dbResults ) {
			var rows = dbResults[0],
				count = rows.length,
				i,
				result = [];

			for ( i = 0; i < count; i++ ) {
				result[i] = {
					id: rows[i].id,
					widgetId: rows[i].widget_id,
					widgetCode: rows[i].code,
					ownerId: rows[i].owner_id,
					displayName: rows[i].display_name,
					description: rows[i].description,
					isShared: rows[i].is_shared === 1,
					configuration: JSON.parse( rows[i].configuration ),
					previewPath: rows[i].preview_path
				};
			}
			return result;
		} );
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
			addWidget = 'INSERT INTO dash_widget_instance_board ( instance_id, board_id, widget_position ) SELECT ?, b.id, COALESCE( MAX( widget_position ), 0 ) + 1 FROM dash_board b LEFT JOIN dash_widget_instance_board i ON b.id = i.board_id WHERE b.id = ? AND b.owner_id = ?',
			addWidgetParams = [ board.addWidget, board.id, board.ownerId ],
			deleteWidget = 'DELETE FROM dash_widget_instance_board WHERE instance_id = ? AND board_id = ? AND EXISTS( SELECT 1 FROM dash_board WHERE id = ? AND owner_id = ? )',
			deleteWidgetParams = [ board.deleteWidget, board.id, board.id, board.ownerId ],
			insertParams = [ board.ownerId, board.displayName, board.description, board.isShared ? 1 : 0 ],
			update = 'UPDATE dash_board set display_name = ?, description = ?, is_shared = ? WHERE id = ? AND owner_id = ?',
			updateParams = [ board.displayName, board.description, board.isShared ? 1 : 0, board.id, board.ownerId ],
			deleteWidgets = 'DELETE FROM dash_widget_instance_board WHERE board_id = ?';

		if ( board.id ) {
			if ( board.addWidget ) {
				return connection.query( addWidget, addWidgetParams );
			}
			if ( board.deleteWidget ) {
				return connection.query( deleteWidget, deleteWidgetParams );
			}
			return connection.query( update, updateParams )
			.then( function( dbResults ) {
				if ( dbResults[0].affectedRows !== 1 ) {
					// Either the board doesn't exist or it's not ours
					throw new Error( 'Board ' + board.id  + ' with owner ' + board.ownerId + ' not found' );
				}
			} )
			.then( function() {
				return connection.query( deleteWidgets, [ board.id ] );
			} )
			.then( function() {
				return insertWidgetList( board, connection );
			} );
		}
		return connection.query( insert, insertParams )
			.then( function( dbResults ) {
				board.id = dbResults[0].insertId;
			} )
			.then( function() {
				return insertWidgetList( board, connection );
			} );
	},
	/**
	 * @param number boardId ID of board to fetch
	 * @param number userId local ID of user
	 * @returns Promise that resolves with a JSON representation of all
	 * board widgets or rejects with error
	 */
	getBoard: function( boardId, userId ) {
		var board,
			connection = getConnection(),
			select = 'SELECT owner_id, display_name, description, is_shared FROM dash_board WHERE id = ? AND ( is_shared OR owner_id = ? )';

		return connection.query( select, [ boardId, userId ] )
		.then( function( dbResults ) {
			var result = dbResults[0][0],
				widgetSelect = 'SELECT wi.id, wi.widget_id, w.code, wi.owner_id, wi.display_name, wi.description, wi.is_shared, wi.configuration FROM dash_widget_instance wi INNER JOIN dash_widget w on w.id = wi.widget_id INNER JOIN dash_widget_instance_board wib ON wi.id = wib.instance_id WHERE wib.board_id = ? ORDER BY wib.widget_position';

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
			return connection.query( widgetSelect, [ boardId ] );
		} )
		.then( function( dbResults ) {
			var rows = dbResults[0],
				count = rows.length,
				i;

			for ( i = 0; i < count; i++ ) {
				board.widgets[i] = {
					id: rows[i].id,
					widgetId: rows[i].widget_id,
					widgetCode: rows[i].code,
					ownerId: rows[i].owner_id,
					displayName: rows[i].display_name,
					description: rows[i].description,
					isShared: rows[i].is_shared === 1,
					configuration: JSON.parse( rows[i].configuration )
				};
			}
			return board;
		} );
	},
	/**
	 * Retrieve all boards available to a user (theirs and shared boards)
	 * @param number userId local id of the user
	 * @returns array of boards available to the user
	 */
	listBoards: function( userId ) {
		var connection = getConnection(),
			select = 'SELECT id, owner_id, display_name, description, is_shared FROM dash_board WHERE ( is_shared OR owner_id = ? )';

		return connection.query( select, [ userId ] )
		.then( function( dbResults ) {
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
		return connection.query( 'SELECT id, code, display_name, description, preview_path FROM dash_widget')
		.then( function( dbResults ) {
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
