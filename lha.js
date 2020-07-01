// (var lhainput already injected)
console.log("LHA input: ", lhainput);


// Apply:
function applyLHA(tags, input) {
    let factor = parseFloat(input.factor);
    tags.forEach( function(tag) {
        // Find tag els:
        let els = document.getElementsByTagName(tag);
        
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

// Revert:
function revert(tags) {
    tags.forEach( function(tag) {
        let els = document.getElementsByTagName(tag);
        for (let i=0; i<els.length; i++) {
            // Remove style property:
            els[i].style.removeProperty('line-height');
        }
    });
}


// LHA Off --> Revert:
if (parseInt(lhainput.active) === 0) {
    // Revert elements:
    revert(["p", "li"]);
}


// LHA On --> Apply:
if (parseInt(lhainput.active) === 1) {
    let tags = ["p"];
    // Lists off --> Revert li:
    if (parseInt(lhainput.lists) === 0) {
        revert(["li"]);
    // Lists on --> include li: 
    } else {
        tags.push("li");
    }
    // Apply:
    applyLHA(tags, lhainput);
}

