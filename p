diff --git a/defaults.js b/defaults.js
index 2d9ef3a..125fa74 100644
--- a/defaults.js
+++ b/defaults.js
@@ -1,3 +1,11 @@
 module.exports = {
-	listen: "8080"
+    listen: "8080",
+    db: 'fredge',
+    dblogin: 'testuser',
+    dbpwd: 'testpassword',
+    requestTokenURL: 'http://oauth-sandbox.sevengoslings.net/request_token',
+    accessTokenURL: 'http://oauth-sandbox.sevengoslings.net/access_token',
+    userAuthorizationURL: 'http://oauth-sandbox.sevengoslings.net/authorize',
+    consumerKey: '27312d60e9a5eb11',
+    consumerSecret: '2f75ad1bd4abe5c98195cc48bd35'
 };
diff --git a/server.js b/server.js
index 3a95c4c..811b6a6 100644
--- a/server.js
+++ b/server.js
@@ -10,11 +10,11 @@ var express           = require( 'express' ),
     serverConfig;
 
 passport.use('provider', new OAuthStrategy({
-    requestTokenURL: 'http://oauth-sandbox.sevengoslings.net/request_token',
-    accessTokenURL: 'http://oauth-sandbox.sevengoslings.net/access_token',
-    userAuthorizationURL: 'http://oauth-sandbox.sevengoslings.net/authorize',
-    consumerKey: '27312d60e9a5eb11',
-    consumerSecret: '2f75ad1bd4abe5c98195cc48bd35'
+    requestTokenURL: config.requestTokenURL,
+    accessTokenURL: config.accessTokenURL,
+    userAuthorizationURL: config.userAuthorizationURL,
+    consumerKey: config.consumerKey,
+    consumerSecret: config.consumerSecret
   },
   function(token, tokenSecret, profile, done) {
     // TODO: this
