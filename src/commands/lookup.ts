/// <reference path="../references.d.ts" />
import Command from '../models/command';
import * as utils from 'lodash';

export default function(commands: Array<typeof Command>, name: string, args: Array<string>, options: any) {
	var ui = options.ui,
		command = utils.find(commands, (command) => {
			return command.name === name || command.aliases.indexOf(name) > -1;
		});

	if(!utils.isFunction(command)) {
		command = Command;
		command.name = name;
	}
	
	return command;
};
