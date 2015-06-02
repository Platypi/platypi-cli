import {expect} from 'chai';
import {Promise} from 'es6-promise';
import CreateBase = require('../../../src/commands/create');

var cb = () => { };

export class Create extends CreateBase {
	static aliases: Array<string> = ['create-alias'];

	run(options: any): any {
		cb();
		return super.run(options);
	}
}

export default function(onRun: () => void): typeof Create {
	cb = onRun;
	return Create;
};
