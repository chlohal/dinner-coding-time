var parserTools = require("./parser-tools.js");

function parseJava(src) {
    var uncommented = parserTools.stripComments(src, {
        line: "//",
        start: "/*",
        end: "*/"
    });

    var program = {
        package: "default",
        imports: [],
        classes: []
    }

    //okay to not use the parserTools version because package and imports won't have arbitrary strings
    var programSegments = parserTools.groupAwareSplit(uncommented, [";", "}"]);
    console.log(programSegments);
    var contentIndex = -1;

    for (var i = 0; i < programSegments.length; i++) {
        if (programSegments[i].trim() == "") continue;
        contentIndex++;

        var header = parseBlockHeader(programSegments[i]);
        console.log(header);
        if (header.type == "package") {
            program.package = header.name;
        }
        if (header.type == "import") {
            program.imports.push(header);
        }
        if (header.type == "class") {
            var classContent = parseClass(programSegments[i], `${program.package}.${header.name}`);
            program.classes.push({
                header: header,
                methods: classContent.methods,
                fields: classContent.fields
            });
        }

    }
    
    return program;
}

var JAVA_HEADER_KEYWORDS = ["static", "protected", "public", "private", "abstract", "synchronized", 
                            "volatile", "transient", "throws", "strictfp", "requires", "native", "final",
                            "implements", "extends"];

function parseClass(classDefinition, className) {
    var bodyIndexStart = classDefinition.indexOf("{");
    var classBody = classDefinition.substring(bodyIndexStart);
    
    var statements = parserTools.groupAwareSplit(classBody, [";", "}"]);
    
    var result = {
        fields: [],
        methods: []
    }
    
    for(var i = 0; i < statements.length; i++) {
        //methods
        if(parserTools.findUngroupedSubstring(statements[i], "(") != -1) {
            
        } else {
        //field definitions
            var header = parseBlockHeader(statements[i]);
            
        }
    }
}
                            
function parseBlockHeader(bh) {
    var headEnd = bh.indexOf("{");
    if (headEnd == -1) headEnd = bh.length;
    var head = bh.substring(0, headEnd);

    var split = parserTools.groupAwareSplit(head, " ");

    var tokens = split.filter(function (x) { return x != "" });
    console.log(tokens);

    var result = {
        modifiers: [],
        type: "",
        name: "",
        returns: "",
        implements: [],
        extends: "",
        throws: [],
        arguments: []
    }
    for (var i = 0; i < tokens.length; i++) {
        switch(tokens[i]) {
            case "extends":
                i++;
                if(tokens[i]) result.extends = tokens[i];
            break;
            case "implements":
                i++;
                if(tokens[i]) result.inherits.push(tokens[i]);
            break;
            case "package":
                result.type = "package";
                i++;
                if(tokens[i]) result.name = (tokens[i]);
            break;
            case "import":
                result.type = "import";
                i++;
                if(tokens[i]) result.name = (tokens[i]);
            break;
            case "class":
                result.type = "class";
                i++;
                if(tokens[i]) result.name = (tokens[i]);
            break;
            case "throws":
                result.type = "throws";
                i++;
                if(tokens[i]) result.throws.push(tokens[i]);
            break;
            default:
                if(JAVA_HEADER_KEYWORDS.includes(tokens[i])) result.modifiers.push(tokens[i]);
                else if(result.returns == "") result.returns = tokens[i];
                else if(result.name == "") result.name = tokens[i];
                
                if(tokens[i].endsWith(")")) {
                    result.type = "method";
                    
                    var argumentsStartIndex = tokens[i].indexOf("(");
                    result.name = tokens[i].substring(0, argumentsStartIndex).trim();
                    
                    //get the `float a, float b`-like code-- inside the parentheses.
                    var argumentsSrc = tokens[i].substring(argumentsStartIndex, tokens[i].length - 1);
                    
                    var arguments = parserTools.groupAwareSplit(argumentsSrc, ",");
                    for(var j = 0; j < arguments.length; i++) {
                        var words = arguments[j].split(" ");
                        result.arguments.push({
                            name: words[words.length - 1],
                            type: parseType(words.slice(0, -1))
                        })
                    }
                }
        }
    }
    if(result.type == "") result.type = "definition";
    
    return result;
}

function parseType(type) {
    type = type.replace(/\s/g, "");
    
    if(type.endsWith("[]")) {
        return {
            type: "array",
            content: parseType(type.substring(0, type.length - 2));
        }
    } else if() {
        
    }
}