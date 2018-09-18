import { exec } from 'child_process';
import Base from './base';

export default class ProcessUtils extends Base {
    exec(
        command: string,
        args: Array<string> = [],
        options?: models.IExecOptions
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cmd = [command].concat(args).join(' ');
            this.ui.info(`Running command \`${cmd}\``);

            let child = exec(cmd, options);

            child.stdout.on('data', (data: string) => {
                this.ui.log(data, this.ui.LOG_LEVEL.INFO);
            });

            child.stderr.on('data', (data: string) => {
                this.ui.error(data);
            });

            child.on('close', (code: string) => {
                this.ui.debug(`${command} exited with code ${code}`);
                resolve();
            });
        });
    }
}
