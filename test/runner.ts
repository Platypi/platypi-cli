/// <reference path="references.d.ts" />

import * as glob from 'glob';
import Mocha = require('mocha');


if (process.env.EOLNEWLINE) {
	require('os').EOL = '\n';
}

var mocha = new Mocha({
	timeout: 5000,
	reporter: 'spec'
});

var arg = process.argv[2];
var root = __dirname + '/unit';

function addFiles(mocha, files) {
	console.log(root + files);
	console.log(glob.sync(root + files));
	glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

if (arg === 'all') {
	addFiles(mocha, '/**/*.test.js');
} else if (arg)  {
	mocha.addFile(arg);
} else {
	addFiles(mocha, '/**/*.test.js');
}

mocha.run(function(failures) {
	process.on('exit', function() {
		process.exit(failures);
	});
});
