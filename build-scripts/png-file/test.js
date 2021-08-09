var fs = require("fs");
var PngFile = require("./png-file.js");
var writeText = require("./write-text");

var RENDER_WIDTH = 1600;
var RENDER_HEIGHT = 800;

var pixels = [];
for(var i = 0; i < RENDER_HEIGHT; i++) {
    var row = [];
    for(var j = 0; j < RENDER_WIDTH; j++) {
        row.push(color(i, j));
    }
    pixels.push(row);
}
writeText(pixels, parseHex("#1b1d35"), "codehs/java/10-2-3", 21, 20, 20);
writeText(pixels, parseHex("#1b1d35"), "Administrators,\nTeachers,\nand\nStudents", 42, 20, 64);


var png = new PngFile(pixels, RENDER_WIDTH / 2);
fs.writeFileSync(__dirname + "/test.png", png.toBuffer());


function color(y, x) {
    y = (y / RENDER_HEIGHT) * 400;
    x = (x / RENDER_WIDTH) * 800;
    y = 400 - y;

    

    //white slice
    if(y > (400 / 250) * x - 150 * 400 / 250) {
        return parseHex("#f7fdfd");
    } //gradient slice border
    else if(y > (400 / 250) * (x - 20) - 150 * 400 / 250) {
        if(y < 200) {
            return interpolate(parseHex("#57efec"), parseHex("#e85e90"), y / 200);
        } else {
            return interpolate(parseHex("#e85e90"), parseHex("#fcc9ba"), (y - 200) / 200);
        }
    } //code bg
    else if(
        (((y > 40 && y < 360) ||
        (x > 40 && x < 760)) &&
        ((y > 20 && y < 380) &&
        (x > 20 && x < 780))) ||
        Math.pow(Math.min(Math.abs(y - 360), Math.abs(y - 40)), 2) + Math.pow(Math.abs(x - 760) , 2) < 400
        
    ) {
        return parseHex("#1b1d35");
    }//background
    else {
        return parseHex("#f7f5f5");
    }
}

function interpolate(start, end, time) {
    return [
        start[0] + time * (end[0] - start[0]),
        start[1] + time * (end[1] - start[1]),
        start[2] + time * (end[2] - start[2])
    ];
}

function parseHex(hex) {
    hex = hex.replace(/^#/, "");
    return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
    ];
}