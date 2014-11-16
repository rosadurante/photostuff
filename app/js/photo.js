/* globals angular */

/**
 * photo.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

var photo = {

	// Dummy data
	data: [{
		id: 1,
		title: 'cats!',
		imgsrc: 'http://stylonica.com/wp-content/uploads/2014/03/cats-16140154-1920-1080.jpg',
		date: 'Nov 23rd 2013',
		link: 'http://google.co.uk',
		description: 'description',
		author: {
			link: 'http://google.co.uk',
			name: 'Perico el de los palotes'
		},
		tags: ['tag 1', 'tag 2', 'tag 3']
	}, {
		id: 2,
		title: 'dogs!',
		imgsrc: 'http://www.metrodogstop.com/cms/wp-content/uploads/2013/05/cute-dog.jpg',
		date: 'Nov 24th 2013',
		link: 'http://google.co.uk',
		description: 'description',
		author: {
			link: 'http://google.co.uk',
			name: 'Maria la hierbabuena'
		},
		tags: ['tag 3', 'tag 2', 'tag 1']
	}]
};

angular.module('photo', ['ui.router'])
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
					url: '/photo',
					templateUrl: '/partials/photo.html'
				})
				.state('photo.list', {
					url: '',
					templateUrl: '/partials/list.html',
					resolve: {
						list: ['photoService', function (photoService) {
							return photoService.getList();
						}]
					},
					controller: 'photoListCtrl'
				})
				.state('photo.detail', {
					url: '/:photoId',
					templateUrl: '/partials/detail.html',
					resolve: {
						photo: ['$stateParams', 'photoService', function ($stateParams, photoService) {
							return photoService.getById($stateParams.photoId);
						}]
					},
					controller: 'photoDetailCtrl'
				});
		}
	])

	.factory('photoService', function () {

		// Modules which will get data from resource provided (now, dummy data)
		// and define a manager to provide those data nicely.

		var _getList = function () { return photo.data; },
			_getById = function (id) {
				var selected;
				angular.forEach(photo.data, function (item) {
					if (!selected && item.id.toString() === id) { selected = item; }
				});

				return selected;
			};

		return {
			getList: _getList,
			getById: _getById
		};
	})

	.controller('photoListCtrl', ['$scope', 'list',
		function ($scope, list) { $scope.list = list; }
	])

	.controller('photoDetailCtrl', ['$scope', 'photo',
		function ($scope, photo) { $scope.photo = photo; }
	]);