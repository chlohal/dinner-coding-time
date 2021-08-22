module.exports = function CubicBezier(lineData) {
    if (lineData.type != "C") throw "Unknown cubic bezier type " + lineData.type;

    var start = lineData.from;
    var control1 = [lineData.args[0], lineData.args[1]];
    var control2 = [lineData.args[2], lineData.args[3]];
    var end = [lineData.args[4], lineData.args[5]];

    //pre-calculate the cubic coefficients
    var coefC = [0, 0];
    var coefD = [0, 0];
    var coefB = [0, 0];
    var coefA = [0, 0];

    for (var i = 0; i <= 1; i++) {
        coefC[i] = 3 * (control1[i] - start[i]);
        coefD[i] = start[i];
        coefB[i] = 3 * control2[i] - 3 * coefD[i] - 2 * coefC[i];
        coefA[i] = end[i] - coefB[i] - coefC[i] - coefD[i];
    }

    function solvePoint(t) {
        return [
            coefA[0] * (t*t*t) + coefB[0] * (t*t) + coefC[0] * t + coefD[0],
            coefA[1]*(t*t*t) + coefB[1]*(t*t) + coefC[1]*t + coefD[1]
        ];
    }


    var boundTop = Math.max(start[1], control1[1], control2[1], end[1]);
    var boundBottom = Math.min(start[1], control1[1], control2[1], end[1]);
    var boundLeft = Math.min(start[0], control1[0], control2[0], end[0]);
    var boundRight = Math.max(start[0], control1[0], control2[0], end[0]);

    this.box = {
        boundTop: boundTop,
        boundBottom: boundBottom,
        boundLeft: boundLeft,
        boundRight: boundRight
    };

    this.multiplicity = function (point) {
        //if it's outside the box, it'll always be 0
        if ((point[0] > boundRight || point[0] < boundLeft) && (point[1] > boundTop || point[1] < boundBottom)) return 0;

        var zeroes = solveCubic(point[1], coefA[1], coefB[1], coefC[1], coefD[1]);
        var inBandZeroes = zeroes.filter(x=>0<=x&&x<1);

        if(inBandZeroes.length == 0) return 0;

        var totalIntersectedZeroes = 0;
        for(var i = 0; i < inBandZeroes.length; i++) {
            var p = solvePoint(inBandZeroes[i]);
            if(p[0] < point[0]) totalIntersectedZeroes++;
        }
        return totalIntersectedZeroes;
    }

    return this;
}

/**
 * @author https://stackoverflow.com/users/325300/alexander-shtuchkin
 * @param {number} zeroPoint The y-coordinate to actually calculate for. Doesn't have to be 0!
 * @param {number} a a coefficient in `ax^3+bx^2+cx+d=0`
 * @param {number} b b coefficient in `ax^3+bx^2+cx+d=0`
 * @param {number} c c coefficient in `ax^3+bx^2+cx+d=0`
 * @param {number} d d coefficient in `ax^3+bx^2+cx+d=0`
 * @returns {number[]} All solutions of the given cubic
 */
function solveCubic(zeroPoint, a, b, c, d) {
    //"subtract from both sides"-- cancel out the zeroPoint to transform the coordinate system. WAY easier than a solved format
    d = d - zeroPoint;

    var elipson = 1e-8;

    if (Math.abs(a) < elipson) { // Quadratic case, ax^2+bx+c=0
        a = b; b = c; c = d;
        if (Math.abs(a) < elipson) { // Linear case, ax+b=0
            a = b; b = c;
            if (Math.abs(a) < elipson) // Degenerate case
                return [];
            return [-b/a];
        }

        var D = b*b - 4*a*c;
        if (Math.abs(D) < elipson)
            return [-b/(2*a)];
        else if (D > 0)
            return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
        return [];
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    var p = (3*a*c - b*b)/(3*a*a);
    var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
    var roots;

    if (Math.abs(p) < elipson) { // p = 0 -> t^3 = -q -> t = -q^1/3
        roots = [cuberoot(-q)];
    } else if (Math.abs(q) < elipson) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
        roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
        var D = q*q/4 + p*p*p/27;
        if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
            roots = [-1.5*q/p, 3*q/p];
        } else if (D > 0) {             // Only one real root
            var u = cuberoot(-q/2 - Math.sqrt(D));
            roots = [u - p/(3*u)];
        } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
            var u = 2*Math.sqrt(-p/3);
            var t = Math.acos(3*q/p/u)/3;  // D < 0 implies p < 0 and acos argument in [-1..1]
            var k = 2*Math.PI/3;
            roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
        }
    }

    // Convert back from depressed cubic
    for (var i = 0; i < roots.length; i++)
        roots[i] -= b/(3*a);

    return roots;
}

function cuberoot(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
}