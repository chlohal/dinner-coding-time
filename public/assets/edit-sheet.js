(function () {
    window._global = this;

    var ICONS = {
        X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>`,
        CROSS_OUT_EYE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z"/></svg>`,
        EYE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg>`,
        QUESTION_MARK: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.601 21.5c0 1.38-1.116 2.5-2.499 2.5-1.378 0-2.499-1.12-2.499-2.5s1.121-2.5 2.499-2.5c1.383 0 2.499 1.119 2.499 2.5zm-2.42-21.5c-4.029 0-7.06 2.693-7.06 8h3.955c0-2.304.906-4.189 3.024-4.189 1.247 0 2.57.828 2.684 2.411.123 1.666-.767 2.511-1.892 3.582-2.924 2.78-2.816 4.049-2.816 7.196h3.943c0-1.452-.157-2.508 1.838-4.659 1.331-1.436 2.986-3.222 3.021-5.943.047-3.963-2.751-6.398-6.697-6.398z"/></svg>`
    };

    (function loadStyle() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/highlight.css";
        document.head.appendChild(link);
    })();



    (_global.loadPartButtons = function loadPartButtons() {
        var partPipeline = document.getElementById("pipeline");
        var partButtons = Array.from(partPipeline.children).filter(function (x) { return x.tagName == "BUTTON" });

        for (var i = 0; i < partButtons.length; i++) {
            initPartButton(partButtons[i], i);
        }


    })();

    function initPartButton(partButton, index) {
        partButton.addEventListener("click", function () {
            _global.updateCurrentPartTo(index);
        })
    }

    (_global.updateCurrentPartTo = function updateCurrentPartTo(partIndex) {
        var partPipeline = document.getElementById("pipeline");
        var partButtons = Array.from(partPipeline.children).filter(function (x) { return x.tagName == "BUTTON" });


        for (var i = 0; i < partButtons.length; i++) partButtons[i].removeAttribute("aria-selected");
        partButtons[partIndex].setAttribute("aria-selected", "true");

        var completion = document.getElementById("pipeline-completion");
        completion.style.transform = `scaleX(${0.25 * (3 - partIndex)})`;

        var partNames = ["edit", "publish"];
        for (var i = 0; i < partNames.length; i++) document.body.classList.remove("part--" + partNames[i]);
        document.body.classList.add("part--" + partNames[partIndex]);

        if (partIndex == 1) loadReviewer();
        else document.getElementById("reviewer").hidden = true;
    })(0);


    function encodeCharacterEntities(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function createEditableParagraph() {
        var paraParent = document.createElement("div");
        paraParent.classList.add("editable");

        var output = document.createElement("output");

        var para = document.createElement("p");
        para.contentEditable = true;
        para.textContent = "# this is an annotation!\nIt has *some* formatting; [click the question mark](https://www.markdownguide.org/cheat-sheet) to learn more!";
        function loadText() {
            executeDependencyFunction("light-markdown.js", "lex", [para.innerText, false, 0], function (data) {
                output.innerHTML = data;
            });
        }
        para.addEventListener("input", loadText);
        //initiate first text
        loadText();

        paraParent.addEventListener("paste", function(e) {
            e.preventDefault();

            var text = (e.originalEvent || e).clipboardData.getData("text/plain");

            console.log(text);

            document.execCommand("insertText", false, text);
        });

        var buttons = document.createElement("div");
        buttons.classList.add("editable--buttons");

        var helpButton = document.createElement("button");
        helpButton.innerHTML = ICONS.QUESTION_MARK;
        helpButton.title = "Open cheat sheet";
        helpButton.addEventListener("click", function () {
            window.open("https://www.markdownguide.org/cheat-sheet");
        });
        buttons.appendChild(helpButton);

        var annosHidden = false;

        var hideButton = document.createElement("button");
        hideButton.innerHTML = ICONS.CROSS_OUT_EYE;
        hideButton.title = "Show/hide preview";
        hideButton.addEventListener("click", function () {
            annosHidden = !annosHidden;
            if (annosHidden) {
                hideButton.innerHTML = ICONS.EYE;
                output.hidden = true;
                output.style.display = "none";
            } else {
                hideButton.innerHTML = ICONS.CROSS_OUT_EYE;
                output.hidden = false;
                output.style.display = "";
            }
        });
        buttons.appendChild(hideButton);

        paraParent.appendChild(para);
        paraParent.appendChild(output);
        paraParent.appendChild(buttons);

        return paraParent;
    }


    function loadReviewer() {
        document.getElementById("reviewer").hidden = false;

        var name = document.getElementById("authorNameInput");
        name.value = localStorage.getItem("contribute-editor-authorNameInput") || "";
        name.addEventListener("input", function () {
            localStorage.setItem("contribute-editor-authorNameInput", name.value);
        });

        var url = document.getElementById("authorUrlInput");
        url.value = localStorage.getItem("contribute-editor-authorUrlInput") || "";
        url.addEventListener("input", function () {
            localStorage.setItem("contribute-editor-authorUrlInput", url.value);
        });

        var pubButton = document.getElementById("publish-button");
        var pubTip = document.getElementById("publish-tip");

        function updateLegalCheckboxes() {
            var allApproved = document.getElementById("licenseApproval").checked &&
                document.getElementById("contentHostingApproval").checked &&
                document.getElementById("ugcDenialApproval").checked;

            pubButton.disabled = !allApproved

            if (allApproved) pubTip.classList.add("faded");
            else pubTip.classList.remove("faded");
        }
        updateLegalCheckboxes();
        document.getElementById("licenseApproval").addEventListener("change", updateLegalCheckboxes);
        document.getElementById("contentHostingApproval").addEventListener("change", updateLegalCheckboxes);
        document.getElementById("ugcDenialApproval").addEventListener("change", updateLegalCheckboxes);

        var publishing = false;
        pubButton.addEventListener("click", function () {
            if (publishing) return;
            if (pubButton.disabled) {
                alert("You must accept all the legal things to publish!");
            } else {
                pubButton.textContent = "...";
                publishing = true;
                uploadPublish();
            }
        });
    }

    function uploadPublish() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://kvdb.io/GoRCE7NnJGgv7hahoSXDj5/scripts/publish");

        xhr.onload = function () {
            showPublishSuccessModal(JSON.parse(xhr.responseText));
            document.getElementById("publish-button").textContent = "Published!";
        }
        
        var formData = new FormData();
        var exportFile = createFullExportFile();
        
        formData.append("json", JSON.stringify(exportFile));
        formData.append("pathname", exportFile.location);
        formData.append("author", exportFile.author.name);
        

        xhr.send(formData);
    }

    function showPublishSuccessModal(publishData) {
        var link = document.getElementById("publish-link");

        var modal = document.getElementById("publish-result-modal");
        modal.hidden = false;
        modal.addEventListener("click", function () {
            modal.hidden = true;
        });
        modal.firstElementChild.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        link.value = "https://dct.cool/p" + publishData.slug;
        document.getElementById("copy-publish-link").addEventListener("click", function () {
            link.parentElement.parentElement.classList.remove("copied");

            link.select();
            document.execCommand("copy");

            link.parentElement.parentElement.classList.add("copied");
        });
    }

    _global.createFullExportFile = function createFullExportFile() {
        var result = {
            author: {
                name: document.getElementById("authorNameInput").value,
                url: document.getElementById("authorUrlInput").value
            },
            mdSource: "",
            html: "",
            type: "sheet",
            location: window.location.pathname.replace("contribute/edit/sheet/", "")
        };

        var resultHtml = "";

        resultHtml += `<script class="author-datascript" type="dct-datascript">window.__AUTHOR = ${JSON.stringify(result.author)}</script>`;

        resultHtml += document.querySelector("h1").outerHTML.replace(/ ?contenteditable="(true)?"/g, "");

        resultHtml += document.querySelector(".editable output").innerHTML;

        result.html = resultHtml;
        

        result.mdSource = document.querySelector(".editable > p").textContent;

        return result;
    }


    window.addEventListener("load", function loadPathnamePartial() {
        var pathname = window.location.pathname;
        var terms = pathname.split("/");
        if(terms[0] == "") terms.splice(0, 1);

        if(terms[0] != "contribute" || terms[1] != "edit") return alert("It looks like this page is mistakenly marked as an editor. Please report this error.");

        var editType = terms[2];
        if(editType != "sheet") return alert("Mistaken editor redirect");
        var partialName = "/" + terms.slice(3).join("/");


        document.querySelector("h1").textContent = partialName.substring(1);

        var parent = createEditableParagraph();

        parent.id = "content";

        document.querySelector("main").appendChild(parent);
        console.log(parent);
    });
})();