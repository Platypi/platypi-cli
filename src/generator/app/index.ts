import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';
import ViewControl from '../viewcontrol/index';

export default class AppGenerator extends Generator {
	constructor(options: any) {
		super(options);
		this.destRoot('project/app');
	}

	run() {
		this.ui.debug('Generating the `default` app');

		var generator = this.instantiate(ViewControl, {
			env: this.env,
			directory: this.directory
		});

		var options = {
			appName: 'TEST',
			vcName: 'home'
		};

		return Promise.all([
			this.render('package.json', '../package.json', options),
			this.render('tsconfig.json', '../tsconfig.json', options),
			this.render('tsd.json', '../tsd.json', options),
			this.render('app/app.ts', 'src/app/app.ts', options),
			this.render('styles/main.less', 'styles/main.less', options),
			generator.run(),
			this.mkdirDest(
				'src/attributecontrols',
				'src/injectables',
				'src/models',
				'src/repositories',
				'src/services',
				'src/templatecontrols',
				'fonts',
				'images',
				'../test'
			)
		]);
	}
}
