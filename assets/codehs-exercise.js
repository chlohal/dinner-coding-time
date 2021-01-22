var editors = [];

for (var i = 0; ; i++) {
    var source = document.getElementById("source" + (i || ""));
    if (source != null) editors.push(makeEditor(source, i));
    else break;
}

function loadCodeIntelligence(override) {
    if(navigator.connection || override) {
        if (
            override ||
            ((navigator.connection.type != "bluetooth" && navigator.connection.type != "cellular") &&
            !navigator.connection.saveData)
        ) {
            loadDep("java-parser.js", function() {
                showAlert({
                    text: "Code Intelligence is loaded!",
                    duration: 800
                });
                startCodeIntelligence();
            });
            showAlert({
                text: "Loading Code Intelligence...",
                stopTimeout: true,
                inProgress: true
            });
        } else {
            showAlert({
                text: `Because you are in Data Saver mode, Code Intelligence will not be loaded.`,
                stopTimeout: true,
                color: "war",
                exitButton: true,
                actions: [
                    {
                        text: "Download Anyway",
                        action: function() {
                            loadCodeIntelligence(true);
                        }
                    }
                ]
            });
        }
    } else {
        showAlert({
            text: `There was a problem automatically detecting your connection info. Would you like to load Code Intelligence? These files are rather large (285kb), so we recommend that you not download on cell data.`,
            stopTimeout: true,
            color: "war",
            exitButton: true,
            actions: [
                {
                    text: "Always Download",
                    action: function() {
                        localStorage.setItem("override-data-saver", "1")
                        loadCodeIntelligence(true);
                    }
                },
                {
                    text: "Download",
                    action: function() {
                        loadCodeIntelligence(true);
                    }
                }
            ]
        });
    }
}

loadCodeIntelligence(+localStorage.getItem("override-data-saver"));


function startCodeIntelligence() {
    for(var i = 0; i < editors.length; i++) {
        if(editors[i].onLoadCodeIntelligence) editors[i].onLoadCodeIntelligence(window.parser.parse);
    }
}

function makeEditor(source, editorIndex) {
    editorIndex = +editorIndex;
    source.classList.add("lang-java");
    hljs.highlightBlock(source);

    var sourceContent = source.textContent;
    var sourceLinesHtml = source.innerHTML.split("\n");

    var main = document.querySelector("main");

    var table = makeNumberedLinesTable(sourceLinesHtml);
    

    var parent = document.createElement("div");
    parent.classList.add("code-with-lines--parent");
    parent.appendChild(table);

    var border = document.createElement("div");
    border.classList.add("code-with-lines--border-parent");
    border.appendChild(parent);

    var accordian = document.createElement("details");
    var accordianTitle = document.createElement("summary");
    var titleRegexp = (/public\s+class\s+(\w+)/).exec(source.textContent);
    var fileName = titleRegexp ? titleRegexp[1] + ".java" : source.textContent.substring(0, 200).replace(/\n/g, " ") + "...";
    accordianTitle.textContent = fileName

    if (accordianTitle.textContent.indexOf("Tester") == -1 || editorIndex == 0) accordian.open = true;

    accordian.appendChild(accordianTitle);
    accordian.appendChild(border);

    source.style.display = "none";
    main.appendChild(accordian);

    function onLoadCodeIntelligence(parse) {
        var ast;
        try {
            ast = parse(sourceContent);
        } catch(e) {
            showAlert({
                text: `Error in activating Code Intelligence on ${fileName}.`,
                exitButton: true
            });
        }
        window.ast = ast;
        console.log(ast);
    }

    var result = {
        overParent: accordian,
        source: sourceContent,
        index: editorIndex,
        table: table,
        file: fileName
    };

    result.onLoadCodeIntelligence = onLoadCodeIntelligence.bind(result);

    return result;
}

function makeNumberedLinesTable(htmlLines, table) {
    if(table === undefined) table = document.createElement("table");
    while(table.children[0]) table.removeChild(table.children[0]);
    table.classList.add("code-with-lines");

    var inThePadding = true;
    var contentLinesStart = 0;

    var paddingToRemove = 0;
    for (var i = 0; i < htmlLines.length; i++) {
        if (htmlLines[i].trim() != "") {
            paddingToRemove = /^\s*/.exec(htmlLines[i])[0].length;
            break;
        }
    }

    var endPaddingIndex = htmlLines.length - 1;

    for (var i = htmlLines.length - 1; i > 0; i--) {
        if (htmlLines[i].trim() == "") endPaddingIndex = i;
        else break;
    }

    inThePadding = true;


    for (var i = 0; i < endPaddingIndex; i++) {
        if (inThePadding && htmlLines[i].trim() == "") {
            continue;
        } else if (htmlLines[i].trim() != "") {
            inThePadding = false;
            if (contentLinesStart == 0) contentLinesStart = i;
        }

        var line = document.createElement("tr");

        var lineNum = document.createElement("th");
        var numSpan = document.createElement("span");
        numSpan.textContent = (i + 1 - contentLinesStart);
        lineNum.appendChild(numSpan);
        line.appendChild(lineNum);

        var lineContent = document.createElement("td");
        var lcCode = document.createElement("code");
        lcCode.innerHTML = htmlLines[i].substring(paddingToRemove);

        var indentLevel = /^\s*/.exec(lcCode.innerHTML)[0].length;
        lcCode.style.textIndent = -1 * indentLevel + "ch";
        lcCode.style.paddingInlineStart = indentLevel + "ch";

        lineContent.appendChild(lcCode);
        line.appendChild(lineContent);

        table.appendChild(line);
    }

    return table;
}


