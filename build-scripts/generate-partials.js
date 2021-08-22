var fs = require("fs");
var path = require("path");

var publicDir = path.join(__dirname, "../public/");
/**
 * 
 * @param {import("./parse-controller").Page} page The page to describe
 */
module.exports = function(page) {

    //don't partialify indexes 
    if (page.location.endsWith("index.html")) return page;

    var main = page.document.getElementsByTagName("main")[0];

    if(!main) return page;

    var partialAddress = path.normalize(path.join(publicDir, "-partials/" + page.location));

    var folder = partialAddress.replace(/[^\/\\]+$/, "");

    if(!fs.existsSync(folder)) {
        fs.mkdir(folder, {recursive: true}, function(err) {
            if(err) throw err;
            fs.writeFile(partialAddress, main.innerHTML, function() {});
        });
    } else {
        fs.writeFile(partialAddress, main.innerHTML, function() {});
    }

    return page;
}