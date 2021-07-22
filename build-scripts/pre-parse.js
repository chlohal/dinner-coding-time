var fs = require("fs");
var path = require("path");
var fakeDom = require("./fake-dom.js");

var codehsDir = path.join(__dirname, "../public/codehs");
var files = loadHtmlFilesFromFolder(codehsDir).slice(0,1);

for(var i = 0; i < files.length; i++) {
    (function() {
        var fileContent = fs.readFileSync(files[i]).toString();
        console.log(fileContent);
        var html = fakeDom.parseHTML(fileContent);
        console.log(html);
        var htmlContent = "";
        for(var j = 0; j < html.length; j++) {
            htmlContent += html[j].__buildOuterHTML();
        }
        //console.log(htmlContent);
    })();
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