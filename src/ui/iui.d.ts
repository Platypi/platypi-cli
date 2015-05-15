/// <references path="../references.d.ts" />

declare module models.ui {
	interface IOptions {
		logLevel?: string | number;
		input: NodeJS.ReadableStream;
		output: NodeJS.WritableStream;
	}
}
