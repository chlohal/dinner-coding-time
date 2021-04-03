onmessage = (event) => {
    var data = event.data;
    if (data.function == "highlightAuto") {
        var result = lex(data.args[0]);
        postMessage({
            nonce: data.nonce,
            data: result
        });
    }
  };


var keywordContexts = {
    "class": "keyword",
    "public": "keyword",
    "static": "keyword",

    "void": "void",
    "new": "new",
    "this": "this",
    "null": "null",

    "for": "keyword",
    "if": "keyword",
    "while": "keyword",
    "return": "keyword",
    "import": "keyword",
    "break": "keyword",
    "continue": "keyword",

    "int": "primitive-type",
    "char": "primitive-type",
    "boolean": "primitive-type",
    "double": "primitive-type",
}

var startingChars = {
    "LINE_COMMENT": "/",
    "COMMENT": "/",
    "STRING_LITERAL": "\""
}

function lex(src) {
    var result = "";
    var context = "BASE";
    var term = "";

    for(var i = 0; i < src.length; i++) {
        var char = src.charAt(i);
        switch(context) {
            case "BASE": 
                if(isAlphaNumeric(char)) {
                    term += char;
                } else { 
                    if(keywordContexts[term]) {
                        result += `<span class="hlast-${keywordContexts[term] === true ? "keyword" : keywordContexts[term]}">${term}</span>`;
                    } else if(term.match(/^-?[\d.]+$/)) {
                        result += `<span class="hlast-decimal-literal">${term}</span>`;
                    } else if(isCapitalized(term)) {
                        result += `<span class="hlast-type-type">${term}</span>`;
                    } else {
                        result += term;
                    }
                    term = "";

                    if(char == "\"") {
                        result += term;
                        term = "\"";
                        context = "STRING_LITERAL";
                    } else if(char == "/" && src.charAt(i+1) == "/") {
                        result += term;
                        term = "/";
                        context = "LINE_COMMENT";
                    } else if(char == "/" && src.charAt(i+1) == "*") {
                        result += term;
                        term = "/";
                        context = "COMMENT";
                    }
                    else {
                        result += encodeCharacterEntities(char);
                    }
                }
                break;
            case "STRING_LITERAL":
                if(char == "\"") { 
                    term += char;
                    result += `<span class="hlast-string-literal">${term}</span>`;
                    term = "";
                    context = "BASE";
                    break;
                } else if(char == "\\") {
                    result += `<span class="hlast-string-literal">${term}</span>`;
                    context = "ESCAPED_QUOTED_CHAR";
                    break;
                } else {
                    term += char;
                }
                break;
            case "ESCAPED_QUOTED_CHAR":
                term = "\\";
                term += char;
                result += `<span class="hlast-escaped-quoted-char">${term}</span>`;
                context = "STRING_LITERAL";
                term = "";
            break;
            case "LINE_COMMENT":
                if(char == "\n") {
                    context = "BASE";
                    result += `<span class="hlast-line-comment">${term}</span>\n`;
                    term = "";
                } else {
                    term += char;
                }
            break;
            case "COMMENT":
                if(src.charAt(i - 1) == "*" && char == "/") {
                    context = "BASE";
                    result += `<span class="hlast-comment">${term}/</span>`;
                    term = "";
                } else {
                    term += char;
                }
            break;
        }

        if(char == "\n" && context != "BASE") {
            result += `<span class="hlast-${context.toLowerCase().replace(/_/g, "-")}">${term}</span>`;
            term =  "";
        }

        if(i + 1 == src.length) {
            result += `<span class="hlast-${context.toLowerCase().replace(/_/g, "-")}">${term}</span>`;
        }
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
    if(!str) return "";
    return str.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}