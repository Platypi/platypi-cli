/// <reference path="../../references.d.ts" />

import {expect} from 'chai';
import {Promise} from 'es6-promise';
import CreateBase = require('../../../src/commands/create');

var cb = () => { };

export class Create extends CreateBase {
	static aliases = ['create-alias'];

	run(options: any) {
		cb();
		return super.run(options);
	}
}

export default function(onRun: () => void) {
	cb = onRun;
	return Create;
};
