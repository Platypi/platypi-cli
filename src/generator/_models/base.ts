import * as path from 'path';
import * as glob from 'glob';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';
import {pluralize} from '../../utils/utils';

export default class BaseGenerator extends Generator {
	options: generator.IOptions;
	protected type: string;
	protected ext: string;
	protected allowExtends: boolean;
	protected fileExtension: boolean;

	constructor(options: any, config: generator.IConfig) {
		super(options);
		this.type = config.type;
		this.ext = config.ext.toLowerCase();
		this.allowExtends = !!config.allowExtends;
		this.fileExtension = !config.noFileExtension;

		var type = this.type.toLowerCase();

		this.srcRoot(type);
		this.destRoot(`project/app/src/${pluralize(type)}`);
	}

	defineOptions(): void {
		this.option('name', {
			aliases: ['n'],
			description: `The name of the ${this.type}`
		});

		this.option('dir', {
			aliases: ['d'],
			description: `Specify the relative path to a directory in which to store the ${this.type}`,
			defaults: ''
		});

		if(this.allowExtends) {
			this.option('extends', {
				aliases: ['x'],
				description: `Specify the relative import path to the ${this.type} to extend`
			});
		}

		this.option('register', {
			aliases: ['r'],
			description: `Do not register this ${this.type} with the framework`,
			defaults: true
		});
	}

	askQuestions(): any {
		var options = this.options;

		if(this.utils.isString(options.name)) {
			return;
		}

		return this.ui.prompt([
			{ name: 'name', type: 'input', message: `What is the name of your ${this.type}?` }
		]).then((answer: { name: string; }) => {
			options.name = answer.name;
		});
	}

	run() {
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

		if(ext === false) {
			src = `base.${src}`;
		} else {
			config.ext = this.findExtends(dest).replace(/\\/g, '/');
		}

		if(this.allowExtends) {
			var root = this.destRoot();

			config.type = path.relative(path.resolve(root), path.resolve(root, dest, '..')).replace(/\\|\//g, '-');
		}

		return this._render(src, dest, config).then(() => {
			return this.processMain();	
		});
	}

	protected _render(src: string, dest: string, config: any): Thenable<any> {
		return Promise.all([
			this.render(`${src}.ts`, `${dest}.ts`, config)
		]);
	}

	protected processMain(): Thenable<any> {
		var destRoot = path.resolve(this.destRoot(), '..'),
			root = path.relative('.', destRoot),
			paths = [
				root + '/app/app.ts',
				root + '/injectables/**/*.ts',
				root + '/attributecontrols/**/*.ts',
				root + '/templatecontrols/**/*.ts'
			];

		var file = destRoot + '/main.ts';

		return Promise.all([
			this.read(file),
			this.glob(root, paths)
		]).then((results: Array<any>) => {
			var data: string = results[0],
				files: Array<string> = results[1],
				req = `require('`,
				append: Array<string> = [];

			files.forEach((file) => {
				if(data.indexOf(file) === -1) {
					append.push(`${req}${file}');`);
				}
			});

			var eol = this.eol(data);

			if(append.length > 0) {
				append.push('');
			}

			return data.split(eol)
				.slice(0, -1)
				.concat(append)
				.join(eol);
		}).then((data) => {
			return this.write(file, data);
		});
	}

	protected glob(root: string, files: Array<string>): Thenable<any> {
		files = files.slice(0);
		var firstFile = files.shift();
		return new Promise<Array<string>>((resolve, reject) => {
			glob(firstFile, (err, matches) => {
				var out = matches.map((file) => {
					return './' + path.relative(root, file).replace(/\\/g, '/').replace(/\.ts$/, '');
				});

				resolve(out);
			});
		}).then((out) => {
			if(files.length > 0) {
				return this.glob(root, files).then((result) => {
					return out.concat(result);	
				});
			}

			return out;
		});
	}

	protected getDestination() {
		var options = this.options,
			name = options.name,
			dir = options.dir,
			dest: string;

		if(this.utils.isEmpty(dir)) {
			dest = name;
		} else {
			if(dir[dir.length - 1] === '/') {
				dir = dir.slice(0, -1);
			}

			dest = dir + '/' + name;
		}

		dest += `/${name}`;

		if(this.fileExtension) {
			dest += `.${this.ext}`;
		}

		return dest.toLowerCase();
	}

	protected findExtends(root: string): string {
		var ext: string = this.options.extends;

		if(this.utils.isString(ext)) {
			return ext;
		}

		var dest = this.destRoot();

		return path.relative(path.resolve(dest, root, '..'), path.resolve(dest, `base/base.${this.ext}`));
	}
}
