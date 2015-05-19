/// <reference path="../references.d.ts" />

declare module models {
	interface IModelOptions {
		ui: ui.Ui,
		project?: Project;
	}
	
	interface IProjectOptions extends IModelOptions {
		/**
		 * The root directory for the project
		 */
		root: string;
		
		/**
		 * The serialized package.json file
		 */
		pkg: any;
	}
	
	class Project {
		static project(root: string, ui: ui.Ui): Thenable<Project>;
	}
}
