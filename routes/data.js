var widgets = require( '../widgets' ),
	odataParser = require( 'odata-parser' ),
	mysql = require ( 'mysql'),
	config = require( '../config.js' ),
	util = require( 'util'),
	cache = require( 'memory-cache' ),
	urlParser = require( 'url' ),
	querystringParser = require( 'querystring' ),
	logger = require( '../logger.js' );

/**
 * Throws an error if an value is invalid for the given column
 *
 * @param {mixed} value
 * @param {object} column
 */
function validateValue( value, column ) {
	var valid = false,
		i;
	switch( column.type ) {
		case 'dropdown':
			for ( i = 0; i < column.values.length; i++ ) {
				if ( column.values[i] === value ) {
					valid = true;
					break;
				}
			}
			break;
		case 'number':
			valid = !isNaN( parseFloat( value ) ) && isFinite( value );
			break;
		case 'datetime':
			valid = value.match( /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/ );
			break;
		case 'text':
			//Trusting the value substitution to escape it all
			valid = true;
			break;
		default:
			valid = false;
	}
	if (
			( column.max !== undefined && value > column.max ) ||
			( column.min !== undefined && value < column.min )
	) {
		valid = false;
	}
	if ( !valid )	{
		throw new Error( 'Invalid value ' + value + ' for filter ' + column.display );
	}
}
/**
 * Adds to the list of join statements
 * @param {string} table alias required
 * @param {object} widget
 * @param {Array} joins
 */
function addJoin( table, widget, joins ) {
	var i;
	if ( table !== widget.mainTableAlias && joins.indexOf( table ) === -1 ) {
		if ( widget.optionalJoins[table].requires ) {
			for ( i = 0; i < widget.optionalJoins[table].requires.length; i++ ) {
				addJoin( widget.optionalJoins[table].requires[i], widget, joins );
			}
		}
		joins.push( table );
	}
}
/**
 * Gets a filter and adds it to joins if not yet present
 * Throws an error if the column does not exist
 *
 * @param {string} name - qs param for the filter
 * @param {object} widget
 * @param {Array} joins - list of table aliases to join
 * @returns {object} describing column
 */
function getColumn( name, widget, joins ) {
	var col = widget.filters[name];
	if ( !col ) {
		throw new Error( 'Illegal filter property ' + name );
	}
	addJoin( col.table, widget, joins );
	return col;
}

/**
 * Formats a column object for SQL
 * @param {object} column filter column object
 * @returns SQL representation of the given column for use in where or group clauses
 */
function getColumnText( column ) {
	var colText = column.table + '.' + column.column;
	if ( column.func ) {
		// If the function has a placeholder, use that. Otherwise just add parens.
		if ( column.func.match( /\[\[COL\]\]/ ) ) {
			colText = column.func.replace( '[[COL]]', colText );
		} else {
			colText = column.func + '(' + colText + ')';
		}
	}
	return colText;
}
/**
 * Create a SQL WHERE clause given a parsed filter node.
 * Uses '?' placeholders in clause, and appends literal values to values array
 * and required join table aliases to the joins array.
 *
 * @param {object} filterNode parsed from odata-parser
 * @param {object} widget
 * @param {Array} values list of values to use for placeholders
 * @param {Array} joins list of table aliases to join
 * @returns {string} WHERE clause with '?' placeholders for values
 */
