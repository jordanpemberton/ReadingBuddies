// For testing:
// chrome.storage.local.clear();


function applyAllTabs(tool, input, css) {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        for (let i in tabs) {
            // Insert var <tool>input:
            let varname = tool + "input";
            chrome.tabs.executeScript(tabs[i].id, {
                code:   `var ${varname} = ${JSON.stringify(input)};`
            });
            // Insert script file:
            chrome.tabs.executeScript(tabs[i].id, {file: `${tool}.js`});
            // Insert CSS:
            if (css) {
                chrome.tabs.insertCSS(tabs[i].id, {file: `${tool}.css`});
            }
        }
    });
}


// On message from popup:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // LHA:
    if (request.lha) {
        applyAllTabs("lha", request.lha, false);
    }
    // Ruler:
    if (request.ruler) {
        applyAllTabs("ruler", request.ruler, true);
    }
});



// On tab update:
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    // If tab loaded:
    if (changeInfo.status == 'complete') {
        // LHA  (Get from storage):
        chrome.storage.local.get('lha', items => {
            if (items.lha) {
                applyAllTabs("lha", items.lha, false);
            }
        });
        // Ruler  (Get from storage):
        chrome.storage.local.get('ruler', items => {
            if (items.ruler) {
                applyAllTabs("ruler", items.ruler, true);
            }
        });
    }
});





