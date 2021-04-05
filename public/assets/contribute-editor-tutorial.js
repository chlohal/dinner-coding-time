var modalLightbox, modal;

var steps = [
    {
        target: ".tutorial-modal--button-container button:nth-child(1)",
        button: "targetClick"
    },
    {
        target: "#pipeline button:nth-child(1)",
        content: "<h3>Step 1: Edit Java</h3> <p>In the first step out of 3, you can touch up the Java code of the solution. <strong>Just click on the file below to edit it!</strong> </p> <p>Please note, however, that this editor is a very minimal, quick-and-dirty thing. It's meant only for touch-ups-- it's not that good for serious coding! If you're trying to code a new challenge, I'd advise writing it somewhere else.</p>",
        continue: "button"
    },
    {
        target: "#pipeline button:nth-child(2)",
        content: "<h3>Step 2: Annotate</h3> <p>Click on the '[Add Annotations]' button to go to the next step.</p>",
        continue: "button",
        clickTargetAction: true
    },
    {
        target: "[aria-hidden=false] th.can-have-annotation",
        content: "<h3>Adding Annotations</h3> <p>Any row with a grey tab on it can have an annotation. You can't annotate <em>any</em> line because of technical limitations.</p><p><strong>Click on the line number</strong> to add one.</p>",
        continue: "button,targetClick",
        clickTargetAction: true,
        delay: 10
    },
    {
        target: ".annotation",
        content: "<h3>Annotating</h3> <p>Write whatever you want! Try to explain the statement or method in a user-friendly way.</p>",
        continue: "button,targetClick",
        clickTargetAction: true,
        anchorX: "center"
    },
    {
        target: "#pipeline button:nth-child(3)",
        content: "<h3>Step 3: Publishing</h3> <p>Click on the '[Review & Publish]' button when finished annotating in order to go to the next step!</p>",
        continue: "button",
        clickTargetAction: true,
        anchorX: "right"
    },
    {
        target: "#review-annotations",
        content: "<h3>See your Annotations</h3> <p>Review your annotations and make sure that everything's looking good! The table might look odd-- that's okay :) If you're not familiar with the statements, don't worry about it. </p>",
        continue: "button"
    },
    {
        target: "#show-tip-editor-check",
        content: "<h3>Add a Tip</h3><p>Is there anything weird about this assignment that people should know right away? You may want to add a tip.</p><p>Tips show up at the top and give important information.</p>",
        anchorX: "right",
        continue: "button",
        clickTargetAction: true
    }
]

function showModal() {
    disableScroll();
    modalLightbox = document.createElement("div");
    modalLightbox.classList.add("tutorial-modal--lightbox");

    document.body.appendChild(modalLightbox);

    modal = document.createElement("dialog");
    modal.classList.add("tutorial-modal--base");

    var modalInner = buildModalContent();
    modal.appendChild(modalInner);

    document.body.appendChild(modal);
    
    requestAnimationFrame(function() {
        showTutorialStep(0);
    });
}

function buildModalContent() {
    var modalInner = document.createElement("div");
    modalInner.classList.add("tutorial-modal--inner");

    var head = document.createElement("h2");
    head.textContent = "It's dangerous to go alone! Take this."
    modalInner.appendChild(head);

    var body = document.createElement("p");
    body.textContent = "It seems like you haven't used the contribution editor before. Would you like to get started with a quick interactive tutorial?";
    modalInner.appendChild(body);

    var buttonContainer = buildModalButtons();
    modalInner.appendChild(buttonContainer);

    return modalInner;
}

function buildModalButtons() {
    var buttonContainer = document.createElement("div");
    buttonContainer.classList.add("tutorial-modal--button-container");

    var yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    buttonContainer.appendChild(yesButton);
    yesButton.addEventListener("click", function () {
        closeModal();
        startTutorial();
        disableScroll();
    });

    var noButton = document.createElement("button");
    noButton.textContent = "No";
    buttonContainer.appendChild(noButton);
    noButton.addEventListener("click", function () {
        closeModal();
    });

    return buttonContainer;
}

function closeModal() {
    if (modalLightbox && modal) {
        if (modalLightbox.parentElement) modalLightbox.parentElement.removeChild(modalLightbox);
        if (modal.parentElement) modal.parentElement.removeChild(modal);
    }
    enableScroll();
}

function startTutorial() {
    showTutorialStep(1);
}

function removeStrayTutorialStep() {
    var steps = Array.from(document.querySelectorAll(".edit-tutorial--pulse"));
    for(var i = 0; i < steps.length; i++) {
        steps[i].parentElement.removeChild(steps[i]);
    }
}

function showTutorialStep(index) {
    removeStrayTutorialStep();
    
    var stepObject = steps[index];
    var targets = Array.from(document.querySelectorAll(stepObject.target));
    var target;
    
    target = targets[Math.floor(Math.random() * Math.min(5, targets.length))];
    
    setTimeout(function() {
        var targetRect = target.getBoundingClientRect();
        
        
        if(stepObject.targetAction) target[stepObject.targetAction]();

        var pulse;
        
        var xPos = targetRect.x + (stepObject.anchorX === "right" ? targetRect.width : stepObject.anchorX === "center" ? targetRect.width/2 : 0);
        var yPos = targetRect.y + (stepObject.anchorY === "bottom" ? targetRect.height : stepObject.anchorY === "center" ? targetRect.height/2 : 0);
        
        if(stepObject.continue === undefined) stepObject.continue = "";
        
        if(stepObject.continue.includes("button")) {
            pulse = buildTutorialPulse(xPos, yPos, stepObject.content, function() {
                pulse.parentElement.removeChild(pulse);
                if(stepObject.clickTargetAction) target.click();
                
                //only continue right away if it's *just* the button
                if(stepObject.continue == "button") {
                    if(steps.length-1 > index) showTutorialStep(index + 1);   
                } 
            });
            document.body.appendChild(pulse);
        } else {
            pulse = buildTutorialPulse(xPos, yPos, stepObject.content);
            document.body.appendChild(pulse);
        }
        
        if(stepObject.continue.includes("targetClick")) target.addEventListener("click", function oneTimeListener() {
            if(pulse.parentElement) pulse.parentElement.removeChild(pulse);
                if(steps.length-1 > index) showTutorialStep(index + 1);
            target.removeEventListener("click", oneTimeListener);
        });
    }, stepObject.delay || 10);
}

function buildTutorialPulse(x, y, html, buttonCb) {
    var pulse = document.createElement("div");
    pulse.classList.add("edit-tutorial--pulse");
    pulse.style.top = y + "px";
    pulse.style.left = x + "px";

    var pulseTip = document.createElement("div");
    pulseTip.classList.add("edit-tutorial--pulse-tip");
    
    if(html !== undefined) pulseTip.innerHTML = html;
    else pulseTip.classList.add("collapsed");
    
    pulse.appendChild(pulseTip);
    
    if(buttonCb) {
        var button = document.createElement("button");
        button.textContent = "Okay";
        button.addEventListener("click", buttonCb);
        pulseTip.appendChild(button);
    }
    
    pulse.addEventListener("mouseenter", function() {
       var rect = pulseTip.getBoundingClientRect();
       var distanceFromRightEdge = window.innerWidth - (rect.x + rect.width);
       
       if(distanceFromRightEdge < 0) pulseTip.style.transform = `translateX(${distanceFromRightEdge}px)`;
    });

    return pulse;
}

function disableScroll() {
    document.body.parentElement.style.overflow = "hidden";
}

function enableScroll() {
    document.body.parentElement.style.overflow = "";
}

showModal();