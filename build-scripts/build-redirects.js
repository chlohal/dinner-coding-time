var INSERTION_POINT_SEARCH = "# INSERT NUMBER-NAME REDIRECTS HERE";
var END_REDIRECTS_SEARCH = "# END NUMBER-NAME REDIRECTS";

var fs = require("fs");
var path = require("path");

var siteBase = path.join(__dirname, "../public");
var codehsDir = path.join(siteBase, "codehs");

var _redirects = path.join(siteBase, "_redirects");
var _redirectsFile = fs.readFileSync(_redirects).toString().replace(/\r\n/g, "\n");

var redirLines = _redirectsFile.split("\n");
var insertionPoint = redirLines.indexOf(INSERTION_POINT_SEARCH);
if(insertionPoint == -1) throw "No Insertion point";

var endRedirectsPoint = redirLines.indexOf(END_REDIRECTS_SEARCH);
if(endRedirectsPoint == -1) throw "No end-redirects point";

var codehsDirectories = fs.readdirSync(codehsDir).filter(x=>x!="index.html");

console.log(codehsDirectories);

var indeces = [];
indeces.length = codehsDirectories.length;

for(var i = 0; i < codehsDirectories.length; i++) {
    indeces[i] = require(path.join(codehsDir, codehsDirectories[i] + "/index.json"));
}

var redirects = [];

for(var i = 0; i < indeces.length; i++) {
    var language = codehsDirectories[i];
    for(var j = 0; j < indeces[i].length; j++) {
        var exercise = indeces[i][j];
        exercise = { path: exercise[0], code: exercise[1] };
        
        var codes = exercise.code.split("-");
        
        redirects.push(`/codehs/${language}/${exercise.code} ${exercise.path}`);
        redirects.push(`/codehs/${language}/${codes[0]}/${codes[1]}/${codes[2]} ${exercise.path}`);
    }
}

console.log(redirects);

redirLines.splice(insertionPoint + 1, //add +1 so it'll insert *after* the insertion point.
    endRedirectsPoint - insertionPoint - 1, //remove old redirects between the start and the end
    redirects.join("\n"));

fs.writeFileSync(_redirects, redirLines.join("\n"));

