/* globals angular*/

/**
 * controllers.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

angular.module('photo')

	.controller('photoListCtrl', ['$scope', 'list',
		function ($scope, list) { $scope.list = list; }
	])

	.controller('photoDetailCtrl', ['$scope', 'photo',
		function ($scope, photo) { $scope.photo = photo; }
	]);