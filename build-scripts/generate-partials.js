var fs = require("fs");
var path = require("path");

var codehsDir = path.join(__dirname, "../public/codehs");

function getPartialCounterpart(folder) {
    return path.normalize(folder.replace(codehsDir, codehsDir + "/../-partials/codehs/"));
}

function genPartials(folder) {
    var files = fs.readdirSync(folder, { withFileTypes: true });
    for (var i = 0; i < files.length; i++) {
        if (files[i].isDirectory()) {
            var subfolder = path.join(folder, files[i].name);
            var counterpart = getPartialCounterpart(subfolder);
            
            if(!fs.existsSync(counterpart)) fs.mkdirSync(counterpart);
            
            genPartials(subfolder);
            continue;
        }
        var filename = files[i].name;

        //only partialify html files
        if (!filename.endsWith(".html")) continue;
        //don't partialify indexes 
        if (filename == "index.html") continue;

        var text = fs.readFileSync(path.join(folder, filename)).toString();

        var indexStart = text.indexOf("<main>");
        if (indexStart == -1) {
            console.log("could not write", files[i]);;
            continue;
        }

        var indexEnd = text.indexOf("</main>");
        if (indexEnd == -1) {
            console.log("could not write", path.join(folder, filename));
            continue;
        }

        fs.writeFileSync(
            getPartialCounterpart(path.join(folder, filename)),
            text.substring(indexStart + "<main>".length, indexEnd)
        );
    }
}

genPartials(codehsDir);