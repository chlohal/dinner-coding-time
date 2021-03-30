(function() {

    function onloadSendPageview(isSPA, referrerOverride) {
    
    var xhr = new XMLHttpRequest(),
    url = "/count/page-count?rec=1&apiv=1&send_image=0",
    sitecode = "3";
    
    var purl = window.location.toString(),
    rand = Math.floor(Math.random()*100000),
    referrer = referrerOverride || document.referrer || "",
    titleElem = document.getElementsByTagName("title")[0],
    title = purl;
    
    var pageLoadTime = 0;
    var networkTime = 0, serverTime = 0, transferTime = 0, domProcessingTime = 0, domCompletionTime = 0, onloadTime = 0;
    
    if(window.performance && !isSPA) {
        var perfData = window.performance.getEntriesByType ? window.performance.getEntriesByType("navigation")[0] : window.performance.timing;
        pageLoadTime = Math.max(0, perfData.duration ? perfData.duration : perfData.loadEventEnd - (perfData.navigationStart||0));
    
        if(perfData.domComplete) networkTime = Math.max(0,(perfData.requestStart||0) - (perfData.startTime||perfData.fetchStart||0)),
            serverTime = Math.max(0,(perfData.responseStart || 0) - (perfData.requestStart||0)),
            transferTime = Math.max(0,(perfData.responseEnd||0) - (perfData.responseStart||0)),
            domProcessingTime = Math.max(0,(perfData.domInteractive||0) - (perfData.responseEnd||0)),
            domCompletionTime = Math.max(0,(perfData.domContentLoadedEventEnd||0) - (perfData.domContentLoadedEventStart||0)),
            onloadTime = Math.max(0,(perfData.loadEventEnd||0) - (perfData.loadEventStart||0));
    }
    
    if(titleElem) title = titleElem.textContent;
    
    xhr.open("GET", url + "&idsite=" + sitecode +
            "&url=" + encodeURIComponent(purl) +
            "&rand=" + rand +
            "&urlref=" + encodeURIComponent(referrer) +
            "&action_name=" + encodeURIComponent(title) +
            (isSPA ? "" : "&gt_ms=" + pageLoadTime +
            "&pf_net=" + networkTime +
            "&pf_srv=" + serverTime +
            "&pf_tfr=" + transferTime +
            "&pf_dm1=" + domProcessingTime +
            "&pf_dm2=" + domCompletionTime +
            "&pf_onl=" + onloadTime ));
    
    xhr.send();
    
    }

    window.__onloadSendPageview = onloadSendPageview;
    
    if(window.addEventListener) {
        window.addEventListener("load", function() {
            setTimeout(onloadSendPageview,1000);
        });
    } else {
        onloadSendPageview();
    }
    
    })();
    