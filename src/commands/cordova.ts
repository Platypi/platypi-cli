import * as path from 'path';
import Command from '../models/command';

class Cordova extends Command {
	static commandName: string = 'cordova';
	private defaultComponent: IComponent = {
		component: path.resolve(__dirname, '..', 'cordova'),
		command: 'create',
		prefix: 'plat-cordova-'
	};

	help(command: string): any {
		return this.process.exec('cordova', this.args.slice(1), {
			cwd: path.resolve(this.project.root, 'app/cordova')
		});
	}

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
		return this.process.exec('cordova', this.args, {
			cwd: path.resolve(this.project.root, 'app/cordova')
		});
	}
}

export = Cordova;
