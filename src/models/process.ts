import {exec} from 'child_process';
import {Promise} from 'es6-promise';
import Command from './command';

export default class Process extends Command {
	exec(command: string, args: Array<string> = [], options?: models.IExecOptions): Thenable<any> {
		return new Promise<any>((resolve, reject) => {
			var cmd = [command].concat(args).join(' ');
			this.ui.debug(`Spawning command \`${cmd}\``);

			var child = exec(cmd, options);

			child.stdout.on('data', (data: string) => {
				this.ui.log(data, this.ui.LOG_LEVEL.INFO);
			});

			child.stderr.on('data', (data: string) => {
				this.ui.error(data);
			});

			child.on('close', (code: string) => {
				this.ui.info(`${command} exited with code ${code}`);
				resolve();
			});
		});
	}
}
