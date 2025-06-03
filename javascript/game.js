/**
 * Global reference to the game's canvas element.
 * It will be assigned in the `init()` function.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Global reference to the `World` instance, representing the game.
 * It is initialized in the `init()` function.
 * @type {World}
 */
let world;

/**
 * Creates a globally accessible `Keyboard` instance.
 * Used to track player input and control character movement.
 * @global
 * @type {Keyboard}
 */
window.keyboard = new Keyboard();
let gameInfoPopup; 


function init() {
  try {
    // 1. Get canvas element
    canvas = document.getElementById('canvas');
    if (!canvas) throw new Error('Canvas element not found!');
    
    // 2. Initialize game world
    world = new World(canvas, window.keyboard);
    
    // 3. Setup popup system
    setupPopupSystem();
    
    // 4. Setup game controls
    setupGameControls();
    
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

function setupPopupSystem() {
  // Get elements
  const popup = document.getElementById('gameInfoPopup');
  if (!popup) {
    console.warn('Popup element not found - game info feature disabled');
    return;
  }

  const closeBtn = popup.querySelector('.close-btn');
  if (!closeBtn) {
    console.warn('Close button not found in popup');
    return;
  }

  // Track popup state
  let isPopupOpen = false;

  // Open popup
  document.getElementById('info-btn')?.addEventListener('click', () => {
    popup.style.display = 'block';
    isPopupOpen = true;
    
    // Pause game if it's running
    if (world && world.gameStarted) {
      world.pauseGame();
    }
  });

  // Close popup
  const closePopup = () => {
    popup.style.display = 'none';
    isPopupOpen = false;
    
    // Resume game if it was running
    if (world && world.gameStarted && world.isPaused) {
      world.resumeGame();
    }
  };

  // Close button click
  closeBtn.addEventListener('click', closePopup);

  // Click outside to close (improved version)
  document.addEventListener('click', (e) => {
    if (!isPopupOpen) return;
    
    const isClickInsidePopup = popup.contains(e.target);
    const isInfoButton = e.target.id === 'info-btn';
    
    if (!isClickInsidePopup && !isInfoButton) {
      closePopup();
    }
  });

}

function setupGameControls() {
  // Start game button
  document.getElementById('start-btn')?.addEventListener('click', () => {
    if (world) {
      world.startGame();
      // Hide popup when game starts
      const popup = document.getElementById('gameInfoPopup');
      if (popup) popup.style.display = 'none';
    }
  });
  
  // Other control setup can go here
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function setupEventListeners() {
    document.getElementById('pause-btn').addEventListener('click', () => {
      if (world) {
          world.togglePause();
      }
  });
}

/**
 * Handles the `keydown` event and updates the `keyboard` object accordingly.
 * Prevents the default browser behavior for the space key (e.g., page scrolling).
 * 
 * @param {KeyboardEvent} e - The keydown event.
 */
window.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) {
    e.preventDefault(); // Prevents page scrolling when pressing Space
    window.keyboard.SPACE = true;
  }

  if (e.keyCode === 39) {
    window.keyboard.RIGHT = true;
  }
  if (e.keyCode === 37) {
    window.keyboard.LEFT = true;
  }
  if (e.keyCode === 38) {
    window.keyboard.UP = true;
  }
  if (e.keyCode === 40) {
    window.keyboard.DOWN = true;
  }
  if (e.keyCode === 68) {
    window.keyboard.D = true;
  }
});

/**
 * Handles the `keyup` event and resets the corresponding key state in the `keyboard` object.
 * 
 * @param {KeyboardEvent} e - The keyup event.
 */
window.addEventListener('keyup', (e) => {
  if (e.keyCode === 39) {
    window.keyboard.RIGHT = false;
  }
  if (e.keyCode === 37) {
    window.keyboard.LEFT = false;
  }
  if (e.keyCode === 38) {
    window.keyboard.UP = false;
  }
  if (e.keyCode === 40) {
    window.keyboard.DOWN = false;
  }
  if (e.keyCode === 32) {
    window.keyboard.SPACE = false;
  }
  if (e.keyCode === 68) {
    window.keyboard.D = false;
  }
});
