(function() {
    if(window.location.search.indexOf("q=") == -1) return console.warn("no search");
    
    var searchResults = document.getElementById("search-results");

    var query = decodeURIComponent(window.location.search.replace("?q=", "").replace(/\+/g, " "));
    
    document.getElementById("search-form-input").value = query;
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/search?q=" + encodeURIComponent(query));
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        if(response.errorMessage) {
            alert(response.errorMessage);
            return false;
        }
        for(var i = 0; i < response.length; i++) {
            var li = document.createElement("li");
            
            var blockLink = document.createElement("a");
            blockLink.href = response[i].address;
            
            var header = document.createElement("h2");
            header.textContent = response[i].title;
            blockLink.appendChild(header);
            
            var link = document.createElement("a"); 
            link.classList.add("search-result--href");
            link.textContent = response[i].address;
            link.href = response[i].address;
            blockLink.appendChild(link);
            
            var summary = document.createElement("p");
            
            var summaryText = "";
            var lastIndex = 0;
            for(var j = 0; j < response[i].indices.length; j++) {
                summaryText += response[i].summary.substring(lastIndex, response[i].indices[j][0]) 
                + "<strong>" + response[i].summary.substring(response[i].indices[j][0], response[i].indices[j][1]) + "</strong>";
                
                lastIndex = response[i].indices[j][1];
                
                console.log(summaryText);
            }
            
            summaryText += response[i].summary.substring(lastIndex);
            
            summary.innerHTML = summaryText;
            
            blockLink.appendChild(summary);
            
            li.appendChild(blockLink);
            searchResults.appendChild(li);
        }
    }
    xhr.send();
})();