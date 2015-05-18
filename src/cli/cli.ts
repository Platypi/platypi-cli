/// <reference path='../references.d.ts' />

import {Promise} from 'es6-promise';
import Ui from '../ui/ui';
import lookUpCommand from '../commands/lookup';

export default class Cli {
	ui: Ui;

	constructor(options: any) {
		this.ui = options.ui;
	}

	run(environment: any): Thenable<number> {
		return Promise.resolve().then(() => {
			var args = environment.args,
				commandName = args.shift();

			var RegisteredCommand = lookUpCommand(environment.commands, commandName, args, {
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

	error(error: any) {
		this.ui.error(error);
		return 1;
	}
}