function buildWhere( filterNode, widget, values, joins ) {
	var col, colText, op, rightClause, leftClause, val, i, pattern, partial, ops = {
		'and': 'AND',
		'or': 'OR',
		'eq': '=',
		'lt': '<',
		'le': '<=',
		'gt': '>',
		'ge': '>=',
		'ne': '!=',
		'functioncall': 'fn'
	}, patterns = {
		substringof: '%{1}%',
		startswith: '{1}%',
		endswith: '%{1}'
	};

	// Work around busted odata-parser nested condtion parsing
	if ( filterNode instanceof Array ) {
		console.log( 'filterNode is an array of length ' + filterNode.length );
		partial = '';
		for ( i = 0; i < filterNode.length; i++ ) {
			if ( filterNode[i].type ) {
				console.log( 'Found array component at index ' + i + ' with type ' + filterNode[i].type );
				partial = buildWhere( filterNode[i], widget, values, joins );
			}
			if ( filterNode[i] instanceof Array && filterNode[i].length > 3 ) {
				op = ops[filterNode[i][1]];
				if ( !op ) {
					throw new Error( 'Illegal filter type ' + filterNode.type );
				}
				rightClause = buildWhere( filterNode[i][3], widget, values, joins );
				partial = '(' + partial + ' ' + op + ' ' + rightClause + ')';
			}
		}
		return partial;
	}

	op = ops[filterNode.type];
	if ( !op ) {
		throw new Error( 'Illegal filter type ' + filterNode.type );
	}

	switch (op) {
		case 'AND':
		case 'OR':
			console.log( 'Building left clause' );
			leftClause = buildWhere( filterNode.left, widget, values, joins );
			console.log( 'Building right clause' );
			rightClause = buildWhere( filterNode.right, widget, values, joins );
			return '(' + leftClause + ' ' + op + ' ' + rightClause + ')';
		case '=':
		case '<':
		case '<=':
		case '>':
		case '>=':
		case '!=':
			console.log( 'Comparison with column ' + filterNode.left.name );
			if ( filterNode.left.type !== 'property' ) {
				throw new Error( 'Only property comparisons are currently allowed' );
			}
			col = getColumn( filterNode.left.name, widget, joins );

			val = filterNode.right.value;
			validateValue( val, col );
			if ( typeof val === 'string' && col.type === 'number' ) {
				val = parseFloat( val );
			}
			values.push( val ); //this may get more complex with nesting...

			colText = getColumnText( col );

			return colText + ' ' + op + ' ?';
		case 'fn':
			console.log( 'Function on column ' + filterNode.args[1].name );
			pattern = patterns[filterNode.func];
			if ( !pattern ) {
				throw new Error( 'Unsupported function ' + filterNode.func );
			}
			if ( filterNode.args.length < 2 ) {
				throw new Error( 'Not enough arguments' );
			}
			if ( filterNode.args[0].type !== 'literal' || filterNode.args[1].type !== 'property' ) {
				throw new Error( 'First argument to ' + filterNode.func + ' must be a literal ' +
						'and second must be a property.' );
			}

			col = getColumn( filterNode.args[1].name, widget, joins );
			if ( col.type !== 'text' ) {
				throw new Error( 'Can only call function ' + filterNode.func + ' on text properties' );
			}

			val = pattern.replace( '{1}', filterNode.args[0].value );
			validateValue( val, col );
			values.push( val );

			return col.table + '.' + col.column + ' RLIKE ?';
	}
	return '';
}

/**
 * Create a SQL string to show what the query looks like with parameter values
 * inserted at placeholders.
 * CAUTION: Only for display. Do not send the output of this function to the db!
 * @param {string} sqlQuery query text with '?' placeholders
 * @param {Array} values parameter values to insert
 * @returns string query formatted for display. DO NOT SEND TO DB!
 */
function substituteParams( sqlQuery, values) {
	var valueIndex = 0;
	while ( sqlQuery.indexOf( '?' ) > -1 ) {
		// Replace only the first ?
		sqlQuery = sqlQuery.replace( /\?/, '\'' + values[valueIndex] + '\'' );
		valueIndex++;
	}
	return sqlQuery;
}

