var extend = require( 'node.extend' ),
	commonFilters = require( './common-filters.js' ),
	config = require( '../config.js' ),
	filters = commonFilters.civicrmContribution;

extend( filters, commonFilters.financialType );

module.exports = {
	name: 'totals-earned-chart',
	query: 'select count(*) as donations, sum(total_amount) as usd_total,\n IF( MAX(receive_date) > DATE_ADD( UTC_TIMESTAMP(), INTERVAL -1 * MINUTE(UTC_TIMESTAMP()) MINUTE), MINUTE(UTC_TIMESTAMP()), 60) as minutes, DAYOFYEAR(receive_date) as day, HOUR(receive_date) as hour from ' + config.civicrmDb + '.civicrm_contribution cc [[JOINS]] [[WHERE]] GROUP BY DAYOFYEAR(receive_date), HOUR(receive_date) ORDER BY day ASC, hour ASC;',
	mainTableAlias: 'cc',
	optionalJoins: {
		ft: {
			text: 'LEFT JOIN ' + config.civicrmDb + '.civicrm_financial_type ft ON ft.id = cc.financial_type_id'
		}
	},
	filters: filters,
	defaultFilter: {
		type: 'and',
		left: {
			type: 'and',
			left: {
				type: 'eq',
				left: { type: 'property', name: 'Year' },
				right: { type: 'literal', value: '2019' }
			},
			right: {
				type: 'eq',
				left: { type: 'property', name: 'IsEndowment' },
				right: { type: 'literal', value: '0' }
			}
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
