require('rconsole');

var express           = require( 'express' ),
    app               = express(),
    commander         = require( 'commander' ),
    config            = require( './defaults.js' ),
    passport          = require( 'passport' ),
    OAuthStrategy     = require( 'passport-oauth' ).OAuthStrategy,
    server,
    serverConfig;

passport.use('provider', new OAuthStrategy({
    requestTokenURL: 'http://oauth-sandbox.sevengoslings.net/request_token',
    accessTokenURL: 'http://oauth-sandbox.sevengoslings.net/access_token',
    userAuthorizationURL: 'http://oauth-sandbox.sevengoslings.net/authorize',
    consumerKey: '27312d60e9a5eb11',
    consumerSecret: '2f75ad1bd4abe5c98195cc48bd35'
  },
  function(token, tokenSecret, profile, done) {
    // TODO: this
    // User.findOrCreate(..., function(err, user) {
    //   done(err, user);
    //});
    console.log('profile: ', profile);
  }
));

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

app.set( 'views', __dirname + '/src/components' );
app.set( 'view options', { pretty: true } );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( express.static(__dirname + '/src') );

app.get('/auth/provider', passport.authenticate('provider'));
app.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));

var port = config.port;

server = app.listen( serverConfig[3], serverConfig[2], function() {
    console.log( 'listening on port %d', server.address().port );
});
