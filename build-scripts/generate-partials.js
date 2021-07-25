var fs = require("fs");
var path = require("path");

var publicDir = path.join(__dirname, "../public/");
/**
 * 
 * @param {import("./parse-controller").Page} page The page to describe
 */
module.exports = function(page) {

    //don't partialify indexes 
    if (page.location.endsWith("index.html")) return false;

    var main = page.document.getElementsByTagName("main")[0];

    if(!main) return false;

    var partialAddress = path.normalize(path.join(publicDir, "-partials/" + page.location));

    var folder = partialAddress.replace(/[^\/\\]+$/, "");

    if(!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true});

    fs.writeFileSync(
        partialAddress,
        main.innerHTML
    );
}