window.addEventListener("load", function() {
    var cardsParent = document.getElementById("frontpage-testemonial-cards-parent");
    var SCREENS_PER_SEC = 0.0625;
    var MARGIN = 18;
    
    var oldTime = undefined;
    var transformX = 0;
    var hoveringSlowCoef = 1;

    var triggerCardIndex = Math.floor(cardsParent.children.length/2);

    var loopTriggerCard = cardsParent.children[triggerCardIndex];
    var loopTriggerCardBox = loopTriggerCard.getClientRects()[0];
    var loopTriggerCardWidth = loopTriggerCardBox.width;
    var loopTriggerCardX = loopTriggerCardBox.x;

    var isFirstFrameMouseMoving = true;
    var mouseX = 0;
    var oldMouseX = 0;

    var animating = true;

    function anim(time) {
        if(oldTime === undefined) oldTime = time;
        
        var elapsed = time - oldTime;

        transformX -= window.innerWidth * (elapsed/1000) * SCREENS_PER_SEC * Math.abs(hoveringSlowCoef);

        
        if(loopTriggerCardWidth + loopTriggerCardX + MARGIN + transformX < 0) {
            var firstCard = cardsParent.firstElementChild
            
            transformX += firstCard.clientWidth + MARGIN * 2;
            
            cardsParent.removeChild(firstCard);
            cardsParent.appendChild(firstCard);

            loopTriggerCard = cardsParent.children[triggerCardIndex];
            loopTriggerCardBox = loopTriggerCard.getClientRects()[0];
            loopTriggerCardWidth = loopTriggerCardBox.width;
        } else if(loopTriggerCardWidth + loopTriggerCardX + MARGIN + transformX > window.innerWidth) {
            var lastCard = cardsParent.lastElementChild
            
            transformX -= lastCard.clientWidth + MARGIN * 2;
            
            cardsParent.removeChild(lastCard);
            cardsParent.insertBefore(lastCard, cardsParent.firstElementChild);

            loopTriggerCard = cardsParent.children[1];
            loopTriggerCardBox = loopTriggerCard.getClientRects()[0];
            loopTriggerCardWidth = loopTriggerCardBox.width;
        }

        cardsParent.style.transform = `translateX(${transformX}px)`;

        oldTime = time;

        if(cardsParent[isHover](":hover")) {
            animatedSlowDown();

            if(isFirstFrameMouseMoving) {
                isFirstFrameMouseMoving = false;
                oldMouseX = mouseX;
            }
            transformX += (mouseX - oldMouseX)*(1 - hoveringSlowCoef)*0.25;
            oldMouseX = mouseX;
        }
        else {
            animatedSpeedUp();
            isFirstFrameMouseMoving = true;
        }

        

        

        if(animating) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);

    var matchfunc = null, prefixes = ["","ms","moz","webkit","o"], i, m;
    for(i=0; i<prefixes.length; i++) {
        m = prefixes[i]+(prefixes[i] ? "Matches" : "matches");
        if( document.documentElement[m]) {matchfunc = m; break;}
        m += "Selector";
        if( document.documentElement[m]) {matchfunc = m; break;}
    }

    window.isHover = matchfunc;

    function animatedSlowDown() {
        if(hoveringSlowCoef > 0) hoveringSlowCoef -= 0.02;
    }
    function animatedSpeedUp() {
        if(hoveringSlowCoef < 1) hoveringSlowCoef += 0.02;
    }

    cardsParent.addEventListener("mousemove", function(event) {
        mouseX = event.clientX;
    })
});