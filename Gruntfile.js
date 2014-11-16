/* globals module, process */

/**
 * Gruntfile.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

module.exports = function (grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var modRewrite = require('connect-modrewrite'),
		rewriteUrlIndex = function (connect, options) {
			var middlewares = [];
 
			middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
			options.base.forEach(function (base) {
				middlewares.push(connect.static(base));
			});
			return middlewares;
		};

	grunt.initConfig({

		// ---------- grunt-contrib-watch ----------

		watch: {
			sass: {
				files: ['app/scss/**/*.scss'],
				tasks: ['sass:dev']
			}
		},

		// ---------- grunt-contrib-sass ----------

		sass: {
			prod: {
				options: { style: 'compressed' },
				files: { 'app/css/styles.css': 'app/scss/styles.scss' }
			},
			dev: {
				files: { 'app/css/styles.css': 'app/scss/styles.scss' }
			}
		},

		// ---------- grunt-contrib-jshint ----------

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['app/js/libs/**/*.js']
			},
			all: ['gruntfile.js', 'app/js/**/*.js']
		},

		// ---------- grunt-karma ----------

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		// ---------- grunt-contrib-connect ----------

		connect: {
			server: {
				options: {
					hostname: '0.0.0.0',
					port: process.env.PORT || 5000,
					base: 'app',
					keepalive: true,
					middleware: rewriteUrlIndex
				}
			},
			dev: {
				options: {
					port: 8000,
					base: 'app',
					keepalive: true,
					open: 'http://localhost:8000',
					middleware: rewriteUrlIndex
				}
			}
		}

	});

	grunt.registerTask('test', 'Running tests', [
		'jshint', 'karma'
	]);

	grunt.registerTask('watch', 'Watching styles', [
		'sass:dev', 'watch'
	]);

	grunt.registerTask('dev', 'Compile and open', [
		'sass:dev', 'jshint', 'connect:dev'
	]);

};