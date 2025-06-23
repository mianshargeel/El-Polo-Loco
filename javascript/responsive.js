/**
 * =============================================
 * RESPONSIVE MANAGER - FINAL OPTIMIZED VERSION
 * =============================================
 * - Single source of truth for all UI buttons
 * - No duplicate buttons
 * - All buttons stay inside canvas
 * - Full mobile/desktop support
 */

const GAME_CONFIG = {
  LOGICAL_WIDTH: 720,
  LOGICAL_HEIGHT: 480,
  ASPECT_RATIO: 720 / 480,
  MOBILE_BREAKPOINT: 1370,
  MAX_SCALE: 2.0
};

let mobileControlsInitialized = false;

const gameState = {
  canvas: null,
  isMobile: false,
  isFullscreen: false,
  isPaused: false
};

/** Initializes the game system by setting up canvas, controls, and UI. */
function initializeGameSystem() {
  detectDeviceType();
  setupCanvas();
  setupEventListeners();
  createLandscapeWarning();
  startGame();
}

/** Creates a warning banner for landscape orientation on small screens. */
function createLandscapeWarning() {
  const warningDiv = document.createElement('div');
  warningDiv.className = 'landscape-warning';
  warningDiv.textContent = 'Please turn your device to landscape mode for the best experience!';
  document.body.appendChild(warningDiv);

  checkOrientation();
  window.addEventListener('resize', checkOrientation);
}

/** Checks screen orientation and toggles landscape warning display. */
function checkOrientation() {
  const warning = document.querySelector('.landscape-warning');
  if (!warning) return;
  const showWarning = window.innerWidth <= GAME_CONFIG.MOBILE_BREAKPOINT && window.matchMedia("(orientation: portrait)").matches;
  document.body.classList.toggle('landscape-warning-active', showWarning);
  warning.style.display = showWarning ? 'flex' : 'none';
  const mobileControls = document.getElementById('mobile-controls');
  if (mobileControls) {
      mobileControls.style.display = (!showWarning && gameState.isMobile && !gameState.isPaused) ? 'flex' : 'none';
  }
}

/** Detects whether the device is mobile and updates UI state. */
function detectDeviceType() {
  const wasMobile = gameState.isMobile;
  gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= GAME_CONFIG.MOBILE_BREAKPOINT;
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) { gameState.isMobile = true; }
  if (!wasMobile && gameState.isMobile) { setupMobileControls();  }
  updateMobileControlsVisibility();
}

/**
 * Adds a debounced window resize listener to update layout and UI.
 */
function setupResizeHandler() {
  window.addEventListener('resize', debounce(() => {
    detectDeviceType(); 
    resizeCanvas();
    checkOrientation();
  }, 100));
}

/** Updates the visibility of mobile on-screen controls. */
function updateMobileControlsVisibility() {
  const mobileControls = document.getElementById('mobile-controls');
  if (!mobileControls) return;

  if (gameState.isMobile && !gameState.isPaused && !document.body.classList.contains('landscape-warning-active')) {
      mobileControls.style.display = 'flex';
  } else {
      mobileControls.style.display = 'none';
  }
}

/** Initializes and resizes the canvas element for the game. */
function setupCanvas() {
  gameState.canvas = document.getElementById('canvas');
  if (!gameState.canvas) return;

  gameState.canvas.width = GAME_CONFIG.LOGICAL_WIDTH;
  gameState.canvas.height = GAME_CONFIG.LOGICAL_HEIGHT;
  resizeCanvas();
}

/** Resizes the canvas based on screen size and updates viewport. */
function resizeCanvas() {
  const canvas = gameState.canvas;
  if (!canvas) return;
  const { w, h, scale, cw, ch, topPercent } = calculateCanvasSize();
  applyCanvasStyles(canvas, cw, ch, topPercent);

  if (typeof world?.updateViewport === 'function') {
    world.updateViewport(cw, ch);
  }
  updateMobileControlsVisibility();
}

/**
 * Calculates the optimal canvas size and position based on the current window size.
 * Ensures scaling stays within limits and adjusts for small screens.
 * @returns {{w: number, h: number, scale: number, cw: number, ch: number, topPercent: string}} Canvas size and UI positioning
 */
