import * as fs from 'fs';
import Base from './base';
import Environment from '../environment/environment';

export default class Generator extends Base {
	protected env: Environment;

	constructor(options: IGeneratorOptions) {
		super(options);
		this.env = options.env;
	}

	generate() {
		this.ui.debug('Generating');
	}

	protected render(source: string, destination: string, options: any) {
		
	}
}

interface IGeneratorOptions extends models.IModelOptions {
	env: Environment;
}
