/// <reference path="../references.d.ts" />

export default class BaseObject {
	protected ui: ui.Ui;
	protected project: models.Project;

	constructor(options: models.IModelOptions) {
		this.ui = options.ui;
		this.project = options.project;
	}
}
