var linearGradientFillController = require("./linearGradient");

module.exports = function makeFillController(elem) {
    var self = {
        getColor: fallback,
        type: "fallback"
    };

    var fill = elem.getAttribute("fill");
    if (!fill) return self;

    if (fill.startsWith("#")) {
        var fillColor = parseHex(fill);
        return {
            type: "color",
            getColor: function () {
                return [
                    fillColor[0],
                    fillColor[1],
                    fillColor[2]
                ];
            }
        };
    } else if (fill.startsWith("url")) {
        var root = findRoot(elem);
        var gradientIdRegex = /url\((?:'|")?#([\w-]+)(?:'|")?\)/.exec(fill);
        if (gradientIdRegex) {
            var id = gradientIdRegex[1];
            var gradient = root.getElementById(id);
            if (gradient) {
                if (gradient.nodeName.toLowerCase() == "lineargradient") {
                    return linearGradientFillController(gradient);
                }
            }
        }
    }

    return self;
}

function fallback() {
    return [0, 0, 0];
}

/**
 * Find the root node of a FakeDomNode
 * @param {import("../fake-dom").FakeDomNode} elem 
 * @returns {import("../fake-dom").FakeDomNode}
 */
function findRoot(elem) {
    var target = elem;

    //record already-seen nodes to prevent circular structures
    var alreadySeen = [];
    while (target.parentNode) {
        target = target.parentNode;
        if (alreadySeen.includes(target)) break;
        alreadySeen.push(target);
    }
    return target;
}

function parseHex(hex) {
    hex = hex.replace(/^#/, "");
    return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
    ];
}