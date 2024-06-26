let isEnabled = false; // Initialize isEnabled to false by default
let checkedItem = "getFontInfo"

// Function to remove all tooltips from inactive (not hovered) elements
function removeTooltips() {
    const tooltips = document.querySelectorAll(".font-info-tooltip");
    tooltips.forEach(tooltip => tooltip.remove());
}

// Function to retrieve computed styles from the DOM
function getComputedStyleValue(target, property) {
    return window.getComputedStyle(target).getPropertyValue(property);
}

// Function to create and show tooltip
function showTooltip(target, text, x, y) {
    // Create tooltip element
    const tooltip = document.createElement("div");
    tooltip.classList.add("font-info-tooltip");
    tooltip.style.position = "fixed";
    tooltip.style.background = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px";
    tooltip.style.zIndex = "999999";
    tooltip.textContent = text;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";

    // Apply gradient border style to target element (optional)
    target.style.border = "1px solid";
    target.style.borderImage = "linear-gradient(to right, red, blue)";
    target.style.borderImageSlice = "1";

    // Append tooltip to the body
    document.body.appendChild(tooltip);
}

// Function to handle mouseover event
function handleMouseover(event) {
    if (isEnabled) {
        const target = event.target;
        // Retrieve computed font size, line height, and font weight
        const fontSize = getComputedStyleValue(target, "font-size");
        const lineHeight = getComputedStyleValue(target, "line-height");
        const fontWeight = getComputedStyleValue(target, "font-weight");
        const fontColor = getComputedStyleValue(target, "color")
        const fontFamily = getComputedStyleValue(target, "font-family")

        // FOR DIMENSION 
        const itemWidth = getComputedStyleValue(target, "width");
        const itemHeight = getComputedStyleValue(target, "height");
        const itemMargin = getComputedStyleValue(target, "margin")
        const itemPadding = getComputedStyleValue(target, "padding")
        // Construct tooltip text

        let tooltipText;
        if(checkedItem == "getDimension"){

             tooltipText = `Width: ${itemWidth} || Height: ${itemHeight} || Margin: ${itemMargin} || Padding: ${itemPadding}`;
        }else{
             tooltipText = `Font Size: ${fontSize} || Line Height: ${lineHeight} || Font Weight: ${fontWeight} || Color: ${fontColor} || Font Family: ${fontFamily}`;

        }

        // Get the position of the target element
        const rect = target.getBoundingClientRect();
        const x = rect.left + window.pageXOffset;
        const y = rect.top + window.pageYOffset + rect.height;

        // Show tooltip
        showTooltip(target, tooltipText, x, y);
    }
}

// Function to handle mouseout event
function handleMouseout(event) {
    if (isEnabled) {
        // Remove any existing tooltips
        removeTooltips();

        // Reset border style of target element (optional)
        event.target.style.border = "none";
    }
}

// Add event listeners when extension is enabled
function addListeners() {
    document.addEventListener("mouseover", handleMouseover);
    document.addEventListener("mouseout", handleMouseout);
}

// Remove event listeners when extension is disabled
function removeListeners() {
    document.removeEventListener("mouseover", handleMouseover);
    document.removeEventListener("mouseout", handleMouseout);
}

// Function to update the extension's state
function updateState(updatedIsEnabled, updatedCheckedItem) {
    isEnabled = updatedIsEnabled;
    checkedItem = updatedCheckedItem

    if (isEnabled) {
        addListeners(); // Add event listeners if extension is enabled
    } else {
        removeListeners(); // Remove event listeners if extension is disabled
        removeTooltips(); // Remove any existing tooltips if extension is disabled
    }
}

// Get initial state from local storage upon initialization
chrome.storage.local.get(["isEnabled", "checkedItem"], (result) => {
    updateState(result.isEnabled, result.checkedItem);
});
// Listen for messages from the background script to update the state
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateState') {
      isEnabled = message.isEnabled;
      checkedItem = message.checkedItem;
  
      if (isEnabled) {
        addListeners();
      } else {
        removeListeners();
        removeTooltips();
      }
    }
  });