var source = document.getElementById("source");
source.classList.add("lang-java");
hljs.highlightBlock(source);
    
var sourceLines = source.innerHTML.split("\n");

var main = document.querySelector("main");

var table = document.createElement("table");
table.classList.add("code-with-lines");

var paddingToRemove = 0;
for(var i = 0; i < sourceLines.length; i++) {
    if(sourceLines[i].trim() != "") {
        paddingToRemove = /^\s*/.exec(sourceLines[i])[0].length;
        break;
    }
}

var inThePadding = true;
var contentLinesStart = 0;

var endPaddingIndex = sourceLines.length - 1;

for(var i = sourceLines.length - 1; i > 0; i--) {
    if(sourceLines[i].trim() == "") endPaddingIndex = i;
    else break;
}

inThePadding = true;

for(var i = 0; i < endPaddingIndex; i++) {
    if(inThePadding && sourceLines[i].trim() == "") {
        continue;
    } else if(sourceLines[i].trim() != "") {
        inThePadding = false;
        if(contentLinesStart == 0) contentLinesStart = i;
    }
    
    var line = document.createElement("tr");
    
    var lineNum = document.createElement("th");
    var numSpan = document.createElement("span");
    numSpan.textContent = (i+1-contentLinesStart);
    lineNum.appendChild(numSpan);
    line.appendChild(lineNum);
    
    var lineContent = document.createElement("td");
    var lcCode = document.createElement("code");
    lcCode.innerHTML = sourceLines[i].substring(paddingToRemove);
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

//source.innerHTML = "";
main.appendChild(border);