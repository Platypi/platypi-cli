import Command from '../models/command';

class Create extends Command {
	static commandName: string = 'create';
	static aliases: Array<string> = ['c'];

	protected options: ICreateArgs;

	generalHelp(command: string): any {
		var component = this.commands[0],
			baseCommand = this.buildFullCommand().join(' ');
		return this.env.listGenerators(component).then((commands) => {
			this.ui.help(`
  General Usage:

    ${baseCommand} <component> [...options]

  Commands:
`);
			commands.forEach((c) => {
				this.ui.help(`    ${baseCommand} ${c} -h`);
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
