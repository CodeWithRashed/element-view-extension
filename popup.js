let isEnabled = false;
let checkedItem = "getFontInfo";

const toggleButton = document.querySelector(".toggle");

// FUNCTION TO UPDATE THE UI BASED ON THE CURRENT STATE
function updateUI(isEnabled, checkedItem) {
  if (isEnabled) {
    toggleButton.classList.add("active");
  } else {
    toggleButton.classList.remove("active");
  }

  // Find the radio button with value "item1" and set it as default checked
  const getFontDataCheckbox = document.querySelector(
    'input[type="radio"][value="getFontInfo"]'
  );

  const getDimensionCheckbox = document.querySelector(
    'input[type="radio"][value="getDimension"]'
  );
  if (checkedItem === "getFontInfo") {
    getFontDataCheckbox.checked = true;
  } else if (checkedItem === "getDimension") {
    getDimensionCheckbox.checked = true;
  } else {
    // Handle unexpected cases, maybe log an error
    console.log("Unexpected checkedItem value:", checkedItem);
  }

  console.log(isEnabled, checkedItem);
}

// LOAD THE INITIAL STATE AND UPDATE UI
chrome.storage.local.get(["isEnabled", "checkedItem"], (result) => {
  isEnabled = result.isEnabled || false;
  checkedItem = result.checkedItem;
  console.log(checkedItem, "checkedItem on popup");
  updateUI(isEnabled, checkedItem);
});

// EVENT LISTENER FOR TOGGLE BUTTON
toggleButton.addEventListener("click", () => {
  isEnabled = !isEnabled;

  // Send message to background script to update state
  chrome.storage.local.set({ isEnabled }).then(() => {
    updateUI(isEnabled, checkedItem);
    // Send message directly to content script in active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateState",
          isEnabled,
          checkedItem,
        });
      } else {
        console.log("No active tabs with content scripts running.");
      }
    });
  });
});

//GETTING RADIO BUTTONS STATUS AND UPDATING UI
const checkboxGroups = document.querySelectorAll(".checkbox");

checkboxGroups.forEach(function (checkboxGroup) {
  const radioButtons = checkboxGroup.querySelectorAll('input[type="radio"]');

  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
      const selectedRadioButton = checkboxGroup.querySelector(
        'input[type="radio"]:checked'
      );
      if (selectedRadioButton) {
        checkedItem = selectedRadioButton.value;
        // Update local storage
        chrome.storage.local
          .set({ checkedItem: selectedRadioButton.value || "getFontInfo" })
          .then(() => {
            updateUI(isEnabled, checkedItem);
            // Send message directly to content script in active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: "updateState",
                  isEnabled,
                  checkedItem,
                });
              } else {
                console.warn("No active tabs with content scripts running.");
              }
            });
          });
        console.log("Selected radio button value:", selectedRadioButton.value);
      } else {
        console.log("No radio button selected in this group.");
      }
    });
  });
});
