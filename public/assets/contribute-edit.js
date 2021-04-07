var getUserStyle;

(function () {
    window._global = this;

    window.editors = {};
    var editorsParent, editorsTablist, editorsTablistParent,
        topNavigationLinks = [null, null], codeIntelligenceLoaded = false, initialTabIdx = -1, partialCache = {};

    _global.selectedTabIndex = undefined
    window.partialCache = partialCache;

    var toolsTablistParent, toolsTablist, toolsParent, selectedToolTabIndex;

    (function loadStyle() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/highlight.css";
        document.head.appendChild(link);
    })();

    _global.navigateToSpaPath = function navigateToSpaPath(path) {
        var partialAddress = path.replace("codehs", "codehs/-partials");

        var xhr = new XMLHttpRequest();
        xhr.open("GET", partialAddress);
        xhr.onreadystatechange = onLoadPartial;
        xhr.onerror = function () {
            console.log("Error loading partial while navigating to " + path)
        }
        xhr.responseType = "text";

        //event listener for xhr load.
        function onLoadPartial(force, data) {
            //cmon wait until it's done-- or until we've got the result
            if (xhr.readyState != 4 && force !== true) return;

            //if there's an error, just uhhh do it normally i guess
            if (xhr.status != 200 && force !== true) return alert("Error loading code");

            var loadedFromCache = !!partialCache[partialAddress];
            partialCache[partialAddress] = xhr.response || data;

            window.initialTabIdx = -1;

            var parsingParent = document.createElement("div");
            parsingParent.innerHTML = xhr.response || data;

            var main = document.querySelector("main");

            for (var i = parsingParent.children.length - 1; i >= 0; i--) {
                if (parsingParent.children[i].id.startsWith("source")) {
                    main.appendChild(parsingParent.children[i]);
                } else if(parsingParent.children[i].tagName == "H1") {
                    document.querySelector("h1").textContent = parsingParent.children[i].textContent;
                } else if(parsingParent.children[i].classList.contains("tip")) {
                    document.getElementById("show-tip-editor-check").checked = true;
                    
                    var tipEditor = document.getElementById("tip-editor");
                    
                    var heading = parsingParent.children[i].querySelector("h2");
                    tipEditor.querySelector("h2").innerHTML = heading.innerHTML;
                    
                    var paragraph = parsingParent.children[i].querySelector("p");
                    if(paragraph) tipEditor.querySelector("p").innerHTML = paragraph.innerHTML;
                    else  tipEditor.querySelector("p").innerHTML = parsingParent.children[i].innerHTML.replace(heading.outerHTML, "");
                }
            }

            selectedTabIndex = undefined;
            initialTabIdx = -1;

            _global.removeAllEditors();
            _global.loadEditors();
            _global.updateCurrentPartTo(0);
        }

        if (partialCache[partialAddress]) onLoadPartial(true, partialCache[partialAddress]);
        else xhr.send();
    };

    _global.removeAllEditors = function removeAllEditors() {
        var keys = Object.keys(editors);

        for (var i = 0; i < keys.length; i++) {
            var ed = editors[keys[i]];
            
            if(ed.tab.parentElement) ed.tab.parentElement.removeChild(ed.tab);
            if(ed.border.parentElement) ed.border.parentElement.removeChild(ed.border);

            delete editors[keys[i]];
        }
    };

    (_global.createBreadcrumbs = function createBreadcrumbs() {
        var header = document.querySelector("header");
        var path = location.pathname.substring(1).split("/");

        var skipOffset = 0;

        for (var i = 0; i < path.length; i++) {
            var childIndex = i * 2 + 2 - skipOffset;
            var part;

            if (path[i] == "codingbat" || path[i - 1] == "codingbat" || path[i] == "on-request-from-discord") {
                skipOffset += 2;
                continue;
            }

            if (header.children[childIndex]) part = header.children[childIndex];
            else part = document.createElement("a");

            part.textContent = path[i];
            part.href = "/" + path.slice(0, i + 1).join("/");

            if (!header.children[childIndex]) {
                var sep = document.createElement("span");
                sep.textContent = "/";
                sep.classList.add("breadcrumb-separator");

                header.appendChild(sep);
                header.appendChild(part);
            }
        }

    })();


    (function createTabsParent() {
        var main = document.querySelector("main");

        var old = document.getElementById("editor-tabs");
        if (old) main.removeChild(old);

        editorsTablistParent = document.createElement("div");
        editorsTablistParent.classList.add("editor-tabs--grandparent");
        editorsTablistParent.id = "editor-tabs";

        editorsTablist = document.createElement("div");
        editorsTablist.classList.add("editor-tabs--tablist");
        editorsTablist.setAttribute("role", "tablist");
        editorsTablistParent.appendChild(editorsTablist);

        editorsParent = document.createElement("div");
        editorsParent.classList.add("editor-tabs--parent");
        editorsTablistParent.appendChild(editorsParent);

        editorsTablist.addEventListener("keydown", function (event) {
            //get direction from keycode. right is 39, left is 37
            if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

            var directionMovement = event.keyCode - 38;
            if (directionMovement > 1) directionMovement = 0;

            //use (x+a)%x to wrap `a` around `x`
            var nextTabIdx = (editorsTablist.children.length + (selectedTabIndex + directionMovement)) % editorsTablist.children.length;
            if (editorsTablist.children[nextTabIdx]) editorsTablist.children[nextTabIdx].click();
        })

        main.appendChild(editorsTablistParent);

        window.addEventListener("hashchange", function hashchange() {
            if (window.location.hash.startsWith("#/tab-")) {
                var tIndex = parseInt(window.location.hash.substring(6));
                if (isNaN(tIndex)) return;

                var ed = editorsTablist.children[tIndex - 1];
                if (ed) ed.click();
            }
        });

        if (window.location.hash.startsWith("#/tab-")) {
            var tIndex = parseInt(window.location.hash.substring(6));
            if (!isNaN(tIndex)) initialTabIdx = tIndex;;
        }

    })();
    
    (_global.addSkeletonTip = function addSkeletonTip() {
        
    });
    
    (_global.loadPartButtons = function loadPartButtons() {
        var partPipeline = document.getElementById("pipeline");
        var partButtons = Array.from(partPipeline.children).filter(function(x) { return x.tagName == "BUTTON" } );
        
        for(var i = 0; i < partButtons.length; i++) {
            initPartButton(partButtons[i], i);
        }
        
        
    })();
    
    function initPartButton(partButton, index) {
        partButton.addEventListener("click", function() {
            _global.updateCurrentPartTo(index);
        })
    }
    
    (_global.updateCurrentPartTo = function updateCurrentPartTo(partIndex) {
        var partPipeline = document.getElementById("pipeline");
        var partButtons = Array.from(partPipeline.children).filter(function(x) { return x.tagName == "BUTTON" } );
        
        
        for(var i = 0; i < partButtons.length; i++) partButtons[i].removeAttribute("aria-selected");
        partButtons[partIndex].setAttribute("aria-selected", "true");
        
        var completion = document.getElementById("pipeline-completion");
        completion.style.transform = `scaleX(${0.25*(3 - partIndex)})`;
        
        var partNames = ["code", "annotate", "publish"];
        for(var i = 0; i < partNames.length; i++) document.body.classList.remove("part--" + partNames[i]);
        document.body.classList.add("part--" + partNames[partIndex]);
        
        if(partIndex == 2) loadReviewer();
    })(0);

    (_global.loadEditors = function loadEditors() {
        var pathWithHash = window.location.pathname + "#/tab-";

        for (var i = 0; ; i++) {
            var source = document.getElementById("source" + (i || ""));
            if (source && source.parentElement) source.parentElement.removeChild(source);

            if (source != null) editors[pathWithHash + (i + 1)] = (makeEditor(source, i));
            else break;
        }

        if (initialTabIdx > -1 && initialTabIdx < editorsTablist.children.length) editorsTablist.children[initialTabIdx].click();
        else editorsTablist.lastElementChild.click();
    });

    function makeEditor(source, editorIndex) {
        editorIndex = +editorIndex;

        var sourceContent = source.textContent;

        var sourceLines = sourceContent.split("\n");
        sourceLines.splice(0, 1);
        var overindent = sourceLines[0].match(/^\s*/)[0].length;
        for(var i = 0; i < sourceLines.length; i++) sourceLines[i] = sourceLines[i].replace(" ".repeat(overindent), "");

        var entryPoint = source.getAttribute("data-entry-point");
        var table = makeNumberedLinesTable(sourceLines);

        var parent = document.createElement("div");
        parent.classList.add("code-with-lines--parent");
        parent.tabIndex = 0;
        parent.addEventListener("keydown", function (event) {
            if (event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
                if (event.key == "a" || event.keyCode == "65") {
                    if (document.activeElement == parent) {
                        //check for support
                        if (typeof window.getSelection === "function") {
                            event.preventDefault();
                            event.stopPropagation();
                            var sel = window.getSelection();

                            var rows = table.children;
                            for (var i = 0; i < rows.length; i++) {
                                var range = sel.rangeCount > i ? sel.getRangeAt(i) : document.createRange();

                                var tCell = rows[i].lastElementChild.lastElementChild;
                                var nextRow = (rows[i + 1] || rows[i]);
                                range.setStart(tCell, 0);
                                range.setEnd(nextRow, rows[i + 1] ? 0 : rows[i].children.length);

                                if (!(sel.rangeCount > i)) {
                                    sel.addRange(range);
                                }
                            }

                        }

                    }
                }
            }
        });
        parent.appendChild(table);

        var loader = document.createElement("div");
        loader.classList.add("code-with-lines--load-box");
        parent.appendChild(loader);

        //we'll add the SVG after the loader is attached, because it doesn't like it if we don't

        var border = document.createElement("div");
        border.classList.add("code-with-lines--border-parent");
        border.appendChild(parent);

        var tabTitle = document.createElement("button");
        var titleRegexp = (/class\s+([A-Z]\w+)/).exec(sourceContent);
        var fileName = titleRegexp ? titleRegexp[1] + ".java" : sourceContent.substring(0, 32).replace(/\n/g, " ") + "...";
        tabTitle.innerHTML = `<span>${encodeCharacterEntities(fileName)}</span>`;
        tabTitle.addEventListener("mouseup", function (event) {
            requestAnimationFrame(function () {
                document.activeElement.blur();
                parent.focus();
            })
        });
        
        loadDep("hljs-worker.js", [], function() {
            var editbox = createEditorEditbox(sourceLines, table, tabTitle);
            parent.appendChild(editbox);
        });

        appendTab(tabTitle, border);

        loader.innerHTML = `<h3>Conducting static code analysis.<div><span>Just a second</span><span class="elipsisanim">...</span></div></h3><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z" fill="#ffffff" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>`;

        var loaderElipsis = loader.firstElementChild.firstElementChild.lastElementChild;
        window.requestAnimationFrame(function animateLoaderElipsis(time) {
            var halfSecond = Math.floor(time / 500);
            var animFrame = (halfSecond % 3) + 1;

            loaderElipsis.textContent = ".".repeat(animFrame);

            window.requestAnimationFrame(animateLoaderElipsis);
        });
        function onStartLoadingCodeIntelligence() {
            if (!this.isAttached()) return;

            this.table.hidden = true;
            this.parent.classList.add("code-with-lines--loading");
        }

        var onLoadCodeIntelligence = function () {
            if (!this.isAttached()) return "unattached";

            if (this.astHtmlSource) {
                this.table.hidden = false;
                this.parent.classList.remove("code-with-lines--loading");
                return "already intelligent"
            }

            var ed = this;

            var userStyle = getUserStyle();

            if (userStyle.lineWrap == "true") ed.table.classList.add("line-wrapped");
            else ed.table.classList.remove("line-wrapped");


        }

        var exercise = window.location.pathname;
        exercise = exercise.replace("/classwork/", "");

        var result = {
            ast: null,
            parent: parent,
            source: sourceContent,
            index: editorIndex,
            table: table,
            exercise: exercise,
            file: fileName,
            border: border,
            entryPoint: entryPoint,
            tab: tabTitle,
            loaderMessage: loader.firstElementChild.firstElementChild.firstElementChild
        };

        result.onLoadCodeIntelligence = onLoadCodeIntelligence.bind(result);
        result.onStartLoadingCodeIntelligence = onStartLoadingCodeIntelligence.bind(result);
        result.isAttached = (function () { return this.tab.parentElement != null; }).bind(result);

        return result;
    }

    function appendTab(tab, tabpanel) {
        var plainLocalIdentifier = "tab-" + editorsParent.children.length;
        var generatedId = window.location.pathname + "#/" + plainLocalIdentifier;
        var slugifiedId = generatedId.replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
        var index = editorsParent.children.length;

        tab.id = slugifiedId;
        tabpanel.id = slugifiedId + "-panel";

        tab.setAttribute("tabindex", "-1");
        tab.setAttribute("aria-controls", slugifiedId + "-panel");
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("role", "tab");

        tab.addEventListener("click", function () {
            tab.focus();
            if (selectedTabIndex !== undefined) {
                var selectedTab = editorsTablist.children[selectedTabIndex];
                if(selectedTab !== undefined) {
                    selectedTab.setAttribute("aria-selected", "false");
                    selectedTab.setAttribute("tabindex", "-1");

                    var selectedTabpanel = document.getElementById(selectedTab.getAttribute("aria-controls"));
                    selectedTabpanel.setAttribute("hidden", "true");
                    selectedTabpanel.setAttribute("aria-hidden", "true");
                }
            }

            if (window.history && window.history.replaceState) window.history.replaceState(window.location.pathname, "", generatedId);
            else location.hash = "#/" + plainLocalIdentifier;

            tab.setAttribute("tabindex", "0");
            tabpanel.removeAttribute("hidden");
            tabpanel.setAttribute("aria-hidden", "false");
            tab.setAttribute("aria-selected", "true");
            selectedTabIndex = index;
        });

        editorsTablist.appendChild(tab);

        tabpanel.setAttribute("aria-hidden", "true");
        tabpanel.setAttribute("aria-labelledby", slugifiedId);
        tabpanel.setAttribute("role", "tabpanel");
        tabpanel.setAttribute("hidden", "true");

        editorsParent.appendChild(tabpanel);
    }

    function makeNumberedLinesTable(htmlLines, table) {
        if (table === undefined) table = document.createElement("table");
        table.classList.add("code-with-lines");

        for (var i = 0; i < Math.max(table.children.length, htmlLines.length); i++) {
            if(i >= htmlLines.length) {
                table.removeChild(table.children[i]);
                i--;
            } else {
                var line;
                if(table.children[i]) line = table.children[i];
                else line = document.createElement("tr");

                createAddAnnotationTh(i + 1, line, htmlLines[i].includes("<span class=\"hlast-verification-term"));

                createTableLineContent(htmlLines[i], line);
                

                if(!table.children[i]) table.appendChild(line);
            }
        }

        return table;
    }

    function createAddAnnotationTh(index, line, canHaveAnnotation) {
        var th;

        if(line.firstElementChild && line.firstElementChild.tagName == "TH") th = line.firstElementChild;
        else th = document.createElement("th");

        th.tabIndex = 0;
        if(!th.firstElementChild) {
            var numSpan = document.createElement("span");
            numSpan.textContent = index;
            th.appendChild(numSpan);
            

            var annotation;
            th.addEventListener("click", function() {
                if(!document.body.classList.contains("part--annotate")) return false;
                if(!th.classList.contains("can-have-annotation")) return console.log("no can hav");
                if(th.parentElement == undefined) return false;

                if(!annotation) {
                    th.parentElement.parentElement.parentElement.classList.add("annotations-open");
                    var dataCell = th.nextElementSibling;

                    annotation = createAnnotationParagraph();
                    dataCell.insertBefore(annotation, dataCell.firstElementChild);
                    th.classList.add("has-annotation");
                } else {
                    if(window.confirm("This will delete the annotation on line " + th.textContent +". Are you sure?")) {
                        th.classList.remove("has-annotation");
                        annotation.parentElement.removeChild(annotation);
                        annotation = "";
                    }
                }
            });
        }
        
        if(canHaveAnnotation) th.classList.add("can-have-annotation");
        else th.classList.remove("can-have-annotation");
        
        if(!line.firstElementChild) line.appendChild(th);

        return th;
    }

    function createAnnotationParagraph() {
        var paraParent = document.createElement("div");
        paraParent.classList.add("annotation");

        var para = document.createElement("p");
        para.contentEditable = true;
        paraParent.appendChild(para);
        
        return paraParent;
    }

    function createEditorEditbox(htmlLines, table, tabTitle) {
        var editbox = document.createElement("textarea");
        editbox.classList.add("editbox");
        editbox.setAttribute("spellcheck", "false");
        for(var i = 0; i < htmlLines.length; i++) {
            editbox.innerHTML += htmlLines[i] + "\n";
        }
        
        editbox.addEventListener("input", function(event) {
            //floaty enters
            if(event.inputType === "insertLineBreak" || event.inputType == "insertParagraph") {
                var value = editbox.value;
                var selStart = editbox.selectionStart;
                var indent = 0
                for(var i = selStart - 2; i >= 0; i--) {
                    if(value.charAt(i) == "\n") {
                        for(var j = i + 1; j < selStart; j++) {
                            if(value.charAt(j) == " ") indent++;
                            else break;
                        }
                        break;
                    }
                }
                editbox.value = editbox.value.substring(0, selStart) +  " ".repeat(indent) + editbox.value.substring(selStart);

                editbox.selectionStart = selStart + indent;
                editbox.selectionEnd = selStart + indent;
            }

            
            executeDependencyFunction("hljs-worker.js", "highlightAuto", [editbox.value], function(data) {
                makeNumberedLinesTable(data.split("\n"), table);
            });
            
            
            var titleRegexp = (/class\s+([A-Z]\w+)/).exec(editbox.value);
            var fileName = titleRegexp ? titleRegexp[1] + ".java" : editbox.value.substring(0, 32).replace(/\n/g, " ") + "...";
            tabTitle.firstElementChild.textContent = fileName;
        });

        executeDependencyFunction("hljs-worker.js", "highlightAuto", [editbox.value], function(data) {
            makeNumberedLinesTable(data.split("\n"), table);
            lastHTML = data;
        });

        return editbox;
    }

    function createTableLineContent(html, line) {
        var lineContent;
        if(line.children[1]) lineContent = line.children[1];
        else lineContent = document.createElement("td");

        createIndentedLineOfCode(html, lineContent);

        if(!line.children[1]) line.appendChild(lineContent);
        return lineContent;
    }

    function createIndentedLineOfCode(html, parent) {
        var code;
        if(parent.lastElementChild) code = parent.lastElementChild;
        else code = document.createElement("code");

        code.innerHTML = html;

        var indentLevel = /^[ \t]*/.exec(code.innerText)[0].length;
        code.style.textIndent = -1 * indentLevel + "ch";
        code.style.paddingInlineStart = indentLevel + "ch";

        if(!parent.lastElementChild) parent.appendChild(code);

        return code;
    }

    function encodeCharacterEntities(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    var __userStyle;
    
    function loadReviewer() {
        var annotations = loadAllAnnotations();
        var table = document.getElementById("review-annotations");
        
        while(table.children[0]) table.removeChild(table.children[0]);
        
        for(var i = 0; i < annotations.length; i++) {
            table.appendChild(createReviewAnnotationRow(annotations[i]));
        }
        
        var checkbox = document.getElementById("show-tip-editor-check");
        var tipEditor = document.getElementById("tip-editor");
        function updateCheckbox() {
            if(checkbox.checked) {
                tipEditor.style.display = "block";
            } else {
                tipEditor.style.display = "none";
            }
        }
        checkbox.addEventListener("change", updateCheckbox);
        updateCheckbox();
        
        var name = document.getElementById("authorNameInput");
        name.value = localStorage.getItem("contribute-editor-authorNameInput") || "";
        name.addEventListener("input", function() {
            localStorage.setItem("contribute-editor-authorNameInput", name.value);
        });
        
        var url = document.getElementById("authorUrlInput");
        url.value = localStorage.getItem("contribute-editor-authorUrlInput") || "";
        url.addEventListener("input", function() {
            localStorage.setItem("contribute-editor-authorUrlInput", url.value);
        });
        
        var pubButton = document.getElementById("publish-button");
        var pubTip = document.getElementById("publish-tip");
        
        function updateLegalCheckboxes() {
            var allApproved = document.getElementById("licenseApproval").checked && 
                document.getElementById("contentHostingApproval").checked &&
                document.getElementById("ugcDenialApproval").checked;
            
            pubButton.disabled = !allApproved
            
            if(allApproved) pubTip.classList.add("faded");
            else pubTip.classList.remove("faded");
        }
        updateLegalCheckboxes();
        document.getElementById("licenseApproval").addEventListener("change", updateLegalCheckboxes);
        document.getElementById("contentHostingApproval").addEventListener("change", updateLegalCheckboxes);
        document.getElementById("ugcDenialApproval").addEventListener("change", updateLegalCheckboxes);
        
        var publishing = false;
        pubButton.addEventListener("click", function() {
            if(publishing) return;
            if(pubButton.disabled) {
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
        xhr.open("POST", "/api/contributor/publishes");
        
        xhr.setRequestHeader("Content-Type", "application/json");
        
        xhr.onload = function() {
            showPublishSuccessModal(JSON.parse(xhr.responseText));
            document.getElementById("publish-button").textContent = "Published!";
        }
        
        xhr.send(JSON.stringify(createFullExportFile()));
    }
    
    function showPublishSuccessModal(publishData) {
        
    }
    
    function createReviewAnnotationRow(annotation) {
        var row = document.createElement("tr");
        
        var astPos = document.createElement("th");
        astPos.textContent = annotation.astConstruct.split(",").reverse().map(x=> `statement ${x}`).join(" in ");
        row.appendChild(astPos);
        
        var annoContent = document.createElement("td");
        annoContent.innerHTML = annotation.html;
        annoContent.textContent = annoContent.textContent.substring(0, 150) + "[...]";
        row.appendChild(annoContent);
        
        return row;
    }
    
    function loadAllAnnotations(parent) {
        var annotations = (parent || document).querySelectorAll(".annotation");
        
        var result = [];
        for(var i = 0; i < annotations.length; i++) {
            var lineMarkers = annotations[i].parentElement.querySelectorAll(".hlast-linemarker");
            var canonLineMarker = lineMarkers[lineMarkers.length - 1];
            result.push({
                html: annotations[i].innerHTML.replace(/ ?contenteditable="(true)?"/g, ),
                astConstruct: canonLineMarker.getAttribute("data-address")
            }); 
        }
        
        return result;
    }
    
    _global.createFullExportFile = function createFullExportFile() {
        var result = {
            files: [],
            author: {
                name: document.getElementById("authorNameInput").value,
                url: document.getElementById("authorUrlInput").value
            },
            html: ""
        };
        
        var fileEditors = Array.from(document.querySelectorAll(".code-with-lines--border-parent"));
        for(var i = 0; i < fileEditors.length; i++) {
            result.files.push(getAnnotationsAndSource(fileEditors[i]));
        }
        
        var resultHtml = "";
        
        resultHtml += `<script class="annotation">window["__AUTHOR"] = ${JSON.stringify(result.author)}</script>`;
        
        var annotationJson = {};
        for(var i = 0; i < result.files; i++) {
            annotationJson["source" + result.files[i].id] = result.files[i].annotations;
        }
        resultHtml += `<script class="annotation">window["__ANNOTATIONS"] = ${JSON.stringify(annotationJson)}</script>`;
        
        resultHtml += document.querySelector("h1").outerHTML.replace(/ ?contenteditable="(true)?"/g, "");
        
        if(document.getElementById("show-tip-editor-check").checked) {
            resultHtml += document.getElementById("tip-editor").outerHTML
                .replace(/ ?contenteditable="(true)?"/g, "")
                .replace(/style="[^"]+"/g, "")
                .replace("id=\"tip-editor\"", "");
        }
        
        for(var i = 0; i < result.files.length; i++) {
            resultHtml += `<code id="source${result.files[i].id || ""}">${encodeCharacterEntities(result.files[i].source)}</code>\n`;
        }
        
        return result;
    }
    
    function getAnnotationsAndSource(elem) {
        var source = elem.querySelector(".editbox").value;
        var annotations = loadAllAnnotations(elem);
        return {
            id: /tab-(\d+)/.exec(elem.id)[1],
            source: source,
            annotations: annotations
        }
    }


    function getUserStyle() {
        var DEFAULT_USER_STYLE = { "colorize": "true", "javaBracketsStyle": "", "indentBy": "    ", "spaceAfterStatement": "", "spaceInExpression": " ", "removeComments": "", "leaveOffFloatSuffix": "true", "dontHighlightPairedChars": "", "hideExplainations": "", "dontRegisterVariables": "", "ifElseNewline": "\n", "singleLineBlockBrackets": "block", "lineWrap": "false" };

        _global.getUserStyle = getUserStyle;
        if (typeof __userStyle == "undefined") {
            var userStyleJson = localStorage.getItem("user-style-prefs");
            if (userStyleJson !== null) __userStyle = JSON.parse(userStyleJson);
        }

        if (typeof __userStyle == "undefined") __userStyle = DEFAULT_USER_STYLE;

        return __userStyle;
    }

    function removeTransientTabs() {
        while (editorsParent.children[0]) editorsParent.removeChild(editorsParent.children[0]);
        while (editorsTablist.children[0]) editorsTablist.removeChild(editorsTablist.children[0]);
    }
    _global.removeTransientTabs = removeTransientTabs;

    window.addEventListener("load", function loadPathnamePartial() {
        var pathname = window.location.pathname;
        var partialName = pathname.split("/")[2];

        _global.navigateToSpaPath("/codehs/" + partialName);
    });
})();