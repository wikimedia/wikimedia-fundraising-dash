/*!
 * Grunt file
 *
 * @package fundraising-dash
 */

/* eslint-env es6, node */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-eslint' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		eslint: {
			options: {
				reportUnusedDisableDirectives: true,
				cache: true
			},
			all: [
				'**/*.js',
				'!node_modules/**/*.js',
				'!src/bower_modules/**/*.js',
				'!dist/**/*.js'
			]
		}

	} );

	grunt.registerTask( 'test', [ 'eslint' ] );
	grunt.registerTask( 'default', 'test' );
};
