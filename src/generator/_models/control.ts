import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class ViewControlGenerator extends Generator {
	options: IOptions;
	type: string;
	ext: string;
	allowExtends: boolean;
	noLessOrHtml: boolean;

	constructor(options: any, controlOptions: IControlOptions) {
		super(options);
		this.type = controlOptions.type;
		this.ext = controlOptions.ext.toLowerCase();
		this.allowExtends = !!controlOptions.allowExtends;
		this.noLessOrHtml = !!controlOptions.noLessOrHtml;

		var type = this.type.toLowerCase();

		this.srcRoot(type);
		this.destRoot(`project/app/src/${type}s`);
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
				description: `Specify the relative import path to the ${this.type} to extend.`
			});
		}

		if(!this.noLessOrHtml) {
			this.option('less', {
				description: `Don't generate a less file`,
				defaults: true
			});
			
			this.option('html', {
				description: `Don't generate an html file`,
				defaults: true
			});
		}
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

	run(): any {
		var options = this.options,
			name = options.name,
			config: any = {
				name: name,
				html: options.html
			},
			dir = options.dir,
			root: string;

		if(this.utils.isEmpty(dir)) {
			root = name;
		} else {
			if(dir[dir.length - 1] === '/') {
				dir = dir.slice(0, -1);
			}

			root = dir + '/' + name;
		}

		var ext = options.extends,
			srcExt = this.ext;

		if(ext === false) {
			srcExt = `base.${srcExt}`;
		} else {
			config.ext = this.findExtends(root).replace(/\\/g, '/');
		}

		root += `/${name}.${this.ext}`;
		root = root.toLowerCase();

		var promises = [this.render(`${srcExt}.ts`, `${root}.ts`, config)];

		if(!this.noLessOrHtml) {
			if(options.less) {
				promises.push(this.render(`${this.ext}.less`, `${root}.less`, config));
			}
			
			if(options.html) {
				promises.push(this.render(`${this.ext}.html`, `${root}.html`, config));
			}
		}

		return Promise.all(promises);
	}

	protected findExtends(root: string) {
		var ext: string = this.options.extends;

		if(this.utils.isString(ext)) {
			return ext;
		}

		var dest = this.destRoot();
		
		return path.relative(path.resolve(dest, root), path.resolve(dest, `base/base.${this.ext}`));
	}
}

interface IOptions extends models.IParsedArgs {
	name: string;
	dir?: string;
	extends?: any;
	less?: boolean;
	html?: boolean;
}

interface IControlOptions {
	ext: string;
	type: string;
	allowExtends?: boolean;
	noLessOrHtml?: boolean;
}
