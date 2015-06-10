import {Promise} from 'es6-promise';
import Base from './base';
import Environment from '../environment/environment';
import ValidationError from '../errors/validation';
import NotImplementedError from '../errors/notimplemented';

export default class Command extends Base {
	static commandName: string = 'command';
	static aliases: Array<string> = [];

	protected env: Environment;
	protected args: any;
	protected commands: Array<string>;

	constructor(options: models.IModelOptions) {
		super(options);
		this.env = new Environment(options);
	}

	help(command: string): void {
		this.ui.info(`No help entry for command \`${command}\`.`);
	}

	validateAndRun(args: IParsedArgs): Thenable<any> {
		if(this.needsHelp(args)) {
			return Promise.resolve(this.help(args.commands[0]));
		}

		return Promise.resolve(this.validate(args))
			.then((valid: boolean) => {
				var command = args.commands.shift();
				if(valid === false) {
					var message: string;

					if(this.utils.isString(command)) {
						message = `\`${command}\` doesn't have enough information to complete. For more information see \`platypi ${command} -h\``;
					} else {
						message = 'Please specify a command. Use `platypi -h` for more information.';
					}

					throw new ValidationError(message);
				}

				this.args = args;
				this.commands = args.commands.slice(0);
				return this.run();
			});
	}

	protected validate(args: IParsedArgs): any {
		return true;
	}

	protected run(): any {
		throw new NotImplementedError(`The command exists, but has not been implemented.`);
	}
	
	protected needsHelp(args: IParsedArgs) {
		return args.commands.length === 1 && (args.hasOwnProperty('h') || args.hasOwnProperty('help'));
	}
}
