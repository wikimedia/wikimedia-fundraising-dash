var commander = require( 'commander' ),
    defaults  = require( './defaults.js' ),
	logger    = require( './logger.js' ),
    config;

commander
    .version( '0.0.1' )
    .option( '-c, --config <path>', 'Path to the local configuration file' )
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
} catch(err) {
    logger.error( 'Could not open configuration file ' + commander.config + '! ' + err );
    process.exit( 1 );
}

module.exports = config;