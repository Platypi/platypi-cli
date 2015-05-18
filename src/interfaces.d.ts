/// <reference path="references.d.ts" />

declare module 'readline2' {
	import * as readline from 'readline';
	
	export = readline;
}

interface IQuestion {
	name: string;
	message: string|((answers: any) => string);
	type?: string;
	default?: string|number|Array<string|{ name: string; value: string; }>|((answers: any) => any);
	choices?: Array<string|{ name: string; value: string; }>|((answers: any) => string|{ name: string; value: string; });
	validate?: (input: any) => boolean;
	filter?: (input: any) => any;
	when?: boolean|((answers: any) => boolean);
}
