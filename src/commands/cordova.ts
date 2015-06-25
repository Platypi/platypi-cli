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
		return super.help(command).then(() => {
			this.ui.help(`Here is the \`cordova\` help:`);
			this.ui.help(`..........................................................`);
			return this.exec(this.args);
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
		return this.exec(this.args);
	}

	protected exec(args: Array<string>): Thenable<any> {
		if(args[0] === 'cordova') {
			args = args.slice(1);
		}

		return this.process.exec('cordova', args, {
			cwd: path.resolve(this.project.root, 'cordova')
		});
	}
}

export = Cordova;
