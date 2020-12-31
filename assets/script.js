document.addEventListener("DOMContentLoaded", function() {
    var slide = document.querySelector(".hero--splash.down");
    if(!slide) return false;
    
    window.requestAnimationFrame(function anim() {
       slide.style.transform = `translateY(${window.scrollY*0.8}px)`;
       window.requestAnimationFrame(anim);
    });
});