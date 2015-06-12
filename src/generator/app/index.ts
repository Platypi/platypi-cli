import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';
import ViewControl from '../viewcontrol/index';

export default class AppGenerator extends Generator {
	constructor(options: any) {
		super(options);
		this.destRoot('project/app');
	}

	run(): any {
		this.ui.debug('Generating the `default` app');

		var generator = this.instantiate(ViewControl, {
				env: this.env,
				directory: this.directory
			}),
				vcName = 'home',
			options = {
				appName: 'TEST',
				vcName: vcName
			};

		var promises: Array<Thenable<any>> = [
			this.render('package.json', '../package.json', options),
			this.render('tsconfig.json', '../tsconfig.json', options),
			this.render('main.ts', 'src/main.ts', options),
			this.render('tsd.json', '../tsd.json', options),
			this.render('app/app.ts', 'src/app/app.ts', options),
			this.render('styles/main.less', 'styles/main.less', options),
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
		];
	
		generator.options = {
			name: vcName,
			less: true,
			html: true
		};
		
		promises.push(generator.run().then(() => {
			generator.options = {
				name: 'base',
				extends: false,
				less: false,
				html: false
			};

			return generator.run();
		}));

		return Promise.all(promises);
	}
}
