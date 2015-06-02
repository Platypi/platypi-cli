import {Promise} from 'es6-promise';
import Command from '../models/command';
import {isFunction, find} from 'lodash';
import Base from '../models/base';

function findCommand(commands: Array<typeof Command>, name: string, args: Array<string>, options: any): typeof Command {
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

export default class Cli extends Base {
	run(environment: IEnvironment): Thenable<number> {
		return Promise.resolve().then(() => {
			var args = environment.args || [],
				commandName = args.shift();

			var RegisteredCommand = findCommand(environment.commands, commandName, args, {
				ui: this.ui
			});

			var command = new RegisteredCommand({
				ui: this.ui,
				project: this.project
			});

			return command.validateAndRun({
				args: args
			});
		}).catch(this.error.bind(this));
	}

	error(error: any): number {
		this.ui.error(error);
		return 1;
	}
}
