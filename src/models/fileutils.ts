import * as fs from 'fs';
import * as mkdir from 'mkdirp';
import * as path from 'path';
import * as minimist from 'minimist';
import {Promise} from 'es6-promise';
import * as utils from 'lodash';
import Base from './base';

class FileUtils extends Base {
	protected utils: typeof utils = utils;

	read(source: string, options: any = {}): Thenable<string> {
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

	mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string {
		var eol = this.eol(data),
			lines = data.split(eol);

		return this.utils.map(lines, handler).join(eol);
	}

	protected ensureWritable(file: string): Thenable<void> {
		return this.mkdir(path.dirname(file));
	}
}
