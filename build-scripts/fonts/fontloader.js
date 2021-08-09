var path = require("path");
var fs = require("fs");
var opentype = require("../opentype.min.js");
var fonts = {
    "JetBrains Mono": {
        "normal": load("JetBrainsMono-Medium.ttf"),
        "lighter": load("JetBrainsMono-Light.ttf"),
        "bold": load("JetBrainsMono-Light.ttf"),
        "bolder": load("JetBrainsMono-ExtraBold.ttf")
    }
}

module.exports = function(family, weight) {
    if(!fonts[family]) family = "JetBrains Mono";
    if(!fonts[family][weight]) weight = "normal";

    return fonts[family][weight];
}

function load(fontname) {
    var fontBuffer = fs.readFileSync(path.join(__dirname, fontname));
    return opentype.parse(fontBuffer.buffer);
}