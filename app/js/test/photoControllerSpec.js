/* globals describe, inject, beforeEach, it, expect */

'use strict';

describe('photo.controllers', function () {
	var scope, list, photo;

	// load the controller's module
	beforeEach(module('photo'));

	beforeEach(inject(
		function ($controller, $rootScope) {
			scope = $rootScope.$new();
			list = [{
				id: 1,
				name: 'item 1'
			}, {
				id: 2,
				name: 'item 2'
			}, {
				id: 3,
				name: 'item 3'
			}];
			photo = {
				id: 2,
				name: 'Item 2',
				description: 'description'
			};

			$controller('photoListCtrl', {'$scope': scope, 'list': list});
			$controller('photoDetailCtrl', {'$scope': scope, 'photo': photo});

			scope.$digest();
		}
	));

	it('photoListCtrl should have scope.list initialised', function () {
		expect(scope.list).toEqual(list);
	});

	it('photoDetailCtrl should have scope.photo initialised', function () {
		expect(scope.photo).toEqual(photo);
	});
});