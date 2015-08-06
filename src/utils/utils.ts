import * as path from 'path';
import {find, isFunction, isObject, isString} from 'lodash';
import {EOL} from 'os';
import Command from '../models/command';
import InvalidCommand from '../commands/invalid';

export function findCommand(commands: Array<typeof Command>, name: string): typeof Command {
    var command = find(commands, (command) => {
        if(isFunction((<any>command).default)) {
            command = (<any>command).default;
        }

        return command.commandName === name || command.aliases.indexOf(name) > -1;
    });

    if(isObject(command) && isFunction((<any>command).default)) {
        command = (<any>command).default;
    } else if (!isFunction(command)) {
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

export function wrap(str: string, width: number = 60, brk: string = EOL, cut: boolean = false): string {
    if (!isString(str)) {
        return str;
    }

    var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)'),
        match = str.match(new RegExp(regex, 'g'));

    if (match.length > 1) {
        return match.join(brk) + EOL;
    }

    return match.join(brk);
}

export function isAbsolute(srcPath: string): boolean {
    if (!isString(srcPath)) {
        return false;
    }

    return path.resolve(srcPath) === path.normalize(srcPath);
}
