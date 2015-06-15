import Generator from '../_models/base';

export default class RepositoryGenerator extends Generator {
	static aliases: Array<string> = ['repo'];

	constructor(options: any) {
		super(options, {
			type: 'Repository',
			ext: 'repo',
			allowExtends: true
		});
	}
}
