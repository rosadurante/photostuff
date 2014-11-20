/* globals angular, _ */

/**
 * photo.js
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

	.factory('photoService', ['$http', 'mainURL', 'key',
		function ($http, url, key) {

			// Modules which will get data from resource provided (now, dummy data)
			// and define a manager to provide those data nicely.

			var _id = 0,
				_list = [],
				_params = {
					method: 'flickr.photos.search',
					api_key: key,
					tags: 'cats',
					page: 1,
					per_page: 10,
					format: 'json',
					jsoncallback: 'JSON_CALLBACK',
					sort: 'interestingness-desc',
					privacy_filter: 1,
					media: 'photos',
					extras: 'description,date_upload,owner_name,views,original_format,tags,url_z'
				},

				_getList = function () {
					_id = 0;
					_params.page = 1;

					return $http({ url: url, params: _params, method: 'jsonp' }).then(
						function (response) {
							// Success: fill _list variable and return it.
							// Before return it, parse all items to get the proper object to use in the controller.
							_list = _parseData(response.data.photos.photo);
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
							_list = _.union(_list, _parseData(response.data.photos.photo));
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
							photo_id: item.id,
							link: 'http://flickr.com/photos/' + item.owner + '/' + item.id,
							title: item.title,
							imgsrc: item.url_z,
							date: new Date(parseInt(item.dateupload, 10)),
							description: item.description._content,
							tags: item.tags.split(' '),
							author: {
								id: item.owner, // http://flick.com/photos/owner
								name: item.ownername,  // owner_name
								link: 'http://flickr.com/photos/' + item.owner
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