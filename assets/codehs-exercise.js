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

function makeNumberedLinesTable(htmlLines) {
    var table = document.createElement("table");
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


function astToString(ast, style) {
    if(!ast) return "";

    if(style.isSnippet) {
        ast = ast.types[0].declaration.body[0];
    }

    switch(ast.type) {
        case "COMPILATION_UNIT":
            return (ast.package ? `${astToString(ast.package, style)};\n` : "") +
                (ast.imports[0] ? ast.imports.map(function(x) { return astToString(x, style) }).join(";\n") + ";" : "") +
                ast.types.map(function(x) { return astToString(x, style) }).join(style.spaceBetweenClasses);
        case "PACKAGE_DECLARATION": 
            return "package " + astToString(ast.name, style);
        case "QUALIFIED_NAME":
            return ast.name.map(function(x) { return astToString(x, style); }).join(".");
        case "TYPE_DECLARATION":
            return ast.modifiers.map(function(x) { return astToString(x, style) + " " }).join("") +
                astToString(ast.declaration,style);
        case "CLASS_DECLARATION":
            return astToString(ast.name,style) + " " +
                (ast.extends ?  astToString(ast.extends,style) : "") + 
                (ast.implements ? astToString(ast.implements,style) : "") +
                style.bracketsStyle +
                astToString(ast.body,style);
        case "IDENTIFER":
            return ast.value;
        case "TYPE_LIST":
            return ast.list.map(function(x) { return astToString(x,style); }).join(", "); 
        

    }
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