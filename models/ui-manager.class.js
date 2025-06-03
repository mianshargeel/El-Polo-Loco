/**
 * Manages the game's UI, including buttons, popups, and event listeners.
 * Handles the start screen, game info popup, and pause menu.
 */
class UIManager {
    /**
     * Creates a new UI Manager instance.
     * @param {HTMLCanvasElement} canvas - The canvas element where the UI is drawn.
     * @param {object} world - The game world instance to manage game interactions.
     */
    constructor(canvas, world) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.world = world;
        this.gameInfoPopup = new GameInfoPopup(this.canvas, this);
        this.pausePopup = new PausePopup(this.world);
        this.isPaused = false;
    }

    /**
     * Renders the start screen with buttons.
     */
    showStartScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasHeadingText(); // Only render title
    }

    /**
     * Renders the game title on the canvas.
     */
    canvasHeadingText() {
        this.ctx.fillStyle = "rgba(245, 240, 240, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "56px 'zabras'";
        this.ctx.fillStyle = "black";
        this.ctx.shadowColor = "black";
        this.ctx.shadowBlur = 15;
        this.ctx.textAlign = "center";
        this.ctx.fillText("El Pollo Loco", this.canvas.width / 2, 120);
        this.ctx.shadowBlur = 10;
    }

   
}
