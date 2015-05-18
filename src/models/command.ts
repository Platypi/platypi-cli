/// <reference path="../references.d.ts" />

import Base from './base';
import SilentError from '../errors/silent';

export default class Command extends Base {
	static name: string = 'command';
	static aliases: Array<string> = [];

	help() {
		this.ui.info(`No help entry for command ${Command.name}.`);
	}
	
	run(options: any) {
		throw new SilentError(`The specified command ${Command.name} is invalid. For available commands see \`platypi help\``);
	}
}
