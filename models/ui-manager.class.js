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
        
        // Make HTML title visible if you toggle it
        // document.querySelector('.game-title').style.display = 'block';
    }
   
}
