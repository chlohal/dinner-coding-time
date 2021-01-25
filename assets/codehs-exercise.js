var editors = [];
var editorsParent, editorsTablist, selectedTab, editorsTabsEmptyState;

(function createTabsParent() {
    var main = document.querySelector("main");

    var editorsTablistParent = document.createElement("div");
    editorsTablistParent.classList.add("editor-tabs--grandparent")

    editorsTablist = document.createElement("div");
    editorsTablist.classList.add("editor-tabs--tablist")
    editorsTablist.setAttribute("role", "tablist");
    editorsTablistParent.appendChild(editorsTablist);

    editorsParent = document.createElement("div");
    editorsParent.classList.add("editor-tabs--parent");
    editorsParent.innerHTML = `<div class="editor-tabs--emptystate"><h2>Nothing open!</h2><p>Select a file in the top to open it.</p></div>`;
    editorsTabsEmptyState = editorsParent.children[0];
    editorsTablistParent.appendChild(editorsParent);

    main.appendChild(editorsTablistParent);
})();

for (var i = 0; ; i++) {
    var source = document.getElementById("source" + (i || ""));
    if (source != null) editors.push(makeEditor(source, i));
    else break;
}

editorsTablist.lastElementChild.click();

function loadCodeIntelligence(override) {
    if(navigator.connection || override) {
        if (
            override ||
            ((navigator.connection.type != "bluetooth" && navigator.connection.type != "cellular") &&
            !navigator.connection.saveData)
        ) {
            for(var i = 0; i < editors.length; i++) {
                (function() {
                    var editor = editors[i];
                    if(editor.onLoadCodeIntelligence) requestAnimationFrame(function() {
                        editor.onStartLoadingCodeIntelligence();
                    });
                })()
            }
            loadDep(["java-parser.js", "explainer.js"], function() {
                showAlert({
                    text: "Code Intelligence is loaded!",
                    duration: 800
                });
                requestAnimationFrame(startCodeIntelligence);
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

    var table = makeNumberedLinesTable(sourceLinesHtml);
    

    var parent = document.createElement("div");
    parent.classList.add("code-with-lines--parent");
    parent.appendChild(table);

    var loader = document.createElement("div");
    loader.classList.add("code-with-lines--load-box");
    parent.appendChild(loader);

    //we'll add the SVG after the loader is attached, because it doesn't like it if we don't
    
    var border = document.createElement("div");
    border.classList.add("code-with-lines--border-parent");
    border.appendChild(parent);

    var tabTitle = document.createElement("button");
    var titleRegexp = (/public\s+class\s+(\w+)/).exec(source.textContent);
    var fileName = titleRegexp ? titleRegexp[1] + ".java" : source.textContent.substring(0, 200).replace(/\n/g, " ") + "...";
    tabTitle.innerHTML = `<span>${encodeCharacterEntities(fileName)}</span>`

    source.style.display = "none";
    appendTab(tabTitle, border);

    loader.innerHTML = `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z" fill="#ffffff" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>`;

    function onStartLoadingCodeIntelligence() {
        this.table.hidden = true;
        this.parent.classList.add("lines-of-code--loading");
    }

    function onLoadCodeIntelligence(parse) {
        this.table.hidden = false;
        this.parent.classList.remove("lines-of-code--loading");

        var ast;
        try {
            ast = parse(sourceContent);
        } catch(e) {
            showAlert({
                text: `Error in activating Code Intelligence on ${fileName}.`,
                exitButton: true
            });
            return;
        }

        window.ast = ast;
        var astSource = astToString(ast, {colorize: true});
        makeNumberedLinesTable(astSource.split("\n"), this.table);
        explainEditor(this);
    }

    var result = {
        parent: parent,
        source: sourceContent,
        index: editorIndex,
        table: table,
        file: fileName
    };

    result.onLoadCodeIntelligence = onLoadCodeIntelligence.bind(result);
    result.onStartLoadingCodeIntelligence = onStartLoadingCodeIntelligence.bind(result);

    return result;
}

function appendTab(tab, tabpanel) {
    var generatedId = "tab-" + (Math.round(Math.random() * 100)) + "-" + editorsParent.children.length;
    
    tab.id = generatedId;
    tabpanel.id = generatedId + "-panel";

    tab.setAttribute("tabindex", "0");
    tab.setAttribute("aria-controls", generatedId + "-panel");
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("role", "tab");

    tab.addEventListener("click", function() {
        if(editorsTabsEmptyState) {
            editorsParent.removeChild(editorsTabsEmptyState);
            editorsTabsEmptyState = undefined;
        }
        if(selectedTab) {
            selectedTab.setAttribute("aria-selected", "false");

            var selectedTabpanel = document.getElementById(selectedTab.getAttribute("aria-controls"));
            console.log(selectedTab, selectedTabpanel);
            selectedTabpanel.setAttribute("hidden", "true");
            selectedTabpanel.setAttribute("aria-hidden", "true");
        }

        tabpanel.removeAttribute("hidden");
        tabpanel.setAttribute("aria-hidden", "false");
        tab.setAttribute("aria-selected", "true");
        selectedTab = tab;
    });

    editorsTablist.appendChild(tab);

    tabpanel.setAttribute("aria-hidden", "true");
    tabpanel.setAttribute("aria-labelledby", generatedId);
    tabpanel.setAttribute("role", "tabpanel");
    tabpanel.setAttribute("hidden", "true");

    editorsParent.appendChild(tabpanel);
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

    var endPaddingIndex = htmlLines.length;

    for (var i = htmlLines.length - 1; i > 0; i--) {
        if (htmlLines[i].match(/^\s+$/g)) endPaddingIndex = i+1;
        else break;
    }

    inThePadding = true;


    for (var i = 0; i < endPaddingIndex; i++) {
        if (inThePadding && htmlLines[i].match(/^\s+$/)) {
            continue;
        } else if (htmlLines[i].match(/^\s+$/)) {
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
    
    if(style.isSnippet) {
        ast = ast.types[0].declaration.body[0];
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

    nodePath = (nodePath === undefined ? [] : nodePath).concat([ast.type]);

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
            result =  "{\n" + 
                ast.declarations.map(function(x) { return recurse(x); }).join("\n") + "\n}"; 
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
            result = "(" + ast.parameters.map(function(x) { return recurse(x); }).join(", ") + ")";
            break;
        case "FORMAL_PARAMETER":
            result = ast.modifiers.map(function(x) { return recurse(x) + " " }).join("") + 
                recurse(ast.typeType) + " " + recurse(ast.id);
            break;
        case "BLOCK":
            result = "{" + "\n" +
                ast.statements.map(function(x) { return recurse(x) + "\n"}).join("") + 
                "}"; 
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
                (style.spaceAfterStatement)+"(" + recurse(ast.forControl) + ")" +
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
            result = recurse(ast.name) + "(" + 
                recurse(ast.parameters) + ")";
                break;
        case "IF_STATEMENT":
            result = "if" + style.spaceAfterStatement + "(" + recurse(ast.condition) + ")" + 
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
            result = "(" + recurse(ast.arguments) + ")";
            break;
        case "CAST_EXPRESSION":
            return "(" + recurse(ast.castType) + ")"  + recurse(ast.expression);
        default:
            console.log("unknown type " + ast.type);
            console.log(ast);
            result = ""; 
    }

    //only colorize single-line things bc that way it won't get messed up upon table-ifying
    if(style.colorize && !isLeaf) return `<span class="hlast hlast-${snakeKebab(ast.type)}${generateDescribingClasses(result, siblingIndex)}" data-nodepath="${nodePath.map(function(x) { return snakeKebab(x) }).join(" ") }">${encodeCharacterEntities(result)}</span>`;
    else return result;
}

function generateDescribingClasses(str, idx) {
    var classes = "";
    classes += " sibling-" + idx;
    if( /^[A-Z]/.test(str)) classes += " capitalized";
    return classes;
}

function encodeCharacterEntities(str) {
    return str.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function snakeKebab(snake) {
    return snake.split("_").join("-").toLowerCase();
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