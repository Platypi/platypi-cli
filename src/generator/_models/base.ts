import * as path from 'path';
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

		return this._render(src, dest, config);
	}

	protected _render(src: string, dest: string, config: any): Thenable<any> {
		return Promise.all([
			this.render(`${src}.ts`, `${dest}.ts`, config)
		]);
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
