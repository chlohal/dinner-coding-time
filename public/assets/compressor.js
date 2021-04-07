(function () {
    function compress(str, cb) {
        if (!cb) cb = function () { };

        var dictionary = getInitialDictionary();

        var buffer = str[0];
        var out = [];
        var currentIndex = 1;

        function asyncLoop() {
            var i = currentIndex;
            var isNextInDictionary = dictionary.indexOf(buffer + str[i]) != -1;
            if (isNextInDictionary) {
                buffer += str[i];
            } else {
                dictionary.push(buffer + str[i]);
                if (dictionary.indexOf(buffer) == -1) throw `Error: buffer not in dictionary: "${buffer}"`
                out.push(dictionary.indexOf(buffer));
                buffer = str[i];
            }


            if (i + 1 == str.length) {
                window.encodeDict = dictionary;
                out.push(dictionary.indexOf(buffer));

                out.dictionary = dictionary;
                cb(out);
            } else {
                currentIndex++;
                asyncLoop();
            }
        }

        asyncLoop();
    }

    window.lzwEncode = function lzwEncode(str, cb) {
        if (str.length == 1) throw "Error: string must be at least 2 chars long to encode";
        compress(str, function (result) {
            cb && cb(arrToB64(result));
        });
    }

    window.lzwDecode = function lzwDecode(b64, cb) {
        uncompress(b64ToArr(b64), cb);
    }

    function uncompress(compressedArr, cb) {
        if (!cb) cb = function () { };

        window.dictionary = getInitialDictionary();

        var conjecture = "";
        var out = [];
        var currentIndex = 0;
        var nextDictionaryEntry = dictionary.length;

        function asyncLoop() {
            var code = compressedArr[currentIndex];

            //0 code is padding; just skip it
            if (code === 0) {
                currentIndex++;
                //or send the result if applicable
                if (currentIndex >= compressedArr.length) cb(out.join(""));
                else asyncLoop();

                return;
            }

            //if the code is unknown, then use the first letter of the conjuncture as the conjecture completion. confusing, but it works out mathematically. this usually happens when letters repeat.
            if (dictionary[code] === undefined) {
                dictionary[code] = conjecture + conjecture[0];
                conjecture = "";
                nextDictionaryEntry++;
            }

            //if there's a conjecture from before...
            if (conjecture !== "") {
                //...add the last letter onto the conjecture from before
                dictionary[nextDictionaryEntry] = (conjecture + dictionary[code][0]);
                nextDictionaryEntry++;
                conjecture = "";
            }

            out.push(dictionary[code]);
            conjecture = dictionary[code];

            if (currentIndex + 1 == compressedArr.length) {
                cb(out.join(""));
            } else {
                currentIndex++;
                asyncLoop();
            }
        }

        asyncLoop();
    }

    function getInitialDictionary() {
        var arr = [];
        for (var i = 32; i <= 126; i++) {
            arr.push(String.fromCharCode(i));
        }

        arr.push("\n");
        arr.push("\t");

        return [null].concat(arr);
    }

    function pad(str, i, n) {
        while (str.length < i) str = (n || "0") + str;
        return str;
    }

    function intToString64(i) {
        var str = "";
        if (i == 0) return "!";

        var intStrBin = i.toString(2);
        while (intStrBin.length % 6) intStrBin = "0" + intStrBin;

        for (var j = 0; j < intStrBin.length; j += 6) {
            str += intToChar64(+('0b' + intStrBin.substring(j, j + 6)));
        }
        return str;
    }

    function intToChar64(i) {
        if (i < 0) throw "must be positive";
        if (i < 36) return i.toString(36);
        if (i < 62) return (i % 36 + 10).toString(36).toUpperCase();
        if (i == 62) return "_";
        if (i == 63) return "-";
    }

    function b64ToInt(i) {
        if (i.length != 1) throw `must be 1 char: '"${i}"'; is ${i.length}`;
        if (i.match(/[0-9a-z]/)) return parseInt(i, 36);
        if (i.match(/[A-Z]/)) return parseInt(i, 36) + 26;
        if (i == "_") return 62;
        if (i == "-") return 63;
        if (i == "!") return 0;
    }

    function b64ToArr(b64, width) {
        if (!width) width = 1.5;
        var resultStr = "";
        for (var i = 0; i < b64.length; i++) {
            var asAnInt = b64ToInt(b64[i]);
            resultStr += pad(asAnInt.toString(2), 6); //if it's the first one, don't pad; otherwise, pad to 6 birs bc that's 2^6 = 64
        }
        var resultArr = [];
        for (var i = 0; i < resultStr.length; i += 8 * width) {
            let num = parseInt(resultStr.substring(i, i + 8 * width), 2);
            if (num != 0) resultArr.push(num);
        }

        return resultArr;
    }

    function arrToB64(arr, width) {
        if (!width) width = 1.5;
        var result = "";
        //copy to not modify original array
        arr = arr.slice();

        //pad start of arr with zeroes until it's a multiple of 3
        while (arr.length % 3) arr.splice(0, 0, 0);

        for (var i = 0; i < arr.length; i += 3) {
            var currentChunk = pad(arr[i].toString(2), width * 8) + pad(arr[i + 1].toString(2), width * 8) + pad(arr[i + 2].toString(2), width * 8);

            for (var j = 0; j < currentChunk.length; j += 6) {
                var currentLetterInt = parseInt(currentChunk.substring(j, j + 6), 2);
                if (isNaN(currentLetterInt)) {
                    result += "=";
                    continue;
                }
                var currentLetterStr = intToString64(currentLetterInt);
                result += currentLetterStr;
            }
        }

        return result;
    }
    
})();