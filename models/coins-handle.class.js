/**
 * Represents a collectible coin in the game.
 * Coins are scattered throughout the level and can be collected by the player.
 * Extends `DrawableObject` to be rendered on the canvas.
 */
class CoinsHandle extends DrawableObject {
    /**
     * Array of image paths representing different coin animation frames.
     * @type {string[]}
     */
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new coin instance at a specific position.
     * @param {number} x - The x-coordinate where the coin is placed.
     * @param {number} y - The y-coordinate where the coin is placed.
     */
    constructor(x, y) {
        super();
        this.preloadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 100; // Coin size
        this.height = 100; 
        this.setImage(this.IMAGES[0]); // Set the initial coin image
    }

    /**
     * Sets the image of the coin.
     * @param {string} path - The file path of the coin image to be displayed.
     */
    setImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
}
