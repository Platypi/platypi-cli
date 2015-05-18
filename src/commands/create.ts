/// <reference path="../references.d.ts" />

import Command from '../models/command';

class Create extends Command {
	static name = 'create';
	
	run(options: any) {
		this.ui.info('create command!');
	}
}

export = Create;
