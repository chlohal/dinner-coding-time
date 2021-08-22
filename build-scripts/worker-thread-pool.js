
var preparseCode = require("./pre-parse.js");
var generatePartials = require("./generate-partials.js");
var updateCodehsTitles = require("./update-codehs-titles.js");
var addMetaDescriptionOpenGraph = require("./add-meta-description-open-graph.js");

var fakeDom = require("./fake-dom.js");
var fs = require("fs");

var worker_threads = require('worker_threads');

var POOL_SIZE = 20;

/**
 * @type {workpoolunit[]}
 */
var pool = [];

var DEBUG;

var queue = [];
var nonceId = 0;
var nonces = {};
var jobHistory = [];

/**
 * @typedef workpoolunit
 * @property {boolean} open
 * @property {Worker} worker
 */

if (worker_threads.isMainThread) {

    module.exports = {
        setDebug: function(d) {
            DEBUG = d;
        },
        initPool: function(size) {
            size = +size || POOL_SIZE;
            for (var i = 0; i < size; i++) {
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
                            jobHistory.push(value);
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
        },
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
            fs.writeFileSync(__dirname + "/../cache/worker-metrics.json", JSON.stringify(jobHistory, null, 2));
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
        
        var timings = {};
        
        timings.start = Date.now();
        
        if (DEBUG) console.log("Pre-parsing code...");
        preparseCode(page);
        timings.preparseCode = Date.now();
        timings.preparseCodeDuration = timings.preparseCode - timings.start;

        
        if (DEBUG) console.log("Generating paritals...");
        generatePartials(page);
        timings.generatePartials = Date.now();
        timings.generatePartialsDuration = timings.generatePartials - timings.preparseCode;
        
        if (DEBUG) console.log("Updating titles...");
        updateCodehsTitles(page);
        timings.updateCodehsTitles = Date.now();
        timings.updateCodehsTitlesDuration = timings.updateCodehsTitles - timings.generatePartials;
        
        if (DEBUG) console.log("Adding descriptions & OpenGraph...");
        addMetaDescriptionOpenGraph(page);
        timings.addMetaDescriptionOpenGraph = Date.now();
        timings.addMetaDescriptionOpenGraphDuration = timings.addMetaDescriptionOpenGraph - timings.updateCodehsTitles;

        
        timings.end = Date.now();
        timings.totalDuration = timings.end - timings.start;
        
        worker_threads.parentPort.postMessage({
            nonce: value.nonce,
            fileContent: document.innerHTML,
            location: location,
            timings: timings,
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