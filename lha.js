// (var lhainput already injected)
console.log("LHA input: ", lhainput);


// Make list of matching els:
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

        for (let i=0; i<els.length; i++) {
            // Remove style property:
            els[i].style.removeProperty('line-height');
        }
    });
}


// LHA Off --> revertLHA:
if (parseInt(lhainput.active) === 0) {
    // revertLHA:
    revertLHA(["p", "ul", "ol"]);
}


// LHA On --> Apply:
if (parseInt(lhainput.active) === 1) {
    let tags = ["p"];
    // Lists off --> revertLHA list els:
    if (parseInt(lhainput.input.lists) === 0) {
        revertLHA(["ul", "ol"]);
    // Lists on --> include list els:
    } else {
        tags.push("ul", "ol");
    }
    // Apply:
    applyLHA(tags, lhainput.input);
}

