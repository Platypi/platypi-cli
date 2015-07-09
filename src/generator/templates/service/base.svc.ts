import {async, Utils} from 'platypus';

export default class {{capitalizeFirst name}}Service {
	protected static _inject: any = {
        http: async.Http,
        Promise: async.IPromise,
        utils: Utils
    };

	protected http: async.Http;
	protected Promise: async.IPromise;
	protected utils: Utils;

    host: string = 'my-host';
}
