var getUserStyle;

var SPA_TITLE_SUFFIX = " | Dinner Coding Time";

(function () {
    window._global = this;

    window.editors = {};
    var editorsParent, editorsTablist, editorsTablistParent,
        topNavigationLinks = [null, null], selectedTabIndex = undefined, codeIntelligenceLoaded = false, initialTabIdx = -1, partialCache = {};
    window.partialCache = partialCache;

    var toolsTablistParent, toolsTablist, toolsParent, selectedToolTabIndex;

    (function loadStyle() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/highlight.css";
        document.head.appendChild(link);
    })();

    (function loadVersion() {
        var path = window.location.pathname;
        var searchParams = new URLSearchParams(window.location.search);

        var key = path + "@" + searchParams.get("version");

        navigateToSpaPath("https://kvdb.io/GoRCE7NnJGgv7hahoSXDj5/scripts/get?assignment=" + encodeURIComponent(key) + "&format=html", true);
    })();
    (_global.addTopNavigation = function addTopNavigation() {
        var main = document.querySelector("main");

        var __codehsIndex = ["1-2-5", "1-2-6", "1-2-7", "1-2-8", "1-2-9", "1-3-5", "1-3-8", "1-3-9", "1-4-6", "1-4-7", "1-4-8", "1-5-5", "1-5-6", "1-6-4", "1-6-5", "1-6-6", "1-7-11", "1-7-4", "1-7-5", "1-7-8", "2-1-8", "2-1-9", "2-2-6", "2-2-7", "2-2-8", "2-2-9", "2-3-7", "2-3-8", "2-3-9", "2-3-10", "2-4-5", "2-4-6", "2-4-7", "2-4-8", "2-5-5", "2-5-7", "2-5-8", "2-5-9", "2-6-6", "2-6-7", "2-6-8", "2-7-7", "2-7-8", "2-7-9", "2-8-6", "2-8-7", "2-8-8", "2-8-9", "2-8-10", "2-9-6", "2-9-7", "2-9-8", "2-10-6", "2-10-7", "2-10-8", "3-1-6", "3-1-7", "3-1-8", "3-2-6", "3-2-7", "3-2-8", "3-2-9", "3-3-5", "3-3-6", "3-3-7", "3-3-8", "3-4-6", "3-4-7", "3-4-8", "3-4-9", "3-5-6", "3-5-7", "3-5-8", "3-5-9", "3-6-5", "3-6-6", "3-6-7", "3-7-7", "3-7-9", "3-7-10", "4-1-6", "4-1-7", "4-1-8", "4-1-9", "4-2-6", "4-2-7", "4-2-8", "4-2-9", "4-2-10", "4-3-6", "4-3-7", "4-3-8", "4-3-9", "4-3-10", "4-4-6", "4-4-7", "4-4-8", "4-5-7", "5-1-4", "5-1-5", "5-1-6", "5-2-5", "5-2-6", "5-2-7", "5-2-8", "5-3-5", "5-3-6", "5-3-7", "5-3-8", "5-4-5", "5-4-6", "5-4-7", "5-5-5", "5-5-6", "5-5-7", "5-6-5", "5-6-6", "5-6-7", "5-6-8", "5-7-5", "5-7-6", "5-7-7", "5-8-7", "5-8-8", "5-8-9", "5-9-5", "5-9-6", "5-9-7", "6-1-6", "6-1-7", "6-1-8", "6-1-9", "6-2-7", "6-2-8", "6-2-9", "6-2-10", "6-3-6", "6-3-7", "6-3-8", "6-3-9", "6-4-6", "6-4-7", "6-4-8", "6-4-9", "7-1-7", "7-1-8", "7-2-6", "7-2-7", "7-2-8", "7-2-9", "7-3-6", "7-3-8", "7-3-9", "7-4-6", "7-4-7", "7-4-8", "7-4-9", "7-5-6", "7-5-7", "7-5-8", "7-6-4", "7-6-9", "7-6-10", "8-1-5", "8-1-6", "8-1-7", "8-2-7", "8-2-8", "8-2-9", "9-1-6", "9-1-7", "9-1-8", "9-1-9", "9-2-6", "9-2-7", "9-2-8", "9-2-9", "9-3-6", "9-3-7", "9-3-8", "9-4-6", "9-4-7", "9-4-8", "9-4-9", "9-5-6", "9-5-7", "9-5-8", "9-5-9", "9-6-6", "9-6-7", "9-6-8", "9-6-9", "9-7-6", "9-7-7", "9-7-8", "9-7-9", "10-1-6", "10-1-7", "10-1-8", "10-1-9", "10-2-6", "10-2-7", "10-2-8", "10-3-6", "10-3-7", "10-3-8", "10-3-9"];

        var self = /\d+-\d+-\d+/.exec(location.pathname)[0];
        var selfIndex = __codehsIndex.indexOf(self);

        var previous = __codehsIndex[selfIndex - 1];
        var next = __codehsIndex[selfIndex + 1];



        var whetherToInitContainer = !topNavigationLinks[0];

        var navContainer = document.createElement("div");
        navContainer.classList.add("assignment-navigation");


        if (whetherToInitContainer) topNavigationLinks[0] = document.createElement("a");
        topNavigationLinks[0].textContent = previous ? ("Previous: " + previous.replace(/-/g, ".")) : "";
        topNavigationLinks[0].style.cursor = previous ? "" : "default";
        topNavigationLinks[0].href = previous + "?version=latest" || "";
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
        topNavigationLinks[1].href = next + "?version=latest" || "";
        if (whetherToInitContainer) navContainer.appendChild(topNavigationLinks[1]);

        if (whetherToInitContainer) main.insertBefore(navContainer, main.firstElementChild);
    })();

    function navigateToSpaPath(path, isAbsolute) {
        var partialAddress = path;
        if (!isAbsolute) partialAddress = path.replace("codehs", "-partials/codehs");

        var originalUrl = window.location.toString();

        var xhr = new XMLHttpRequest();
        xhr.open("GET", partialAddress);
        xhr.onreadystatechange = onLoadPartial;
        xhr.onerror = function () {
            window.location.replace(path);
            console.log("Error loading partial; navigating to " + path)
        }
        xhr.responseType = "text";

        //event listener for xhr load.
        function onLoadPartial(force, data) {
            //cmon wait until it's done-- or until we've got the result
            if (xhr.readyState != 4 && force !== true) return;

            //if there's an error, just uhhh do it normally i guess
            if (xhr.status != 200 && force !== true && !isAbsolute) return window.location.replace(path);

            if (xhr.status != 200 && isAbsolute) return showPreviewGetModal(xhr.status);

            var loadedFromCache = !!partialCache[partialAddress];
            partialCache[partialAddress] = xhr.response || data;

            var parsingParent = document.createElement("div");
            parsingParent.innerHTML = xhr.response || data;

            //clean up old data-scripts
            _global.cleanDataScripts();

            //attachment points for the children
            var head1 = document.querySelector("h1");
            if (head1) head1.parentElement.removeChild(head1);
            var tips = Array.from(document.querySelectorAll("aside.tip"));
            tips.forEach(function (x) { x.parentElement.removeChild(x); });

            var main = document.querySelector("main");

            var newDocTitle = parsingParent.querySelector("h1");
            if (newDocTitle) document.title = newDocTitle.textContent + SPA_TITLE_SUFFIX;

            for (var i = parsingParent.children.length - 1; i >= 0; i--) {
                if (parsingParent.children[i].id.startsWith("source")) {
                    main.appendChild(parsingParent.children[i]);
                } else {
                    main.insertBefore(parsingParent.children[i], main.children[1] || main.firstElementChild);
                }
            }

            selectedTabIndex = undefined;
            executeDependencyFunction("ast-tools.js", "clearVariableRegistry", [], function () {
                removeTransientTabs();
                _global.findAndExecuteDataScripts();
                _global.loadEditors();
                _global.loadCodeIntelligence(localStorage.getItem("override-data-saver"), codeIntelligenceLoaded);
                _global.updateByline();

                if (typeof window.__onloadSendPageview === "function") window.__onloadSendPageview(true, originalUrl);
            });
        }

        if (partialCache[partialAddress]) onLoadPartial(true, partialCache[partialAddress]);
        else xhr.send();
    }

    function showPreviewGetModal(status) {
        var explanations = {
            404: {
                body: "Could not find the requested resource. Please try:",
                options: ["Viewing the <a href=\"?version=latest\">latest version</a>",
                    "Viewing the <a href=\"?\">published version</a>",
                    "<a href=\"\">Refreshing</a> the page",
                    "Going back to the <a onclick=\"window.history.back()\" href=\"#\">previous page</a>"]
            }
        }
        var errorModal = document.getElementById("preview-error-modal");
        var errorModalHeader = document.getElementById("preview-error-modal-header");
        var errorModalBody = document.getElementById("preview-error-modal-body");
        var errorModalOptions = document.getElementById("preview-error-modal-options");
        
        errorModal.tabIndex = -1;
        requestAnimationFrame(function() {
            errorModal.focus();
        });

        errorModalHeader.textContent = "Error " + status;
        
        if(explanations[status]) {
            errorModalBody.textContent = explanations[status].body;
            for(var i = 0; i < explanations[status].options.length; i++) {
                var li = document.createElement("li");
                li.innerHTML = explanations[status].options[i];
                errorModalOptions.appendChild(li);
            }
        }

        errorModal.hidden = false;
    }

    (_global.findAndExecuteDataScripts = function findAndExecuteDataScripts() {
        var annotationScript = document.querySelector("script.annotation-datascript");
        if (annotationScript) eval(annotationScript.innerHTML);

        var authorScript = document.querySelector("script.author-datascript");
        if (authorScript) eval(authorScript.innerHTML);
    });
    (_global.cleanDataScripts = function cleanDataScripts() {
        var annotationScript = Array.from(document.querySelectorAll("script.annotation-datascript"));
        for (var i = 0; i < annotationScript.length; i++) annotationScript[i].parentElement.removeChild(annotationScript[i]);
        window.__ANNOTATIONS = null;

        var authorScript = document.querySelectorAll("script.author-datascript");
        for (var i = 0; i < authorScript.length; i++) authorScript[i].parentElement.removeChild(authorScript[i]);
        window.__AUTHOR = null;
    });

    (_global.updateByline = function () {
        var author = window.__AUTHOR;

        var byline = document.querySelector("p.byline");

        if (byline && !author) {
            byline.parentElement.removeChild(byline);
        }
        else if (!byline && author) {
            byline = document.createElement("p");
            byline.classList.add("byline");

            byline.appendChild(document.createTextNode("By"));

            var link = document.createElement("a");
            link.classList.add("external-link");
            link.target = "_blank";
            link.rel = "author noopener";

            byline.appendChild(link);

            var title = document.querySelector("h1");

            title.parentElement.insertBefore(byline, title);
        }

        if (author) {
            var bylineLink = byline.firstElementChild;
            if(!author.url.startsWith("http")) author.url = "http://" + author.url;
            bylineLink.href = author.url;
            bylineLink.textContent = author.name;
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
            if (!isNaN(tIndex)) initialTabIdx = tIndex;
        }

    })();

    (function createToolsParent() {
        var main = document.querySelector("main");

        var old = document.getElementById("advanced-tools-tabs");
        if (old) main.removeChild(old);

        toolsTablistParent = document.createElement("div");
        toolsTablistParent.classList.add("tools-tabs--grandparent");
        toolsTablistParent.id = "advanced-tools-tabs";

        toolsTablist = document.createElement("div");
        toolsTablist.classList.add("tools-tabs--tablist")
        toolsTablist.setAttribute("role", "tablist");
        toolsTablistParent.appendChild(toolsTablist);

        toolsParent = document.createElement("div");
        toolsParent.classList.add("tools-tabs--parent");
        toolsTablistParent.appendChild(toolsParent);

        toolsTablist.addEventListener("keydown", function (event) {
            //get direction from keycode. right is 39, left is 37
            if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

            var directionMovement = event.keyCode - 38;
            if (directionMovement > 1) directionMovement = 0;

            //use (x+a)%x to wrap `a` around `x`
            var nextTabIdx = (toolsTablist.children.length + (selectedTabIndex + directionMovement)) % toolsTablist.children.length;
            if (toolsTablist.children[nextTabIdx]) toolsTablist.children[nextTabIdx].click();
        })

        main.appendChild(toolsTablistParent);

    })();

    (_global.appendToolTab = function appendToolTab(tab, tabpanel) {
        var plainLocalIdentifier = "tab-" + toolsParent.children.length;
        var normalizedSearch = (window.location.search.length > 1) ? window.location.search : "";
        var generatedId = window.location.pathname + normalizedSearch + "#/" + plainLocalIdentifier;
        var slugifiedId = "tool" + generatedId.replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
        var index = toolsParent.children.length;

        tab.id = slugifiedId;
        tabpanel.id = slugifiedId + "-panel";

        tab.setAttribute("tabindex", "-1");
        tab.setAttribute("aria-controls", slugifiedId + "-panel");
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("role", "tab");

        tab.addEventListener("click", function () {
            tab.click();
            if (selectedToolTabIndex !== undefined) {
                var selectedTab = toolsTablist.children[selectedToolTabIndex];
                selectedTab.setAttribute("aria-selected", "false");
                selectedTab.setAttribute("tabindex", "-1");

                var selectedTabpanel = document.getElementById(selectedTab.getAttribute("aria-controls"));
                selectedTabpanel.setAttribute("hidden", "true");
                selectedTabpanel.setAttribute("aria-hidden", "true");
            }

            tab.setAttribute("tabindex", "0");
            tabpanel.removeAttribute("hidden");
            tabpanel.setAttribute("aria-hidden", "false");
            tab.setAttribute("aria-selected", "true");
            selectedToolTabIndex = index;
        });

        toolsTablist.appendChild(tab);

        tabpanel.setAttribute("aria-hidden", "true");
        tabpanel.setAttribute("aria-labelledby", slugifiedId);
        tabpanel.setAttribute("role", "tabpanel");
        tabpanel.setAttribute("hidden", "true");

        toolsParent.appendChild(tabpanel);
    });

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
            else if (i > 0) break;
        }

        if (initialTabIdx > -1 && initialTabIdx < editorsTablist.children.length) editorsTablist.children[initialTabIdx].click();
        else if (editorsTablist.lastElementChild) editorsTablist.lastElementChild.click();
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
                loadDep(["java-parser.js", "ast-tools.js"], ["explainer.js", "name-manager.js"], function () {
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

    function startCodeIntelligence(quiet, invalidate) {
        if (quiet !== true) showAlert({
            text: "Code Intelligence is loaded!",
            duration: 800
        });
        var editorArray = Object.values(editors);
        for (var i = 0; i < editorArray.length; i++) {
            if (invalidate) delete editorArray[i].astHtmlSource;
            if (editorArray[i].onLoadCodeIntelligence) editorArray[i].onLoadCodeIntelligence();
        }
    }

    function recoverDeattachedEditor(editor) {
        appendTab(editor.tab, editor.border);
        editor.onLoadCodeIntelligence();
    }

    _global.garbageCleanEditors = function garbageCleanEditors() {
        var pathname = window.location.pathname;
        var keys = Object.keys(editors);

        for (var i = 0; i < keys.length - 10; i++) {
            if (!keys[i].startsWith(pathname)) delete editors[keys[i]];
        }
    }

    function makeEditor(source, editorIndex) {
        editorIndex = +editorIndex;

        var sourceContent = source.textContent;
        var sourceLinesHtml = source.innerHTML.split("\n");
        var annotations = (window.__ANNOTATIONS || {})[source.id];

        var table = makeNumberedLinesTable(sourceLinesHtml);


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

                            //chrome bug patch
                            if (sel.rangeCount == 1) {
                                sel.getRangeAt(0).selectNode(table);
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
        var titleRegexp = (/class\s+(\w+)( extends \w+)?( implements (\w+, *)+)?(\s|\n)+{/).exec(sourceContent);
        var fileName = titleRegexp ? titleRegexp[1] + ".java" : sourceContent.substring(0, 32).replace(/\n/g, " ") + "...";
        tabTitle.innerHTML = `<span>${encodeCharacterEntities(fileName)}</span>`;
        tabTitle.addEventListener("mouseup", function (event) {
            requestAnimationFrame(function () {
                document.activeElement.blur();
                parent.focus();
            });
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

            try {
                function printToTable(ast) {
                    if (ast.error) return showErrorAndFallback(ast.error);

                    window.ast = ast;
                    ed.ast = ast;

                    ed.loaderMessage.textContent = "Formatting source tree";

                    executeDependencyFunction("ast-tools.js", "astToString", [ast, userStyle, ["@" + ed.exercise]], function (astSource) {
                        ed.loaderMessage.textContent = "Adding formatted code to document object model";

                        makeNumberedLinesTable(astSource.split("\n"), ed.table);
                        addAnnotations(annotations, ed.table);
                        ed.loaderMessage.textContent = "Adding interactivity hooks";
                        explainEditor(ed);

                        ed.astHtmlSource = astSource;
                        ed.table.hidden = false;
                        ed.parent.classList.remove("code-with-lines--loading");
                    });
                }

                ed.loaderMessage.textContent = "Parsing java code";

                if (sourceContent.trim() == "") {
                    makeNumberedLinesTable(["### If you somehow got to this unlisted page ###", "Sorry, this exercise hasn't been done yet.", "All of these are manually filled by one person, so it takes a bit for them to be finished", "I'm doing Chapter 9 right now, so all chapters, 1 to 10, will be done soon, I promise.", "I apologize for the delay."], ed.table);
                    ed.astHtmlSource = "";
                    ed.table.hidden = false;
                    ed.parent.classList.remove("code-with-lines--loading");
                    return;
                }
                if (ed.ast) printToTable(ed.ast);
                else executeDependencyFunction("java-parser.js", "parse", [sourceContent], printToTable);
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
            var loop = setInterval(function () {
                secs--;
                loader.firstElementChild.firstElementChild.innerText = errorMessage + "\nPlease report this error. Falling back to raw source code (" + secs + ")";

                if (secs == 0) {
                    makeNumberedLinesTable(sourceContent.split("\n"), table);
                    addAnnotations(annotations, sourceContent, ed.table);
                    table.hidden = false;
                    parent.classList.remove("code-with-lines--loading");
                    clearInterval(loop);
                }
            }, 1000);
        }

        var exercise = window.location.pathname;
        exercise = /\d+-\d+-\d+/.exec(exercise)[0].replace(/-/g, ".");

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
            tab: tabTitle,
            loaderMessage: loader.firstElementChild.firstElementChild.firstElementChild
        };

        result.onLoadCodeIntelligence = onLoadCodeIntelligence.bind(result);
        result.onStartLoadingCodeIntelligence = onStartLoadingCodeIntelligence.bind(result);
        result.isAttached = (function () { return this.tab.parentElement != null; }).bind(result);

        return result;
    }

    function addAnnotations(annotations, table) {
        if (!annotations) return false;
        //get content (TD elements' text) of table
        var source = "";
        for (var i = 0; i < table.children.length; i++) {
            source += table.children[i].lastElementChild.lastElementChild.textContent + "\n";
        }
        executeDependencyFunction("lightweight-java-highlighter.js", "getLineAddresses", [source], function (lineAddresses) {
            var alreadyAdded = [];
            for (var i = lineAddresses.length - 1; i >= 0; i--) {
                var annotation = annotations.find(function (x) {
                    return x.astConstruct == lineAddresses[i];
                });
                if (!annotation) continue;

                //ensure that each annotation is only added once
                if (alreadyAdded.includes(annotation.astConstruct)) continue;
                else alreadyAdded.push(annotation.astConstruct);

                //insert _before_ the line's code
                table.children[i].lastElementChild.insertBefore(createAnnotation(annotation.html), table.children[i].lastElementChild.lastElementChild);
            }
        });
    }

    function createAnnotation(html) {
        var anno = document.createElement("div")
        anno.classList.add("annotation");

        anno.innerHTML = "<div>" + html + "</div>";

        var rcsmpc = recieverClientSideMarkupPrelandCheck(anno);
        if (rcsmpc) {
            alert("ANNOTATION FAILED RCSMPC BY USING " + rcsmpc + ". THIS INDICATES A MALICIOUS USE OF THE ANNOTATION TOOLS. PLEASE REPORT THIS IMMEDIATELY");
            anno.innerHTML = "<p style=\"background:red\"><code>FAILED RECIEVER CLIENT SIDE MARKUP PRE-LANDING CHECK. PLEASE REPORT IMMEDIATELY</code></p>";
        }

        return anno;
    }

    /**
     * Check that only benign elements are used within a parent.
     * @param {HTMLElement} elem The parent to scan
     * @return The offending element, or the empty string if the parent is safe
     */
    function recieverClientSideMarkupPrelandCheck(elem) {
        var COLOR_REGEX = /(#\w{6}(\w{2})?)|(rgb\(\d+, \d+, \d+\))/;
        var allowed = [{
            tagName: "SVG",
            attributes: {},
            styles: {}
        }, {
            tagName: "PATH",
            attributes: {
                "d": ".+"
            },
            styles: {
                fill: COLOR_REGEX,
                stroke: COLOR_REGEX
            }
        }, {
            tagName: "A",
            attributes: {
                target: /_blank/,
                rel: /(\w+ )*\w+/,
                href: /https?.*/
            },
            styles: {}
        }, {
            tagName: "P",
            attributes: {},
            styles: {}
        }, {
            tagName: "SPAN",
            attributes: {
                class: /((hlast|md)-[\w-]+)?/,
                "data-address": /.*/,
                "data-annotation-connector-id": /.*/
            },
            styles: {}
        }, {
            tagName: "S",
            attributes: {},
            styles: {}
        }, {
            tagName: "B",
            attributes: {},
            styles: {}
        }, {
            tagName: "STRONG",
            attributes: {},
            styles: {}
        }, {
            tagName: "I",
            attributes: {},
            styles: {}
        }, {
            tagName: "EM",
            attributes: {},
            styles: {}
        }, {
            tagName: "U",
            attributes: {},
            styles: {}
        },{
            tagName: "CODE",
            attributes: {},
            styles: {}
        }, {
            tagName: "PRE",
            attributes: {},
            styles: {}
        }, {
            tagName: "DIV",
            attributes: {
                class: /(annotation)?/
            },
            styles: {}
        }, {
            tagName: "TABLE",
            attributes: {},
            styles: {}
        }, {
            tagName: "TBODY",
            attributes: {},
            styles: {}
        }, {
            tagName: "TH",
            attributes: {},
            styles: {}
        }, {
            tagName: "TR",
            attributes: {},
            styles: {}
        }, {
            tagName: "TD",
            attributes: {},
            styles: {}
        }, {
            tagName: "HR",
            attributes: {},
            styles: {}
        }, {
            tagName: "H1",
            attributes: {},
            styles: {}
        }, {
            tagName: "H2",
            attributes: {},
            styles: {}
        }, {
            tagName: "H3",
            attributes: {},
            styles: {}
        }, {
            tagName: "H4",
            attributes: {},
            styles: {}
        }, {
            tagName: "H5",
            attributes: {},
            styles: {}
        }, {
            tagName: "H6",
            attributes: {},
            styles: {}
        },
        {
            tagName: "BR",
            attributes: {},
            styles: {}
        }];

        var globalAllowedStyle = {
            "background-color": COLOR_REGEX,
            "color": COLOR_REGEX,

            "border-radius": /\dpx/,
            "border-top-color": COLOR_REGEX,
            "border-top-style": /\w+/,
            "border-top-width": /\dpx/,
            "border-right-color": COLOR_REGEX,
            "border-right-style": /\w+/,
            "border-right-width": /\dpx/,
            "border-bottom-color": COLOR_REGEX,
            "border-bottom-style": /\w+/,
            "border-bottom-width": /\dpx/,
            "border-left-color": COLOR_REGEX,
            "border-left-style": /\w+/,
            "border-left-width": /\dpx/,
        };

        var children = elem.children;

        //verify that tagName is allowed
        var tagSearchRes = allowed.find(function (x) { return x.tagName == elem.tagName });
        if (!tagSearchRes) {
            return "ILLEGAL ELEMENT '" + elem.tagName + "'";
        }

        //verify that all attributes are allowed
        var attrs = elem.attributes;
        for (var i = 0; i < attrs.length; i++) {
            //styles are handled separately
            if (attrs[i].name == "style") continue;

            if (!tagSearchRes.attributes.hasOwnProperty(attrs[i].name)) {
                return "ILLEGAL PROPERTY '" + attrs[i].name + "'";
            }
            var match = attrs[i].value.match(new RegExp(tagSearchRes.attributes[attrs[i].name]));
            if (!match || match[0] != attrs[i].value) {
                return "ILLEGAL PROPERTY VALUE'" + attrs[i].value + "'";
            }
        }

        var style = elem.style;
        for (var i = 0; i < style.length; i++) {
            var styleProp = style.item(i);
            if (!tagSearchRes.styles.hasOwnProperty(styleProp) &&
                !globalAllowedStyle.hasOwnProperty(styleProp)) {
                return "ILLEGAL CSS PROPERTY '" + styleProp + "'";
            }
            var match = style.getPropertyValue(styleProp).match(new RegExp(tagSearchRes.styles[styleProp] || globalAllowedStyle[styleProp]));
            if (!match || match[0] != style.getPropertyValue(styleProp)) {
                return "ILLEGAL CSS PROPERTY VALUE'" + styleProp + ":" + style.getPropertyValue(styleProp) + "'";
            }
        }

        //scan children
        for (var i = 0; i < children.length; i++) {
            var childScanResult = recieverClientSideMarkupPrelandCheck(children[i]);
            if (childScanResult) return childScanResult;
        }
        return "";
    }

    function appendTab(tab, tabpanel, parent) {
        var plainLocalIdentifier = "tab-" + editorsParent.children.length;
        var normalizedSearch = (window.location.search.length > 1) ? window.location.search : "";
        var generatedId = window.location.pathname + normalizedSearch + "#/" + plainLocalIdentifier;
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

        for (var i = 0; i < htmlLines.length; i++) {
            var line = document.createElement("tr");

            var lineNum = document.createElement("th");
            var numSpan = document.createElement("span");
            numSpan.textContent = (i + 1);
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



    function setUserStyle(style) {
        __userStyle = style;
        localStorage.setItem("user-style-prefs", JSON.stringify(style));
    }

    function addSettingsTab() {
        var tabPanel = document.createElement("form");
        tabPanel.classList.add("editor-settings-tab");

        var tabPanelHeading = document.createElement("h2");
        tabPanelHeading.textContent = "Code Formatting Settings";
        tabPanel.appendChild(tabPanelHeading);

        var oldStyle = getUserStyle();

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
                    label: "<em>Loosely</em> space the code. Includes spaces added after <code>for</code> and <code>if</code> statements.<blockquote><pre><code>public static void main (String[] args) {\n    if (3 * 3 > 5) {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: "",
                    checked: !oldStyle.spaceAfterStatement,
                    label: "Space the code out the <em>default</em> amount. This option will still indent code and make newlines, but won't include extra spacing inside parentheses or spaces after  <code>for</code> and <code>if</code> statements. <blockquote><pre><code>public static void main(String[] args) {\n    if(3*3>5) {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: "dense",
                    checked: oldStyle.spaceAfterStatement == "dense",
                    label: "<em>Minify</em> the code. This will pack all of your code onto one line and try to make it as small as possible. It also removes all comments. <blockquote><pre><code>public static void main(String[] args) {if(3*3>5) {}}</code></pre></blockquote>"
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
                    label: "<em>Keep</em> comments in the code <blockquote><pre><code>//this method runs when the program starts\npublic static void main(String[] args) {\n    if(3 * 3 > 5) {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: true,
                    checked: !!oldStyle.removeComments,
                    label: "<em>Remove</em> comments from the code completely.<blockquote><pre><code>public static void main(String[] args) {\n    if(3*3>5) {\n        \n    }\n}</code></pre></blockquote>"
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
                    label: "<em>Add the <code>f</code> suffix</em> to floats.<blockquote><pre><code>public static void main (String[] args) {\n    System.out.println(0.4f)\n}</code></pre></blockquote>"
                },
                {
                    value: true,
                    checked: !!oldStyle.leaveOffFloatSuffix,
                    label: "<em>Don't add the <code>f</code> suffix</em> to floats, implicitly making them doubles.<blockquote><pre><code>public static void main (String[] args) {\n    System.out.println(0.4)\n}</code></pre></blockquote>"
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
            heading: "Register Variable Scopes",
            name: "dontRegisterVariables",
            opts: [
                {
                    value: true,
                    checked: !!oldStyle.dontRegisterVariables,
                    label: "<em>Don't register variables</em>. This can save memory and make the code viewer faster, but removes features like variable definition finding and some refactoring features."
                },
                {
                    value: false,
                    checked: !oldStyle.dontRegisterVariables,
                    label: "<em>Register variables</em>. This option will use an internal object to record variables used in the program and link variable usages to their definitions."
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
                    label: "The <code>else</code> should be on a <em>new line</em> from its <code>if</code>'s ending bracket. <blockquote><pre><code>public static void main (String[] args) {\n    if (3 * 3 > 5) {\n        //...\n    }\n    else {\n        //...\n    }\n}</code></pre></blockquote>"
                },
                {
                    value: " ",
                    checked: oldStyle.ifElseNewline == " ",
                    label: "The <code>else</code> should be on the <em>same line</em> as its <code>if</code>'s ending bracket. <blockquote><pre><code>public static void main (String[] args) {\n    if (3 * 3 > 5) {\n        //...\n    } else {\n        //...\n    }\n}</code></pre></blockquote>"
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
                    label: "Single-statement blocks should <em>always</em> have curly brackets. <blockquote><pre><code>if (3 * 3 > 5) {\n    System.out.println(\"hi\");\n}</code></pre></blockquote>"
                },
                {
                    value: "line",
                    checked: oldStyle.singleLineBlockBrackets == "line",
                    label: "Single-statement blocks should <em>never</em> have curly brackets. <blockquote><pre><code>if (3 * 3 > 5) System.out.println(\"hi\");</code></pre></blockquote>"
                },
                {
                    value: "source",
                    checked: oldStyle.singleLineBlockBrackets == "source",
                    label: "Just leave it however the example code was written."
                }
            ]
        }));

        tabPanel.appendChild(createRadioControls({
            heading: "Line Wrap",
            name: "lineWrap",
            opts: [
                {
                    value: "true",
                    checked: oldStyle.lineWrap == "true",
                    label: "Wrap long lines to keep the display narrower. This only affects how code is displayed-- if you copy it, your clipboard copy won't have the wrap."
                },
                {
                    value: "false",
                    checked: oldStyle.lineWrap == "false" || oldStyle.lineWrap == undefined,
                    label: "Scroll sideways instead of wrapping lines"
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
            var userStyle = getUserStyle();
            for (var i = 0; i < formData.length; i++) {
                userStyle[formData[i][0]] = formData[i][1];
            }
            setUserStyle(userStyle);

            startCodeIntelligence(true, true);
        }
        buttonBackground.appendChild(tabPanelSubmitButton);
        buttonParent.appendChild(buttonBackground);
        unmovingButtonSection.appendChild(buttonParent);
        tabPanel.appendChild(unmovingButtonSection);

        var tabButton = document.createElement("button");
        tabButton.textContent = "Format Settings";
        _global.appendToolTab(tabButton, tabPanel);

        //sticky button
        tabButton.addEventListener("click", function () {
            requestAnimationFrame(function waitForLayoutChangeAnim() {

                var top = getYPos(tabPanel);
                var bottomVisibleThreshold = tabPanel.offsetHeight + top - window.innerHeight;

                var containerOffset = 0;

                function anim() {

                    if (toolsTablist.children[selectedToolTabIndex] != tabButton) {
                        buttonParent.style.position = "static";
                        buttonBackground.classList.remove("shadowed");
                        return console.log("no longer sel");
                    }

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