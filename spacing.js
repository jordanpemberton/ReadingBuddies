// (var spacinginput already injected)
console.log("SPACING input: ", spacinginput);


// Make list of matching els:  **fix for nested els**
function makeElsListSp(tag) {
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
        let els = makeElsListSp(tag);

        // Apply:
        for (let i=0; i<els.length; i++) {
            let el = els[i];

            // Apply new spacing:
            el.style[spacingType] = spacing;
        }
    });
};

// revertSp:
function revertSp(tags, spacingType) {
    console.log("revertSp!, ", spacingType);

    tags.forEach( function(tag) {
        // Find els:
        let els = makeElsListSp(tag);

        for (let i=0; i<els.length; i++) {
            // Remove style property:
            // els[i].style.removeProperty(`${spacingType}`);
            els[i].style[spacingType] = "";
        }
    });
}


// // SPACING Off --> revertSp:
// if (spacinginput.active == 0) {
//     // revertSp:
//     revertSp(["p", "ul", "ol"], "wordSpacing");
//     revertSp(["p", "ul", "ol"], "letterSpacing");
// } 

// SPACING On --> Apply:

// Word Spacing:
if (spacinginput.childrenactive.wordsp == 1) {
    let tags = ["p"];
    // Lists off --> revertSp list els:
    if (spacinginput.input.wordsplists == 0) {
        revertSp(["ul", "ol"], "wordSpacing");
    // Lists on --> include list els:
    } else {
        tags.push("ul", "ol");
    }
    // Apply:
    applySpacing(tags, spacinginput.input.wordspacing, "wordSpacing");
} else {   
    revertSp(["p", "ul", "ol"], "wordSpacing");
}

// Letter Spacing:
if (spacinginput.childrenactive.lettersp == 1) {
    let tags = ["p"];
    // Lists off --> revertSp list els:
    if (spacinginput.input.lettersplists == 0) {
        revertSp(["ul", "ol"], "letterSpacing");
    // Lists on --> include list els:
    } else {
        tags.push("ul", "ol");
    }
    // Apply:
    applySpacing(tags, spacinginput.input.letterspacing, "letterSpacing");
} else {
    revertSp(["p", "ul", "ol"], "letterSpacing");
}


