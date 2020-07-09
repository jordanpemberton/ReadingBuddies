// Make list of matching els for tag:
function makeElsListLHA(tag) {
    let body = document.querySelector('body');
    return body.querySelectorAll(tag);
}

// Apply:
function applyLHA(tags, input) {
    let factor = parseFloat(input.factor);
    tags.forEach( function(tag) {
        // Find all tag els:
        let els = makeElsListLHA(tag);
        // Apply:
        for (let i=0; i<els.length; i++) {
            let el = els[i];
            // Clear applied lineheight:
            el.style.removeProperty('line-height');
            // Find original line height:
            let original = getComputedStyle(el).lineHeight;
            let originalVal = parseFloat(original.slice(0, original.length-2));
            // Make new line height:
            let adjusted = originalVal * factor;
            let adjustedStr = `${adjusted}px`;
            // Set line height:
            el.style.lineHeight = adjustedStr;
        }
    });
};

// revertLHA:
function revertLHA(tags) {
    tags.forEach( function(tag) {
        // Find els:
        let els = makeElsListLHA(tag);
        // Remove line-height property:
        for (let i=0; i<els.length; i++) {
            els[i].style.removeProperty('line-height');
        }
    });
}

// Check if active, if active apply: 
function checkStatusLHA() {
    // LHA Off --> revertLHA:
    if (lhainput.active == 0) {
        revertLHA(["p", "ul", "ol"]);
    }
    // LHA On --> Apply:
    if (lhainput.active == 1) {
        let tags = ["p"];
        // If lists off --> revertLHA list els:
        if (lhainput.input.lists == 0) {
            revertLHA(["ul", "ol"]);
        } 
        // If lists on --> include list els:
        else {
            tags.push("ul", "ol");
        }
        // Apply:
        applyLHA(tags, lhainput.input);
    }
}

checkStatusLHA();
