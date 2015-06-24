import * as path from 'path';
import Command from '../models/command';

class Cordova extends Command {
	static commandName: string = 'cordova';
	private defaultComponent: IComponent = {
		component: path.resolve(__dirname, '..', 'cordova'),
		command: 'create',
		prefix: 'plat-cordova-'
	};

	generalHelp(command: string): any {
		var baseCommand = this.buildFullCommand().join(' ');

		return this.env.listCommands(this.defaultComponent, this.commands[0]).then((commands) => {
			this.ui.help(`
  General Usage:

    ${baseCommand} <component> [...options]

  Commands:
`);
			commands.forEach((c) => {
				this.ui.help(`    ${baseCommand} ${c} -h`);
			});
		});
	}

	run(): any {
		return this.env.command(this.defaultComponent, this.commands[0], this)
			.then(generator => generator.validateAndRun(this.args));
	}
}

export = Cordova;
