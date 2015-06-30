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
		canNegate?: boolean;
		defaults?: any;
		hide?: boolean;
	}

	interface IParsedArgs {
		[key: string]: any;
		h?: boolean;
		help?: boolean;
	}

	interface IPackage {
		[key: string]: any;
		version: string;
		name: string;
		bin: {
			[key: string]: string;
		};
	}

	interface ILocalPackage {
		[key: string]: any;
		version: string;
		name: string;
		scripts: any;
		platypi?: any;
	}

	interface IExecOptions {
        cwd?: string;
        stdio?: any;
        customFds?: any;
        env?: any;
        encoding?: string;
        timeout?: number;
        maxBuffer?: number;
        killSignal?: string;
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
		bin: string;
		static project(root: string, ui: ui.Ui): Thenable<Project>;
		getConfig(property: string): any;
		cliPackage(): IPackage;
		package(): ILocalPackage;
		addDependencies(deps: any, dev?: boolean): Thenable<void>;
		addScripts(scripts: any): Thenable<void>;
	}

	class FileUtils {
		read(source: string, options?: any): Thenable<string>;
		write(dest: string, data: string, options?: any): Thenable<void>;
		mkdir(...dirs: Array<string>): Thenable<void>;
		eol(data: string): string;
		mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string;
	}
}
