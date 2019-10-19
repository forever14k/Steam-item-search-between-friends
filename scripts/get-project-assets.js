var path = require('path');
var fs = require('fs');

var INDEX_FILE = 'index.html';
var SCRIPTS_SRC_REGEX = /script src=\"([^\"]+)\"/ig;
var STYLE_HREF_REGEX = /rel="stylesheet" href=\"([^\"]+)\"/ig;


/*
    Using index.html as sorted assets list source
    TODO: use stats.json or any better way
 */
module.exports = function getProjectAssets(outputPath) {
    var index = fs.readFileSync(path.join(outputPath, INDEX_FILE), 'utf8');

    var result = {
        css: [],
        js: [],
    };

    var jsMatch;
    while (jsMatch = SCRIPTS_SRC_REGEX.exec(index)) {
        result.js.push(jsMatch[1]);
    }

    var cssMatch;
    while (cssMatch = STYLE_HREF_REGEX.exec(index)) {
        result.css.push(cssMatch[1]);
    }

    return result;

}