module.exports = function(req, res) {
	var widget = widgets[req.params.widget],
		qs = urlParser.parse( req.url ).query,
		parsedQs = querystringParser.parse( qs ),
		connection,
		sqlQuery = '',
		parsedFilters,
		filter,
		whereClause = '',
		values = [],
		joins = [],
		joinClause = '',
		groupCol,
		groupClause = '',
		selectGroup = '',
		i,
		result,
		cacheKey;

	if ( !widget ) {
		res.json( { error: 'Error: ' + req.params.widget + ' is not a valid widget' } );
		return;
	}

	cacheKey = '/data/' + req.params.widget;
	if ( parsedQs.$filter ) {
		cacheKey += '-' + parsedQs.$filter;
	}

	if ( parsedQs.group ) {
		cacheKey += '-' + parsedQs.group;
	}

	// cache=false param on QS means they want fresh results now
	if ( !parsedQs.cache || parsedQs.cache === 'true' ) {
		result = cache.get( cacheKey );
		if ( result ) {
			logger.debug( 'Serving results from cache key ' + cacheKey );
			res.json( result );
			return;
		}
	}
	logger.debug( 'Group:' + util.inspect( parsedQs.group) );
	sqlQuery = widget.query;
	if ( widget.defaultGroup && !parsedQs.group ) {
		parsedQs.group = widget.defaultGroup;
	}

	if ( parsedQs.group ) {
		try{
			if ( !Array.isArray( parsedQs.group ) ) {
				parsedQs.group = [ parsedQs.group ];
			}
			groupClause = 'GROUP BY ';
			for ( i = 0; i < parsedQs.group.length; i++ ) {
				groupCol = getColumn( parsedQs.group[i], widget, joins );
				if ( !groupCol.canGroup ) {
					throw new Error( 'Can not group by ' + parsedQs.group[i] );
				}
				if ( i > 0 ) {
					groupClause += ', ';
				}
				groupClause += getColumnText( groupCol );
				// Assuming the [[SELECTGROUP]] comes after at least one other
				// selected property, so always prepending a comma
				selectGroup += ', ' + getColumnText( groupCol ) + ' AS ' + parsedQs.group[i];
			}
		}
		catch ( err ) {
			res.json( { error: err.message } );
			return;
		}
	}
	// remove params the odata parser can't handle
	delete parsedQs.cache;
	delete parsedQs.group;

	qs = querystringParser.stringify( parsedQs );

	if ( widget.defaultFilter || qs.length ) {
		try {
			if ( qs.length ) {
				parsedFilters = odataParser.parse( decodeURIComponent(qs) );
				filter = parsedFilters.$filter;
			}
			filter = filter || widget.defaultFilter;
			if ( filter ) {
				if ( config.debug ) {
					console.log( util.inspect( filter ) );
				}
				whereClause = 'WHERE ' + buildWhere( filter, widget, values, joins );
			}
		}
		catch ( err ) {
			res.json( { error: err.message } );
			return;
		}
	}
	sqlQuery = sqlQuery.replace( '[[WHERE]]', whereClause );
	for ( i = 0; i < joins.length; i++ ) {
		joinClause += widget.optionalJoins[joins[i]].text + ' ';
	}
	sqlQuery = sqlQuery.replace( '[[JOINS]]', joinClause );
	sqlQuery = sqlQuery.replace( '[[GROUP]]', groupClause );
	sqlQuery = sqlQuery.replace( '[[SELECTGROUP]]', selectGroup );

	connection = mysql.createConnection({
		host: config.dbserver,
		user: config.dblogin,
		password: config.dbpwd,
		database: config.db
	});
	connection.connect( function( error ) {
		if ( error ) {
			res.json( { error: 'Connection Error: ' + error } );
			return;
		}
	});
	logger.debug( 'Query: ' + sqlQuery );
	connection.query( sqlQuery, values, function( error, dbResults ) {
		if ( error ) {
			res.json( { error: 'Query error: ' + error } );
			return;
		}
		result = { results: dbResults, sqlQuery: substituteParams( sqlQuery, values), timestamp: new Date().getTime() };
		logger.debug( 'Storing results at cache key ' + cacheKey );
		cache.put( cacheKey, result, config.cacheDuration );
		res.json( result );
	});
};
