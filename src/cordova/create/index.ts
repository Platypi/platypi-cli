import * as path from 'path';
import * as glob from 'glob';
import {Promise} from 'es6-promise';
import Command from '../../models/command';
import {pluralize} from '../../utils/utils';

export default class Create extends Command {
	run(): any {
		this.help((<any>this)._originalArgs[0]);
	}
}
