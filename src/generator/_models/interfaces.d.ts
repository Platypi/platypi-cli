declare module generator {

	interface IOptions extends models.IParsedArgs {
		name: string;
		dir?: string;
		register?: boolean;
		extends?: any;
	}

	interface IControlOptions extends IOptions {
		less?: boolean;
		html?: boolean;
	}

	interface IConfig {
		ext: string;
		type: string;
		allowExtends?: boolean;
		noFileExtension?: boolean;
	}

	interface IControlConfig extends IConfig {
		noLessOrHtml?: boolean;
	}
}
