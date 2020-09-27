
function setMessages() {
  const now = new Date();
  const year = now.getFullYear();
  const nextYearLastDigits = (year + 1) % 100;
  const month = now.getMonth() + 1;
  const autumnSemester = 8 <= month || month <= 1;

  const semester = autumnSemester ? 1 : 2;
  const targetLabel = `${year}/${nextYearLastDigits}/${semester}`;

  document.getElementById('semesterMatchLabel').innerHTML = chrome.i18n.getMessage('semesterMatch', targetLabel);
  document.getElementById('enabled-label').innerHTML = chrome.i18n.getMessage('enabledLabel');
  document.getElementById('automatic-listing-label').innerHTML = chrome.i18n.getMessage('automaticListingLabel');
}

function restoreOptions() {
  chrome.storage.sync.get({
    enabled: false,
    automaticListing: false,
  }, function (prefs) {
    document.getElementById('main-switch').checked = prefs.enabled
    document.getElementById('automatic-listing-switch').checked = prefs.automaticListing
    updateConfigElementEnabledState(prefs.enabled)
  });
}

function onMainSwitch(enabled) {
  chrome.storage.sync.set({
    enabled: enabled.target.checked
  }, function () {
      updateConfigElementEnabledState(enabled.target.checked);
  });
}

function updateConfigElementEnabledState(enabled) {
  const configEl = document.querySelector('.config')
  configEl.style.setProperty('opacity', enabled ? 1 : 0)
}

function onAutomaticListingSwitch(enabled) {
  chrome.storage.sync.set({
    automaticListing: enabled.target.checked
  });
}

document.addEventListener('DOMContentLoaded', setMessages);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('main-switch').addEventListener('change', onMainSwitch);
document.getElementById('automatic-listing-switch').addEventListener('change', onAutomaticListingSwitch);
