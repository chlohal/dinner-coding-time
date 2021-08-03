var TITLE_SUFFIX = " | Dinner Coding Time";
/**
 * 
 * @param {import("./parse-controller").Page} page The page to describe
 */
module.exports = function(page) {
    if(page.location.endsWith("index.html")) return false;
    if(!page.location.startsWith("/codehs")) return false;
    
    var h1 = page.document.getElementsByTagName("h1")[0];
    var titleName = h1 ? h1.textContent + TITLE_SUFFIX : "";

    var title = page.document.getElementsByTagName("title")[0];
    if(title) title.textContent = titleName;

    return page;
}