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
			},
			root = `${name}/${name}`;

		return Promise.all([
			this.render('vc.html', `${root}.vc.html`, options),
			this.render('vc.less', `${root}.vc.less`, options),
			this.render('vc.ts', `${root}.vc.ts`, options)
		]);
	}
}
