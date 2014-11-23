/* globals angular, describe, inject, beforeEach, afterEach, it, expect */

'use strict';

describe('photo.services', function () {
	var service, http, url, list;

	// load the controller's module
	beforeEach(module('photo'));

	beforeEach(inject(
		function (photoService, $httpBackend) {
			service = photoService;
			http = $httpBackend;

			list = {
				'photos': {'photo': [{
					id: '0001',
					owner: '0123@01',
					title: 'title picture 1',
					url_z: 'http://example.com/picture.jpg',
					dateupload: '1231234567', // 6 Jan 2009
					description: {
						_content: '<p>Some <b>description</b> in html</p>',
					},
					tags: 'tag1 tag2 tag3 tag4',
					ownername: 'Jamie Smith'
				}, {
					id: '0002',
					owner: '0123@02',
					title: 'title picture 2',
					url_z: 'http://example.com/picture.jpg',
					dateupload: '1231234567', // 6 Jan 2009
					description: {
						_content: '<p>Some <b>description</b> in html</p>',
					},
					tags: 'tag1 tag2 tag3 tag4',
					ownername: 'Ben Clarke'
				}]
			}
			};

			url = 'https://api.flickr.com/services/rest/' +
				'?api_key=922c0cb04368500641ea0ca0b3cb2a27' +
				'&extras=description,date_upload,owner_name,' +
					'views,original_format,tags,url_z' +
				'&format=json' +
				'&jsoncallback=JSON_CALLBACK' +
				'&media=photos' +
				'&method=flickr.photos.search' +
				'&page=1' +
				'&per_page=10' +
				'&privacy_filter=1' +
				'&sort=interestingness-desc' +
				'&tags=cats';
		}
	));

	afterEach(function () {
		http.verifyNoOutstandingExpectation();
		http.verifyNoOutstandingRequest();
	});

	it('should be an object', function () {
		expect(angular.isObject(service)).toBe(true);
	});

	it('should contain three functions', function () {
		expect(angular.isFunction(service.getList)).toBe(true);
		expect(angular.isFunction(service.getById)).toBe(true);
		expect(angular.isFunction(service.getNextPage)).toBe(true);
	});

	it('should return a parsed list of photos', function () {
		http.expectJSONP(url).respond(200, list);

		service.getList().then(function (response) {

			expect(response.length).toBe(list.photos.photo.length);
			expect(response[0].id).toBe(1);
			expect(response[0].photo_id).toBe('0001');
			expect(response[0].link).toBe('http://flickr.com/photos/0123@01/0001');
			expect(response[0].title).toBe('title picture 1');
			expect(response[0].imgsrc).toBe('http://example.com/picture.jpg');
			expect(response[0].date.toString()).toBe(new Date(1231234567000).toString());
			expect(response[0].description).toBe('<p>Some <b>description</b> in html</p>');
			expect(response[0].tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
			expect(response[0].author.id).toBe('0123@01');
			expect(response[0].author.name).toBe('Jamie Smith');
			expect(response[0].author.link).toBe('http://flickr.com/photos/0123@01');
		});

		http.flush();

	});

	it('should return photo details given an id', function () {

		http.expectJSONP(url).respond(200, list);

		service.getById('1').then(function (response) {
			expect(angular.isObject(response)).toBe(true);
			expect(response.id).toBe(1);
		});

		http.flush();
	});

	it('should return photos from next page', function () {
		url = url.replace('page=1', 'page=2');
		http.expectJSONP(url).respond(200, list);

		service.getNextPage();

		http.flush();
	});
});