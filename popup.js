'use strict';

// Testing:
// chrome.storage.local.clear();

// CONST LHA:
const LHA = {
    name: "lha",
    main: {
        active: 0,
        collapsed: 1,
        input: {
            factor: 1.5,
            lists: 0
        }
    },
    elements: {
        container: document.querySelector('#LHAContainer'),
        header: document.querySelector('#lha-header'),
        onoff: document.querySelector('#lha-on-off'),
        toggle: document.querySelector('#lha-toggle'),
        input: {
            factor: {
                slider: document.querySelector('#lha-slider'),
                num: document.querySelector('#lha-num')
            }
        },
        checkboxes: {
            lists: document.querySelector('#lha-lists')
        }
    }
}


// CONST RULER:
const RULER = {
    name: "ruler",
    main: {
        active: 0,
        collapsed: 1,
        input: {
            height: 24,
            hue: 180,
            black: 0,
            white: 0,
            opacity: 15
        }
    },
    elements: {
        container: document.querySelector('#RulerContainer'),
        header: document.querySelector('#ruler-header'),
        onoff: document.querySelector('#ruler-on-off'),
        toggle: document.querySelector('#ruler-toggle'),
        huecontainer: document.querySelector('#ruler-hue-container'),
        bwcontainer: document.querySelector('#ruler-bw-container'),
        input: {
            height: {
                slider: document.querySelector('#ruler-height-slider'),
                num: document.querySelector('#ruler-height-num')
            },
            hue: {
                slider: document.querySelector('#ruler-hue-slider'),
                num: document.querySelector('#ruler-hue-num')
            },
            opacity: {
                slider: document.querySelector('#ruler-opacity-slider'),
                num: document.querySelector('#ruler-opacity-num')
            }
        },
        checkboxes: {
            black: document.querySelector('#ruler-black'),
            white: document.querySelector('#ruler-white')
        }
    }
}


// CONST SPACING:
const SPACING = {
    name: "spacing",
    main: {
        active: 0,
        childrenactive: {
            wordsp: 0,
            lettersp: 0
        },
        collapsed: 1,
        input: {
            wordsp: 0.5,
            lettersp: 0.1,
        }
    },
    elements: {
        container: document.querySelector('#SpacingContainer'),
        childcontainers: {
            wordsp: document.querySelector('#WordSpContainer'),
            lettersp: document.querySelector('#LetterSpContainer')
        },
        header: document.querySelector('#spacing-header'),
        onoff: document.querySelector('#spacing-on-off'),
        childrentoggles: {
            wordsp: document.querySelector('#wordsp-toggle'),
            lettersp: document.querySelector('#lettersp-toggle')
        },
        input: {
            wordsp: {
                slider: document.querySelector('#wordsp-slider'),
                num: document.querySelector('#wordsp-num')
            },
            lettersp: {
                slider: document.querySelector('#lettersp-slider'),
                num: document.querySelector('#lettersp-num')
            }
        }
    }
}


// CONST FONT:
const FONT = {
    name: "font",
    main: {
        active: 0,
        childrenactive: {
            family: 0,
            size: 0
        },
        collapsed: 1,
        input: {
            family: "Arial, Helvetica, sans-serif",
            size: 14
        }
    },
    elements: {
        container: document.querySelector('#FontContainer'),
        childcontainers: {
            family: document.querySelector('#FontFamContainer'),
            size: document.querySelector('#FontSizeContainer')
        },
        header: document.querySelector('#font-header'),
        onoff: document.querySelector('#font-on-off'),
        childrentoggles: {
            family: document.querySelector('#fontfam-toggle'),
            size: document.querySelector('#fontsize-toggle')
        },
        input: {
            size: {
                slider: document.querySelector('#fontsize-slider'),
                num: document.querySelector('#fontsize-num')
            }
        },
        select: {
            family: document.querySelector('select[name=fontfam]')
        }
    }
}



// SAVE to LOCAL Storage:
function saveLocal(name, Main) {
    chrome.storage.local.set({[name]: Main});
}


// SEND MESSAGE:
function sendMessage(name, Main) {
    chrome.runtime.sendMessage({[name]: Main});
}



