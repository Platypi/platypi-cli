export class BaseError extends Error {
    name: string = 'BaseError';
    stack: string;

    constructor(message?: string) {
        super(message);

        this.message = message;
        if (process.env.PLATYPI_VERBOSE_ERRORS) {
            this.stack = (<any>new Error()).stack;
        }
    }
}
