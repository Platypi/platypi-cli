import { expect } from 'chai';
import NotImplementedError from '../../../src/errors/notimplemented';

describe('NotImplementedError', () => {
    it('should be named NotImplementedError', () => {
        let error = new NotImplementedError();

        expect(error.name).to.equal('NotImplementedError');
    });
});
