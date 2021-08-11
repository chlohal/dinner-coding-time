/**
 * 
 * @param {import("../fake-dom").FakeDomNode} linearGradientNode 
 */
module.exports = function linearGradient(linearGradientNode) {
    if (linearGradientNode.nodeName.toLowerCase() != "lineargradient") throw "Unknown linearGradient node: " + linearGradientNode.nodeName;

    var self = {};

    var x1 = linearGradientNode.getAttribute("x1") || "0";
    x1 = parseFloat(x1) / (x1.endsWith("%") ? 100 : 1);
    var x2 = linearGradientNode.getAttribute("x2") || "0";
    x2 = parseFloat(x2) / (x2.endsWith("%") ? 100 : 1);
    var y1 = linearGradientNode.getAttribute("y1") || "0";
    y1 = parseFloat(y1) / (y1.endsWith("%") ? 100 : 1);
    var y2 = linearGradientNode.getAttribute("y2") || "0";
    y2 = parseFloat(y2) / (y2.endsWith("%") ? 100 : 1);

    var start = [x1, y1];
    var end = [x2, y2];

    var stopElems = linearGradientNode.getElementsByTagName("stop");
    var stops = stopElems.map(x => makeStop(x)).sort((a,b)=>a.offset-b.offset);

    self.getColor = function linearColor(x, y, box) {
        var boxedPoint = [
            (x - box.boundLeft) / (box.boundRight - box.boundLeft),
            (y - box.boundBottom) / (box.boundTop - box.boundBottom)
        ];

        var equivalentGradientLinePoint = findEquivalentGradientLinePoint(start, end, boxedPoint);

        var gradientPercentagePosition = distancePercentage(start, end, equivalentGradientLinePoint);

        if(gradientPercentagePosition < 0) gradientPercentagePosition = 0;
        if(gradientPercentagePosition > 1) gradientPercentagePosition = 1;

        var lastStop = stops[0];
        var nextStop = stops[0];
        for(var i = 0; i < stops.length; i++) {
            if(stops[i].offset >= gradientPercentagePosition) {
                nextStop = stops[i];
                break;
            }
            lastStop = stops[i];
        }
        var betweenPositionPercentage = (gradientPercentagePosition - lastStop.offset) / (nextStop.offset - lastStop.offset);

        var interpolated = interpolate(lastStop.color, nextStop.color, betweenPositionPercentage);
        
        if(isNaN(interpolated[0])) console.log(interpolated, betweenPositionPercentage, lastStop, nextStop)

        return interpolated
    }

    self.type = "linearGradient";


    return self;
}

/**
 * Given a start point, an end point, and a midpoint, find the intersection of the start-end line and its perpendicular line through `midpoint`
 * @param {} start 
 * @param {*} end 
 * @param {*} slope 
 * @param {*} boxedPoint 
 */
function findEquivalentGradientLinePoint(start, end, midpoint) {
    //infinite slope edge case 
    if(end[0] == start[0]) {
        //same-point case
        if(end[1] == start[1]) {
            return start;
        } else { 
            return [
                start[0],
                (midpoint[1] - start[1]) / (end[1] - start[1])
            ];
        }
    }


    var slope = (end[1] - start[1]) / (end[0] - start[0]);

    var slopeSquared = slope*slope;

    var resultX = -(
        (-1 * slopeSquared * end[0] + slope * end[1] - midpoint[0] - slope * midpoint[1])
        /
        (slopeSquared + 1)
    );
    var resultY = slope * (resultX - end[0]) + end[1];

    return [resultX, resultY];
}

function distancePercentage(start, end, midpoint) {
    var startMidDistance = distance(start, midpoint);
    var startEndDistance = distance(start, end);
    return startMidDistance / startEndDistance;
}

function distance(point1, point2) {
    var a = point2[0] - point1[0];
    var b = point2[1] - point1[1];
    return Math.sqrt(a*a + b*b);
}

function interpolate(start, end, time) {
    if(isNaN(time)) time = 0;
    return [
        start[0] + time * (end[0] - start[0]),
        start[1] + time * (end[1] - start[1]),
        start[2] + time * (end[2] - start[2])
    ];
}

function fallback() {
    return [0, 0, 0];
}

function makeStop(stop) {
    var offsetStr = stop.getAttribute("offset") || "";
    var offset = parseFloat(offsetStr) || 0;
    if (offsetStr.endsWith("%")) offset /= 100;

    var stopColor = stop.getAttribute("stop-color");
    if (!stopColor) stopColor = "#000000";

    return {
        offset: offset,
        color: parseHex(stopColor)
    }
}

function parseHex(hex) {
    hex = hex.replace(/^#/, "");
    return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
    ];
}