module.exports = {
    /**
     * 
     * @param {number} number 
     * @param {number} byteLength 
     * @returns {Buffer}
     */
    padTo: function(number, byteLength) {
        var buffer = Buffer.alloc(byteLength);
        buffer.set(Buffer.from(pad(number.toString(16), byteLength * 2), "hex"));
        return buffer;
    }
}

function pad(str, len) {
    while(str.length < len) str = "0" + str;
    return str;
}