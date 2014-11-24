/* globals angular, _ */

/**
 * services.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

angular.module('photo')

	.factory('photoService', ['$http', 'mainURL', 'key', function ($http, url, key) {

		// Modules which will get data from resource provided (now, dummy data)
		// and define a manager to provide those data nicely.

		var _id = 0,
			_list = [],
			_params = {
				method: 'flickr.photos.search',
				api_key: key,
				tags: 'cats',
				text: '',
				page: 1,
				per_page: 10,
				format: 'json',
				jsoncallback: 'JSON_CALLBACK',
				sort: 'interestingness-desc',
				privacy_filter: 1,
				media: 'photos',
				extras: 'description,date_upload,owner_name,views,original_format,tags,url_z'
			},

			__successList = function (response) {
				_list = __parseData(response.data.photos.photo);
				_params.per_page = 10;
				delete _params.id;
				return _list;
			},

			__successPage = function (response) {
				_list = _.union(_list, __parseData(response.data.photos.photo));
				return _list;
			},

			__error = function () {
				console.log('Error fetching data: ', _params);
			},

			_getList = function (options) {
				_id = 0;
				_params.page = 1;

				if (options.id) { _params.id = options.id; }

				if (options.tags) {
					_params.tags = options.tags;
					_params.text = '';
				} else if (options.text) {
					_params.text = options.text;
					_params.tags = '';
				}

				return $http({ url: url, params: _params, method: 'jsonp' }).then(
					__successList, __error);
			},

			_getNextPage = function () {
				_params.page += 1;

				return $http({ url: url, params: _params, method: 'jsonp' }).then(
					__successPage, __error);
			},

			_getById = function (id) {
				_params.id = id;

				var _find = function () {
					delete _params.id;
					return _.find(_list, function (photo) { return photo.id.toString() === id; });
				};

				return !_list.length ? _getList({id: id}).then(_find) : _find();
			},

			__parseData = function (photos) {
				var parsedData = [];
				
				_.each(photos, function (item) {
					parsedData.push({
						id: item.id,
						photo_id: item.id,
						link: 'http://flickr.com/photos/' + item.owner + '/' + item.id,
						title: item.title,
						imgsrc: item.url_z,
						date: new Date(parseInt(item.dateupload, 10) * 1000),
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

	}]);