var fs = require("fs")
var fakeDom = require("../fake-dom")
var Svg = require("./svg");
var PngFile = require("../png-file/png-file");

for(var i = 10; i < 31; i++) {

    var svg = `<svg viewBox="0 0 40 40" width="40" height="40">

    <path fill="#f7f5f5" d="M 0,0 H 800 V 400 H 0 Z">
    <text y="30" x="1" fill="#1b1d35" font-weight="bolder" font-size="32">${i}</text>
    </svg>`


    var svgElem = fakeDom.parseHTML(svg)[0];


    var svgRenderer = new Svg(svgElem);

    var width = 400;
    var height = width;

    var pixels = svgRenderer.render(width, height);

    console.log(pixels[0].length, pixels.length);

    var png = new PngFile(pixels, width / 2);
    fs.writeFileSync(__dirname + "/tests/day" + i +".png", png.toBuffer());
}