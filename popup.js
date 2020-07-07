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
            wordspacing: 0.4,
            wordsplists: 0,
            letterspacing: 0.04,
            lettersplists: 0
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
            wordspacing: {
                slider: document.querySelector('#wordsp-slider'),
                num: document.querySelector('#wordsp-num')
            },
            letterspacing: {
                slider: document.querySelector('#lettersp-slider'),
                num: document.querySelector('#lettersp-num')
            }
        },
        checkboxes: {
            wordsplists: document.querySelector('#wordsp-lists'),
            lettersplists: document.querySelector('#lettersp-lists')
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
        let i = 0;
        let primary;
        let partner;
        // Input:
        if (Tool.elements.input[field]) {
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
        // Checkboxes:
        } else if (Tool.elements.checkboxes[field]) {
            if (value == 1) {
                Tool.elements.checkboxes[field].checked = true;
            }
        }
    }
}





// PAGE LOAD Event (update popup els from storage):
function onPageLoad() {
    chrome.storage.local.get(['lha', 'ruler', 'spacing'], items => {
        if (items.lha) {
            updateFromStorage(items.lha, LHA);
        }
        if (items.ruler) {
            updateFromStorage(items.ruler, RULER);
        }
        if (items.spacing) {
            updateFromStorage(items.spacing, SPACING);
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





// TOGGLE Event (Active/Inactive):
function toggleEvent(Tool) {
    if (Tool.main.active == 0) {
        Tool.main.active = 1;
        Tool.elements.onoff.textContent = "ON";
        if (Tool.elements.toggle) {
            Tool.elements.toggle.value = "Disable";
        }
        Tool.elements.container.classList.remove("inactive");
    } else {
        Tool.main.active = 0;
        Tool.elements.onoff.textContent = "OFF";
        if (Tool.elements.toggle) {
            Tool.elements.toggle.value = "Enable";
        }
        Tool.elements.container.classList.add("inactive");
    }
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}


// CHILD TOGGLE Event:
function childToggleEvent(Tool, child, sibling) {

    if (Tool.main.childrenactive[child] == 0) {
        
        Tool.main.active = 1;
        Tool.elements.container.classList.remove("inactive");
        Tool.elements.onoff.textContent = "ON";

        Tool.main.childrenactive[child] = 1;
        Tool.elements.childrentoggles[child].value = "Disable";
        Tool.elements.childcontainers[child].classList.remove("inactive");
    
    } else {

        if (Tool.main.childrenactive[sibling] == 0) {
            Tool.main.active = 0;
            Tool.elements.container.classList.add("inactive");
            Tool.elements.onoff.textContent = "OFF";    
        }

        Tool.main.childrenactive[child] = 0;
        Tool.elements.childrentoggles[child].value = "Enable";
        Tool.elements.childcontainers[child].classList.add("inactive");    
    }

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

// Spacing:
SPACING.elements.childrentoggles.wordsp.addEventListener('click', event => {
    childToggleEvent(SPACING, "wordsp", "lettersp");
});

SPACING.elements.childrentoggles.lettersp.addEventListener('click', event => {
    childToggleEvent(SPACING, "lettersp", "wordsp");
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
    for (let [field, info] of Object.entries(input)) {
        let i=0;
        let primary;
        let partner;
        for (let [name, element] of Object.entries(info)) {
            if (i=== 0) {
                primary = element;
            }
            if (i===1) {
                partner = element;
            }
            i+=1;
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




// CHECKBOXES:


// Add Checkbox Listener:
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

checkboxEvent(LHA, 'lists');
checkboxEvent(SPACING, 'wordsplists');
checkboxEvent(SPACING, 'lettersplists');

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