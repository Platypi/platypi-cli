import Command from '../models/command';
import NotFoundError from '../errors/notfound';

export default class Invalid extends Command {
	static commandName: string = 'invalid';

	options: IOptions;

	help(): any {
		this.ui.help(`Platypi CLI \`v${this.version}\` Help`);
		this.ui.help(`
  General Usage:

    plat <command> [...options]

  Commands:

    plat create -h

  Options:

    -h    Print help for any command
`);
	}

	defineOptions(): void {
		this.option('version', {
			aliases: ['v'],
			description: 'Print the version of this CLI'
		});
	}

	validate(): any {
		var command = this.commands[0];
		if(this.utils.isString(command)) {
			throw new NotFoundError(`\`${command}\` is not a valid command.`);
		}
	}

	run(): any {
		if(!!this.options.version) {
			this.ui.help(`Platypi CLI \`v${this.version}\``);
		} else {
			this.help();
		}
	}

	protected aliasesHelp(command: string): void {}

	protected get version(): string {
		if(this.utils.isObject(this.project) && this.utils.isString(this.project.version)) {
			return this.project.version;
		}

		return require('../../package.json').version;
	}
}

interface IOptions extends models.IParsedArgs {
	version: boolean;
}
