/// <reference path="../references.d.ts" />

export default class BaseObject {
	ui: ui.Ui;
	project: models.Project;

	constructor(options: models.IModelOptions) {
		this.ui = options.ui;
		this.project = options.project;
	}
}
