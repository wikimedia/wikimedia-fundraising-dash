var config = require( '../config.js' );

module.exports = {
	name: 'donation-age',
	query: 'select unix_timestamp() - avg(ts) as age from (select unix_timestamp(receive_date) as ts from ' + config.civicrmDb + '.civicrm_contribution cc order by id desc limit 10) as subselect;',
	mainTableAlias: 'cc',
	optionalJoins: {},
	filters: []
};
