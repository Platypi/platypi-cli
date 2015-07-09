import Generator from '../_models/base';

export default class InjectableGenerator extends Generator {
    static aliases: Array<string> = ['inj'];

    constructor(options: any) {
        super(options, {
            type: 'Injectable',
            ext: 'inj',
            noFileExtension: true
        });
    }
}
