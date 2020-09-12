
function setSemesterTargetString() {
  const now = new Date();
  const year = now.getFullYear();
  const nextYearLastDigits = (year + 1) % 100;
  const month = now.getMonth() + 1;
  const autumnSemester = 8 <= month || month <= 1;

  const semester = autumnSemester ? 1 : 2;
  const targetLabel = `${year}/${nextYearLastDigits}/${semester}`;

  document.getElementById('semesterMatchLabel').innerHTML = `${targetLabel} egyezés alapján`;
}

function restoreOptions() {
  chrome.storage.sync.get({
    preference: 'semesterMatch',
    enabled: 'false'
  }, function (items) {
    document.getElementById(items.preference).checked = true;
    document.getElementById('main-switch').checked = items.enabled
    updateConfigElementEnabledState(items.enabled)
  });
}

let saveMessageTimeout
function saveOptions() {
  clearTimeout(saveMessageTimeout)
  var preference = document.querySelector('input[name="conf"]:checked').value

  chrome.storage.sync.set({
    preference
  }, function () {
    document.querySelector('.status').style.setProperty('opacity', 1)
    saveMessageTimeout = setTimeout(function () {
      document.querySelector('.status').style.setProperty('opacity', 0)
    }, 2000);
  });
}

function onMainSwitch(enabled) {
  console.log(enabled);
  chrome.storage.sync.set({
    enabled: enabled.target.checked
  }, function () {
    updateConfigElementEnabledState(enabled.target.checked)
  });
}

function updateConfigElementEnabledState(enabled) {
  const configEl = document.querySelector('.config')

  if (enabled) {
    configEl.style.setProperty('height', 'auto')
    configEl.style.setProperty('opacity', 1)
  } else {
    configEl.style.setProperty('height', 0)
    configEl.style.setProperty('opacity', 0)
  }
}

document.addEventListener('DOMContentLoaded', setSemesterTargetString);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('semesterMatch').addEventListener('click', saveOptions);
document.getElementById('currentSemester').addEventListener('click', saveOptions);
document.getElementById('main-switch').addEventListener('change', onMainSwitch);

