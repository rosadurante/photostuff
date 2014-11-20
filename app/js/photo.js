/* globals angular, _ */

/**
 * photo.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

angular.module('photo', ['ui.router'])

	.constant('mainURL', 'http://api.flickr.com/services/feeds/photos_public.gne')

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

	.factory('photoService', ['$http', 'mainURL',
		function ($http, url) {

			// Modules which will get data from resource provided (now, dummy data)
			// and define a manager to provide those data nicely.

			var _id = 0,
				_list = [],
				_params = {
					page: 1,
					lang: 'en-us',
					tags: 'cat',
					tagmode: 'all',
					format: 'json',
					jsoncallback: 'JSON_CALLBACK'
				},

				_getList = function () {
					_id = 0;
					_params.page = 1;

					return $http({ url: url, params: _params, method: 'jsonp' }).then(
						function (response) {
							// Success: fill _list variable and return it.
							// Before return it, parse all items to get the proper object to use in the controller.
							_list = _parseData(response.data.items);
							return _list;
						},
						function () {
							console.log('Error fetching from ', url, _params);
						}
					);
				},

				_getById = function (id) {

					if (!_list.length) {
						return _getList().then(function () {
							return _.find(_list, function (photo) { return photo.id.toString() === id; });
						});
					} else {
						return _.find(_list, function (photo) { return photo.id.toString() === id; });
					}
				},

				_getNextPage = function () {
					_params.page += 1;
					return $http({ url: url, params: _params, method: 'jsonp' }).then(
						function (response) {
							debugger;
							_list = _.union(_list, _parseData(response.data.items));
							return _list;
						},
						function () {
							console.log('error fetching from ', url, _params);
						});
				},

				_parseData = function (photos) {
					var parsedData = [];
					_.each(photos, function (item) {
						parsedData.push({
							id: ++_id,
							link: item.link,
							title: item.title,
							imgsrc: item.media.m,
							date: new Date(item.published),
							description: item.description,
							tags: item.tags.split(' '),
							author: {
								id: item.author_id,
								name: item.author
							}
						});
					});

					return parsedData;
				};

			// Return the interface, functions that only would be need outside the service.
			return {
				getList: _getList,
				getById: _getById,
				getNextPage: _getNextPage
			};
		}
	])

	.controller('photoListCtrl', ['$scope', 'list',
		function ($scope, list) { $scope.list = list; }
	])

	.controller('photoDetailCtrl', ['$scope', 'photo',
		function ($scope, photo) { $scope.photo = photo; }
	])

	.directive('photoScroll', ['photoService', function (photoService) {
		return {
			link: function (scope, elem) {
				elem.bind('scroll', function () {
					if (elem[0].offsetHeight + elem[0].scrollTop >= elem[0].scrollHeight) {
						// photoService.getNextPage().then(function (list) {
						// 	scope.list = list;
						// });
						scope.$apply(function () {
							photoService.getNextPage().then(function (list) {
								scope.list = list;
							});
						});
					}
				});
			}
		};
	}]);