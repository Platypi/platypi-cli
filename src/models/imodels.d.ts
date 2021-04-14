declare namespace models {
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
        encoding?: BufferEncoding;
        timeout?: number;
        maxBuffer?: number;
        killSignal?: number;
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
        static project(root: string, ui: ui.Ui): Promise<Project>;
        getConfig(property: string): any;
        cliPackage(): IPackage;
        package(): ILocalPackage;
        addDependencies(deps: any, dev?: boolean): Promise<void>;
        addScripts(scripts: any): Promise<void>;
    }

    class FileUtils {
        read(source: string, options?: any): Promise<string>;
        write(dest: string, data: string, options?: any): Promise<void>;
        mkdir(...dirs: Array<string>): Promise<void>;
        eol(data: string): string;
        mapLines(
            handler: (
                line: string,
                index: number,
                lines: Array<string>
            ) => string,
            data: string
        ): string;
    }
}
