var config = require( '../config.js' );

module.exports = {
	name: 'donation-age',
	query: 'SELECT UNIX_TIMESTAMP() - AVG(ts) AS age\n' +
		'FROM (\n' +
		'SELECT UNIX_TIMESTAMP(receive_date) AS ts\n' +
		'FROM ' + config.civicrmDb + '.civicrm_contribution\n' +
		'ORDER BY id DESC\n' +
		'LIMIT 10) AS civi_age\n' +
		'UNION\n' +
		'SELECT UNIX_TIMESTAMP() - AVG(ts) AS age\n' +
		'FROM (\n' +
		'SELECT UNIX_TIMESTAMP(date) AS ts\n' +
		'FROM ' + config.db + '.payments_initial\n' +
		'ORDER BY id DESC\n' +
		'LIMIT 10) AS pi_age;',
	mainTableAlias: 'cc',
	optionalJoins: {},
	filters: []
};
