import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as mkdir from 'mkdirp';
import * as chalk from 'chalk';
import {registerHelpers} from 'swag';
import {Promise} from 'es6-promise';
import Command from './command';
import Environment from '../environment/environment';
import {isAbsolute} from '../utils/utils';

registerHelpers(Handlebars);

export default class Generator extends Command {
    protected env: Environment;
    protected directory: string;
    private _srcRoot: string = '';
    private _destRoot: string = '';
    private _finishRender: Thenable<any> = Promise.resolve();

    constructor(options: IGeneratorOptions) {
        super(options);
        this.env = options.env;
        this.directory = options.directory;
        this.srcRoot(path.resolve(options.directory, 'templates'));
        let project = this.project,
            root: string;

        if (this.utils.isObject(project)) {
            root = project.root;
        }

        this.destRoot(root || options.destRoot || process.cwd());
    }

    protected render(source: string, destination: string, context?: any): Thenable<void> {
        let src = this.getPath(this._srcRoot, source),
            dest = this.getPath(this._destRoot, destination);

        let options: any = this.utils.extend({
            context: context,
            encoding: 'utf8'
        }, context);

        return this._finishRender = this._finishRender.then(() => {
            return this.file.read(src, options);
        })
            .then((data: string) => {
                data = Handlebars.compile(data, {
                    noEscape: true
                })(options.context);

                return this.file.read(dest, options).then(() => {
                    this.ui.warn(`The file \`${path.normalize(dest.replace(this.project.root, '')) }\` already exists.`);
                    return this.ui.prompt([
                        {
                            type: 'confirm',
                            default: <any>true,
                            name: 'force',
                            choices: ['Y', 'n'],
                            message: 'Are you sure you want to overwrite it?'
                        }
                    ]).then((answer: { force: boolean; }) => {
                        if (!answer.force) {
                            return;
                        }

                        return this.file.write(dest, data, options);
                    });
                }, (err) => {
                    return this.file.write(dest, data, options);
                });
            });
    }

    protected copy(src: string, dest: string): Thenable<void> {
        src = this.getPath(this._srcRoot, src);
        dest = this.getPath(this._destRoot, dest);
        return this.file.copy(src, dest);
    }

    protected mkdirDest(...dirs: Array<string>): Thenable<any> {
        return this.file.mkdir.apply(this, dirs.map((dir) => {
            return this.getPath(this._destRoot, dir);
        }));
    }

    protected srcRoot(source?: string): string {
        return this._srcRoot = this.getPath(this._srcRoot, source);
    }

    protected destRoot(dest?: string): string {
        return this._destRoot = this.getPath(this._destRoot, dest);
    }

    protected mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string {
        let eol = this.file.eol(data),
            lines = data.split(eol);

        return this.utils.map(lines, handler).join(eol);
    }

    private getPath(source: string, append: string): string {
        if (this.utils.isEmpty(source) || isAbsolute(append)) {
            source = append;
        } else {
            source = path.resolve(source, append || '.');
        }

        return source;
    }
}

interface IGeneratorOptions extends models.IModelOptions {
    env: Environment;
    directory: string;
    destRoot?: string;
}
