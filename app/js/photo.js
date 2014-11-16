/* globals angular */

/**
 * list.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

var photo = {
	config: function ($locationProvider, $stateProvider) {
		$stateProvider
			.state('photo', {
				abstract: true,
				url: '/photo',
				templateUrl: '/partials/photo.html'
			})
			.state('photo.list', {
				url: '',
				templateUrl: '/partials/list.html',
				resolve: {
					photo: function () { return [1, 2, 3, 4, 5, 6]; }
				}
			})
			.state('photo.detail', {
				url: '/:photoId',
				templateUrl: '/partials/detail.html',
				controller: ['$scope', '$stateParams', function ($scope, $stateParams) {
					$scope.photoId = $stateParams.photoId;
				}]
			});
	}
};

angular.module('photo', ['ui.router'])
	.config(['$locationProvider', '$stateProvider', photo.config]);