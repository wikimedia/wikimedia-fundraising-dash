var express = require( 'express' ),
	app = express(),
	commander = require('commander'),
	server, serverConfig,
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
	console.err("Could not open configuration file %s! %s", commander.config, err);
	process.exit(1);
}

serverConfig = /(([0-9\.]*|\[[0-9a-fA-F\:]*\]):)?([0-9]+)/.exec(config.listen);
if (!serverConfig) {
	console.err("Server cannot listen on '%s', invalid format.", config.listen)
	process.exit(1);
}
server = app.listen( serverConfig[3], serverConfig[2], function() {
	console.log( 'listening on port %d', server.address().port );
});

