var hasSyslog = !!process.platform.match(/linux/),
	LOG_DEBUG = 0,
	LOG_INFO = 1,	
	LOG_ERR = 2,
	syslog,
	constMap = [];

if ( hasSyslog ) {
	syslog = require( 'node-syslog' );
	/*jslint bitwise: true*/
	syslog.init( 'dash', syslog.LOG_PID | syslog.LOG_ODELAY, syslog.LOG_LOCAL0 );
	/*jslint bitwise: false*/
	constMap[LOG_DEBUG] = syslog.LOG_DEBUG;
	constMap[LOG_INFO] = syslog.LOG_INFO;
	constMap[LOG_ERR] = syslog.LOG_ERR;
}

function log( level, message ) {
	if ( hasSyslog ) {
		syslog.log( constMap[level], message );
	}
	if ( level === LOG_ERR ) {
		console.error( message );
	} else {
		console.log( message );
	}
}

module.exports = {
	error: function( message ) {
		log( LOG_ERR, message );
	},
	debug: function( message ) {
		log( LOG_DEBUG, message );
	},
	info: function( message ) {
		log( LOG_INFO, message );
	}
};
