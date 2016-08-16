'use nodent';

const spawnSync = require('spawn-sync');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const gitClient = require('simple-git');
const ProtoBuf = require('protobufjs');
const pbjs = require('./node_modules/protobufjs/cli/pbjs');

const outputDir = __dirname + path.sep + 'POGOProtos';
const protosDirDir = __dirname + path.sep + 'pogoprotos-git';
const protosGitDirSrc = protosDirDir + path.sep + 'src' + path.sep + 'POGOProtos';

const escapeShell = function (cmd) {
    return '"' + cmd.replace(/(["\s'$`\\])/g, '\\$1') + '"';
};

let protoIterator = (dir, outputDir) => {
    "use strict";

    var self = this;
    this.parseDir = (baseDir) => {
        var list = fs.readdirSync(baseDir);
        list.forEach((file) => {
            console.log(`[${baseDir}] ${file}`);
            let filepath = baseDir + path.sep + file;
            let stats = fs.lstatSync(filepath);
            if (stats.isDirectory()) {
                self.parseDir(filepath);
                return;
            }

            if (/.proto$/.test(file) === false) {
                return;
            }

            self.parseProto(filepath);
        });
    };

    this.parseProto = (file) => {
        let targetFilepath = file.replace(/\.proto$/, '.json').replace(protosGitDirSrc, outputDir);

        mkdirp.sync(path.dirname(targetFilepath));

        let result = spawnSync(
            [__dirname, 'node_modules', '.bin', 'pbjs'].join(path.sep),
            [
                '--source', 'proto',
                '--target', 'json',
                '--path', protosGitDirSrc + path.sep + '..' + path.sep,
                '--out', targetFilepath,
                file
            ]
        );

        process.stdout.write(result.stdout);
        process.stderr.write(result.stderr);
    };

    console.log('Parse protos ..');
    this.parseDir(dir);
};

if (!fs.existsSync(protosDirDir) || !fs.existsSync(protosDirDir + path.sep + '.git')) {
    console.log('Cloning POGOProtos ..');
    gitClient(__dirname)
        .clone('https://github.com/AeonLucid/POGOProtos', protosDirDir)
        .then(protoIterator(protosGitDirSrc, outputDir))
        .then(() => {
            console.log('Done!');
        });
} else {
    console.log('Update POGOProtos ..');
    gitClient(protosDirDir)
        .pull()
        .then(protoIterator(protosGitDirSrc, outputDir))
        .then(() => {
            console.log('Done!');
        });
}
