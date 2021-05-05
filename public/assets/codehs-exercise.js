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

    (_global.addTopNavigation = function addTopNavigation() {
        var main = document.querySelector("main");
        console.log(window.codehsIndex);

        if(typeof window.codehsIndex  === "undefined") var codehsIndex = [["/codehs/java/1/2/welcome-program","1-2-5"],["/codehs/java/1/2/ascii-art","1-2-6"],["/codehs/java/1/2/fixing-a-paragraph","1-2-7"],["/codehs/java/1/2/making-popcorn","1-2-8"],["/codehs/java/1/2/personal-timeline","1-2-9"],["/codehs/java/1/3/our-first-integer","1-3-5"],["/codehs/java/1/3/answering-questions","1-3-8"],["/codehs/java/1/3/team-rankings","1-3-9"],["/codehs/java/1/4/weight-of-a-pyramid","1-4-6"],["/codehs/java/1/4/add-fractions","1-4-7"],["/codehs/java/1/4/freely-falling-bodies","1-4-8"],["/codehs/java/1/5/work-shift","1-5-5"],["/codehs/java/1/5/my-age","1-5-6"],["/codehs/java/1/6/my-age-user-input","1-6-4"],["/codehs/java/1/6/night-out","1-6-5"],["/codehs/java/1/6/mla-citation","1-6-6"],["/codehs/java/1/7/casting-to-an-int","1-7-4"],["/codehs/java/1/7/casting-to-a-double","1-7-5"],["/codehs/java/1/7/movie-ratings","1-7-8"],["/codehs/java/1/7/integer-overflow","1-7-11"],["/codehs/java/2/1/pizza-instance-variables","2-1-8"],["/codehs/java/2/1/phone-skeleton","2-1-9"],["/codehs/java/2/2/using-the-rectangle-class","2-2-6"],["/codehs/java/2/2/student-gpa-field","2-2-7"],["/codehs/java/2/2/instance-variables-for-your-dog","2-2-8"],["/codehs/java/2/2/pizza-time","2-2-9"],["/codehs/java/2/3/plain-coffee","2-3-7"],["/codehs/java/2/3/custom-pinatas","2-3-8"],["/codehs/java/2/3/website-class","2-3-9"],["/codehs/java/2/3/empty-references","2-3-10"],["/codehs/java/2/4/hello","2-4-5"],["/codehs/java/2/4/loose-change","2-4-6"],["/codehs/java/2/4/chat-bot","2-4-7"],["/codehs/java/2/4/greetings-and-salutations","2-4-8"],["/codehs/java/2/5/using-the-point-class","2-5-5"],["/codehs/java/2/5/basketball-players","2-5-7"],["/codehs/java/2/5/more-operations","2-5-8"],["/codehs/java/2/5/chat-bot-2-0","2-5-9"],["/codehs/java/2/6/number-games","2-6-6"],["/codehs/java/2/6/construction-costs","2-6-7"],["/codehs/java/2/6/how-far-away-is","2-6-8"],["/codehs/java/2/7/pretty-printing-operations","2-7-7"],["/codehs/java/2/7/full-name","2-7-8"],["/codehs/java/2/7/quotemachine","2-7-9"],["/codehs/java/2/8/speaking","2-8-6"],["/codehs/java/2/8/tostring-for-flowers","2-8-7"],["/codehs/java/2/8/organizing-files","2-8-8"],["/codehs/java/2/8/concatenating-fractions","2-8-9"],["/codehs/java/2/8/word-games","2-8-10"],["/codehs/java/2/9/order-up","2-9-6"],["/codehs/java/2/9/currency","2-9-7"],["/codehs/java/2/9/guess-the-number","2-9-8"],["/codehs/java/2/10/circle-area","2-10-6"],["/codehs/java/2/10/the-unit-circle","2-10-7"],["/codehs/java/2/10/racing","2-10-8"],["/codehs/java/3/1/number-order","3-1-6"],["/codehs/java/3/1/sugar-tax","3-1-7"],["/codehs/java/3/1/triple-double","3-1-8"],["/codehs/java/3/2/discounts","3-2-6"],["/codehs/java/3/2/sweet-or-unsweet","3-2-7"],["/codehs/java/3/2/cooking","3-2-8"],["/codehs/java/3/2/rating","3-2-9"],["/codehs/java/3/3/positive-or-negative","3-3-5"],["/codehs/java/3/3/battleships-move","3-3-6"],["/codehs/java/3/3/ratings","3-3-7"],["/codehs/java/3/3/player-score","3-3-8"],["/codehs/java/3/4/positive-negative-or-zero","3-4-6"],["/codehs/java/3/4/salmon-spawn","3-4-7"],["/codehs/java/3/4/berries","3-4-8"],["/codehs/java/3/4/battleships","3-4-9"],["/codehs/java/3/5/roller-coaster","3-5-6"],["/codehs/java/3/5/compound-roller-coaster","3-5-7"],["/codehs/java/3/5/divisibility","3-5-8"],["/codehs/java/3/5/find-the-minimum","3-5-9"],["/codehs/java/3/6/amusement-park","3-6-5"],["/codehs/java/3/6/odd-numbers","3-6-6"],["/codehs/java/3/6/odd-and-even","3-6-7"],["/codehs/java/3/7/string-variable-trace","3-7-7"],["/codehs/java/3/7/three-strings","3-7-9"],["/codehs/java/3/7/comparing-circles","3-7-10"],["/codehs/java/4/1/making-taffy","4-1-6"],["/codehs/java/4/1/guess-the-number","4-1-7"],["/codehs/java/4/1/divisibility","4-1-8"],["/codehs/java/4/1/max-and-min-values","4-1-9"],["/codehs/java/4/2/print-the-odds","4-2-6"],["/codehs/java/4/2/repeat-100-times","4-2-7"],["/codehs/java/4/2/replace-while-with-for-loop","4-2-8"],["/codehs/java/4/2/replace-for-loop-with-while-loop","4-2-9"],["/codehs/java/4/2/multiplication-table","4-2-10"],["/codehs/java/4/3/replace-letter","4-3-6"],["/codehs/java/4/3/password-checker","4-3-7"],["/codehs/java/4/3/finding-palindromes","4-3-8"],["/codehs/java/4/3/fixing-grammar","4-3-9"],["/codehs/java/4/3/teen-talk","4-3-10"],["/codehs/java/4/4/upright-number-triangle","4-4-6"],["/codehs/java/4/4/make-a-tree","4-4-7"],["/codehs/java/4/4/multiplication-table","4-4-8"],["/codehs/java/4/5/improving-ischar-speed","4-5-7"],["/codehs/java/5/1/access-for-dna-class","5-1-4"],["/codehs/java/5/1/access-for-employee-class","5-1-5"],["/codehs/java/5/1/fixing-circle","5-1-6"],["/codehs/java/5/2/batting-average","5-2-5"],["/codehs/java/5/2/dog-class","5-2-6"],["/codehs/java/5/2/student-overload","5-2-7"],["/codehs/java/5/2/schoolclub-class","5-2-8"],["/codehs/java/5/3/commenting-activity-tracker","5-3-5"],["/codehs/java/5/3/commenting-activity-log","5-3-6"],["/codehs/java/5/3/c-y-o-a-layout","5-3-7"],["/codehs/java/5/3/c-y-o-a-finishing-the-story","5-3-8"],["/codehs/java/5/4/text-messages-getter-methods","5-4-5"],["/codehs/java/5/4/full-dragon-class","5-4-6"],["/codehs/java/5/4/a-different-dragon-class","5-4-7"],["/codehs/java/5/5/rectangle-class","5-5-5"],["/codehs/java/5/5/full-fraction-class","5-5-6"],["/codehs/java/5/5/weekly-routine","5-5-7"],["/codehs/java/5/6/distance-conversions","5-6-5"],["/codehs/java/5/6/food-app-demo","5-6-6"],["/codehs/java/5/6/car-class","5-6-7"],["/codehs/java/5/6/open-response-combination-lock-frq","5-6-8"],["/codehs/java/5/7/randomizer-class","5-7-5"],["/codehs/java/5/7/rock-paper-scissors","5-7-6"],["/codehs/java/5/7/how-many-players-in-the-game","5-7-7"],["/codehs/java/5/8/scope","5-8-7"],["/codehs/java/5/8/which-variables-exist","5-8-8"],["/codehs/java/5/8/broken-calculator","5-8-9"],["/codehs/java/5/9/write-your-own-codehs","5-9-5"],["/codehs/java/5/9/song-class","5-9-6"],["/codehs/java/5/9/fraction-math","5-9-7"],["/codehs/java/6/1/our-first-array","6-1-6"],["/codehs/java/6/1/set-scores","6-1-7"],["/codehs/java/6/1/last-element-in-array","6-1-8"],["/codehs/java/6/1/snap-shot-splash-screen","6-1-9"],["/codehs/java/6/2/print-array","6-2-7"],["/codehs/java/6/2/print-odd-array-indices","6-2-8"],["/codehs/java/6/2/find-index-of-a-string","6-2-9"],["/codehs/java/6/2/fibonacci-sequence","6-2-10"],["/codehs/java/6/3/print-odds","6-3-6"],["/codehs/java/6/3/largest-value","6-3-7"],["/codehs/java/6/3/classroom-array","6-3-8"],["/codehs/java/6/3/array-average","6-3-9"],["/codehs/java/6/4/find-the-median","6-4-6"],["/codehs/java/6/4/find-the-last-multiple-of-3","6-4-7"],["/codehs/java/6/4/most-improved","6-4-8"],["/codehs/java/6/4/car-showroom","6-4-9"],["/codehs/java/7/1/initializing-an-arraylist","7-1-7"],["/codehs/java/7/1/car-inventory","7-1-8"],["/codehs/java/7/2/get-first-element","7-2-6"],["/codehs/java/7/2/arraylist-of-even-numbers","7-2-7"],["/codehs/java/7/2/teacher-class-list","7-2-8"],["/codehs/java/7/2/teacher-class-list-methods","7-2-9"],["/codehs/java/7/3/traversing-odds","7-3-6"],["/codehs/java/7/3/arraylist-helper-methods","7-3-8"],["/codehs/java/7/3/road-trip","7-3-9"],["/codehs/java/7/4/arraylist-equals","7-4-6"],["/codehs/java/7/4/airline-tickets","7-4-7"],["/codehs/java/7/4/billboard-top-10","7-4-8"],["/codehs/java/7/4/user-data-cleanup","7-4-9"],["/codehs/java/7/5/linear-search-on-arraylist-with-while-loop","7-5-6"],["/codehs/java/7/5/fantasy-football-roster","7-5-7"],["/codehs/java/7/6/explore-selection-sort","7-6-4"],["/codehs/java/7/6/explore-insertion-sort","7-6-9"],["/codehs/java/7/6/selection-sort-vs-insertion-sort-run-time","7-6-10"],["/codehs/java/8/1/manipulating-2d-arrays","8-1-5"],["/codehs/java/8/1/complete-chessboard","8-1-6"],["/codehs/java/8/1/tic-tac-toe-board","8-1-7"],["/codehs/java/8/2/sum-rows-in-a-2d-array","8-2-7"],["/codehs/java/8/2/tic-tac-toe-methods","8-2-8"],["/codehs/java/9/1/person-student-object","9-1-6"],["/codehs/java/9/1/books","9-1-7"],["/codehs/java/9/1/computers","9-1-8"],["/codehs/java/9/1/more-animals","9-1-9"],["/codehs/java/9/2/students","9-2-6"],["/codehs/java/9/2/instruments","9-2-7"],["/codehs/java/9/2/foods","9-2-8"],["/codehs/java/9/2/clothing-store","9-2-9"],["/codehs/java/9/3/dogs-bark","9-3-6"],["/codehs/java/9/3/electric-cars","9-3-7"],["/codehs/java/9/3/online-companies","9-3-8"],["/codehs/java/9/4/squares","9-4-6"],["/codehs/java/9/4/bank-accounts","9-4-7"],["/codehs/java/9/4/employees","9-4-8"],["/codehs/java/9/4/student-test-scores","9-4-9"],["/codehs/java/9/5/pies","9-5-6"],["/codehs/java/9/5/creating-equals","9-5-7"],["/codehs/java/9/5/online-companies-revisited","9-5-8"],["/codehs/java/9/5/assignments","9-5-9"],["/codehs/java/9/6/which-team","9-6-6"],["/codehs/java/9/6/cars","9-6-7"],["/codehs/java/9/6/library-books","9-6-8"],["/codehs/java/9/6/fun-with-solids","9-6-9"],["/codehs/java/9/7/equal","9-7-6"],["/codehs/java/9/7/equals-part-2","9-7-7"],["/codehs/java/9/7/equal-rectangles","9-7-8"],["/codehs/java/9/7/2d-array-tester","9-7-9"],["/codehs/java/10/1/factorial","10-1-6"],["/codehs/java/10/1/countdown","10-1-7"],["/codehs/java/10/1/recursive-minimum","10-1-8"],["/codehs/java/10/1/bacteria-cultures","10-1-9"],["/codehs/java/10/2/exploring-binary-searches","10-2-6"],["/codehs/java/10/2/comparing-binary-search-and-linear-search","10-2-7"],["/codehs/java/10/2/maximum-iterations","10-2-8"],["/codehs/java/10/3/explore-merge-sort","10-3-6"],["/codehs/java/10/3/merge-sort-benchmark-testing","10-3-7"],["/codehs/java/10/3/recursive-calls","10-3-8"],["/codehs/java/10/3/sort-benchmark-testing","10-3-9"]];
        else var codehsIndex = window.codehsIndex;

        var self = location.pathname;
        var selfIndex = codehsIndex.findIndex(function(x) {return x[0] == self});

        var previous = codehsIndex[selfIndex - 1];
        var next = codehsIndex[selfIndex + 1];


        var whetherToInitContainer = !topNavigationLinks[0];

        var navContainer = document.createElement("div");
        navContainer.classList.add("assignment-navigation");


        if (whetherToInitContainer) topNavigationLinks[0] = document.createElement("a");
        topNavigationLinks[0].textContent = previous ? ("Previous: " + getTitleFromAddress(previous[1])) : "";
        topNavigationLinks[0].style.cursor = previous ? "" : "default";
        topNavigationLinks[0].href = previous ? previous[0] : "";
        if (whetherToInitContainer) navContainer.appendChild(topNavigationLinks[0]);

        if (whetherToInitContainer) {
            var bull = document.createElement("span");
            bull.innerHTML = "&nbsp;&bull;&nbsp;";
            bull.classList.add("assignment-navigation--bullet");
            navContainer.appendChild(bull);
        }


        if (whetherToInitContainer) topNavigationLinks[1] = document.createElement("a");
        topNavigationLinks[1].textContent = next ? ("Next: " + getTitleFromAddress(next[1])) : "";
        topNavigationLinks[1].style.cursor = next ? "" : "default";
        topNavigationLinks[1].href = next ? next[0] : "";
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

                if (path.match(/^\/codehs\/java/) && !link.hasAttribute("data-is-default-prevented")) {
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

    window.addEventListener("popstate", function (event) {
        if (event.state) navigateToSpaPath(event.state);
    })
    function navigateToSpaPath(path) {
        var partialAddress = path.replace("codehs", "-partials/codehs");
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
            if (xhr.status != 200 && force !== true) return window.location.replace(path);

            var loadedFromCache = !!partialCache[partialAddress];
            partialCache[partialAddress] = xhr.response || data;

            window.initialTabIdx = -1;
            history.pushState(path, "", path);

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
            initialTabIdx = -1
            executeDependencyFunction("parsers/java/ast-tools.js", "clearVariableRegistry", [], function () {
                removeTransientTabs();
                _global.findAndExecuteDataScripts();
                _global.garbageCleanEditors();
                _global.loadEditors();
                _global.loadCodeIntelligence(localStorage.getItem("override-data-saver"), codeIntelligenceLoaded);
                _global.addTopNavigation();
                _global.registerSpaLinks();
                _global.updateByline();

                if (typeof window.__onloadSendPageview === "function") window.__onloadSendPageview(true, originalUrl);
            });
        }

        if (partialCache[partialAddress]) onLoadPartial(true, partialCache[partialAddress]);
        else xhr.send();
    }
    
    function getTitleFromAddress(str, sep) {
        var lastSlash = str.lastIndexOf("/");
        var slug = str.substring(lastSlash + 1);
        var slugWords = slug.split("-");
        var slugWordsCap = slugWords.map(function(x) {
            return x.charAt(0).toUpperCase() + x.substring(1);
        });
        var title = slugWordsCap.join(sep || ".");
        return title;
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

            byline.appendChild(document.createTextNode("Annotated by "));

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
            if (!isNaN(tIndex)) initialTabIdx = tIndex;;
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
                var lang = "java";
                var editorArray = Object.values(editors);
                for (var i = 0; i < editorArray.length; i++) {
                    (function () {
                        var editor = editorArray[i];
                        if (editor.onLoadCodeIntelligence) requestAnimationFrame(function () {
                            editor.onStartLoadingCodeIntelligence();
                        });
                    })();
                    lang = editorArray[i].language || lang;
                }
                loadDep([], ["parsers/" + lang + "/explainer.js", "name-manager.js"], function () {
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

        var language = source.getAttribute("language") || window.defaultEditorLanguage || "java";

        var sourceContent = source.textContent.trim();
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
        var titleRegexp = (/class\s+(\w+)( extends \w+)?( implements (\w+, *)+)?(\s|\n)*{/).exec(sourceContent);
        var fileName = source.getAttribute("data-filename") || (titleRegexp ? titleRegexp[1] + "." + language : sourceContent.substring(0, 32).replace(/\n/g, " ") + "...");
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
                    if (ast.error) return showErrorAndFallback(ast.error, ed);

                    window.ast = ast;
                    ed.ast = ast;

                    ed.loaderMessage.textContent = "Formatting source tree";

                    executeDependencyFunction("parsers/" + ed.language + "/ast-tools.js", "astToString", [ast, userStyle, ["@" + ed.exercise]], function (astSource) {
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

                ed.loaderMessage.textContent = "Parsing " + ed.language + " code";

                if (sourceContent.trim() == "") {
                    makeNumberedLinesTable(["### If you somehow got to this unlisted page ###", "Sorry, this exercise hasn't been done yet.", "All of these are manually filled by one person, so it takes a bit for them to be finished", "I'm doing Chapter 9 right now, so all chapters, 1 to 10, will be done soon, I promise.", "I apologize for the delay."], ed.table);
                    ed.astHtmlSource = "";
                    ed.table.hidden = false;
                    ed.parent.classList.remove("code-with-lines--loading");
                    return;
                }
                if (ed.ast) printToTable(ed.ast);
                else executeDependencyFunction("parsers/" + language + "/parser.js", "parse", [sourceContent], printToTable);
            } catch (e) {
                showAlert({
                    text: `Error in activating Code Intelligence on ${fileName}.`,
                    exitButton: true
                });
                console.error(e);

                return;
            }


        }

        function showErrorAndFallback(errorMessage, ed) {
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

        var exercise = window.location.pathname.replace("codehs/", "");

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
            language: language,
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
        executeDependencyFunction("hljs-worker.js", "getLineAddresses", [source], function (lineAddresses) {
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

        anno.innerHTML = html;

        return anno;
    }

    function appendTab(tab, tabpanel, parent) {
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

        //use lightweight highlighter 
        var codeblocks = tabPanel.querySelectorAll("pre code");
        for (var i = 0; i < codeblocks.length; i++) {
            (function (i) {
                executeDependencyFunction("hljs-worker.js", "highlightAuto", [codeblocks[i].innerText], function (data) {
                    codeblocks[i].innerHTML = data;
                });
            })(i);
        }

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
            console.log("ee");
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