/// <reference path="../../references.d.ts" />

import {expect} from 'chai';
import SilentError from '../../../src/errors/silent';

describe('SilentError', () => {
	it('should be named SilentError', () => {
		var error = new SilentError('test');
		
		expect(error.name).to.equal('SilentError');
	});
});
