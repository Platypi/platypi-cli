/// <reference path="../references.d.ts" />

import * as path from 'path';
import {Promise} from 'es6-promise';
import * as utils from 'lodash';
import Base from './base';
import NotFoundError from '../errors/notfound';

var findup = require('findup');

export default class Project extends Base {
	static project(root: string, ui: ui.Ui): Thenable<Project> {
		return Project.closestPackage(root).then((info: { directory: string; pkg: any; }) => {
			ui.debug(`Closest project found at ${info.directory}`);
			
			return new Project({
				root: info.directory,
				pkg: info.pkg,
				ui: ui
			});
		});
	}
	
	protected static closestPackage(root: string): Thenable<{ directory: string; pkg: any; }> {
		var file = 'package.json';
		return Promise.all([
			Project.closestConfig(root, 'package.json'),
			Project.closestConfig(root, 'platypi.json')
		]).then((values) => {
			var pkg = values[0],
				platypi = values[1];

			return {
				directory: pkg.directory,
				pkg: utils.cloneDeep({}, pkg.pkg, platypi.pkg)
			};
		});
	}
	
	protected static closestConfig(root: string, configName: string): Thenable<{ directory: string; pkg: any; }> {
		return new Promise((resolve, reject) => {
			findup(root, configName, (err: any, directory: string) => {
				if(utils.isObject(err)) {
					reject(Project.handleError(root, err));
					return;
				}
				resolve(directory);
			});
		}).then((directory: string) => {
			return {
				directory: directory,
				pkg: require(path.join(directory, configName))
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
