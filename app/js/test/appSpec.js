/* globals describe, beforeEach, it, expect */

'use strict';

describe('default test', function () {

	// load the controller's module
	beforeEach(module('photostuff'));

	it('should be true', function () {
		expect(true).toBe(true);
	});
});