var express = require( 'express' ),
	app = express(),
	commander = require('commander'),
	server,
	config = require('./defaults.js');

require('rconsole');

app.get( '/', function( req, res ){
  res.send( "Fundraising Dashboard Y'all" );
});

commander
	.version('0.0.1')
	.option('-c, --config <path>', 'Path to the local configuration file')
	.parse(process.argv);

try {
	if (commander.config) {
		config = require(commander.config)(config);
	}
} catch(err) {
	console.log("Could not open configuration file %s! %s", commander.config, err);
}

server = app.listen( config.port, function() {
	console.log( 'listening on port %d', server.address().port );
});

//require commander, rconsole