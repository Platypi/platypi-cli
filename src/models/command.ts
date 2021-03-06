import { EOL } from 'os';
import Base from './base';
import Environment from '../environment/environment';
import ValidationError from '../errors/validation';
import NotImplementedError from '../errors/notimplemented';
import minimist from 'minimist';
import FileUtils from './fileutils';
import ProcessUtils from './processutils';
import { wrap } from '../utils/utils';

export default class Command extends Base {
    static commandName: string = 'command';
    static aliases: Array<string> = [];

    protected needsProject: boolean = false;
    protected env: Environment;
    protected parent: Command;
    protected args: Array<string>;
    protected options: models.IParsedArgs = {};
    protected commands: Array<string>;
    protected file: FileUtils;
    protected process: ProcessUtils;

    private _originalArgs: Array<string>;
    private _options: { [key: string]: models.ICommandOption } = {};

    constructor(options: models.ICommandOptions) {
        super(options);

        this.file = this.instantiate(FileUtils, options);
        this.process = this.instantiate(ProcessUtils, options);
        this.env = new Environment(options);
        this.parent = options.parent;
        this.option('help', {
            aliases: ['h'],
            description: 'Get help information for this command',
        });

        this.option('verbose', {
            description: 'Print all log statements',
        });

        this.option('silent', {
            description: 'Print only warnings and errors',
        });

        this.option('loglevel', {
            description:
                'Print at and above a particular level                (ERROR > WARN > INFO > DEBUG > TRACE)',
        });
    }

    help(command?: string): Promise<void> {
        if (!this.utils.isEmpty(command)) {
            this.ui.help(
                `Help for command \`${this.buildFullCommand().join(' ')}\`:` +
                    EOL
            );
        }

        return Promise.resolve(this.generalHelp(command))
            .then(() => {
                return this.commandsHelp(command);
            })
            .then(() => {
                return this.aliasesHelp(command);
            })
            .then(() => {
                return this.optionsHelp(command);
            })
            .then(() => {
                this.ui.help('');
            });
    }

    validateAndRun(commandArgs: Array<string>): Promise<any> {
        if (this.needsProject && !this.utils.isString(this.project.root)) {
            return Promise.reject(
                new ValidationError(
                    `This command can only be run inside a project.`
                )
            );
        }

        this.args = commandArgs.slice(0);
        this._originalArgs = this.args.slice(0);
        this.defineOptions();
        this.parseOptions();

        let commands = (this.commands = (<any>this.options)._);

        if (this.needsHelp()) {
            return Promise.resolve(this.help(commands[0]));
        }

        return Promise.resolve(this.askQuestions())
            .then(this.validate.bind(this))
            .then((valid: boolean) => {
                let command = commands.shift();
                this.args.splice(this.args.indexOf(command), 1);
                if (valid === false) {
                    let message: string;

                    if (this.utils.isString(command)) {
                        message = `\`${command}\` doesn't have enough information to complete. For more information see \`platypi ${command} -h\``;
                    } else {
                        message =
                            'Please specify a command. Use `platypi -h` for more information.';
                    }

                    throw new ValidationError(message);
                }

                return this.run();
            });
    }

    protected defineOptions(): void {}

    protected askQuestions(): any {}

    protected validate(): any {
        return true;
    }

    protected run(): any {
        throw new NotImplementedError(
            `The command \`${
                (<any>this.constructor).commandName
            }\` exists, but has not been implemented.`
        );
    }

    protected buildFullCommand(): Array<string> {
        let parent: Command = this;

        while (this.utils.isObject(parent.parent)) {
            parent = parent.parent;
        }

        return [this.project.bin].concat(<any>minimist(parent._originalArgs)._);
    }

    protected generalHelp(command: string): any {
        this.ui.help(`
  General Usage:

    ${this.buildFullCommand().join(' ')} [...options]`);
    }

    protected commandsHelp(command: string): any {}

    protected aliasesHelp(command: string): any {
        let aliases: Array<string> = (<any>this).constructor.aliases;

        if (this.utils.isArray(aliases)) {
            aliases = aliases.slice(0);

            let commandName = (<any>this.constructor).commandName;

            if (this.utils.isString(commandName)) {
                aliases.unshift(commandName);
            }

            this.utils.remove(aliases, (alias) => alias === command);

            if (aliases.length > 0) {
                this.ui.help(`
  Aliases:
    ${aliases.join(', ')}`);
            }
        }
    }

    protected optionsHelp(command: string): any {
        this.ui.help(`
  Options:`);
        let options = this._options,
            longest = 0,
            lines: Array<{
                command: string;
                description: string;
                defaults?: any;
            }> = [];

        this.utils.forEach(options, (option) => {
            let prepend = '--',
                aliasPrepend = '-';

            if (option.defaults === true) {
                prepend += 'no-';
                aliasPrepend += '-no-';
            }

            let commands: string;

            if (
                this.utils.isArray(option.aliases) &&
                option.aliases.length > 0
            ) {
                commands = `${option.aliases
                    .map((alias) => `${aliasPrepend}${alias}`)
                    .join(', ')}, ${prepend}${option.name}`;
            } else {
                commands = `${prepend}${option.name}`;
            }

            if (commands.length > longest) {
                longest = commands.length;
            }

            lines.push({
                command: commands,
                description: option.description,
                defaults: option.defaults,
            });
        });

        let utils = this.utils,
            isNull = (val: any) => {
                return utils.isNull(val) || utils.isUndefined(val);
            },
            isString = utils.isString,
            isEmpty = utils.isEmpty,
            isBoolean = utils.isBoolean;

        this.utils.forEach(lines, (line) => {
            let padding: string = EOL + this.file.spaces(longest + 10);
            this.ui.help(
                `    ${line.command}${(<any>this.utils)
                    .fill(Array(longest - line.command.length + 4), ' ')
                    .join('')}${wrap(line.description, 58, padding)}`
            );

            if (
                !isNull(line.defaults) &&
                !(isString(line.defaults) && isEmpty(line.defaults)) &&
                !isBoolean(line.defaults)
            ) {
                this.ui.help(
                    `      default: ${line.defaults}
`
                );
            }
        });
    }

    protected parseOptions(): void {
        let options = this._options;

        this.options = <any>minimist(this.args, {
            '--': true,
            default: <any>this.utils.reduce(
                options,
                (prev, current) => {
                    prev[current.name] = current.defaults;
                    return prev;
                },
                {}
            ),
            alias: <any>this.utils.reduce(
                options,
                (prev, current) => {
                    prev[current.name] = current.aliases;
                    return prev;
                },
                {}
            ),
        });
    }

    protected option(name: string, config: models.ICommandOption): Command {
        if (!this.utils.isObject(config)) {
            config = {};
        }

        this.utils.defaults(config, <models.ICommandOption>{
            name: name,
            aliases: [],
            description: 'Description for ' + name,
            defaults: undefined,
            hide: false,
        });

        let _options = this._options,
            options = this.options;

        if (!this.utils.isObject(_options[name])) {
            _options[name] = config;
        }

        if (!this.utils.isObject(options[name])) {
            options[name] = config.defaults;
        }

        return this;
    }

    protected needsHelp(): boolean {
        return this.options.help && this.commands.length <= 1;
    }
}
