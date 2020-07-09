// Apply:
function applySpacing(attr, input) {
    input = `${input}em`;
    document.querySelector('body').style[attr] = input;
};

// Revert:
function revertSpacing(attr) {
    document.querySelector('body').style.removeProperty(attr);
}

// Check active status, if active Apply, else Revert:
function checkStatusSpacing(input, name, attr) {
    if (input.childrenactive[name] == 1) {
        applySpacing(attr, input.input[name]);
    } else {
        revertSpacing(attr);
    }
}

// Call checkStatusSpacing
checkStatusSpacing(spacinginput, "wordsp", "word-spacing");
checkStatusSpacing(spacinginput, "lettersp", "letter-spacing");


