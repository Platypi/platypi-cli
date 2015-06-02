import {expect} from 'chai';
import SilentError from '../../../src/errors/silent';

describe('SilentError', () => {
	it('should be named SilentError', () => {
		var error = new SilentError();

		expect(error.name).to.equal('SilentError');
	});

	it('should include a stack when PLATYPI_VERBOSE_ERRORS', () => {

		var env = process.env.PLATYPI_VERBOSE_ERRORS;

		delete process.env.PLATYPI_VERBOSE_ERRORS;
		var error = new SilentError();
		expect(error.stack).to.be.an('undefined');

		process.env.PLATYPI_VERBOSE_ERRORS = true;
		error = new SilentError();
		expect(error.stack).to.be.a('string');

		process.env.PLATYPI_VERBOSE_ERRORS = env;
	});
});
