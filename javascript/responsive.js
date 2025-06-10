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

function detectDeviceType() {
    gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       window.innerWidth <= GAME_CONFIG.MOBILE_BREAKPOINT;
    updateMobileControlsVisibility();
}

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

function resizeCanvas() {
    const canvas = gameState.canvas;
    if (!canvas) return;
  
    const w = window.innerWidth;
    const h = window.innerHeight;
    console.log(`resizeCanvas() called — window size: ${w}x${h}`);
  
    const { LOGICAL_WIDTH, LOGICAL_HEIGHT, MAX_SCALE } = GAME_CONFIG;
    const scale = Math.max(Math.min(w / LOGICAL_WIDTH, h / LOGICAL_HEIGHT, MAX_SCALE), 0.8);
  
    let cw = LOGICAL_WIDTH * scale;
    let ch = LOGICAL_HEIGHT * scale;
    let topPercent = '50%';
  
    const isSmallPortrait = w <= 400 && h <= 750;
    const isSmallLandscape = w <= 900 && h <= 400;
  
    if (isSmallPortrait || isSmallLandscape) {
      cw = 537;
      ch = 350;
      topPercent = '38%';
    }
    else if (w <= 450 && h <= 850) {
      cw = Math.min(cw, 600);
        ch = Math.min(ch, 380);
        topPercent = '42%';
    }
    else if (w <= 1025) {
      cw = Math.min(cw, 720);
        ch = Math.min(ch, 420);
        topPercent = '42%';
    }
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = topPercent;
    canvas.style.transform = 'translate(-50%, -50%)';
  
    if (typeof world?.updateViewport === 'function') {
      world.updateViewport(cw, ch);
    }
  
    updateMobileControlsVisibility();
  }
  
  

// ==================== BUTTON HANDLERS ====================

function setupEventListeners() {
    const continueBtn = document.getElementById('continueGame');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (world) {
                world.isPaused = false;
                world.resumeGame();
                document.getElementById('pausePopup').style.display = 'none';
            }
        });
    }

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

function setupMobileControls() {
    const controls = [
        { id: 'left-btn', key: 'LEFT' },
        { id: 'right-btn', key: 'RIGHT' },
        { id: 'jump-btn', key: 'UP' },
        { id: 'throw-btn', key: 'D' }
    ];

    controls.forEach(({ id, key }) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        const press = () => {
            window.keyboard[key] = true;
            if (key === 'UP') window.keyboard.SPACE = true;
        };

        const release = () => {
            window.keyboard[key] = false;
            if (key === 'UP') window.keyboard.SPACE = false;
        };

        btn.addEventListener('touchstart', e => { e.preventDefault(); press(); });
        btn.addEventListener('touchend', e => { e.preventDefault(); release(); });
        btn.addEventListener('touchcancel', e => { e.preventDefault(); release(); });

        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    });
}

// ==================== UTILITIES ====================

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