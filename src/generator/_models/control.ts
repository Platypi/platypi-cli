import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from './base';

export default class ControlGenerator extends Generator {
	options: generator.IControlOptions;
	protected noLessOrHtml: boolean;

	constructor(options: any, config: generator.IControlConfig) {
		super(options, config);
		this.noLessOrHtml = !!config.noLessOrHtml;
	}

	defineOptions(): void {
		super.defineOptions();

		if(!this.noLessOrHtml) {
			this.option('less', {
				description: `Do not generate a less file`,
				defaults: true
			});

			this.option('html', {
				description: `Do not generate an html file`,
				defaults: true
			});
		}
	}

	protected _render(src: string, dest: string, config: any): Thenable<any> {
		var options = this.options;
		config.html = options.html;

		var promises = [
				this.render(`${src}.ts`, `${dest}.ts`, config)
			];

		if(!this.noLessOrHtml) {
			if(options.less) {
				promises.push(this.render(`${this.ext}.less`, `${dest}.less`, config));
			}

			if(options.html) {
				promises.push(this.render(`${this.ext}.html`, `${dest}.html`, config));
			}
		}

		return Promise.all(promises);
	}
}
