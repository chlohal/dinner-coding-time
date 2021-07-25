var fs = require("fs");
var path = require("path");

var parsers = {};
/**
 * Pre-parse code
 * @param {Page} page The page to pre-parse
 */
module.exports = function (page) {
    if(!page.location.startsWith("/codehs/")) return false;

    //load parser
    var language = page.location.split("/")[2];

    //account for different versions
    if (language.startsWith("python")) language = "python";
    if (!parsers[language]) {
        var parserPath = path.join(__dirname, "../public/assets/parsers", language, "parser.js");
        if (!fs.existsSync(parserPath)) return false;
        parsers[language] = require(parserPath);
    }
    var document = page.document;

    var main = document.getElementsByTagName("main")[0];

    var code = {};
    for (var j = 0; ; j++) {
        var id = "source" + (j || "");
        var sourceElem = main.getElementById(id);
        if (!sourceElem) break;

        var source = sourceElem.textContent;
        //ignore empty sources
        if (source.replace(/[\n\s]+/g, "") == "") continue;

        try {
            code[id] = parsers[language].parse(source);
        } catch (e) {
            throw "Problem parsing";
        }
    }

    var datascriptContent = `window.__preparsed = ${JSON.stringify(code)};`;

    var datascript = document.createElement("script");
    datascript.textContent = datascriptContent;
    datascript.setAttribute("type", "dct-datascript");
    datascript.setAttribute("class", "preparsedcode-datascript");

    var oldDatascript = main.getElementsByClassName("preparsedcode-datascript")[0];
    if (oldDatascript) oldDatascript.parentNode.removeChild(oldDatascript);
    main.appendChild(datascript);

    return page;
}