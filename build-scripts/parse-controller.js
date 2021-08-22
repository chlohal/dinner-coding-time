var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var cpuCoreCount = require("os").cpus().length;

var cacheDir = path.join(__dirname, "../cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
if (!fs.existsSync(path.join(cacheDir, "hashes.json"))) fs.writeFileSync(path.join(cacheDir, "hashes.json"), "{}");


var cacheHashes = require("../cache/hashes.json");

var threadPool = require("./worker-thread-pool.js");

var publicDir = path.join(__dirname, "../public");

var files = loadHtmlFilesFromFolder(publicDir);
var finished = 0;

threadPool.initPool(cpuCoreCount * 2);

console.log(cpuCoreCount);

var DEBUG = false;
threadPool.setDebug(DEBUG);

for (var i = 0; i < files.length; i++) {
    var fileContent = fs.readFileSync(files[i]).toString();
    //remove windows-style EOL
    fileContent = fileContent.replace(/\r\n/g, "\n");

    var location = "/" + files[i].replace(publicDir, "").split(path.sep).join("/").replace(/^\//, "");

    var sha = crypto.createHash("sha1").update("blob " + Buffer.byteLength(fileContent) + "\u0000" + fileContent).digest("hex");

    if (DEBUG) console.log(`File ${i}/${files.length}: ${location}`);

    if (!cacheHashes[location] || sha != cacheHashes[location]) {

        //preserve `i` and `location` in an iefe
        //could this be cause for a `let`?
        //yes, it should be, but it's easier to do it this way
        //(not really, but from an 'i dont want to use emca2015' perspective)
        (function (i, location) {
            threadPool.giveJob(fileContent, location, function (updatedInnerhtml) {
                var updatedSha = crypto.createHash("sha1").update("blob " + Buffer.byteLength(updatedInnerhtml) + "\u0000" + updatedInnerhtml).digest("hex");
                cacheHashes[location] = updatedSha;

                fs.writeFileSync(files[i], updatedInnerhtml);

                updateCache();
                finished++;
                checkAllDone();
            });
        })(i, location);
    } else {
        finished++;
        if (DEBUG) console.log("Unchanged page -- skipping");
    }
}

checkAllDone();

function checkAllDone() {
    if(finished >= files.length) {
        console.log("done!!",files.length,finished);
        threadPool.close();
    }
}

/**
 * @typedef {Object} Page
 * @property {import("./fake-dom").FakeDomNode} document A #root node representing the document of the page.
 * @property {string} location The location of the page, equal to the window.location.pathname property in a browser.
 */

function updateCache() {
    fs.writeFileSync(path.join(cacheDir, "hashes.json"), JSON.stringify(cacheHashes));
}

/**
 * Load all HTML files from a given folder.
 * @param {string} folder The folder to load from
 * @returns {string[]} An array of absolute file names.
 */
function loadHtmlFilesFromFolder(folder) {
    let results = [];

    let folderContents = fs.readdirSync(folder, {
        withFileTypes: true
    });

    for (var i = 0; i < folderContents.length; i++) {
        let subfile = folderContents[i];

        if (subfile.isDirectory() && !subfile.name.startsWith("-partials")) {
            results = results.concat(loadHtmlFilesFromFolder(path.join(folder, subfile.name)));
        } else if (subfile.isFile() && subfile.name.endsWith(".html")) {
            results.push(path.join(folder, subfile.name));
        }
    }

    return results;
}