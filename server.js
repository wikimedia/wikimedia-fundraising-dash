require('rconsole');

var express		= require( 'express' ),
	app			= express(),
	commander	= require( 'commander' ),
	config 		= require( './defaults.js' ),
	server,
	serverConfig;

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
	console.err("Server cannot listen on '%s', invalid format.", config.listen);
	process.exit(1);
}

app.configure(function(){
  app.set( 'views', __dirname + '/public/views/templates' );
  app.set( 'view engine', 'jade' );
  app.set( 'view options', { pretty: true } );
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.static(__dirname + '/public') );
});

app.get('/', function( req, res ){
	res.render('index');
});

app.get('/admin', function( req, res ){
	res.render('admin');
});

app.get('/tests', function( req, res){
	res.render('tests');
});

var port = config.port;

server = app.listen( serverConfig[3], serverConfig[2], function() {
	console.log( 'listening on port %d', server.address().port );
});
