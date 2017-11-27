var commonFilters	= require( './common-filters.js' ),
	config			= require( '../config.js' );

module.exports = {
	name: 'big-english',
	query: 'select count(*) as donations, sum(total_amount) as usd_total,\n IF( MAX(receive_date) > DATE_ADD( UTC_TIMESTAMP(), INTERVAL -1 * MINUTE(UTC_TIMESTAMP()) MINUTE), MINUTE(UTC_TIMESTAMP()), 60) as minutes, DAYOFYEAR(receive_date) as day, HOUR(receive_date) as hour from ' + config.civicrmDb + '.civicrm_contribution cc [[WHERE]] GROUP BY DAYOFYEAR(receive_date), HOUR(receive_date) ORDER BY day ASC, hour ASC;',
	mainTableAlias: 'cc',
	optionalJoins: {},
	filters: commonFilters.civicrmContribution,
	defaultFilter: {
		type: 'and',
		left: {
			type: 'eq',
			left: { type: 'property', name: 'Year' },
			right: { type: 'literal', value: '2017' }
		},
		right: {
			type: 'and',
			left: {
				type: 'eq',
				left: { type: 'property', name: 'Month' },
				right: { type: 'literal', value: '12' }
			},
			right: {
				type: 'lt',
				left: { type: 'property', name: 'Amount' },
				right: { type: 'literal', value: '5000' }
			}
		}
	}
};
