if(typeof window.DCT_BRANCH === "undefined") window.DCT_BRANCH = "dev";

document.addEventListener("DOMContentLoaded", function () {
    //add sliding to header splash
    (function() {
        var slide = document.querySelector(".hero--splash.down");
        if (!slide) return false;

        window.requestAnimationFrame(function anim() {
            slide.style.transform = `translateY(${window.scrollY * 0.2}px)`;
            window.requestAnimationFrame(anim);
        });
    })();
    
    var header = document.querySelector("header");
    if(window.innerWidth < 900) {
        header.classList.add("mobile");
        
        var headerNavOpen = false;
        var opener = document.getElementById("mobile-menu-opener"),
            lightbox = document.getElementById("menu-lightbox"),
            openIcon = document.getElementById("mobile-menu-opener-open"),
            closeIcon = document.getElementById("mobile-menu-opener-close");
        opener.addEventListener("click", function() {
            headerNavOpen = !headerNavOpen;
            if(headerNavOpen) {
                header.classList.add("open");
                opener.setAttribute("aria-label", DCT_LANG.format("HEADER_NAV_TOGGLE_BUTTON_CLOSE_LABEL"));
                
                closeIcon.style.display = "block";
                openIcon.style.display = "none";
            } else {
                header.classList.remove("open");
                opener.setAttribute("aria-label", DCT_LANG.format("HEADER_NAV_TOGGLE_BUTTON_OPEN_LABEL"));
                
                closeIcon.style.display = "none";
                openIcon.style.display = "block";
            }
        });
        lightbox.addEventListener("click", function() {
            header.classList.remove("open");
            opener.setAttribute("aria-label", DCT_LANG.format("HEADER_NAV_TOGGLE_BUTTON_OPEN_LABEL"));
            
            closeIcon.style.display = "none";
            openIcon.style.display = "block";
        });
    } 
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
    xhr.open("GET", "/count/page-count?rec=1&idsite=1" +
            "&url=" + encodeURIComponent(window.location) +
            "&rand=" + Math.floor(Math.random()*10000) +
            "&e_c=" + encodeURIComponent(category) + "&e_a=" + encodeURIComponent(action) + "&e_n=" + encodeURIComponent(name)  + "&e_v=" + value + 
            "&dimension1=" + encodeURIComponent(window.DCT_BRANCH || "dev")
            );
    if(cb) xhr.onload = cb;
    xhr.send();
}

(function createHelpfulnessFeedbackThing() {
    if(window.location.pathname == "/" || window.location.pathname.includes("contribute")) return false;

    var main = document.querySelector("main");

    if(!main) return false;

    var sentYesno = false;

    var parent = document.createElement("form");
    parent.classList.add("helpfulness-form");

    var heading = document.createElement("h2");
    heading.textContent = DCT_LANG.format("HELPFULNESS_FORM_TITLE") || "Was this helpful?";
    parent.appendChild(heading);

    var why = document.createElement("div");
    why.classList.add("helpfulness-form--why-input");
    why.style.display = "none";
    why.setAttribute("aria-hidden", "true");
    parent.appendChild(why);

    var whyInput = document.createElement("textarea");
    why.appendChild(whyInput);
    whyInput.addEventListener("keypress", function() {
        whyCharLimitDisplay.textContent = whyInput.value.length + " / 250";
    });
    whyInput.addEventListener("keyup", function() {
        whyCharLimitDisplay.textContent = whyInput.value.length + " / 250";
    });

    var whyCharLimitDisplay = document.createElement("span");
    whyCharLimitDisplay.classList.add("helpfulness-form--why-input-char-limit");
    whyCharLimitDisplay.textContent = "0 / 250"
    why.appendChild(whyCharLimitDisplay);

    var buttons = document.createElement("div");
    buttons.classList.add("helpfulness-form--buttons");

    var buttonYes = document.createElement("button");
    buttonYes.textContent = "\u2713";
    buttons.appendChild(buttonYes);

    var buttonNo = document.createElement("button");
    buttonNo.textContent = "\u2717";
    buttons.appendChild(buttonNo);

    parent.appendChild(buttons);

    var mParent = document.createElement("div");
    document.body.insertBefore(mParent, main);
    mParent.appendChild(main);
    mParent.appendChild(parent);

    buttonYes.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        if(sentYesno) {
            buttonYes.classList.add("helpfulness-form--selected");

            buttonNo.classList.remove("helpfulness-form--selected");

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/count/page-count?rec=1&idsite=1" +
                    "&url=" + encodeURIComponent(window.location) +
                    "&rand=" + Math.floor(Math.random()*10000) +
                    "&dimension2=" + encodeURIComponent(whyInput.value)
                    );
            xhr.send();
        } else {
            sendServerFeedbackFormEvent("dct--form", "dct--helpfulnessForm", "Helpful", 1, function () {
                sentYesno = true;
                parent.classList.add("submission-completed");
                parent.setAttribute("aria-hidden", "true");
            });
        }
    });
    buttonNo.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if(sentYesno) {
            buttonYes.classList.remove("helpfulness-form--selected");

            buttonNo.classList.add("helpfulness-form--selected");
            parent.classList.add("submission-completed");
            parent.setAttribute("aria-hidden", "true");
        } else {

            

            sendServerFeedbackFormEvent("dct--form", "dct--helpfulnessForm", "Not Helpful", -1, function () {
                sentYesno = true;
                addWhy();
            });
        }
    });
    function addWhy() {
        heading.textContent = "Why?";
        why.style.display = "";
        why.setAttribute("aria-hidden", "false");
    }
})();