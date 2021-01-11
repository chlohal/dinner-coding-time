document.addEventListener("DOMContentLoaded", function() {
    var slide = document.querySelector(".hero--splash.down");
    if(!slide) return false;
    
    window.requestAnimationFrame(function anim() {
       slide.style.transform = `translateY(${window.scrollY*0.7}px)`;
       window.requestAnimationFrame(anim);
    });
});

function loadDep(src, cb) {
    var script = document.createElement("script");
    script.src = "/assets/" + src;
    if(cb) script.onclick = cb;
    document.head.appendChild(script);
}