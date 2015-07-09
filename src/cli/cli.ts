import * as minimist from 'minimist';
import {Promise} from 'es6-promise';
import {findCommand} from '../utils/utils';
import Base from '../models/base';

export default class Cli extends Base {
    run(environment: IEnvironment): Thenable<number> {
        return Promise.resolve().then(() => {
            var args = minimist(environment.args);

            var RegisteredCommand = findCommand(environment.commands, args._[0]);

            var command = new RegisteredCommand({
                ui: this.ui,
                project: this.project
            });

            return command.validateAndRun(environment.args);
        }).catch(this.error.bind(this));
    }

    error(error: any): number {
        this.ui.error(error);
        return 0;
    }
}
