import {BaseError} from './base';

export default class ValidationError extends BaseError {
    name: string = 'ValidationError';
}
