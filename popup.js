let isEnabled = false;

const toggleButton = document.querySelector(".toggle");

// FUNCTION TO UPDATE THE UI BASED ON THE CURRENT STATE
function updateUI(isEnabled) {
  if (isEnabled) {
    toggleButton.classList.add("active");
  } else {
    toggleButton.classList.remove("active");
  }
}

// LOAD THE INITIAL STATE AND UPDATE UI
chrome.storage.local.get(["isEnabled"], (result) => {
  isEnabled = result.isEnabled || false;
  updateUI(isEnabled);
});

// EVENT LISTENER FOR TOGGLE BUTTON
toggleButton.addEventListener("click", () => {
  isEnabled = !isEnabled;
  
  // Send message to background script to update state
  chrome.runtime.sendMessage({ action: "updateState", isEnabled }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("Error sending message to background script:", chrome.runtime.lastError.message);
    } else {
      console.log("Message sent to background script successfully.");
    }
  });

  // Update local storage
  chrome.storage.local.set({ isEnabled: isEnabled }).then(() => {
    console.log("Status saved to local storage.", isEnabled);
    updateUI(isEnabled);
  });
});


//GETTING RADIO BUTTONS STATUS AND UPDATING UI
  const checkboxGroups = document.querySelectorAll('.checkbox');

  checkboxGroups.forEach(function(checkboxGroup) {
      const radioButtons = checkboxGroup.querySelectorAll('input[type="radio"]');
      
      radioButtons.forEach(function(radioButton) {
          radioButton.addEventListener('change', function() {
              const selectedRadioButton = checkboxGroup.querySelector('input[type="radio"]:checked');
              if (selectedRadioButton) {
                  console.log("Selected radio button value:", selectedRadioButton.value);
              } else {
                  console.log("No radio button selected in this group.");
              }
          });
      });

      // Find the radio button with value "item1" and set it as default checked
      const defaultCheckedRadioButton = checkboxGroup.querySelector('input[type="radio"][value="item1"]');
      if (defaultCheckedRadioButton) {
          defaultCheckedRadioButton.checked = true;
      }
  });

