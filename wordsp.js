// (var wordspinput already injected)
console.log("WORDSP input: ", wordspinput);


// Make list of matching els:  **fix for nested els**
function makeElsListWS(tag) {
    let body = document.querySelector('body');
    return body.querySelectorAll(tag);
}


// Apply:
function applyWORDSP(tags, input) {
    // Testing:
    // input = "1em";
    console.log(input);
    let spacing = `${input.spacing}em`;
    console.log(spacing);

    tags.forEach( function(tag) {

        // Find all tag els:
        let els = makeElsListWS(tag);

        // Apply:
        for (let i=0; i<els.length; i++) {
            let el = els[i];

            // Apply new spacing:
            el.style.wordSpacing = spacing;
        }
    });
};

// Revert:
function revert(tags) {

    tags.forEach( function(tag) {
        // Find els:
        let els = makeElsListWS(tag);

        for (let i=0; i<els.length; i++) {
            // Remove style property:
            els[i].style.removeProperty('word-spacing');
        }
    });
}


// WORDSP Off --> Revert:
if (wordspinput.active == 0) {
    // Revert:
    revert(["p", "ul", "ol"]);
}

// WORDSP On --> Apply:
if (wordspinput.active == 1) {
    let tags = ["p"];
    // Lists off --> Revert list els:
    if (wordspinput.input.lists == 0) {
        revert(["ul", "ol"]);
    // Lists on --> include list els:
    } else {
        tags.push("ul", "ol");
    }
    // Apply:
    applyWORDSP(tags, wordspinput.input);
}

