
var preparseCode = require("./pre-parse.js");
var generatePartials = require("./generate-partials.js");
var updateCodehsTitles = require("./update-codehs-titles.js");
var addMetaDescriptionOpenGraph = require("./add-meta-description-open-graph.js");

var fakeDom = require("./fake-dom.js");

var worker_threads = require('worker_threads');

var DEBUG = true;
var POOL_SIZE = 20;

/**
 * @type {workpoolunit[]}
 */
var pool = [];

var queue = [];
var nonceId = 0;
var nonces = {};

/**
 * @typedef workpoolunit
 * @property {boolean} open
 * @property {Worker} worker
 */

if (worker_threads.isMainThread) {

    for (var i = 0; i < POOL_SIZE; i++) {
        (function () {
            /**
             * @type {workpoolunit}
             */
            var workpoolunit = {
                worker: new worker_threads.Worker(__filename),
                open: false
            };
            workpoolunit.worker.on("message", function (value) {
                if (value.t == "result") {
                    if(DEBUG) console.log("finished job " + value.nonce)
                    nonces[value.nonce](value.fileContent);

                    if (queue.length) workpoolunit.worker.postMessage(queue.pop());
                    else workpoolunit.open = true;
                } else if (value.t == "ready") {
                    if (queue.length) workpoolunit.worker.postMessage(queue.pop());
                    else workpoolunit.open = true;
                }
            });
            pool.push(workpoolunit);
        })();
    }

    module.exports = {
        giveJob: function (fileContent, location, cb) {
            var openWorker = pool.find(x => x.open);

            var nonce = nonceId++;
            nonces[nonce] = cb;

            var job = {
                nonce: nonce,
                fileContent: fileContent,
                location: location,
                t: "job"
            };

            if (openWorker) openWorker.worker.postMessage(job);
            else queue.push(job);
        },
        close: function() {
            for(var i = 0; i < pool.length; i++) {
                pool[i].worker.unref();
            }
        }
    };
} else {
    worker_threads.parentPort.on("message", function (value) {
        var fileContent = value.fileContent;
        var location = value.location;

        if(DEBUG) console.log("child_labor");

        var html = fakeDom.parseHTML(fileContent);
        var document = fakeDom.makeDocument(html);

        var page = makePage(document, location);

        if (DEBUG) console.log("Pre-parsing code...");
        preparseCode(page);
        if (DEBUG) console.log("Generating paritals...");
        generatePartials(page);
        if (DEBUG) console.log("Updating titles...");
        updateCodehsTitles(page);
        if (DEBUG) console.log("Adding descriptions & OpenGraph...");
        addMetaDescriptionOpenGraph(page);
        worker_threads.parentPort.postMessage({
            nonce: value.nonce,
            fileContent: document.innerHTML,
            t: "result"
        });
    });
    worker_threads.parentPort.postMessage({ t: "ready" });
    if(DEBUG) console.log("child_ready");
}


/**
 * Make a page from a document and location
 * @param {import("./fake-dom").FakeDomNode} document A #root node representing the document of the page.
 * @param {string} location The location of the page, equal to the window.location.pathname property in a browser.
 * @returns {Page} The page
 */
function makePage(document, location) {
    return {
        location: location,
        document: document
    };
}