/**
 * @typedef {Object} StylingMode
 * @property {boolean} javaBracketsStyle Use Java-style brackets, with brackets on the same line. If false, it will go to C-style brackets. 
 * @property {string} indentBy The string to indent blocks by. Must be whitespace
 * @property {string} spaceAfterStatement Space to include after statements like `for`, but before their parameters.
 */
/**
 * Stringify a Java AST
 * @param {Object} ast The AST to stringify.
 * @param {StylingMode} style How the output should be styled.
 */
function astToString(ast, style) {
    if(!ast) return "";

    if(style === undefined) style = {};
    
    if(style.isSnippet) {
        ast = ast.types[0].declaration.body[0];
    }
    
    //copy in order to not modify original
    style = Object.assign({}, style);
    
    //default to 4-space styling
    if(style.indentBy === undefined) style.indentBy = "    ";
    
    //default to java-style spacing
    if(style.javaBracketsStyle === undefined) style.javaBracketsStyle = true;
    
    if(style.spaceAfterStatement === undefined) style.spaceAfterStatement = " ";
    
    
    var bracketTypes = ["\n", " "];
    

    switch(ast.type) {
        case "COMPILATION_UNIT":
            return (ast.package ? `${astToString(ast.package, style)};\n` : "") +
                ast.imports.map(function(x) { return astToString(x, style) + ";\n"})+
                ast.types.map(function(x) { return astToString(x, style) }).join(style.spaceBetweenClasses);
        case "PACKAGE_DECLARATION": 
            return "package " + astToString(ast.name, style);
        case "QUALIFIED_NAME":
            return ast.name.map(function(x) { return astToString(x, style); }).join(".");
        case "TYPE_DECLARATION":
        case "CLASS_BODY_MEMBER_DECLARATION":
            return ast.modifiers.map(function(x) { return astToString(x, style) + " " }).join("") +
                astToString(ast.declaration,style);
        case "CLASS_DECLARATION":
            return "class " + astToString(ast.name,style) + " " +
                (ast.extends ?  astToString(ast.extends,style) : "") + 
                (ast.implements ? astToString(ast.implements,style) : "") +
                (bracketTypes[+!!style.javaBracketsStyle]) +
                indent(astToString(ast.body,style), style.indentBy, style.javaBracketsStyle, true); //never indent last line, maybe indent first line depending on bracket style
        case "IDENTIFIER":
        case "MODIFIER":
        case "PRIMITIVE_TYPE":
        case "STRING_LITERAL":
        case "DECIMAL_LITERAL":
        case "CHAR_LITERAL":
            return ast.value;
        case "TYPE_LIST":
        case "QUALIFIED_NAME_LIST":
            return ast.list.map(function(x) { return astToString(x,style); }).join(", "); 
        case "CLASS_BODY":
            return  "{\n" + 
                ast.declarations.map(function(x) { return astToString(x,style); }).join("\n") + "\n}"; 
        case "FIELD_DECLARATION":
            return astToString(ast.typeType,style) + " " + astToString(ast.variableDeclarators,style) + ";";
        case "VARIABLE_DECLARATORS": 
            return ast.list.map(function(x) { return astToString(x,style); }).join(", ");
        case "VARIABLE_DECLARATOR":
            return astToString(ast.id,style) + 
                (ast.init ? " = " + astToString(ast.init,style) : "");
        case "VARIABLE_DECLARATOR_ID":
            return astToString(ast.id, style) + 
            ast.dimensions.map(function(x) { return astToString(x,style); }).join("");
        case "CONSTRUCTOR_DECLARATION":
            return astToString(ast.name,style) + " " + astToString(ast.parameters,style) + 
                (ast.throws ? " throws " + astToString(ast.throws) : "") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(astToString(ast.body,style), style.indentBy, style.javaBracketsStyle, true);
        case "METHOD_DECLARATION":
            return astToString(ast.name,style) + " " + astToString(ast.parameters,style) + 
                (ast.throws ? " throws " + astToString(ast.throws) : "") +
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(astToString(ast.body,style), style.indentBy, style.javaBracketsStyle, true);
        case "FORMAL_PARAMETERS":
            return "(" + ast.parameters.map(function(x) { return astToString(x,style); }).join(", ") + ")";
        case "FORMAL_PARAMETER":
            return ast.modifiers.map(function(x) { return astToString(x, style) + " " }).join("") + 
                astToString(ast.typeType, style) + " " + astToString(ast.id, style)
        case "BLOCK":
            return "{" + "\n" +
                ast.statements.map(function(x) { return astToString(x,style) + "\n"}).join("") + 
                "}"; 
        case "EXPRESSION_STATEMENT":
            return astToString(ast.expression, style) + ";";
        case "OPERATOR_EXPRESSION":
            return astToString(ast.left) + " " +
                astToString(ast.operator) + " " + 
                (ast.right ? astToString(ast.right) : "");
        case "OPERATOR":
            return ast.operator;
        case "SEMI_COLON_STATEMENT":
            return ";"
        case "LOCAL_VARIABLE_DECLARATION":
            return ast.modifiers.map(function(x) { return astToString(x, style) + " " }).join("") +
            astToString(ast.typeType, style) + " " + astToString(ast.declarators, style)
        case "RETURN_STATEMENT":
            return "return " + astToString(ast.expression, style) + ";";
        case "FOR_STATEMENT": 
            return "for"+(style.spaceAfterStatement)+"(" + astToString(ast.forControl, style) + ")" +
            bracketTypes[+!!style.javaBracketsStyle] + 
            indent(astToString(ast.body,style), style.indentBy, style.javaBracketsStyle, true);
        case "BASIC_FOR_CONTROL":
            return astToString(ast.forInit, style) + ";" + style.spaceAfterStatement + 
                astToString(ast.expression, style) + ";" + style.spaceAfterStatement +
                astToString(ast.expressionList, style);
        case "EXPRESSION_LIST":
            return ast.list.map(function(x) { return astToString(x, style) }).join("," + style.spaceAfterStatement);
        case "POSTFIX_EXPRESSION":
            return astToString(ast.expression, style) + ast.postfix;
        case "QUALIFIED_EXPRESSION":
            return astToString(ast.expression, style) + "." + astToString(ast.rest, style);
        case "METHOD_INVOCATION":
            return astToString(ast.name) + "(" + 
                astToString(ast.parameters, style) + ")";
        case "IF_STATEMENT":
            return "if" + style.spaceAfterStatement + "(" + astToString(ast.condition, style) + ")" + 
                bracketTypes[+!!style.javaBracketsStyle] + 
                indent(astToString(ast.body,style), style.indentBy, style.javaBracketsStyle, true) +
                (ast.else ? "\nelse " + astToString(ast.else,style) : ""); 
        default:
            console.log("unknown type " + ast.type);
            console.log(ast);
            return "";
    }
}

