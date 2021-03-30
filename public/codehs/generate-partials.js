var fs = require("fs");
var files = fs.readdirSync(__dirname);
for(var i = 0; i < files.length; i++) {
    if(!files[i].match(/\d+-\d+-\d+.html/)) continue;
    var text = fs.readFileSync(__dirname + "/" + files[i]).toString();
    
    var indexStart = text.indexOf("<main>");
    if(indexStart == -1) {
        console.log("could not write", files[i]);;
        continue;
    }

    var indexEnd = text.indexOf("</main>");
    if(indexEnd == -1) {
        console.log("could not write", files[i]);;
        continue;
    }

    fs.writeFileSync(__dirname + "/-partials/" + files[i], text.substring(indexStart + "<main>".length, indexEnd));
}