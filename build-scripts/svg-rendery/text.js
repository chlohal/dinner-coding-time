var fontloader = require("../fonts/fontloader.js");
var makeFillController = require("./fill-controller");
var fakeDom = require("../fake-dom");
var Path = require("./path");
/**
 * 
 * @param {import("../fake-dom").FakeDomNode} textElement 
 */
module.exports = function Text(textElement) {
    var self = {};

    var text = textElement.textContent || "";
    var x = (+textElement.getAttribute("x")) || 0;
    var y = (+textElement.getAttribute("y")) || 0;
    var fontSize = parseFloat(textElement.style.fontSize || textElement.getAttribute("font-size") || "12px") || 12;

    var font = fontloader(
        textElement.style.fontFamily || textElement.getAttribute("font-family"), 
        textElement.style.fontWeight || textElement.getAttribute("font-weight"));

    var path = font.getPath(text, x, y, fontSize);

    var dAttribute = pathToParsablePathdata(path);

    var letters = dAttribute.split("Z").map(x=>{
        var pathElem = fakeDom.createElement("path");
        pathElem.setAttribute("d", x + "Z");
        return new Path(pathElem);
    });


    self.coversPoint = function(x, y) {
        var letterformsCovers = 0;
        for(var i = 0; i < letters.length; i++) {
            var covers = letters[i].coversPoint(x, y);
            if(covers != 0) letterformsCovers++;
        }
        return letterformsCovers % 2;
    }
    self.fillController = makeFillController(textElement);

    self.getColor = function(x, y) {
        return self.fillController.getColor(x, y);
    }

    return self;
}

function pathToParsablePathdata(path) {
    var d = "";
    var commandKeys = ["x1", "y1", "x2", "y2", "x", "y"];
    for(var i = 0; i < path.commands.length; i++) {
        var command = path.commands[i];
        d += command.type;
        for(var j = 0; j < commandKeys.length; j++) {
            if(command[commandKeys[j]] !== undefined) {
                d += round(command[commandKeys[j]], 4) + " ";
            }
        }
    }
    return d;
}

function round(n, p) {
    var pow = Math.pow(10, p);
    return Math.round(n * pow) / pow;
}