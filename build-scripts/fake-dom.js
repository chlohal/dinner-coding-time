var parserTools = require(__dirname + "/parser-tools.js");

module.exports = {
    createTextNode(content) {
        return new Node("#text", content===undefined?"undefined":content.toString());
    },
    createElement: function (tag) {
        return new Node(tag);
    },

    parseHTML: parseHTML
};

function Node(tag, value) {
    let self = this;

    this.nodeName = tag;
    if (tag == "#text") this.value = value;

    this.parentNode = null;
    this.childNodes = [];
    this.attributes = {
        get style() {
            return self.style.__buildAsAttribute();
        },
        set style(val) {
            self.style.clear();

            let styles = val.split(";");

            //parse and apply each style
            for (var i = 0; i < styles.length; i++) {
                let trimmed = styles[i].trim();
                if (!trimmed) continue;

                let styleName = trimmed.split(":")[0];
                let styleVal = trimmed.substring(styleName.length, trimmed.length - 1);

                self.style.setProperty(styleName, styleVal);
            }
        }
    };

    this.style = {
        setProperty: function (prop, val, attr) {
            this[prop] = val + (attr ? " !" + attr : "");
        },
        getComputed: function () {
            return this;
        },
        getPropertyValue: function (prop) {
            return this[prop];
        },
        __buildAsAttribute: function () {
            let styles = Object.keys(this).map(style => {
                if (typeof this[style] == "function") return "";
                return `${camelToKebab(style)}: ${encodeCharacterEntities(this[style].toString())};`;
                return "";
            });

            return styles.join("");
        },
        clear: function () {
            let keys = Object.keys(this);
            for (var i = 0; i < keys.length; i++) {
                if (typeof this[keys[i]] == "string") delete this[keys[i]];
            }
        }
    };

    return this;
}

Node.prototype.childNodes = [];
Node.prototype.parentNode = undefined;
Node.prototype.nodeName = undefined;
Node.prototype.value = undefined;

Node.prototype.hideCircular = function () {
    return {
        childNodes: this.childNodes.map(x => x.hideCircular()),
        nodeName: this.nodeName,
        attributes: this.attributes
    }
}
Node.prototype.appendChild = function (child) {
    if(child == this) throw "You cannot append a node to itself";
    this.childNodes.push(child);
    child.parentNode = this;

    return child;
};
Node.prototype.insertBefore = function (newChild, reference) {
    if(newChild == this) throw "You cannot append a node to itself";
    let index = this.childNodes.indexOf(reference);
    if (index == -1) index = this.childNodes.length;

    this.childNodes.splice(index, 0, newChild);
    newChild.parentNode = this;

    return newChild;
};
Node.prototype.removeChild = function (child) {
    this.childNodes.splice(this.childNodes.indexOf(child), 1);
    child.parentNode = null;

    return child;
};

Object.defineProperty(Node.prototype, "offsetWidth", {
    get: function () {
        return this.attributes.width ||
            10 * Math.max(arrayMax(this.textContent.split("\n")).length,
            (this.attributes.text || "").length);
    }
});

Object.defineProperty(Node.prototype, "offsetHeight", {
    get: function () {
        return this.attributes.height || this.textContent.split("\n").length*20;
    }
});

Object.defineProperty(Node.prototype, "offsetLeft", {
    get: function () {
        return this.attributes.x || this.attributes.left || 0;
    }
});

Object.defineProperty(Node.prototype, "offsetTop", {
    get: function () {
        return this.attributes.y || this.attributes.top || 0;
    }
});

Object.defineProperty(Node.prototype, "offsetParent", {
    get: function () {
        return this.parentNode;
    }
});

Node.prototype.getBoundingClientRect = function () {
    return {
        top: this.offsetTop,
        left: this.offsetLeft,
        width: this.offsetWidth,
        height: this.offsetHeight,
        x: this.offsetLeft,
        y: this.offsetTop
    };
};
Node.prototype.cloneNode = function () {
    let copy = H.merge({}, this);
    copy.parentNode = null;
    return copy;
};
Node.prototype.setAttribute = function (attr, val) {
    if (val.toString() == "NaN") throw problem;
    this.attributes[attr] = val;
};
Node.prototype.setAttributeNS = function (ns, attr, val) {
    this.setAttribute(attr, val);
};


Object.defineProperty(Node.prototype, "textContent", {
    get: function () {
        if (this.nodeName == "#text") return this.value;

        return this.childNodes.map(node => {
            return node.textContent;
        }).join("");
    },
    set: function (val) {
        this.childNodes = [
            module.exports.createTextNode(val)
        ];
    }
});
Object.defineProperty(Node.prototype, "innerHTML", {
    get: function () {
        return this.__buildInnerHTML(true);
    },
    set: function (val) {
        if(val === "") {
            this.childNodes = [];
        }
        let parsed = parseHTML(val);
        for (var i = 0; i < parsed.length; i++) {
            this.appendChild(parsed[i]);
        }
    }
});
Object.defineProperty(Node.prototype, "outerHTML", {
    get: function () {
        return this.__buildOuterHTML(true);
    }
});
Node.prototype.__buildInnerHTML = function(includeStyles) {
    return this.childNodes.map(node => node.__buildOuterHTML(includeStyles)).join("");
};

