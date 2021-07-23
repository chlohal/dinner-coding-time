var fs = require("fs");
var path = require("path");
var fakeDom = require("./fake-dom.js");

var codehsDir = path.join(__dirname, "../public/codehs");
var files = loadHtmlFilesFromFolder(codehsDir);

console.log("File count: " + files.length);

var before = Date.now();
var parsers = {};

for(var i = 0; i < files.length; i++) {
    (function() {

        //load parser
        var language = files[i].replace(codehsDir, "").split(path.sep)[1];
        //account for different versions
        if(language.startsWith("python")) language = "python";
        if(!parsers[language]) {
            var parserPath = path.join(codehsDir, "../assets/parsers", language, "parser.js");
            console.log(parserPath);
            if(!fs.existsSync(parserPath)) return false;
            parsers[language] = require(parserPath);
        }

        var fileContent = fs.readFileSync(files[i]).toString();
        var html = fakeDom.parseHTML(fileContent);
        var document = fakeDom.makeDocument(html);

        var main = document.getElementsByTagName("main")[0];

        console.log(`===\n\nFile ${i}/${files.length}\n${files[i]}\n`);
        var code = {};
        for(var j = 0; ; j++) {
            var id = "source" + (j || "");
            var sourceElem = main.getElementById(id);
            if(!sourceElem) break;

            var source = sourceElem.textContent;
            //ignore empty sources
            if(source.replace(/[\n\s]+/g, "") == "") continue;

            console.log("Parsing " + id);
            try {
                code[id] = parsers[language].parse(source);
            } catch(e) {
                throw "Problem parsing";
            }
        }

        var datascriptContent = `window.__preparsed = ${JSON.stringify(code)};`;
        
        var datascript = document.createElement("script");
        datascript.textContent = datascriptContent;
        datascript.setAttribute("type", "dct-datascript");
        datascript.setAttribute("class", "preparsedcode-datascript");

        var oldDatascript = main.getElementsByClassName("preparsedcode-datascript")[0];
        if(oldDatascript) oldDatascript.parentNode.removeChild(oldDatascript);
        main.appendChild(datascript);

        var htmlContent = "";
        for(var j = 0; j < html.length; j++) {
            htmlContent += html[j].outerHTML;
        }
        fs.writeFileSync(files[i], htmlContent);
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