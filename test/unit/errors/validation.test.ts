import { expect } from 'chai';
import ValidationError from '../../../src/errors/validation';

describe('ValidationError', () => {
    it('should be named ValidationError', () => {
        let error = new ValidationError();

        expect(error.name).to.equal('ValidationError');
    });
});
