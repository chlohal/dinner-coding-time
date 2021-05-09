//if we're in a web worker
if (typeof importScripts === "function") {
    onmessage = function (event) {
        var data = event.data;

        var fns = {
            astToString: function () {
                return postMessage({
                    nonce: data.nonce,
                    data: astToString(data.args[0], data.args[1], data.args[2], undefined, undefined, undefined, data.args[3], data.args[4], "")
                });
            },
            clearVariableRegistry: function () {
                return postMessage({
                    nonce: data.nonce,
                    data: clearVariableRegistry()
                });
            }
        };

        fns[data.function]();
    }
}

if (typeof window === "undefined") var window = {};

var globalVarRegistry = {};


function clearVariableRegistry() {
    var keys = Object.keys(globalVarRegistry);

    for (var i = 0; i < keys.length; i++) {
        delete globalVarRegistry[keys[i]];
    }

    return true;
}

/**
* @typedef {Object} StylingMode
* @property {boolean} javaBracketsStyle Use Java-style brackets, with brackets on the same line. If false, it will go to C-style brackets. 
* @property {string} indentBy The string to indent blocks by. Must be whitespace.
* @property {string} linesAfterImport The lines of empty space to put after import statements but before classes.
* @property {string} spaceAfterStatement Space to include after statements like `for`, but before their parameters.
* @property {boolean} colorize Whether to colorize the output with HTML.
* @property {boolean} removeComments Whether to remove comments or not.
* @property {string} spaceInExpression Space to include inside expressions.
* @property {boolean} leaveOffFloatSuffix Convert floats to doubles
* @property {boolean} dontHighlightPairedChars Don't link block openers and parens with their counterpart closers.
* @property {boolean} hideExplainations Don't display explaination tooltips on select syntax constructs.
* @property {string} ifElseNewline A whitespace string to put between the ends of `if` statements and their `else` statements
* @property {('source' | 'block' | 'line')} singleLineBlockBrackets How to treat single-line blocks that can have their brackets removed.
* @property {boolean} dontRegisterVariables
*/
/**
* Stringify a Java AST
* @param {Object} ast The AST to stringify.
* @param {StylingMode} style How the output should be styled.
*/
function astToString(ast, style, parentScope, nodePath, siblingIndex, address, parent, codeblockId, annotationConnectorId) {
    if (!ast) return "";

    if (parentScope === undefined) parentScope = [];
    if (style === undefined) style = {};
    if (codeblockId === undefined) codeblockId = Math.floor(Math.random() * 1000) + "-" + Date.now();
    if (parent === undefined) parent = {};

    if (style.isSnippet && ast.type == "COMPILATION_UNIT") {
        ast = ast.types[0].declaration.body.declarations[0];
    }

    //copy in order to not modify original
    style = Object.assign({}, style);

    //default to 4-space styling
    if (style.indentBy === undefined) style.indentBy = "    ";

    //default to java-style spacing
    if (style.javaBracketsStyle === undefined) style.javaBracketsStyle = true;
    if (style.spaceAfterStatement === undefined) style.spaceAfterStatement = "";
    if (style.linesAfterImport === undefined) style.linesAfterImport = "\n";
    if (style.removeComments === undefined) style.removeComments = false;
    if (style.spaceInExpression === undefined) style.spaceInExpression = style.spaceAfterStatement || " ";
    if (style.dontHighlightPairedChars === undefined) style.dontHighlightPairedChars = false;
    if (style.leaveOffFloatSuffix === undefined) style.leaveOffFloatSuffix = true;
    if (style.ifElseNewline === undefined) style.ifElseNewline = "\n";
    if (style.singleLineBlockBrackets === undefined) style.singleLineBlockBrackets = "block"


    var bracketTypes = ["\n", " "];

    var isLeaf = 0;

    nodePath = (nodePath === undefined ? [] : nodePath).concat([{
        type: ast.type,
        idx: siblingIndex || 0
    }]);

    address = address === undefined ? [] : address;

    var pairedCharId = 0;
    function createPairedChar(char) {
        if (style.dontHighlightPairedChars) return style.colorize ? encodeCharacterEntities(char) : char;
        if (!style.colorize) return char;

        var inOut = pairedCharId % 2;
        var index = Math.floor(pairedCharId / 2);
        var res = `<span id="codeblock-${codeblockId}-${address.join("-")}-${inOut ? "out" : "in"}-${index}" class="hlast hlast-pairedchar">${encodeCharacterEntities(char)}</span>`;
        pairedCharId++;
        return res;
    }

    var annotationConnectorIdChildIndex = 0;
    function recurse(a, n, sc) {
        if (typeof a === "string") a = [a];

        var newScope = parentScope;
        if (parentScope.real) newScope = parentScope.real;

        if (!style.dontRegisterVariables) {
            var nextScopeComponent = getScopeComponent(ast, address.concat(n ? a : [n]));
            newScope = newScope.concat([nextScopeComponent]);
            createScope(newScope);

            if (sc) sc.real = newScope;
        }

        if (typeof n == "number") annotationConnectorIdChildIndex++;

        if (typeof a === "object" && a.constructor !== Array) return astToString(
            a, style,
            (sc || newScope),
            nodePath, isLeaf, address.concat([n]), ast, codeblockId, annotationConnectorId + "," + (annotationConnectorIdChildIndex));

        //find the object indicated by the path passed in
        var target = ast;
        for (var i = 0; i < a.length; i++) target = target[a[i]];

        if (target) target.__parent__ = ast;


        if (typeof a[a.length - 1] == "number") annotationConnectorIdChildIndex++;
        isLeaf++;

        return astToString(target,
            style,
            sc || newScope,
            nodePath,
            isLeaf,
            address.concat(a),
            ast,
            codeblockId,
            annotationConnectorId + "," + (annotationConnectorIdChildIndex));
    }

    function conditionallyRemoveBracketsFromSingleLineBlocks(block) {
        var blockNorm = (block.type == "BLOCK" && block.statements.length == 1) ? block.statements[0] : block;

        //if-in-for, while-in-for, etc. should *always* be blocks for clarity.
        if ((blockNorm.type.includes("FOR") || blockNorm.type.includes("WHILE") || blockNorm.type.includes("IF"))
            && (ast.type.includes("FOR") || ast.type.includes("WHILE") || ast.type.includes("IF"))
            && ast.type != blockNorm.type) return { type: "BLOCK", statements: [blockNorm] };


        if (style.singleLineBlockBrackets == "source" || block.type == "IF_STATEMENT" || block.type == "FOR_STATEMENT" || block.type == "WHILE_STATEMENT") return block;
        else if (block.type != "BLOCK" && (style.singleLineBlockBrackets == "block")) return { type: "BLOCK", statements: [block] };
        else if ((block.statements && block.statements.length == 1) && style.singleLineBlockBrackets == "line") return block.statements[0];
        else return block;
    }

    style.isDense = style.spaceAfterStatement == "dense";
    if (style.isDense) {
        style.spaceAfterStatement = "";
        style.indentBy = "";
    }


    var result = "";

    switch (ast.type || ast.ast_type) {
        case "Program":
            result += ast.body.map(function (x, i) { return recurse(["body", i]); }).join("\n");
            break;
        case "FunctionDefinition":
            var funcName = astToString(ast.name, {
                colorize: false,
                dontHighlightPairedChars: true,
                dontRegisterVariables: true
            });
            parentScope.splice(1, 0, funcName); 

            result +=  (style.colorize ? "<span class=\"hlast hlast-keyword\">def</span> " : "def ") 
                + recurse("name") + style.spaceAfterStatement + recurse("parameters") + ":" + "\n" + recurse("body");
            break;
        case "Identifier":
            result += ast.value;
            break;
        case "Parameters":
            result += createPairedChar("(") + ast.params.map(function (x, i) { return recurse(["params", i]); }).join("") + createPairedChar(")");
            break;
        case "Suite":
            result += indent(ast.body.map(function (x, i) {
                var line;
                if (x.constructor == Array) line = recurse(["body", i, x.length - 1]);
                else line = recurse(["body", i, x.length - 1]);

                return line;
            }).join("\n"), style.indentBy, false, false);
            break;
        case "Arguments":
            result += ast.arguments.map(function (x, i) { return recurse(["arguments", i]); }).join("," + style.spaceInExpression);
            break;
        case "AssignmentExpressionStatement":
            result += recurse("expr") + style.spaceInExpression + recurse({ type: "Operator", value: "=" }, "_operator") + style.spaceInExpression + recurse("asgn");
            break;
        case "Argument":
            return recurse("arg");
        case "Value":
            result += recurse("value") + (ast.trailers ? ast.trailers.map(function(x,i) { return recurse(["trailers", i]); }).join("") : "");
            break;
        case "NumericLiteral":
            result += ast.value;
            break;
        case "ReturnStatement":
            result += (style.colorize ? "<span class=\"hlast hlast-keyword\">return</span>" : "return") + (ast.value ? " " + recurse("value") : "");
            break;
        case "ForStatement":
            result += (style.colorize ? "<span class=\"hlast hlast-keyword\">for</span> " : "for ") + recurse("vars")
                + (style.colorize ? " <span class=\"hlast hlast-keyword\">in</span> " : " in ") + recurse("inList") + ":" + "\n" 
                + recurse("body") + (ast.elseBlock ? 
                    "\n" + (style.colorize ? "<span class=\"hlast hlast-keyword\">else</span> " : "else") + ":" + "\n" + recurse("elseBlock")
                : "");
          break;
        case "ExprList":
            result += ast.list.map(function(x,i) { return recurse(["list", i]) }).join("," + style.spaceInExpression);
            break;
        case "OperatorExpression":
            result += recurse("left") + ast.right.map(function(x,i) { return recurse(["right", i]) }).join("");
            break;
        case "OperatorExpressionTail":
            result += style.spaceInExpression + recurse("operator") + style.spaceInExpression + recurse("value");
            break;
        case "Operator":
            result += ast.value
            break;
        case "TestList":
            result += ast.list.map(function(x,i) { return recurse(["list", i]) }).join("," + style.spaceInExpression);
            break;
        case "FunctionCallerParams":
            result += createPairedChar("(") + recurse("args") + createPairedChar(")")
            break;
        case "Arglist":
            result += ast.args.map(function(x,i) { return recurse(["args", i]) }).join("," + style.spaceInExpression);
            break;
        case "ExpressionStatement":
            result += recurse("expr");
            break;
        case "Comment":
            result += "#" + ast.comment;
            break;
        case "MultilineStringLiteral":
            result += createPairedChar('"""') + ast.value + createPairedChar('"""');
            break;
        case "UnaryOperator":
            result += ast.value + recurse("left");
            break;
        case "BLANK_LINE":
            break;
        default:
            console.log("unknown type " + ast.type + " at " + address.join("."));
            console.log(ast);
            result += "";
    }

    if (style.isDense) result = result.trim();
    if (ast.followedEmptyLine) result += "\n";
    if (style.isDense) result = result.replace(/\n/g, "").trim();



    var formattedRes = result;

    //only colorize single-line things bc that way it won't get messed up upon table-ifying
    if (style.colorize) {
        formattedRes = result.split("\n").map(function (line) {
            return `<span class="hlast hlast-${camelKebab(ast.type || ast.ast_type || "")}${generateDescribingClasses(result, siblingIndex)}" data-address=${address.join(".")} data-annotation-connector-id="0${annotationConnectorId.replace(/,$/, "")}" data-nodepath="${nodePath.map(function (x, i) { return camelKebab(x.type || x.ast_type || "") }).join(" ")}">${(line)}</span>`;
        }).join("\n");
    }

    if (ast.comments && !style.isDense && !style.removeComments) {
        for (var i = ast.comments.length - 1; i >= 0; i--) {
            var formattedVal = recurse(["comments", i]);
            if (ast.comments[i].leading) formattedRes = formattedVal + formattedRes;
            else formattedRes += formattedVal;
        }
    }

    return formattedRes;
}

