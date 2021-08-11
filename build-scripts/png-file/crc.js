var binaryTools = require("./binary.js");

var crcTable = (function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
})();

/**
 * Compute a CRC-32 checksum.
 * @param {Buffer} data Data to consume.
 * @returns {Buffer} CRC-32 of the data.
 */
module.exports = function(data) {
    var crc32 = 0 ^ (-1);

    for(var i = 0; i < data.length; i++) {
        var byte = data[i];
        crc32 = (crc32 >>> 8) ^ crcTable[(crc32 ^ byte) & 0xFF];
    }
    
    var final = (crc32 ^ (-1)) >>> 0;
    return binaryTools.padTo(final, 4);
}