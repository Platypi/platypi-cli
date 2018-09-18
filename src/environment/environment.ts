import * as path from 'path';
import * as fs from 'fs-extra';
import Base from '../models/base';
import Command from '../models/command';
import Generator from '../models/generator';
import NotFoundError from '../errors/notfound';
import FileUtils from '../models/fileutils';
import {findCommand, isAbsolute} from '../utils/utils';

let win32 = process.platform === 'win32';

export default class Environment extends Base {
    fileUtils: FileUtils;

    constructor(options: models.IModelOptions) {
        super(options);

        this.fileUtils = this.instantiate(FileUtils, options);
    }

    command(defaults: IComponent, command: string = '', parent?: Command): Promise<any> {
        defaults = this.utils.clone(defaults);
        let component = this.parseComponent(defaults, command),
            prefix = defaults.prefix;

        return this._commands(component.component, prefix).then((response) => {
            if (!this.utils.isEmpty(response.commands)) {
                return response;
            }

            component.command = component.component;
            component.component = defaults.component;
            return this._commands(component.component, prefix);
        }).then((response) => {
            let commands = response.commands,
                Com = commands[component.command];

            if (!this.utils.isObject(Com)) {
                Com = findCommand(this.utils.values<typeof Command>(commands), component.command);
            }

            try {
                return this.instantiate(Com, {
                    env: this,
                    parent: parent,
                    directory: response.directory
                });
            } catch (e) {
                if (e.message.indexOf('Cannot find module') > -1) {
                    throw new NotFoundError('Unrecognized component: `' + command + '`');
                }

                throw e;
            }
        });
    }

    listCommands(defaults: IComponent, command: string = ''): Promise<Array<string>> {
        defaults = this.utils.clone(defaults);
        let component = this.parseComponent(defaults, command),
            prefix = defaults.prefix;

        return this._commands(component.component, prefix).then((response) => {
            if (!this.utils.isEmpty(response.commands)) {
                return response;
            }

            component.command = component.component;
            component.component = defaults.component;
            return this._commands(component.component, prefix);
        }).then((response) => {
            return this.utils.keys(response.commands);
        });
    }

    protected parseComponent(defaults: IComponent, command: string): IComponent {
        if (this.utils.isEmpty(command)) {
            command = defaults.command;
        }

        let components = command.split(/:(?!\\|\/)/),
            component: string;

        if (components.length > 0) {
            component = components.shift();
        } else {
            component = defaults.component;
        }

        command = components.shift();

        if (this.utils.isEmpty(command)) {
            command = defaults.command;
        }

        return { component, command, prefix: defaults.prefix };
    }

    private getNpmPaths(): Array<string> {
        let paths: Array<string> = [];

        process.cwd().split(path.sep).forEach((part, index, parts) => {
            let lookup = path.join.apply(path, parts.slice(0, index + 1).concat(['node_modules']));

            if (!win32) {
                lookup = '/' + lookup;
            }

            paths.push(lookup);
        });

        if (process.env.NODE_PATH) {
            paths = this.utils.compact<string>(process.env.NODE_PATH.split(path.delimiter)).concat(paths);
        } else {
            if (win32) {
                paths.push(path.join(process.env.APPDATA, 'npm/node_modules'));
            } else {
                paths.push('/usr/lib/node_modules');
            }
        }

        return paths.reverse();
    }

    private _commands(component: string, prefix: string): Promise<{ commands: { [key: string]: typeof Command; }; directory: string; }> {
        return this._find(this.getNpmPaths(), component, prefix).then((info) => {
            component = info.component;
            let values = info.values,
                commands: { [key: string]: typeof Command; } = this.fileUtils.requireAll(component, values);

            this.utils.forEach(commands, (command, name) => {
                command.commandName = name;
            });

            return {
                commands: commands,
                directory: component
            };
        }, () => {
            return {
                commands: <any>{},
                directory: ''
            };
        });
    }

    private _find(paths: Array<string>, component: string, prefix: string): Promise<{ component: string, values: Array<string> }> {
        let absolute = component,
            isRelative = !isAbsolute(absolute);

        if (isRelative) {
            absolute = paths.shift() + path.sep + prefix + component;
        }

        return this.fileUtils.dir(absolute, [
            'templates',
            'node_modules',
            /^_.*$/,
            /^\..*$/
        ]).then((values) => {
            return { component: absolute, values };
        }, (err) => {
            if (this.utils.isEmpty(paths) || !isRelative) {
                throw err;
            }

            return this._find(paths, component, prefix);
        });
    }
}
