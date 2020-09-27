chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.sync.set({
    enabled: true,
    automaticListing: true
  })
});