function calculateCanvasSize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const { LOGICAL_WIDTH, LOGICAL_HEIGHT, MAX_SCALE } = GAME_CONFIG;
  const scale = Math.max(Math.min(w / LOGICAL_WIDTH, h / LOGICAL_HEIGHT, MAX_SCALE), 0.8);
  let cw = LOGICAL_WIDTH * scale;
  let ch = LOGICAL_HEIGHT * scale;

  return getCanvasDimensions(w, h, scale, cw, ch);
}

/**
 * Determines the adjusted canvas dimensions and vertical alignment based on screen size.
 * @param {number} w - Current window width
 * @param {number} h - Current window height
 * @param {number} scale - Calculated scale factor
 * @param {number} cw - Calculated canvas width
 * @param {number} ch - Calculated canvas height
 * @returns {{w: number, h: number, scale: number, cw: number, ch: number, topPercent: string}} Final dimensions and top offset
 */
function getCanvasDimensions(w, h, scale, cw, ch) {
  if (isSmallScreen(w, h)) return { w, h, scale, cw: 537, ch: 350, topPercent: '38%' };
  if (w <= 850 && h <= 450) return { w, h, scale, cw: Math.min(cw, 600), ch: Math.min(ch, 380), topPercent: '42%' };
  if (w <= 1025) return { w, h, scale, cw: Math.min(cw, 720), ch: Math.min(ch, 420), topPercent: '42%' };
  if (w <= 1370) return { w, h, scale, cw: Math.min(cw, 1000), ch: Math.min(ch, 512), topPercent: '36%' };
  return { w, h, scale, cw, ch, topPercent: '50%' };
}

function isSmallScreen(w, h) {
  return (w <= 400 && h <= 750) || (w <= 900 && h <= 400);
}

/**
 * Checks whether the screen is considered small (portrait or landscape).
 * @param {number} w - Window width
 * @param {number} h - Window height
 * @returns {boolean} True if small portrait or small landscape screen
 */
function applyCanvasStyles(canvas, cw, ch, topPercent) {
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;
  canvas.style.position = 'absolute';
  canvas.style.left = '50%';
  canvas.style.top = topPercent;
  canvas.style.transform = 'translate(-50%, -50%)';
}

/** Sets up window and fullscreen event listeners. */
function setupEventListeners() {
  if (gameState.isMobile) {
      setupMobileControls();
  }
  window.addEventListener('resize', debounce(() => {
      resizeCanvas();
      checkOrientation();
  }, 100));

  document.addEventListener('fullscreenchange', () => {
      gameState.isFullscreen = !!document.fullscreenElement;
  });
}

/** Initializes mobile control buttons if not already initialized. */
function setupMobileControls() {
  if (mobileControlsInitialized) return;
  mobileControlsInitialized = true;

  const controls = [
    { id: 'left-btn', key: 'LEFT' },
    { id: 'right-btn', key: 'RIGHT' },
    { id: 'jump-btn', key: 'UP' },
    { id: 'throw-btn', key: 'D' }
  ];

  controls.forEach(registerMobileButton);
}

/** Registers a single mobile control button for input handling. */
function registerMobileButton({ id, key }) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const press = () => handleKeyPress(key, true);
  const release = () => handleKeyPress(key, false);

  bindTouchEvents(btn, press, release);
  bindMouseEvents(btn, press, release);
}

/** Simulates keyboard key press or release. */
function handleKeyPress(key, isPressed) {
  window.keyboard[key] = isPressed;
  if (key === 'UP') window.keyboard.SPACE = isPressed;
}

/** Binds touch events for a mobile button element. */
function bindTouchEvents(btn, press, release) {
  btn.addEventListener('touchstart', e => { e.preventDefault(); press(); });
  btn.addEventListener('touchend', e => { e.preventDefault(); release(); });
  btn.addEventListener('touchcancel', e => { e.preventDefault(); release(); });
}

/** Binds mouse events for a mobile button element. */
function bindMouseEvents(btn, press, release) {
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
}

/** Debounces a function to limit how often it's triggered. */
function debounce(func, delay) {
  let timeout;
  return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), delay);
  };
}

/** Starts the game by calling the global init() function. */
function startGame() {
  if (typeof window.init === 'function') {
      window.init();
  } else {
      console.error("Game initialization function not found");
  }
}

/**
 * Initializes the entire game system and sets up event listeners.
 */
function setupGame() {
  document.addEventListener('DOMContentLoaded', () => {
    initializeGameSystem();
    setupResizeHandler();
  });
}

/**
 * Initializing game
*/
setupGame();