import {expect} from 'chai';
import NotImplementedError from '../../../src/errors/notimplemented';

describe('NotImplementedError', () => {
    it('should be named NotImplementedError', () => {
        var error = new NotImplementedError();

        expect(error.name).to.equal('NotImplementedError');
    });

    it('should include a stack when PLATYPI_VERBOSE_ERRORS', () => {

        var env = process.env.PLATYPI_VERBOSE_ERRORS;

        delete process.env.PLATYPI_VERBOSE_ERRORS;
        var error = new NotImplementedError();
        expect(error.stack).to.be.an('undefined');

        process.env.PLATYPI_VERBOSE_ERRORS = true;
        error = new NotImplementedError();
        expect(error.stack).to.be.a('string');

        process.env.PLATYPI_VERBOSE_ERRORS = env;
    });
});
