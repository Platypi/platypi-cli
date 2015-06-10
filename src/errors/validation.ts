import {BaseError, extend} from './base';

export default class ValidationError extends BaseError {
	name: string = 'ValidationError';
}

extend(ValidationError);
