import Ui from './ui/ui';
import Cli from './cli/cli';
import Project from './models/project';
import utils from 'lodash';

export { default as Command } from './models/command';
export { default as Generator } from './models/generator';

let commands = require('require-all')({
    dirname: __dirname + '/commands',
    filter: /^((?!invalid).*)\.js$/,
});

function getLogLevel(args: Array<string>): string | number {
    let index = args.indexOf('--loglevel');

    if (index > -1) {
        return args[index + 1];
    } else if (args.indexOf('--verbose') > -1) {
        return Ui.LOG_LEVEL.TRACE;
    } else if (args.indexOf('--silent') > -1) {
        return Ui.LOG_LEVEL.WARN;
    }
}

export default function(options: {
    args: Array<string>;
    input: NodeJS.ReadableStream;
    output: NodeJS.WritableStream;
}): Promise<any> {
    let logLevel = getLogLevel(options.args) || Ui.LOG_LEVEL.INFO;

    if (utils.isString(logLevel)) {
        logLevel = (<string>logLevel).toUpperCase();
    }

    let ui = new Ui(<ui.IOptions>utils.extend(
            {
                logLevel: logLevel,
            },
            options
        )),
        environment: IEnvironment = {
            commands: commands,
            args: options.args,
        };

    return Project.project(ui, process.cwd())
        .then((project) => {
            return new Cli({
                ui: ui,
                project: project,
            }).run(environment);
        })
        .then(undefined, ui.error.bind(ui));
}