Node.prototype.__buildOuterHTML = function (includeStyles) {
    if (this.nodeName == "#text") return encodeCharacterEntities(this.value || "");
    let attrs = Object.keys(this.attributes).map(attribute => {
        if (attribute == "style" && !includeStyles) return "";
        //since getters are defined, it always has style; drop it if not needed
        if (attribute == "style" && this.attributes.style == "") return "";


        else return ` ${attribute}="${this.attributes[attribute]}"`
    });

    return "<" + this.nodeName + attrs.join("") + ">" +
        this.childNodes.map(node => node.__buildOuterHTML(includeStyles)).join("") +
        "</" + this.nodeName + ">";
};
Node.prototype.getElementsByTagName = function (tagName) {
    let children = this.childNodes.filter(node => {
        return node.nodeName == tagName;
    });

    this.childNodes.forEach(node => {
        children = children.concat(node.getElementsByTagName(tagName));
    });

    return children;
};
Node.prototype.getAttribute = function (attr) {
    return this.attributes[attr];
};
Node.prototype.removeAttribute = function (attr) {
    delete this.attributes[attr];
};
Node.prototype.isConnected = function () {
    return this.parentNode == true;
};

function camelToKebab(str) {
    let words = [];

    let wordStartIndex = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i].toUpperCase() == str[i]) {
            words.push(str.substring(wordStartIndex, i).toLowerCase());
            wordStartIndex = i;
        }
    }
    words.push(str.substring(wordStartIndex).toLowerCase())

    return words.join("-");
}

function encodeCharacterEntities(str) {
    return str.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function parseCharacterEntities(str) {
    return str.replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'");
}

function arrayMax(arr) {
    let max = arr[0];
    let i = arr.length;
    while (i--) {
        if (arr[i] > max) max = arr[i]
    };

    return max;
}

function parseHTML(str) {
    //remove leading/trailing whitespace and comments
    str = parserTools.stripComments(str.trim(), { start: "<!--", end: "-->" });

    let elemHtmls = parserTools.groupAwareSplit(str, ">", { doGroups: true, doQuotes: false, groupEnter: ["<"], groupExit: ["</"] });

    let elements = [];
    for (var i = 0; i < elemHtmls.length; i++) {

        //handle parsing error when there's a text node that isn't split
        if (elemHtmls[i].trim()[0] != "<" && elemHtmls[i].indexOf("<") > 0) {
            let actualStart = elemHtmls[i].indexOf("<");

            let firstTextNodeText = elemHtmls[i].substring(0, actualStart - 1);
            elemHtmls[i] = elemHtmls[i].substring(actualStart);

            elemHtmls.splice(i, 0, firstTextNodeText);
        }

        if (elemHtmls[i].indexOf("<") == -1) {
            let cleanedText = elemHtmls[i].replace(/>/g, "").trim();
            if (cleanedText == "") continue;

            elements.push(module.exports.createTextNode(parseCharacterEntities(cleanedText)));
        } else {
            let openTagEndIndex = elemHtmls[i].indexOf(">");
            let openTag = elemHtmls[i].substring(0, openTagEndIndex);
            if (openTag == "") continue;

            let tagName = /<(\w+)/.exec(openTag)[1];

            let elem = module.exports.createElement(tagName);
            let attrList = openTag.substring(tagName.length + 2);

            let attrs = parserTools.groupAwareSplit(attrList, " ", { doGroups: false, doQuotes: true });

            for (var j = 0; j < attrs.length; j++) {
                let attr = attrs[j].trim();

                //for self-closing tags, if there isn't an optional space between the close and the last attr
                if (attr.endsWith("/")) attr = attr.substring(0, attr.length - 1);

                //attributes must start with an alphabetical char
                if (!attr.match(/^\w/)) continue;

                let attrName = /^(\w+)/.exec(attr)[1];
                let attrValue = parserTools.unQuote(attr.substring(attrName.length + 1));

                elem.setAttribute(attrName, attrValue);
            }

            //if there's a self-closing tag, close it by moving its "children" up one level
            if (isSelfClosingTag(tagName)) {
                elemHtmls = elemHtmls.concat(
                    elemHtmls,
                    parserTools.groupAwareSplit(elemHtmls[i].substring(openTagEndIndex), ">", { doGroups: true, doQuotes: true, groupEnter: ["<"], groupExit: ["</", "/>"] })
                );
                continue;
            }

            let closingTagIndex = elemHtmls[i].indexOf("</" + tagName);
            if (closingTagIndex < 0) closingTagIndex = elemHtmls[i].length - 2;

            elem.innerHTML = elemHtmls[i].substring(openTagEndIndex, closingTagIndex);

            elements.push(elem);
        }
    }

    return elements;
}

function isSelfClosingTag(tagName) {
    return ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
        "param", "source", "track", "wbr", "command", "keygen",
        "menuitem"].includes(tagName.toLowerCase());
}