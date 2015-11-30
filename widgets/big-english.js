var commonFilters	= require( './common-filters.js' ),
	config			= require( '../config.js' );

module.exports = {
	name: 'big-english',
	query: 'select count(*) as donations, sum(total_amount) as usd_total,\n IF( day(receive_date) = day(utc_timestamp()) and hour(receive_date) = hour(utc_timestamp()), CEILING(TIMESTAMPDIFF(SECOND, MIN(receive_date), MAX(receive_date))/60), 60) as minutes, sum(total_amount)/IF( day(receive_date) = day(utc_timestamp()) and hour(receive_date) = hour(utc_timestamp()), CEILING(TIMESTAMPDIFF(SECOND, MIN(receive_date), MAX(receive_date))/60), 60)/60 as usd_per_second, DAY(receive_date) as day, HOUR(receive_date) as hour from ' + config.civicrmDb + '.civicrm_contribution cc [[WHERE]] GROUP BY DAY(receive_date), HOUR(receive_date) ORDER BY day ASC, hour ASC;',
	mainTableAlias: 'cc',
	optionalJoins: {},
	filters: commonFilters.civicrmContribution,
	defaultFilter: {
		type: 'and',
		left: {
			type: 'eq',
			left: { type: 'property', name: 'Year' },
			right: { type: 'literal', value: '2015' }
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
