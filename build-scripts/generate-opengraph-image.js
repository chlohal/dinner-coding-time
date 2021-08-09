var fakeDom = require("../fake-dom")
var Svg = require("./svg-rendery/svg");
var PngFile = require("./png-file/png-file");

var TITLE_ALLOWED_LINE_LENGTHS = [15, 15, 13, 8, 7, 6];

module.exports = function (slug, title, code) {

    var svg = `<svg viewBox="0 0 800 400" width="800" height="400">
    <linearGradient id="a" y1="0" y2="1">
        <stop stop-color="#57efec">
        <stop stop-color="#e85e90" offset="0.5">
        <stop stop-color="#fcc9ba" offset="1">
    </linearGradient>
    
    <path fill="#f7f5f5" d="M 0,0 H 800 V 400 H 0 Z">
    <path fill="#1b1d35" id="code-canvas" d="M 406.875,20.00003 H 750 c 16.62,0 30,13.37999 30,29.99999 V 350 c 0,16.62 -13.38,30 -30,30 H 182 Z">
    <path fill="#f7fdfd" d="M 50,0 H 400 V 0 L 150,400 H 0 V 0 Z">
    <path fill="url(#a)" d="m 400,0 h 20 L 170,400 h -20 z">
    </svg>`

    var svgElem = fakeDom.parseHTML(svg)[0];

    var slugText = svgElem.createElement("text");
    slugText.textContent = slug;
    slugText.setAttribute("y", 35);
    slugText.setAttribute("x", 20);
    slugText.setAttribute("fill", "#1b1d35");
    slugText.setAttribute("font-size", "21");
    svgElem.appendChild(slugText);

    var titleAccumulation = "";
    var lastSpaceIndex = 0;
    var currentLine = 0;
    for(var i = 0; i < title.length; i++) {
        if(title[i] != "\n") titleAccumulation += title[i];

        if(titleAccumulation.length >= TITLE_ALLOWED_LINE_LENGTHS[currentLine] || title[i] == "\n") {
            var titleText = svgElem.createElement("text");
            titleText.textContent = slug;
            titleText.setAttribute("y", 85 + currentLine*30);
            titleText.setAttribute("x", 20);
            titleText.setAttribute("fill", "#1b1d35");
            titleText.setAttribute("font-size", "32");
            titleText.setAttribute("font-weight", "bolder");
            titleText.appendChild(titleAccumulation);
            titleAccumulation = "";
        }
    }

    var svgRenderer = new Svg(svgElem);

    var width = 1024;
    var height = width / 2;

    var pixels = svgRenderer.render(width, height);

    console.log(pixels[0].length, pixels.length);

    var png = new PngFile(pixels, width / 2);
    return png.toBuffer();
}

