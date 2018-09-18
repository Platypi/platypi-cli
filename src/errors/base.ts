export class BaseError extends Error {
    name: string = 'BaseError';
    stack: string;

    constructor(message?: string) {
        super(message);

        this.message = message;
    }
}
