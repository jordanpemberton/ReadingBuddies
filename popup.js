'use strict';

// Testing:
chrome.storage.local.clear();

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


// CONST WORDSP:
const WORDSP = {
    name: "wordsp",
    main: {
        active: 0,
        collapsed: 1,
        input: {
            spacing: 1, 
            lists: 0
        }
    },
    elements: {
        container: document.querySelector('#WordSpContainer'),
        header: document.querySelector('#wordsp-header'),
        onoff: document.querySelector('#wordsp-on-off'),
        toggle: document.querySelector('#wordsp-toggle'),
        input: {
            spacing: {
                slider: document.querySelector('#wordsp-slider'),
                num: document.querySelector('#wordsp-num')
            }
        },
        checkboxes: { 
            lists: document.querySelector('#wordsp-lists')
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
    if (parseInt(Tool.main.active) === 1) {
        Tool.elements.onoff.innerHTML = "ON";
        Tool.elements.container.classList.remove("inactive");
    } else {
        Tool.elements.onoff.innerHTML = "OFF";
        Tool.elements.container.classList.add("inactive");
    }

    // Collapsed:
    if (parseInt(Tool.main.collapsed) === 0) {
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
            if (parseInt(value) === 1) {
                Tool.elements.checkboxes[field].checked = true;
            }
        }
    }
}





// PAGE LOAD Event (update popup els from storage):
function onPageLoad() {
    chrome.storage.local.get(['lha', 'ruler', 'wordsp'], items => {
        console.log(items);
        if (items.lha) {
            updateFromStorage(items.lha, LHA);
        }
        if (items.ruler) {
            updateFromStorage(items.ruler, RULER);
        }
        if (items.wordsp) {
            updateFromStorage(items.wordsp, WORDSP);
        }
    });
}

// Page Load Listener:
document.addEventListener('DOMContentLoaded', onPageLoad);





// HEADER Event (Expand/Hide):
function headerEvent(Tool) {
    if (parseInt(Tool.main.collapsed) === 1) {
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

// Word Spacer:
WORDSP.elements.header.addEventListener('click', event => {
    headerEvent(WORDSP);
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
function toggleEventWS(Tool) {
    if (parseInt(Tool.main.active) === 0) {
        Tool.main.active = 1;
        Tool.elements.onoff.innerHTML = "ON";
        Tool.elements.container.classList.remove("inactive");
    } else {
        Tool.main.active = 0;
        Tool.elements.onoff.innerHTML = "OFF";
        Tool.elements.container.classList.add("inactive");
    }
    saveLocal(Tool.name, Tool.main);
    sendMessage(Tool.name, Tool.main);
}

// TOGGLE Listeners:

// Word Spacer:
WORDSP.elements.toggle.addEventListener('click', event => {
    toggleEventWS(WORDSP);
});

// LHA:
LHA.elements.toggle.addEventListener('click', event => {
    toggleEventWS(LHA);
});

// Ruler:
RULER.elements.toggle.addEventListener('click', event => {
    toggleEventWS(RULER);
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

// WORDSP input:
getInputElements(WORDSP);




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
checkboxEvent(WORDSP, 'lists');

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