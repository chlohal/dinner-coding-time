document.addEventListener("DOMContentLoaded", function() {
    var slide = document.querySelector(".hero--splash.down");
    if(!slide) return false;
    
    window.requestAnimationFrame(function anim() {
       slide.style.transform = `translateY(${window.scrollY*0.2}px)`;
       window.requestAnimationFrame(anim);
    });
});

function loadDep(src, cb) {
    if(src.constructor != Array) src = [src];

    var loaded = 0;
    for(var i = 0; i < src.length; i++) {
        var script = document.createElement("script");
        script.src = "/assets/" + src[i];
        script.onload = function() {
            loaded++;
            if(loaded == src.length && cb) cb();
        }
        document.head.appendChild(script);
    }
    
}