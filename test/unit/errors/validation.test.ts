import {expect} from 'chai';
import ValidationError from '../../../src/errors/validation';

describe('ValidationError', () => {
    it('should be named ValidationError', () => {
        var error = new ValidationError();

        expect(error.name).to.equal('ValidationError');
    });

    it('should include a stack when PLATYPI_VERBOSE_ERRORS', () => {

        var env = process.env.PLATYPI_VERBOSE_ERRORS;

        delete process.env.PLATYPI_VERBOSE_ERRORS;
        var error = new ValidationError();
        expect(error.stack).to.be.an('undefined');

        process.env.PLATYPI_VERBOSE_ERRORS = true;
        error = new ValidationError();
        expect(error.stack).to.be.a('string');

        process.env.PLATYPI_VERBOSE_ERRORS = env;
    });
});
