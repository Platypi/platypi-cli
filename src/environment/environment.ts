import Base from '../models/base';
import Generator from '../models/generator';

export default class Environment extends Base {
	generator(component: string): Generator {
		var Gen: typeof Generator;

		component = this.findGenerator(component);

		if(component.indexOf(':') === -1) {
			component += '/app';
		} else {
			component = component.replace(/:/g, '/');
		}

		component = component.toLowerCase();

		this.ui.debug('Locating generator at: `' + component + '`');

		return this.instantiate(<typeof Generator>require(component).default, {
			env: this
		});
	}

	private findGenerator(generator: string) {
		if(this.utils.isEmpty(generator)) {
			return '../generator';
		}

		// logic to find external generators
		return `../generator:${generator}`;
	}
}