function indent(indentText, indentBy, dontIndentFirst, dontIndentLast) {
    var lines = indentText.split("\n");
    for(var i = 1; i < lines.length - +dontIndentLast; i++) lines[i] = indentBy + lines[i];
    return lines.join("\n");
}


function showAlert(opts) {
    if (opts === undefined) opts = {};
    var colors = {
        "suc": "#92D190",
        "err": "#DD8B8B",
        "war": "#FAB28E"
    };
    var elem = document.createElement("div");

    document.querySelectorAll(".alert").forEach(x => {
        x.parentElement.removeChild(x);
    });

    elem.classList.add("alert");
    if(opts.inProgress) elem.classList.add("progress")
    elem.style.borderColor = colors[opts.color] || colors.suc;
    elem.style.cursor = "default";

    elem.innerText = (opts.text || "");

    var snackbarActions = document.createElement("div");
    snackbarActions.classList.add("snackbar-actions");
    if (opts.actions) {
        for (let i = 0; i < opts.actions.length; i++) {
            let buttonElem = document.createElement("button");
            buttonElem.innerText = opts.actions[i].text;
            buttonElem.onclick = opts.actions[i].action;
            snackbarActions.appendChild(buttonElem);
        }
    }

    if (opts.exitButton) {
        let exitElem = document.createElement("button");
        exitElem.innerHTML = "Close" || opts.exitText;
        exitElem.onclick = function () {
            elem.parentElement.removeChild(elem);
        };
        snackbarActions.appendChild(exitElem);
    } else {
        elem.onclick = function () {
            elem.parentElement.removeChild(elem);
        };
    }

    elem.appendChild(snackbarActions);

    document.body.appendChild(elem);

    if (!opts.stopTimeout) {
        setTimeout(function () {
            try { document.body.removeChild(elem); } catch (e) { console.error(e); }
        }, opts.duration || 3000);
    }
}