
/**
 * @typedef {Object} StylingMode
 * @property {boolean} javaBracketsStyle Use Java-style brackets, with brackets on the same line. If false, it will go to C-style brackets. 
 * @property {string} indentBy The string to indent blocks by. Must be whitespace
 * @property {string} spaceAfterStatement Space to include after statements like `for`, but before their parameters.
 * @property {boolean} breaks Whether to forcefully indicate word breaks with HTML or not.
 * @property {boolean} colorize Whether to colorize the output with HTML.
 */
/**
 * Stringify a Java AST
 * @param {Object} ast The AST to stringify.
 * @param {StylingMode} style How the output should be styled.
 */
function astToString(ast, style, nodePath, siblingIndex) {
    if(!ast) return "";

    if(style === undefined) style = {};
    
    if(style.isSnippet && ast.type == "COMPILATION_UNIT") {
        console.log(ast);
        ast = ast.types[0].declaration.body.declarations[0];
        console.log(ast);
    }
    
    //copy in order to not modify original
    style = Object.assign({}, style);
    
    //default to 4-space styling
    if(style.indentBy === undefined) style.indentBy = "    ";
    
    //default to java-style spacing
    if(style.javaBracketsStyle === undefined) style.javaBracketsStyle = true;
    if(style.spaceAfterStatement === undefined) style.spaceAfterStatement = "";
    if(style.linesAfterImport === undefined) style.linesAfterImport = "\n";
    
    
    var bracketTypes = ["\n", " "];

    var isLeaf = 0;

    nodePath = (nodePath === undefined ? [] : nodePath).concat([{
        type: ast.type,
        idx: siblingIndex || 0
    }]);

    var pairedCharId = 0;
    function createPairedChar(char) {
        var inOut = pairedCharId % 2;
        var index = Math.floor(pairedCharId/2);
        var res = `<span id="${nodePath.map(function(x) { return x.type + x.idx }).join("")}-${inOut?"out":"in"}-${index}" class="hlast hlast-pairedchar">${char}</span>`;
        pairedCharId++;
        return res;
    }

    function recurse(a) {
        isLeaf++;
        return astToString(a, style, nodePath, isLeaf);
    }
    

    var result = "";
    switch(ast.type) {
        case "COMPILATION_UNIT":
            result = (ast.package ? `${recurse(ast.package)};\n` : "") +
                ast.imports.map(function(x) { return recurse(x) + ";\n"}) +
                (ast.imports.length ? style.linesAfterImport : "") +
                ast.types.map(function(x) { return recurse(x) }).join(style.spaceBetweenClasses);
            break;
        case "PACKAGE_DECLARATION": 
            result = "package " + recurse(ast.name);
            break;
        case "QUALIFIED_NAME":
            result = ast.name.map(function(x) { return recurse(x); }).join(".");
            break;
        case "TYPE_DECLARATION":
        case "CLASS_BODY_MEMBER_DECLARATION":
            result = ast.modifiers.map(function(x) { return recurse(x) + " " }).join("") +
                recurse(ast.declaration);
            break;
        case "CLASS_DECLARATION":
            result = (style.colorize ? "<span class=\"hlast hlast-keyword\">class</span> " : "class ") + recurse(ast.name) +
                (ast.extends ?  recurse(ast.extends) : "") + 
                (ast.implements ? recurse(ast.implements) : "") +
                (bracketTypes[+!!style.javaBracketsStyle]) +
                indent(recurse(ast.body), style.indentBy, style.javaBracketsStyle, true); //never indent last line, maybe indent first line depending on bracket style
                break;
        case "IDENTIFIER":
        case "MODIFIER":
        case "PRIMITIVE_TYPE":
        case "STRING_LITERAL":
        case "BOOLEAN_LITERAL":
        case "DECIMAL_LITERAL":
        case "CHAR_LITERAL":
            result = ast.value;
            break;
        case "TYPE_LIST":
        case "QUALIFIED_NAME_LIST":
            result = ast.list.map(function(x) { return recurse(x); }).join(", ");
            break;
        case "CLASS_BODY":
            result =  createPairedChar("{") + "\n" + 
                ast.declarations.map(function(x) { return recurse(x); }).join("\n") + "\n" +
                createPairedChar("}"); 
            break;
        case "FIELD_DECLARATION":
            result = recurse(ast.typeType) + " " + recurse(ast.variableDeclarators) + ";";
            break;
        case "VARIABLE_DECLARATORS": 
            result = ast.list.map(function(x) { return recurse(x); }).join(", ");
            break;
        case "VARIABLE_DECLARATOR":
            result = recurse(ast.id) + 
                (ast.init ? " " + recurse({type: "OPERATOR", operator: "="}) + " " + recurse(ast.init) : "");
            break;
        case "VARIABLE_DECLARATOR_ID":
            result = recurse(ast.id) + 
                ast.dimensions.map(function(x) { return recurse(x); }).join("");
            break;
        case "CONSTRUCTOR_DECLARATION":
            result = recurse(ast.name) + " " + recurse(ast.parameters) + 
                (ast.throws ? " throws " + recurse(ast.throws) : "") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse(ast.body), style.indentBy, style.javaBracketsStyle, true);
            break;
        case "METHOD_DECLARATION":
            result = recurse(ast.typeType) + 
                " " + recurse(ast.name) + style.spaceAfterStatement + recurse(ast.parameters) + 
                (ast.throws ? " throws " + recurse(ast.throws) : "") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse(ast.body), style.indentBy, style.javaBracketsStyle, true);
            break;
        case "FORMAL_PARAMETERS":
            result = createPairedChar("(") + ast.parameters.map(function(x) { return recurse(x); }).join(", ") + createPairedChar(")");
            break;
        case "FORMAL_PARAMETER":
            result = ast.modifiers.map(function(x) { return recurse(x) + " " }).join("") + 
                recurse(ast.typeType) + " " + recurse(ast.id);
            break;
        case "BLOCK":
            result = createPairedChar("{") + "\n" +
                ast.statements.map(function(x) { return recurse(x) + "\n"}).join("") + 
                createPairedChar("}"); 
            break;
        case "EXPRESSION_STATEMENT":
            result = recurse(ast.expression) + ";";
            break;
        case "OPERATOR_EXPRESSION":
            return recurse(ast.left) + " " +
                recurse(ast.operator) + " " + 
                (ast.right ? recurse(ast.right) : "");
            break;
        case "OPERATOR":
            result = ast.operator;
            break;
        case "SEMI_COLON_STATEMENT":
            result = ";"
            break;
        case "LOCAL_VARIABLE_DECLARATION":
            result = ast.modifiers.map(function(x) { return recurse(x) + " " }).join("") +
                recurse(ast.typeType) + " " + recurse(ast.declarators);
            break;
        case "RETURN_STATEMENT":
            result = (style.colorize ? "<span class=\"hlast hlast-keyword\">return</span> " : "return ") + recurse(ast.expression) + ";";
            break;
        case "FOR_STATEMENT": 
            result =  (style.colorize ? "<span class=\"hlast hlast-keyword\">for</span>" : "for") +
                (style.spaceAfterStatement)+createPairedChar("(") + recurse(ast.forControl) + createPairedChar(")") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse(ast.body), style.indentBy, style.javaBracketsStyle, true);
            break;
        case "BASIC_FOR_CONTROL":
            result = recurse(ast.forInit) + ";" + style.spaceAfterStatement + 
                recurse(ast.expression) + ";" + style.spaceAfterStatement +
                recurse(ast.expressionList);
            break;
        case "EXPRESSION_LIST":
            result = ast.list.map(function(x) { return recurse(x) }).join("," + style.spaceAfterStatement);
            break;
        case "POSTFIX_EXPRESSION":
            result = recurse(ast.expression) + ast.postfix;
            break;
        case "QUALIFIED_EXPRESSION":
            result = recurse(ast.expression) + "." + recurse(ast.rest);
            break;
        case "METHOD_INVOCATION":
            result = recurse(ast.name) + createPairedChar("(") + 
                recurse(ast.parameters) + createPairedChar(")");
                break;
        case "IF_STATEMENT":
            result = (style.colorize ? "<span class=\"hlast hlast-keyword\">if</span>" : "if") +
                style.spaceAfterStatement + createPairedChar("(") + recurse(ast.condition) + createPairedChar(")") + 
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(recurse(ast.body), style.indentBy, style.javaBracketsStyle, true) +
                (ast.else ? "\nelse " + recurse(ast.else) : ""); 
            break;
        case "VOID":
            result = "void";
            break;
        case "TYPE_TYPE":
            result = recurse(ast.value) + 
            ast.dimensions.map(function(x) { return recurse(x) }).join("");
            break;
        case "DIMENSION":
            result = "[]";
            break;
        case "IMPORT_DECLARATION":
            result =  (style.colorize ? "<span class=\"hlast hlast-keyword\">import</span> " : "import ") + 
                (ast.static ? "static " : "") +
                recurse(ast.name);
            break;
        case "SIMPLE_CREATOR":
            result = (style.colorize ? "<span class=\"hlast hlast-keyword\">new</span> " : "new ") + recurse(ast.name) + recurse(ast.rest);
            break;
        case "IDENTIFIER_NAME":
            result = ast.elements.map(function(x) { return recurse(x) }).join("," + style.spaceAfterStatement);
            break;
        case "IDENTIFIER_NAME_ELEMENT":
            result = recurse(ast.id) + style.spaceAfterStatement + 
                (ast.typeArguments === undefined ? "" : "<" + ast.typeArguments.map(function(x) { return recurse(x); }).join(", ") + ">");
            break;
        case "CLASS_CREATOR_REST":
            result = createPairedChar("(") + recurse(ast.arguments) + createPairedChar(")");
            break;
        case "CAST_EXPRESSION":
            result =  createPairedChar("(") + recurse(ast.castType) + createPairedChar(")")  + recurse(ast.expression);
            break;
        case "PREFIX_EXPRESSION":
            result = ast.prefix + recurse(ast.expression);
            break;
        case "PAR_EXPRESSION":
            result = createPairedChar("(") + recurse(ast.expression) + createPairedChar(")");
            break;
        default:
            console.log("unknown type " + ast.type);
            console.log(ast);
            result = ""; 
    }

    //only colorize single-line things bc that way it won't get messed up upon table-ifying
    if(style.colorize && !isLeaf) return `<span class="hlast hlast-${snakeKebab(ast.type)}${generateDescribingClasses(result, siblingIndex)}" data-nodepath="${nodePath.map(function(x) { return snakeKebab(x.type) }).join(" ") }">${(result)}</span>`;
    else return result;
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