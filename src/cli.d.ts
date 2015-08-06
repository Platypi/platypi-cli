/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/glob/glob.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
declare module 'platypi-cli' {
    import * as utils from 'lodash';
    class BaseObject {
        protected ui: models.ui.Ui;
        protected project: models.Project;
        protected utils: typeof utils;

        constructor(options: models.IModelOptions);
        protected instantiate<T>(Constructor: new (opts: models.IModelOptions) => T, options?: any): T;
    }

    class Environment extends BaseObject {
        fileUtils: models.FileUtils;
        constructor(options: models.IModelOptions);
        command(defaults: models.IComponent, command?: string, parent?: Command): Thenable<any>;
        listCommands(defaults: models.IComponent, command?: string): Thenable<Array<string>>;
        protected parseComponent(defaults: models.IComponent, command: string): models.IComponent;
    }

    class ProcessUtils extends BaseObject {
        exec(command: string, args?: Array<string>, options?: models.IExecOptions): Thenable<any>;
    }

    export class Command extends BaseObject {
        protected needsProject: boolean;
        protected env: Environment;
        protected parent: Command;
        protected args: Array<string>;
        protected options: models.IParsedArgs;
        protected commands: Array<string>;
        protected file: models.FileUtils;
        protected process: ProcessUtils;

        constructor(options: models.ICommandOptions);
        help(command?: string): Thenable<void>;
        validateAndRun(commandArgs: Array<string>): Thenable<any>;

        protected defineOptions(): void;
        protected askQuestions(): any;
        protected validate(): any;
        protected run(): any;
        protected buildFullCommand(): Array<string>;
        protected generalHelp(command: string): any;
        protected commandsHelp(command: string): any;
        protected aliasesHelp(command: string): any;
        protected optionsHelp(command: string): any;
        protected parseOptions(): void;
        protected option(name: string, config: models.ICommandOption): Command;
    }

    export class Generator extends Command {
        protected directory: string;
        protected render(source: string, destination: string, context?: any): Thenable<void>;
        protected mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string;
        protected srcRoot(source?: string): string;
        protected destRoot(dest?: string): string;
        protected mkdirDest(...dirs: Array<string>): Thenable<any>;
        protected copy(src: string, dest: string): Thenable<void>;
    }

    export default function(options: { args: Array<string>; input: NodeJS.ReadableStream; output: NodeJS.WritableStream; }): Thenable<any>;
}

declare module models {
    /**
    * A question object is a hash containing question related values
    */
    interface IQuestion {
        /**
        * The name to use when storing the answer in the answers hash.
        */
        name: string;

        /**
        * The question to print. If defined as a function, the first parameter will be the current inquirer session answers.
        */
        message: string|((answers: any) => string);

        /**
        * Type of the prompt. Defaults: input - Possible values: input, expand, confirm, list, rawlist, password
        */
        type?: string;

        /**
        * Default value(s) to use if nothing is entered, or a function that returns the default value(s).
        * If defined as a function, the first parameter will be the current inquirer session answers.
        */
        default?: string|boolean|number|Array<string>|((answers: any) => any);

        /**
        * Choices array or a function returning a choices array. If defined as a function, the first parameter will be the
        * current inquirer session answers. Array values can be simple strings, or objects containing a name (to display)
        * and a value properties (to save in the answers hash).
        */
        choices?: Array<string|{ key?: string; name: string; value: string; }>|((answers: any) => string);

        /**
        * Receive the user input and should return true if the value is valid, and an error message (String) otherwise. If
        * false is returned, a default error message is provided.
        */
        validate?: (input: any) => boolean;

        /**
        * Receive the user input and return the filtered value to be used inside the program. The value returned will be added to
        * the Answers hash.
        */
        filter?: (input: any) => any;

        /**
        * Receive the current user answers hash and should return true or false depending on whether or not this question
        * should be asked. The value can also be a simple boolean.
        */
        when?: boolean|((answers: any) => boolean);
    }

    interface IEnvironment {
        args?: Array<string>;
        commands?: any;
    }

    interface IComponent {
        component: string;
        command: string;
        prefix: string;
    }

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
        copy(src: string, dest: string): Thenable<void>;
        mkdir(...dirs: Array<string>): Thenable<void>;
        eol(data: string): string;
        spaces(length: number): string;
        mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string;
        dir(src: string, ignores?: Array<string|RegExp>): Thenable<Array<string>>;
        requireAll(src: string, directories: Array<string>): { [key: string]: any; };
        protected ensureWritable(file: string): Thenable<void>;
    }

    module ui {
        class Ui {
            static LOG_LEVEL: ILogLevels;

            static PROMPTS: IPrompts;

            LOG_LEVEL: ILogLevels;
            PROMPTS: IPrompts;

            error(error: any): void;
            warn(message: string): void;
            info(message: string): void;
            debug(message: string): void;
            trace(message: string): void;
            help(message: string): void;
            log(message: any, logLevel?: number): void;
            logLine(message: any, logLevel?: number): void;
            prompt(questions: Array<IQuestion>): Thenable<any>;
            startProgress(message?: string, stepString?: string): void;
            stopProgress(printWithFullStepString?: boolean): void;
            setLogLevel(level: string | number): void;
        }

        interface ILogLevels {
            ERROR: number;
            WARN: number;
            INFO: number;
            DEBUG: number;
            TRACE: number;
        }

        interface IPrompts {
            INPUT: string;
            EXPAND: string;
            CONFIRM: string;
            LIST: string;
            RAWLIST: string;
            PASSWORD: string;
        }

        interface IOptions {
            logLevel?: string | number;
            input: NodeJS.ReadableStream;
            output: NodeJS.WritableStream;
        }
    }
}
