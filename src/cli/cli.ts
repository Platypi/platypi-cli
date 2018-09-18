import minimist from 'minimist';
import { findCommand } from '../utils/utils';
import Base from '../models/base';

export default class Cli extends Base {
    run(environment: IEnvironment): Promise<number> {
        return Promise.resolve()
            .then(() => {
                let args = minimist(environment.args);

                let RegisteredCommand = findCommand(
                    environment.commands,
                    args._[0]
                );

                let command = new RegisteredCommand({
                    ui: this.ui,
                    project: this.project,
                });

                return command.validateAndRun(environment.args);
            })
            .catch(this.error.bind(this));
    }

    error(error: any): number {
        this.ui.error(error);
        return 0;
    }
}
