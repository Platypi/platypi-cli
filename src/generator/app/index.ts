import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class DefaultGenerator extends Generator {
	initialize() {
		
	}

	generate() {
		this.ui.debug('Generating the `default` app');

		return this.ui.prompt([
			{ 
				name: 'type',
				message: 'Web or Mobile?',
				choices: [
					'web',
					'mobile'
				],
				type: 'list'
			}
		]).then((answers: { type: string; }) => {			
			this.ui.debug(`Creating a \`${answers.type}\` app.`);
		});
	}
}
