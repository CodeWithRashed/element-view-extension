// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateState') {
        // Send message to content scripts in active tabs
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'updateState', isEnabled: message.isEnabled, isEnabled: message.checkedItem }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log("Error sending message to content script:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Message sent to content script successfully.");
                    }
                });
            } else {
                console.warn("No active tabs with content scripts running.");
            }
        });
    }
});

