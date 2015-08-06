import * as path from 'path';
import * as glob from 'glob';
import {Promise} from 'es6-promise';
import {Generator} from '../../index';
import {pluralize} from '../../utils/utils';

export default class BaseGenerator extends Generator {
    options: generator.IOptions;

    protected needsProject: boolean = true;
    protected type: string;
    protected ext: string;
    protected allowExtends: boolean;
    protected allowExtendsWithoutBase: boolean;
    protected fileExtension: boolean;
    protected declaration: boolean;

    constructor(options: any, config: generator.IConfig) {
        super(options);
        this.type = config.type;
        this.ext = config.ext.toLowerCase();
        this.allowExtends = !!config.allowExtends;
        var allowExtendsWithoutBase = config.allowExtendsWithoutBase;

        if (allowExtendsWithoutBase === false) {
            this.allowExtendsWithoutBase = false;
        } else {
            this.allowExtendsWithoutBase = true;
        }

        this.fileExtension = !config.noFileExtension;
        this.declaration = !!config.declaration;

        var type = this.type.toLowerCase();

        this.srcRoot(type);
        this.destRoot(`app/src/${pluralize(type) }`);
    }

    defineOptions(): void {
        this.option('name', {
            aliases: ['n'],
            description: `The name of the ${this.type}`
        });

        this.option('dir', {
            aliases: ['d'],
            description: `Specify the path relative to \`app/src/${pluralize(this.type.toLowerCase()) }\` in which to store the ${this.type}`,
            defaults: ''
        });

        if (this.allowExtends || this.allowExtendsWithoutBase) {
            this.option('extends', {
                aliases: ['x'],
                description: `Specify the relative import path to the ${this.type} to extend`
            });
        }

        if (this.declaration) {
            this.option('declaration', {
                aliases: ['dts'],
                description: 'Do not create a declaration file.',
                defaults: true
            });
        }

        this.option('register', {
            aliases: ['reg'],
            description: `Do not register the ${this.type} with the framework`,
            defaults: true
        });
    }

    askQuestions(): any {
        var options = this.options,
            name = options.name,
            promise: Thenable<string>;

        if(!this.utils.isString(options.name) && this.commands.length > 1) {
            name = this.commands[1];
            promise = this.ui.prompt([
                { name: 'name', type: this.ui.PROMPTS.CONFIRM, default: true, message: `Did you mean \`${this.buildFullCommand().slice(0, -1).join(' ')} -n ${name}\`?` }
            ]).then((answer: { name: boolean; } ) => {
                if(answer.name) {
                    return name;
                }

                return this.promptName(options.name);
            });
        } else {
            promise = this.promptName(options.name);
        }

        return promise.then((name: string) => {
            options.name = name;
        });
    }

