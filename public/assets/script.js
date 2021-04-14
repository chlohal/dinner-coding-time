document.addEventListener("DOMContentLoaded", function () {
    var slide = document.querySelector(".hero--splash.down");
    if (!slide) return false;

    window.requestAnimationFrame(function anim() {
        slide.style.transform = `translateY(${window.scrollY * 0.2}px)`;
        window.requestAnimationFrame(anim);
    });
});

var loadedDeps = [], depWorkers = {}, callbackNonces = {}, callbackNonceCount = 0;

var SUPPORTS_WEB_WORKERS = !!window.Worker;

function loadDep(src, uiThreadSrc, cb) {
    if (typeof uiThreadSrc === "function") cb = uiThreadSrc;
    if (src.constructor != Array) src = [src];
    if (uiThreadSrc.constructor != Array) uiThreadSrc = [uiThreadSrc];

    var loaded = 0;
    for (var i = 0; i < src.length; i++) {
        if(loadedDeps.includes(src[i])) {
            loaded++;
            if (loaded == src.length + uiThreadSrc.length && cb) cb();
            continue;
        }

        if (SUPPORTS_WEB_WORKERS) createWorker(src[i]);
        else createFallbackDep(src[i]);
    }
    
    for(var i = 0; i < uiThreadSrc.length; i++) {
        if(loadedDeps.includes(uiThreadSrc[i])) {
            loaded++;
            if (loaded == src.length + uiThreadSrc.length && cb) cb();
            continue;
        }

        createFallbackDep(uiThreadSrc[i]);
    }


    function createWorker(srcUri) {
        depWorkers[srcUri] = new Worker("/assets/" + srcUri);
        depWorkers[srcUri].onmessage = function (event) {
            if (event.data.nonce) {
                if (typeof callbackNonces[event.data.nonce] === "object") {
                    var task = callbackNonces[event.data.nonce];
                    task.finished = Date.now();
                    
                    if(event.data.error) task.cb(event.data);
                    else task.cb(event.data.data);
                    
                    task.lag = task.finished - task.sent;
                }
            }
        }
        
        loadedDeps.push(srcUri);
        loaded++;
        if (loaded == src.length + uiThreadSrc.length && cb) cb();
    }

    function createFallbackDep(srcUri) {
        var script = document.createElement("script");
        script.src = "/assets/" + srcUri;
        script.onload = function () {
            loadedDeps.push(srcUri);
            loaded++;
            if (loaded == src.length + uiThreadSrc.length && cb) cb();
        }
        document.head.appendChild(script);
    }

}
function executeDependencyFunction(dep, fn, args, cb) {
    if (window[fn]) {
        cb && cb(window[fn].bind(window, args)());
    } else if (depWorkers[dep]) {
        callbackNonceCount++;
        callbackNonces[callbackNonceCount] = {
            sent: Date.now(),
            cb: cb,
            dep: dep,
            fn: fn
        };
        
        depWorkers[dep].postMessage({
            function: fn,
            args: args,
            nonce: callbackNonceCount
        });

    } else {
        loadDep(dep, [], function() {
            executeDependencyFunction(dep, fn, args, cb);
        })
    }
}

function sendServerFeedbackFormEvent(category, action, name, value, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/count/page-count?rec=1&idsite=3" +
            "&url=" + encodeURIComponent(window.location) +
            "&rand=" + Math.floor(Math.random()*10000) +
            "&e_c=" + encodeURIComponent(category) + "&e_a=" + encodeURIComponent(action) + "&e_n=" + encodeURIComponent(name)  + "&e_v=" + value
            );
    if(cb) xhr.onload = cb;
    xhr.send();
}

(function createHelpfulnessFeedbackThing() {
    if(window.location.pathname == "/" || window.location.pathname.includes("contribute")) return false;

    var main = document.querySelector("main");

    if(!main) return false;

    var parent = document.createElement("form");
    parent.classList.add("helpfulness-form");

    var heading = document.createElement("h2");
    heading.textContent = "Was this page helpful?";
    parent.appendChild(heading);

    var buttons = document.createElement("div");
    buttons.classList.add("helpfulness-form--buttons");

    var buttonYes = document.createElement("button");
    buttonYes.textContent = "\u2713";
    buttons.appendChild(buttonYes);

    var buttonNo = document.createElement("button");
    buttonNo.textContent = "\u2717";
    buttons.appendChild(buttonNo);

    parent.appendChild(buttons);

    main.appendChild(parent);

    buttonYes.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        buttonYes.classList.add("helpfulness-form--selected");

        buttonNo.classList.remove("helpfulness-form--selected");

        sendServerFeedbackFormEvent("dct--form", "dct--helpfulnessForm", "Helpful", 1, function () {
            parent.classList.add("submission-completed");
            parent.setAttribute("aria-hidden", "true");
        });
    });
    buttonNo.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        buttonYes.classList.remove("helpfulness-form--selected");

        buttonNo.classList.add("helpfulness-form--selected");

        sendServerFeedbackFormEvent("dct--form", "dct--helpfulnessForm", "Not Helpful", -1, function () {
            parent.classList.add("submission-completed");
            parent.setAttribute("aria-hidden", "true");
        });
    });
})();