/// <reference path="../references.d.ts" />

import * as path from 'path';
import {Promise} from 'es6-promise';
import * as utils from 'lodash';
import Base from './base';
import NotFoundError from '../errors/notfound';

var findup = require('findup');

export default class Project extends Base {
	static project(ui: ui.Ui, root: string): Thenable<Project> {
		return Project.closestPackage(ui, root).then((info: { directory: string; pkg: any; }) => {
			ui.debug(`Closest project found at ${info.directory}`);

			return new Project({
				root: info.directory,
				pkg: info.pkg,
				ui: ui
			});
		});
	}
	
	protected static closestPackage(ui: ui.Ui, root: string): Thenable<{ directory: string; pkg: any; }> {
		var file = 'package.json';
		return Promise.all([
			Project.closestConfig(ui, root, 'package.json'),
			Project.closestConfig(ui, root, 'platypi.json')
		]).then((values) => {
			var pkg = values[0],
				platypi = values[1],
				pkgError = !utils.isString(pkg.directory),
				platypiError = !utils.isString(platypi.directory);

			if(pkgError && platypiError) {
				throw pkg;
			} else if(pkgError) {
				pkg = {
					directory: platypi.directory,
					pkg: {}
				};
			} else if(platypiError) {
				platypi = {
					directory: pkg.directory,
					pkg: {}
				};
			}
			return {
				directory: pkg.directory,
				pkg: utils.merge(pkg.pkg, { platypi: platypi.pkg })
			};
		});
	}
	
	protected static closestConfig(ui: ui.Ui, root: string, configName: string): Thenable<{ directory: string; pkg: any; }> {
		return new Promise((resolve, reject) => {
			ui.debug(`Searching for ${configName} at and above ${root}`);
			findup(root, configName, (err: any, directory: string) => {
				if(utils.isObject(err)) {
					resolve(Project.handleError(root, err));
					return;
				}
				resolve(directory);
			});
		}).then((directory: string) => {
			if(!utils.isString(directory)) {
				return <any>directory;
			}
			var config = path.join(directory, configName);
			ui.debug(`Reading ${config}`);
			return {
				directory: directory,
				pkg: require(config)
			};
		});
	}
	
	protected static handleError(root: string, err: any): any {
		if(utils.isObject(err) && /not found/i.test(err.message)) {
			return new NotFoundError(`No project found at or up from: \`${root}\``);
		} else {
			return err;
		}
	}
	
	protected root: string;
	protected pkg: any;
	
	constructor(options: models.IProjectOptions) {
		super(options);
		
		this.root = options.root;
		this.pkg = options.pkg;
	}
}
