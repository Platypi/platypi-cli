import {find, isFunction} from 'lodash';
import Command from '../models/command';
import InvalidCommand from '../commands/invalid';

export function findCommand(commands: Array<typeof Command>, name: string): typeof Command {
	var command = find(commands, (command) => {
			return command.commandName === name || command.aliases.indexOf(name) > -1;
		});

	if(!isFunction(command)) {
		command = InvalidCommand;
	}

	return command;
}

export function pluralize(str: string): string {
    var last = str.slice(-2);

    if (last[1] === 'y') {
        return str.slice(0, -1) + 'ies';
    } else if (/(?:.[s|z|x]|ch|sh)$/.test(last)) {
        return str + 'es';
    }

    return str + 's';
}
