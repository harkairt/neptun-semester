chrome.storage.sync.get({
  automaticListing: true,
  enabled: true
}, async function (prefs) {
  if (!prefs.enabled) {
    return
  }

  if (window.location.toString().includes('neptun')) {
    const options = Array.from(document.querySelectorAll('option'));
    const selectSuccess = selectCurrentSemester(options);

    if (prefs.automaticListing && selectSuccess) {
      clickListing()
    }
  }
});

function selectCurrentSemester(options) {
  const semesterFormatMatch = getOptionsMatchingSemesterFormat(options)
  if (semesterFormatMatch.length > 0) {
    selectOptions(semesterFormatMatch)
    return true
  } else {
    const currentSemesterMarkerMatches = getOptionsMatchingCurrentSemesterMarker(options)
    if (currentSemesterMarkerMatches.length > 0) {
      selectOptions(currentSemesterMarkerMatches)
      return true
    }
  }

  return false
}

function getOptionsMatchingSemesterFormat(options) {
  return options.filter((option) => option.label.includes(semesterFormat()))
}

function getOptionsMatchingCurrentSemesterMarker(options) {
  return options.filter(option => option.label.includes('(aktuális félév)'))
}

function selectOptions(optionsList) {
  optionsList.forEach((option) => { option.selected = 'selected' })
}

function semesterFormat() {
  const now = new Date()
  const year = now.getFullYear()
  const nextYearLastDigits = (year + 1) % 100
  const month = now.getMonth() + 1;
  const autumnSemester = 8 <= month || month <= 1

  const semester = autumnSemester ? 1 : 2

  return `${year}/${nextYearLastDigits}/${semester}`
}

function clickListing() {
  const listingButtons = Array.from(document.querySelectorAll('input[role="button"][type="submit"]'));
  if (listingButtons.length === 2) {
    listingButtons[0].click()
  }
}