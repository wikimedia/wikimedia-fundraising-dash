var widgets = require( '../widgets' ),
	odataParser = require( 'odata-parser' ),
	mysql = require ( 'mysql'),
	config = require( '../defaults.js' );

/**
 * Throws an error if an value is invalid for the given column
 *
 * @param {mixed} value
 * @param {Object} column
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
			valid = value.match( /^\d\d\d\d-(\d)?\d-(\d)?\d \d\d:\d\d:\d\d$/ );
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
		throw new Error( 'Invalid value ' + value + ' for filter ' + col.display );
	}
}

/**
 * Gets a filter and adds it to joins if not yet present
 * Throws an error if the column does not exist
 *
 * @param {String} name - qs param for the filter
 * @param {Object} widget
 * @param {Array} joins - list of table aliases to join
 * @returns {Object} describing column
 */
function getColumn( name, widget, joins ) {
	col = widget.filters[name];
	if ( !col ) {
		throw new Error( 'Illegal filter property ' + name );
	}
	if ( col.table !== widget.mainTableAlias && joins.indexOf( col.table ) === -1 ) {
		joins.push( col.table );
	}
	return col;
}

/**
 * Create a SQL WHERE clause given a parsed filter node.
 * Uses '?' placeholders in clause, and appends literal values to values array
 * and required join table aliases to the joins array.
 *
 * @param {Object} filterNode - parsed from odata-parser
 * @param {Object} widget
 * @param {Array} values - list of values to use for placeholders
 * @param {Array} joins - list of table aliases to join
 * @returns {String} WHERE clause with '?' placeholders for values
 */
function buildWhere( filterNode, widget, values, joins ) {
	var col, op, rightClause, leftClause, val, i, pattern, ops = {
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
		for ( i = 0; i < filterNode.length; i++ ) {
			if ( filterNode[i].type ) {
				filterNode = filterNode[i];
				break;
			}
		}
	}

	op = ops[filterNode.type];
	if ( !op ) {
		throw new Error( 'Illegal filter type ' + filterNode.type );
	}

	switch (op) {
		case 'AND':
		case 'OR':
			leftClause = buildWhere( filterNode.left, widget, values, joins );
			rightClause = buildWhere( filterNode.right, widget, values, joins );
			return '(' + leftClause + ' ' + op + ' ' + rightClause + ')';
		case '=':
		case '<':
		case '<=':
		case '>':
		case '>=':
		case '!=':
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

			return col.table + '.' + col.column + ' ' + op + ' ?';
		case 'fn':
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

module.exports = function(req, res) {
	var widget = widgets[req.params.widget],
		qs = require( 'url' ).parse(req.url).query,
		connection,
		sqlQuery = '',
		parsedFilters,
		whereClause = '',
		values = [],
		joins = [],
		joinClause = '',
		i;

	if ( !req.session || !req.session.passport || !req.session.passport.user ) {
		res.json( 'Error: Not logged in' );
		return;
	}

	if ( !widget ) {
		res.json( { error: 'Error: ' + req.params.widget + ' is not a valid widget' } );
		return;
	}

	sqlQuery = widget.query;
	if ( qs && qs !== '' ) {
		try {
			parsedFilters = odataParser.parse( unescape(qs) );
			if ( parsedFilters.$filter ) {
				whereClause = 'WHERE ' + buildWhere( parsedFilters.$filter, widget, values, joins );
			}
		}
		catch ( err ) {
			res.json( { error: err.message } );
			return;
		}
	}
	sqlQuery = sqlQuery.replace( '[[WHERE]]', whereClause );
	for ( i = 0; i < joins.length; i++ ) {
		joinClause += widget.optionalJoins[joins[i]] + ' ';
	}
	sqlQuery = sqlQuery.replace( '[[JOINS]]', joinClause );

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
	connection.query( sqlQuery, values, function( error, results ) {
		if ( error ) {
			res.json( { error: 'Query error: ' + error } );
			return;
		}
		res.json( results );
	});
};
