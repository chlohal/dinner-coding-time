var path = require("path");
var fs = require("fs");
var fakeDom = require("./fake-dom");
var Svg = require("./svg-rendery/svg");
var PngFile = require("./png-file/png-file");

var public = path.join(__dirname, "../public");

var TITLE_ALLOWED_LINE_LENGTHS = [15, 15, 13, 10, 9, 8];
var SLUG_SEGMENT_ALLOWED_LENGTH = 9;
/**
 * 
 * @param {import("./parse-controller").Page} page The page to describe
 */
module.exports = function (page) {
    var rawslug = page.location.replace(/(\/index)?\.html$/, "");
    var slug = replaceTextSlugWithNumericCodehsCode(rawslug, page);
    slug = slug.split("/").map(x => {
        if (x.length < SLUG_SEGMENT_ALLOWED_LENGTH) return x;
        else return x.substring(0, SLUG_SEGMENT_ALLOWED_LENGTH - 3) + "...";
    }).join("/");

    var title = page.document.getElementsByTagName("title")[0].textContent.replace(/\d+\.\d+\.\d+/, "").replace(/\|[^|]+$/, "").trim();

    var code = (page.document.getElementById("source") || page.document.getElementsByTagName("p")[0] || { textContent: "" }).textContent;
    
    code = code.substring(128);

    var ib = makeImageBuffer(slug, title, code);

    return writeImageBuffer(ib, rawslug);
}

function writeImageBuffer(buffer, location) {
    var imagelocation = path.join(public, "-ogimages", location  + "-og" + ".png");
    var dir = path.dirname(imagelocation);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(imagelocation, buffer);
    return imagelocation.replace(public, "").split(path.sep).join("/");
}
/**
 * @param {string} slug
 * @param {import("./parse-controller").Page} page The page to describe
 */
function replaceTextSlugWithNumericCodehsCode(slug, page) {
    var regex = /^\/codehs\/[\w-]+\/\d+\/\d+\/([\w-]+)/.exec(slug);
    if (regex && regex[1]) {
        var nameslug = regex[1];
        var titleElem = page.document.getElementsByTagName("title")[0];
        if (titleElem) {
            var title = titleElem.textContent;
            var number = /\d+\.\d+\.\d+/.exec(title);
            if (number) {
                number = number[0];
                return slug.replace(nameslug, number.replace(/\./g, "-"));
            }
        }
    }

    return slug;
}

function makeImageBuffer(slug, title, code) {

    var svg = `<svg viewBox="0 0 800 400" width="800" height="400">
    <linearGradient id="a" y1="0" y2="1">
        <stop stop-color="#57efec">
        <stop stop-color="#e85e90" offset="0.5">
        <stop stop-color="#fcc9ba" offset="1">
    </linearGradient>
    
    <path fill="#f7f5f5" d="M 0,0 H 800 V 400 H 0 Z">
    <path fill="#1b1d35" id="code-canvas" d="M 406.875,20.00003 H 750 c 16.62,0 30,13.37999 30,29.99999 V 350 c 0,16.62 -13.38,30 -30,30 H 182 Z">
    <path fill="#f7fdfd" id="title-overlap" d="M 50,0 H 400 V 0 L 150,400 H 0 V 0 Z">
    <path fill="url(#a)" id="gradient-ribbon" d="m 400,0 h 20 L 170,400 h -20 z">
    </svg>`

    var svgElem = fakeDom.parseHTML(svg)[0];

    var slugText = fakeDom.createElement("text");
    slugText.textContent = slug;
    slugText.setAttribute("y", 35);
    slugText.setAttribute("x", 20);
    slugText.setAttribute("fill", "#1b1d35");
    slugText.setAttribute("font-size", "21");
    svgElem.insertBefore(slugText, gradientRibbon);

    var titleOverlap = svgElem.getElementById("title-overlap");
    var gradientRibbon = svgElem.getElementById("gradient-ribbon");


    var titleTexts = makeTextLines(title, function (line) {
        return TITLE_ALLOWED_LINE_LENGTHS[line] || Infinity;
    }, {
        "fill": "#1b1d35",
        "font-size": 32,
        "font-weight": "bolder"
    },
        20, 85, 7);

    for (var i = 0; i < titleTexts.length; i++) svgElem.insertBefore(titleTexts[i], gradientRibbon);


    var codeTexts = makeTextLines(code, Infinity, {
        "fill": "#f7f5f5",
        "font-size": 20,
        "font-weight": "lighter"
    },
        185, 85, 12);

    for (var i = 0; i < codeTexts.length; i++) svgElem.insertBefore(codeTexts[i], titleOverlap);



    var svgRenderer = new Svg(svgElem);

    var width = 800;
    var height = width / 2;

    var pixels = svgRenderer.render(width, height);

    var png = new PngFile(pixels, width / 2);
    return png.toBuffer();
}

/**
 * @callback numcallback
 * @param {number} lineNumber
 * @returns {number} 
 */

/**
 * 
 * @param {string} text 
 * @param {numcallback|number} lineLengths 
 * @param {object} attributes 
 * @param {number} x 
 * @param {number} y 
 * @param {number} maxLines
 */
function makeTextLines(text, lineLengths, attributes, x, y, maxLines) {
    var lines = lineBreak(text, lineLengths);

    maxLines = maxLines || lines.length

    return lines.slice(0,maxLines).map((line,index) => {
        var titleText = fakeDom.createElement("text");
        titleText.textContent = line;
        titleText.setAttribute("y", y + index * 30);
        titleText.setAttribute("x", x);
        for (var k in attributes) {
            titleText.setAttribute(k, attributes[k]);
        }
        return titleText;
    });
}

function lineBreak(text, lineLengths) {
    var lines = [];
    var words = text.split(/\b/);
    function lineLength(n) {
        if (typeof lineLengths == "number") return lineLengths;
        else return lineLengths(n);
    }

    var currentLineText = "";
    var currentLineIndex = 0;
    for (var i = 0; i < words.length; i++) {

        if (currentLineText.length + words[i].length > lineLength(currentLineIndex) || words[i].includes("\n")) {
            lines.push(currentLineText);

            currentLineIndex++;
            currentLineText = "";
        }
        if (!words[i].includes("\n")) currentLineText += words[i];
    }
    lines.push(currentLineText);


    return lines.map(x=>x.trim());

}