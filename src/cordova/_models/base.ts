import Process from '../../models/process';

export default class Base extends Process {
	protected config: any = {};
	protected needsProject: boolean = true;

	constructor(options: any, config: cordova.IConfig) {
		super(options);

		var cfg = this.project.getConfig('cordova'),
			utils = this.utils,
			prop = config.configProperty;

		if(utils.isObject(cfg) && !utils.isEmpty(prop)) {
			this.config = cfg[prop];
		}
	}
}
