/**
 * Represents a Chicken enemy in the game.
 * Chickens move from right to left and have basic animation logic.
 * Extends `MoveableObject`.
 */
class Chicken extends MoveableObject {  
    /**
     * The y-coordinate where the chicken is positioned.
     * @type {number}
     * @default 360
     */
    y = 330;

    /**
     * The height of the chicken.
     * @type {number}
     * @default 80
     */
    height = 80;

    /**
     * The width of the chicken.
     * @type {number}
     * @default 80
     */
    width = 80;

    /**
     * Array of image paths for walking animations.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]; // Array holding all walking chicken images.

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    isDead = false;

    /**
     * Health points of the chicken.
     * @type {number}
     * @default 1
     */
    health = 1; // Small enemies (chicken) have 1 health point.

    /**
     * Creates a new chicken instance with randomized position and speed.
     */
    constructor(startX = 720 + Math.random() * 200) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png'); 
        this.preloadImages(this.IMAGES_WALKING);
        this.preloadImages(this.IMAGES_DEAD);

        const groundY = 430; // Ground line!
        this.y = groundY - this.height;
        
        this.x = startX;
        this.speed = 0.15 + Math.random() * 1.5; 

        this.animate();
    } 

    /**
     * Animates the chicken's movement and walking animation.
     */
    animate() {
        this.walkingInterval = setInterval(() => {
            if (this.world?.gameStarted && !this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60); // 60 FPS
    
        this.animationInterval = setInterval(() => {
            if (this.world?.gameStarted && !this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200); // Change sprite every 200ms
    }
    

    /**
     * Updates the chicken's movement logic.
     */
    update() {
        this.moveLeft();
    }
   // In Chicken class
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        
        // Show dead sprite
        this.img = this.imageCache[this.IMAGES_DEAD[0]];

        // Clear intervals
        clearInterval(this.walkingInterval);
        clearInterval(this.animationInterval);

        // Remove after 300ms
        setTimeout(() => {
            const index = this.level?.enemies?.indexOf(this);
            if (index > -1) {
                this.level.enemies.splice(index, 1);
            }
        }, 300);
    }

    
}
