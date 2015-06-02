import {expect} from 'chai';
import {Promise} from 'es6-promise';
import CreateBase = require('../../../src/commands/create');

var cb = () => { };

export class Create extends CreateBase {
	static aliases: Array<string> = ['create-alias'];

	validateAndRun(options: any): any {
		cb();
		return super.validateAndRun(options);
	}
}

export default function(onRun: () => void): typeof Create {
	cb = onRun;
	return Create;
};
