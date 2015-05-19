/// <reference path="../../references.d.ts" />

import {expect} from 'chai';
import {Promise} from 'es6-promise';
import UiBase from '../../../src/ui/ui';

export class Ui extends UiBase {
	constructor() {
		super({
			input: process.stdin,
			output: process.stdout
		});
	}
	log() { }
	
	prompt() {
		return Promise.resolve([]);
	}
	
	startProgress(): void { }
	
	stopProgress(): void {}
}

export default Ui;
