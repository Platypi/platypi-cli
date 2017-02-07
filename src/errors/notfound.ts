import {BaseError} from './base';

export default class NotFoundError extends BaseError {
    name: string = 'NotFoundError';
}
