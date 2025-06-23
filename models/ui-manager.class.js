/**
 * Manages the game's UI, including buttons, popups, and event listeners.
 * Handles the start screen, game info popup, and pause menu.
 */
class UIManager {
    constructor(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        this.pausePopup = new PausePopup(this.world);
    }

    /** Clears the canvas to show the start screen without rendering additional content. */
    showStartScreen() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /** Sets up event listeners for all game control buttons (start, pause, info, etc). */
    setupGameControls() {
        this.setupStartButton();
        this.setupPauseButton();
        this.setupContinueButton();
        this.setupMainMenuButtons();
        this.setupInfoButton();
        this.setupInfoPopupCloseButton();
    }
    
    /** Sets up the start button to begin the game. */
    setupStartButton() {
        const startBtn = document.getElementById('start-btn');
        startBtn?.addEventListener('click', () => {
            this.world.startGame();
            document.getElementById('gameInfoPopup').style.display = 'none';
        });
    }
    
    /** Sets up the pause button to toggle pause/resume. */
    setupPauseButton() {
        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn?.addEventListener('click', () => {
            this.togglePause();
        });
    }
    
    /** Sets up the continue button to resume the game. */
    setupContinueButton() {
        const continueBtn = document.getElementById('continueGame');
        continueBtn?.addEventListener('click', () => {
            this.world.resumeGame();
        });
    }
    
    /** Adds event listeners to all "go to main menu" buttons. */
    setupMainMenuButtons() {
        document.querySelectorAll('.go-to-main-menu').forEach(button => {
            button.addEventListener('click', () => {
                this.goToMainMenu();
            });
        });
    }
    
    /** Sets up the info button to show the popup and pause the game if needed. */
    setupInfoButton() {
        const infoBtn = document.getElementById('info-btn');
        infoBtn?.addEventListener('click', () => {
            const popup = document.getElementById('gameInfoPopup');
            popup.style.display = 'block';
    
            if (this.world.gameStarted) {
                this.world.pauseGame();
            }
        });
    }
    
    /** Sets up the close button for the info popup to hide it and resume if paused. */
    setupInfoPopupCloseButton() {
        const closeBtn = document.querySelector('#gameInfoPopup .close-btn');
        closeBtn?.addEventListener('click', () => {
            const popup = document.getElementById('gameInfoPopup');
            popup.style.display = 'none';
    
            if (this.world.gameStarted && this.world.isPaused) {
                this.world.resumeGame();
            }
        });
    }
    

    /** Toggles between paused and resumed game states. */
    togglePause() {
        if (!this.world.gameStarted) return;
        if (this.world.isPaused) {
            this.world.resumeGame();
        } else {
            this.world.pauseGame();
        }
    }

    /** Redirects the player to the main menu (index.html) after a short delay. */
    goToMainMenu() {
        setTimeout(() => {
            window.location.href = "index.html";
        }, 100);
    }

     /** Handle player winning the game */
     playerWins() {
        if (!this.world.gameStarted) return; 
        this.world.gameStarted = false; 
        this.world.winPopup.show(); 
    }

    /** Initializes and handles fullscreen toggle functionality for the game. */
    setupFullscreenControls() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (!fullscreenBtn) return;
        fullscreenBtn.addEventListener('click', () => {
            const fullscreenElement = document.documentElement;  // FINAL SAFE VERSION
            fullscreenElement.requestFullscreen()
                .then(() => {
                    this.isFullscreen = true;
                    this.adjustForFullscreen();
                })
                .catch(err => {
                    console.error("Fullscreen error:", err);
                });
        });
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.adjustForFullscreen();
        });
    }
    
    /** Adjusts UI behavior based on whether the game is in fullscreen mode. */
    adjustForFullscreen() {
        if (this.isFullscreen) {
        } else {
        }
    }

    /** Hides the main menu buttons (start and info) from the UI. */
    hideMenuButtons() {
        const startBtn = document.getElementById('start-btn');
        const infoBtn = document.getElementById('info-btn');
        console.log(startBtn, infoBtn); 
        if (startBtn) startBtn.style.display = 'none';
        if (infoBtn) infoBtn.style.display = 'none';
    }

    /** Displays the game over popup and resets the game when "Restart" is clicked. */
    showGameOverPopup() {
        if (this.world._gameOverPopupActive) return;
        this.world._gameOverPopupActive = true;
        this.world._gameOverShown = true;
        const popup = document.getElementById("gameOverPopup");
        popup.style.display = "block";
        this.world.musicManager.pauseBackgroundMusic();
        const restartBtn = document.getElementById("restartButton");
        restartBtn.replaceWith(restartBtn.cloneNode(true));
        const newRestartBtn = document.getElementById("restartButton");
        newRestartBtn.onclick = () => {
            popup.style.display = "none";
            this._gameOverPopupActive = false;
            this.world.resetGameState();
            this.world.initializeCharacter();     
            this.world.initializeLevel();         
            this.world.initializeStatusBars();
            this.world.startGameLoop();          
        };
    }
}
