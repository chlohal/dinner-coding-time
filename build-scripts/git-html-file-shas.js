
var zlib = require("zlib");
var path = require("path");
var fs = require("fs");
var crypto = require("crypto");

var objectParsers = {
    commit: parseCommit,
    tree: parseTree,
    blob: parseBlob
}

var gitDirectory = path.join(__dirname, "../.git");

var HEADfilecontent = fs.readFileSync(path.join(gitDirectory, "HEAD")).toString();
var headSha = "";
if(HEADfilecontent.startsWith("ref: ")) {
    var HEADref = HEADfilecontent.substring("ref: ".length).replace(/\r?\n/g, "");

    headSha = fs.readFileSync(path.join(gitDirectory, HEADref)).toString()
} else {
    headSha = HEADfilecontent.replace(/\r?\n/g, "");
}

var commit = loadObject(headSha);
var commitTree = loadObject(commit.headers.tree, true);


var files = {};

function traverseTreeForHtmlFiles(tree, dirname) {
    dirname = dirname || "";

    if(!tree || !tree.entries) return false;

    for(var i = 0; i < tree.entries.length; i++) {
        var location = dirname + "/" + tree.entries[i].name;
        if(tree.entries[i].isDirectory) traverseTreeForHtmlFiles(tree.entries[i].entries, location);
        else if(tree.entries[i].name.endsWith(".html")) files[location] = loadObject(tree.entries[i].sha);
    }
}

traverseTreeForHtmlFiles(commitTree.entries.find(x=>x.name=="public").entries);

module.exports = files;


function loadObject(sha, recursive) {
    sha = sha.replace(/\s/g, "");
    var folder = sha.substring(0, 2);
    var file = sha.substring(2);

    var shaPath = path.join(gitDirectory, "objects", folder, file);

    try {
        var object = fs.readFileSync(shaPath);
    } catch(e) {
        return null;
    }

    var objectData = zlib.inflateSync(object);
    var objectText = objectData.toString();

    var type = objectText.substring(0, objectText.indexOf(" "));
    if (!objectParsers[type]) throw "Unknown type " + type;

    var firstNulByteIndex = objectData.findIndex(x => x == 0x00);

    var data = objectData.slice(firstNulByteIndex + 1);

    var parsed = objectParsers[type](data, recursive);
    parsed.type = type;
    return parsed;
}

function parseCommit(buffer) {
    var text = buffer.toString();
    var parsed = {
        headers: {},
        message: "",
    }
    var lines = text.split(/\r?\n/);

    var inHead = true;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] == "") {
            inHead = false;
            continue;
        }
        if (inHead) {
            var words = lines[i].split(" ");
            parsed.headers[words[0]] = words.slice(1).join(" ");
        } else {
            parsed.message += lines[i] + "\n";
        }
    }
    return parsed;
}

function parseBlob(buffer) {
    var nullByteIndex = buffer.indexOf("\u0000");
    var header = buffer.slice(0, nullByteIndex).toString();
    var size = parseInt(header.split(" ")[1]);
    var blob = buffer.slice(nullByteIndex + 1).toString()
    return {
        type: "blob",
        size: size,
        blob: blob,
        sha: crypto.createHash("sha1").update("blob " + Buffer.byteLength(blob) + "\u0000" + blob).digest("hex")
    };
}

function parseTree(buffer, recursive) {
    var entries = [];
    var lastEntryEnd = -1;
    for (var i = 0; i < buffer.length; i++) {
        if (buffer[i] == 0x00) {
            var modeName = buffer.slice(lastEntryEnd + 1, i).toString();

            var sha = buffer.slice(i + 1, i + 21);
            var shaText = sha.toString("hex");

            i += 20;

            var mode = modeName.substring(0, modeName.indexOf(" "));
            var name = modeName.substring(modeName.indexOf(" ") + 1);

            var entry = {
                isFile: mode == "100644",
                isExecutable: mode == "100755",
                isSymbolicLink: mode == "120000",
                isDirectory: mode == "40000",
                mode: mode,
                name: name,
                sha: shaText
            };
            if(entry.isDirectory && recursive) entry.entries = loadObject(shaText, recursive);

            entries.push(entry);
            lastEntryEnd = i;
        }
    }
    return {
        entries: entries
    };
}