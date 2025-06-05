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

        const groundY = 430; // Ground line!
        this.y = groundY - this.height;
        
        this.x = 700 + Math.random() * 500; 
        this.speed = 0.15 + Math.random() * 0.5; 

        this.animate();
    } 

    /**
     * Animates the chicken's movement and walking animation.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); // 60FPS movement update.
        
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200); // Change sprite every 200ms.
    }

    /**
     * Updates the chicken's movement logic.
     */
    update() {
        this.moveLeft();
    }
}
