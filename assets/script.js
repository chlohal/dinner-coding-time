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
                    task.cb(event.data.data);
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

    }
}