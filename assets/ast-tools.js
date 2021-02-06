//if we're in a web worker
if(typeof importScripts === "function") {
    onmessage = function(event) {
        var data = event.data;

        if(data.function == "astToString") {
            postMessage({ 
                nonce: data.nonce,
                data: astToString(data.args[0], data.args[1])
            });
        }
    }
}

if(typeof window === "undefined") var window = {};


/**
 * @typedef {Object} StylingMode
 * @property {boolean} javaBracketsStyle Use Java-style brackets, with brackets on the same line. If false, it will go to C-style brackets. 
 * @property {string} indentBy The string to indent blocks by. Must be whitespace
 * @property {string} spaceAfterStatement Space to include after statements like `for`, but before their parameters.
 * @property {boolean} colorize Whether to colorize the output with HTML.
 * @property {boolean} removeComments Whether to remove comments or not.
 * @property {string} spaceInExpression Space to include inside expressions.
 * @property {boolean} leaveOffFloatSuffix Convert floats to doubles
 * @property {boolean} dontHighlightPairedChars Don't link block openers and parens with their counterpart closers.
 * @property {boolean} hideExplainations Don't display explaination tooltips on select syntax constructs.
 */
/**
 * Stringify a Java AST
 * @param {Object} ast The AST to stringify.
 * @param {StylingMode} style How the output should be styled.
 */
