
function getLineAddresses(source) {
    var lexed = lexJava(source);
    var lexedLines = lexed.split("\n");
    var linesResult = [];
    for(var i = 0; i < lexedLines.length; i++) {
        var lastIndexOfAddressKey = lexedLines[i].lastIndexOf("data-address=");
        if(lastIndexOfAddressKey == -1) {
            linesResult.push("");
            continue;
        }

        //displace by 1 to shift over the opening quote
        var addressValueStartIndex = lastIndexOfAddressKey + ("data-address=".length + 1);
        var address = "";
        for(var j = addressValueStartIndex; lexedLines[i].charAt(j) != "\""; j++) {
            address += lexedLines[i].charAt(j);
        }
        linesResult.push(address);
    }

    return linesResult;
}


var keywordContexts = {
    "class": "keyword",
    "public": "keyword",
    "static": "keyword",
    
    "public": "modifier",
    "private": "modifier",

    "void": "void",
    "new": "new",
    "this": "this",
    "super": "this",
    "null": "null",

    "for": "keyword",
    "if": "keyword",
    "else": "keyword",
    "while": "keyword",
    "return": "keyword",
    "import": "keyword",
    "break": "keyword",
    "continue": "keyword",
    "try": "keyword",
    "catch": "keyword",

    "int": "primitive-type",
    "char": "primitive-type",
    "boolean": "primitive-type",
    "double": "primitive-type",
    "long": "primitive-type",
    "short": "primitive-type"
}

var startingChars = {
    "LINE_COMMENT": "/",
    "COMMENT": "/",
    "STRING_LITERAL": "\""
}

function lexJava(src, markLines) {
    var result = "";
    var context = "BASE";
    var term = "";
    
    var counters = {
        statement: [0],
        activeCounter: 0
    }
    
    var parenDepth = 0;
    

    for(var j = 0; j < src.length; j++) {
        var char = src.charAt(j);
        switch(context) {
            case "BASE": 
                if(isAlphaNumeric(char)) {
                    term += char;
                } else { 
                    if(keywordContexts.hasOwnProperty(term)) {
                        result += `<span class="${markLines===false?"":"hlast-verification-term "}hlast-${keywordContexts[term]}">${term}</span>`;
                    } else if(term.match(/^-?[\d.]+$/)) {
                        result += `<span class="${markLines===false?"":"hlast-verification-term "}hlast-decimal-literal">${term}</span>`;
                    } else if(isCapitalized(term)) {
                        result += `<span class="${markLines===false?"":"hlast-verification-term "}hlast-type-type">${term}</span>`;
                    } else if(term.trim() != "") {
                        result += `<span class="${markLines===false?"":"hlast-verification-term"}">${term}</span>`;
                    } else {
                        result += term;
                    }
                    
                    term = "";

                    if(char == "\"") {
                        result += term;
                        term = "\"";
                        context = "STRING_LITERAL";
                    } else if(char == "/" && src.charAt(j+1) == "/") {
                        result += term;
                        term = "/";
                        context = "LINE_COMMENT";
                    } else if(char == "/" && src.charAt(j+1) == "*") {
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
                if(src.charAt(j - 1) == "*" && char == "/") {
                    context = "BASE";
                    result += `<span class="hlast-comment">${term}/</span>`;
                    term = "";
                } else {
                    term += char;
                }
            break;
        }
        
        if(context == "BASE" && char == "(") parenDepth++;
        else if(context == "BASE" && char == ")") parenDepth--;
        
        if(context == "BASE") {
            if(char == ";" && parenDepth == 0) {
                counters.statement[counters.activeCounter]++;
            } else if(char == "{") {
                counters.activeCounter++;
                while(counters.activeCounter >= counters.statement.length) counters.statement.push(0);
                
            } else if(char == "}") {
                counters.statement.splice(counters.activeCounter, counters.statement.length - counters.activeCounter);
                counters.activeCounter--;
                counters.statement[counters.activeCounter]++;
            }
        }
        
        
        if(markLines !== false && j == 0 || src.charAt(j - 1) == "\n" || (context == "BASE" && char == "}")) {
            result += `<span class="hlast-linemarker" data-address="${counters.statement.join(",")}"></span>`;
        }

        if(char == "\n" && context != "BASE") {
            result += `<span class="hlast-${context.toLowerCase().replace(/_/g, "-")}">${term}</span>`;
            term =  "";
        }
        

        if(j + 1 == src.length) {
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