var dom = require(__dirname + "/fake-dom.js");

var map = dom.createElement("urlset");
map.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

module.exports = {
    add: function(location) {
        var url = dom.createElement("url");

        var loc = dom.createElement("loc");
        loc.textContent = location;

        url.appendChild(loc);
        map.appendChild(url);
    },
    toXml: function() {
        return `<?xml version="1.0" encoding="UTF-8"?>\n${map.outerHTML}`;
    }
}