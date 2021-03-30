/**
 * A collection of functions to help with parsing scripts & markup
 * @module coleh/parser-tools
*/

var parserTools = {
    /**
     * Takes out all comments
     * @param {string} str The string to search in
     * @param {Object} [options] - Options that define what comments are
     * @param {string} options.start - Sequence that starts a comment
     * @param {string} options.end - Sequence that ends a comment
     * @param {string} options.line - Sequence that starts a single-line comment
     * @returns {string} The string stripped of all comments
     */
    stripComments: function (str, options) {

        let commentStart, commentEnd;

        if(!options) options = {
            start: "/*",
            end: "*/",
            line: "//"
        }

        let inSingleQuote = false, inDoubleQuote = false, inMultilineComment = false;

        for (var i = 0; i < str.length; i++) {
            let inQuote;
            if (!inMultilineComment) {
                if (str[i] == "\"" && str[i - 1] != "\\" && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
                if (str[i] == "'" && str[i - 1] != "\\" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
                inQuote = inSingleQuote || inDoubleQuote;
            }


            if (!inQuote && !inMultilineComment) {
                //inline comment
                if (options.line && parserTools.sectionEquals(str, i, options.line)) {
                    commentEnd = parserTools.indexOfAfter(str, "\n", i);

                    //if it's on the last line, commentEnd should be the end of the string
                    commentEnd = commentEnd != -1 ? commentEnd : str.length;

                    //with the length change, i is now at the end
                    str = parserTools.indexReplace(str, i, commentEnd, "\n");
                }

                //multiline comment
                if (options.start && parserTools.sectionEquals(str, i, options.start)) {
                    commentStart = i;
                    inMultilineComment = true;
                }
            }

            //only the specific character sequence can end multilines, and only when one is already on
            if (options.end && parserTools.sectionEquals(str, i, options.end) && inMultilineComment) {
                commentEnd = i + 1;
                str = parserTools.indexReplace(str, commentStart, commentEnd, "");
                inMultilineComment = false;
            }
        }
        return str;
    },
    /**
     * Determines if a subsection of an array-like object is the same as a search
     * @param {Object} arr The object to search in
     * @param {number} index The index where the subsection starts
     * @param {Object} section The subsection to compare
     * @returns {boolean} Whether the subsection is the same
     */
    sectionEquals: function(arr, index, section) {
        for(var i = 0; i < section.length; i++) {
            if(arr[i + index] != section[i]) return false;
        }
        return true;
    },

    /**
     * Executes {@link sectionEquals} on an array of sections to search.
     * @param {Object} arr The object to search in
     * @param {number} index The index where the subsection starts
     * @param {Object[]} section The subsection to compare
     * @returns {Object} The section that matched, or `null` if none matched.
     */
    anySectionEquals: function(arr, index, sections) {
        for(var i = 0; i < sections.length; i++) {
            if(parserTools.sectionEquals(arr, index, sections[i])) return sections[i];
        }
        return null;
    },

    /**
     * Determines if a a substring exists after a certain index
     * @param {string} str The string to search in
     * @param {string} substr The string to search for
     * @param {number} index The index searched after
     * @returns {number} Index of the substring
     */
    indexOfAfter: function (str, substr, index) {
        return str.substring(index + 1).indexOf(substr) + index + 1;
    },

    /**
     * Replaces an index in a string with another string
     * @param {string} str The string to replace in
     * @param {number} replaceStart The index to start replacing at
     * @param {number} replaceEnd The index to end replacing at
     * @param {string} replaceText Text to replace with
     * @returns {string} Replaced string
     */
    indexReplace: function (str, replaceStart, replaceEnd, replaceText) {
        return str.substring(0, replaceStart) + replaceText + str.substring(replaceEnd + 1);
    },

    /**
     * Removes quotes surrounding a string. If there are no quotes, returns the string.
     * @param {string} str The string to unquote
     * @returns {string} Replaced string
     */
    unQuote: function (str) {
        if (str.startsWith("\"") && str.endsWith("\"")) {
            return str.substring(1, str.length - 1);
        }

        if (str.startsWith("'") && str.endsWith("'")) {
            return str.substring(1, str.length - 1);
        }

        return str;
    },

    /**
     * Finds a single-character regular expression in a string, excluding grouped instances.
     * @see findUngroupedSubstring
     * @param {string} str String to search in
     * @param {RegExp} regex Regex to search for
     * @returns {number} Index of the character
     */
    findUngroupedCharRegex: function (str, regex) {
        let inGroup = 0;
        let inSingleQuote = false;
        let inDoubleQuote = false;

        for (var i = 0; i < str.length; i++) {
            if (str[i] == "\"" && str[i - 1] != "\\" && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
            if (str[i] == "'" && str[i - 1] != "\\" && !inDoubleQuote) inSingleQuote = !inSingleQuote;

            let inQuote = inSingleQuote || inDoubleQuote;

            if ((str[i] == "{" || str[i] == "[") && !inQuote) inGroup++;
            else if ((str[i] == "}" || str[i] == "]") && !inQuote) inGroup--;

            if (str[i].match(regex) && inGroup == 0 && inQuote == false) return i;
        }
        return -1;
    },

    /**
     * Splits a string by a deliminator, ignoring deliminators inside groups
     * @see findUngroupedSubstring
     * @param {string} str String to split
     * @param {string} split Deliminator to split by
     * @param {GroupFindingOptions} [options] - Options that govern how groups are defined
     * @returns {[string]} Array of strings split
     */
    groupAwareSplit: function (str, split, options) {
        let words = [];

        split = split || " ";

        let prevSplitIndex = 0,
            nextSplitIndex = parserTools.findUngroupedSubstring(str, split, options);

        while (nextSplitIndex != -1 && words.length < 1000) {
            words.push(str.substring(prevSplitIndex, nextSplitIndex));

            prevSplitIndex = nextSplitIndex + split.length;

            nextSplitIndex = parserTools.findUngroupedSubstring(str.substring(prevSplitIndex), split, options);
             
            if (nextSplitIndex > -1) nextSplitIndex += prevSplitIndex;
        }

        words.push(str.substring(prevSplitIndex));

        return words;
    },

    /**
     * @typedef {Object} GroupFindingOptions
     * @property {boolean} [doQuotes] - Treat quotes as groups
     * @property {boolean} [doGroups] - Also use usual grouping symbols ([], {}, ())
     * @property {string[]} [groupEnter] - Characters that enter a group
     * @property {string[]} [groupExit] - Characters that exit a group
     */

    /**
     * Finds the index of a substring, excluding instances in grouping patterns
     * @param {String} str The string to search in
     * @param {String} substr The string to search for
     * @param {GroupFindingOptions} [options] - Options that govern how groups are defined
     * @returns First index of the substring inside the string, or -1 if none were found
     */
    findUngroupedSubstring: function (str, substr, options) {
        if(typeof substr == "string") substr = [substr];
        
        let inGroup = 0;
        let inSingleQuote = false;
        let inDoubleQuote = false;

        //fill in defaults
        if (!options) options = {
            doQuotes: true,
            doGroups: true,
            groupEnter: ["{", "[", "(", "<"],
            groupExit: ["}", "]", ")", ">"]
        }

        for (var i = 0; i < str.length; i++) {

            if (options.doQuotes) {
                if (str[i] == "\"" && str[i - 1] != "\\" && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
                if (str[i] == "'" && str[i - 1] != "\\" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
            }

            let inQuote = inSingleQuote || inDoubleQuote;

            if (options.doGroups && !inQuote) {
                let groupOutwardString = parserTools.anySectionEquals(str, i, options.groupExit);

                if (groupOutwardString) {
                    inGroup--;
                    //skip over the token
                    i += groupOutwardString.length - 1;
                }

                let groupInwardString = parserTools.anySectionEquals(str, i, options.groupEnter);

                if (groupInwardString) {
                    inGroup++;
                    //skip over the token
                    i += groupInwardString.length - 1;
                }
            }
            for(var j = 0; j < substr.length; j++) {
                if (str.substring(i - substr[j].length + 1, i + 1) == substr[j] &&
                    inGroup == 0 &&
                    inQuote == false) {
                    return i - substr[j].length + 1;
                }
            }
        }
        return -1;
    },
    /**
     * Determines if a string has a character, while ignoring instances in groups
     * @param {String} str The string to search in
     * @param {char} char The character to search for
     * @param {GroupFindingOptions} [options] - Options that govern how groups are defined
     * @returns {boolean} Whether the character was found
     */
    hasUngroupedChar: function (str, char, options) {
        let inGroup = 0;
        let inSingleQuote = false;
        let inDoubleQuote = false;

        //fill in defaults
        if (!options) options = {
            doQuotes: true,
            doGroups: true,
            groupEnter: ["{", "[", "("],
            groupExit: ["}", "]", ")"]
        }

        for (var i = 0; i < str.length; i++) {
            if (str[i] == "\"" && str[i - 1] != "\\" && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
            if (str[i] == "'" && str[i - 1] != "\\" && !inDoubleQuote) inSingleQuote = !inSingleQuote;

            let inQuote = inSingleQuote || inDoubleQuote;

            if (parserTools.anySectionEquals(str, i, options.groupEnter)  && !inQuote) inGroup++;
            else if (parserTools.anySectionEquals(str, i, options.groupExit)  && !inQuote) inGroup--;

            if (str[i] == char && inGroup == 0 && !inQuote) return true;
        }
        return false;
    }
}


if(typeof module === 'object' ) module.exports = parserTools;
if(typeof window === 'object' ) window.parserTools = parserTools;