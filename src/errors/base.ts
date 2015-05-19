/// <reference path="../references.d.ts" />

export class BaseError {
	name: string = 'BaseError';
	stack: string;

	constructor(public message?: string) {
		Error.apply(this, arguments);

		if(process.env.PLATYPI_VERBOSE_ERRORS) {
			this.stack = (<any>new Error()).stack;
		}
	}
}

export function extend(ExtendedError: typeof BaseError): void {
	ExtendedError.prototype = Object.create(Error.prototype);
	ExtendedError.prototype.constructor = ExtendedError;
};
