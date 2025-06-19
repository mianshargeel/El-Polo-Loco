/**
 * Handles the game sound settings, including a toggle button for enabling/disabling sound.
 */
class GameSounds {
    /**
     * Creates a new GameSounds instance.
     * @param {object} musicManager - The music manager that controls game sounds.
     */
    constructor(musicManager) {
        this.musicManager = musicManager;
        this.isSoundOn = true;
       this.soundButton = document.getElementById('mute-btn'); // Uses existing button
        this.soundButton.addEventListener("click", () => this.toggleGameSounds());
    }
    initSoundButton() {
        if (!this.soundButton) {
            console.error("Mute button not found in HTML!");
            return;
        }
        this.soundButton.innerHTML = this.isSoundOn ? "🔊" : "🔇";
        this.soundButton.addEventListener("click", () => this.toggleGameSounds());
    }

    toggleGameSounds() {
        this.musicManager.toggleMute();
        this.isSoundOn = !this.isSoundOn;
        this.soundButton.innerHTML = this.isSoundOn ? "🔊" : "🔇";
    }
}
