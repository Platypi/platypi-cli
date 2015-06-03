import * as utils from 'lodash';

export default class BaseObject {
	protected ui: ui.Ui;
	protected project: models.Project;
	protected utils = utils;

	constructor(options: models.IModelOptions) {
		this.ui = options.ui;
		this.project = options.project;
	}
}
