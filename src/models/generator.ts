import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import {registerHelpers} from 'swag';
import {Promise} from 'es6-promise';
import Base from './base';
import Environment from '../environment/environment';

registerHelpers(Handlebars);

export default class Generator extends Base {
	protected env: Environment;
	private _srcRoot: string = '';
	private _destRoot: string = '';

	constructor(options: IGeneratorOptions) {
		super(options);
		this.env = options.env;
		this.srcRoot(path.resolve(options.directory, 'templates'));
		this.destRoot(this.project.root);
	}

	generate() {
		this.ui.debug('Generating');
	}

	protected render(source: string, destination: string, options?: any) {
		var src = this.getPath(this._srcRoot, source),
			dest = this.getPath(this._destRoot, destination);

		if(!this.utils.isObject(options)) {
			options = {
				encoding: 'utf8'
			};
		}

		return this.read(src, options).then((data: string) => {
			data = Handlebars.compile(data, {
				noEscape: true
			})(options);

			return this.write(dest, data, options);
		});
	}
	
	protected read(source: string, options: any) {
		this.ui.debug(`Reading from \`${source}\``);

		return new Promise((resolve, reject) => {
			fs.readFile(source, options, (err, data) => {
				if(err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	}
	
	protected write(dest: string, data: string, options: any) {
		this.ui.debug(`Writing to \`${dest}\``);

		return new Promise((resolve, reject) => {
			fs.writeFile(dest, data, options, (err) => {
				if(err) {
					reject(err);
					return;
				}
				
				resolve();
			});
		});
	}

	protected srcRoot(source: string): string {
		return this._srcRoot = this.getPath(this._srcRoot, source);
	}
	
	protected destRoot(dest: string): string {
		return this._destRoot = this.getPath(this._destRoot, dest);
	}
	
	private getPath(source: string, append: string): string {
		if(this.utils.isEmpty(source) || path.isAbsolute(append)) {
			source = append;
		} else if(!this.utils.isEmpty(append)) {
			source = path.resolve(source, append);
		}

		return source;
	}
}

interface IGeneratorOptions extends models.IModelOptions {
	env: Environment;
	directory: string;
}
