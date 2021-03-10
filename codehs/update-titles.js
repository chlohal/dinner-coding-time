var fs = require("fs");
var files = fs.readdirSync(__dirname);
for(var i = 0; i < files.length; i++) {
    if(!files[i].match(/\d+-\d+-\d+.html/)) continue;
    var text = fs.readFileSync(__dirname + "/" + files[i]).toString();
    
    var contentIndexStart = text.indexOf("<h1>");
    var contentIndexEnd = text.indexOf("</h1>");
    var replaceIndexStart = text.indexOf("<title>");
    var replaceIndexEnd = text.indexOf("</title>");
    
    if(contentIndexStart < 0 || contentIndexEnd < 0 || replaceIndexStart < 0 || replaceIndexEnd < 0 ) {
        console.log("could not write", files[i]);
        continue;
    }
    
    var title = text.substring(contentIndexStart + "<h1>".length, contentIndexEnd);

    title += " | Dinneen Coding Time";

    var result = text.substring(0, replaceIndexStart + "<title>".length) +
        title +
        text.substring(replaceIndexEnd);


    fs.writeFileSync(__dirname + "/" + files[i], result);
}