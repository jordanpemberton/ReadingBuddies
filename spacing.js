// (var spacinginput already injected)
console.log("SPACING input: ", spacinginput);


// Make list of matching els:  **fix for nested els**
function makeElsListWS(tag) {
    let body = document.querySelector('body');
    return body.querySelectorAll(tag);
}


// Apply:
function applySpacing(tags, input, spacingType) {
    console.log("Apply!");
    let spacing = `${input}em`;
    console.log(spacing);

    tags.forEach( function(tag) {

        // Find all tag els:
        let els = makeElsListWS(tag);

        // Apply:
        for (let i=0; i<els.length; i++) {
            let el = els[i];

            // Apply new spacing:
            el.style[spacingType] = spacing;
        }
    });
};

// Revert:
function revert(tags, spacingType) {
    console.log("Revert!, ", spacingType);

    tags.forEach( function(tag) {
        // Find els:
        let els = makeElsListWS(tag);

        for (let i=0; i<els.length; i++) {
            // Remove style property:
            // els[i].style.removeProperty(`${spacingType}`);
            els[i].style[spacingType] = "";
        }
    });
}


// // SPACING Off --> Revert:
// if (spacinginput.active == 0) {
//     // Revert:
//     revert(["p", "ul", "ol"], "wordSpacing");
//     revert(["p", "ul", "ol"], "letterSpacing");
// } 

// SPACING On --> Apply:

// Word Spacing:
if (spacinginput.childrenactive.wordsp == 1) {
    let tags = ["p"];
    // Lists off --> Revert list els:
    if (spacinginput.input.wordsplists == 0) {
        revert(["ul", "ol"], "wordSpacing");
    // Lists on --> include list els:
    } else {
        tags.push("ul", "ol");
    }
    // Apply:
    applySpacing(tags, spacinginput.input.wordspacing, "wordSpacing");
} else {   
    revert(["p", "ul", "ol"], "wordSpacing");
}

// Letter Spacing:
if (spacinginput.childrenactive.lettersp == 1) {
    let tags = ["p"];
    // Lists off --> Revert list els:
    if (spacinginput.input.lettersplists == 0) {
        revert(["ul", "ol"], "letterSpacing");
    // Lists on --> include list els:
    } else {
        tags.push("ul", "ol");
    }
    // Apply:
    applySpacing(tags, spacinginput.input.letterspacing, "letterSpacing");
} else {
    revert(["p", "ul", "ol"], "letterSpacing");
}


