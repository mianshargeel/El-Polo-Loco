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
    MOBILE_BREAKPOINT: 1025,
    MAX_SCALE: 2.0
};

const gameState = {
    canvas: null,
    isMobile: false,
    isFullscreen: false,
    isPaused: false
};

// ==================== CORE FUNCTIONS ====================

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
    
    // Check orientation on load and resize
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
}

function checkOrientation() {
    const warning = document.querySelector('.landscape-warning');
    if (!warning) return;
    
    if (window.innerWidth <= 1025 && window.matchMedia("(orientation: portrait)").matches) {
        document.body.classList.add('landscape-warning-active');
        warning.style.display = 'flex';
    } else {
        document.body.classList.remove('landscape-warning-active');
        warning.style.display = 'none';
    }
}

function detectDeviceType() {
    gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       window.innerWidth <= GAME_CONFIG.MOBILE_BREAKPOINT;
    
    // Update mobile controls visibility immediately
    updateMobileControlsVisibility();
}

function updateMobileControlsVisibility() {
    const mobileControls = document.querySelector('.mobile-controls');
    if (!mobileControls) return;
    
    // Show controls if mobile and game is not paused
    if (gameState.isMobile && !gameState.isPaused) {
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

function resizeCanvas() {
    if (!gameState.canvas) return;

    const { LOGICAL_WIDTH, LOGICAL_HEIGHT, ASPECT_RATIO, MAX_SCALE } = GAME_CONFIG;
    const windowRatio = window.innerWidth / window.innerHeight;

    // Unified scaling approach for all devices
    let scale = Math.min(
        window.innerWidth / LOGICAL_WIDTH,
        window.innerHeight / LOGICAL_HEIGHT,
        MAX_SCALE
    );

    // Apply minimum scale to prevent UI from becoming too small
    scale = Math.max(scale, 0.8);

    const canvasWidth = LOGICAL_WIDTH * scale;
    const canvasHeight = LOGICAL_HEIGHT * scale;

    // Apply styles - ALWAYS center both horizontally and vertically
    gameState.canvas.style.width = `${canvasWidth}px`;
    gameState.canvas.style.height = `${canvasHeight}px`;
    gameState.canvas.style.position = 'absolute';
    gameState.canvas.style.left = '50%';
    gameState.canvas.style.top = '50%';
    gameState.canvas.style.transform = 'translate(-50%, -50%)';

    // Critical: Update the game world's viewport dimensions
    if (typeof world !== 'undefined' && world.updateViewport) {
        world.updateViewport(canvasWidth, canvasHeight);
    }
}
// ==================== BUTTON HANDLERS ====================

function setupEventListeners() {
    // Continue Button
    document.getElementById('continueGame').addEventListener('click', () => {
        if (world) {
            world.isPaused = false;
            world.resumeGame();
            document.getElementById('pausePopup').style.display = 'none';
        }
    });

    // mobile control event listeners
    if (gameState.isMobile) {
        setupMobileControls();
    }


    // Window events
    window.addEventListener('resize', debounce(resizeCanvas, 100));
    document.addEventListener('fullscreenchange', () => {
        gameState.isFullscreen = !!document.fullscreenElement;
    });
}

function setupMobileControls() {
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const jumpBtn = document.getElementById('jump-btn');
    const throwBtn = document.getElementById('throw-btn');

    // More reliable event handling
    const handleButtonPress = (key) => {
        console.log(`${key} pressed (mobile)`);
        window.keyboard[key] = true;
        
        // Special case: Also trigger SPACE when UP is pressed
        if (key === 'UP') window.keyboard.SPACE = true;
    };

    const handleButtonRelease = (key) => {
        console.log(`${key} released (mobile)`);
        window.keyboard[key] = false;
        
        // Special case: Also release SPACE when UP is released
        if (key === 'UP') window.keyboard.SPACE = false;
    };

    // Touch event handlers
    const setupTouchControls = (element, key) => {
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleButtonPress(key);
        });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleButtonRelease(key);
        });

        element.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            handleButtonRelease(key);
        });
    };

    // Mouse event handlers (for testing)
    const setupMouseControls = (element, key) => {
        element.addEventListener('mousedown', () => handleButtonPress(key));
        element.addEventListener('mouseup', () => handleButtonRelease(key));
        element.addEventListener('mouseleave', () => handleButtonRelease(key));
    };

    // Set up all controls
    setupTouchControls(leftBtn, 'LEFT');
    setupMouseControls(leftBtn, 'LEFT');
    
    setupTouchControls(rightBtn, 'RIGHT');
    setupMouseControls(rightBtn, 'RIGHT');
    
    setupTouchControls(jumpBtn, 'UP');
    setupMouseControls(jumpBtn, 'UP');
    
    setupTouchControls(throwBtn, 'D');
    setupMouseControls(throwBtn, 'D');
}

// ==================== UTILITIES ====================

function debounce(func, delay) {
    let timeout;
    return function() {
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

// Initialize when ready
document.addEventListener('DOMContentLoaded', initializeGameSystem);