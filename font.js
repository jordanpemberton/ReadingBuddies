// (var fontinput already injected)
console.log("FONT input: ", fontinput);

// Apply:
function applyFont(attr, input) {
    if (attr == "font-size") {
        input = `${input}pt`;
    }
    document.querySelector('body').style[attr] = input;
};

// Revert:
function revertFont(attr) {
    document.querySelector('body').style.removeProperty(`${attr}`);
}

// If active Apply, else Revert:
function checkStatus(active, input, attr) {
    if (active == 1) {
        applyFont(attr, input);
    } else {
        revertFont(attr);
    }
}

checkStatus(fontinput.childrenactive.family, fontinput.input.family, "font-family");
checkStatus(fontinput.childrenactive.size, fontinput.input.size, "font-size");
