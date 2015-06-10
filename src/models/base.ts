import * as utils from 'lodash';

export default class BaseObject {
	protected ui: ui.Ui;
	protected project: models.Project;
	protected utils: typeof utils = utils;

	constructor(options: models.IModelOptions) {
		this.ui = options.ui;
		this.project = options.project;
	}

	protected instantiate<T>(Constructor: new (opts: models.IModelOptions) => T, options?: any): T {
		if(!this.utils.isFunction(Constructor)) {
			return;
		}

		options = this.utils.extend(options, {
			project: this.project,
			ui: this.ui
		});

		return new Constructor(options);
	}
}
