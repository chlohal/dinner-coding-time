var DRY_RUN = false;

var assignments = require("./codehs-assignments.json");
var fs = require("fs");
var path = require("path");

var NAME = "Randosa";

var index = [];

//only Basic Python and Console Interaction
for(var i = 0; i < assignments.length; i++) {
    var unitFolder = path.join(__dirname, i + "");
    if(!fs.existsSync(unitFolder)) fs.mkdirSync(unitFolder);
    
    for(var j = 0; j < assignments[i].children.length; j++) {
        var sectionFolder = path.join(unitFolder, (j+1) + "");
        if(!fs.existsSync(sectionFolder)) fs.mkdirSync(sectionFolder);
        
        for(var k = 0; k < assignments[i].children[j].children.length; k++) {
            var assignment = assignments[i].children[j].children[k];
            if(assignment.type != "Exercise") continue;
            
            var nameWithoutAddress = assignment.name.replace(/^\d+\.\d+\.\d+/, "").trim();

            console.log(nameWithoutAddress);
            
            index.push([`/codehs/python3/${path.basename(unitFolder)}/${path.basename(sectionFolder)}/${slugify(nameWithoutAddress)}`, `${i}-${j+1}-${k + 1}`]);

        }
    }
}

fs.writeFileSync("./index.json", JSON.stringify(index));

function slugify(str) {
    return str.replace(/'/g, "") // ignore contractions
        .replace(/\W+/g, "-") //replace non-word characters with dashes
        .replace(/^-/, "") //ignore leading dashes
        .replace(/-$/, "") //and trailing dashes
        .toLowerCase(); //lowercase
}