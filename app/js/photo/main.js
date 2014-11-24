/* globals angular */

/**
 * main.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

angular.module('photo', ['ui.router'])

	.constant('mainURL', 'https://api.flickr.com/services/rest/')
	.constant('key', '922c0cb04368500641ea0ca0b3cb2a27')

	.config(['$locationProvider', '$stateProvider',

		function ($locationProvider, $stateProvider) {

			// Define all different urls within photo module.
			// It has an abstract state which would act as root of this
			// part of the web. Then, it defines a list and details views.

			// These states will inject services and controllers
			// defined below to resolve data and display it properly.

			$stateProvider
				.state('photo', {
					abstract: true,
					url: '/',
					templateUrl: '/partials/photo.html.tmpl'
				})
				.state('photo.list', {
					url: '?:photoTag&:photoText',
					templateUrl: '/partials/list.html.tmpl',
					resolve: {
						list: ['$stateParams', 'photoService', function ($stateParams, photoService) {
							return photoService.getList({ tags: $stateParams.photoTag, text: $stateParams.photoText });
						}]
					},
					controller: 'photoListCtrl'
				})
				.state('photo.detail', {
					url: ':photoId',
					templateUrl: '/partials/detail.html.tmpl',
					resolve: {
						photo: ['$stateParams', 'photoService', function ($stateParams, photoService) {
							return photoService.getById($stateParams.photoId);
						}]
					},
					controller: 'photoDetailCtrl'
				});
		}
	]);