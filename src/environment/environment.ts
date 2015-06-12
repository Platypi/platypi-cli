import * as path from 'path';
import * as fs from 'fs';
import {isObject, isEmpty, values} from 'lodash';
import Base from '../models/base';
import Command from '../models/command';
import Generator from '../models/generator';
import NotFoundError from '../errors/notfound';
import {findCommand, dirs, requireAll} from '../utils/utils';

export default class Environment extends Base {
	generator(component: string = '', parent?: Command): Thenable<Generator> {
		var original = component,
			components = component.split(/:(?!\\|\/)/),
			module = components.shift();

		this.ui.debug('Locating generators for: `' + (module || 'default') + '`');

		return this._generators(module)
			.then((response) => {
				var generators = response.generators,
					isDefault = response.isDefault;

				if(isDefault) {
					component = module;
				} else {
					component = components.shift();
				}

				if(isEmpty(component)) {
					component = 'app';
				}

				var Gen: typeof Generator = generators[component];

				if(!isObject(Gen)) {
					Gen = <typeof Generator>findCommand(values(generators), component);
				}

				try {
					return this.instantiate(Gen, {
						env: this,
						parent: parent,
						directory: path.resolve(path.resolve(__dirname, '..', 'generator'))
					});
				} catch(e) {
					if(e.message.indexOf('Cannot find module') > -1) {
						throw new NotFoundError('Unrecognized component: `' + original + '`');
					}

					throw e;
				}
			});
	}

	private _generators(module: string): Thenable<{ generators: { [key: string]: typeof Generator; }, isDefault?: boolean; }> {
		return dirs(path.resolve(__dirname, '..', 'generator'), [
			'templates',
			/^_.*$/
		]).then((values) => {
			var generators: { [key: string]: typeof Generator; } = requireAll(path.resolve(__dirname, '..', 'generator'), values);

			this.utils.forEach(generators, (generator, name) => {
				generator.commandName = name;
			});

			return {
				generators: generators,
				isDefault: true
			};
		});
	}
}
