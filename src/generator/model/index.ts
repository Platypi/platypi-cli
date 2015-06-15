import Generator from '../_models/base';

export default class InjectableGenerator extends Generator {
	static aliases: Array<string> = ['mdl'];

	constructor(options: any) {
		super(options, {
			type: 'Model',
			ext: 'model',
			noFileExtension: true
		});
	}
}
