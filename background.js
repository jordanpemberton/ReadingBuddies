// For testing:
// chrome.storage.local.clear();

// Extension Icon (Extension Status):
function toggleIcon() {
    chrome.storage.local.get(['lha', 'ruler', 'spacing', 'font'], items => {
        let status = false;
        // Check status of each item:
        function checkStatus(item) {
            if (items[item]) {
                if (items[item].active == 1) {
                    status = true;
                }
            }
        }
        checkStatus('lha');
        checkStatus('ruler');
        checkStatus('spacing');
        checkStatus('font');
        // Ext is on, use active icon:
        if ( status == true ) {
            chrome.tabs.query({currentWindow: true}, function(tabs) {
                for (let i in tabs) {
                    chrome.browserAction.setIcon({
                        path: "images/icon32active.png",
                        tabId: tabs[i].id
                    });
                }
            });
        } 
        // Ext is off, use inactive icon:
        else {
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
    // Check each tool, apply:
    function checkReq(item, css) {
        if (request[item]) {
            applyAllTabs(item, request[item], css);
        }
    }
    checkReq('lha', false);
    checkReq('ruler', true);
    checkReq('spacing', false);
    checkReq('font', false);
});


// On tab update:
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    // If tab loaded:
    if (changeInfo.status == 'complete') {
        // Apply Icon:
        toggleIcon();
        // Get items from local, apply:
        chrome.storage.local.get(['lha', 'ruler', 'spacing', 'font'], items => {
            function checkItem(item, css) {
                if (items[item]) {
                    applyAllTabs(item, items[item], css);
                }
            }
            checkItem('lha', false);
            checkItem('ruler', true);
            checkItem('spacing', false);
            checkItem('font', false);
        });
    }
});
