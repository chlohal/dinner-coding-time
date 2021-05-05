var getUserStyle;

(function () {
    window._global = this;

    window.editors = {};
    var codeIntelligenceLoaded = false;

    var toolsTablistParent, toolsTablist, toolsParent, selectedToolTabIndex;

    (function loadStyle() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/highlight.css";
        document.head.appendChild(link);
    })();

    (_global.loadEditors = function loadEditors() {
        var pathWithHash = window.location.pathname + "#/tab-";
        
        var snippets = document.getElementsByClassName("snippet");

        for (var i = snippets.length - 1; i >= 0; i--) {
            var source = snippets[i];

            editors[pathWithHash + (i + 1)] = (makeEditor(source, i));
            
            if (source && source.parentElement) source.parentElement.removeChild(source);
        }
    })();

    function makeEditor(source, editorIndex) {
        editorIndex = +editorIndex;

        var sourceContent = source.textContent;
        
        sourceContent = sourceContent.replace(/\r\n/g, "\n");
        while(sourceContent.substring(0, sourceContent.indexOf("\n")).trim() == "") sourceContent = sourceContent.substring(sourceContent.indexOf("\n") + 1);
        var sourceLines = sourceContent.split("\n");
        var sourceLineFirstPadding = sourceLines[0].match(/^\s*/)[0].length;
        sourceContent = sourceLines.map(function(x) {
            return x.replace(" ".repeat(sourceLineFirstPadding), "");
        }).join("\n").trim();

        var entryPoint = source.getAttribute("data-entry-point");
        var sourceLinesHtml = source.innerHTML.split("\n");

        var table = makeNumberedLinesTable(sourceLinesHtml);


        var parent = document.createElement("div");
        parent.classList.add("code-with-lines--parent");
        parent.classList.add("code-with-lines--snippet");
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

                                var tCell = rows[i].lastElementChild;
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
        
        var userStyle = getUserStyle();
        if (userStyle.lineWrap == "true") table.classList.add("line-wrapped");
        else table.classList.remove("line-wrapped");
            
            
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
        var fileName = source.getAttribute("data-filename") || (titleRegexp ? titleRegexp[1] + ".java" : sourceContent.substring(0, 32).replace(/\n/g, " ") + "...");
        tabTitle.innerHTML = `<span>${encodeCharacterEntities(fileName)}</span>`;
        tabTitle.addEventListener("mouseup", function (event) {
            requestAnimationFrame(function () {
                document.activeElement.blur();
                parent.focus();
            })
        });

        source.parentElement.insertBefore(parent, source);

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
            var ed = this;

            var userStyle = getUserStyle();

            if (userStyle.lineWrap == "true") ed.table.classList.add("line-wrapped");
            else ed.table.classList.remove("line-wrapped");

            try {

                executeDependencyFunction("hljs-worker.js", "highlightAuto", [sourceContent], function (data) {
                    makeNumberedLinesTable(data.split("\n"), table);
                    ed.astHtmlSource = data;
                    ed.table.hidden = false;
                    ed.parent.classList.remove("code-with-lines--loading");
                });
            } catch (e) {
                showAlert({
                    text: `Error in activating Code Intelligence on ${fileName}.`,
                    exitButton: true
                });
                console.error(e);
                
                return;
            }


        }
        
        function showErrorAndFallback(errorMessage) {
            loader.firstElementChild.innerText = errorMessage + "\nPlease report this error. Falling back to raw source code (3)";
            var secs = 3;
            var loop = setInterval(function() {
                secs--;
                loader.firstElementChild.firstElementChild.innerText = errorMessage + "\nPlease report this error. Falling back to raw source code ("+secs+")";
                
                if(secs == 0) {
                    makeNumberedLinesTable(sourceContent.split("\n"), table);
                    table.hidden = false;
                    parent.classList.remove("code-with-lines--loading");
                    clearInterval(loop);
                }
            }, 1000);
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
            lines: sourceLinesHtml,
            border: border,
            entryPoint: entryPoint,
            tab: tabTitle,
            loaderMessage: loader.firstElementChild.firstElementChild.firstElementChild
        };

        result.onLoadCodeIntelligence = onLoadCodeIntelligence.bind(result);
        result.onStartLoadingCodeIntelligence = onStartLoadingCodeIntelligence.bind(result);
        result.isAttached = (function () { return this.tab.parentElement != null; }).bind(result);

        result.onLoadCodeIntelligence();

        return result;
    }

    function makeNumberedLinesTable(htmlLines, table) {
        if (table === undefined) table = document.createElement("table");
        while (table.children[0]) table.removeChild(table.children[0]);
        table.classList.add("code-with-lines");

        var offset = 0;
        var startPadding = "";
        
        for (var i = 0; i < htmlLines.length; i++) {
            //don't permit large blank spaces
            if(htmlLines[i].trim() == "" && ((htmlLines[i - 1] || "").trim() == "" || (htmlLines[i + 1] || "").trim() == "")) {
                console.log(JSON.stringify((htmlLines[i - 1] || "") + (htmlLines[i + 1] || "").replace(/\s+/g, "")) );
                offset++;
                continue;
            }
            if(startPadding == "") startPadding = /^\s*/.exec(htmlLines[i])[0].length;
            
            var line = document.createElement("tr");

            var lineNum = document.createElement("th");
            var numSpan = document.createElement("span");
            numSpan.textContent = (i + 1 - offset);
            lineNum.appendChild(numSpan);
            line.appendChild(lineNum);

            var lineContent = document.createElement("td");
            var lcCode = document.createElement("code");
            lcCode.innerHTML = htmlLines[i];

            var indentLevel = /^\s*/.exec(lcCode.innerText)[0].length;
            lcCode.style.textIndent = -1 * indentLevel + "ch";
            lcCode.style.paddingInlineStart = indentLevel + "ch";

            lineContent.appendChild(lcCode);
            line.appendChild(lineContent);

            table.appendChild(line);
        }

        return table;
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
        if (opts.inProgress) elem.classList.add("progress")
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
                try { elem.parentElement.removeChild(elem); } catch (e) { }
            }, opts.duration || 3000);
        }
    }

    function encodeCharacterEntities(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    var __userStyle;


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


    function createTextarea(controlOptions) {
        var controlParent = document.createElement("div");
        var defaultName = Date.now().toString(36);

        if (controlOptions.heading) {
            var heading = document.createElement("h3");
            heading.textContent = controlOptions.heading
            controlParent.appendChild(heading);
        }

        var control = document.createElement("label");

        var input = document.createElement("textarea");
        input.rows = controlOptions.rows || 1;
        input.cols = controlOptions.cols || 1;
        input.style.resize = controlOptions.resize;
        input.pattern = controlOptions.pattern || "";
        input.name = controlOptions.name || defaultName;
        input.value = controlOptions.value || "";
        input.onkeyup = controlOptions.onkeyup || null;

        for (var i in controlOptions.style) input.style[i] = controlOptions.style[i];

        control.appendChild(input);

        var lContainer = document.createElement("span");
        lContainer.innerHTML = controlOptions.label;
        control.appendChild(lContainer);

        controlParent.appendChild(control);

        return controlParent;
    }

    function createRadioControls(controlOptions) {
        var controlParent = document.createElement("div");
        var defaultName = Date.now().toString(36);

        if (controlOptions.heading) {
            var heading = document.createElement("h3");
            heading.textContent = controlOptions.heading
            controlParent.appendChild(heading);
        }
        if (controlOptions.description) {
            var description = document.createElement("p");
            description.innerHTML = controlOptions.description
            controlParent.appendChild(description);
        }

        for (var i = 0; i < controlOptions.opts.length; i++) {
            var control = document.createElement("label");

            var input = document.createElement("input");
            input.type = "radio";
            if (controlOptions.opts[i].checked) input.checked = controlOptions.opts[i].checked;
            input.name = controlOptions.name || defaultName;
            input.value = controlOptions.opts[i].value || "";
            control.appendChild(input);

            var lContainer = document.createElement("span");
            lContainer.innerHTML = controlOptions.opts[i].label;
            control.appendChild(lContainer);

            controlParent.appendChild(control);
        }

        return controlParent;
    }
})();