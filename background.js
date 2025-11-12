// listen to whether the extension icon is clicked, and tells the content script
// to open the extension's popup if it is clicked.
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "reopen_popup" }, (response) => {
    if (chrome.runtime.lastError) {
      // No receiver — content script not present
      return;
    }
  });
});