// UPDATE with Storage Vals (on page load):
function updateFromStorage(fromstorage, Tool) {
    // Update Tool:
    Tool.main = fromstorage;

    // Apply to Popup:

    // Active Status:
    if (Tool.main.active == 1) {
        Tool.elements.onoff.textContent = "ON";
        if (Tool.elements.toggle) {
            Tool.elements.toggle.value = "Disable";
        }
        Tool.elements.container.classList.remove("inactive");
    } else {
        Tool.elements.onoff.textContent = "OFF";
        if (Tool.elements.toggle) {
            Tool.elements.toggle.value = "Enable";
        }
        Tool.elements.container.classList.add("inactive");
    }

    // Child tools status/ toggles:
    if (Tool.main.childrenactive) {
        for (let [child, status] of Object.entries(Tool.main.childrenactive)) {
            if (status == 1) {
                Tool.elements.childrentoggles[child].value = "Disable";
                Tool.elements.childcontainers[child].classList.remove("inactive");
            } else {
                Tool.elements.childrentoggles[child].value = "Enable";
                Tool.elements.childcontainers[child].classList.add("inactive");
            }
        }
    }

    // Collapsed:
    if (Tool.main.collapsed == 0) {
        Tool.elements.container.classList.remove("collapsed");
    } else {
        Tool.elements.container.classList.add("collapsed");
    }

    // Input Vals:
    for (let [field, value] of Object.entries(Tool.main.input)) {

        // Input:
        if (Tool.elements.input[field]) {
            let i = 0;
            let primary;
            let partner;

            for (let [item, element] of Object.entries(Tool.elements.input[field])) {
                if (i === 0) {
                    primary = element;
                } else if (i === 1) {
                    partner = element;
                }
                i++;
            }
            primary.value = value;
            if (partner !== null) {
                partner.value = value;
            }
        }

        // Checkboxes:
        else if (Tool.elements.checkboxes) {
            if (Tool.elements.checkboxes[field]) {
                if (value == 1) {
                    Tool.elements.checkboxes[field].checked = true;
                }
            }
        }

        // Select:
        else if (Tool.elements.select) {
            if (Tool.elements.select[field]) {
                document.querySelector(`option[value="${value}"]`).selected = true;
            }
        }

    }
}



// PAGE LOAD Event (update popup els from storage):
function onPageLoad() {
    chrome.storage.local.get(['lha', 'ruler', 'spacing', 'font'], items => {
        if (items.lha) {
            updateFromStorage(items.lha, LHA);
        }
        if (items.ruler) {
            updateFromStorage(items.ruler, RULER);
        }
        if (items.spacing) {
            updateFromStorage(items.spacing, SPACING);
        }
        if (items.font) {
            updateFromStorage(items.font, FONT);
        }
    });
}

// Page Load Listener:
document.addEventListener('DOMContentLoaded', onPageLoad);



// HEADER Event (Expand/Hide):
function headerEvent(Tool) {
    if (Tool.main.collapsed == 1) {
        Tool.main.collapsed = 0;
        Tool.elements.container.classList.remove("collapsed");
    } else {
        Tool.main.collapsed = 1;
        Tool.elements.container.classList.add("collapsed");
    }
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}


// HEADER Listeners:

// Spacing:
SPACING.elements.header.addEventListener('click', event => {
    headerEvent(SPACING);
});

// LHA:
LHA.elements.header.addEventListener('click', event => {
    headerEvent(LHA);
});

// Ruler:
RULER.elements.header.addEventListener('click', event => {
    headerEvent(RULER);
});

// Font:
FONT.elements.header.addEventListener('click', event => {
    headerEvent(FONT);
});



// TOGGLE Event (Active/Inactive):
function toggleEvent(Tool) {
    // If tool is off, turn on:
    if (Tool.main.active == 0) {
        Tool.main.active = 1;
        Tool.elements.onoff.textContent = "ON";
        if (Tool.elements.toggle) {
            Tool.elements.toggle.value = "Disable";
        }
        Tool.elements.container.classList.remove("inactive");
    }
    // If tool is on, turn off:
    else {
        Tool.main.active = 0;
        Tool.elements.onoff.textContent = "OFF";
        if (Tool.elements.toggle) {
            Tool.elements.toggle.value = "Enable";
        }
        Tool.elements.container.classList.add("inactive");
    }
    // Save, send message:
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}


