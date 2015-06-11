import {Promise} from 'es6-promise';
import Base from './base';
import Environment from '../environment/environment';
import ValidationError from '../errors/validation';
import NotImplementedError from '../errors/notimplemented';
import * as minimist from 'minimist';

export default class Command extends Base {
	static commandName: string = 'command';
	static aliases: Array<string> = [];

	protected env: Environment;
	protected args: Array<string> = [];
	protected options: models.IParsedArgs = {};
	protected commands: Array<string>;

	private _options: { [key: string]: models.ICommandOption; } = {};

	constructor(options: models.IModelOptions) {
		super(options);
		this.env = new Environment(options);

		this.option('help', {
			aliases: ['h'],
			description: 'Get help information for this command'
		});
	}

	help(command: string): void {
		this.ui.info(`Help for command \`${command}\`:`);
		this.optionsHelp();
	}

	protected optionsHelp(): void {
		var options = this._options;
		this.utils.forEach(options, (option) => {
			if(this.utils.isArray(option.aliases)) {
				this.ui.info(`    ${option.aliases.map(alias => `-${alias}`).join(', ')}, --${option.name}                ${option.description}`);
			} else {
				this.ui.info(`    \`--${option.name}\`: ${option.description}`);
			}
			if(!this.utils.isUndefined(option.defaults)) {
				this.ui.info(`        default: ${option.defaults}`);
			}
		});
	}

	validateAndRun(commandArgs: Array<string>): Thenable<any> {
		this.args = commandArgs;
		this.defineOptions();
		this.parseOptions();

		var options = this.options,
			commands = this.commands = (<any>this.options)._;

		if(this.needsHelp()) {
			return Promise.resolve(this.help(commands[0]));
		}

		return Promise.resolve(this.askQuestions())
			.then(this.validate.bind(this))
			.then((valid: boolean) => {
				var command = commands.shift();
				this.args.splice(this.args.indexOf(command), 1);
				if(valid === false) {
					var message: string;

					if(this.utils.isString(command)) {
						message = `\`${command}\` doesn't have enough information to complete. For more information see \`platypi ${command} -h\``;
					} else {
						message = 'Please specify a command. Use `platypi -h` for more information.';
					}

					throw new ValidationError(message);
				}

				return this.run();
			});
	}

	protected defineOptions(): void { }

	protected askQuestions(): any { }

	protected validate(): any {
		return true;
	}

	protected run(): any {
		throw new NotImplementedError(`The command exists, but has not been implemented.`);
	}

	protected parseOptions(): void {
		var options = this._options;

		this.options = <any>minimist(this.args, {
			'--': true,
			default: <any>this.utils.reduce(options, (prev, current) => {
				prev[current.name] = current.defaults;
				return prev;
			}, {}),
			alias: <any>this.utils.reduce(options, (prev, current) => {
				prev[current.name] = current.aliases;
				return prev;
			}, {})
		});
	}

	protected option(name: string, config: models.ICommandOption): Command {
		if(!this.utils.isObject(config)) {
			config = {};
		}

		this.utils.defaults(config, <models.ICommandOption>{
			name: name,
			aliases: [],
			description: 'Description for ' + name,
			defaults: undefined,
			hide: false
		});

		var _options = this._options,
			options = this.options;

		if(!this.utils.isObject(_options[name])) {
			_options[name] = config;
		}

		if(!this.utils.isObject(options[name])) {
			options[name] = config.defaults;
		}

		return this;
	}

	protected needsHelp(): boolean {
		return this.options.help && this.commands.length <= 1;
	}
}
