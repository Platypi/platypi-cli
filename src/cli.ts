/// <reference path="references.d.ts" />

import {Promise} from 'es6-promise';
import Ui from './ui/ui';

export = function(options: { args: Array<string>; input: NodeJS.ReadableStream; output: NodeJS.WritableStream; }) {
	var ui = new Ui(options),
		PROMPTS = Ui.PROMPTS;
	
	ui.info('the args are:');
	ui.info(JSON.stringify(options.args, null, 2));
	ui.error(new Error('this is a test error'));
	return ui.prompt([
		{ type: PROMPTS.INPUT, name: 'question1', message: 'Input here' },
		{ type: PROMPTS.CONFIRM, name: 'question2', message: 'Y/n' }
	]).then((answers) => {
		ui.info('answers:');
		ui.info(JSON.stringify(answers, null, 2));
	}, ui.error.bind(ui));
}
