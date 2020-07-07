// For testing:
// chrome.storage.local.clear();


// Extension Icon (Extension Status):
function toggleIcon() {
    chrome.storage.local.get(['lha', 'ruler', 'spacing', 'font'], items => {
        if ( items.lha.active == 1 || items.ruler.active == 1 || items.spacing.active == 1 || items.font.active == 1 ) {
            chrome.tabs.query({currentWindow: true}, function(tabs) {
                for (let i in tabs) {
                    chrome.browserAction.setIcon({
                        path: "images/icon32active.png",
                        tabId: tabs[i].id
                    });
                }
            });
        } else {
            chrome.tabs.query({currentWindow: true}, function(tabs) {
                for (let i in tabs) {
                    chrome.browserAction.setIcon({
                        path: "images/icon32.png",
                        tabId: tabs[i].id
                    });
                }
            });
        }
    });
}



// Apply All Tabs:
function applyAllTabs(toolname, input, css) {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        for (let i in tabs) {
            // Insert var <tool>input:
            let varname = toolname + "input";
            chrome.tabs.executeScript(tabs[i].id, {
                code:   `var ${varname} = ${JSON.stringify(input)};`
            });
            // Insert script file:
            chrome.tabs.executeScript(tabs[i].id, {file: `${toolname}.js`});
            // Insert CSS:
            if (css) {
                chrome.tabs.insertCSS(tabs[i].id, {file: `${toolname}.css`});
            }
        }
    });
}


// On message from popup:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Icon:
    toggleIcon();
    
    // LHA:
    if (request.lha) {
        applyAllTabs("lha", request.lha, false);
    }
    // RULER:
    if (request.ruler) {
        applyAllTabs("ruler", request.ruler, true);
    }
    // SPACING:
    if (request.spacing) {
        applyAllTabs("spacing", request.spacing, false);
    }
    // FONT:
    if (request.font) {
        applyAllTabs("font", request.font, false);
    }

});



// On tab update:
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    // If tab loaded:
    if (changeInfo.status == 'complete') {
        // Apply Icon:
        toggleIcon();

        chrome.storage.local.get(['lha', 'ruler', 'spacing', 'font'], items => {
            // LHA:
            if (items.lha) {
                applyAllTabs("lha", items.lha, false);
            }
            // RULER:
            if (items.ruler) {
                applyAllTabs("ruler", items.ruler, true);
            }
            // SPACING:
            if (items.spacing) {
                applyAllTabs("spacing", items.spacing, false);
            }
            // FONT:
            if (items.font) {
                applyAllTabs("font", items.font, false);
            }
        });
    }
});





