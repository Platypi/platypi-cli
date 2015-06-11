import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class ViewControlGenerator extends Generator {
	options: IOptions;
	type: string;
	ext: string;
	noLessOrHtml: boolean;

	constructor(options: any, controlOptions: IControlOptions) {
		super(options);
		this.type = controlOptions.type;
		this.ext = controlOptions.ext.toLowerCase();
		this.noLessOrHtml = !!controlOptions.noLessOrHtml;

		var type = this.type.toLowerCase();

		this.srcRoot(type);
		this.destRoot(`project/app/src/${type}s`);
	}

	defineOptions(): void {
		this.option('name', {
			aliases: ['n'],
			description: `The name of the ${this.type}`
		});

		if(!this.noLessOrHtml) {
			this.option('less', {
				description: `Don't generate a less file`,
				defaults: true
			});
			
			this.option('html', {
				description: `Don't generate an html file`,
				defaults: true
			});
		}
	}

	askQuestions(): any {
		var options = this.options;

		if(this.utils.isString(options.name)) {
			return;
		}

		return this.ui.prompt([
			{ name: 'name', type: 'input', message: `What is the name of your ${this.type}?` }
		]).then((answer: { name: string; }) => {
			options.name = answer.name;
		});
	}

	run(): any {
		var options = this.options,
			name = this.options.name,
			config = {
				name: name
			},
			root = `${name}/${name}.${this.ext}`,
			promises = [this.render(`${this.ext}.ts`, `${root}.ts`, config)];

		if(!this.noLessOrHtml) {
			if(options.less) {
				promises.push(this.render(`${this.ext}.less`, `${root}.less`, config));
			}
			
			if(options.html) {
				promises.push(this.render(`${this.ext}.html`, `${root}.html`, config));
			}
		}

		return Promise.all(promises);
	}
}

interface IOptions extends models.IParsedArgs {
	name: string;
	less?: boolean;
	html?: boolean;
}

interface IControlOptions {
	ext: string;
	type: string;
	noLessOrHtml?: boolean;
}
