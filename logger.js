var hasSyslog = true,
	LOG_DEBUG = 0,
	LOG_INFO = 1,
	LOG_ERR = 2,
	syslog,
	constMap = [];

// FIXME: remove the old one when we upgrade the dash host
try {
	syslog = require( 'node-syslog' );
} catch ( ex1 ) {
	try {
		syslog = require( 'modern-syslog' );
	} catch ( ex2 ) {
		hasSyslog = false;
	}
}

if ( hasSyslog ) {
	// eslint-disable-next-line no-bitwise
	syslog.init( 'dash', syslog.LOG_PID | syslog.LOG_ODELAY, syslog.LOG_LOCAL0 );
	constMap[ LOG_DEBUG ] = syslog.LOG_DEBUG;
	constMap[ LOG_INFO ] = syslog.LOG_INFO;
	constMap[ LOG_ERR ] = syslog.LOG_ERR;
}

function log( level, message ) {
	/* eslint-disable no-console */
	if ( hasSyslog ) {
		syslog.log( constMap[ level ], message );
	}
	if ( level === LOG_ERR ) {
		console.error( message );
	} else {
		console.log( message );
	}
	/* eslint-enable no-console */
}

module.exports = {
	error: function ( message ) {
		log( LOG_ERR, message );
	},
	debug: function ( message ) {
		log( LOG_DEBUG, message );
	},
	info: function ( message ) {
		log( LOG_INFO, message );
	}
};
