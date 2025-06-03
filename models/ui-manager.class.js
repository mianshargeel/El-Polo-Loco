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

        /**
         * Start game button properties.
         * @type {object}
         */
        this.startButton = { x: 280, y: 200, width: 160, height: 60 };

        /**
         * Game info button properties.
         * @type {object}
         */
        this.infoButton = { x: 280, y: 280, width: 160, height: 50 };

        /**
         * Game info popup instance.
         * @type {GameInfoPopup}
         */
        this.gameInfoPopup = new GameInfoPopup(this.canvas, this);

        /**
         * Pause popup instance.
         * @type {PausePopup}
         */
        this.pausePopup = new PausePopup(this.world);

        /**
         * Tracks whether the game is paused.
         * @type {boolean}
         * @default false
         */
        this.isPaused = false;

        this.addEventListeners();
    }

    /**
     * Renders the start screen with buttons.
     */
    showStartScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasHeadingText();
        this.creatingStartGameButton();
        this.creatingGameInfoButton();
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

    /**
     * Creates the Start Game button and renders it on the canvas.
     */
    creatingStartGameButton() {
        this.startButton.x = (this.canvas.width - this.startButton.width) / 2;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.strokeStyle = "darkred";
        this.ctx.lineWidth = 4;
        this.ctx.fillRect(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);
        this.ctx.strokeRect(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "28px 'zabras'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Start Game", this.startButton.x + this.startButton.width / 2, this.startButton.y + 40);
    }

    /**
     * Creates the Game Info button and renders it on the canvas.
     */
    creatingGameInfoButton() {
        this.infoButton.x = (this.canvas.width - this.infoButton.width) / 2;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.strokeStyle = "darkred";
        this.ctx.lineWidth = 4;
        this.ctx.fillRect(this.infoButton.x, this.infoButton.y, this.infoButton.width, this.infoButton.height);
        this.ctx.strokeRect(this.infoButton.x, this.infoButton.y, this.infoButton.width, this.infoButton.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "28px 'zabras'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Game Info", this.infoButton.x + this.infoButton.width / 2, this.infoButton.y + 32);
    }

    /**
     * Handles mouse movement to provide hover effects for buttons.
     * @param {MouseEvent} event - The mouse event object.
     */
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const isHoveringStart = mouseX >= this.startButton.x &&
            mouseX <= this.startButton.x + this.startButton.width &&
            mouseY >= this.startButton.y &&
            mouseY <= this.startButton.y + this.startButton.height;

        const isHoveringInfo = mouseX >= this.infoButton.x &&
            mouseX <= this.infoButton.x + this.infoButton.width &&
            mouseY >= this.infoButton.y &&
            mouseY <= this.infoButton.y + this.infoButton.height;

        this.canvas.style.cursor = isHoveringStart || isHoveringInfo ? "pointer" : "default";
    }

    /**
     * Handles click events on buttons.
     * @param {MouseEvent} event - The mouse event object.
     */
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (!this.gameInfoPopup.isVisible &&
            mouseX >= this.startButton.x &&
            mouseX <= this.startButton.x + this.startButton.width &&
            mouseY >= this.startButton.y &&
            mouseY <= this.startButton.y + this.startButton.height
        ) {
            this.world.startGame();
        }

        if (!this.gameInfoPopup.isVisible &&
            mouseX >= this.infoButton.x &&
            mouseX <= this.infoButton.x + this.infoButton.width &&
            mouseY >= this.infoButton.y &&
            mouseY <= this.infoButton.y + this.infoButton.height
        ) {
            this.showGameInfo();
        }

        if (this.gameInfoPopup.isVisible) {
            if (this.gameInfoPopup.isCloseButtonClicked(mouseX, mouseY) ||
                !this.gameInfoPopup.isClickInside(mouseX, mouseY)) {
                this.gameInfoPopup.hide();
            }
        }
    }

    /**
     * Displays the game info popup.
     */
    showGameInfo() {
        this.gameInfoPopup.show();
    }

    /**
     * Creates a floating pause button and adds it to the document.
     */
    // createPauseButton() {
    //     const button = document.createElement("button");
    //     button.innerHTML = "⏸️";
    //     button.style.position = "absolute";
    //     button.style.top = `${this.canvas.offsetTop + 65}px`;
    //     button.style.left = `${this.canvas.offsetLeft + this.canvas.width - 60}px`;
    //     button.style.width = "50px";
    //     button.style.height = "50px";
    //     button.style.border = "none";
    //     button.style.background = "rgba(255, 255, 255, 0.8)";
    //     button.style.borderRadius = "50%";
    //     button.style.cursor = "pointer";
    //     button.style.fontSize = "24px";
    //     button.style.zIndex = "1000";

    //     document.body.appendChild(button);
    //     button.addEventListener("click", () => this.pausePopup.show());
    // }

    /**
     * Adds event listeners for mouse movement and clicks.
     */
    addEventListeners() {
        this.canvas.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        this.canvas.addEventListener("click", (event) => this.handleClick(event));
    }
}
