var binaryTools = require("./binary.js");
var Chunk = require("./png-chunk.js");
var zlib = require("zlib");

var FILTER_TYPE = 0;

/**
 * 
 * @param {number[][][]} pixels 
 */
module.exports = function PngFile(pixels, width) {
    this.pixels = pixels;
    if(pixels[0].length != width) {
        var scaleFactor = width / pixels[0].length;
        
        var height = Math.floor(pixels.length * scaleFactor);

        var scaledPixels = [];

        for(var i = 0; i < height; i++) {
            var row = [];
            for(var j = 0; j < width; j++) {
                row.push(average(slice2d(pixels, Math.floor(j / scaleFactor), Math.floor(i / scaleFactor), Math.ceil(1 / scaleFactor), Math.ceil(1 / scaleFactor) )));
            }
            scaledPixels.push(row);
        }
        pixels = scaledPixels;
    }
    this.toBuffer = function() {
        var header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

        var width = binaryTools.padTo(pixels[0].length, 4);
        var height = binaryTools.padTo(pixels.length, 4);
        var bitDepth = Buffer.from([8]);
        var colorType = Buffer.from([0b0000_0010]);
        var compressionMethod = Buffer.from([0]);
        var filterMethod = Buffer.from([0]);
        var interlaceMethod = Buffer.from([0]);

        var headerChunk = new Chunk("IHDR", Buffer.concat([width, height, bitDepth, colorType, compressionMethod, filterMethod, interlaceMethod]));

        var bitDepthMax = Math.pow(2, bitDepth[0]);

        var lines = [];

        var max = 0;
        for(var i = 0; i < pixels.length; i++) {
            for(var j = 0; j < pixels[i].length; j++) {
                for(var k = 0; k < pixels[i][j].length; k++) {
                    if(pixels[i][j][k] > max) max = pixels[i][j][k];
                }
            }
        }

        for(var i = 0; i < pixels.length; i++) {
            var line = [];
            var filterType = FILTER_TYPE;
            line.push(filterType);
            for(var j = 0; j < pixels[i].length; j++) {
                for(var k = 0; k < pixels[i][j].length; k++) {
                    //normalize to a bit depth of 8
                    pixels[i][j][k] = Math.floor((pixels[i][j][k] / max) * bitDepthMax);

                    var predicted = 0;
                    var predictedBytes = {
                        a: pixels[i][j - 1] ? pixels[i][j - 1][k] : 0,
                        b: pixels[i - 1] ? pixels[i - 1][j][k] : 0,
                        c: pixels[i - 1] ? pixels[i - 1][j - 1] ? pixels[i - 1][j - 1][k] : 0 : 0,
                    }
                    if(filterType == 1) predicted = predictedBytes.a
                    else if(filterType == 2) predicted = predictedBytes.b
                    else if(filterType == 3) predicted = (predictedBytes.a + predictedBytes.b) / 2
                    else if(filterType == 4) predicted = paeth(predictedBytes.a, predictedBytes.b, predictedBytes.c);

                    var delta = pixels[i][j][k] - predicted;
                    var byteDelta = (delta + 256) % 256;
                    line.push(byteDelta);
                }
            }
            lines.push(Buffer.from(line));
        }

        var image = Buffer.concat(lines);
        var imageCompressed = zlib.deflateSync(image);
        var dataChunk = new Chunk("IDAT", imageCompressed);

        var tailChunk = new Chunk("IEND", Buffer.alloc(0));

        return Buffer.concat([
            header,
            headerChunk.toBuffer(),
            dataChunk.toBuffer(),
            tailChunk.toBuffer()
        ])

    }
}

function paeth(a, b, c) {
    var p = a + b - c;
    var pa = Math.abs(p - a);
    var pb = Math.abs(p - b);
    var pc = Math.abs(p - c);

    //round in case of float inaccuracy
    return Math.round(Math.min(pa, pb, pc));
}

function slice2d(pixels, x, y, width, height) {
    var rows = [];
    for(var i = y; i < y + height; i++) {
        rows.push(pixels[i].slice(x, x + width));
    }
    return rows;
}

function average(pixels) {
    var total = [0, 0, 0];
    for(var i = 0; i < pixels.length; i++) {
        for(var j = 0; j < pixels[i].length; j++) {
            total[0] += pixels[i][j][0];
            total[1] += pixels[i][j][1];
            total[2] += pixels[i][j][2];
        }
    }
    var pixelCount = pixels.length * pixels[0].length;
    return [
        total[0] / pixelCount,
        total[1] / pixelCount,
        total[2] / pixelCount,
    ];
}