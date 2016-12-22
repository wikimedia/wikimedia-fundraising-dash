/*!
 * Grunt file
 *
 * @package fundraising-dash
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-jscs' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		jshint: {
			options: {
				jshintrc: true
			},
			shared: [
				'**/*.js',
				'!node_modules/**/*.js',
				'!src/bower_modules/**/*.js',
				'!dist/**/*.js'
			]
		},
		jscs: {
			shared: { src: '<%= jshint.shared %>' }
		}

	} );

	grunt.registerTask( 'lint', [ 'jshint', 'jscs' ] );
	grunt.registerTask( 'test', [ 'lint' ] );
	grunt.registerTask( 'default', 'test' );
};
