import {readdir, statSync} from 'fs';
import * as path from 'path';
import * as minimist from 'minimist';
import {Promise} from 'es6-promise';
import {find, isFunction, isObject, isRegExp, isString} from 'lodash';
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

export function dirs(src: string, ignores: Array<string|RegExp> = []): Thenable<Array<string>> {
	return new Promise((resolve, reject) => {
		readdir(path.resolve(src), (err, directories) => {
			if(isObject(err)) {
				return reject(err);
			}

			var ignoreStrings = <Array<string>>ignores.filter((ignore) => {
					return isString(ignore);
				}),
				ignoreRegex = <Array<RegExp>>ignores.filter((ignore) => {
					return isRegExp(ignore);
				});

			directories = directories.filter((dir) => {
				var isDir = statSync(path.join(src, dir)).isDirectory(),
					index = ignores.indexOf(dir);
				
				if(!isDir || index > -1) {
					return false;
				}

				return !ignoreRegex.some((regex) => {
					return regex.test(dir);
				});
			});

			resolve(directories);
		});
	});
}

export function requireAll(src: string, directories: Array<string>): { [key: string]: any; } {
	var modules: { [key: string]: any; } = {};

	directories.forEach((dir) => {
		let module = require(path.resolve(src, dir));

		if(isObject(module) && isObject(module.default)) {
			modules[dir] = module.default;
		} else {
			modules[dir] = module;
		}
	});

	return modules;
}
