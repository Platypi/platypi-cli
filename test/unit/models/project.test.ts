import {use, expect} from 'chai';
import {spy as spyOn} from 'sinon';
import Project from '../../../src/models/project';
import Ui from '../mock/ui.mock';

use(require('chai-as-promised'));
use(require('sinon-chai'));

describe('Project', () => {
	it('should find a package', (done) => {
		var promise = Project.project(new Ui(), process.cwd()).then(() => {}, () => {});
		expect(promise).to.eventually.be.an('undefined').notify(done);
	});
});
