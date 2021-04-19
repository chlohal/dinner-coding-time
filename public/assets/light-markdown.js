importScripts("lightweight-java-highlighter.js");

onmessage = (event) => {
    var data = event.data;
    if (data.function == "lex") {
        var result = lex(data.args[0], data.args[1], data.args[2]);
        postMessage({
            nonce: data.nonce,
            data: result
        });
    }
};

var contexts = {
    "BASE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {

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
        
        if (lineIndex == 0 && str.startsWith("> ", index)) return {
            context: contexts.BLOCKQUOTE
        };
        
        if(lineIndex == 0 && str.startsWith("---", index)) return {
            context: contexts.HORIZONTAL_RULE
        };

        if(lineIndex == 0 && char == "|") return {
            context: contexts.TABLE
        };
        
        if(str.startsWith("\~\~", index)) return {
            context: contexts.STRIKED
        };
        
        if(str.startsWith("__", index)) return {
            context: contexts.UNDERLINE
        };
        
        if(char == "[") return {
            context: contexts.LINK
        }

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
    "BOLD": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
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
    "ITALICS": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
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
    "BOLD_ITALICS": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
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
    "CODE_INLINE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
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
    "CODE_BLOCK": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (ctxIndex > 0 && str.startsWith("```", index)) {
            if(term.substring(3, 3+5) == "java\n") term = (keepSyntax ? "java\n" : "") + lexJava(term.substring(8, term.length - 1), false);
            else term = term.substring(3, term.length - 1);
            
            return {
                add: "<pre><code>" + (keepSyntax ? "```" : "") + term.replace(/^\n/, "") + (keepSyntax ? "```" : "") + "</code></pre>",
                context: contexts.BASE,
                skip: 3
            };  
        } else {
            return {};
        }
    },
    "H1": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (char == "\n") {
            return {
                add: "<h"+ ((baseHeadingDepth||0)+1) +">" + (keepSyntax ? "# " : "") + term.substring(2, term.length - 1) + "</h"+ ((baseHeadingDepth||0)+1) +">",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "H2": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (char == "\n") {
            return {
                add: "<h"+ ((baseHeadingDepth||0)+2) +">" + (keepSyntax ? "## " : "") + term.substring(3, term.length - 1) + "</h"+ ((baseHeadingDepth||0)+2) +">",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "H3": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (char == "\n") {
            return {
                add: "<h"+ ((baseHeadingDepth||0)+3) +">" + (keepSyntax ? "### " : "") + term.substring(4, term.length - 1) + "</h"+ ((baseHeadingDepth||0)+3) +">",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "ESCAPED": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (ctxIndex == 1) return {
            add: `<span class="md-escaped">${(keepSyntax ? "\\" : "")}${char}</span>`,
            context: contexts.BASE,
            skip: 1
        };
        else return {};
    },
    "NEWLINE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        return {
            add: `<br>`,
            context: contexts.BASE,
            skip: 1
        };
    },
    "MATH": 10,
    "UNDERLINE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (ctxIndex > 0 && str.startsWith("__", index)) {
            return {
                add: "<u>" + (keepSyntax ? "__" : "") + term.substring(2, term.length - 1) + (keepSyntax ? "__" : "") + "</u>",
                context: contexts.BASE,
                skip: 2
            };
        } else {
            return {};
        }
    },
    "LINK": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (ctxIndex > 3 && char == ")") {
            var alt = "";
            var url = "";
            
            var closeSquare = term.indexOf("]");
            alt = term.substring(1, closeSquare);
            
            var openParen = term.indexOf("(");
            url = term.substring(openParen + 1, term.length - 1);
            
            if(closeSquare + 1 == openParen) return {
                add: "<a target=\"_blank\" rel=\"noopener\" href=\"" + url + "\">" + (keepSyntax ? "[" : "") + alt + (keepSyntax ? "](" + url + ")" : "") + "</a>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "STRIKED": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (ctxIndex > 0 && str.startsWith("\~\~", index)) {
            return {
                add: "<s>" + (keepSyntax ? "\~\~" : "") + term.substring(2, term.length - 1) + (keepSyntax ? "\~\~" : "") + "</s>",
                context: contexts.BASE,
                skip: 2
            };
        } else {
            return {};
        }
    },
    BLOCKQUOTE: function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if (char == "\n") {
            return {
                add: "<blockquote>" + (keepSyntax ? "> " : "") + term.substring(2, term.length - 1) + "</blockquote>",
                context: contexts.BASE,
                skip: 1
            };
        } else {
            return {};
        }
    },
    "HORIZONTAL_RULE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        if(char == "\n" && term == "---\n") return {
            add: `<hr/>`,
            context: contexts.BASE,
            skip: 1
        };
        else return {}
    },
    "TABLE": function (str, index, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth) {
        var add = "";
        if(ctxIndex == 0) add += "<table>";

        if(lineIndex == 0 && char == "|") add += "<tr><td>";
        
        if(char != "|") add += char;
        
        
        if(lineIndex > 0 && char == "|") add += "</td>";

        //if this is not the last character, open the next cell
        if(lineIndex > 0 && char == "|" && str.charAt(index + 1) != "\n" && index + 1 < str.length) add += "<td>";

        if(str.charAt(index + 1) == "\n") add += "</tr>";

        //if the next line doesn't start with a pipe, table's over
        if((char == "\n" && str.charAt(index + 1) != "|") || index + 1 == str.length ) {
            return {
                context: contexts.BASE,
                term: "",
                add: add + "</table>",
                skip: 1
            };
        } else {
            return {
                add: add
            };
        }
    },


}

function lex(src, keepSyntax, baseHeadingDepth) {
    keepSyntax = !!keepSyntax;

    var result = "";
    var context = contexts.BASE;
    var term = "";

    var lineIndex, ctxIndex = 0, changedContext = false;

    for (var j = 0; j < src.length; j++) {
        var char = src.charAt(j);
        changedContext = false;

        if (char == "\n" || j == 0) lineIndex = 0;
        if (char == "\n") console.log("lI", lineIndex);
        term += char;

        var ctxRes = context(src, j, lineIndex, char, term, ctxIndex, keepSyntax, baseHeadingDepth);

        if (ctxRes.context !== context && ctxRes.context !== undefined) {
            context = ctxRes.context;
            term = "";
            ctxIndex = -1;
            j--;
            changedContext = true;
        }
        if (ctxRes.term !== undefined) term = ctxRes.term;
        if (ctxRes.add !== undefined) result += ctxRes.add;
        if (ctxRes.skip !== undefined) j += ctxRes.skip;
        
        //stop at newlines, except for code blocks
        if(char == "\n" && !changedContext && (context != contexts.CODE_BLOCK && context != contexts.TABLE)) {
            result += term;
            context = contexts.BASE;
            term = "";
        }

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