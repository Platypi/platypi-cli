import * as path from 'path';
import {Promise} from 'es6-promise';
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

		var arg = args[0],
			promise: Thenable<void>;

		if(arg === 'build' || arg === 'compile') {
			promise = this.modifyIndex();
		} else {
			promise = Promise.resolve<void>();
		}

		return promise.then(() => {
			return this.process.exec('cordova', args, {
				cwd: path.resolve(this.project.root, 'cordova')
			});
		});
	}

	protected modifyIndex(): Thenable<void> {
		var cordova = '<script type="text/javascript" src="cordova.js"></script>',
			haveCordova = false,
			scriptStart: number = -1,
			file = path.resolve(this.project.root, 'cordova/www/index.html');

		return this.file.read(file).then((data) => {
			var eol = this.file.eol(data),
				lines = data.split(eol);

			haveCordova = lines.some((line, index) => {
				if(line.indexOf('src="cordova.js"') > -1) {
					return true;
				}

				if(scriptStart === -1 && line.indexOf('<script') > -1) {
					scriptStart = index;
				}
			});

			if(!haveCordova) {
				var spaces = (/^(\s*)/.exec(lines[scriptStart]) || ['',''])[1];

				lines.splice(scriptStart, 0, spaces + cordova);
			}

			return this.file.write(file, lines.join(eol));
		});
	}
}

export = Cordova;
