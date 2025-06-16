/**
 * Manages all game sounds, including background music and sound effects.
 * Allows playing, pausing, and muting sounds dynamically.
 */
class MusicManager {
    /**
     * Initializes the music manager and loads all sound files.
     */
    constructor() {

        // Restore mute setting from localStorage
        const savedMute = localStorage.getItem('musicMuted');
        this.isMuted = savedMute === 'false';
       
        /**
         * Background music for the game.
         * Loops continuously unless paused.
         * @type {HTMLAudioElement}
         */
        this.backgroundMusic = new Audio('audio/bg-sound.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.08;

        /**
         * Sound effect played when an enemy (e.g., chicken) is killed.
         * @type {HTMLAudioElement}
         */
        this.killedSound = new Audio('audio/chicken-killed.wav');
        this.killedSound.volume = 0.1;

        /**
         * Sound effect played when the player collects a coin.
         * @type {HTMLAudioElement}
         */
        this.coinSound = new Audio('audio/coin-collect.wav');
        this.coinSound.volume = 0.01;

        /**
         * Sound effect played when the player jumps.
         * @type {HTMLAudioElement}
         */
        this.jumpSound = new Audio('audio/jump-pepe.wav');
        this.jumpSound.volume = 0.01;
        

        /**
         * Sound effect played when the player dies.
         * Uses a timestamp to prevent browser caching issues.
         * @type {HTMLAudioElement}
         */
        this.deadSound = new Audio('audio/pepe-dead.wav?v=' + new Date().getTime());
        this.deadSound.volume = 0.1;


        /**
         * Sound effect played when the end boss is defeated.
         * @type {HTMLAudioElement}
         */
        this.endBossDeadSound = new Audio('audio/endBoss-dead.wav');
        this.endBossDeadSound.volume = 0.01;


        /**
         * Sound effect played when the end boss takes damage.
         * @type {HTMLAudioElement}
         */
        this.endBossHurtSound = new Audio('audio/endBoss-hurt.wav');
        this.endBossHurtSound.volume = 0.01;


        /**
         * Sound effect played when the player throws a bottle.
         * @type {HTMLAudioElement}
         */
        this.bottleThrow = new Audio('audio/bottle-throw.wav');
        this.bottleThrow.volume = 0.01;

        this.collectBotle = new Audio('audio/collect-botle.wav');
        this.collectBotle.volume = 0.01;
    }

    /**
     * Plays the background music if sound is not muted.
     */
    playBackGroundMusic() {
        if (!this.isMuted) {
            this.backgroundMusic.play();
        }
    }

    /**
     * Pauses the background music.
     */
    pauseBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    /**
     * Plays the sound effect when an enemy is killed, if sound is not muted.
     */
    enemyKilledSound() {
        if (!this.isMuted) {
            this.killedSound.play();
        }
    }

    /**
     * Plays the sound effect when the player jumps, if sound is not muted.
     */
    playCharacterJumpSound() {
        if (world && world.isPaused) return; // stopping jump sound at paused-game
        if (!this.isMuted) {
            this.jumpSound.play();
        }
    }

    /**
     * Plays the sound effect when the player dies, if sound is not muted.
     */
    playCharacterDeadSound() {
        if (!this.isMuted) {
            this.deadSound.play();
        }
    }

    /**
     * Stops the death sound and resets it to the beginning.
     */
    stopCharacterDeadSound() {
        this.deadSound.pause();
        this.deadSound.currentTime = 0;
    }

    /**
     * Plays the sound effect when the player collects a coin, if sound is not muted.
     */
    collectedCoinsSound() {
        if (!this.isMuted) {
            this.coinSound.play();
        }
    }

    /**
     * Plays the sound effect when the end boss dies, if sound is not muted.
     */
    playEndBossDeadSound() {
        if (!this.isMuted) {
            this.endBossDeadSound.play();
        }
    }

    /**
     * Plays the sound effect when the end boss takes damage, if sound is not muted.
     */
    playEndBossHurtSound() {
        if (!this.isMuted) {
            this.endBossHurtSound.play();
        }
    }

    /**
     * Plays the sound effect when the player throws a bottle, if sound is not muted.
     */
    playBottleThrowSound() {
        if (!this.isMuted) {
            this.bottleThrow.play();
        }
    }

    playCollectBotleSound() {
        if (!this.isMuted) {
            this.collectBotle.play();
        }
    }

    /**
     * Toggles the mute state for all sounds.
     * If muted, pauses background music; otherwise, resumes playing it.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('musicMuted', JSON.stringify(this.isMuted)); 
    
        const muteBtn = document.getElementById('mute-btn');
        if (this.isMuted) {
            this.pauseBackgroundMusic();
            if (muteBtn) muteBtn.textContent = '🔇';
            // console.log('sound muted');
        } else {
            this.playBackGroundMusic();
            if (muteBtn) muteBtn.textContent = '🔊';
            // console.log('sound unmuted');
        }
    }
    
}
