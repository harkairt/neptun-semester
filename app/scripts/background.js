chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.sync.set({
    enabled: true,
    automaticListingOnChange: true
  })
});

chrome.runtime.getBackgroundPage((window) => {
  console.log('hello', window);
})