function getAstJavaEquivType(ast, scope) {

}

function generateDescribingClasses(str, idx) {
    var classes = "";
    classes += " sibling-" + idx;
    if (/^[A-Z][a-z]/.test(str)) classes += " capitalized";
    if (/^[A-Z_]+$/.test(str)) classes += " uppercase";
    if (str.length == 1) classes += " singlechar";
    return classes;
}

function camelKebab(camel) {
    var words = [];
    var word = "";
    for(var i = 0; i < camel.length; i++) {
        if(camel.charAt(i).toUpperCase() == camel.charAt(i) && i > 0) {
            words.push(word);
            word = camel.charAt(i);
        } else {
            word += camel.charAt(i);
        }
    }
    words.push(word);
    return words.join("-").toLowerCase();
}

function indent(indentText, indentBy, dontIndentFirst, dontIndentLast) {
    var lines = indentText.split("\n");

    for (var i = +dontIndentFirst; i < lines.length - +dontIndentLast; i++) lines[i] = indentBy + lines[i];
    return lines.join("\n");
}

function undent(text) {
    return text.split("\n").map(function (x) { return x.trim() }).join("\n");
}

function getScopeComponent(ast, address) {
    switch (ast.type) {
        case "TYPE_DECLARATION":
            return "$" + ast.declaration.name.value;
        case "CONSTRUCTOR_DECLARATION":
            return "[constructor]" + "(" + ast.parameters.parameters.map(function (x) { return astToString(x.typeType, {}); }).join(",") + ")";
        case "METHOD_DECLARATION":
            return "." +
                ast.name.value + "(" + ast.parameters.parameters.map(function (x) { return astToString(x.typeType, {}); }).join(",") + ")";
        case "FOR_STATEMENT":
        case "IF_STATEMENT":
        case "WHILE_STATEMENT":
            var statementInsideBodyIndex = "";
            //start after type defs
            for (i = address.indexOf("statements"); i < address.length - 1; i++) {
                if (typeof address[i] === "number") statementInsideBodyIndex += "/" + address[i];
            }
            if (statementInsideBodyIndex == "") return "";
            else return statementInsideBodyIndex;
        default:
            return "";
    }
}

