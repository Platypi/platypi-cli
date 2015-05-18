/// <reference path='references.d.ts' />

import {Promise} from 'es6-promise';
import Ui from './ui/ui';

export = function(options: { args: Array<string>; input: NodeJS.ReadableStream; output: NodeJS.WritableStream; }) {
	var ui = new Ui(options),
		PROMPTS = Ui.PROMPTS;
	
	ui.info('the args are:');
	ui.info(JSON.stringify(options.args, null, 2));
	ui.error(new Error('this is a test error'));
	return ui.prompt([
		{
		    type: 'list',
		    name: 'theme',
		    message: 'What do you want to do?',
		    choices: [
				'Order a pizza',
				'Make a reservation',
				'Ask opening hours',
				'Talk to the receptionnist'
		    ]
		},
		{
		    type: 'list',
		    name: 'size',
		    message: 'What size do you need',
		    choices: [ 'Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro' ],
		    filter: function( val ) { return val.toLowerCase(); }
		},
		{ type: PROMPTS.INPUT, name: 'question1', message: 'Input here' },
		{ type: PROMPTS.CONFIRM, name: 'question2', message: 'Y/n' },
		{ 
			type: PROMPTS.EXPAND, 
			name: 'expanded', 
			message: 'Conflict on file.js',
			choices: [
				{ key: 'Y', value: 'y', name: 'Overwrite' },
				{ key: 'a', value: 'a', name: 'Overwrite this one and all next' },
				{ key: 'd', value: 'd', name: 'Show diff' },
				{ key: 'x', value: 'x', name: 'Abort' }
			],
			default: 'y'
		}
	]).then((answers) => {
		ui.info('answers:');
		ui.info(JSON.stringify(answers, null, 2));
	}, ui.error.bind(ui));
}
