var express           = require( 'express' ),
    app               = express(),
    routes            = require( './routes'),
    passport          = require( 'passport' ),
    DrupalStrategy    = require( 'passport-drupal' ).DrupalStrategy,
    evilDns			  = require( 'evil-dns' ),
    url               = require( 'url' ),
    logger            = require( './logger.js' ),
    config            = require( './config.js' ),
    server,
    serverConfig;

logger.debug( 'Dash starting up' );

// Log errors
process.on( 'uncaughtException', function( err ) {
	logger.error( 'Application error: ' + err );
});

serverConfig = /(([0-9\.]*|\[[0-9a-fA-F\:]*\]):)?([0-9]+)/.exec(config.listen);
if (!serverConfig) {
    logger.error( 'Server cannot listen on "' + config.listen + '", invalid format.' );
    process.exit(1);
}

logger.debug( 'Will try to listen on IP address: ' + serverConfig[2] );
logger.debug( 'Will try to listen on port: ' + serverConfig[3] );
logger.debug( 'Using OAuth providerURL: ' + config.providerURL );
logger.debug( 'Using OAuth providerBackendURL: ' + config.providerBackendURL );

// Override DNS resolution if providerBackendIP is given
if ( config.providerBackendIP ) {
	logger.info( 'OAuth providerBackendIP set, will use address ' +
		config.providerBackendIP + ' for hostname "' +
		url.parse( config.providerBackendURL ).hostname + '"' );
	evilDns.add(
		url.parse( config.providerBackendURL ).hostname,
		config.providerBackendIP
	);
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
		profile.oauth = { token: token, tokenSecret: tokenSecret };
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

/*jslint -W024*/
app.use( express.static( __dirname + ( config.debug ? '/src' : '/dist' ) ) );
/*jslint +W024*/

if ( config.debug ) {
	app.get( '/auth/drupal', function( req, res ) {
		req.session.passport = {
			user: {
				displayName: 'HoneyD'
			}
		};
		res.redirect( '/' );
	});
} else {
	app.get( '/auth/drupal', passport.authenticate( 'drupal' ));
	app.get( '/auth/drupal/callback',
		passport.authenticate( 'drupal', { failureRedirect: '/login' }),
		function( req, res ) {
			res.redirect( '/' );
		}
	);
}
app.get( '/logout', function( req, res ) {
	req.logout();
	res.redirect( '/' );
});

server = app.listen(
		serverConfig[3],
		serverConfig[2],
		function() {
			logger.info( 'Dash listening on port ' + server.address().port );
		}
);
