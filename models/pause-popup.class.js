/**
 * Handles the pause popup in the game.
 * Allows the player to resume or exit the game from the pause menu.
 */
class PausePopup {
    /**
     * Creates a new PausePopup instance.
     * @param {object} world - The game world instance to manage pause/resume actions.
     */
    constructor(world) {
        this.world = world;
        
        /**
         * Reference to the pause popup element in the DOM.
         * @type {HTMLElement | null}
         */
        this.popup = document.getElementById("pausePopup");

        /**
         * Reference to the "Continue" button in the pause popup.
         * @type {HTMLButtonElement | null}
         */
        this.continueButton = document.getElementById("continueGame");

        /**
         * Reference to the "Exit to Home" button in the pause popup.
         * @type {HTMLButtonElement | null}
         */
        this.exitButton = document.getElementById("exitToHome");

        // Ensure required elements exist in the DOM
        if (!this.popup || !this.continueButton || !this.exitButton) {
            console.error("❌ Error: Pause popup elements are missing in DOM!");
            return;
        }

        // Add event listeners for buttons
        this.continueButton.addEventListener("click", () => this.resumeGame());
        this.exitButton.addEventListener("click", () => this.exitToHome());
    }

    /**
     * Displays the pause popup and pauses the game.
     */
    show() {
        if (this.popup) {
            this.popup.style.display = "flex";
            this.world.pauseGame(); // Pause the game
        }
    }

    /**
     * Hides the pause popup without resuming the game.
     */
    hide() {
        if (this.popup) {
            this.popup.style.display = "none";
        }
    }

    /**
     * Resumes the game and hides the pause popup.
     */
    resumeGame() {
        this.hide();
        this.world.resumeGame(); // Resume the game
    }

    /**
     * Exits the game and returns to the main menu.
     * Calls the world's main menu function and removes the reference to avoid memory leaks.
     */
    exitToHome() {
        console.log("🏠 Exiting to Home...");
        this.hide();

        if (this.world) {
            this.world.goToMainMenu(); // Call the method to return to the main menu
            this.world = null; // Remove reference to free up memory
        }
    }
}
