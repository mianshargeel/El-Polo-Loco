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

function initializeGameSystem() {
  detectDeviceType();
  setupCanvas();
  setupEventListeners();
  createLandscapeWarning();
  startGame();
}

function createLandscapeWarning() {
  const warningDiv = document.createElement('div');
  warningDiv.className = 'landscape-warning';
  warningDiv.textContent = 'Please turn your device to landscape mode for the best experience!';
  document.body.appendChild(warningDiv);

  checkOrientation();
  window.addEventListener('resize', checkOrientation);
}

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
/**
 * Detects whether the current device is a mobile device.
 * Updates the `gameState.isMobile` flag based on user agent, screen width,
 * and special handling for iPads running desktop-class Safari.
 * If the device has newly switched to mobile mode, it initializes mobile controls.
 * Also updates the visibility of mobile control buttons.
 */
function detectDeviceType() {
  const wasMobile = gameState.isMobile;

  gameState.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= GAME_CONFIG.MOBILE_BREAKPOINT;
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
      gameState.isMobile = true;
  }
  if (!wasMobile && gameState.isMobile) {
      setupMobileControls();  // make sure this runs again
  }
  updateMobileControlsVisibility();
}

window.addEventListener('resize', debounce(() => {
  detectDeviceType(); 
  resizeCanvas();
  checkOrientation();
}, 100));


function updateMobileControlsVisibility() {
  const mobileControls = document.getElementById('mobile-controls');
  if (!mobileControls) return;

  if (gameState.isMobile && !gameState.isPaused && !document.body.classList.contains('landscape-warning-active')) {
      mobileControls.style.display = 'flex';
  } else {
      mobileControls.style.display = 'none';
  }
}

function setupCanvas() {
  gameState.canvas = document.getElementById('canvas');
  if (!gameState.canvas) return;

  gameState.canvas.width = GAME_CONFIG.LOGICAL_WIDTH;
  gameState.canvas.height = GAME_CONFIG.LOGICAL_HEIGHT;
  resizeCanvas();
}
/**
 * Resizes and styles the game canvas based on the current window size.
 * Uses the calculated dimensions from `calculateCanvasSize()` to apply styles
 * and updates the viewport if the `world` has a `updateViewport()` method.
 * Also refreshes mobile control visibility.
 */
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
/**
 * Sets up event listeners for mobile on-screen control buttons.
 * Prevents duplicate initialization using a flag. Maps each button to a corresponding key input,
 * and handles both touch and mouse events to simulate key presses.
 */
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

function registerMobileButton({ id, key }) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const press = () => handleKeyPress(key, true);
  const release = () => handleKeyPress(key, false);

  bindTouchEvents(btn, press, release);
  bindMouseEvents(btn, press, release);
}

function handleKeyPress(key, isPressed) {
  window.keyboard[key] = isPressed;
  if (key === 'UP') window.keyboard.SPACE = isPressed;
}

function bindTouchEvents(btn, press, release) {
  btn.addEventListener('touchstart', e => { e.preventDefault(); press(); });
  btn.addEventListener('touchend', e => { e.preventDefault(); release(); });
  btn.addEventListener('touchcancel', e => { e.preventDefault(); release(); });
}

function bindMouseEvents(btn, press, release) {
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
}


function debounce(func, delay) {
  let timeout;
  return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), delay);
  };
}

function startGame() {
  if (typeof window.init === 'function') {
      window.init();
  } else {
      console.error("Game initialization function not found");
  }
}

document.addEventListener('DOMContentLoaded', initializeGameSystem);