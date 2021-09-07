(function () {
    var MODAL_HTML = `
    <strong>This ad does not use your information.</strong>
    <br>All ads on Dinner Coding Time are context-based, reviewed by humans and controlled by first-party systems. 
    <br>For more info, see our <a href="/legal/ads">ad policy</a>
    <br>If this ad is inappropriate to you, please <a href="/report-bug">report it</a>
    `;

    window.addEventListener("load", window.scanSpons = function () {
        var spons = Array.from(document.getElementsByClassName("spon"));
        if (spons.length == 0) {
            spons = [addDynamicContainer()];
        }

        for (var i = spons.length - 1; i >= 0; i--) {
            var spon = spons[i];
            if (spon.hasAttribute("data-spon-modal-added")) continue;
            spon.setAttribute("data-spon-modal-added", "true");
            spon.appendChild(makeSponInfoButton());
        }
    });

    window.__reloadSpons = function () {
        var spons = Array.from(document.getElementsByClassName("spontent"));
        for (var i = spons.length - 1; i >= 0; i--) {
            spons[i].innerHTML = "";
            getDynamicFill(spons[i]);
        }
    }

    function makeSponInfoButton() {
        var button = document.createElement("button");
        button.setAttribute("aria-label", "Sponsor Information")
        button.innerHTML = `<svg viewBox="0 0 33.866666 33.866668"><path d="m 16.93385,2.7124717 c -7.8422346,0 -14.2208373,6.3785976 -14.2208373,14.2208373 0,7.842231 6.3786027,14.22032 14.2208373,14.22032 7.842236,0 14.220322,-6.378089 14.220322,-14.22032 0,-7.8422397 -6.378086,-14.2208373 -14.220322,-14.2208373 z m 0,2.0251994 c 6.746921,0 12.195122,5.4487179 12.195122,12.1956379 0,6.746921 -5.448201,12.195123 -12.195122,12.195123 -6.74692,0 -12.1956376,-5.448202 -12.1956378,-12.195123 0,-6.74692 5.4487178,-12.1956379 12.1956378,-12.1956379 z m 0.151413,3.1827516 c -0.49539,0 -0.885764,0.1354466 -1.170988,0.40566 -0.285224,0.2551999 -0.427881,0.60798 -0.427881,1.0583333 0,0.4353468 0.142657,0.780396 0.427881,1.035596 0.285224,0.2552 0.675598,0.382922 1.170988,0.382922 0.49539,0 0.885763,-0.127722 1.170987,-0.382922 0.285225,-0.2552 0.427881,-0.6002492 0.427881,-1.035596 0,-0.4503533 -0.142656,-0.8031334 -0.427881,-1.0583333 -0.285224,-0.2702134 -0.675597,-0.40566 -1.170987,-0.40566 z m -4.616256,5.1118323 v 1.846399 h 3.82819 v 8.691977 H 11.90625 V 25.41703 H 22.489584 V 23.570631 H 18.323946 V 13.032255 Z"></svg>`
        button.classList.add("sponfo");
        button.setAttribute("tabindex", "0");

        button.addEventListener("click", function () {
            var rect = button.getClientRects()[0];
            var x = window.scrollX + rect.x + (rect.width / 2);
            var y = window.scrollY + rect.y + (rect.height / 2);
            makeModal(x, y, MODAL_HTML, button);
        })
        return button;
    }

    function makeModal(x, y, html, button) {
        var elem = document.createElement("dialog");
        elem.setAttribute("open", "true");
        elem.setAttribute("tabindex", "0");
        elem.innerHTML = html;
        elem.style.left = x + "px";
        elem.style.top = y + "px";

        elem.classList.add("sponalog");

        document.body.appendChild(elem);
        elem.focus();

        var diaBox = elem.getClientRects()[0];
        if (diaBox.y + diaBox.height >= window.innerHeight) {
            elem.style.top = (y - (diaBox.y + diaBox.height - window.innerHeight)) + "px";
        }
        if (diaBox.x + diaBox.width >= window.innerWidth) {
            elem.style.left = (x - (diaBox.x + diaBox.width - window.innerWidth)) + "px";
        }

        //prevent the focus from exiting the page, since if it does that, it can't be summoned back
        var focusme = document.createElement("span");
        focusme.setAttribute("tabindex", 0);
        document.body.appendChild(focusme);

        elem.addEventListener("focusout", function (event) {
            if (!event.relatedTarget || event.relatedTarget.parentElement != elem) {
                button.focus();
                document.body.removeChild(elem);
                document.body.removeChild(focusme);
            }
        });
    }

    function addDynamicContainer() {
        var container = document.createElement("div");
        container.classList.add("spon");

        var spontent = document.createElement("div");
        spontent.classList.add("spontent");
        getDynamicFill(spontent);
        container.appendChild(spontent);

        var footer = document.getElementsByTagName("footer")[0];
        if (footer) {
            footer.parentElement.insertBefore(container, footer);
        }

        return container;
    }

    function getDynamicFill(parent, downstreamUrl) {
        var url = downstreamUrl || "https://www.videosprofitnetwork.com/watch.xml?key=4753ca5f9676cce88d784b428c765f00";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", proxify(url));
        xhr.onload = function () {
            var domParser = new DOMParser();
            var xml = domParser.parseFromString(xhr.responseText, "text/xml");
            renderDynamicFill(parent, xml);
        }
        xhr.send();
    }

    function renderDynamicFill(parent, xml) {
        if (getTagElementContent(xml, "Impression")) {
            sendCallback(xml.getElementsByTagName("Impression")[0].textContent);
        }
        var link = document.createElement("a");
        link.style.display = "block";
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "sponsored noopener");

        link.setAttribute("href", proxify(getTagElementContent(xml, "ClickThrough")));
        if (link.getAttribute("href") == "") link.removeAttribute("href");


        parent.appendChild(link);

        if (getTagElementContent(xml, "ClickTracking")) {
            link.addEventListener("click", function () {
                sendCallback(getTagElementContent(xml, "ClickTracking"));
            });
        }

        //child ads
        if (getTagElementContent(xml, "VASTAdTagURI")) {
            getDynamicFill(link, getTagElementContent(xml, "VASTAdTagURI"));
        } else {
            //ad title
            var adTitle = getTagElementContent(xml, "AdTitle");
            if (adTitle) {
                var titleElem = document.createElement("h2");
                titleElem.setAttribute("style", 'margin:0;font-size:1em');
                titleElem.textContent = adTitle;
                link.appendChild(titleElem);
            }

            var mediaFileSrc = "";

            //ad parameters. If it's one of the formats we know, just handle it ourselves
            var adParams = getTagElementContent(xml, "AdParameters");
            if(adParams) {
                var adParamsJson = {};
                try {
                    adParamsJson = JSON.parse(adParams);
                } catch(e) {}

                if (adParamsJson.video_id) {
                    mediaFileSrc = generateYoutubeEmbedUrl(adParamsJson.video_id);
                }
            }

            var mediaFileElems = xml.getElementsByTagName("MediaFile");
            for(var i = 0; i < mediaFileElems.length; i++) {
                if(isAllowedMediaType(mediaFileElems[i].getAttribute("type"))) {
                    mediaFileSrc = mediaFileElems[i].textContent;
                }
            }

            if(mediaFileSrc) {
                var iframe = document.createElement("iframe");
                    iframe.src = proxify(mediaFileSrc);
                    iframe.setAttribute("style", 'display:block;margin:auto;height:200px');
                    link.appendChild(iframe);
            }


            //ad description
            var adDescription = getTagElementContent(xml, "Description");
            if (adDescription) {
                var descElem = document.createElement("p");
                descElem.setAttribute("style", 'margin:0');
                descElem.textContent = adDescription;
                link.appendChild(descElem);
            }
        }

    }

    function isAllowedMediaType(mimeType) {
        return (["video/mkv", "video/mp4", "image/png", "image/jpg"]).includes(mimeType);
    }

    function generateYoutubeEmbedUrl(videoId) {
        return "https://youtube.com/embed/" + videoId
            + "?origin=" + encodeURIComponent(window.location.origin);
    }

    function getTagElementContent(xml, tag) {
        return (xml.getElementsByTagName(tag)[0] || {}).textContent || "";
    }

    function sendCallback(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", proxify(url));
        xhr.send();
    }

    function proxify(url) {
        if (!url || !url.startsWith) return url;

        if (url.startsWith("https://www.videosprofitnetwork.com/watch.xml")) {
            return url.replace("https://www.videosprofitnetwork.com/watch.xml", "/proxy/vpnetwork/watch");
        }
        else if (url.startsWith("https://www.videosprofitnetwork.com/impr.gif?sid=")) {
            return url.replace("https://www.videosprofitnetwork.com/impr.gif?sid=", "/proxy/vpnetwork/view?dat=");
        }
        else if (url.startsWith("https://www.videosprofitnetwork.com/clk.gif")) {
            return url.replace("https://www.videosprofitnetwork.com/clk.gif", "/proxy/vpnetwork/click");
        }
        else if (url.startsWith("https://cdn.cloudvideosa.com")) {
            return url.replace("https://cdn.cloudvideosa.com", "/proxy/cloudvideocdn");
        }
        else {
            return url;
        }
    }
})();