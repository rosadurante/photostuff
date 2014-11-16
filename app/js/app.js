/* globals angular */

/**
 * app.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

angular.module('photostuff', ['ui.router', 'photo'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',

		function ($locationProvider, $stateProvider, $urlRouterProvider) {

			// Enable HTML5 mode
			$locationProvider.html5Mode(true);
			
			// Redirect to home when page doesn't exists.
			$urlRouterProvider.otherwise('/');

			// Define top root urls for this app: home, about page and contact page.
			$stateProvider
				.state('home', {
					url: '/',
					templateUrl: '/partials/home.html'
				})
				.state('about', {
					url: '/about',
					templateUrl: '/partials/about.html'
				})
				.state('contact', {
					url: '/contact',
					templateUrl: '/partials/contact.html'
				});
		}

	]);