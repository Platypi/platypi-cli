import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

export default class ViewControlGenerator extends Generator {
	constructor(options: any) {
		super(options);
		this.srcRoot('viewcontrol');
		this.destRoot('project/app/src/viewcontrols');
	}

	run() {
		var name = 'home',
			options = {
				name: name
			};

		return Promise.all([
			this.render('vc.html', `${name}/${name}.vc.html`, options),
			this.render('vc.less', `${name}/${name}.vc.less`, options),
			this.render('vc.ts', `${name}/${name}.vc.ts`, options)
		]);
	}
}
