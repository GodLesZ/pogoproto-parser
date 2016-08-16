var fs = require('fs');
var path = require('path');
var gitDir = __dirname + path.sep + 'pogoprotos-git';
var git = require('simple-git')(gitDir);

if (!fs.existsSync(gitDir) || !fs.existsSync(gitDir + path.sep + '.git')) {
    console.log('Cloning POGOProtos ..');
    git.clone('https://github.com/AeonLucid/POGOProtos', gitDir);
} else {
    console.log('Update POGOProtos ..');
    git.pull();
}

var outputDir = __dirname + path.sep + 'POGOProtos';
var protosSrc = gitDir + path.sep + 'src' + path.sep + 'POGOProtos';

/**
 *
 * @param {Error|null} err
 * @param {string[]} list
 * @returns {boolean}
 */
var parseProtoDir = function(err, list) {
    "use strict";

    if (err) {
        console.error(err);
        return false;
    }

    list.forEach(function (file) {


    })
};

console.log('Parse protos ..');
fs.readdir(protosSrc, parseProtoDir);