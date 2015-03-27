var extend			= require( 'node.extend' ),
	commonFilters	= require( './common-filters.js' ),
	filters			= {};

extend( filters, commonFilters.contributionTracking );
extend( filters, commonFilters.paymentsInitial );
extend( filters, commonFilters.paymentsFraud );

module.exports = {
	name: 'fraud',
	query: 'SELECT AVG(CASE pf.validation_action WHEN \'reject\' THEN 100 ELSE 0 END) AS fraud_percent\nFROM payments_fraud pf [[JOINS]] [[WHERE]]',
	mainTableAlias: 'pf',
	optionalJoins: {
		pi: {
			text: 'LEFT JOIN payments_initial pi ON pi.contribution_tracking_id = pf.contribution_tracking_id AND pi.order_id = pf.order_id'
		},
		ct: {
			text: 'LEFT JOIN drupal.contribution_tracking ct ON ct.id = pf.contribution_tracking_id'
		}
	},
	filters: filters
};
