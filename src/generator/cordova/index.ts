import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

var validate: any = require('validate-npm-package-name');

export default class CordovaGenerator extends Generator {
	options: IOptions;

	defineOptions(): any {
		this.option('id', {
			description: 'The id of your cordova app'
		});
	}

	askQuestions(): any {
		var options = this.options;

		return this.promptName(options.name).then((name) => {
			options.name = this.utils.startCase(name);
		});
	}

	promptName(name: string = ''): Thenable<string> {
		name = name.trim();
		var utils = this.utils;

		if(utils.isEmpty(name) && utils.isObject(this.project)) {
			var pkg = this.project.package();

			if(utils.isObject(pkg) && utils.isString(pkg.name)) {
				name = pkg.name;
			}
		}

		if(!utils.isEmpty(name)) {
			var valid = validate(name);

			if(utils.isArray(valid.errors) || utils.isArray(valid.warnings)) {
				this.ui.warn('');
				utils.forEach(valid.errors, (err: string) => {
					this.ui.warn(err);
				});

				utils.forEach(valid.warnings, (err: string) => {
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
		this.normalizeOptions(this.options);

		return Promise.all([
			this.render('cordova/config.xml', 'cordova/config.xml', this.options),
			this.copy('cordova/res', 'cordova/res'),
			this.mkdirDest('cordova/www')
		]);
	}

	protected normalizeOptions(options: IOptions): void {
		var match: RegExpMatchArray = [];

		if(this.utils.isEmpty(options.id)) {
			options.id = options.name.replace(/\s/g, '');
		} else {
			match = options.id.match(/\./g) || [];
		}

		if(match.length === 0) {
			options.id = `io.platypi.${options.id}`;
		} else if(match.length === 1) {
			if(!/^(io|com|org)\./.test(options.id)) {
				options.id = `com.${options.id}`;
			} else {
				var index = options.id.indexOf('.');

				options.id = options.id.substring(0, index) + '.platypi.' + options.id.substring(index + 1);
			}
		}

		options.id = options.id.replace(/([^\.]*)/g, (match) => {
			return this.utils.camelCase(match).toLowerCase();
		});
	}
}

interface IOptions extends models.IParsedArgs {
	id: string;
	name: string;
}
