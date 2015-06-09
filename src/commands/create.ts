import Command from '../models/command';

class Create extends Command {
	static commandName: string = 'create';
	static aliases: Array<string> = ['c', 'generate', 'gen'];

	protected args: ICreateArgs;

	run(): any {
		var component = this.commands[0];

		return this.env.generator(component).validateAndRun(this.args);
	}
}

export = Create;

interface ICreateArgs extends IParsedArgs {

}
