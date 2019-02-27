var extend = require( 'node.extend' ),
	commonFilters = require( './common-filters.js' ),
	config = require( '../config.js' ),
	filters = {};

extend( filters, commonFilters.paymentsFraud );
extend( filters, commonFilters.paymentsInitial );
extend( filters, commonFilters.contributionTracking );
extend( filters, commonFilters.civicrmContribution );

module.exports = {
	name: 'x-by-y',
	query: 'select count(*) as donations, sum(total_amount) as usd_total [[SELECTGROUP]] from ' + config.civicrmDb + '.civicrm_contribution cc INNER JOIN ' + config.civicrmDb + '.civicrm_financial_type ft ON ft.id = cc.financial_type_id AND ft.name <> \'Endowment Gift\' [[JOINS]] [[WHERE]] [[GROUP]];',
	mainTableAlias: 'cc',
	optionalJoins: {
		ct: {
			text: 'LEFT JOIN drupal.contribution_tracking ct ON ct.contribution_id = cc.id'
		},
		pi: {
			text: 'LEFT JOIN payments_initial pi ON pi.contribution_tracking_id = ct.id',
			requires: [ 'ct' ]
		},
		pf: {
			text: 'LEFT JOIN payments_fraud pf ON pf.contribution_tracking_id = ct.id AND pf.order_id = pi.order_id',
			requires: [ 'ct', 'pi' ]
		}
	},
	filters: filters
};
