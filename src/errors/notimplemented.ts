import {BaseError, extend} from './base';

export default class NotImplementedError extends BaseError {
    name: string = 'NotImplementedError';
}

extend(NotImplementedError);
