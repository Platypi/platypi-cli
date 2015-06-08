import {Promise} from 'es6-promise';
import Base from './base';
import NotFoundError from '../errors/silent';
import Environment from '../environment/environment';

export default class Command extends Base {
	static commandName: string = 'command';
	static aliases: Array<string> = [];

	protected env: Environment;
	protected name: string;
	protected args: any;
	protected commands: Array<string>;

	constructor(options: models.IModelOptions) {
		super(options);
		this.name = (<typeof Command>this.constructor).commandName;
		this.env = new Environment(options);
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

				this.args = args;
				this.commands = args.commands.slice(0);
				return this.run();
			});
	}

	protected validate(args: IParsedArgs): any {
		return true;
	}

	protected run(): any {}
}
