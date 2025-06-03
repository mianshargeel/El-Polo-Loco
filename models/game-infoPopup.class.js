/**
 * Represents an informational popup that displays game instructions.
 * Provides methods to show, hide, and handle user interactions with the popup.
 */
class GameInfoPopup {
    /**
     * Creates a new game info popup instance.
     * @param {HTMLCanvasElement} canvas - The canvas element where the popup is drawn.
     * @param {object} uiManager - The UI manager responsible for handling the game UI.
     */
    constructor(canvas, uiManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isVisible = false;
        this.popupX = 100;
        this.popupY = 50;
        this.popupWidth = 500;
        this.popupHeight = 300;
        this.closeButton = { x: 550, y: 60, width: 30, height: 30 };
        this.uiManager = uiManager; // UI manager instance
    }

    /**
     * Displays the game info popup on the canvas.
     */
    show() {
        this.isVisible = true;
        this.draw();
    }

    /**
     * Hides the game info popup and clears it from the canvas.
     */
    hide() {
        this.isVisible = false;
        this.clearPopup();
        this.uiManager.showStartScreen(); // Returns to the start screen
    }

    /**
     * Draws the popup with game instructions, including a close button.
     */
    draw() {
        if (!this.isVisible) return;
        this.drawBackground();
        this.drawPopupBox();
        this.drawCloseButton();
        this.drawInstructions();
    }

    /**
     * Draws the semi-transparent background covering the entire canvas.
     */
    drawBackground() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the main popup box.
     */
    drawPopupBox() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.popupX, this.popupY, this.popupWidth, this.popupHeight);
    }

    /**
     * Draws the close button (red box with "X").
     */
    drawCloseButton() {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.closeButton.x, this.closeButton.y, this.closeButton.width, this.closeButton.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "24px 'zabras'";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("X", this.closeButton.x + this.closeButton.width / 2, this.closeButton.y + this.closeButton.height / 2);
    }

    /**
     * Draws the game instructions inside the popup.
     */
    /**
     * Draws the game instructions inside the popup.
     */
    drawInstructions() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "24px 'zabras'";
        this.ctx.textAlign = "center"; // Center text horizontally
        let textX = this.popupX + this.popupWidth / 2;
        let textY = this.popupY + 70;
        let lineSpacing = 40;

        this.ctx.fillText("How to Play:", textX, textY);
        this.ctx.fillText("- Use arrow keys to move.", textX, textY + lineSpacing);
        this.ctx.fillText("- Press 'D' to throw bottles.", textX, textY + 2 * lineSpacing);
        this.ctx.fillText("- Collect coins for points!", textX, textY + 3 * lineSpacing);
        this.ctx.fillText("- Press Space to Jump", textX, textY + 4 * lineSpacing);
    }

    /**
     * Clears the popup from the canvas.
     */
    clearPopup() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Checks if a given coordinate (x, y) is inside the popup.
     * @param {number} x - The x-coordinate of the click.
     * @param {number} y - The y-coordinate of the click.
     * @returns {boolean} - `true` if the click is inside the popup, otherwise `false`.
     */
    isClickInside(x, y) {
        return (
            x >= this.popupX &&
            x <= this.popupX + this.popupWidth &&
            y >= this.popupY &&
            y <= this.popupY + this.popupHeight
        );
    }

    /**
     * Checks if the close button was clicked.
     * @param {number} x - The x-coordinate of the click.
     * @param {number} y - The y-coordinate of the click.
     * @returns {boolean} - `true` if the close button was clicked, otherwise `false`.
     */
    isCloseButtonClicked(x, y) {
        return (
            x >= this.closeButton.x &&
            x <= this.closeButton.x + this.closeButton.width &&
            y >= this.closeButton.y &&
            y <= this.closeButton.y + this.closeButton.height
        );
    }

    /**
     * Handles mouse click events to close the popup if clicked outside or on the close button.
     * @param {MouseEvent} event - The mouse event triggered by a click.
     */
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isVisible && (mouseX < 200 || mouseX > 600 || mouseY < 100 || mouseY > 350)) {
            this.hide();
        }
        if (this.isVisible && this.isCloseButtonClicked(mouseX, mouseY)) {
            this.hide();
        }
    }
}
