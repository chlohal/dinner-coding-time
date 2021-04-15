(function () {
    //load assignments
    var index = document.getElementById("assignments");

    (function loadXHR() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/contributor/assignments");

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
        link.href = "." + href;
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

        document.getElementById("new-assignment-modal").addEventListener("click", function () {
            var folderInput = document.getElementById("new-assignment-folder-input");
            var nameInput = document.getElementById("new-assignment-name-input");

            if (!folderInput.validity.patternMismatch && !nameInput.validity.patternMismatch && folderInput.value != "" && nameInput.value != "") {
                window.location.replace("/contribute/" + folderInput.value + "/" + nameInput.value);
            }
        });
    })();
})();