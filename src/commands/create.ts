import Command from '../models/command';

class Create extends Command {
	static commandName: string = 'create';
	static aliases: Array<string> = ['c', 'generate', 'gen'];

	protected options: ICreateArgs;

	generalHelp(command: string): any {
		var component = this.commands[0];
		return this.env.listGenerators(component).then((commands) => {
			this.ui.help(`
  General Usage:

    ${this.buildFullCommand().join(' ')} <component> [...options]

  Commands:
`);
			commands.forEach((c) => {
				this.ui.help(`    ${this.buildFullCommand().join(' ')} ${c} -h`);
			});
		});
	}

	run(): any {
		var component = this.commands[0];
		return this.env.generator(component, this)
			.then(generator => generator.validateAndRun(this.args));
	}
}

export = Create;

interface ICreateArgs extends models.IParsedArgs {

}
