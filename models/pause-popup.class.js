/**
 * Handles the pause popup in the game.
 * Allows the player to resume or exit the game from the pause menu.
 */
class PausePopup {
  
    constructor(world) {
        this.world = world;
        this.popup = document.getElementById("pausePopup");
        this.continueBtn = document.getElementById("continueGame");
        this.exitBtn = document.getElementById("exitToHome");

        if (!this.popup || !this.continueBtn || !this.exitBtn) {
            console.error("Missing pause popup elements!");
            return;
        }

        this.continueBtn.addEventListener("click", () => {
            this.world.resumeGame();
        });

        this.exitBtn.addEventListener("click", () => {
            this.world.goToMainMenu();
        });
    }

    show() {
        this.popup.style.display = "flex";
    }

    hide() {
        this.popup.style.display = "none";
    }
}
