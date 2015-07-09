import Generator from '../_models/control';

export default class TemplateControlGenerator extends Generator {
    static aliases: Array<string> = ['tc'];

    constructor(options: any) {
        super(options, {
            type: 'TemplateControl',
            ext: 'tc'
        });
    }
}
