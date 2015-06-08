import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class DefaultGenerator extends Generator {
	initialize() {
		
	}

	generate() {
		this.ui.debug('Generating the `default` viewcontrol');
	}
}
