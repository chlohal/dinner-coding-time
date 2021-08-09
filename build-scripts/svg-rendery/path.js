var makeFillController = require("./fill-controller");
const Cubic = require("./path-segments/cubic");
const Line = require("./path-segments/line");
const Quadratic = require("./path-segments/quadratic");

module.exports = Path;

var numberRegex = "[-\\d.]+";
var spaceRegex = "\\s*"

var commands = [
    "M" + numberRegex + spaceRegex + numberRegex,
    "," + numberRegex + spaceRegex + numberRegex,
]

var commandRegex = new RegExp(commands.map(x=>`(?:${x}${spaceRegex})`).join("|"), "g");

/**
 * @typedef {Path} Path
 * @param {import("../fake-dom").FakeDomNode} pathNode 
 */
function Path(pathNode) {
    var self = {};
    self.pathNode = pathNode;

    if(pathNode.nodeName.toLowerCase() != "path") throw "Not a path node: " + pathNode.nodeName;

    var pathCode = pathNode.getAttribute("d") || "";

    var path = pathparse(pathCode);
    self.path = path;

    var box = null;

    var pathSegments = [];
    for(var i = 0; i < path.segments.length; i++) {
        if(path.segments[i].type == "L") pathSegments.push(new Line(path.segments[i]));
        else if(path.segments[i].type == "C") pathSegments.push(new Cubic(path.segments[i]));
        else if(path.segments[i].type == "Q") pathSegments.push(new Quadratic(path.segments[i]));

        var lastSegment = pathSegments[pathSegments.length - 1];

        if(!lastSegment) continue;

        if(box == null) box = lastSegment.box;

        if(!box) continue;

        box.boundBottom = Math.min(box.boundBottom, lastSegment.box.boundBottom);
        box.boundTop = Math.max(box.boundTop, lastSegment.box.boundTop);
        box.boundLeft = Math.min(box.boundLeft, lastSegment.box.boundLeft);
        box.boundRight = Math.max(box.boundRight, lastSegment.box.boundRight);
    }

    self.coversPoint = function coversPoint(x, y) {
        if(box) {
            if(y < box.boundBottom || y > box.boundTop || x < box.boundLeft || x > box.boundRight) return 0;
        }
        
        var multiplicity = 0;
        for(var i = 0; i < pathSegments.length; i++) {
             multiplicity += pathSegments[i].multiplicity([x, y]);
        }
        return multiplicity % 2;
    }

    self.fillController = makeFillController(pathNode);

    self.getColor = function(x, y) {
        return self.fillController.getColor(x, y, box);
    }
    return self;   
}

function pathparse(path) {
    var scan = makeScanner(path);
    var segments = [];
    var firstDrawPoint = [0,0];
    var drawnFirstPoint = false;
    var x = 0, y = 0;
    var typeParameterCounts = {
        "M": 2,
        "m": 2,
        "L": 2,
        "l": 2,
        "H": 1,
        "h": 1,
        "V": 1,
        "v": 1,
        "C": 6,
        "c": 6,
        "S": 4,
        "s": 4,
        "Q": 4,
        "q": 4,
        "T": 2,
        "t": 2,
        "A": 7,
        "a": 7,
    }
    while(!scan.done()) {
        var type = scan.letter();
        if(!type) continue;

        var argCount = typeParameterCounts[type] || 0;
        var args = [];
        for(var i = 0; i < argCount; i++) {
            args.push(scan.number());
        }
        
        if(type == "H") {
            type = "L";
            args = [args[0], y];
        } else if(type== "V") {
            type = "L";
            args = [x, args[0]];
        } else if(type == "v") {
            type = "l";
            args = [0, args[0]];
        } else if(type== "h") {
            type = "l";
            args = [args[0], 0];
        }
        if(type.toLowerCase() == "z") {
            segments.push({
                type: "L",
                from: [x,y],
                args: firstDrawPoint,
                __closes: true
            });
            scan.navigate(scan.position() + 1);
            drawnFirstPoint = false;
            continue;
        }
        //if this segment is drawn & firstDrawPoint isn't defined, define it
        if(type.toUpperCase() == "M" && !drawnFirstPoint) {
            if(type.toUpperCase() == type) firstDrawPoint = [args[0], args[1]];
            else firstDrawPoint = [x + args[0], y + args[1]];
        }
        if(type.toUpperCase() != "M") drawnFirstPoint = true;
        var fromX = x, fromY = y;
        if(type == type.toLowerCase()) {
            for(var i = 0; i < args.length - 2; i+=2) {
                args[i] = x + args[i];
                args[i+1] = y + args[i+1];
            }

            args[args.length - 2] = (x += args[args.length - 2]);
            args[args.length - 1] = (y += args[args.length - 1]);
        } else {
            x = args[args.length - 2];
            y = args[args.length - 1];
        }
        segments.push({
            type: type.toUpperCase(),
            from: [fromX, fromY],
            args: args
        });
    }
    if(segments.length > 0) {
        if(!segments[segments.length - 1].__closes) {
            segments.push({
                type: "L",
                from: [x,y],
                args: firstDrawPoint,
                __closes: true
            });
        }
    }


    return {
        firstDrawPoint: firstDrawPoint,
        segments: segments
    };
}

function makeScanner(str) {
    var index = 0;
    return {
        letter: function() {
            for(; index < str.length; index++) {
                if(isLetter(str[index])) return str[index];
            }
        },
        number: function() {
            var foundNum = false;
            var num = "";
            for(; index < str.length; index++) {
                if(foundNum) {
                    if(!isNumber(str[index]) || str[index] == "-") {
                        return +num;
                    } else {
                        num += str[index];
                    }
                } else {
                    if(isNumber(str[index])) {
                        num += str[index];
                        foundNum = true;
                    }
                }
            }
            return +num;
        },
        done: function() {
            return index + 1 >= str.length
        },
        reset: function() {
            index = 0;
        },
        navigate: function(i) {
            index = i;
        },
        position: function() {
            return index;
        }
    }
}
/**
 * 
 * @param {string} char 
 */
function isLetter(char) {
    var c = char.charCodeAt(0);
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}
function isNumber(char) {
    var c = char.charCodeAt(0);
    return char == "." || char == "-" || (c >= 48 && c <= 57);
}