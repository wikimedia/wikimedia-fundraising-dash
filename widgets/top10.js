var extend = require( 'node.extend' ),
	commonFilters = require( './common-filters.js' ),
	config = require( '../config.js' ),
	filters = {};

extend( filters, commonFilters.paymentsInitial );
extend( filters, commonFilters.contributionTracking );
extend( filters, commonFilters.civicrmContribution );
delete( filters.Status );

module.exports = {
	name: 'top10',
	query: 'SELECT * FROM (SELECT YEAR(receive_date) AS year, MONTH(receive_date) AS month, DAY(receive_date) AS day, -1 AS hour, count(*) AS donations, SUM(total_amount) AS usd_total FROM ' + config.civicrmDb + '.civicrm_contribution cc [[JOINS]] [[WHERE]] GROUP BY YEAR(receive_date), MONTH(receive_date), DAY(receive_date) ORDER BY usd_total DESC LIMIT 10) AS top_days UNION (SELECT YEAR(receive_date) AS year, MONTH(receive_date) AS month, DAY(receive_date) AS day, HOUR(receive_date) AS hour, count(*) AS donations, SUM(total_amount) AS usd_total FROM ' + config.civicrmDb + '.civicrm_contribution cc [[JOINS]] [[WHERE]] GROUP BY YEAR(receive_date), MONTH(receive_date), DAY(receive_date), HOUR(receive_date) ORDER BY usd_total DESC LIMIT 10);',
	mainTableAlias: 'cc',
	optionalJoins: {
		ct: {
			text: 'LEFT JOIN drupal.contribution_tracking ct ON ct.contribution_id = cc.id'
		},
		pi: {
			text: 'LEFT JOIN payments_initial pi ON pi.contribution_tracking_id = ct.id',
			requires: [ 'ct' ]
		}
	},
	filters: filters,
	defaultFilter: {
		type: 'lt',
		left: { type: 'property', name: 'Amount' },
		right: { type: 'literal', value: '5000' }
	}
};
