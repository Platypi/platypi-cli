import * as fs from 'fs-extra';
import * as mkdir from 'mkdirp';
import * as path from 'path';
import * as minimist from 'minimist';
import {Promise} from 'es6-promise';
import * as utils from 'lodash';
import Base from './base';

export default class FileUtils extends Base {
	protected utils: typeof utils = utils;

	read(source: string, options: any = {}): Thenable<string> {
		source = path.normalize(source);
		this.ui.debug(`Reading from \`${source}\``);

		this.utils.defaults(options, {
			encoding: 'utf8'
		});

		return new Promise<string>((resolve, reject) => {
			fs.readFile(source, options, (err, data) => {
				if(err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	}

	write(dest: string, data: string, options: any = {}): Thenable<void> {
		dest = path.normalize(dest);
		this.ui.debug(`Writing to \`${dest}\``);

		this.utils.defaults(options, {
			encoding: 'utf8'
		});

		return this.ensureWritable(dest)
			.then(() => {
				return new Promise<void>((resolve, reject) => {
					fs.writeFile(dest, data, options, (err) => {
						if(err) {
							reject(err);
							return;
						}

						resolve();
					});
				});
			});
	}

	copy(src: string, dest: string): Thenable<void> {
		return new Promise<void>((resolve, reject) => {
			fs.copy(src, dest, (err) => {
				if(this.utils.isObject(err)) {
					return reject(err);
				}

				resolve();
			});
		});
	}

	mkdir(...dirs: Array<string>): Thenable<void> {
		return Promise.all(dirs.map((dir) => {
			return new Promise<void>((resolve, reject) => {
				mkdir(dir, (err) => {
					if(this.utils.isObject(err)) {
						reject(err);
						return;
					}

					resolve();
				});
			});
		})).then(this.utils.noop);
	}

	eol(data: string): string {
		var cr = '\r',
			lf = '\n',
			r = data.indexOf(r),
			n = data.indexOf(n);

		if(r > -1 && r < n) {
			return cr + lf;
		}

		return lf;
	}

	spaces(length: number): string {
		return (<any>this.utils).fill(Array(length), ' ').join('');
	}

	mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string {
		var eol = this.eol(data),
			lines = data.split(eol);

		return this.utils.map(lines, handler).join(eol);
	}

	dir(src: string, ignores: Array<string|RegExp> = []): Thenable<Array<string>> {
		return new Promise((resolve, reject) => {
			fs.readdir(path.resolve(src), (err, directories) => {
				if(this.utils.isObject(err)) {
					return reject(err);
				}

				var ignoreStrings = <Array<string>>ignores.filter((ignore) => {
						return this.utils.isString(ignore);
					}),
					ignoreRegex = <Array<RegExp>>ignores.filter((ignore) => {
						return this.utils.isRegExp(ignore);
					});

				directories = directories.filter((dir) => {
					var isDir = fs.statSync(path.join(src, dir)).isDirectory(),
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

	requireAll(src: string, directories: Array<string>): { [key: string]: any; } {
		var modules: { [key: string]: any; } = {};

		directories.forEach((dir) => {
			let module = require(path.resolve(src, dir));

			if(this.utils.isObject(module) && this.utils.isObject(module.default)) {
				modules[dir] = module.default;
			} else {
				modules[dir] = module;
			}
		});

		return modules;
	}

	protected ensureWritable(file: string): Thenable<void> {
		return this.mkdir(path.dirname(file));
	}
}
