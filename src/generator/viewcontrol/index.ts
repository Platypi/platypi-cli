import Generator from '../_models/control';

export default class ViewControlGenerator extends Generator {
	static aliases: Array<string> = ['vc'];

	constructor(options: any) {
		super(options, {
			type: 'ViewControl',
			ext: 'vc',
			allowExtends: true
		});
	}
}
