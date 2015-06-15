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
	protected parent: Command;
	protected args: Array<string>;
	protected options: models.IParsedArgs = {};
	protected commands: Array<string>;

	private _originalArgs: Array<string>;
	private _options: { [key: string]: models.ICommandOption; } = {};

	constructor(options: models.ICommandOptions) {
		super(options);
		this.env = new Environment(options);
		this.parent = options.parent;
		this.option('help', {
			aliases: ['h'],
			description: 'Get help information for this command'
		});

		this.option('verbose', {
			description: 'Print all log statements'
		});

		this.option('silent', {
			description: 'Print only warnings and errors'
		});
	}

	help(command: string): void {
		this.ui.info(`Help for command \`${this.buildFullCommand().join(' ')}\`:\n`);
		this.aliasesHelp(command);
		this.optionsHelp();
	}

	validateAndRun(commandArgs: Array<string>): Thenable<any> {
		this.args = commandArgs.slice(0);
		this._originalArgs = this.args.slice(0);
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
		throw new NotImplementedError(`The command \`${(<any>this.constructor).commandName}\` exists, but has not been implemented.`);
	}

	protected buildFullCommand(): Array<string> {
		var parent = this;

		while(this.utils.isObject(parent.parent)) {
			parent = parent.parent;
		}

		return <any>minimist(parent._originalArgs)._;
	}

	protected aliasesHelp(command: string): void {
		var aliases: Array<string> = (<any>this).constructor.aliases;

		if(this.utils.isArray(aliases)) {
			aliases = aliases.slice(0);

			var commandName = (<any>this.constructor).commandName;

			if(this.utils.isString(commandName)) {
				aliases.unshift(commandName);
			}

			this.utils.remove(aliases, alias => alias === command);

			if(aliases.length > 0) {
				this.ui.logLine(`\n  Aliases:\n`, this.ui.LOG_LEVEL.ERROR);
				this.ui.logLine(`    ${aliases.join(', ')}`, this.ui.LOG_LEVEL.ERROR);
			}
		}
	}

	protected optionsHelp(): void {
		this.ui.info(`\n  Options:\n`);
		var options = this._options,
			longest = 0,
			lines: Array<{ command: string; description: string; defaults?: any; }> = [];

		this.utils.forEach(options, (option) => {
			var prepend = '--',
				aliasPrepend = '-';

			if(option.defaults === true) {
				prepend +='no-';
				aliasPrepend += '-no-';
			}

			var commands: string;

			if(this.utils.isArray(option.aliases) && option.aliases.length > 0) {
				commands = `${option.aliases.map(alias => `${aliasPrepend}${alias}`).join(', ')}, ${prepend}${option.name}`;
			} else {
				commands = `${prepend}${option.name}`;
			}

			if(commands.length > longest) {
				longest = commands.length;
			}

			lines.push({ command: commands, description: option.description, defaults: option.defaults });
		});

		this.utils.forEach(lines, (line) => {
			this.ui.logLine(`    ${line.command}${(<any>this.utils).fill(Array(longest - line.command.length + 4), ' ').join('')}${line.description}`, this.ui.LOG_LEVEL.ERROR);

			if(!this.utils.isEmpty(line.defaults) && line.defaults !== true) {
				this.ui.logLine(`        default: ${line.defaults}\n`, this.ui.LOG_LEVEL.ERROR);
			}
		});
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
