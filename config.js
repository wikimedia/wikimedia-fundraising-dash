var commander = require( 'commander' ),
    defaults  = require( './defaults.js' ),
    logger    = require( './logger.js' ),
    prop,
    config;

commander
    .version( '0.0.1' )
    .option( '-c, --config <path>', 'Path to the local configuration file' )
    .option( '-d, --debug', 'Run unminified code and skip auth check')
    .parse( process.argv );
	
try {
    if ( commander.config ) {
        config = require( commander.config );
		for ( prop in defaults ) {
			if ( defaults.hasOwnProperty( prop ) && !config.hasOwnProperty( prop ) ) {
				config[prop] = defaults[prop];
			}
		}
    } else {
		config = defaults;
	}
	config.debug = commander.debug;
} catch(err) {
    logger.error( 'Could not open configuration file ' + commander.config + '! ' + err );
    process.exit( 1 );
}

module.exports = config;