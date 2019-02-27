module.exports = {
	listen: '8080',
	dbserver: 'localhost',
	db: 'fredge',
	civicrmDb: 'civicrm',
	dblogin: 'testuser',
	dbpwd: 'testpassword',
	userDbServer: 'localhost',
	userDb: 'fredge',
	userDbLogin: 'testuser',
	userDbPwd: 'testpassword',
	// URL to redirect the user's browser to
	providerURL: 'https://civi.dev/civi',
	// BackendURL will be used for direct Dash->Drupal requests
	providerBackendURL: 'http://localhost/civi',
	// If providerBackendIP is set, we override DNS resolution for the hostname
	// given in providerBackendURL.  This can be useful for SSL behind firewalls
	consumerKey: 'kKq6LbU4ctDUzubSUdHJ7Pn9NvVWwQ2f',
	consumerSecret: 'JfGs4nnfyoRQ9i9JQeTYP7geCEKQrenX',
	sessionSecret: 'ds87naowiy3icaywri73tcin7eyyeI8634I71NYFIEA764',
	cacheDuration: 300000 // 5 min in ms
};
