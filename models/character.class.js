/**
 * Represents the main character in the game, extending `MoveableObject`.
 * Handles movement, jumping, animations, and interactions with the game world.
 */
class Character extends MoveableObject {
    height = 240; 
    y = World.GROUND_Y - this.height; 
    speed = 1.5; 
    world;

    /**
     * Image paths for walking animations.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Image paths for jumping animations.
     * @type {string[]}
     */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Image paths for death animation.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Image paths for hurt animation.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_SLEEP = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    lastMoveTime = Date.now();
    isSleeping = false;

    /**
     * Creates the character and initializes animations, images, and physics.
     * @param {object} musicManager - Instance to manage sound effects.
     */
    constructor(musicManager) {
        super();
        this.musicManager = musicManager;
        this.loadImage('img/2_character_pepe/2_walk/W-21.png'); 
        this.preloadImages(this.IMAGES_WALKING);
        this.preloadImages(this.IMAGES_JUMPING);
        this.preloadImages(this.IMAGES_DEAD);
        this.preloadImages(this.IMAGES_HURT);
        this.preloadImages(this.IMAGES_IDLE);
        this.preloadImages(this.IMAGES_SLEEP);
        this.applyGravity();
        this._moveInterval = null;
        this._animationInterval = null;
        this._deathTimeout = null;
        this._deadHandled = false;
        this.isDeadAnimationPlayed = false;
        this.animate(); 
    }
    
    handleMovement() {
        this._moveInterval = setInterval(() => {
            if (!this.world) return;
            this.processMovement();
            this.processJump();
            this.updateCamera();
        }, 1000 / 60);
    }
    
    handleAnimation() {
        this._animationInterval = setInterval(() => {
            if (!this.world) return;
            this.handleDeath();
            const now = Date.now();
            const idleDuration = now - this.lastMoveTime;
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (idleDuration > 4000) {
                this.playAnimation(this.IMAGES_SLEEP);
                this.isSleeping = true;
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
                this.isSleeping = false;
                this.lastMoveTime = now;
            } else {
                this.playAnimation(this.IMAGES_IDLE);
                this.isSleeping = false;
            }
        }, 100);
    }
    
    cleanup() {
        this._deadHandled = false;
        this.isDeadAnimationPlayed = false;
        if (this._deathTimeout) {
            clearTimeout(this._deathTimeout);
            this._deathTimeout = null;
        }
        if (this._moveInterval) {
            clearInterval(this._moveInterval);
            this._moveInterval = null;
        }
        if (this._animationInterval) {
            clearInterval(this._animationInterval);
            this._animationInterval = null;
        }
    }
    /**
     * Starts character animation, including movement and sprite updates.
     */
    animate() {
        if (this._moveInterval || this._animationInterval) return; 
        this.handleMovement();
        this.handleAnimation();
    }

    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }
    /**
     * Moves the character left or right based on keyboard input.
     */
    processMovement() {
        if (this.isDead()) return;
        const moved = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (moved) {
            this.lastMoveTime = Date.now();
            this.isSleeping = false;
        }
    }

    /**
     * Handles jump action when the SPACE key is pressed.
     */
    processJump() {
        if (this.isDead()) return;

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.playJumpSound();
            this.lastMoveTime = Date.now(); // reset idle timer on jump
        }
    }

    /**
     * Plays the jump sound effect.
     */
    playJumpSound() {
        if (this.musicManager) {
            this.musicManager.playCharacterJumpSound();
        }
    }

    /**
     * Updates the camera position to follow the character.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }    

    handleDeath() {
        if (this._deathHandled || this.energy > 0) {
            return;
        }
        this._deathHandled = true;
        this.musicManager.playCharacterDeadSound();
        if (this._deathTimeout) clearTimeout(this._deathTimeout);
    
        this._deathTimeout = setTimeout(() => {
            if (this.world && !this.world._gameOverPopupActive && this.energy <= 0) {
                this.world.uiManager.showGameOverPopup();
            }
        }, 1000);
    }
    
    isDead() {
        return this.energy <= 0;
    }
}
