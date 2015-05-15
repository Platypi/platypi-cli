/// <reference path="references.d.ts" />

import {Promise} from 'es6-promise';
import Ui from './ui/ui';

export = function(options: { args: Array<string>; input: NodeJS.ReadableStream; output: NodeJS.WritableStream; }) {
	var ui = new Ui(options);
	
	ui.info('test message');
	ui.error(new Error('this is a test error'));
	return Promise.resolve();
}
