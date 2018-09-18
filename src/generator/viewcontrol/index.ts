import Generator from '../_models/control';

export default class ViewControlGenerator extends Generator {
    static aliases: Array<string> = ['vc'];

    options: IViewControlOptions;

    constructor(options: any) {
        super(options, {
            type: 'ViewControl',
            ext: 'vc',
            allowExtends: true
        });
    }

    defineOptions(): void {
        super.defineOptions();

        this.option('router', {
            aliases: ['r'],
            description: `Inject a router to define child routes`,
            defaults: false
        });
    }

    protected _renderFile(ext: string, src: string, dest: string, config: any): Promise<any> {
        if(this.options.router && (ext === '.ts' || ext === '.html')) {
            src = 'routing.' + src;
        }

        return super._renderFile(ext, src, dest, config);
    }
}

interface IViewControlOptions extends generator.IControlOptions {
    router?: boolean;
}
