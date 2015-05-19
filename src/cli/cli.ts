/// <reference path='../references.d.ts' />

import {Promise} from 'es6-promise';
import Ui from '../ui/ui';
import Command from '../models/command';
import {isFunction, find} from 'lodash';

function findCommand(commands: Array<typeof Command>, name: string, args: Array<string>, options: any) {
	var ui = options.ui,
		command = find(commands, (command) => {
			return command.commandName === name || command.aliases.indexOf(name) > -1;
		});

	if(!isFunction(command)) {
		command = Command;
		command.commandName = name;
	}
	
	return command;
};

export default class Cli {
	ui: Ui;

	constructor(options: any) {
		this.ui = options.ui;
	}

	run(environment: any): Thenable<number> {
		return Promise.resolve().then(() => {
			var args = environment.args,
				commandName = args.shift();

			var RegisteredCommand = findCommand(environment.commands, commandName, args, {
				ui: this.ui
			});
			
			var command = new RegisteredCommand({
				ui: this.ui
			});
			
			return command.run({
				args: args
			});
		}).catch(this.error.bind(this));
	}

	error(error?: any) {
		this.ui.error(error);
		return 1;
	}
}
