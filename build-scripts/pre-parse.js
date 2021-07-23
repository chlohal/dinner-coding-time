var fs = require("fs");
var path = require("path");
var fakeDom = require("./fake-dom.js");

console.log(fakeDom);

var codehsDir = path.join(__dirname, "../public/codehs");
var files = loadHtmlFilesFromFolder(codehsDir);

console.log("File count: " + files.length);

var before = Date.now();

for(var i = 0; i < files.length; i++) {
    (function() {
        var fileContent = fs.readFileSync(files[i]).toString();
        var html = fakeDom.parseHTML(fileContent);
        var htmlContent = "";
        for(var j = 0; j < html.length; j++) {
            htmlContent += html[j].__buildOuterHTML();
        }
    })();
}

var time = Date.now() - before;

console.log("Total time: " + time + "ms");
console.log("Average time: " + (time/files.length) + "ms");


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