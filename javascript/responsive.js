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
    MOBILE_BREAKPOINT: 768,
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
    startGame();
}

function detectDeviceType() {
    gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       window.innerWidth <= GAME_CONFIG.MOBILE_BREAKPOINT;
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

    let scale = (windowRatio > ASPECT_RATIO)
        ? Math.min(window.innerHeight / LOGICAL_HEIGHT, MAX_SCALE)
        : Math.min(window.innerWidth / LOGICAL_WIDTH, MAX_SCALE);

    gameState.canvas.style.width = `${LOGICAL_WIDTH * scale}px`;
    gameState.canvas.style.height = `${LOGICAL_HEIGHT * scale}px`;
    gameState.canvas.style.position = 'absolute';
    gameState.canvas.style.left = '50%';
    gameState.canvas.style.top = '50%';
    gameState.canvas.style.transform = 'translate(-50%, -50%)';
}

// ==================== BUTTON HANDLERS ====================

function setupEventListeners() {
    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);

    // Pause Button - Single Source of Truth
    document.getElementById('pause-btn').addEventListener('click', () => {
        if (!world) return;
        
        world.isPaused = !world.isPaused;
        
        if (world.isPaused) {
            world.pauseGame();
            document.getElementById('pausePopup').style.display = 'block';
        } else {
            world.resumeGame();
            document.getElementById('pausePopup').style.display = 'none';
        }
    });

    // Continue Button
    document.getElementById('continueGame').addEventListener('click', () => {
        if (world) {
            world.isPaused = false;
            world.resumeGame();
            document.getElementById('pausePopup').style.display = 'none';
        }
    });

    // Window events
    window.addEventListener('resize', debounce(resizeCanvas, 100));
    document.addEventListener('fullscreenchange', () => {
        gameState.isFullscreen = !!document.fullscreenElement;
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameState.canvas.requestFullscreen().catch(console.error);
    } else {
        document.exitFullscreen();
    }
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