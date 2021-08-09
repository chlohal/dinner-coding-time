var crcSum = require("./crc.js");
var binaryTools = require("./binary.js");

/**
 * 
 * @param {string} type The 4-letter type of chunk
 * @param {Buffer} data Data to insert in the chunk
 */
module.exports = function Chunk(type, data) {
    this.toBuffer = function() {
        //split into multiple chunks if required
        var subchunks = [];
        for(var i = 0; i < data.length; i+=0xFFFFFF) {
            var subchunk = data.slice(i, i + 0xFFFFFF);

            var lengthHeader = binaryTools.padTo(subchunk.length, 4);
            if(lengthHeader.length != 4) throw "Bad length header";
            
            var toCrc = Buffer.concat([
                Buffer.from(type, "ascii"),
                subchunk
            ]);

            var crc = crcSum(toCrc);
            if(crc.length != 4) throw "Bad CRC length"

            subchunks.push(Buffer.concat([lengthHeader, toCrc, crc]));
        }
        return Buffer.concat(subchunks);
    }
}

