var fs = require("fs");
var path = require("path");
var fakeDom = require("./fake-dom.js");

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
        var html = fakeDom.parseHTML(fileContent);
        var document = fakeDom.makeDocument(html);
        var location = "/" + files[i].replace(publicDir, "").split(path.sep).join("/").replace(/^\//, "");

        if(DEBUG) console.log(`File ${i}/${files.length}: ${location}`);

        var page = makePage(document, location);

        if(DEBUG) console.log("Pre-parsing code...");
        preparseCode(page);
        if(DEBUG) console.log("Generating paritals...");
        generatePartials(page);
        if(DEBUG) console.log("Updating titles...");
        updateCodehsTitles(page);
        if(DEBUG) console.log("Adding descriptions & OpenGraph...");
        addMetaDescriptionOpenGraph(page);

        if(DEBUG) console.log("Adding to search index...");
        searchIndex.add(page);

        fs.writeFileSync(files[i], document.innerHTML);
}

searchIndex.write();

/**
 * @typedef {Object} Page
 * @property {FakeDomNode} document A #root node representing the document of the page.
 * @property {string} location The location of the page, equal to the window.location.pathname property in a browser.
 */


/**
 * Make a page from a document and location
 * @param {FakeDomNode} document A #root node representing the document of the page.
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
 * @typedef {import("./fake-dom").FakeDomNode} FakeDomNode
 */

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