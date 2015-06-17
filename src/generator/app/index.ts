import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';
import Repository from '../repository/index';
import Service from '../service/index';
import ViewControl from '../viewcontrol/index';

var validate: any = require('validate-npm-package-name');

export default class AppGenerator extends Generator {
	options: IOptions;

	defineOptions(): void {
		this.option('name', {
			aliases: ['n'],
			description: `The name of the app`
		});

		this.option('dir', {
			aliases: ['d'],
			description: `Specify the relative path to a directory in which to create the app`,
			defaults: ''
		});
	}

	askQuestions(): any {
		var options = this.options;

		return this.promptDir(options.dir).then((dir) => {
			options.dir = dir;
			return this.promptName(options.name);
		}).then((name) => {
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

	promptDir(dir: string = ''): Thenable<string> {
		dir = dir.trim();

		if(!this.utils.isEmpty(dir)) {
			return Promise.resolve(dir);
		}

		return this.ui.prompt([
			{ name: 'dir', default: '.', type: 'input', message: `Where should this app be created?` }
		]).then((answer: { dir: string; }) => {
			return answer.dir;
		});
	}

	run(): any {
		this.destRoot(this.options.dir + '/app');

		this.ui.debug('Generating the `default` app');

		var destRoot = path.resolve(this.destRoot(), '..'),
			vcGenerator = this.instantiate(ViewControl, {
				env: this.env,
				directory: this.directory,
				destRoot: destRoot
			}),
			repoGenerator = this.instantiate(Repository, {
				env: this.env,
				directory: this.directory,
				destRoot: destRoot
			}),
			svcGenerator = this.instantiate(Service, {
				env: this.env,
				directory: this.directory,
				destRoot: destRoot
			}),
			vcName = 'home',
			options = {
				appName: this.options.name,
				vcName: vcName
			};

		var promises: Array<Thenable<any>> = [
			this.render('package.json', '../package.json', options),
			this.render('tsconfig.json', '../tsconfig.json', options),
			this.render('index.html', 'index.html', options),
			this.render('main.ts', 'src/main.ts', options),
			this.render('tsd.json', '../tsd.json', options),
			this.render('app/app.ts', 'src/app/app.ts', options),
			this.render('styles/main.less', 'styles/main.less', options),
			this.mkdirDest(
				'src/attributecontrols',
				'src/injectables',
				'src/models',
				'src/templatecontrols',
				'fonts',
				'images',
				'../test'
			)
		];

		repoGenerator.options = svcGenerator.options = {
			name: 'base',
			extends: false
		};

		return Promise.all(promises)
			.then(() => {
				vcGenerator.options = {
					name: vcName,
					less: true,
					html: true
				};

				return vcGenerator.run();
			}).then(() => {
				vcGenerator.options = {
					name: 'base',
					extends: false,
					register: false,
					less: false,
					html: false
				};

				return vcGenerator.run();
			}).then(() => {
				return repoGenerator.run();
			}).then(() => {
				return svcGenerator.run();
			});
	}
}

interface IOptions extends models.IParsedArgs {
	name: string;
	dir: string;
}
