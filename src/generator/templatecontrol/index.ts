import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class TemplateControlGenerator extends Generator {
	constructor(options: any) {
		super(options);
		this.srcRoot('templatecontrol');
		this.destRoot('project/app/src/templatecontrols');
	}

	run(): any {
		var name = 'test',
			options = {
				name: name
			};

		return Promise.all([
			this.render('tc.html', `${name}/${name}.tc.html`, options),
			this.render('tc.less', `${name}/${name}.tc.less`, options),
			this.render('tc.ts', `${name}/${name}.tc.ts`, options)
		]);
	}
}
