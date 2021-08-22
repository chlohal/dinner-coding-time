module.exports = function QuadraticBezier(lineData) {
    if (lineData.type != "Q") throw "Unknown quadratic bezier type " + lineData.type;

    var start = lineData.from;
    var control1 = [lineData.args[0], lineData.args[1]];
    var end = [lineData.args[2], lineData.args[3]];

    //pre-calculate the coefficients
    var coefC = [0, 0];
    var coefB = [0, 0];
    var coefA = [0, 0];

    for (var i = 0; i <= 1; i++) {
        coefC[i] = start[i];
        coefB[i] = 2 * (control1[i] - start[i]);
        coefA[i] = (start[i] - 2 * control1[i] + end[i]);
    }

    function solvePoint(t) {
        return [
            coefA[0] * (t * t) + coefB[0] * t + coefC[0],
            coefA[1] * (t * t) + coefB[1] * t + coefC[1],
        ];
    }


    var boundTop = Math.max(start[1], control1[1], end[1]);
    var boundBottom = Math.min(start[1], control1[1], end[1]);
    var boundLeft = Math.min(start[0], control1[0], end[0]);
    var boundRight = Math.max(start[0], control1[0], end[0]);

    this.box = {
        boundTop: boundTop,
        boundBottom: boundBottom,
        boundLeft: boundLeft,
        boundRight: boundRight
    };

    this.multiplicity = function (point) {
        //if it's outside the box, it'll always be 0
        if ((point[0] > boundRight || point[0] < boundLeft) && (point[1] > boundTop || point[1] < boundBottom)) return 0;

        var zeroes = solveQuadratic(point[1], coefA[1], coefB[1], coefC[1]);
        var inBandZeroes = zeroes.filter(x => 0 <= x && x < 1);

        if (inBandZeroes.length == 0) return 0;

        var totalIntersectedZeroes = 0;
        for (var i = 0; i < inBandZeroes.length; i++) {
            var p = solvePoint(inBandZeroes[i]);
            if (p[0] <= point[0]) totalIntersectedZeroes++;
        }
        return totalIntersectedZeroes;
    }

    return this;
}

/**
 * @author https://stackoverflow.com/users/325300/alexander-shtuchkin
 * @param {number} zeroPoint The y-coordinate to actually calculate for. Doesn't have to be 0!
 * @param {number} a a coefficient in `ax^2+bx+c=0`
 * @param {number} b b coefficient in `ax^2+bx+c=0`
 * @param {number} c c coefficient in `ax^2+bx+c=0`
 * @returns {number[]} All solutions of the given cubic
 */
function solveQuadratic(zeroPoint, a, b, c) {
    //"subtract from both sides"-- cancel out the zeroPoint to transform the coordinate system. WAY easier than a solved format
    c = c - zeroPoint;

    var elipson = 1e-8;
    if (Math.abs(a) < elipson) { // Linear case, ax+b=0
        a = b; b = c;
        if (Math.abs(a) < elipson) // Degenerate case
            return [];
        return [-b / a];
    }

    var D = b * b - 4 * a * c;
    if (Math.abs(D) < elipson)
        return [-b / (2 * a)];
    else if (D > 0)
        return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
    return [];
}