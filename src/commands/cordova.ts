import * as path from 'path';
import {Promise} from 'es6-promise';
import Command from '../models/command';

class Cordova extends Command {
    static commandName: string = 'cordova';
    private indexAdd: string = `<!DOCTYPE html>
<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
<html>
    <head>
        <!--
        Customize this policy to fit your own app's needs. For more guidance, see:
            https://github.com/apache/cordova-plugin-whitelist/blob/master/README.md#content-security-policy
        Some notes:
            * gap: is required only on iOS (when using UIWebView) and is needed for JS->native communication
            * https://ssl.gstatic.com is required only on Android and is needed for TalkBack to function properly
            * Disables use of inline scripts in order to mitigate risk of XSS vulnerabilities. To change this:
                * Enable inline JS: add 'unsafe-inline' to default-src
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-eval'; style-src * 'unsafe-inline'; media-src *">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">`;

    private defaultComponent: IComponent = {
        component: path.resolve(__dirname, '..', 'cordova'),
        command: 'create',
        prefix: 'plat-cordova-'
    };

    help(command: string): any {
        return super.help(command).then(() => {
            this.ui.help(`Here is the \`cordova\` help:`);
            this.ui.help(`..........................................................`);
            return this.exec(this.args);
        });
    }

    generalHelp(command: string): any {
        var baseCommand = this.buildFullCommand().join(' ');

        this.ui.help(`
  This command will run \`cordova\` commands in the context of your cordova project directory.

  General Usage:

    ${baseCommand} <command> [...options]`);
    }

    run(): any {
        return this.exec(this.args);
    }

    protected exec(args: Array<string>): Thenable<any> {
        if (args[0] === 'cordova') {
            args = args.slice(1);
        }

        var arg = args[0],
            promise: Thenable<void>;

        if (arg === 'build' || arg === 'compile') {
            promise = this.modifyIndex();
        } else {
            promise = Promise.resolve<void>();
        }

        return promise.then(() => {
            return this.process.exec('cordova', args, {
                cwd: path.resolve(this.project.root, 'cordova')
            });
        });
    }

    protected modifyIndex(): Thenable<void> {
        var cordova = '<script type="text/javascript" src="cordova.js"></script>',
            haveCordova = false,
            scriptStart: number = -1,
            file = path.resolve(this.project.root, 'cordova/www/index.html');

        return this.file.read(file).then((data) => {
            var eol = this.file.eol(data),
                lines = data.split(eol);

            this.addIndexHead(lines, data);

            haveCordova = lines.some((line, index) => {
                if (line.indexOf('src="cordova.js"') > -1) {
                    return true;
                }

                if (scriptStart === -1 && line.indexOf('<script') > -1) {
                    scriptStart = index;
                }
            });

            if (!haveCordova) {
                var spaces = (/^(\s*)/.exec(lines[scriptStart]) || ['', ''])[1];

                lines.splice(scriptStart, 0, spaces + cordova);
            }

            return this.file.write(file, lines.join(eol));
        });
    }

    protected addIndexHead(lines: Array<string>, data: string): void {
        if (data.indexOf('http-equiv="Content-Security-Policy"') > -1) {
            return;
        }

        this.ui.info('Adding cordova tags to index.html');

        var index = this.findHead(lines);
        lines.splice(0, index + 1, this.indexAdd);
    }

    protected findHead(lines: Array<string>): number {
        var index = -1;

        lines.some((line, i) => {
            if (line.indexOf('<head>') > -1) {
                index = i;
            }

            return index > -1;
        });

        return index;
    }
}

export default Cordova;