function astToString(ast, style, nodePath, siblingIndex, address) {
    if(!ast) return "";

    if(style === undefined) style = {};
    
    if(style.isSnippet && ast.type == "COMPILATION_UNIT") {
        ast = ast.types[0].declaration.body.declarations[0];
    }
    
    //copy in order to not modify original
    style = Object.assign({}, style);
    
    //default to 4-space styling
    if(style.indentBy === undefined) style.indentBy = "    ";
    
    //default to java-style spacing
    if(style.javaBracketsStyle === undefined) style.javaBracketsStyle = true;
    if(style.spaceAfterStatement === undefined) style.spaceAfterStatement = "";
    if(style.linesAfterImport === undefined) style.linesAfterImport = "\n";
    if(style.removeComments === undefined) style.removeComments = false;
    if(style.spaceInExpression === undefined) style.spaceInExpression = style.spaceAfterStatement;
    if(style.dontHighlightPairedChars === undefined) style.dontHighlightPairedChars = false;
    if(style.leaveOffFloatSuffix === undefined) style.leaveOffFloatSuffix = true;
    
    
    var bracketTypes = ["\n", " "];

    var isLeaf = 0;

    nodePath = (nodePath === undefined ? [] : nodePath).concat([{
        type: ast.type,
        idx: siblingIndex || 0
    }]);
    
    address = address === undefined ? [] : address;

    var pairedCharId = 0;
    function createPairedChar(char) {
        if(style.dontHighlightPairedChars) return char;

        var inOut = pairedCharId % 2;
        var index = Math.floor(pairedCharId/2);
        var res = `<span id="${address.join("-")}-${inOut?"out":"in"}-${index}" class="hlast hlast-pairedchar">${char}</span>`;
        pairedCharId++;
        return res;
    }

    function recurse(a) {
        if(typeof a === "string") a = [a];
        if(typeof a === "object" && a.constructor !== Array) return astToString(a, style, nodePath, isLeaf, address.concat(a));
        
        //find the object indicated by the path passed in
        var target = ast;
        for(var i = 0; i < a.length; i++) target = target[a[i]];
        
        isLeaf++;
        
        return astToString(target, style, nodePath, isLeaf, address.concat(a));
    }
    
    style.isDense = style.spaceAfterStatement == "dense";
    if(style.isDense) {
        style.spaceAfterStatement = "";
        style.indentBy = "";
    }
    

    var result = "";
    
    switch(ast.type || ast.ast_type) {
        case "COMPILATION_UNIT":
            result += (ast.package ? `${recurse("package")};\n` : "") +
                ast.imports.map(function(x,i) { return recurse(["imports", i]) + ";\n"}) +
                (ast.imports.length ? style.linesAfterImport : "") +
                ast.types.map(function(x,i) { return recurse(["types", i]) }).join(style.spaceBetweenClasses);
            break;
        case "PACKAGE_DECLARATION": 
            result += "package " + recurse("name");
            break;
        case "QUALIFIED_NAME":
            result += ast.name.map(function(x,i) { return recurse(["name", i]); }).join(".");
            break;
        case "TYPE_DECLARATION":
        case "CLASS_BODY_MEMBER_DECLARATION":
            ast.declaration.followedEmptyLine = false;
            result += ast.modifiers.map(function(x,i) { return recurse(["modifiers", i]) + " " }).join("") +
                recurse("declaration");
            break;
        case "CLASS_DECLARATION":
            result += (style.colorize ? "<span class=\"hlast hlast-keyword\">class</span> " : "class ") + recurse("name") +
                (ast.extends ?  recurse("extends") : "") + 
                (ast.implements ? recurse("implements") : "") +
                (bracketTypes[+!!style.javaBracketsStyle]) +
                indent(recurse("body"), style.indentBy, style.javaBracketsStyle, true); //never indent last line, maybe indent first line depending on bracket style
                break;
        case "COMMENT_STANDALONE":
            if(style.removeComments || style.isDense) break;
        case "IDENTIFIER":
        case "MODIFIER":
        case "PRIMITIVE_TYPE":
        case "STRING_LITERAL":
        case "BOOLEAN_LITERAL":
        case "DECIMAL_LITERAL":
        case "CHAR_LITERAL":
            result += ast.value;
            break;
        case "FLOAT_LITERAL":
            result += ast.value;
            if(!style.leaveOffFloatSuffix) result += (style.colorize ? "<span class=\"hlast hlast-float-literal-suffix\">f</span>" : "f");
            break;
        case "TYPE_LIST":
        case "QUALIFIED_NAME_LIST":
            result += ast.list.map(function(x,i) { return recurse(["list", i]); }).join(", ");
            break;
        case "CLASS_BODY":
            result +=  createPairedChar("{") + "\n" + 
                ast.declarations.map(function(x,i) { return recurse(["declarations", i]); }).join("\n") + "\n" +
                createPairedChar("}"); 
            break;
        case "FIELD_DECLARATION":
            result += recurse("typeType") + " " + recurse("variableDeclarators") + ";";
            break;
        case "VARIABLE_DECLARATORS": 
            result += ast.list.map(function(x,i) { return recurse(["list", i]); }).join(", ");
            break;
        case "VARIABLE_DECLARATOR":
            result += recurse("id") + 
                (ast.init ? style.spaceInExpression + recurse({type: "OPERATOR", operator: "="}) + style.spaceInExpression + recurse("init") : "");
            break;
        case "VARIABLE_DECLARATOR_ID":
            result += recurse("id") +
                ast.dimensions.map(function(x,i) { return recurse(["dimensions", i]); }).join("");
            break;
        case "CONSTRUCTOR_DECLARATION":
            result += recurse("name") + style.spaceAfterStatement + recurse("parameters") + 
                (ast.throws ? " throws " + recurse("throws") : "") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse("body"), style.indentBy, style.javaBracketsStyle, true);
            break;
        case "METHOD_DECLARATION":
            result += recurse("typeType") + 
                " " + recurse("name") + style.spaceAfterStatement + recurse("parameters") + 
                (ast.throws ? " throws " + recurse("throws") : "") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse("body"), style.indentBy, style.javaBracketsStyle, true);
            break;
        case "FORMAL_PARAMETERS":
            result += createPairedChar("(") + ast.parameters.map(function(x,i) { return recurse(["parameters", i]); }).join("," + style.spaceInExpression) + createPairedChar(")");
            break;
        case "FORMAL_PARAMETER":
            result += ast.modifiers.map(function(x,i) { return recurse(["modifiers", i]) + " " }).join("") + 
                recurse("typeType") + " " + recurse("id");
            break;
        case "BLOCK":
            result += createPairedChar("{") + "\n" +
                ast.statements.map(function(x,i) { return recurse(["statements", i]) + "\n"}).join("") + 
                createPairedChar("}"); 
            break;
        case "EXPRESSION_STATEMENT":
            result += recurse("expression") + ";";
            break;
        case "OPERATOR_EXPRESSION":
            return recurse("left") + style.spaceInExpression +
                recurse("operator") + style.spaceInExpression + 
                (ast.right ? recurse("right") : "");
            break;
        case "OPERATOR":
            result += ast.operator;
            break;
        case "SEMI_COLON_STATEMENT":
            result += ";"
            break;
        case "LOCAL_VARIABLE_DECLARATION":
            result += ast.modifiers.map(function(x,i) { return recurse(["modifiers", i]) + " " }).join("") +
                recurse("typeType") + " " + recurse("declarators");
            break;
        case "RETURN_STATEMENT":
            result += (style.colorize ? "<span class=\"hlast hlast-keyword\">return</span> " : "return ") + recurse("expression") + ";";
            break;
        case "FOR_STATEMENT": 
            result +=  (style.colorize ? "<span class=\"hlast hlast-keyword\">for</span>" : "for") +
                (style.spaceAfterStatement)+createPairedChar("(") + recurse("forControl") + createPairedChar(")") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse("body"), style.indentBy, style.javaBracketsStyle, true);
            break;
        case "BASIC_FOR_CONTROL":
            result += recurse("forInit") + ";" + style.spaceAfterStatement + 
                recurse("expression") + ";" + style.spaceAfterStatement +
                recurse("expressionList");
            break;
        case "EXPRESSION_LIST":
            result += ast.list.map(function(x,i) { return recurse(["list", i]) }).join("," + style.spaceAfterStatement);
            break;
        case "POSTFIX_EXPRESSION":
            result += recurse("expression") + ast.postfix;
            break;
        case "QUALIFIED_EXPRESSION":
            result += recurse("expression") + "." + recurse("rest");
            break;
        case "METHOD_INVOCATION":
            result += recurse("name") + createPairedChar("(") + 
                recurse("parameters") + createPairedChar(")");
                break;
        case "IF_STATEMENT":
            result += (style.colorize ? "<span class=\"hlast hlast-keyword\">if</span>" : "if") +
                style.spaceAfterStatement + createPairedChar("(") + recurse("condition") + createPairedChar(")") + 
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse("body"), style.indentBy, style.javaBracketsStyle, true) +
                (ast.else ? "\nelse " + recurse("else") : ""); 
            break;
        case "IF_ELSE_EXPRESSION":
            result += recurse("condition") + " ? " + recurse("if") + " : " + recurse("else");
            break;
        case "VOID":
            result += "void";
            break;
        case "THIS":
            result += "this";
            break;
        case "TYPE_TYPE":
            result += recurse("value") + 
            ast.dimensions.map(function(x,i) { return recurse(["dimensions", i]) }).join("");
            break;
        case "DIMENSION":
            result += style.colorize ? createPairedChar("[") + createPairedChar("]") : "[]";
            break;
        case "IMPORT_DECLARATION":
            result +=  (style.colorize ? "<span class=\"hlast hlast-keyword\">import</span> " : "import ") + 
                (ast.static ? "static " : "") +
                recurse("name");
            break;
        case "SIMPLE_CREATOR":
            result += (style.colorize ? "<span class=\"hlast hlast-keyword\">new</span> " : "new ") + recurse("name") + recurse("rest");
            break;
        case "IDENTIFIER_NAME":
            result += ast.elements.map(function(x,i) { return recurse(["elements", i]) }).join("," + style.spaceAfterStatement);
            break;
        case "IDENTIFIER_NAME_ELEMENT":
            result += recurse("id") + style.spaceAfterStatement + 
                (ast.typeArguments === undefined ? "" : "<" + ast.typeArguments.map(function(x,i) { return recurse(["typeArguments", i]); }).join("," + style.spaceInExpression) + ">");
            break;
        case "CLASS_CREATOR_REST":
            result += createPairedChar("(") + recurse("arguments") + createPairedChar(")");
            break;
        case "CAST_EXPRESSION":
            result +=  createPairedChar("(") + recurse("castType") + createPairedChar(")")  + recurse("expression");
            break;
        case "PREFIX_EXPRESSION":
            result += ast.prefix + recurse("expression");
            break;
        case "PAR_EXPRESSION":
            result += createPairedChar("(") + recurse("expression") + createPairedChar(")");
            break;
        case "comment":
            result += ast.value;
            if(ast.value.split("\n").length > 1 || ast.value.startsWith("//")) result += "\n";
            break;
        default:
            console.log("unknown type " + ast.type);
            console.log(ast);
            result += ""; 
    }if(style.isDense) result = result.trim();
    
    if(ast.followedEmptyLine) result += "\n";
    
    if(style.isDense) result = result.replace(/\n/g, "").trim();
    
    if(ast.comments && !style.isDense && !style.removeComments) {
        for(var i = 0; i < ast.comments.length; i++) {
            var formattedVal = recurse(["comments", i]);
            if(ast.comments[i].leading) result = formattedVal + result;
            else result += formattedVal;
        }
    }

    //only colorize single-line things bc that way it won't get messed up upon table-ifying
    if(style.colorize /*&& !isLeaf*/) {
        return result.split("\n").map(function(line) {
            return `<span class="hlast hlast-${snakeKebab(ast.type || ast.ast_type || "")}${generateDescribingClasses(result, siblingIndex)}" data-address=${address.join(".")} data-nodepath="${nodePath.map(function(x,i) { return snakeKebab(x.type || x.ast_type || "") }).join(" ") }">${(line)}</span>`;
        }).join("\n");
    }
    else {
        return result;
    }
}

function generateDescribingClasses(str, idx) {
    var classes = "";
    classes += " sibling-" + idx;
    if( /^[A-Z]/.test(str)) classes += " capitalized";
    return classes;
}

function snakeKebab(snake) {
    return snake.split("_").join("-").toLowerCase();
}

function indent(indentText, indentBy, dontIndentFirst, dontIndentLast) {
    var lines = indentText.split("\n");
    for(var i = 1; i < lines.length - +dontIndentLast; i++) lines[i] = indentBy + lines[i];
    return lines.join("\n");
}
