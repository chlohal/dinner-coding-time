var elipson = 1e-8;

module.exports = function Line(lineData) {
    if(lineData.type != "L") throw "Unknown line type " + lineData.type;

    var point1 = lineData.from;
    var point2 = [lineData.args[0], lineData.args[1]];

    var rise = point2[1] - point1[1];
    var run = point2[0] - point1[0];
    var slope = rise / run;

    var boundTop = Math.max(point1[1], point2[1]);
    var boundBottom = Math.min(point1[1], point2[1]);
    var boundLeft = Math.min(point1[0], point2[0]);
    var boundRight = Math.max(point1[0], point2[0]);

    function lineY(x) {
        return  slope * (x - point1[0]) + point1[1];
    }

    this.box = {
        boundTop: boundTop,
        boundBottom: boundBottom,
        boundLeft: boundLeft,
        boundRight: boundRight
    };

    this.multiplicity = function(point) {
        if(slope == 0) return 0;
        //if it's outside the box, it'll always be 0
        if(point[1] > boundTop || point[1] < boundBottom || point[0] < boundLeft) return 0;
        
        //make sure it's not overlapping with other segments!
        if(point2[1] == point[1]) return 0;

        if(point[1] < boundTop && point[1] > boundBottom && point[0] > boundRight) return 1;

        //if it's vertical, just check if the x-coords match up
        if(slope == Infinity || slope == -Infinity) return +(Math.abs(point[0] - point1[0]) < elipson);

        var isRight = slope > 0 ? point[1] <= lineY(point[0]) : point[1] >= lineY(point[0]);

        //find out if the point occurs to the RIGHT of the line segment. If so, return 1; otherwise, return 0.
        //for a 0 slope, assume the ray doesn't impact
        return +isRight;
        
    }

    return this;
}