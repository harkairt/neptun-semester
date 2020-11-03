chrome.storage.sync.get(
  {
    enabled: true,
    automaticListingOnChange: true,
  },
  async function (prefs) {
    if (!prefs.enabled) {
      return;
    }

    if (window.location.toString().includes("neptun")) {
      const allOptions = Array.from(document.querySelectorAll("option"));
      const optionsToSelect = getCurrentSemesterOptions(allOptions);
      observeBody();

      if (optionsToSelect.length > 0) {
        selectOptions(optionsToSelect);

        doWhenNotLoadingAnymoreOrTimeout(400, () => {
          clickExpandedSearchButton();

          if (prefs.automaticListingOnChange) {
            doWhenNotLoadingAnymoreOrTimeout(800, () => {
              registerChangeListener();
            });
          }
        });
      } else {
        if (prefs.automaticListingOnChange) {
          doWhenNotLoadingAnymoreOrTimeout(500, () => {
            registerChangeListener();
          });
        }
      }
    }
  }
);


function registerChangeListener() {
  const allOptions = Array.from(document.querySelectorAll("option"));
  const aSemesterOption = allOptions.find(option => option.label.match(/\d\d\d\d\/\d\d\/\d/))
  const selectElement = aSemesterOption.parentElement;

  selectElement.addEventListener("change", () => {
    doWhenNotLoadingAnymoreOrTimeout(500, () => {
      clickExpandedSearchButton();
      doWhenNotLoadingAnymoreOrTimeout(800, () => {
          registerChangeListener();
      });
    });
  });
}

function getCurrentSemesterOptions(options) {
  const semesterFormatMatch = getOptionsMatchingSemesterFormat(options);
  if (semesterFormatMatch.length > 0) {
    return semesterFormatMatch;
  } else {
    const currentSemesterMarkerMatches = getOptionsMatchingCurrentSemesterMarker(
      options
    );
    if (currentSemesterMarkerMatches.length > 0) {
      return currentSemesterMarkerMatches;
    }
  }

  return [];
}

function getOptionsMatchingSemesterFormat(options) {
  return options.filter((option) => option.label.includes(semesterFormat()));
}

function getOptionsMatchingCurrentSemesterMarker(options) {
  return options.filter((option) => option.label.includes("(aktuális félév)"));
}

function selectOptions(optionsList) {
  optionsList.forEach((option) => {
    option.selected = "selected";
  });
}

function semesterFormat() {
  const now = new Date();
  const year = now.getFullYear();
  const nextYearLastDigits = (year + 1) % 100;
  const month = now.getMonth() + 1;
  const autumnSemester = 8 <= month || month <= 1;

  const semester = autumnSemester ? 1 : 2;

  return `${year}/${nextYearLastDigits}/${semester}`;
}

function clickExpandedSearchButton() {
  const listingButtons = Array.from(
    document.querySelectorAll("#upFilter_expandedsearchbutton")
  );
  if (listingButtons.length > 0) {
    listingButtons[0].click();
  }
}

let listeners = {
  // debug: (isLoading) => {console.log('isLoading', isLoading);}
};
function subscribeToPageLoadingState(callback) {
  const id = getRandomInt(1000000000000);
  listeners[id] = callback;
  return id;
}
function unsubscribeFromPageLoadingState(id) {
  delete listeners[id];
}

let _isPageLoading = false;
function observeBody() {
  const body = document.querySelector("body");
  const observer = new MutationObserver((a, b) => {
    const gridanimation = document.querySelector(".gridanimation");
    const fullPageLoadingIndicator = document.querySelector(
      ".modalBckgroundMain"
    );
    const transparentprogress = document.querySelector(".transparentprogress");
    const progress = document.querySelector(".progress");

    const elementsToCheckDisplayOf = [
      gridanimation,
      fullPageLoadingIndicator,
      transparentprogress,
      progress,
    ];
    const hasAtLeastOneLoadingElementDisplayed = elementsToCheckDisplayOf.some(
      (element) => element?.style?.display === "block"
    );

    if (_isPageLoading === hasAtLeastOneLoadingElementDisplayed) {
      return;
    } else {
      _isPageLoading = hasAtLeastOneLoadingElementDisplayed;
      Object.values(listeners).forEach((callback) => callback(_isPageLoading));
    }
  });
  observer.observe(body, { attributes: true, subtree: true, childList: true });
}

async function doWhenNotLoadingAnymoreOrTimeout(timeout, fn) {
  let resolveFn = 0;
  const id = subscribeToPageLoadingState((isLoading) => {
    if (!isLoading) {
      if (resolveFn !== 0) {
        resolveFn();
      }
      unsubscribeFromPageLoadingState(id);
    }
  });
  await new Promise((resolve) => {
    resolveFn = resolve;
    setTimeout(() => {
      if (!_isPageLoading) {
        resolve();
      }
    }, timeout);
  });
  unsubscribeFromPageLoadingState(id);
  fn();
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
