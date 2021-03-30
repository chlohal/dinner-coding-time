var SITE_BASE_URL = "https://dinneencodingtime.com";

var path = require("path");
var fs = require("fs");
var sitemap = require(__dirname + "/build-scripts/sitemapper.js");

var pages = loadHtmlFilesFromFolder(__dirname);

for(var i = 0; i < pages.length; i++) {
    var url = SITE_BASE_URL + (pages[i].replace(__dirname, "")).replace(new RegExp("\\" + path.sep, "g"), "/").replace(/\.html$/, "");
    sitemap.add(url);
}

fs.writeFileSync(__dirname + "/sitemap.xml", sitemap.toXml());



function loadHtmlFilesFromFolder(folder) {
    let results = [];

    let folderContents = fs.readdirSync(folder, {
        withFileTypes: true
    });

    for(var i = 0; i < folderContents.length; i++) {
        let subfile = folderContents[i];

        if(subfile.isDirectory() && !subfile.name.startsWith("-partials")) {
            results = results.concat(loadHtmlFilesFromFolder(path.resolve(folder, subfile.name)));
        } else if(subfile.isFile() && subfile.name.endsWith(".html")) {
            results.push(path.resolve(folder, subfile.name));
        }
    }

    return results;
}