/* globals describe, inject, beforeEach, it, expect */

'use strict';

describe('photo.filter', function () {
	var html = '<div class="example">This is an <b>example</b> to test <i>rawHTML</i> filter</div>';

	// load the filter's module
	beforeEach(module('photo'));

	describe('rawHTML', function () {
		it('rawHTML should display escaped text', inject(function (rawHTMLFilter) {
			expect(rawHTMLFilter(html).$$unwrapTrustedValue()).toBe(html);
		}));
	});
});