import {BaseError, extend} from './base';

export default class NotFoundError extends BaseError {
    name: string = 'NotFoundError';
}

extend(NotFoundError);
