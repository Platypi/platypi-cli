import {Promise} from 'es6-promise';
import Ui from './ui/ui';
import Cli from './cli/cli';
import Project from './models/project';
import Command from './models/command';
import Generator from './models/generator';
import * as utils from 'lodash';
import * as uuid from 'node-uuid';

export {default as Command} from './models/command';
export {default as Generator} from './models/generator';

let ConfigStore = require('configstore'),
    pkg = require('../package.json'),
    commands = require('require-all')({
        dirname: __dirname + '/commands',
        filter: /^((?!invalid).*)\.js$/
    });

function clientId(): string {
    let config = ConfigStore(pkg.name),
        id = config.get('client-id');

    if (!utils.isString(id)) {
        id = uuid.v4().toString();
        config.set('client-id', id);
    }

    return id;
}

function getLogLevel(args: Array<string>): string|number {
    let level: string,
        index = args.indexOf('--loglevel');

    if (index > -1) {
        return args[index + 1];
    } else if (args.indexOf('--verbose') > -1) {
        return Ui.LOG_LEVEL.TRACE;
    } else if (args.indexOf('--silent') > -1) {
        return Ui.LOG_LEVEL.WARN;
    }
}

export default function(options: { args: Array<string>; input: NodeJS.ReadableStream; output: NodeJS.WritableStream; }): Thenable<any> {
    let logLevel = getLogLevel(options.args) || Ui.LOG_LEVEL.INFO;

    if (utils.isString(logLevel)) {
        logLevel = (<string>logLevel).toUpperCase();
    }

    let ui = new Ui(<ui.IOptions>utils.extend({
        logLevel: logLevel
    }, options)),
        environment: IEnvironment = {
            commands: commands,
            args: options.args
        };

    console.log('test');

    return Project.project(ui, process.cwd()).then((project) => {
        return (new Cli({
            ui: ui,
            project: project
        })).run(environment);
    }).then(undefined, ui.error.bind(ui));
};
