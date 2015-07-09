import * as path from 'path';
import Command from '../models/command';

class Create extends Command {
    static commandName: string = 'create';
    static aliases: Array<string> = ['c'];

    protected options: ICreateArgs;
    private defaultComponent: IComponent = {
        component: path.resolve(__dirname, '..', 'generator'),
        command: 'app',
        prefix: 'plat-generator-'
    };

    generalHelp(command: string): any {
        var baseCommand = this.buildFullCommand().join(' ');
        this.ui.help(`
  General Usage:

    ${baseCommand} <component> [...options]`);
    }

    commandsHelp(command: string): any {
        var baseCommand = this.buildFullCommand().join(' ');

        return this.env.listCommands(this.defaultComponent, this.commands[0]).then((commands) => {
            this.ui.help(`
  Commands:`);
            commands.forEach((c) => {
                this.ui.help(`    ${baseCommand} ${c} -h`);
            });
        });
    }

    run(): any {
        return this.env.command(this.defaultComponent, this.commands[0], this)
            .then(generator => generator.validateAndRun(this.args));
    }
}

export = Create;

interface ICreateArgs extends models.IParsedArgs {

}
