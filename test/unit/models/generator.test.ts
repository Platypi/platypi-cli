import * as path from 'path';
import * as fs from 'fs';
import {use, expect} from 'chai';
import {spy as spyOn, stub} from 'sinon';
import Generator from '../../../src/models/generator';
import Ui from '../mock/ui.mock';
import NotImplementedError from '../../../src/errors/notimplemented';
import ValidationError from '../../../src/errors/validation';
import {Promise} from 'es6-promise';

use(require('chai-as-promised'));
use(require('sinon-chai'));

class MockGenerator extends Generator {
	srcRoot(source?: string): string {
		return super.srcRoot(source);
	}

	destRoot(source?: string): string {
		return super.destRoot(source);
	}

	render(source: string, dest: string, context?: any): any {
		return super.render(source, dest, context);
	}

	mkdirDest(...dirs: Array<string>): any {
		return super.mkdirDest.apply(this, dirs);
	}
}

describe('Generators', () => {
	var command: MockGenerator;

	beforeEach(() => {
		command = new MockGenerator({
			ui: new Ui(),
			env: undefined,
			directory: '.',
			project: <any>{
				root: '.',
				version: '1.0.0',
				bin: 'plat'
			}
		});
	});

	it('should set default paths for srcRoot', () => {
		expect(command.srcRoot()).to.equal(path.resolve('.', 'templates'));
	});

	it('should set default paths for destRoot', () => {
		expect(command.destRoot()).to.equal(path.resolve('.'));
	});

	it('should make a directory using destRoot when use mkdirDest', () => {
		var mkdir = stub(command, 'mkdir', () => { });
		command.mkdirDest('foo', 'bar');
		expect(mkdir).to.have.been.calledWith(path.resolve(command.destRoot(), 'foo'), path.resolve(command.destRoot(), 'bar'));
	});
});
