declare module models {
	interface IModelOptions {
		ui: ui.Ui;
		project?: Project;
	}

	interface ICommandOptions extends IModelOptions {
		parent?: any;
	}

	interface ICommandOption {
		name?: string;
		aliases?: Array<string>;
		description?: string;
		defaults?: any;
		hide?: boolean;
	}

	interface IParsedArgs {
		[key: string]: any;
		h?: boolean;
		help?: boolean;
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
		/**
		 * The root directory for the project
		 */
		root: string;
		static project(root: string, ui: ui.Ui): Thenable<Project>;
	}
}
