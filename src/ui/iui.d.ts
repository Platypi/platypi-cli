declare module ui {
	class Ui {
		static LOG_LEVEL: ILogLevels;

		static PROMPTS: IPrompts;

		error(error: any): void;
		warn(message: string): void;
		info(message: string): void;
		debug(message: string): void;
		trace(message: string): void;
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
