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
			},
			js: {
				files: ['app/js/photo/*.js', 'app/js/app.js'],
				tasks: ['jshint', 'concat:app']
			}
		},

		// ---------- grunt-contrib-sass ----------

		sass: {
			prod: {
				options: { style: 'compressed', compass: true },
				files: { 'app/css/styles.css': 'app/scss/styles.scss' }
			},
			dev: {
				options: { compass: true },
				files: { 'app/css/styles.css': 'app/scss/styles.scss' }
			}
		},

		// ---------- grunt-contrib-jshint ----------

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['app/js/libs/**/*.js', 'app/js/build/*.js']
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
		},

		// ---------- grunt-contrib-concat ----------

		concat: {
			options: {
				separator: ';'
			},
			lib: {
				src: [ 'app/js/libs/angular.min.js',
					'app/js/libs/angular-ui-router.min.js',
					'app/js/libs/angular-mocks.js',
					'app/js/libs/underscore-min.js'
				],
				dest: 'app/js/build/libs.js'
			},
			app: {
				src: [ 'app/js/app.js',
					'app/js/photo/main.js',
					'app/js/photo/filter.js',
					'app/js/photo/directives.js',
					'app/js/photo/services.js',
					'app/js/photo/controllers.js'
				],
				dest: 'app/js/build/app.js'
			}
		},

		// ---------- grunt-contrib-uglify ----------

		uglify: {
			prod: {
				files: {
					'app/js/build/app.js': [ 'app/js/build/app.js' ]
				},
				options: {
					mangle: false
				}
			}
		},


		htmlangular: {
			options: {
				tmplext: 'html.tmpl',
				doctype: 'HTML5',
				charset: 'utf-8',
				customattrs: [
					'photo-scroll'
				],
				relaxerror: [
					'Element img is missing required attribute src.' // Using ng-src instead
				],
				reportpath: 'validate-report.json'
			},
			files: {
				src: ['app/index.html', 'app/partials/*.html.tmpl']
			},
		}

	});

	grunt.registerTask('test', 'Running tests', [
		'jshint', 'htmlangular', 'karma'
	]);

	grunt.registerTask('dev', 'Compile and open', [
		'sass:dev', 'jshint', 'concat:lib', 'concat:app', 'connect:dev'
	]);

	grunt.registerTask('prod', 'Production', [
		'sass:prod', 'concat:lib', 'concat:app', 'uglify:prod', 'connect:server'
	]);

};