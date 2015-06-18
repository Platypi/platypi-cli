import Command from '../models/command';

class Cordova extends Command {
	static commandName: string = 'cordova';

	generalHelp(command: string): any {
			this.ui.help(`
  General Usage:

    ${this.buildFullCommand().join(' ')} <command> [...options]

  Commands:
`);
	}

	run(): any {
		var component = this.commands[0];
		return this.env.generator(component, this)
			.then(generator => generator.validateAndRun(this.args));
	}
}

export = Cordova;
