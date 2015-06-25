import {Promise} from 'es6-promise';
import Generator from '../../models/generator';

var validate: any = require('validate-npm-package-name');

export default class CordovaGenerator extends Generator {
	options: IOptions;
	indexAdd: string = `<!DOCTYPE html>
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
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">`;

	defineOptions(): any {
		this.option('id', {
			description: 'The id of your cordova app'
		});
	}

	askQuestions(): any {
		var options = this.options;

		return this.promptName(options.name).then((name) => {
			options.name = this.utils.startCase(name);
		});
	}

	promptName(name: string = ''): Thenable<string> {
		name = name.trim();
		var utils = this.utils;

		if(utils.isEmpty(name) && utils.isObject(this.project)) {
			var pkg = this.project.package();

			if(utils.isObject(pkg) && utils.isString(pkg.name)) {
				name = pkg.name;
			}
		}

		if(!utils.isEmpty(name)) {
			var valid = validate(name);

			if(utils.isArray(valid.errors) || utils.isArray(valid.warnings)) {
				this.ui.warn('');
				utils.forEach(valid.errors, (err: string) => {
					this.ui.warn(err);
				});

				utils.forEach(valid.warnings, (err: string) => {
					this.ui.warn(err);
				});
				this.ui.warn('');
			} else {
				return Promise.resolve(name);
			}
		}

		return this.ui.prompt([
			{ name: 'name', type: 'input', message: `What is the name of your app?` }
		]).then((answer: { name: string; }) => {
			return this.promptName(answer.name);
		});
	}

	run(): any {
		this.normalizeOptions(this.options);

		return Promise.all([
			this.render('cordova/config.xml', 'cordova/config.xml', this.options),
			this.modifyIndex(),
			this.copy('cordova/res', 'cordova/res'),
			this.mkdirDest('cordova/www')
		]);
	}

	protected normalizeOptions(options: IOptions): void {
		var match: RegExpMatchArray = [];

		if(this.utils.isEmpty(options.id)) {
			options.id = options.name.replace(/\s/g, '');
		} else {
			match = options.id.match(/\./g) || [];
		}

		if(match.length === 0) {
			options.id = `io.platypi.${options.id}`;
		} else if(match.length === 1) {
			if(!/^(io|com|org)\./.test(options.id)) {
				options.id = `com.${options.id}`;
			} else {
				var index = options.id.indexOf('.');

				options.id = options.id.substring(0, index) + '.platypi.' + options.id.substring(index + 1);
			}
		}

		options.id = options.id.replace(/([^\.]*)/g, (match) => {
			return this.utils.camelCase(match).toLowerCase();
		});
	}

	protected modifyIndex(): Thenable<void> {
		var file = this.destRoot() + '/app/index.html';
		return this.file.read(file).then((data) => {
			if(data.indexOf('http-equiv="Content-Security-Policy"') > -1) {
				return;
			}

			var eol = this.file.eol(data),
				lines = data.split(eol),
				index = this.findHead(lines);

			lines.splice(0, index + 1, this.indexAdd);

			return this.file.write(file, lines.join(eol));
		});
	}

	protected findHead(lines: Array<string>) {
		var index = -1;

		lines.some((line, i) => {
			if(line.indexOf('<head>') > -1) {
				index = i;
			}

			return index > -1;
		});

		return index;
	}
}

interface IOptions extends models.IParsedArgs {
	id: string;
	name: string;
}
