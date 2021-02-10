(function () {
    window._global = this;

    window.editors = {};
    var editorsParent, editorsTablist, editorsTablistParent,
        topNavigationLinks = [null, null], selectedTabIndex = undefined, codeIntelligenceLoaded = false, initialTabIdx = -1, partialCache = {};
    window.partialCache = partialCache;

    (function loadStyle() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/highlight.css";
        document.head.appendChild(link);
    })();

    (_global.createBreadcrumbs = function createBreadcrumbs() {
        var header = document.querySelector("header");
        var path = location.pathname.substring(1).split("/");

        for(var i = 0; i < path.length; i++) {
            var childIndex = i * 2 + 2;
            var part;
            
            if(header.children[childIndex]) part = header.children[childIndex];
            else part = document.createElement("a");

            part.textContent = path[i];
            part.href = "/" + path.slice(0, i+1).join("/");

            if(!header.children[childIndex]) {
                var sep = document.createElement("span");
                sep.textContent = "/";
                sep.classList.add("breadcrumb-separator");

                header.appendChild(sep);
                header.appendChild(part);
            }
        }

    })();

    (_global.addTopNavigation = function addTopNavigation() {
        var main = document.querySelector("main");

        var codehsIndex = ["1-2-5", "1-2-6", "1-2-7", "1-2-8", "1-2-9", "1-3-5", "1-3-8", "1-3-9", "1-4-6", "1-4-7", "1-4-8", "1-5-5", "1-5-6", "1-6-4", "1-6-5", "1-6-6", "1-7-11", "1-7-4", "1-7-5", "1-7-8", "2-1-8", "2-1-9", "2-10-6", "2-10-7", "2-10-8", "2-2-6", "2-2-7", "2-2-8", "2-2-9", "2-3-10", "2-3-7", "2-3-8", "2-3-9", "2-4-5", "2-4-6", "2-4-7", "2-4-8", "2-5-5", "2-5-7", "2-5-8", "2-5-9", "2-6-6", "2-6-7", "2-6-8", "2-7-7", "2-7-8", "2-7-9", "2-8-10", "2-8-6", "2-8-7", "2-8-8", "2-8-9", "2-9-6", "2-9-7", "2-9-8", "3-1-6", "3-1-7", "3-1-8", "3-2-6", "3-2-7", "3-2-8", "3-2-9", "3-3-5", "3-3-6", "3-3-7", "3-3-8", "3-4-6", "3-4-7", "3-4-8", "3-4-9", "3-5-6", "3-5-7", "3-5-8", "3-5-9", "3-6-5", "3-6-6", "3-6-7", "3-7-10", "3-7-7", "3-7-9", "4-1-6", "4-1-7", "4-1-8", "4-1-9", "4-2-10", "4-2-6", "4-2-7", "4-2-8", "4-2-9", "4-3-10", "4-3-6", "4-3-7", "4-3-8", "4-3-9", "4-4-6", "4-4-7", "4-4-8", "4-5-7", "5-1-4", "5-1-5", "5-1-6", "5-2-5", "5-2-6", "5-2-7", "5-2-8", "5-3-5", "5-3-6", "5-3-7", "5-3-8", "5-4-5", "5-4-6", "5-4-7", "5-5-5", "5-5-6", "5-5-7","5-6-5","5-6-6","5-6-7","5-7-5","5-7-6","5-7-7"/*,"5-8-7","5-8-8","5-8-9","5-9-5","5-9-6","5-9-7","6-1-6","6-1-7","6-1-8","6-1-9","6-2-10","6-2-7","6-2-8","6-2-9","6-3-6","6-3-7","6-3-8","6-3-9","6-4-6","6-4-7","6-4-8","7-1-7","7-1-8","7-2-6","7-2-7","7-2-8","7-2-9","7-3-6","7-3-8","7-3-9","7-4-6","7-4-7","7-4-8","7-4-9","7-5-6","7-5-7","7-6-10","7-6-4","7-6-9","8-1-5","8-1-6","8-1-7","8-2-7","8-2-8","9-1-6","9-1-7","9-1-8","9-1-9","9-2-6","9-2-7","9-2-8","9-2-9","9-3-6","9-3-7","9-3-8","9-4-6","9-4-7","9-4-8","9-4-9","9-5-6","9-5-7","9-5-8","9-5-9","9-6-6","9-6-7","9-6-8","9-6-9","9-7-6","9-7-7","9-7-8","9-7-9", "10-1-6", "10-1-7", "10-1-8", "10-1-9", "10-2-6", "10-2-7", "10-2-8", "10-3-6", "10-3-7", "10-3-8", "10-3-9"*/];

        var self = /\d+-\d+-\d+/.exec(location.pathname)[0];
        var selfIndex = codehsIndex.indexOf(self);

        var previous = codehsIndex[selfIndex - 1];
        var next = codehsIndex[selfIndex + 1];



        var whetherToInitContainer = !topNavigationLinks[0];

        var navContainer = document.createElement("div");
        navContainer.classList.add("assignment-navigation");


        if (whetherToInitContainer) topNavigationLinks[0] = document.createElement("a");
        topNavigationLinks[0].textContent = previous ? ("Previous: " + previous.replace(/-/g, ".")) : "";
        topNavigationLinks[0].style.cursor = previous ? "" : "default";
        topNavigationLinks[0].href = previous || "";
        if (whetherToInitContainer) navContainer.appendChild(topNavigationLinks[0]);

        if (whetherToInitContainer) {
            var bull = document.createElement("span");
            bull.innerHTML = "&nbsp;&bull;&nbsp;";
            bull.classList.add("assignment-navigation--bullet");
            navContainer.appendChild(bull);
        }


        if (whetherToInitContainer) topNavigationLinks[1] = document.createElement("a");
        topNavigationLinks[1].textContent = next ? ("Next: " + next.replace(/-/g, ".")) : "";
        topNavigationLinks[1].style.cursor = next ? "" : "default";
        topNavigationLinks[1].href = next || "";
        if (whetherToInitContainer) navContainer.appendChild(topNavigationLinks[1]);

        if (whetherToInitContainer) main.insertBefore(navContainer, main.firstElementChild);
    })();

    (_global.registerSpaLinks = function registerSpaLinks() {
        var links = document.querySelectorAll("a:link");
        for (var i = 0; i < links.length; i++) {
            //wrap in anon function to preserve a scope
            (function () {
                var link = links[i];
                //if the link leads to another codehs page
                var path = new URL(link.href).pathname;

                if (path.match(/^\/codehs\/\d+-\d+-\d+/) && !link.hasAttribute("data-is-default-prevented")) {
                    link.setAttribute("data-is-default-prevented", "true");
                    link.addEventListener("click", function (event) {
                        if (link.getAttribute("href") == "") return event.preventDefault();

                        path = new URL(link.href).pathname;

                        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
                        event.preventDefault();

                        navigateToSpaPath(path);
                    });
                }
            })();
        }
    })();

    window.addEventListener("popstate", function(event) {
        if(event.state) navigateToSpaPath(event.state);
    })
    function navigateToSpaPath(path) {
        var partialAddress = path.replace("codehs", "codehs/partials");

        var xhr = new XMLHttpRequest();
        xhr.open("GET", partialAddress);
        xhr.onreadystatechange = onLoadPartial;
        xhr.responseType = "text";

        //event listener for xhr load.
        function onLoadPartial(force, data) {
            //cmon wait until it's done-- or until we've got the result
            if (xhr.readyState != 4 && force !== true) return;

            //if there's an error, just uhhh do it normally i guess
            if (xhr.status != 200 && force !== true) return window.location = path;

            var loadedFromCache = !!partialCache[partialAddress];
            partialCache[partialAddress] = xhr.response || data;

            window.initialTabIdx = -1;
            history.pushState(path, "", path);

            var parsingParent = document.createElement("div");
            parsingParent.innerHTML = xhr.response || data;

            //attachment points for the children
            var head1 = document.querySelector("h1");
            if (head1) head1.parentElement.removeChild(head1);
            var tip = document.querySelector("aside.tip");
            if (tip) tip.parentElement.removeChild(tip);
            var main = document.querySelector("main");

            for (var i = parsingParent.children.length - 1; i >= 0; i--) {
                if (parsingParent.children[i].id.startsWith("source")) {
                    main.appendChild(parsingParent.children[i]);
                } else {
                    main.insertBefore(parsingParent.children[i], main.children[1] || main.firstElementChild);
                }
            }

            selectedTabIndex = undefined;
            initialTabIdx = -1
            removeTransientTabs();
            addSettingsTab();
            _global.loadEditors();
            if (!loadedFromCache) _global.loadCodeIntelligence(localStorage.getItem("override-data-saver"), codeIntelligenceLoaded);
            _global.addTopNavigation();
            _global.registerSpaLinks();
            _global.createBreadcrumbs();
        }

        if (partialCache[partialAddress]) onLoadPartial(true, partialCache[partialAddress]);
        else xhr.send();
    }


    (function createTabsParent() {
        var main = document.querySelector("main");

        var old = document.querySelector(".editor-tabs--grandparent");
        if (old) main.removeChild(main);

        editorsTablistParent = document.createElement("div");
        editorsTablistParent.classList.add("editor-tabs--grandparent")

        editorsTablist = document.createElement("div");
        editorsTablist.classList.add("editor-tabs--tablist")
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

    addSettingsTab();

    (_global.loadEditors = function loadEditors() {
        var pathWithHash = window.location.pathname + "#/tab-";

        for (var i = 0; ; i++) {
            var source = document.getElementById("source" + (i || ""));
            if (source && source.parentElement) source.parentElement.removeChild(source);

            if (editors[pathWithHash + (i + 1)]) {
                recoverDeattachedEditor(editors[pathWithHash + (i + 1)]);
                continue;
            }

            if (source != null) editors[pathWithHash + (i + 1)] = (makeEditor(source, i));
            else break;
        }

        if (initialTabIdx > -1 && initialTabIdx < editorsTablist.children.length) editorsTablist.children[initialTabIdx].click();
        else editorsTablist.lastElementChild.click();
    })();

    _global.loadCodeIntelligence = function loadCodeIntelligence(override, quiet) {
        if (navigator.connection || override || codeIntelligenceLoaded) {
            if (
                override || codeIntelligenceLoaded ||
                ((navigator.connection.type != "bluetooth" && navigator.connection.type != "cellular") &&
                    !navigator.connection.saveData)
            ) {
                var editorArray = Object.values(editors);
                for (var i = 0; i < editorArray.length; i++) {
                    (function () {
                        var editor = editorArray[i];
                        if (editor.onLoadCodeIntelligence) requestAnimationFrame(function () {
                            editor.onStartLoadingCodeIntelligence();
                        });
                    })()
                }
                loadDep(["java-parser.js", "ast-tools.js"], ["explainer.js"], function () {
                    requestAnimationFrame(function () {
                        startCodeIntelligence(quiet);
                    });
                    codeIntelligenceLoaded = true;
                });
                if (!quiet) showAlert({
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
                            action: function () {
                                _global.loadCodeIntelligence(true);
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
                        action: function () {
                            localStorage.setItem("override-data-saver", "1")
                            _global.loadCodeIntelligence(true);
                        }
                    },
                    {
                        text: "Download",
                        action: function () {
                            _global.loadCodeIntelligence(true);
                        }
                    }
                ]
            });
        }
    }

    _global.loadCodeIntelligence(+localStorage.getItem("override-data-saver"));

    function startCodeIntelligence(quiet) {
        if (quiet !== true) showAlert({
            text: "Code Intelligence is loaded!",
            duration: 800
        });
        var editorArray = Object.values(editors);
        for (var i = 0; i < editorArray.length; i++) {
            if (editorArray[i].onLoadCodeIntelligence) editorArray[i].onLoadCodeIntelligence();
        }
    }

    function recoverDeattachedEditor(editor) {
        appendTab(editor.tab, editor.border);
        editor.onLoadCodeIntelligence();
    }

    function makeEditor(source, editorIndex) {
        editorIndex = +editorIndex;

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
        var titleRegexp = (/public\s+class\s+(\w+)/).exec(sourceContent);
        var fileName = titleRegexp ? titleRegexp[1] + ".java" : sourceContent.substring(0, 32).replace(/\n/g, " ") + "...";
        tabTitle.innerHTML = `<span>${encodeCharacterEntities(fileName)}</span>`

        appendTab(tabTitle, border);

        loader.innerHTML = `<h3>Conducting static code analysis. Just a second.</h3><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z" fill="#ffffff" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>`;

        function onStartLoadingCodeIntelligence() {
            if (!this.isAttached()) return;

            this.table.hidden = true;
            this.parent.classList.add("code-with-lines--loading");
        }

        var onLoadCodeIntelligence = function () {
            if (!this.isAttached()) return;

            var ed = this;

            try {
                function printToTable(ast) {
                    window.ast = ast;
                    ed.ast = ast;

                    var userStyle = loadUserStyle();

                    executeDependencyFunction("ast-tools.js", "astToString", [ast, userStyle], function (astSource) {
                        makeNumberedLinesTable(astSource.split("\n"), ed.table);
                        explainEditor(ed);

                        ed.table.hidden = false;
                        ed.parent.classList.remove("code-with-lines--loading");
                    });
                }

                if (ed.ast) printToTable(ed.ast);
                else executeDependencyFunction("java-parser.js", "parse", [sourceContent], printToTable);
            } catch (e) {
                showAlert({
                    text: `Error in activating Code Intelligence on ${fileName}.`,
                    exitButton: true
                });
                return;
            }


        }

        var result = {
            ast: null,
            parent: parent,
            source: sourceContent,
            index: editorIndex,
            table: table,
            file: fileName,
            lines: sourceLinesHtml,
            border: border,
            tab: tabTitle
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
                selectedTab.setAttribute("aria-selected", "false");
                selectedTab.setAttribute("tabindex", "-1");

                var selectedTabpanel = document.getElementById(selectedTab.getAttribute("aria-controls"));
                selectedTabpanel.setAttribute("hidden", "true");
                selectedTabpanel.setAttribute("aria-hidden", "true");
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
        while (table.children[0]) table.removeChild(table.children[0]);
        table.classList.add("code-with-lines");

        var paddingToRemove = Infinity;
        var firstContentLine = 0;
        for (var i = 0; i < htmlLines.length; i++) {
            var len = /^\s*/.exec(htmlLines[i])[0].length;
            if (i == firstContentLine) htmlLines[i] = htmlLines[i].trim();
            if (len == htmlLines[i].length) firstContentLine++;

            if (len > 0) paddingToRemove = Math.min(paddingToRemove, len - 2);
        }
        paddingToRemove = 0;

        for (var i = 0; i < htmlLines.length; i++) {
            var line = document.createElement("tr");

            var lineNum = document.createElement("th");
            var numSpan = document.createElement("span");
            numSpan.textContent = (i + 1);
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

    function loadUserStyle() {
        var userStyle = localStorage.getItem("user-style-prefs");
        if (userStyle == null) userStyle = { colorize: true };
        else userStyle = JSON.parse(userStyle);

        return userStyle;
    }

    function addSettingsTab() {
        var tabPanel = document.createElement("form");
        tabPanel.classList.add("editor-settings-tab");

        var tabPanelHeading = document.createElement("h2");
        tabPanelHeading.textContent = "Code Formatting Settings";
        tabPanel.appendChild(tabPanelHeading);

        var oldStyle = loadUserStyle();

        //bracket options
        tabPanel.appendChild(createRadioControls({
            heading: "Bracket Style",
            name: "javaBracketsStyle",
            opts: [
                {
                    value: true,
                    checked: !!oldStyle.javaBracketsStyle,
                    label: "Use <em>Java-style</em> brackets, on the same line as their block start. <blockquote><pre><code>if(true) {\n    //...\n}</code></pre></blockquote>"
                },
                {
                    value: false,
                    checked: !oldStyle.javaBracketsStyle,
                    label: "Use <em>C-style</em> brackets, which are on a new line from their block start. <blockquote><pre><code>if(true)\n{\n    //...\n}</code></pre></blockquote>"
                }
            ]
        }));

        tabPanel.appendChild(createTextarea({
            heading: "Indentation",
            name: "indentBy",
            pattern: "^\\s+$",
            value: oldStyle.indentBy || "    ",
            style: {
                width: (oldStyle.indentBy || "    ").length + "ch"
            },
            resize: "none",
            label: "How far each block should be indented by. This input MUST be entirely whitespace in order to give valid Java.",
            onkeyup: function (event) {
                event.target.style.width = event.target.value.length + "ch";
            }
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Code Spacing Out",
            name: "spaceAfterStatement",
            opts: [
                {
                    value: " ",
                    checked: !!oldStyle.spaceAfterStatement,
                    label: "<em>Loosely</em> space the code. Includes spaces added after <code>for</code> and <code>if</code> statements.<blockquote><pre><code>public void main (String[] args) {\n    if (3 * 3 > 5) {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: "",
                    checked: !oldStyle.spaceAfterStatement,
                    label: "Space the code out the <em>default</em> amount. This option will still indent code and make newlines, but won't include extra spacing inside parentheses or spaces after  <code>for</code> and <code>if</code> statements. <blockquote><pre><code>public void main(String[] args) {\n    if(3*3>5) {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: "dense",
                    checked: oldStyle.spaceAfterStatement == "dense",
                    label: "<em>Minify</em> the code. This will pack all of your code onto one line and try to make it as small as possible. It also removes all comments. <blockquote><pre><code>public void main(String[] args) {if(3*3>5) {}}</code></pre></blockquote>"
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Expression Spacing",
            name: "spaceInExpression",
            opts: [
                {
                    value: " ",
                    checked: oldStyle.spaceInExpression === " ",
                    label: "<em>Add spaces</em> inside expressions and between arguments."
                },
                {
                    value: "",
                    checked: (oldStyle.spaceInExpression || "") == "",
                    label: "<em>Use Code Spacing configuration</em> inside expressions and between arguments."
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Comments",
            name: "removeComments",
            opts: [
                {
                    value: false,
                    checked: !oldStyle.removeComments,
                    label: "<em>Keep</em> comments in the code <blockquote><pre><code>//this method runs when the program starts\npublic void main(String[] args) {\n    if(3 * 3 > 5) {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: true,
                    checked: !!oldStyle.removeComments,
                    label: "<em>Remove</em> comments from the code completely.<blockquote><pre><code>public void main(String[] args) {\n    if(3*3>5) {\n        \n    }\n}</code></pre></blockquote>"
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Rich Formatting",
            name: "colorize",
            opts: [
                {
                    value: true,
                    checked: !!oldStyle.colorize,
                    label: "<em>Parse, analyze, and color</em> the code. This allows features like explainations and automatic refactoring."
                },
                {
                    value: false,
                    checked: !oldStyle.colorize,
                    label: "<em>Don't tokenize and color</em> the code. This will speed up loading times and make the code viewer more performant, but removes features like explainations. Because of this, some options will have no effect if this is on."
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Float Suffix",
            name: "leaveOffFloatSuffix",
            opts: [
                {
                    value: false,
                    checked: !oldStyle.leaveOffFloatSuffix,
                    label: "<em>Add the <code>f</code> suffix</em> to floats.<blockquote><pre><code>public void main (String[] args) {\n    System.out.println(0.4f)\n}</code></pre></blockquote>"
                },
                {
                    value: true,
                    checked: !!oldStyle.leaveOffFloatSuffix,
                    label: "<em>Don't add the <code>f</code> suffix</em> to floats, implicitly making them doubles.<blockquote><pre><code>public void main (String[] args) {\n    System.out.println(0.4)\n}</code></pre></blockquote>"
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Highlight Paired Characters",
            name: "dontHighlightPairedChars",
            opts: [
                {
                    value: true,
                    checked: !!oldStyle.dontHighlightPairedChars,
                    label: "<em>Don't highlight</em> the counterpart of paired characters (like <code>(</code>, <code>[</code>, or <code>{</code>) when you hover over them."
                },
                {
                    value: false,
                    checked: !oldStyle.dontHighlightPairedChars,
                    label: "<em>Highlight</em> the counterpart of paired characters (like <code>(</code>, <code>[</code>, or <code>{</code>) when you hover over them."
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Explain",
            name: "hideExplainations",
            opts: [
                {
                    value: true,
                    checked: !!oldStyle.hideExplainations,
                    label: "<em>Hide</em> explaination tooltips"
                },
                {
                    value: false,
                    checked: !oldStyle.hideExplainations,
                    label: "<em>Show</em> explaination tooltips"
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "If/Else Format",
            name: "ifElseNewline",
            opts: [
                {
                    value: "\n",
                    checked: oldStyle.ifElseNewline == "\n" || oldStyle.ifElseNewline == undefined,
                    label: "The <code>else</code> should be on a <em>new line</em> from its <code>if</code>'s ending bracket. <blockquote><pre><code>public void main (String[] args) {\n    if (3 * 3 > 5) {\n        //...\n    }\n    else {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: " ",
                    checked: oldStyle.ifElseNewline == " ",
                    label: "The <code>else</code> should be on the <em>same line</em> as its <code>if</code>'s ending bracket. <blockquote><pre><code>public void main (String[] args) {\n    if (3 * 3 > 5) {\n        //...\n    } else {\n        //...\n    }\n}</code></pre></blockquote>"
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Single-Statement Blocks",
            name: "singleLineBlockBrackets",
            opts: [
                {
                    value: "block",
                    checked: oldStyle.singleLineBlockBrackets == "block" || oldStyle.singleLineBlockBrackets == undefined,
                    label: "Single-statement blocks should <em>always</em> have curly brackets. <blockquote><pre><code>public void main (String[] args) {\n    if (3 * 3 > 5) {\n        System.out.println(\"hi\");\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: "line",
                    checked: oldStyle.singleLineBlockBrackets == "line",
                    label: "Single-statement blocks should <em>never</em> have curly brackets. <blockquote><pre><code>public void main (String[] args) {\n    if (3 * 3 > 5) System.out.println(\"hi\");\n}</code></pre></blockquote>"
                },
                {
                    value: "source",
                    checked: oldStyle.singleLineBlockBrackets == "source",
                    label: "Just leave it however the example code was written."
                }
            ]
        }));

        var unmovingButtonSection = document.createElement("div");
        unmovingButtonSection.classList.add("editor-settings-tab--button-section");

        var buttonBackground = document.createElement("div");
        buttonBackground.classList.add("editor-settings-tab--button-background");

        var buttonParent = document.createElement("div");
        buttonParent.classList.add("editor-settings-tab--button-container");

        var tabPanelSubmitButton = document.createElement("button");
        tabPanelSubmitButton.textContent = "Save & Apply Changes";
        tabPanelSubmitButton.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();

            var formData = Array.from((new FormData(tabPanel)).entries());
            var userStyle = loadUserStyle();
            for (var i = 0; i < formData.length; i++) {
                userStyle[formData[i][0]] = formData[i][1];
            }
            localStorage.setItem("user-style-prefs", JSON.stringify(userStyle));

            startCodeIntelligence(true);
        }
        buttonBackground.appendChild(tabPanelSubmitButton);
        buttonParent.appendChild(buttonBackground);
        unmovingButtonSection.appendChild(buttonParent);
        tabPanel.appendChild(unmovingButtonSection);

        var tabButton = document.createElement("button");
        tabButton.setAttribute("aria-label", "Settings");
        tabButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style="fill:inherit" d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>`;
        appendTab(tabButton, tabPanel);

        //sticky button
        tabButton.addEventListener("click", function () {
            requestAnimationFrame(function waitForLayoutChangeAnim() {

                var top = getYPos(tabPanel);
                var bottomVisibleThreshold = tabPanel.offsetHeight + top - window.innerHeight;

                var containerOffset = 0;

                function anim() {
                    if (editorsTablist.children[selectedTabIndex] != tabButton) return requestAnimationFrame(anim);

                    if (bottomVisibleThreshold - window.scrollY > containerOffset) {
                        buttonParent.style.position = "fixed";
                        buttonBackground.classList.add("shadowed");
                    } else {
                        buttonParent.style.position = "static";
                        buttonBackground.classList.remove("shadowed");
                    }

                    requestAnimationFrame(anim);
                }
                anim();
            });
        });
    }

    function getYPos(elem) {
        var top = elem.offsetTop;
        while (elem.offsetParent) top += (elem = elem.offsetParent).offsetTop
        return top;
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

    function removeTransientTabs() {
        while (editorsParent.children[0]) editorsParent.removeChild(editorsParent.children[0]);
        while (editorsTablist.children[0]) editorsTablist.removeChild(editorsTablist.children[0]);
    }
    _global.removeTransientTabs = removeTransientTabs;
})();