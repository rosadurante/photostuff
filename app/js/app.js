/* globals angular */

/**
 * app.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

var app = {
	config: function ($locationProvider, $stateProvider) {
		$locationProvider.html5Mode(true);

		// $urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/partials/home.html'
			})
			.state('about', {
				url: '/about',
				templateUrl: '/partials/about.html'
			});

	}
};

angular.module('photostuff', ['ui.router', 'photo'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', app.config]);