declare module 'readline2' {
	import * as readline from 'readline';

	export = readline;
}

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
	default?: string|number|Array<string>|((answers: any) => any);

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
