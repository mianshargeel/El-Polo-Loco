/**
 * Represents a moveable object in the game.
 * Extends `DrawableObject` and includes movement, collision detection, and physics properties.
 */
class MoveableObject extends DrawableObject { // Parent class
    speed = 0.15; 
    otherDirection = false; 
    speedY = 0; 
    acceleration = 2.5;
    energy = 100; 
    lastHit = 0;

    /**
     * Creates a new moveable object.
     * @param {object} musicManager - The instance responsible for handling sound effects.
     */
    constructor(musicManager) {
        super();
        this.musicManager = musicManager;
    }

    /**
     * Applies gravity to the object, making it fall if it's above ground.
     * Runs at 60 FPS using `setInterval()`.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) { 
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} - `true` if the object is in the air, `false` if on the ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 180; // Vertical threshold for ground detection
    }

    /**
     * Animates an object by cycling through an array of image paths.
     * @param {string[]} images - Array of image file paths to be used in animation.
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by increasing its `x` position.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by decreasing its `x` position.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting its vertical speed.
     */
    jump() {
        this.speedY = 30; // Jump height (30px)
    }

    /**
     * Checks if this object is colliding with another moveable object.
     * Ensures that the two objects are overlapping.
     * @param {MoveableObject} mo - The other moveable object (e.g., enemy).
     * @returns {boolean} - `true` if collision occurs, `false` otherwise.
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
    }

    /**
     * Checks if this object is colliding from the top with another object.
     * Used for mechanics such as jumping on enemies.
     * @param {MoveableObject} mo - The other moveable object.
     * @returns {boolean} - `true` if collision is from above, `false` otherwise.
     */
    isCollidingFromTop(mo) {
        const threshold = 50; // Buffer to make collision smoother
        return this.isColliding(mo) && 
               this.y + this.height >= mo.y && 
               this.y + this.height <= mo.y + threshold;
    }

    /**
     * Reduces the object's energy when hit and prevents multiple hits in a short time.
     */
    hit() {
        if (this.isHurt()) return;  
        this.lastHit = new Date().getTime();
        this.energy -= 10; // Reduce energy by 10 on each hit
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Checks if the object is hurt, ensuring temporary invincibility after a hit.
     * @returns {boolean} - `true` if recently hit, `false` otherwise.
     */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 1; // Hurt state lasts for 1 second
    }

    /**
     * Checks if the object is dead (energy reaches zero).
     * Triggers sound effects and game-over logic.
     */
    isDead() {
        if (this.energy <= 0) {
            this.musicManager.playCharacterDeadSound();
            setTimeout(() => {
                this.musicManager.stopCharacterDeadSound();
            }, 2000);
            this.showGameOverPopup();
        }
    }

    /**
     * Displays the game-over popup and stops background music.
     */
    showGameOverPopup() {
        let popup = document.getElementById("gameOverPopup");
        popup.style.display = "block";
        this.musicManager.pauseBackgroundMusic();
        document.getElementById("restartButton").addEventListener("click", () => {
            location.reload(); // Reloads the page to restart the game
        });
    }

    /**
     * Changes the object's image to a breaking effect.
     */
    break() {
        this.loadImage('img/6_salsa_bottle/all_sequences.gif');
    }
}
