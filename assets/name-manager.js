


//initiate nameManager 
var nameManagerButton = document.createElement("button");
nameManagerButton.textContent = "Name Manager";

var nameManager = document.createElement("div");
nameManager.classList.add("name-manager-tab");

var nameManagerHeading = document.createElement("h2");
nameManagerHeading.textContent = "Name Manager";
nameManager.appendChild(nameManagerHeading);

var nameManagerDesc = document.createElement("p");
nameManagerDesc.textContent = "Quickly rename this file's variables";
nameManager.appendChild(nameManagerDesc);

appendToolTab(nameManagerButton, nameManager);
nameManagerButton.click();

window.loadNameManager = function loadNameManager(editor) {
    clearElem(nameManager, 2);
    
    var variables = editor.table.querySelectorAll(".hlast--variable-definition-identifier");

    for(var i = 0; i < variables.length; i++) {
        addVariableToManager(editor, variables[i]);
    }
}

function addVariableToManager(editor, variable) {

    var parent = document.createElement("div");
    
    var name = document.createElement("label");
    
    var nameHead =  document.createElement("h3");

    var namePath = variable.getAttribute("data-variable-address");
    var namePathFolder = namePath.substring(0, namePath.lastIndexOf("."))  + ".";

    var variableReferences = editor.table.querySelectorAll(`[data-variable-address='${namePath}'`);

    if(namePathFolder.length > 40) namePathFolder = "\u2026" + namePathFolder.substring(namePathFolder.length - 39);
    
    var nameHeadWidthDeterminor = document.createElement("span");
    nameHeadWidthDeterminor.setAttribute("aria-hidden", true);
    nameHeadWidthDeterminor.style.opacity = 0;
    nameHeadWidthDeterminor.textContent = namePathFolder;
    nameHead.appendChild(nameHeadWidthDeterminor);

    var nameHeadContentWrap = document.createElement("span");
    nameHeadContentWrap.textContent = namePathFolder;
    nameHeadContentWrap.classList.add("content-left-side-elipsis-wrap");

    nameHead.appendChild(nameHeadContentWrap);
    
    var nameHeadJumpLink = document.createElement("a");
    nameHeadJumpLink.appendChild(nameHead);
    name.appendChild(nameHeadJumpLink);

    nameHeadJumpLink.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();

        variable.tabIndex = "-1";
        variable.focus();
        variable.removeAttribute("tab-index");

        window.scrollTo(window.screenX, window.scrollY - 128);
    });

    var input = document.createElement("textarea");
    input.setAttribute("spellcheck", "false");
    input.textContent = variable.textContent;
    input.addEventListener("input", function() {
        for(var i = variableReferences.length - 1; i >= 0; i--) {
            variableReferences[i].textContent = input.value;
        }
    });

    name.appendChild(input);

    parent.appendChild(name);

    nameManager.appendChild(parent);
}

function clearElem(elem, leave) {
    while (elem.childNodes[leave || 0]) elem.removeChild(elem.childNodes[leave || 0]);
}