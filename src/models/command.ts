/// <reference path="../references.d.ts" />

import Base from './base';
import SilentError from '../errors/silent';

export default class Command extends Base {
	static commandName: string = 'command';
	static aliases: Array<string> = [];

	help() {
		this.ui.info(`No help entry for command \`${Command.commandName}\`.`);
	}
	
	run(options: any) {
		throw new SilentError(`The specified command \`${Command.commandName}\` is invalid. For available commands see \`platypi help\``);
	}
}
