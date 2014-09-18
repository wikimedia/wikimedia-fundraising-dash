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
			values : [ 'AED', 'ARS', 'AUD', 'BBD', 'BDT', 'BGN', 'BHD', 'BMD', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CZK', 'DKK', 'DOP', 'DZD', 'EGP', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JMD', 'JOD', 'JPY', 'KES', 'KRW', 'KZT', 'LKR', 'LTL', 'MAD', 'MKD', 'MXN', 'MYR', 'NIO', 'NOK', 'NZD', 'OMR', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TTD', 'TWD', 'UAH', 'USD', 'UYU', 'VEF', 'XCD', 'ZAR' ]
		},
		met: {
			table: 'pf',
			coulmn: 'payment_method',
			display: 'Method',
			type: 'dropdown',
			values: [ 'cc', 'paypal', 'rtbt', 'amazon', 'dd', 'ew', 'obt', 'bt']
		},
		src: {
			table: 'ct',
			column: 'utm_source',
			display: 'Source',
			type: 'text'
		},
		cmp: {
			table: 'ct',
			column: 'utm_campaign',
			display: 'Campaign',
			type: 'text'
		},
		med: {
			table: 'ct',
			column: 'utm_medium',
			display: 'Medium',
			type: 'dropdown',
			values: [ 'sitenotice', 'sidebar', 'email', 'spontaneous', 'wmfWikiRedirect', 'SocialMedia', 'WaysToGive', 'event', 'externalbanner', 'outage' ]
		},
		ref: {
			table: 'ct',
			column : 'referrer',
			display : 'Referrer',
			type : 'text'
		},
		gw: {
			table: 'pf',
			column: 'gateway',
			display: 'Gateway',
			type: 'dropdown',
			values: [ 'globalcollect', 'worldpay' ]
		},
		fs: {
			table: 'pf',
			column: 'risk_score',
			display: 'Fraud Score',
			type: 'number'
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