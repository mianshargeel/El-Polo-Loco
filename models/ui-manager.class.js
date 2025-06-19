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

    showStartScreen() {
        // Only clear canvas, don't draw title
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupGameControls() { //calling in game.js
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.world.startGame();
            document.getElementById('gameInfoPopup').style.display = 'none';
        });
        document.getElementById('pause-btn')?.addEventListener('click', () => {
            this.togglePause();
        });
        document.getElementById('continueGame')?.addEventListener('click', () => {
            this.world.resumeGame();
        });
        document.querySelectorAll('.go-to-main-menu').forEach(button => {
            button.addEventListener('click', () => {
                this.goToMainMenu(); 
            });
        });
        document.getElementById('info-btn')?.addEventListener('click', () => {
            const popup = document.getElementById('gameInfoPopup');
            popup.style.display = 'block';
    
            if (this.world.gameStarted) {
                this.world.pauseGame();
            }
        });
        document.querySelector('#gameInfoPopup .close-btn')?.addEventListener('click', () => {
            const popup = document.getElementById('gameInfoPopup');
            popup.style.display = 'none';
    
            if (this.world.gameStarted && this.world.isPaused) {
                this.world.resumeGame();
            }
        });
    }

    togglePause() {
        if (!this.world.gameStarted) return;
        if (this.world.isPaused) {
            this.world.resumeGame();
        } else {
            this.world.pauseGame();
        }
    }

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
    
    adjustForFullscreen() {
        if (this.isFullscreen) {
        } else {
        }
    }

    hideMenuButtons() {
        const startBtn = document.getElementById('start-btn');
        const infoBtn = document.getElementById('info-btn');
        console.log(startBtn, infoBtn); 
        if (startBtn) startBtn.style.display = 'none';
        if (infoBtn) infoBtn.style.display = 'none';
    }

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
