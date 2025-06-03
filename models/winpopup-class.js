/**
 * Handles the win popup in the game.
 * Allows the player to restart the game or return to the main menu after winning.
 */
class WinPopup {
    /**
     * Creates a new WinPopup instance.
     * @param {object} world - The game world instance to manage game interactions.
     */
    constructor(world) {
        this.world = world;

        /**
         * Reference to the win popup element in the DOM.
         * @type {HTMLElement | null}
         */
        this.popup = document.getElementById("winPopup");

        /**
         * Reference to the "Restart Game" button in the win popup.
         * @type {HTMLButtonElement | null}
         */
        this.restartButton = document.getElementById("restartGame");

        /**
         * Reference to the "Main Menu" button in the win popup.
         * @type {HTMLButtonElement | null}
         */
        this.mainMenuButton = document.getElementById("goToMainMenu");

        // Ensure required elements exist in the DOM
        if (!this.popup) {
            console.error("❌ Error: #winPopup element not found in DOM!");
            return;
        }

        if (!this.restartButton || !this.mainMenuButton) {
            console.error("❌ Error: One or both buttons (Restart/Main Menu) are missing in DOM!");
            return;
        }

        // ✅ Add event listeners for buttons
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.mainMenuButton.addEventListener("click", () => this.goToMainMenu());
    }

    /**
     * Displays the win popup when the player wins the game.
     */
    show() {
        if (this.popup) {
            this.popup.style.display = "flex";
        }
    }

    /**
     * Hides the win popup.
     */
    hide() {
        if (this.popup) {
            this.popup.style.display = "none";
        }
    }

    /**
     * Restarts the game when the player clicks the restart button.
     * Calls `restartGame()` from the `World` class.
     */
    restartGame() {
        this.hide(); // Hide the popup

        if (this.world) {
            this.world.restartGame(); // Calls restart logic from World.js
        } else {
            console.error("❌ ERROR: this.world is not defined!");
        }
    }

    /**
     * Returns to the main menu when the player clicks the "Main Menu" button.
     * Calls `goToMainMenu()` from the `World` class.
     */
    goToMainMenu() {
        console.log("🏠 Returning to main menu via popup...");
        this.hide();

        if (this.world && typeof this.world.goToMainMenu === "function") {
            this.world.goToMainMenu();
        } else {
            console.error("❌ ERROR: this.world.goToMainMenu() is not defined!");
        }
    }
}
