/**
 * Initializes the Impressum dialog functionality on DOM load.
 */
function initializeImpressumDialog() {
  document.addEventListener('DOMContentLoaded', () => {
    const showImpressum = document.getElementById('showImpressum');
    const closeImpressum = document.getElementById('closeImpressum');
    const impressumDialog = document.getElementById('impressumDialog');
    const impressumContent = document.getElementById('impressumContent');

    setupShowImpressum(showImpressum, impressumDialog, impressumContent);
    setupCloseButtons(closeImpressum, impressumDialog);
    setupOutsideClick(impressumDialog);
    setupEscapeClose(impressumDialog);
  });
}

/**
 * Call the function
 *  */
initializeImpressumDialog();


/**
 * Attaches a click listener to the "showImpressum" link and loads content into dialog.
 * @param {HTMLElement} trigger - The element that triggers the Impressum popup.
 * @param {HTMLElement} dialog - The dialog element to display.
 * @param {HTMLElement} contentArea - The element where content will be injected.
 */
function setupShowImpressum(trigger, dialog, contentArea) {
  trigger.addEventListener('click', async (e) => {
    e.preventDefault();
    contentArea.innerHTML = '<div class="loading">Loading Impressum...</div>';
    dialog.style.display = 'flex';
    await loadImpressumContent(trigger.getAttribute('href'), contentArea);
  });
}

/**
 * Fetches the Impressum HTML content and inserts it into the dialog.
 * @param {string} url - URL to fetch the Impressum HTML from.
 * @param {HTMLElement} target - The element where the fetched content will be placed.
 */
async function loadImpressumContent(url, target) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const content = doc.querySelector('body') || doc.documentElement;
    target.innerHTML = content.innerHTML;
  } catch (error) {
    target.innerHTML = '<div class="error">Failed to load Impressum content.</div>';
    console.error('Error loading impressum:', error);
  }
}

/**
 * Adds a click listener to the close button to hide the dialog.
 * @param {HTMLElement} closeBtn - The close button element.
 * @param {HTMLElement} dialog - The dialog element to hide.
 */
function setupCloseButtons(closeBtn, dialog) {
  closeBtn.addEventListener('click', () => {
    dialog.style.display = 'none';
  });
}

/**
 * Closes the dialog when a user clicks outside the content area.
 * @param {HTMLElement} dialog - The dialog container to monitor.
 */
function setupOutsideClick(dialog) {
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.style.display = 'none';
    }
  });
}

/**
 * Closes the dialog when the Escape key is pressed.
 * @param {HTMLElement} dialog - The dialog to be hidden.
 */
function setupEscapeClose(dialog) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.style.display === 'flex') {
      dialog.style.display = 'none';
    }
  });
}
