module.exports = {
	name: 'fraud',
	query: "SELECT AVG(CASE pf.validation_action WHEN 'reject' THEN 100 ELSE 0 END) AS fraud_percent\n\
FROM payments_fraud pf [[JOINS]] [[WHERE]]",
	mainTableAlias: 'pf',
	optionalJoins: {
		pi: 'LEFT JOIN payments_initial pi ON pi.contribution_tracking_id = pf.contribution_tracking_id',
		ct: 'LEFT JOIN drupal.contribution_tracking ct ON ct.id = pf.contribution_tracking_id'
	},
	filters: {
		cur: {
			table: 'pi',
			column : 'currency_code',
			display : 'Currency',
			type : 'dropdown',
			//TODO: get values dynamically
			values : [ 'USD', 'EUR', 'JPY' ]
		},
		ref: {
			table: 'ct',
			column : 'referrer',
			display : 'Referrer',
			type : 'text'
		},
		dt: {
			table: 'pf',
			column : 'date',
			display: 'Date',
			type: 'datetime',
			//TODO: dynamic min/max
			min: '2005-01-01',
			max: '2099-12-31'
		},
		amt: {
			table: 'pi',
			column : 'amount',
			display : 'Amount',
			type : 'number',
			min : 0,
			max : 10000
		}
	}
};