import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class ViewControlGenerator extends Generator {
	options: IOptions;

	constructor(options: any) {
		super(options);
		this.srcRoot('viewcontrol');
		this.destRoot('project/app/src/viewcontrols');
	}

	defineOptions(): any {
		this.option('name', {
			aliases: ['n'],
			description: 'The name of the viewcontrol'
		});
	}

	askQuestions(): any {
		var options = this.options;

		if(this.utils.isString(options.name)) {
			return;
		}

		return this.ui.prompt([
			{ name: 'name', type: 'input', message: 'What is the name of your ViewControl?' }
		]).then((answer: { name: string; }) => {
			options.name = answer.name;
		});
	}

	run(): any {
		var name = this.options.name,
			options = {
				name: name
			},
			root = `${name}/${name}`;

		return Promise.all([
			this.render('vc.html', `${root}.vc.html`, options),
			this.render('vc.less', `${root}.vc.less`, options),
			this.render('vc.ts', `${root}.vc.ts`, options)
		]);
	}
}

interface IOptions extends models.IParsedArgs {
	name: string;
}