// CHILD TOGGLE Event:
function childToggleEvent(Tool, child, siblings) {
    // If child tool is off, turn on:
    if (Tool.main.childrenactive[child] == 0) {
        // Child tool on:
        Tool.main.childrenactive[child] = 1;
        Tool.elements.childrentoggles[child].value = "Disable";
        Tool.elements.childcontainers[child].classList.remove("inactive");

        // Parent tool on:
        Tool.main.active = 1;
        Tool.elements.container.classList.remove("inactive");
        Tool.elements.onoff.textContent = "ON";
    }

    // If child tool is on, turn off:
    else {
        // Turn child tool off:
        Tool.main.childrenactive[child] = 0;
        Tool.elements.childrentoggles[child].value = "Enable";
        Tool.elements.childcontainers[child].classList.add("inactive");

        // Check if any sibling tools are on:
        let toolIsOn = false;
        for (let sibling in siblings) {
            if (Tool.main.childrenactive[sibling] == 1) {
                siblingsOn = true;
            }
        }

        // If no siblings are on, all tools are off --> turn parent tool off:
        if (toolIsOn == false) {
            Tool.main.active = 0;
            Tool.elements.container.classList.add("inactive");
            Tool.elements.onoff.textContent = "OFF";
        }
    }

    // Save, send message:
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}





// TOGGLE Listeners:

// LHA:
LHA.elements.toggle.addEventListener('click', event => {
    toggleEvent(LHA);
});

// Ruler:
RULER.elements.toggle.addEventListener('click', event => {
    toggleEvent(RULER);
});


// CHILD TOGGLE Listeners:

// Spacing:
SPACING.elements.childrentoggles.wordsp.addEventListener('click', event => {
    childToggleEvent(SPACING, "wordsp", ["lettersp"]);
});
SPACING.elements.childrentoggles.lettersp.addEventListener('click', event => {
    childToggleEvent(SPACING, "lettersp", ["wordsp"]);
});

// Font:
FONT.elements.childrentoggles.family.addEventListener('click', event => {
    childToggleEvent(FONT, "family", ["size"]);
});
FONT.elements.childrentoggles.size.addEventListener('click', event => {
    childToggleEvent(FONT, "size", ["family"]);
});



// INPUT:

// Input Event:
function inputEvent(Tool, field, primary, partner=null) {
    Tool.main.input[field] = primary.value;
    if (partner !== null) {
        partner.value = primary.value;
    }
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}

// Add Input Listener:
function addInputListener(Tool, field, primary, partner=null) {
    primary.addEventListener('input', function() {
        inputEvent(Tool, field, primary, partner);
    });
    if (partner !== null) {
        partner.addEventListener('input', function() {
            inputEvent(Tool, field, partner, primary);
        })
    }
}


// Get Input Elements:
function getInputElements(Tool) {
    let input = Tool.elements.input;
    for (let [field, items] of Object.entries(input)) {
        let i=0;
        let primary;
        let partner;
        for (let [name, element] of Object.entries(items)) {
            if (i===0) {
                primary = element;
            }
            if (i===1) {
                partner = element;
            }
            i++;
        }
        addInputListener(Tool, field, primary, partner);
    }
}



// LHA input:
getInputElements(LHA);

// RULER input:
getInputElements(RULER);

// SPACING input:
getInputElements(SPACING);

// FONT input:
getInputElements(FONT);



// SELECT:
// Select Event:
function selectEvent(Tool, field, value) {
    Tool.main.input[field] = value;
    Tool.elements.select[field].selected = true;
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}


// Add Select Listeners:
FONT.elements.select.family.addEventListener('change', event => {
    selectEvent(FONT, "family", event.target.value);
})





// CHECKBOXES:

// Add Checkbox Listeners, Event:
function checkboxEvent(Tool, field, partner=null, rival=null) {
    Tool.elements.checkboxes[field].addEventListener('input', function() {
        if (this.checked) {
            Tool.main.input[field] = 1;
            if (partner !== null) {
                Tool.main.input[partner] = 0;
                Tool.elements.checkboxes[partner].checked = false;
            }
            if (rival !== null) {
                rival.classList.add('inactive');
            }
        } else {
            Tool.main.input[field] = 0;
            if (rival !== null) {
                rival.classList.remove('inactive');
            }
        }
        saveLocal(Tool.name, Tool.main);
        sendMessage(Tool.name, Tool.main);
    });
}

// Lists:
checkboxEvent(LHA, 'lists');



// BW:
checkboxEvent(RULER, 'black', 'white', RULER.elements.huecontainer);
checkboxEvent(RULER, 'white', 'black', RULER.elements.huecontainer);



// HUE CONTAINER Listener:
RULER.elements.huecontainer.addEventListener('click', function() {
    if (RULER.main.input.black == 1) {
        RULER.main.input.black = 0;
        RULER.elements.checkboxes.black.checked = false;
    }
    if (RULER.main.input.white == 1) {
        RULER.main.input.white = 0;
        RULER.elements.checkboxes.white.checked = false;
    }
    RULER.elements.huecontainer.classList.remove('inactive');
    saveLocal(RULER.name, RULER.main);
    sendMessage(RULER.name, RULER.main);
})