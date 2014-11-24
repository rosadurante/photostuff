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
		}

	])

	.controller('searchPhotoCtrl', ['$scope', '$state', function ($scope, $state) {
		$scope.submitSearch = function () {
			$state.go('photo.list', {photoText: $scope.query, photoTag: undefined});
		};
	}]);