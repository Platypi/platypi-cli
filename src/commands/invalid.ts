import Command from '../models/command';
import NotFoundError from '../errors/notfound';

export default class Invalid extends Command {
	static commandName: string = 'invalid';

	help(): any {
		this.ui.info(`Platypi CLI Help`);
	}

	validate(): any {
		var command = this.commands[0];
		if(this.utils.isString(command)) {
			throw new NotFoundError(`\`${command}\` is not a valid command.`);
		}

		this.help();
	}

	run(): any { }
}
