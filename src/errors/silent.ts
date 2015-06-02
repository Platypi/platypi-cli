import {BaseError, extend} from './base';

export default class SilentError extends BaseError {
	name: string = 'SilentError';
}

extend(SilentError);
