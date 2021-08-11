var fs = require("fs");
var path = require("path");
var fakeDom = require("./fake-dom.js");
var crypto = require("crypto");

var cacheDir = path.join(__dirname, "../cache");
if(!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
if(!fs.existsSync(path.join(cacheDir, "hashes.json"))) fs.writeFileSync(path.join(cacheDir, "hashes.json"), "{}");


var cacheHashes = require("../cache/hashes.json");
var gitHashes = require("./git-html-file-shas.js");

var preparseCode = require("./pre-parse.js");
var generatePartials = require("./generate-partials.js");
var updateCodehsTitles = require("./update-codehs-titles.js");
var addMetaDescriptionOpenGraph = require("./add-meta-description-open-graph.js");

var searchIndex = require("./generate-search-index.js");
searchIndex.reset();

var publicDir = path.join(__dirname, "../public");

var files = loadHtmlFilesFromFolder(publicDir);

var DEBUG = true;

for(var i = 0; i < files.length; i++) {
        var fileContent = fs.readFileSync(files[i]).toString();
        //remove windows-style EOL
        fileContent = fileContent.replace(/\r\n/g, "\n");

        var location = "/" + files[i].replace(publicDir, "").split(path.sep).join("/").replace(/^\//, "");

        var sha = crypto.createHash("sha1").update("blob " + Buffer.byteLength(fileContent) + "\u0000" + fileContent).digest("hex");
        
        var html = fakeDom.parseHTML(fileContent);
        var document = fakeDom.makeDocument(html);
        

        if(DEBUG) console.log(`File ${i}/${files.length}: ${location}`);

        var page = makePage(document, location);
        if(DEBUG) console.log("Current hash: " + sha);
        if(DEBUG) console.log("Cache hash: " + (cacheHashes[location] && sha != cacheHashes[location]));
        if(DEBUG) console.log("Git hash: " + (gitHashes[location] && sha != gitHashes[location].sha));
        if((cacheHashes[location] && sha != cacheHashes[location]) || (gitHashes[location] && sha != gitHashes[location].sha)) {
            if(DEBUG) console.log("Pre-parsing code...");
            preparseCode(page);
            if(DEBUG) console.log("Generating paritals...");
            generatePartials(page);
            if(DEBUG) console.log("Updating titles...");
            updateCodehsTitles(page);
            if(DEBUG) console.log("Adding descriptions & OpenGraph...");
            addMetaDescriptionOpenGraph(page);
        } else {
            if(DEBUG) console.log("Unchanged page -- skipping time-wasting operations preparseCode, generatePartials, updateCodehsTitles, and addMetaDescriptionOpenGraph");
        }
        if(DEBUG) console.log("Adding to search index...");
        searchIndex.add(page);

        var updatedInnerhtml = document.innerHTML;
        var updatedSha = crypto.createHash("sha1").update("blob " + Buffer.byteLength(updatedInnerhtml) + "\u0000" + updatedInnerhtml).digest("hex");
        cacheHashes[location] = updatedSha;

        fs.writeFileSync(files[i], updatedInnerhtml);
}

fs.writeFileSync(path.join(cacheDir, "hashes.json"), JSON.stringify(cacheHashes));

searchIndex.write();

/**
 * @typedef {Object} Page
 * @property {import("./fake-dom").FakeDomNode} document A #root node representing the document of the page.
 * @property {string} location The location of the page, equal to the window.location.pathname property in a browser.
 */


/**
 * Make a page from a document and location
 * @param {import("./fake-dom").FakeDomNode} document A #root node representing the document of the page.
 * @param {string} location The location of the page, equal to the window.location.pathname property in a browser.
 * @returns {Page} The page
 */
function makePage(document, location) {
    return {
        location: location,
        document: document
    };
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

    for(var i = 0; i < folderContents.length; i++) {
        let subfile = folderContents[i];

        if(subfile.isDirectory() && !subfile.name.startsWith("-partials")) {
            results = results.concat(loadHtmlFilesFromFolder(path.join(folder, subfile.name)));
        } else if(subfile.isFile() && subfile.name.endsWith(".html")) {
            results.push(path.join(folder, subfile.name));
        }
    }

    return results;
}