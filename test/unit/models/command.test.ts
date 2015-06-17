import {use, expect} from 'chai';
import {spy as spyOn, stub} from 'sinon';
import Command from '../../../src/models/command';
import Ui from '../mock/ui.mock';
import NotImplementedError from '../../../src/errors/notimplemented';
import ValidationError from '../../../src/errors/validation';

use(require('chai-as-promised'));
use(require('sinon-chai'));

describe('Command', () => {
	var command: Command;

	beforeEach(() => {
		command = new Command({
			ui: new Ui()
		});
	});

	it('should throw a NotImplementedError when trying to run', (done) => {
		expect(command.validateAndRun([''])).to.eventually.rejectedWith(NotImplementedError).notify(done);
	});

	it('should throw a ValidationError when command is invalid', (done) => {
		stub(command, 'validate', () => {
			return false;
		});

		expect(command.validateAndRun([''])).to.eventually.rejectedWith(ValidationError);
		expect(command.validateAndRun(['create'])).to.eventually.rejectedWith(ValidationError).notify(done);
	});
});
