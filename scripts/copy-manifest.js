var path = require('path');
var fs = require('fs');
var glob = require('glob');

var getProjectAssets = require('./get-project-assets');

var package = require(path.join(__dirname, '../package.json'));
var manifest = require(path.join(__dirname, '../manifest.json'));

var angular = require(path.join(__dirname, '../angular.json'));
var project = angular.projects[angular.defaultProject];
var build = project.architect.build;
var outputPath = path.join(__dirname, '..', build.options.outputPath, '/');


var assets = getProjectAssets(outputPath);

var newManifest = {
    ...manifest,
    version: package.version,
    content_scripts: [
        {
            ...manifest.content_scripts[0], // TODO: use better configuration
            js: assets.js,
            css: assets.css,
        },
    ],
    web_accessible_resources: glob
        .sync(path.join(outputPath, '**'))
        .map(file => file.slice(outputPath.length))
        .filter(Boolean),
};

var newManifestPath = path.join(outputPath, 'manifest.json');


fs.writeFileSync(newManifestPath, JSON.stringify(newManifest));
