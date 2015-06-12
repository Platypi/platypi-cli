import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';
import ViewControl from '../viewcontrol/index';

var validate: any = require('validate-npm-package-name');

export default class AppGenerator extends Generator {
	options: IOptions;

	constructor(options: any) {
		super(options);
		this.destRoot('project/app');
	}

	defineOptions(): void {
		this.option('name', {
			aliases: ['n'],
			description: `The name of the app`
		});
	}

	askQuestions(): any {
		var options = this.options;

		return this.promptName(options.name).then((name) => {
			options.name = name;
		});
	}

	promptName(name: string = ''): Thenable<string> {
		name = name.trim();

		if(!this.utils.isEmpty(name)) {
			var valid = validate(name);

			if(this.utils.isArray(valid.errors) || this.utils.isArray(valid.warnings)) {
				this.ui.warn('');
				this.utils.forEach(valid.errors, (err: string) => {
					this.ui.warn(err);
				});

				this.utils.forEach(valid.warnings, (err: string) => {
					this.ui.warn(err);
				});
				this.ui.warn('');
			} else {
				return Promise.resolve(name);
			}
		}

		return this.ui.prompt([
			{ name: 'name', type: 'input', message: `What is the name of your app?` }
		]).then((answer: { name: string; }) => {
			return this.promptName(answer.name);
		});
	}

	run(): any {
		this.ui.debug('Generating the `default` app');

		var generator = this.instantiate(ViewControl, {
				env: this.env,
				directory: this.directory
			}),
				vcName = 'home',
			options = {
				appName: this.options.name,
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
				register: false,
				less: false,
				html: false
			};

			return generator.run();
		}));

		return Promise.all(promises);
	}
}

interface IOptions extends models.IParsedArgs {
	name: string;
}
