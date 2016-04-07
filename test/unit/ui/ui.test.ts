import {use, expect} from 'chai';
import {spy as spyOn, stub} from 'sinon';
import Ui from '../../../src/ui/ui';
import * as through from 'through';
import * as chalk from 'chalk';

use(require('chai-as-promised'));
use(require('sinon-chai'));

describe('Ui', () => {
    let ui: Ui,
        spy: Sinon.SinonSpy;

    beforeEach(() => {
        ui = new Ui({
            input: through((data) => { }),
            output: through((data) => { })
        });

        spy = spyOn(ui, 'log');
    });

    afterEach(() => {
        spy.restore();
    });

    it('should log at info by default', () => {
        let shouldLogSpy = spyOn(ui, 'shouldLog');
        ui.log('test');

        expect(spy).to.have.been.calledOnce;
        expect(spy.lastCall.args[1]).to.be.an('undefined');
        expect(shouldLogSpy.lastCall.args[0]).to.equal(Ui.LOG_LEVEL.INFO);

        shouldLogSpy.restore();
    });

    it('should prompt asynchronously', (done) => {
        let promptStub = stub((<any>ui).inquirer, 'prompt', (obj: any, cb) => {
            cb();
        });

        expect(ui.prompt([])).to.eventually.be.an('undefined').notify(done);
        promptStub.restore();
    });

    describe('progress', () => {
        ['start', 'stop'].forEach((value) => {
            let progressStub: Sinon.SinonStub;

            beforeEach(() => {
                progressStub = stub((<any>ui).progress, value);
            });

            afterEach(() => {
                progressStub.restore();
            });

            it(`should ${value} at info level`, () => {
                ui[value + 'Progress']();

                expect(progressStub).to.have.been.calledOnce;
            });

            it(`should ${value} below info level`, () => {
                ui.setLogLevel(Ui.LOG_LEVEL.TRACE);
                ui[value + 'Progress']();

                expect(progressStub).to.have.been.calledOnce;
            });

            it(`should not ${value} above info level`, () => {
                ui.setLogLevel(Ui.LOG_LEVEL.WARN);
                ui[value + 'Progress']();

                expect(progressStub).not.to.have.been.called;
            });
        });
    });

    function errorMethod(): void {
        it('should do nothing if called with falsy values', () => {
            let err;

            ui.error(err);
            err = null;
            ui.error(err);
            err = 0;
            ui.error(err);
            err = '';
            ui.error(err);

            expect(spy).not.to.have.been.called;
        });

        it('should accept a string', () => {
            let err = 'test message';
            ui.error(err);

            expect(spy).to.have.been.calledOnce;
            expect(spy.lastCall.args[1]).to.equal(Ui.LOG_LEVEL.ERROR);
        });

        it('should accept an object', () => {
            let err = {
                message: 'test message'
            };

            ui.error(err);

            expect(spy).to.have.been.calledOnce;
            expect(spy.lastCall.args[1]).to.equal(Ui.LOG_LEVEL.ERROR);
        });

        it('should accept an error', () => {
            let err = new Error('test message');

            ui.error(err);

            expect(spy).to.have.been.calledTwice;
            expect(spy.lastCall.args[1]).to.equal(Ui.LOG_LEVEL.ERROR);
        });
    }

    ['error', 'warn', 'info', 'debug', 'trace'].forEach((value) => {
        let level = Ui.LOG_LEVEL[value.toUpperCase()];
        describe(`${value} method`, () => {
            beforeEach(() => {
                ui.setLogLevel(value.toUpperCase());
            });

            if (value === 'error') {
                errorMethod();
            }

            it(`should log at a ${value} level`, () => {
                ui[value]('message');

                expect(spy).to.have.been.calledOnce;
                expect(spy.lastCall.args[1]).to.equal(level);
            });

            it(`should log below ${value} level`, () => {
                ui.setLogLevel(level - 1);
                ui[value]('message');

                expect(spy).to.have.been.calledOnce;
                expect(spy.lastCall.args[1]).to.equal(level);
            });

            it(`should not log above ${value} level`, () => {
                let outputSpy = spyOn((<any>ui).output, 'write');
                ui.setLogLevel(level + 1);
                ui[value]('message');

                if (value !== 'error') {
                    expect(outputSpy).not.to.have.been.called;
                } else {
                    expect(outputSpy).to.have.been.called;
                    expect(spy.lastCall.args[1]).to.equal(level);
                }

                outputSpy.restore();
            });
        });
    });
});
