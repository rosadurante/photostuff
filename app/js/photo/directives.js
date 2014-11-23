/* globals angular */

/**
 * directives.js
 *
 * Author: Rosa Durante <me@rosadurante.com>
 * Date: Sat 15th Nov 2014
 */

'use strict';

angular.module('photo')

	.directive('photoScroll', ['photoService', function (photoService) {
		return {
			link: function (scope, elem) {
				elem.bind('scroll', function () {
					if (elem[0].offsetHeight + elem[0].scrollTop >= elem[0].scrollHeight) {
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