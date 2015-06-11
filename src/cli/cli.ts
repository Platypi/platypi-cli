import {Promise} from 'es6-promise';
import Command from '../models/command';
import InvalidCommand from '../commands/invalid';
import {isFunction, find} from 'lodash';
import * as minimist from 'minimist';
import Base from '../models/base';

function findCommand(commands: Array<typeof Command>, name: string, args: minimist.ParsedArgs, options: any): typeof Command {
	var ui = options.ui,
		command = find(commands, (command) => {
			return command.commandName === name || command.aliases.indexOf(name) > -1;
		});

	if(!isFunction(command)) {
		command = InvalidCommand;
	}

	return command;
};

export default class Cli extends Base {
	run(environment: IEnvironment): Thenable<number> {
		return Promise.resolve().then(() => {
			var args = minimist(environment.args);

			var RegisteredCommand = findCommand(environment.commands, args._[0], args, {
				ui: this.ui
			});

			var command = new RegisteredCommand({
				ui: this.ui,
				project: this.project
			});

			return command.validateAndRun(environment.args);
		}).catch(this.error.bind(this));
	}

	error(error: any): number {
		this.ui.error(error);
		return 0;
	}
}
