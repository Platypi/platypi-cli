import Command from '../models/command';

class Create extends Command {
	static commandName: string = 'create';

	run(options: any): any {
		this.ui.info('create command!');
	}
}

export = Create;
