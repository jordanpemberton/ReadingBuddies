'use strict';

// CONSTS:

// LHA Elements:
const LHAElements = {
    container: document.querySelector('#LHAContainer'),
    toggle: document.querySelector('#lha-toggle'),
    slider: document.querySelector('#lha-slider'),
    num: document.querySelector('#lha-num'),
    lists: document.querySelector('#include-li')
}

// Ruler Elements:
const RulerElements = {
    container: document.querySelector('#RulerContainer'),
    toggle: document.querySelector('#ruler-toggle'),
    heightslider: document.querySelector('#ruler-height-slider'),
    heightnum: document.querySelector('#ruler-height-num'),
    huecontainer: document.querySelector('#ruler-hue-container'),
    hueslider: document.querySelector('#ruler-hue-slider'),
    huenum: document.querySelector('#ruler-hue-num'),
    bwcontainer: document.querySelector('#ruler-bw-container'),
    black: document.querySelector('#ruler-black'),
    white: document.querySelector('#ruler-white'),
    opacityslider: document.querySelector('#ruler-opacity-slider'),
    opacitynum: document.querySelector('#ruler-opacity-num')
}

// LHA object:
const LHA = {
    active: 0,
    factor: 1,
    lists: 0,
};

// Ruler object:
const RULER = {
    active: 0,
    height: 24,
    hue: 180,
    bw: false,
    opacity: 15
};


// Save to Local Storage:
function saveLocal(name, Obj) {
    chrome.storage.local.set({[name]: Obj});
}

// Send Message:
function sendMessage(name, Obj) {
    chrome.runtime.sendMessage({[name]: Obj});
}


// Update Tool Obj with Storage vals:
function updateObj(fromstorage, ToolObj) {
    // Update obj:
    for (let [attr, value] of Object.entries(fromstorage)) {
        ToolObj[attr] = value;
    }
}


// Set the Container Div's "inactive" Class:
function setContainerClass(ToolObj, ToolEls) {
    // Sync PopUp Inputs /Styles:
    if (parseInt(ToolObj.active) === 0) {
        ToolEls.container.classList.add("inactive");
    } else {
        ToolEls.container.classList.remove("inactive");
    }
}


// On popup page load (update objs, sync popup):
document.addEventListener('DOMContentLoaded', function() {
    // Get from local storage:
    // LHA:
    chrome.storage.local.get('lha', items => {
        if (items.lha) {
            // Update tool obj:
            updateObj(items.lha, LHA);
            // Update container class:
            setContainerClass(LHA, LHAElements);
            // Sync popup values:
            LHAElements.slider.value = LHA.factor;
            LHAElements.num.value = LHA.factor;
            if (parseInt(LHA.lists) === 1) {
                LHAElements.lists.checked = true;
            }
        }
    });
    // Ruler:
    chrome.storage.local.get('ruler', items => {
        if (items.ruler) {
            // Update tool obj:
            updateObj(items.ruler, RULER);
            // Update tool status:
            setContainerClass(RULER, RulerElements);
            // Sync PopUp Inputs /Styles:
            RulerElements.heightslider.value = RULER.height;
            RulerElements.heightnum.value = RULER.height;
            RulerElements.hueslider.value = RULER.hue;
            RulerElements.huenum.value = RULER.hue;
            if (RULER.bw === "#000000") {
                RulerElements.black.checked = true;
            }
            if (RULER.bw === "#FFFFFF") {
                RulerElements.white.checked = true;
            }
            RulerElements.opacityslider.value = RULER.opacity;
            RulerElements.opacitynum.value = RULER.opacity;
        }
    });
});


// ON TOGGLE:

// On Toggle Helper Function:
function toggleEvent(ToolObj, ToolEls, toolname) {
    if (parseInt(ToolObj.active) === 0) {
        ToolObj.active = 1;
        ToolEls.container.classList.remove("inactive");
    } else {
        ToolObj.active = 0;
        ToolEls.container.classList.add("inactive");
    }
    saveLocal(toolname, ToolObj);
    sendMessage(toolname, ToolObj);
}



// LHA Toggle Event:
LHAElements.toggle.addEventListener('click', event => {
    toggleEvent(LHA, LHAElements, "lha");
});


// Ruler Toggle Event:
RulerElements.toggle.addEventListener('click', event => {
    toggleEvent(RULER, RulerElements, "ruler");
});



// ON INPUT:

// CHECK BOXES:

// LHA include lists:
LHAElements.lists.addEventListener('input', function() {
    if (this.checked) {
        LHA.lists = 1;
    } else {
        LHA.lists = 0;
    }
    saveLocal('lha', LHA);
    sendMessage('lha', LHA);
})


// Ruler Black:
RulerElements.black.addEventListener('input', function() {
    if (this.checked) {
        RULER.bw = "#000000";
        RulerElements.white.checked = false;
        RulerElements.huecontainer.classList.add('inactive');
    } else {
        RULER.bw = false;
        RulerElements.huecontainer.classList.remove('inactive');
    }
    saveLocal('ruler', RULER);
    sendMessage('ruler', RULER);
})

// Ruler White:
RulerElements.white.addEventListener('input', function() {
    if (this.checked) {
        RULER.bw = "#FFFFFF";
        RulerElements.black.checked = false;
        RulerElements.huecontainer.classList.add('inactive');
    } else {
        RULER.bw = false;
        RulerElements.huecontainer.classList.remove('inactive');
    }
    saveLocal('ruler', RULER);
    sendMessage('ruler', RULER);
})


// Hue container listener:
RulerElements.huecontainer.addEventListener('click', function() {
    if (RULER.bw) {
        RULER.bw = false;
        RulerElements.black.checked = false;
        RulerElements.white.checked = false;
        RulerElements.huecontainer.classList.remove('inactive');
        saveLocal('ruler', RULER);
        sendMessage('ruler', RULER);
    }
})


// PARTNER INPUTS:
// Add input event listener:
function addOnInputListener(element, partner, ToolObj, toolname, attr) {
    element.addEventListener('input', event => {
        partner.value = event.target.value;
        ToolObj[attr] = event.target.value;
        saveLocal(toolname, ToolObj);
        sendMessage(toolname, ToolObj);
    })
}


// LHA Partner Inputs:
addOnInputListener(LHAElements.slider, LHAElements.num, LHA, "lha", "factor");
addOnInputListener(LHAElements.num, LHAElements.slider, LHA, "lha", "factor");


// Ruler Partner Inputs:
addOnInputListener(RulerElements.heightslider, RulerElements.heightnum, RULER, "ruler", "height");
addOnInputListener(RulerElements.heightnum, RulerElements.heightslider, RULER, "ruler", "height");

addOnInputListener(RulerElements.hueslider, RulerElements.huenum, RULER, "ruler", "hue");
addOnInputListener(RulerElements.huenum, RulerElements.hueslider, RULER, "ruler", "hue");

addOnInputListener(RulerElements.opacityslider, RulerElements.opacitynum, RULER, "ruler", "opacity");
addOnInputListener(RulerElements.opacitynum, RulerElements.opacityslider, RULER, "ruler", "opacity");
