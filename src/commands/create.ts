import Command from '../models/command';

class Create extends Command {
	static commandName: string = 'create';

	run(): any {
		this.ui.info('create command!');
	}
	
	validate(args: IParsedArgs) {
		var commands = args.commands;
		
		return commands.length > 0;
	}
}

export = Create;
