import {use, expect} from 'chai';
import {spy as spyOn} from 'sinon';
import Command from '../../../src/models/command';
import Ui from '../mock/ui.mock';
import SilentError from '../../../src/errors/silent';

use(require('sinon-chai'));

describe('Command', () => {
	it('should throw an error when trying to run', () => {
		var command = new Command({
			ui: new Ui()
		});

		expect(command.run).to.throw(SilentError);
	});
	
	it('should log on help', () => {
		var spy = spyOn(),
			command = new Command({
				ui: new Ui((<any>spy))
			});

		command.help();
		
		expect(spy).to.have.been.calledOnce;
		expect(spy.lastCall.args[1]).to.equal(Ui.LOG_LEVEL.INFO);
	});
});
