/// <reference path="../../typings/tsd.d.ts" />
var glob = require('glob');
var Linter = require('tslint');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EOL = require('os').EOL;

var root = process.cwd(),
	configuration = require(path.resolve(root, process.argv.pop())),
	options = process.argv.slice(2),
	colors = util.inspect.colors,
	_red = ['\033[' + (colors.red[0] + 60) + 'm', '\033[' + colors.red[1] + 'm'],
	_green = ['\033[' + colors.green[0] + 'm', '\033[' + colors.green[1] + 'm'],
	_cyan = ['\033[' + colors.cyan[0] + 'm', '\033[' + colors.cyan[1] + 'm'];

var filesOption = options.indexOf('--files-property'),
	files = [];

if(filesOption < 0) {
	filesOption = options.indexOf('-files');
}

if(filesOption > -1) {
	files = configuration[options.splice(filesOption, 2)[1]];
}

var lintOption = options.indexOf('--lint-options-property');

if(lintOption < 0) {
	lintOption = options.indexOf('-lint');
}

if(lintOption > -1) {
	configuration = configuration[options.splice(lintOption, 2)[1]];
}

function log(color, message) {
	if(!message) {
		message = color;
		color = ['', ''];
	}

	console.log(color[0] + message + color[1]);
}

var red = log.bind(null, _red),
	green = log.bind(null, _green),
	cyan = log.bind(null, _cyan);

function lintFiles(files, config) {
	var failed = 0;

	cyan('Linting ' + files.length + ' file' + (files.length === 1 ? '' : 's'));

	files.map(function(file) {
			try {
				return [(new Linter(file, fs.readFileSync(file, 'utf8'), config)).lint(), file];
			} catch(e) {
				return [{
					failureCount: 0
				}, file];
			}
		})
		.sort(function(a, b) {
			a = a[0];
			b = b[0];

			if(a.failureCount > b.failureCount) {
				return 1;
			}
			
			if(b.failureCount > a.failureCount) {
				return -1;
			}
			
			return 0;
		})
		.map(function(results) {
			var result = results[0];

			if(result.failureCount <= 0) {
				return '';
			}
			
			failed += result.failureCount;	
		
			return result.output.split(/\r\n|\n/).map(function(line) {
				if(line === '') {
					return;
				}

				return line;
			}).join(EOL);
		}).forEach(function(value) {
			if(!value) {
				return;
			}

			log(value);
		});

	return failed;
}

var failed = lintFiles(files, {
	formatter: 'prose',
	configuration: configuration
});

var message = 'Done with ' + failed + ' failures.';

if(failed > 0) {
	red(message);
} else {
	green(message);
}
