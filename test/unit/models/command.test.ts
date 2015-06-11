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

	it('should call help when -h or --help are passed through', (done) => {
		var spy = spyOn(command, 'help');

		command.validateAndRun(['create', '-h']).then(() => {
			expect(spy).to.have.been.calledOnce;
			return command.validateAndRun(['create', '--help']);
		}).then(() => {
			expect(spy).to.have.been.calledTwice;
			return command.validateAndRun(['create']);
		}).then(() => {
			expect(spy).to.have.been.calledTwice;
		}, () => {
			expect(spy).to.have.been.calledTwice;
		}).then(done, done);
	});

	it('should log on help', () => {
		var spy = spyOn(),
			command = new Command({
				ui: new Ui((<any>spy))
			});

		command.help('create');

		expect(spy).to.have.been.calledOnce;
		expect(spy.lastCall.args[1]).to.equal(Ui.LOG_LEVEL.INFO);
	});
});
