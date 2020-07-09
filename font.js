// Apply:
function applyFont(attr, input) {
    if (attr == "font-size") {
        input = `${input}pt`;
    }
    document.querySelector('body').style[attr] = input;
};

// Revert:
function revertFont(attr) {
    document.querySelector('body').style.removeProperty(attr);
}

// If active Apply, else Revert:
function checkStatusFont(input, name, attr) {
    if (input.childrenactive[name] == 1) {
        applyFont(attr, input.input[name]);
    } else {
        revertFont(attr);
    }
}

// Call checkStatusFont:
checkStatusFont(fontinput, "family", "font-family");
checkStatusFont(fontinput, "size", "font-size");
