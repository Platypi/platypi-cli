/// <reference path="../references.d.ts" />

export default class SilentError {
	name: string = 'SilentError';
	stack: string;

	constructor(public message: string) {
		Error.apply(this, arguments);
		
		if(process.env.PLATYPI_VERBOSE_ERRORS) {
			this.stack = (<any>new Error()).stack;
		}
	}
}

SilentError.prototype = Object.create(Error.prototype);
SilentError.prototype.constructor = SilentError;
