var fs = require("fs")
var fakeDom = require("../fake-dom")
var Svg = require("./svg");
var PngFile = require("../png-file/png-file");

var svg = `<svg viewBox="0 0 800 400" width="800" height="400">
    <linearGradient id="a" y1="0" y2="1">
        <stop stop-color="#57efec">
        <stop stop-color="#e85e90" offset="0.5">
        <stop stop-color="#fcc9ba" offset="1">
    </linearGradient>
    
    <path fill="#f7f5f5" d="M 0,0 H 800 V 400 H 0 Z">
<path fill="#1b1d35" d="M 406.875,20.00003 H 750 c 16.62,0 30,13.37999 30,29.99999 V 350 c 0,16.62 -13.38,30 -30,30 H 182 Z">
<path fill="#f7fdfd" d="M 50,0 H 400 V 0 L 150,400 H 0 V 0 Z">
    <path fill="url(#a)" filfl="#1b1d35" d="m 400,0 h 20 L 170,400 h -20 z">
    <text y="12" fill="#1b1d35" font-size="32">Hello world!</text>
    </svg>`


var svgElem = fakeDom.parseHTML(svg)[0];


var svgRenderer = new Svg(svgElem);

var width = 800;
var height = 400;

var pixels = svgRenderer.render(width, height);

console.log(pixels[0].length, pixels.length);

var png = new PngFile(pixels, width);
fs.writeFileSync(__dirname + "/test.png", png.toBuffer());