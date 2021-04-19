(function () {
    //load assignments
    var index = document.getElementById("assignments");

    (function loadXHR() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://kvdb.io/GoRCE7NnJGgv7hahoSXDj5/scripts/getOpenAssignments");

        xhr.onload = function () {
            var resJson = JSON.parse(xhr.response);
            addCodehsAssignments(resJson);
        };

        xhr.send();
    })();

    function addCodehsAssignments(assignments) {
        index.innerHTML = "";
        for (var i = 0; i < assignments.length; i++) {
            index.appendChild(createIndexListItem(assignments[i]));
        }
    }
    function createIndexListItem(href) {
        var li = document.createElement("li");

        var link = document.createElement("a");
        link.href = "/contribute" + href;
        link.textContent = getTitleFromHref(href);
        li.appendChild(link);

        return li;
    }
    function getTitleFromHref(href) {
        return /\d+-\d+-\d+$/.exec(href)[0].replace(/-/g, ".");
    }

    (function randomizeNewNamePlaceholder() {
        document.getElementById("new-assignment-name-input").setAttribute("placeholder", getRandomCodingBatLikeCode());
    })();

    function getRandomCodingBatLikeCode() {
        var topics = ["String", "Array", "Loop", "Recursion"];

        var topic = topics[Math.floor(Math.random() * topics.length)];

        if (Math.random() > 0.5) topic += "-2";
        else topic += "-1";

        var names = ["Fool", "Magician", "Papess", "Empress", "Emperor", "Pope", "Lovers", "Chariot", "Strength", "Hermit", "Wheel", "Justice", "HangedMan", "Death", "Temperance", "Devil", "Tower", "Star", "Moon", "Sun", "Judgement", "World", "AceOfWands", "TwoOfWands", "ThreeOfWands", "FourOfWands", "FiveOfWands", "SixOfWands", "SevenOfWands", "EightOfWands", "NineOfWands", "TenOfWands", "PageOfWands", "KnightOfWands", "QueenOfWands", "KingOfWands", "AceOfCups", "TwoOfCups", "ThreeOfCups", "FourOfCups", "FiveOfCups", "SixOfCups", "SevenOfCups", "EightOfCups", "NineOfCups", "TenOfCups", "PageOfCups", "KnightOfCups", "QueenOfCups", "KingOfCups", "AceOfSwords", "TwoOfSwords", "ThreeOfSwords", "FourOfSwords", "FiveOfSwords", "SixOfSwords", "SevenOfSwords", "EightOfSwords", "NineOfSwords", "TenOfSwords", "PageOfSwords", "KnightOfSwords", "QueenOfSwords", "KingOfSwords", "AceOfCoins", "TwoOfCoins", "ThreeOfCoins", "FourOfCoins", "FiveOfCoins", "SixOfCoins", "SevenOfCoins", "EightOfCoins", "NineOfCoins", "TenOfCoins", "PageOfCoins", "KnightOfCoins", "QueenOfCoins", "KingOfCoins"];

        var name = names[Math.floor(Math.random() * names.length)];

        return topic + "/" + name;
    }


    (function addCreateButtonFunctionality() {
        document.getElementById("create-assignment").addEventListener("click", function () {
            document.getElementById("new-assignment-modal").removeAttribute("hidden");
        });
        
        document.getElementById("new-assignment-modal").addEventListener("click", function(e) {
            console.log(e.target.tagName == "DIALOG");
            if(e.target.tagName == "DIALOG") {
                e.target.parentElement.setAttribute("hidden", "true");
                document.getElementById("create-assignment").focus();
            }
        });

        document.getElementById("new-assignment-submit-button").addEventListener("click", function () {
            var folderInput = document.getElementById("new-assignment-folder-input");
            var nameInput = document.getElementById("new-assignment-name-input");

            if (!folderInput.validity.patternMismatch && !nameInput.validity.patternMismatch && folderInput.value != "" && nameInput.value != "") {
                window.location = ("/contribute/" + folderInput.value + "/" + nameInput.value);
            }
        });
    })();

    (function addValidityChecker() {
        var button = document.getElementById("new-assignment-submit-button");
        var folderInput = document.getElementById("new-assignment-folder-input");
        var nameInput = document.getElementById("new-assignment-name-input");

        var folderInputValidityMessage = document.getElementById("new-assignment-folder-errorlabel");
        var nameInputValidityMessage = document.getElementById("new-assignment-name-errorlabel");

        var reservedFolderKeywords = ["di" + "n".repeat(2) + "ee" + "n", "assets", "versioned", "well-known", "partials", "folder", "public", "netlify", "robots", "index", "api", "contribute", "login", "private", "count", "pub", "p", "s", "shorten", "discord", "about", "legal", "redirect"];
        
        var reservedNameKeywords = ["di" + "n".repeat(2) + "ee" + "n", "assets", "partials", "index", "contribute", "login", "pub", "p", "s", "redirect"];

        function checkValidity() {

            var name = nameInput.value;
            var folder = folderInput.value;

            var nameKeywordInstances = reservedNameKeywords.filter(function (x) { return containsPathTerm(name, x); });
            if (nameKeywordInstances.length > 0) {
                nameInputValidityMessage.textContent = "Reserved keyword" + pluralS(nameKeywordInstances)
                                                        + " " + sentenceList(quoteEach(nameKeywordInstances)) + " may not be used in a name.";
                nameInput.setCustomValidity(nameInputValidityMessage.textContent);
            } else {
                nameInput.setCustomValidity("");
            }
            nameInput.reportValidity();
            
            var folderKeywordInstances = reservedFolderKeywords.filter(function (x) { return containsPathTerm(folder, x); });
            if (folderKeywordInstances.length > 0) {
                folderInputValidityMessage.textContent = "Reserved keyword" + pluralS(folderKeywordInstances)
                                                        + " " + sentenceList(quoteEach(folderKeywordInstances)) + " may not be used as a folder.";
                folderInput.setCustomValidity(folderInputValidityMessage.textContent);
            } else {
                folderInput.setCustomValidity("");
            }
            folderInput.reportValidity();
            
            if(name.trim() == "" || folder.trim() == "") return false; 
            else if (nameInput.validity.patternMismatch || folderInput.validity.patternMismatch) return false;
            else if(nameKeywordInstances.length > 0 || folderKeywordInstances.length > 0) return false;
            else return true;
        }

        nameInput.addEventListener("input", function () {
            button.disabled = !checkValidity();
        });
        folderInput.addEventListener("input", function () {
            button.disabled = !checkValidity();
        });
        
        checkValidity();
    })();

    function containsPathTerm(path, term) {
        return path.toLowerCase().split("/").includes(term.toLowerCase());
    }
    
    function pluralS(array) {
        return array.length > 1 ? "s" : "";
    }
    
    /**
     * Transforms arrays into phrases of the form 'a, b, and c'
     * @param {Array} array An array to transform into a sentence
     */
    function sentenceList(array) {
        if(array.length == 0) return "";
        else if(array.length == 1) return array[0];
        else if(array.length == 2) return array[0] + " and " + array[1];
        else return array.slice(0, -1).join(", ") + ", and " + array[array.length - 1];
    }
    function quoteEach(array) {
        return array.map(function(x) { return "\"" + x + "\""; });
    }
})();