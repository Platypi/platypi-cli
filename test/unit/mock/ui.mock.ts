/// <reference path="../../references.d.ts" />

import {expect} from 'chai';
import {Promise} from 'es6-promise';
import UiBase from '../../../src/ui/ui';

export class Ui extends UiBase {
	constructor(private onLog: (message?: string, level?: number) => void = (message?: string, level?: number) => {}) {
		super({
			input: process.stdin,
			output: process.stdout
		});
	}

	log(message: string, level: number): void {
		this.onLog(message, level);
	}

	prompt(): Thenable<Array<any>> {
		return Promise.resolve([]);
	}

	startProgress(): void { }

	stopProgress(): void {}
}

export default Ui;
