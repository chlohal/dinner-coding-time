importScripts("lightweight-java-highlighter.js");

onmessage = (event) => {
    var data = event.data;
    if (data.function == "lex") {
        var result = lex(data.args[0], data.args[1]);
        postMessage({
            nonce: data.nonce,
            data: result
        });
    }
};

var contexts = {
    "BASE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {

        if (char == "\\") return {
            context: contexts.ESCAPED
        };

        if (lineIndex == 0 && str.startsWith("# ", index)) return {
            context: contexts.H1
        };
        else if (lineIndex == 0 && str.startsWith("## ", index)) return {
            context: contexts.H2
        };
        else if (lineIndex == 0 && str.startsWith("### ", index)) return {
            context: contexts.H3
        };
        else if (lineIndex == 0 && str.startsWith("#### ", index)) return {
            context: contexts.H4
        };

        if (str.startsWith("***", index)) return {
            context: contexts.BOLD_ITALICS
        };
        else if (str.startsWith("**", index)) return {
            context: contexts.BOLD
        };
        else if (str.startsWith("*", index)) return {
            context: contexts.ITALICS
        };

        if (str.startsWith("```", index)) return {
            context: contexts.CODE_BLOCK
        };
        else if (str.startsWith("`", index)) return {
            context: contexts.CODE_INLINE
        };
        
        if(char == "\n") return {
            context: contexts.NEWLINE
        };
        else if(char == "\r") return {
            context: contexts.NEWLINE,
            skip: 1
        }

        return {
            add: char
        };
    },
    "BOLD": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (ctxIndex > 0 && str.startsWith("**", index)) {
            return {
                add: "<strong>" + (keepSyntax ? "**" : "") + term.substring(2, term.length - 1) + (keepSyntax ? "**" : "") + "</strong>",
                context: contexts.BASE,
                skip: 2
            };
        } else {
            return {};
        }
    },
    "ITALICS": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (ctxIndex > 0 && str.startsWith("*", index)) {
            return {
                add: "<em>" + (keepSyntax ? "*" : "") + term.substring(1, term.length - 1) + (keepSyntax ? "*" : "") + "</em>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "BOLD_ITALICS": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (ctxIndex > 0 && str.startsWith("***", index)) {
            return {
                add: "<em><strong>" + (keepSyntax ? "***" : "") + term.substring(3, term.length - 1) + (keepSyntax ? "***" : "") + "</strong></em>",
                context: contexts.BASE,
                skip: 3
            };
        } else {
            return {};
        }
    },
    "CODE_INLINE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (ctxIndex > 0 && str.startsWith("`", index)) {
            return {
                add: "<code>" + (keepSyntax ? "`" : "") + term.substring(1, term.length - 1) + (keepSyntax ? "`" : "") + "</code>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "CODE_BLOCK": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (ctxIndex > 0 && str.startsWith("```", index)) {
            if(term.substring(3, 3+5) == "java\n") term = (keepSyntax ? "java\n" : "") + lexJava(term.substring(8, term.length - 1), false);
            else term = term.substring(3, term.length - 1);
            
            return {
                add: "<pre><code>" + (keepSyntax ? "```" : "") + term + (keepSyntax ? "```" : "") + "</code></pre>",
                context: contexts.BASE,
                skip: 3
            };  
        } else {
            return {};
        }
    },
    "H1": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (char == "\n") {
            return {
                add: "<h1>" + (keepSyntax ? "# " : "") + term.substring(2, term.length - 1) + "</h1>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "H2": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (char == "\n") {
            return {
                add: "<h2>" + (keepSyntax ? "## " : "") + term.substring(3, term.length - 1) + "</h2>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "H3": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (char == "\n") {
            return {
                add: "<h3>" + (keepSyntax ? "### " : "") + term.substring(4, term.length - 1) + "</h3>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "H4": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (char == "\n") {
            return {
                add: "<h4>" + (keepSyntax ? "#### " : "") + term.substring(5, term.length - 1) + "</h4>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "ESCAPED": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        if (ctxIndex == 1) return {
            add: `<span class="md-escaped">${(keepSyntax ? "\\" : "")}${char}</span>`,
            context: contexts.BASE
        };
        else return {};
    },
    "NEWLINE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax) {
        return {
            add: `<br>`,
            context: contexts.BASE,
            skip: 1
        };
    },
    "MATH": 10,
    "UNDERLINE": 11,
    "LINK": 12,
    "LINK_ALT": 13,
    "STRIKED": 14,

}

function lex(src, keepSyntax) {
    keepSyntax = !!keepSyntax;

    var result = "";
    var context = contexts.BASE;
    var term = "";

    var lineIndex, ctxIndex = 0;

    for (var j = 0; j < src.length; j++) {
        var char = src.charAt(j);

        if (char == "\n" || j == 0) lineIndex = 0;
        if (char == "\n") console.log("lI", lineIndex);
        term += char;

        var ctxRes = context(src, j, lineIndex, char, term, ctxIndex, keepSyntax);

        if (ctxRes.context !== context && ctxRes.context !== undefined) {
            context = ctxRes.context;
            term = "";
            ctxIndex = -1;
            j--;
        }
        if (ctxRes.term !== undefined) term = ctxRes.term;
        if (ctxRes.add !== undefined) result += ctxRes.add;
        if (ctxRes.skip !== undefined) j += ctxRes.skip;

        if (char != "\n") lineIndex++;
        ctxIndex++;
    }
    
    if(context != contexts.BASE) {
        console.log("nobase");
        result += term; 
    }
    
    
    return result;
}

function isAlphaNumeric(char) {
    var code = char.charCodeAt(0);
    return ((code > 47 && code < 58) || // numeric (0-9)
        (code > 64 && code < 91) || // upper alpha (A-Z)
        (code > 96 && code < 123)) // lower alpha (a-z)
};

function isCapitalized(char) {
    var code = char.charCodeAt(0);
    return (code > 64 && code < 91);
}

function encodeCharacterEntities(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}