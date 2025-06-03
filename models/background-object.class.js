/**
 * Represents a background object in the game.
 * Background objects are stationary or scrolling images that create the environment.
 * Extends `MoveableObject` to allow potential movement (e.g., parallax effects).
 */
class BackgroundObject extends MoveableObject {
    /**
     * Width of the background object.
     * @type {number}
     * @default 720
     */
    width = 720;

    /**
     * Height of the background object.
     * @type {number}
     * @default 480
     */
    height = 480;

    /**
     * Creates a new background object with an image and position.
     * @param {string} imagePath - The file path of the background image.
     * @param {number} x - The x-coordinate position of the background object.
     * @param {number} y - The y-coordinate position of the background object.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height; // Adjusts to be positioned at the bottom of the canvas.
    }
}
