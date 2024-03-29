(function() {
    var DEFAULT = 100;

    var countElem = document.getElementById("discord-users-counter");
    if(countElem === null) return false;

    function update() {
        countElem.textContent = "...";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://discord.com/api/guilds/826644184567119952/widget.json");

        xhr.onload = function() {
            var memberCount = DEFAULT;
            var json;
            if(xhr.status == 200) {
                try {
                    json = JSON.parse(xhr.responseText);
                    memberCount = json.presence_count;
                } catch(e) {}
            }
            countElem.textContent = memberCount;
            countElem.setAttribute("title", DCT_LANG.format("HOMEPAGE_SOCIAL_PROOF_CARDS_DISCORD_MEMBERS_TOOLTIP", new Date().toLocaleTimeString()));
        }

        xhr.send();
    }
    setInterval(update, 300*1000);
    update();
})();