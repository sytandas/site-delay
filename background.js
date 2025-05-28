chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.storage.sync.get(['trackedSites', 'delaySeconds'], ({ trackedSites = [], delaySeconds = 30 }) => {
      const matched = trackedSites.find(site => tab.url.includes(site));
      if (matched) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"]
        });
      }
    });
  }
});