    run(): any {
        var options = this.options,
            name = options.name,
            config: any = {
                name: name,
                type: name,
                register: options.register !== false
            },
            dest: string = this.getDestination();

        var ext = options.extends,
            src = this.ext;

        if (ext === false && this.allowExtends) {
            src = `base.${src}`;
        } else {
            config.ext = this.findExtends(dest).replace(/\\/g, '/').replace(/'/g, '');
        }

        if (this.allowExtends) {
            var root = this.destRoot();

            config.type = path.relative(path.resolve(root), path.resolve(root, dest, '..')).replace(/\\|\//g, '-');
        }

        return this._render(src, dest, config).then(() => {
            return Promise.all([
                this.processMainTs(),
                this.processMainLess()
            ]);
        });
    }

    protected promptName(name: string): Thenable<string> {
        if (this.utils.isString(name)) {
            return Promise.resolve(name);
        }

        return this.ui.prompt([
            { name: 'name', type: 'input', message: `What is the name of your ${this.type}?` }
        ]).then((answer: { name: string; }) => {
            return answer.name;
        });
    }

    protected _render(src: string, dest: string, config: any): Thenable<any> {
        var promises = [
            this.render(`${src}.ts`, `${dest}.ts`, config)
        ];

        if (this.declaration && this.options.declaration) {
            var dDest = dest.substring(0, dest.lastIndexOf('/')) + '/i' + dest.substring(dest.lastIndexOf('/') + 1);
            promises.push(this.render(`i${src}.d.ts`, `${dDest}.d.ts`, config));
        }

        return Promise.all(promises);
    }

    protected processMainTs(): Thenable<any> {
        var destRoot = path.resolve(this.destRoot(), '..'),
            root = path.relative(this.project.root, destRoot),
            paths = [
                root + '/app/app.ts',
                root + '/injectables/**/*.ts',
                root + '/attributecontrols/**/*.ts',
                root + '/templatecontrols/**/*.ts'
            ],
            ignore = [
                root + '/injectables/**/*.d.ts',
                root + '/attributecontrols/**/*.d.ts',
                root + '/templatecontrols/**/*.d.ts'
            ];

        var file = path.resolve(destRoot, 'main.ts');

        return Promise.all([
            this.file.read(file),
            this.glob(root, paths, ignore)
        ]).then((results: Array<any>) => {
            var data: string = results[0],
                files: Array<string> = results[1],
                req = `import '`,
                append: Array<string> = [];

            files.forEach((file) => {
                if (data.indexOf(file) === -1) {
                    append.push(`${req}${file}';`);
                }
            });

            if (append.length > 0) {
                append.push('');
            }

            return this.formatMain(data, append);
        }).then((data) => {
            return this.file.write(file, data);
        });
    }

    protected processMainLess(): Thenable<any> {
        var destRoot = path.resolve(this.destRoot(), '..'),
            root = path.relative(this.project.root, destRoot),
            paths = [
                root + '/attributecontrols/**/*.less',
                root + '/templatecontrols/**/*.less',
                root + '/viewcontrols/**/*.less',
            ];

        var file = path.resolve(destRoot, '../styles/main.less');

        return Promise.all([
            this.file.read(file),
            this.glob(root, paths, undefined, '../src/')
        ]).then((results: Array<any>) => {
            var data: string = results[0],
                files: Array<string> = results[1],
                imprt = `@import '`,
                append: Array<string> = [];

            files.forEach((file) => {
                if (data.indexOf(file) === -1) {
                    append.push(`${imprt}${file}';`);
                }
            });

            if (append.length > 0) {
                append.push('');
            }

            return this.formatMain(data, append);
        }).then((data) => {
            return this.file.write(file, data);
        });
    }

    protected glob(root: string, files: Array<string>, ignore: Array<string> = [], replace: string = './'): Thenable<any> {
        if (!this.utils.isArray(ignore)) {
            ignore = [];
        }

        files = files.slice(0);
        var firstFile = files.shift();
        return new Promise<Array<string>>((resolve, reject) => {
            glob(firstFile, {
                ignore: ignore.map((file) => {
                    if (file[0] === '!') {
                        return file.slice(1);
                    }

                    return file;
                })
            }, (err, matches) => {
                var out = matches.map((file) => {
                    return replace + path.relative(root, file).replace(/\\/g, '/').replace(/\.ts$/, '');
                });

                resolve(out);
            });
        }).then((out) => {
            if (files.length > 0) {
                return this.glob(root, files, ignore, replace).then((result) => {
                    return out.concat(result);
                });
            }

            return out;
        });
    }

    protected getDestination(): string {
        var options = this.options,
            name = options.name,
            dir = options.dir,
            dest: string;

        if (this.utils.isEmpty(dir)) {
            dest = name;
        } else {
            if (dir[dir.length - 1] === '/') {
                dir = dir.slice(0, -1);
            }

            dest = dir + '/' + name;
        }

        dest += `/${name}`;

        if (this.fileExtension) {
            dest += `.${this.ext}`;
        }

        return dest.toLowerCase();
    }

    protected findExtends(root: string): string {
        var ext: string = this.options.extends;

        if (this.utils.isString(ext)) {
            return ext;
        }

        if (!this.allowExtends && this.allowExtendsWithoutBase) {
            return '';
        }

        var dest = this.destRoot();

        return path.relative(path.resolve(dest, root, '..'), path.resolve(dest, `base/base.${this.ext}`));
    }

    private formatMain(data: string, append: Array<string>): string {
        var eol = this.file.eol(data),
            appFound: boolean = false,
            acFound: boolean = false,
            injFound: boolean = false,
            tcFound: boolean = false,
            vcFound: boolean = false;

        var sorted = this.sortMain(data.split(eol)
            .concat(append))
            .map((value, index, lines) => {
                if (value.indexOf('/app/') > -1 && !appFound) {
                    appFound = true;
                    value = eol + value;
                } else if (value.indexOf('/attributecontrols') > -1 && !acFound) {
                    acFound = true;
                    value = eol + value;
                } else if (value.indexOf('/injectables') > -1 && !injFound) {
                    injFound = true;
                    value = eol + value;
                } else if (value.indexOf('/templatecontrols') > -1 && !tcFound) {
                    tcFound = true;
                    value = eol + value;
                } else if (value.indexOf('/viewcontrols') > -1 && !vcFound) {
                    vcFound = true;
                    value = eol + value;
                }

                return value;
            })
            .join(eol)
            .split(eol)
            .filter((value, index: number, array: Array<string>) => {
                let empty = this.utils.isEmpty(value.trim()),
                    out = !empty || !this.utils.isEmpty(array[index - 1]);

                return out;
            });

        if (sorted[sorted.length - 2].trim() === '' && sorted[sorted.length - 1].trim() === '') {
            sorted.pop();
        }

        if(sorted[sorted.length - 1].trim() !== '') {
            sorted.push('');
        }

        return sorted.join(eol);
    }

    private sortMain(lines: Array<string>): Array<string> {
        var imports: Array<string> = [],
            others: Array<string> = [],
            trim: string,
            isString = this.utils.isString,
            isEmpty = this.utils.isEmpty;

        lines.forEach((line) => {
            trim = line.trim();
            if ((trim.indexOf('require') === 0 || trim.indexOf('import') === 0 || trim.indexOf('@import') === 0) &&
                this.hasComponent(trim)) {
                imports.push(line);
            } else {
                let last = others[others.length - 1];

                if(isEmpty(trim) && isString(last) && isEmpty(last.trim())) {
                    return;
                }

                others.push(line);
            }
        });

        imports = imports.sort();

        return others.concat(imports);
    }

    private hasComponent(line: string): boolean {
        return line.indexOf('app/app') > -1 ||
            line.indexOf('attributecontrols') > -1 ||
            line.indexOf('injectables') > -1 ||
            line.indexOf('templatecontrols') > -1 ||
            line.indexOf('viewcontrols') > -1;
    }

    private sort(a: string, b: string): number {
        var aa = a.indexOf('app') > -1,
            ba = b.indexOf('app') > -1,
            aac = a.indexOf('attributecontrols') > -1,
            bac = b.indexOf('attributecontrols') > -1,
            ai = a.indexOf('injectables') > -1,
            bi = b.indexOf('injectables') > -1,
            atc = a.indexOf('templatecontrols') > -1,
            btc = b.indexOf('templatecontrols') > -1,
            avc = a.indexOf('viewcontrols') > -1,
            bvc = b.indexOf('viewcontrols') > -1;

        if (!(aa || aac || ai || atc || avc)) {
            return -1;
        } else if (!(ba || bac || bi || btc || bvc)) {
            return 1;
        } else if ((aa && ba) || (aac && bac) || (ai && bi) || (atc && btc) || (avc && bvc)) {
            if (a > b) {
                return 1;
            } else if (b > a) {
                return -1;
            }
            return 0;
        } else if ((ai && btc) || (aac && (bi || btc)) || (aa && (bac || bi || btc))) {
            return -1;
        }

        return 1;
    }
}
