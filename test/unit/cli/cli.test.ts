/// <reference path="../../references.d.ts" />

import * as chai from 'chai';
import {expect} from 'chai';
import Cli from '../../../src/cli/cli';
import getCreate from '../mock/create.mock';
import Ui from '../mock/ui.mock';

import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('cli', () => {
	it('should run a command when it is matched', (done) => {
		var cli = new Cli({
			ui: new Ui()
		});
		
		var ranCreate = false,
			Create = getCreate(() => {
				ranCreate = true;
			});
		
		expect(cli.run({
			commands: {
				create: Create
			},
			args: [Create.commandName]
		})).to.eventually.be.an('undefined').notify(() => {
			expect(ranCreate).to.be.ok;
			done();
		});
	});
});
