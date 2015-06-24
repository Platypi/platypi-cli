import Base from '../_models/base';

export default class Create extends Base {
	protected config: IDefaults;

	constructor(options: any) {
		super(options, {
			configProperty: 'create'
		});
	}

	defineOptions(): any {
		var pkg = this.project.package(),
			name = pkg.name,
			config: IDefaults = this.utils.defaults(this.config, {
				id: 'io.platypi.' + name,
				name: this.utils.startCase(name)
			});

		this.option('id', {
			description: 'The cordova app id (typically something like com.my.app)',
			defaults: config.id
		});

		this.option('name', {
			description: 'The cordova app name',
			defaults: config.name
		});
	}

	run(): any {
		return this.exec('dir').then(() => {
			console.log('done');
		});
	}
}

interface IDefaults {
	id?: string;
	name?: string;
}
