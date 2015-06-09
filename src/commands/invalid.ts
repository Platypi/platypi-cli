import Command from '../models/command';
import NotFoundError from '../errors/silent';

export default class Invalid extends Command {
	static commandName: string = 'invalid';

	validate(args: IParsedArgs): any {
		var command = args.commands[0];
		throw new NotFoundError(`\`${command}\` is not a valid command.`);
	}
}
