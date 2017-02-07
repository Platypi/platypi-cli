import * as utils from 'lodash';
import * as chalk from 'chalk';
import * as through from 'through';
import {Promise} from 'es6-promise';
import {EOL} from 'os';

let Progress: any = require('pleasant-progress');
let inquirer: any = require('inquirer');

let LOG_LEVEL = {
    ERROR: 5,
    WARN: 4,
    INFO: 3,
    DEBUG: 2,
    TRACE: 1
};

let PROMPTS = {
    INPUT: 'input',
    EXPAND: 'expand',
    CONFIRM: 'confirm',
    LIST: 'list',
    RAWLIST: 'rawlist',
    PASSWORD: 'password'
};

export default class Ui {
    static LOG_LEVEL: ui.ILogLevels = LOG_LEVEL;
    static PROMPTS: ui.IPrompts = PROMPTS;

    LOG_LEVEL: ui.ILogLevels = Ui.LOG_LEVEL;
    PROMPTS: ui.IPrompts = Ui.PROMPTS;

    protected chalk: chalk.Chalk = chalk;
    protected Prompt: any = inquirer.ui.Prompt;
    protected input: NodeJS.ReadableStream;
    protected logLevel: number;
    protected output: NodeJS.ReadWriteStream;
    protected progress: { start: (message?: string, stepString?: string) => void; stop: (printWithFullStepString?: boolean) => void; };
    protected Promise: typeof Promise = Promise;
    protected through: typeof through = through;
    protected inquirer: any = inquirer;
    protected utils: typeof utils = utils;

    constructor(protected options: ui.IOptions) {
        let progress = this.progress = new Progress();

        this.output = this.through(function(data: any): void {
            progress.stop(true);
            this.emit('data', data);
        });

        this.output.setMaxListeners(0);
        this.output.pipe(options.output);
        this.input = options.input;
        this.setLogLevel(options.logLevel);
    }

    error(error: any): void {
        if (!error) {
            return;
        }

        let message: string = error.message,
            stack: string = error.stack;

        if (this.utils.isString(stack)) {
            this.logLine(this.makePretty(stack.slice(0, stack.indexOf(message) + message.length), chalk.red), LOG_LEVEL.ERROR);
            this.logLine(stack.slice(stack.indexOf(message) + message.length + 1), LOG_LEVEL.ERROR);
            return;
        }

        if (this.utils.isString(message)) {
            this.logLine(this.makePretty(message, chalk.red), LOG_LEVEL.ERROR);
        } else {
            this.logLine(this.makePretty(error, chalk.red), LOG_LEVEL.ERROR);
        }
    }

    warn(message: string): void {
        this.logLine(this.makePretty(message, chalk.yellow), LOG_LEVEL.WARN);
    }

    info(message: string): void {
        this.logLine(message, LOG_LEVEL.INFO);
    }

    debug(message: string): void {
        this.logLine(this.makePretty(message, chalk.green), LOG_LEVEL.DEBUG);
    }

    trace(message: string): void {
        this.logLine(this.makePretty(message, chalk.magenta), LOG_LEVEL.TRACE);
    }

    help(message: string): void {
        this.logLine(message, 999);
    }

    log(message: any, logLevel: number = LOG_LEVEL.INFO): void {
        if (this.utils.isString(message) && message.indexOf('\u001b') === -1) {
            message = (<string>message).replace(/`[^`]*`/g, (substr) => {
                return <string><any>this.chalk.cyan(substr);
            });
        }

        if (this.shouldLog(logLevel)) {
            this.output.write(message);
        }
    }

    logLine(message: any, logLevel?: number): void {
        this.log(message + EOL, logLevel);
    }

    prompt(questions: Array<IQuestion>): Thenable<any> {
        questions = questions.map((question) => {
           if(this.utils.isString(question.message)) {
               question.message = this.makePretty(<string>question.message, chalk.reset);
           }

           return question;
        });

        return new this.Promise((resolve) => {
            this.inquirer.prompt(questions, resolve);
        });
    }

    startProgress(message?: string, stepString?: string): void {
        if (!this.shouldLog(LOG_LEVEL.INFO)) {
            return;
        }

        this.progress.start(message, stepString);
    }

    stopProgress(printWithFullStepString?: boolean): void {
        if (this.shouldLog(LOG_LEVEL.INFO)) {
            this.progress.stop(printWithFullStepString);
        }
    }

    setLogLevel(level: string | number): void {
        if (this.utils.isNumber((<any>LOG_LEVEL)[level])) {
            this.logLevel = (<any>LOG_LEVEL)[level];
            return;
        } else if (level < LOG_LEVEL.TRACE) {
            this.logLevel = LOG_LEVEL.TRACE;
            return;
        } else if (level > LOG_LEVEL.ERROR) {
            this.logLevel = LOG_LEVEL.ERROR;
            return;
        }

        this.logLevel = <number>level;
    }

    protected makePretty(message: string, color: chalk.ChalkChain): string {
        if (!this.utils.isString(message)) {
            return <any>color(message);
        }

        return this.utils.map(message.split(/(`[^`]*`)/g), (val) => {
            if (val[0] === '`') {
                return chalk.cyan(val);
            }

            return color(val);
        }).join('');
    }

    protected shouldLog(logLevel: number): boolean {
        return logLevel >= (this.logLevel || LOG_LEVEL.INFO);
    }
}
