var syslog = require( 'node-syslog' );

syslog.init( 'dash', syslog.LOG_PID | syslog.LOG_ODELAY, syslog.LOG_LOCAL0 );

function log( level, message ) {
	syslog.log( level, message );
	if ( level === syslog.LOG_ERR ) {
		console.error( message );
	} else {
		console.log( message );
	}
}

module.exports = {
	error: function( message ) {
		log( syslog.LOG_ERR, message );
	},
	debug: function( message ) {
		log( syslog.LOG_DEBUG, message );
	},
	info: function( message ) {
		log( syslog.LOG_INFO, message );
	}
};
