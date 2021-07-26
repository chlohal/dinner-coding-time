
var zlib = require("zlib");
var path = require("path");
var fs = require("fs");

var objectParsers = {
    commit: parseCommit,
    tree: parseTree
}

var gitDirectory = path.join(__dirname, "../.git");

var HEADfilecontent = fs.readFileSync(path.join(gitDirectory, "HEAD")).toString();
var HEADref = HEADfilecontent.split(":").slice(1).join(":").trim();

var headSha = fs.readFileSync(path.join(gitDirectory, HEADref)).toString()

var commit = loadObject(headSha);
var commitTree = loadObject(commit.headers.tree);
var parent = loadObject(commit.headers.parent);
var parentTree = loadObject(parent.headers.tree);

var differences = treediff(commitTree, parentTree);

console.log(differences.join("\n"));

function loadObject(sha) {
    sha = sha.replace(/\s/g, "");
    var folder = sha.substring(0, 2);
    var file = sha.substring(2);

    var shaPath = path.join(gitDirectory, "objects", folder, file);

    if(!fs.existsSync(shaPath)) return {}

    var object = fs.readFileSync(shaPath);

    var objectData = zlib.inflateSync(object);
    var objectText = objectData.toString();

    var type = objectText.substring(0, objectText.indexOf(" "));
    if (!objectParsers[type]) throw "Unknown type " + type;

    var firstNulByteIndex = objectData.findIndex(x => x == 0x00);

    var data = objectData.slice(firstNulByteIndex + 1);

    var parsed = objectParsers[type](data);
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

function parseTree(buffer) {
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

            entries.push({
                isFile: mode == "100644",
                isExecutable: mode == "100755",
                isSymbolicLink: mode == "120000",
                isDirectory: mode == "40000",
                mode: mode,
                name: name,
                sha: shaText
            });
            lastEntryEnd = i;
        }
    }
    return {
        entries: entries
    };
}

function treediff(newTree, oldTree, parentPath) {
    oldTree = oldTree.entries || [];
    newTree = newTree.entries || [];
    parentPath = parentPath || "";

    var differences = [];

    for (var i = 0; i < newTree.length; i++) {
        var name = newTree[i].name;
        var oldTreeEqualIndex = -1;
        for (var j = i; j < oldTree.length; j++) {
            if (name == oldTree[j].name) {
                oldTreeEqualIndex = j;
                break;
            }
        }
        if (oldTreeEqualIndex == -1) {
            if (newTree[i].isFile) differences.push(path.join(parentPath, name));
        } else {
            if (oldTree[oldTreeEqualIndex].sha != newTree[i].sha) {
                if (newTree[i].isFile) {
                    differences.push(path.join(parentPath, name));
                } else if (newTree[i].isDirectory) {
                    var newChildTree = loadObject(newTree[i].sha);
                    var oldChildTree = loadObject(oldTree[oldTreeEqualIndex].sha);
                    var childPath = path.join(parentPath, newTree[i].name);

                    differences = differences.concat(treediff(newChildTree, oldChildTree, childPath));
                }
            }
        }
    }
    return differences;
}