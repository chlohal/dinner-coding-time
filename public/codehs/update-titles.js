var fs = require("fs");
var path = require("path");

var files = loadHtmlFilesFromFolder(__dirname);

for(var i = 0; i < files.length; i++) {
    if(files[i].match(/index\.html$/)) continue;
    var text = fs.readFileSync(files[i]).toString();
    
    var contentIndexStart = text.indexOf("<h1>");
    var contentIndexEnd = text.indexOf("</h1>");
    var replaceIndexStart = text.indexOf("<title>");
    var replaceIndexEnd = text.indexOf("</title>");
    
    if(contentIndexStart < 0 || contentIndexEnd < 0 || replaceIndexStart < 0 || replaceIndexEnd < 0 ) {
        console.log("could not write", files[i]);
        continue;
    }
    
    var title = text.substring(contentIndexStart + "<h1>".length, contentIndexEnd);

    title += " | Dinner Coding Time";

    var result = text.substring(0, replaceIndexStart + "<title>".length) +
        title +
        text.substring(replaceIndexEnd);


    fs.writeFileSync(files[i], result);
}

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