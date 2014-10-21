var express           = require( 'express' ),
    app               = express(),
    commander         = require( 'commander' ),
    config            = require( './defaults.js' ),
    port              = config.port,
    routes            = require( './routes'),
    passport          = require( 'passport' ),
    DrupalStrategy    = require( 'passport-drupal' ).DrupalStrategy,
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

app.use( express.session( { secret: config.sessionSecret } ) );

// Authentication
passport.use( new DrupalStrategy( {
		consumerKey: config.consumerKey,
		consumerSecret: config.consumerSecret,
		providerURL: config.providerURL,
		providerBackendURL: config.providerBackendURL
	},
	function(token, tokenSecret, profile, done) {
		profile.oauth = { token: token, token_secret: tokenSecret };
		done( null, profile );
	}
) );

passport.serializeUser( function( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function( user, done ) {
	done( null, user );
} );

app.use( passport.initialize() );
app.use( passport.session() );

app.set( 'views', __dirname + '/src/components' );
app.set( 'view options', { pretty: true } );

app.get( '/data/:widget', routes.data );
app.get( '/metadata/:widget', routes.metadata );
app.get( '/user/info', routes.user );

app.use( express.static(__dirname + '/dist' ) );

app.get( '/auth/drupal', passport.authenticate( 'drupal' ));
app.get( '/auth/drupal/callback',
	passport.authenticate( 'drupal', { failureRedirect: '/login' }),
	function( req, res ) {
		res.redirect( '/' );
	});


server = app.listen(
		serverConfig[3],
		serverConfig[2],
		function() {
			console.log( 'listening on port %d', server.address().port );
		}
);