function createScope(newScope) {
    newScope = newScope.filter(function (x) { return x != "" });

    if (newScope.length == 0) return false;

    var target = globalVarRegistry;
    for (var i = 0; i < newScope.length; i++) {
        if (!target.children) target.children = {};
        if (!target.children[newScope[i]]) target.children[newScope[i]] = {};
        target = target.children[newScope[i]];
    }
}

function registerVariable(scope, varName, typeType, type) {
    scope = scope.filter(function (x) { return x != "" });

    var address = "", scopeKey = scope.join("");

    if (type == "class") address = scopeKey;
    else address = scopeKey + "." + varName;

    var target = globalVarRegistry;
    for (var i = 0; i < scope.length; i++) {
        if (!target.children[scope[i]]) target.children[scope[i]] = {};
        target = target.children[scope[i]];
    }

    if (type != "class") {
        if (!target.vars) target.vars = {};
        if (!target.vars[varName]) target.vars[varName] = {};
        target = target.vars[varName];
    }

    Object.assign(target, {
        name: varName,
        address: address,
        scope: scope,
        scopeKey: scope.join(""),
        typeType: typeType,
        type: type || "variable",
        privacy: "public" //TODO: implement
    });

    return target;
}

function getClassScope(currentScope, className) {
    for (var i = currentScope.length; i > 0; i--) {
        var scannedScope = currentScope.slice(0, i);

        var target = globalVarRegistry;
        for (var j = 0; j < scannedScope.length; j++) {
            target = target.children[scannedScope[j]];
        }

        if (!target.children) continue;
        console.info(target, className)
        if (target.children["$" + className]) return target.children["$" + className];
    }
    return null;
}

function getVariableScope(currentScope, varName) {
    currentScope = currentScope.filter(function (x) { return x != "" });

    for (var i = currentScope.length; i > 0; i--) {
        var scannedScope = currentScope.slice(0, i);

        var target = globalVarRegistry;
        for (var j = 0; j < scannedScope.length; j++) {
            target = target.children[scannedScope[j]];
        }

        if (!target) console.warn("unknown scope", currentScope, varName, globalVarRegistry);

        if (!target.vars) continue;
        if (varName) target = target.vars[varName]

        if (typeof target === "object") return target;
        else if (varName === "this" && currentScope[i - 1].startsWith("$")) return {
            scope: scannedScope,
            scopeKey: scannedScope.join(""),
            name: currentScope[i - 1],
            type: "class"
        }
    }
    return null;
}

function encodeCharacterEntities(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}