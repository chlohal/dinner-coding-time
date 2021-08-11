var SITE_BASE_URL = "https://dinnercodingtime.com";

var path = require("path");
var fs = require("fs");

var siteBase = path.join(__dirname, "../public");

var sitemap = require("./sitemapper.js");

var pages = loadHtmlFilesFromFolder(siteBase);

for(var i = 0; i < pages.length; i++) {
    var url = SITE_BASE_URL + (pages[i].replace(siteBase, "")).replace(new RegExp("\\" + path.sep, "g"), "/").replace(/(index)?\.html$/, "");
    sitemap.add(url);
}

fs.writeFileSync(siteBase + "/sitemap.xml", sitemap.toXml());



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