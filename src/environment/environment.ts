import * as path from 'path';
import Base from '../models/base';
import Generator from '../models/generator';
import NotFoundError from '../errors/notfound';

export default class Environment extends Base {
	generator(component: string): Generator {
		var Gen: typeof Generator,
			original = component;

		component = this.findGenerator(component);

		if(!/:(?!\\|\/)/.test(component)) {
			component += ':app';
		}

		var split = component.split(/:(?!\\|\/)/),
			directory = split[0];


		component = split.join('/');
		component = component.toLowerCase();

		this.ui.debug('Locating generator at: `' + component + '`');

		try {
			return this.instantiate(<typeof Generator>require(component).default, {
				env: this,
				directory: path.resolve(directory)
			});
		} catch(e) {
			if(e.message.indexOf('Cannot find module') > -1) {
				throw new NotFoundError('Unrecognized component: `' + original + '`');
			}

			throw e;
		}
	}

	private findGenerator(generator: string) {
		if(this.utils.isEmpty(generator)) {
			return path.resolve(__dirname, '..', 'generator');
		}

		// logic to find external generators
		return `${path.resolve(__dirname, '..', 'generator')}:${generator}`;
	}
}
