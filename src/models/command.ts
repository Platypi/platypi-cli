import {Promise} from 'es6-promise';
import Base from './base';
import NotFoundError from '../errors/silent';

export default class Command extends Base {
	static commandName: string = 'command';
	static aliases: Array<string> = [];

	protected Promise = Promise;
	protected name: string;

	constructor(options) {
		super(options);
		this.name = (<typeof Command>this.constructor).commandName;
	}

	help(): void {
		this.ui.info(`No help entry for command \`${this.name}\`.`);
	}
	
	validateAndRun(args: IParsedArgs): Thenable<any> {
		var commands = args.commands;

		if(commands[0] === 'help') {
			return Promise.resolve(this.help());
		}

		return Promise
			.resolve(this.validate(args))
			.then((valid: boolean) => {
				if(valid === false) {
					var message: string;

					if(this.utils.isString(this.name)) {
						message = `\`${this.name}\` doesn't have enough information to complete. For more information see \`platypi ${this.name} help\``;
					} else {
						message = 'Please specify a command. Use `platypi help` for more information.';
					}

					throw new NotFoundError(message);
				}

				return this.run();
			});
	}

	protected validate(args: IParsedArgs): any {
		return Promise.resolve(false);
	}

	protected run(): any {
		throw new NotFoundError(`The specified command \`${this.name}\` is invalid. For available commands see \`platypi help\``);
	}
}
