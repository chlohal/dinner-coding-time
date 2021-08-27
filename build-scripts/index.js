var argv = process.argv.join(" ").toLowerCase().split(" ");
if(argv.includes("--no-cache") || argv.includes("-n")) {
    var fs = require("fs");
    try {
        fs.unlinkSync(__dirname + "/../cache/hashes.json");
    } catch(e) {}
}

require("./generate-search-index.js");
require("./parse-controller");
require("./make-sitemap");
require("./build-redirects");