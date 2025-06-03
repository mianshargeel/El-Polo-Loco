/**
 * Represents a moving cloud in the game.
 * Clouds are background elements that move from right to left to create a parallax effect.
 * Extends `MoveableObject`.
 */
class Cloud extends MoveableObject {
    /**
     * The vertical position of the cloud.
     * @type {number}
     * @default 50
     */
    y = 50;

    /**
     * The width of the cloud.
     * @type {number}
     * @default 500
     */
    width = 500;

    /**
     * The height of the cloud.
     * @type {number}
     * @default 250
     */
    height = 250;

    /**
     * Creates a new cloud instance with a random horizontal position.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; // Random starting position on the x-axis
        this.animate();
    }

    /**
     * Animates the cloud by moving it left continuously.
     * Creates a looping effect to simulate a moving background.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 50); // Moves left every 50 milliseconds
    }
}
