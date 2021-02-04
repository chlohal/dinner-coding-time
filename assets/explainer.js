(function() {
    var rules = [
        {
            path: "operator-expression string-literal",
            content: "\"\"",
            description: "This empty string is useful to convert other values into <code>String</code>s, because primitive values like <code>int</code> don't have <code>toString()</code> methods."
        },
        {
            path: "cast-expression primitive-type",
            description: "A cast, where you put <code>(aTypeInParentheses)</code> in front of another value, converts the value into the specified type. Here, it's converting to <code>{{content}}</code>."
        }
    ];

    function testRule(rule, wordElem) {
        return (rule.path ? (wordElem.getAttribute("data-nodepath") || "").endsWith(rule.path) : true) &&
            (rule.content ? wordElem.textContent == rule.content : true);
    }

    window.explainEditor = function explain(editor) {
        var words = editor.table.querySelectorAll("span.hlast");

        for(var i = 0; i < words.length; i++) {
            attachWordExplainer(words[i])
            if(words[i].classList.contains("hlast-pairedchar")) addPairedchar(words[i]);
        }

        editor.parent.addEventListener("mouseenter", function(event) {
            destroyTooltip();
        });
        
    }

    function addPairedchar(pairedchar) {
        var id = pairedchar.id;
        var partnerId = "";
        if(id.includes("-in-")) partnerId = id.replace("-in-", "-out-");
        else partnerId = id.replace("-out-", "-in-");

        var partner = document.getElementById(partnerId);
        if(!partner) return false;

        console.log(partner);

        pairedchar.addEventListener("click", function() {
            pairedchar.tabIndex = "-1";
            pairedchar.focus();

            partner.classList.add("partner-selected");
            pairedchar.classList.add("partner-selected");
        });

        pairedchar.addEventListener("blur", function() {
            partner.classList.remove("partner-selected");
            pairedchar.classList.remove("partner-selected");
        });
    }
    
    function attachWordExplainer(word) {
        var applicableRuleIdx = rules.findIndex(function(rule) {
            return testRule(rule, word);
        });

        if(applicableRuleIdx < 0) return false;

        word.setAttribute("data-explain-rule", applicableRuleIdx);

        var applicableRule = rules[applicableRuleIdx];

        word.addEventListener("mouseenter", function(event) {
            tooltip(word, applicableRule.description.replace(/\{\{content\}\}/g, word.textContent));
        });
        word.addEventListener("mouseleave", function(event) {
            console.log(event.relatedTarget.id);
            if(event.relatedTarget && event.relatedTarget.id != "explain-tooltip") destroyTooltip();
        });
    }

    function tooltip(elem, content) {
        destroyTooltip();
        var box = elem.getBoundingClientRect();

        var deltTop = window.scrollY;
        var deltLeft = window.scrollX;

        
        var tooltip = document.createElement("dialog");
        tooltip.setAttribute("open", true);
        tooltip.style.top = (deltTop + box.y + box.height) + "px";
        tooltip.style.left = (deltLeft + box.x) + "px";
        tooltip.innerHTML = content;

        tooltip.id = "explain-tooltip";

        document.body.appendChild(tooltip);
    }

    function destroyTooltip() {
        var tooltip = document.getElementById("explain-tooltip");
        if(tooltip) tooltip.parentElement.removeChild(tooltip);
    }
})();