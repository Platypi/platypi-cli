import {Promise} from 'es6-promise';
import Base from './base';
import SilentError from '../errors/silent';

export default class Command extends Base {
	static commandName: string = 'command';
	static aliases: Array<string> = [];

	protected Promise = Promise;

	help(): void {
		this.ui.info(`No help entry for command \`${Command.commandName}\`.`);
	}
	
	validateAndRun(options: any): Thenable<any> {
		return Promise
			.resolve(this.validate(options))
			.then((valid: boolean) => {
				if(valid === false) {
					// fail
				}
				
				return this.run();
			});
	}

	protected validate(options: any): any {
		return Promise.resolve(true);
	}

	protected run(): any {
		throw new SilentError(`The specified command \`${Command.commandName}\` is invalid. For available commands see \`platypi help\``);
	}
}
