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
        this.applyGravity();
    
        this._moveInterval = null;
        this._animationInterval = null;
        this._deathTimeout = null;
        this._deadHandled = false;
        this.isDeadAnimationPlayed = false;
    
        // console.log('[Character] Constructor called');
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
        // console.log('[Animation] Animation loop started');
        this._animationInterval = setInterval(() => {
            if (!this.world) return;
    
            this.handleDeath(); // check and set death state
    
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                this.processWalkingAnimation();
            }
        }, 100);
    }
    

    cleanup() {
        // console.warn('[Cleanup] Character cleanup called');
    
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
        // console.log('[Animation] Animation loop started');
        this.handleMovement();
        this.handleAnimation();
    }
    


    /**
     * Moves the character left or right based on keyboard input.
     */
    processMovement() {
        if (this.isDead()) return;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
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

   
    /**
     * Handles walking animation when character moves.
     */
    processWalkingAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        }
    }

    handleDeath() {
        if (this._deathHandled || this.energy > 0) {
            // console.warn('[Death] Blocked — deathHandled:', this._deathHandled, '| energy:', this.energy);
            return;
        }
    
        this._deathHandled = true;
        this.musicManager.playCharacterDeadSound();
    
        if (this._deathTimeout) clearTimeout(this._deathTimeout);
    
        this._deathTimeout = setTimeout(() => {
            if (this.world && !this.world._gameOverPopupActive && this.energy <= 0) {
                this.world.showGameOverPopup();
            }
        }, 1000);
       
        
    }
    
    isDead() {
        return this.energy <= 0;
    }
    
    
    
}
