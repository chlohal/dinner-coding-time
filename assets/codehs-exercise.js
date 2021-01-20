for(var i = 0; ; i++) {
    var source = document.getElementById("source" + (i || ""));
    if(source != null) makeEditor(source,i);
    else break;
}

loadDep("jparse-bundle.js");


function makeEditor(source,editorIndex) {
    editorIndex = +editorIndex;
    source.classList.add("lang-java");
    hljs.highlightBlock(source);

    var sourceLines = source.innerHTML.split("\n");

    var main = document.querySelector("main");

    var table = document.createElement("table");
    table.classList.add("code-with-lines");

    var paddingToRemove = 0;
    for (var i = 0; i < sourceLines.length; i++) {
        if (sourceLines[i].trim() != "") {
            paddingToRemove = /^\s*/.exec(sourceLines[i])[0].length;
            break;
        }
    }

    var inThePadding = true;
    var contentLinesStart = 0;

    var endPaddingIndex = sourceLines.length - 1;

    for (var i = sourceLines.length - 1; i > 0; i--) {
        if (sourceLines[i].trim() == "") endPaddingIndex = i;
        else break;
    }

    inThePadding = true;

    for (var i = 0; i < endPaddingIndex; i++) {
        if (inThePadding && sourceLines[i].trim() == "") {
            continue;
        } else if (sourceLines[i].trim() != "") {
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
        lcCode.innerHTML = sourceLines[i].substring(paddingToRemove);
        
        var indentLevel = /^\s*/.exec(lcCode.innerHTML)[0].length;
        lcCode.style.textIndent = -1*indentLevel + "ch";
        lcCode.style.paddingInlineStart = indentLevel + "ch";
        
        lineContent.appendChild(lcCode);
        line.appendChild(lineContent);

        table.appendChild(line);
    }

    var parent = document.createElement("div");
    parent.classList.add("code-with-lines--parent");
    parent.appendChild(table);

    var border = document.createElement("div");
    border.classList.add("code-with-lines--border-parent");
    border.appendChild(parent);
    
    var accordian = document.createElement("details");
    var accordianTitle = document.createElement("summary");
    var titleRegexp = (/public\s+class\s+(\w+)/).exec(source.textContent);
    if(titleRegexp) accordianTitle.textContent = titleRegexp[1] + ".java";
    else accordianTitle.textContent = source.textContent.substring(0,200).replace(/\n/g, " ");
    
    if(accordianTitle.textContent.indexOf("Tester") == -1 || editorIndex == 0) accordian.open = true;
    
    accordian.appendChild(accordianTitle);
    accordian.appendChild(border);

    source.style.display = "none";
    main.appendChild(accordian);
}