/*
 * Use these to extend() your widget's filters.  Note that some filters are
 * defined for multiple tables.  Extend with the filter set of your primary
 * table last to make sure you get the correct version.
 */

module.exports = {
	civicrmContribution: {
		DT: {
			table: 'cc',
			column : 'receive_date',
			display: 'Date',
			type: 'datetime',
			//TODO: dynamic min/max
			min: '2005-01-01',
			max: '2099-12-31'
		},
		Year: {
			table: 'cc',
			func: 'YEAR',
			column: 'receive_date',
			display: 'Year',
			type: 'number',
			canGroup: true
		},
		Month: {
			table: 'cc',
			func: 'MONTH',
			column: 'receive_date',
			display: 'Month',
			type: 'number',
			canGroup: true
		},
		Day: {
			table: 'cc',
			func: 'DAY',
			column: 'receive_date',
			display: 'Year',
			type: 'number',
			canGroup: true
		},
		Hour: {
			table: 'cc',
			func: 'HOUR',
			column: 'receive_date',
			display: 'Hour',
			type: 'number',
			canGroup: true
		},
		YearsAgo: {
			table: 'cc',
			column : 'receive_date',
			func: 'timestampdiff(YEAR, [[COL]], utc_timestamp())',
			display: 'Years ago',
			type: 'number',
			min: 0,
			max: 12
		},
		MonthsAgo: {
			table: 'cc',
			column : 'receive_date',
			func: 'timestampdiff(MONTH, [[COL]], utc_timestamp())',
			display: 'Months ago',
			type: 'number',
			min: 0,
			max: 10000
		},
		DaysAgo: {
			table: 'cc',
			column : 'receive_date',
			func: 'timestampdiff(DAY, [[COL]], utc_timestamp())',
			display: 'Days ago',
			type: 'number',
			min: 0,
			max: 10000
		},
		Amount: {
			table: 'cc',
			column : 'total_amount',
			display : 'Amount',
			type : 'number',
			min : 0,
			max : 10000
		},
		Country: {
			table: 'pi',
			column: 'country',
			display: 'Country',
			type: 'dropdown',
			values: [ 'AE', 'AF', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AW', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BG', 'BH', 'BJ', 'BM', 'BN', 'BO', 'BR', 'BS', 'CA', 'CH', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ES', 'FR', 'GB', 'GE', 'GH', 'GR', 'GT', 'GU', 'HK', 'HN', 'HR', 'HU', 'IE', 'IL', 'IM', 'IN', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LI', 'LK', 'LR', 'LT', 'LU', 'LV', 'MA', 'ME', 'MG', 'MK', 'MN', 'MR', 'MT', 'MX', 'MY', 'MZ', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NZ', 'OM', 'PA', 'PE', 'PH', 'PK', 'PL', 'PR', 'PS', 'PT', 'QA', 'RO', 'RS', 'SC', 'SE', 'SG', 'SI', 'SV', 'TH', 'TN', 'TW', 'TZ', 'UA', 'US', 'UY', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'XX', 'ZA', 'ZM' ],
			canGroup: true
		},
		Action: {
			table: 'pf',
			column: 'validation_action',
			func: 'COALESCE([[COL]], \'no action\')',
			display: 'Validation Action',
			type: 'dropdown',
			values: [ 'process', 'reject' ],
			canGroup: true
		},
		Status: {
			table: 'cc',
			column: 'contribution_status_id',
			display: 'Contribution Status',
			type: 'dropdown',
			values: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
			labels: [ 'Completed', 'Pending', 'Cancelled', 'Failed', 'In Progress', 'Overdue', 'Settled', 'Paid', 'Refunded' ],
			canGroup: true
		}
	},
	contributionTracking: {
		Source: {
			table: 'ct',
			column: 'utm_source',
			display: 'Source',
			type: 'text',
			canGroup: true
		},
		Campaign: {
			table: 'ct',
			column: 'utm_campaign',
			display: 'Campaign',
			type: 'text',
			canGroup: true
		},
		Medium: {
			table: 'ct',
			column: 'utm_medium',
			display: 'Medium',
			type: 'dropdown',
			values: [ 'sitenotice', 'sidebar', 'email', 'civicrm', 'spontaneous', 'wmfWikiLink', 'WikipediaApp', 'wmfWikiRedirect', 'SocialMedia', 'WaysToGive', 'event' ],
			canGroup: true
		},
		Referrer: {
			table: 'ct',
			column : 'referrer',
			display : 'Referrer',
			type : 'text'
		}
	},
	paymentsInitial: {
		Currency: {
			table: 'pi',
			column : 'currency_code',
			display : 'Currency',
			type : 'dropdown',
			//TODO: get values dynamically
			values : [ 'AED', 'ARS', 'AUD', 'BBD', 'BDT', 'BGN', 'BHD', 'BMD', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CZK', 'DKK', 'DOP', 'DZD', 'EGP', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JMD', 'JOD', 'JPY', 'KES', 'KRW', 'KZT', 'LKR', 'LTL', 'MAD', 'MKD', 'MXN', 'MYR', 'NIO', 'NOK', 'NZD', 'OMR', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TTD', 'TWD', 'UAH', 'USD', 'UYU', 'VEF', 'XCD', 'ZAR' ],
			canGroup: true
		},
		Method: {
			table: 'pi',
			column: 'payment_method',
			display: 'Method',
			type: 'dropdown',
			values: [ 'amazon', 'bt', 'cc', 'dd', 'ew', 'paypal', 'obt', 'rtbt' ],
			canGroup: true
		},
		Gateway: {
			table: 'pi',
			column: 'gateway',
			display: 'Gateway',
			type: 'dropdown',
			values: [ 'adyen', 'amazon', 'astropay', 'globalcollect', 'paypal', 'worldpay' ],
			canGroup: true
		},
		Amount: {
			table: 'pi',
			column : 'amount',
			display : 'Amount',
			type : 'number',
			min : 0,
			max : 10000
		}
	},
	paymentsFraud: {
		DT: {
			table: 'pf',
			column : 'date',
			display: 'Date',
			type: 'datetime',
			//TODO: dynamic min/max
			min: '2005-01-01',
			max: '2099-12-31'
		},
		Year: {
			table: 'pf',
			func: 'YEAR',
			column: 'date',
			display: 'Year',
			type: 'number',
			canGroup: true
		},
		Month: {
			table: 'pf',
			func: 'MONTH',
			column: 'date',
			display: 'Month',
			type: 'number',
			canGroup: true
		},
		Day: {
			table: 'pf',
			func: 'DAY',
			column: 'date',
			display: 'Year',
			type: 'number',
			canGroup: true
		},
		Hour: {
			table: 'pf',
			func: 'HOUR',
			column: 'date',
			display: 'Hour',
			type: 'number',
			canGroup: true
		},
		YearsAgo: {
			table: 'pf',
			column : 'date',
			func: 'timestampdiff(YEAR, [[COL]], utc_timestamp())',
			display: 'Years ago',
			type: 'number',
			min: 0,
			max: 12
		},
		MonthsAgo: {
			table: 'pf',
			column : 'date',
			func: 'timestampdiff(MONTH, [[COL]], utc_timestamp())',
			display: 'Months ago',
			type: 'number',
			min: 0,
			max: 10000
		},
		DaysAgo: {
			table: 'pf',
			column : 'date',
			func: 'timestampdiff(DAY, [[COL]], utc_timestamp())',
			display: 'Days ago',
			type: 'number',
			min: 0,
			max: 10000
		},
		Method: {
			table: 'pf',
			column: 'payment_method',
			display: 'Method',
			type: 'dropdown',
			values: [ 'cc', 'bt' ]
		},
		Gateway: {
			table: 'pf',
			column: 'gateway',
			display: 'Gateway',
			type: 'dropdown',
			values: [ 'adyen', 'astropay', 'globalcollect', 'worldpay' ]
		},
		Score: {
			table: 'pf',
			column: 'risk_score',
			display: 'Score',
			type: 'number'
		}
	}
};
