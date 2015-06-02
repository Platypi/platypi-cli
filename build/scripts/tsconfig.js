/// <reference path="../../typings/tsd.d.ts" />
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');

var root = process.cwd(),
	configDir = path.resolve(root, process.argv[2]),
	configFile = require(path.resolve(configDir, 'tsconfig.json')),
	filesGlob = configFile.filesGlob || [],
	files = _.uniq(filesGlob.concat(configFile.files || [])),
	include = _.filter(files, function(file) {
		return file[0] !== '!';
	}),
	ignore = _.filter(files, function(file) {
		return file[0] === '!';
	});

var pat;
files = _.reduce(include, function(files, pattern) {
	pat = pattern;
	return _.uniq(files.concat(glob.sync(pat, {
		cwd: configDir,
		root: root,
		ignore: ignore
	})));
}, []);

configFile.files = files.sort(function(a, b) {
	var aTsd = a.indexOf('tsd.d.ts') > -1,
		bTsd = b.indexOf('tsd.d.ts') > -1,
		aD = a.indexOf('.d.ts') > -1,
		bD = b.indexOf('.d.ts') > -1;

	if(aTsd) {
		return -1;
	}

	if(bTsd) {
		return 1;
	}

	if(aD && bD) {
		return 0;
	}
	
	if(aD) {
		return -1;
	}
	
	if(bD) {
		return 1;
	}
	
	return 0;
});

fs.writeFileSync(path.resolve(configDir, 'tsconfig.json'), JSON.stringify(configFile, null, 4));
