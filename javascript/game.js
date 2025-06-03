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

/**
 * Initializes the game.
 * - Retrieves the canvas element and its context.
 * - Creates a new `World` instance.
 * - Passes the globally accessible `keyboard` object to `World`.
 */
function init() {
  canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  world = new World(canvas, window.keyboard);
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
