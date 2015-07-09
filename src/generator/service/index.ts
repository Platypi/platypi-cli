import Generator from '../_models/base';

export default class ServiceGenerator extends Generator {
    static aliases: Array<string> = ['svc'];

    constructor(options: any) {
        super(options, {
            type: 'Service',
            ext: 'svc',
            allowExtends: true
        });
    }
}
