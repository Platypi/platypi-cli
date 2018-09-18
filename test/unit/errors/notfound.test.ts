import { expect } from 'chai';
import NotFoundError from '../../../src/errors/notfound';

describe('NotFoundError', () => {
    it('should be named NotFoundError', () => {
        let error = new NotFoundError();

        expect(error.name).to.equal('NotFoundError');
    });
});
