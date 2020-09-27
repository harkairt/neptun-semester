const options = Array.from(document.querySelectorAll('option'));
const currentSemesterOption = options.filter(option => option.label.includes('(aktuális félév)'))

chrome.storage.sync.get({
  preference: 'semesterMatch',
  enabled: 'false'
}, async function (items) {
  if (!items.enabled) {
    return
  }

    if (window.location.toString().includes('neptun')) {
    selectCurrentSemester(items.preference)
  }
});

function selectCurrentSemester(preferredSelection) {
  if (preferredSelection === 'semesterMatch') {
    const success = selectCurrentSemesterBySemesterMatch()
    if (!success) {
      selectCurrentSemesterByCurrentSemesterString()
    }
  } else {
    const success = selectCurrentSemesterByCurrentSemesterString()
    if (!success) {
      selectCurrentSemesterBySemesterMatch()
    }
  }
}

function selectCurrentSemesterByCurrentSemesterString() {
  const currentSemesterOption = options.filter(option => option.label.includes('(aktuális félév)'))

  if (currentSemesterOption.length) {
    console.log('found (aktuális félév)');
    selectOptions(currentSemesterOption)
  } else {
    console.log('no option matches (aktuális félév)');
  }

  return currentSemesterOption.length
}

function selectCurrentSemesterBySemesterMatch() {
  const now = new Date()
  const year = now.getFullYear()
  const nextYearLastDigits = (year + 1) % 100
  const month = now.getMonth() + 1;
  const autumnSemester = 8 <= month || month <= 1

  const semester = autumnSemester ? 1 : 2

  const targetLabel = `${year}/${nextYearLastDigits}/${semester}`

  const optionsThatMatchTargetLabel = options.filter((option) => option.label.includes(targetLabel))

  if (optionsThatMatchTargetLabel.length) {
    console.log('found option which matches', targetLabel);
    selectOptions(optionsThatMatchTargetLabel)
  } else {
    console.log('no option matches', targetLabel);

  }

  return optionsThatMatchTargetLabel.length
}

function selectOptions(optionsList) {
  optionsList.forEach((option) => { option.selected = 'selected' })
}