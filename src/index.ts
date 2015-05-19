/// <reference path='references.d.ts' />

import {Promise} from 'es6-promise';
import Ui from './ui/ui';
import Cli from './cli/cli';
import Project from './models/project';
import * as utils from 'lodash';
import * as uuid from 'node-uuid';

var ConfigStore = require('configstore'),
	pkg = require('../package.json'),
	commands = require('require-all')({
		dirname: __dirname + '/commands',
		filter: /^(.*)\.js$/
	});

function clientId() {
	var config =  ConfigStore(pkg.name),
		id = config.get('client-id');
		
	if(!utils.isString(id)) {
		id = uuid.v4().toString();
		config.set('client-id', id);
	}

	return id;
}

function getLogLevel(args: Array<string>): string|number {
	var level: string,
		index = args.indexOf('--loglevel');
	
	if(index > -1) {
		return args[index + 1];
	} else if(args.indexOf('--verbose') > -1) {
		return Ui.LOG_LEVEL.TRACE;
	} else if(args.indexOf('--silent') > -1) {
		return Ui.LOG_LEVEL.ERROR;
	}
}

export = function(options: { args: Array<string>; input: NodeJS.ReadableStream; output: NodeJS.WritableStream; }) {
	var ui = new Ui(<ui.IOptions>utils.extend({
			logLevel: getLogLevel(options.args)
		}, options)),
		environment: any = {
			commands: commands,
			args: options.args
		};

	return Project.project(process.cwd(), ui).then((project) => {
		return (new Cli({
			ui: ui,
			project: project
		})).run(environment);
	}).then(undefined, ui.error.bind(ui));
};
