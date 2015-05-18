/// <reference path='references.d.ts' />

import {Promise} from 'es6-promise';
import Ui from './ui/ui';
import Cli from './cli/cli';
import * as utils from 'lodash';
import * as uuid from 'node-uuid';

var ConfigStore = require('configstore'),
	pkg = require('../package.json'),
	commands = require('require-all')({
		dirname: __dirname + '/commands',
		filter: /^((.*)\.js$/
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
	var ui = new Ui(<models.ui.IOptions>utils.extend({
			logLevel: getLogLevel(options.args)
		}, options)),
		environment = {
			commands: commands,
			args: options.args
		};

	return (new Cli({
		ui: ui
	})).run(environment);
};