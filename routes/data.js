var widgets = require( '../widgets' ),
	odataParser = require( 'odata-parser' ),
	mysql = require ( 'mysql'),
	config = require( '../defaults.js' );

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
		//TODO: min/max
		case 'number':
			valid = !isNaN( parseFloat( value ) ) && isFinite( value );
			break;
		case 'datetime':
			valid = value.match( /^\d\d\d\d-(\d)?\d-(\d)?\d \d\d:\d\d:\d\d$/ );
			break;	
		//TODO: text filters
		default:
			valid = false;
	}
	return valid;
}

function buildWhere( filterNode, widget, values, joins ) {
	var col, op, rightClause, leftClause, ops = {
		'and': 'AND',
		'or': 'OR',
		'eq': '=',
		'lt': '<',
		'gt': '>'
	};
	var op = ops[filterNode.type];
	if ( !op ) {
		throw new Exception( 'Illegal filter type ' + filterNode.type );
	}
	switch (op) {
		case 'AND':
		case 'OR':
			leftClause = buildWhere( filterNode.left, widget, values, joins );
			rightClause = buildWhere( filterNode.right, widget, values, joins );
			return '(' + leftClause + ' ' + op + ' ' + rightClause + ')';
		case '=':
		case '<':
		case '>':
			if ( filterNode.left.type !== 'property' ) {
				throw ( 'Only property comparisons are currently allowed' );
			}
			col = widget.filters[filterNode.left.name];
			if ( !col ) {
				throw ( 'Illegal filter property ' + filterNode.left.name );
			}
			if ( !validateValue( filterNode.right.value, col ) ) {
				throw ( 'Invalid value ' + filterNode.right.value + ' for filter type ' + col.type );
			}
			if ( col.table !== widget.mainTableAlias && joins.indexOf( col.table ) === -1 ) {
				joins.push( col.table );
			}
			values.push( filterNode.right.value ); //this may get more complex with nesting...
			return col.table + '.' + col.column + ' ' + op + ' ?';
			break;
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

	if ( !widget ) {
		res.json( 'Error: ' + req.params.widget + ' is not a valid widget' );
		return;
	}

	sqlQuery = widget.query;
	if ( qs && qs !== '' ) {
		parsedFilters = odataParser.parse( unescape(qs) );
		if ( parsedFilters.$filter ) {
			whereClause = 'WHERE ' + buildWhere( parsedFilters.$filter, widget, values, joins );
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
			throw( 'Connection Error: ' + error );
		}
	});
	connection.query( sqlQuery, values, function( error, results ) {
		if ( error ) {
			res.json( 'Query error: ' + error);
		}
		res.json( results );
	});
};
