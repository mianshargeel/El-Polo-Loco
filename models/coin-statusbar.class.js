/**
 * Represents the status bar for coins in the game.
 * Displays the current number of collected coins as a percentage.
 * Extends `DrawableObject` to render the status bar on the canvas.
 */
class CoinStatusbar extends DrawableObject {
    /**
     * Array of image paths representing different coin collection levels.
     * Each image corresponds to a specific percentage of coins collected.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    /**
     * The current percentage of coins collected.
     * Each collected coin increases the percentage by 20%, up to a maximum of 100%.
     * @type {number}
     * @default 0
     */
    percentage = 0;

    /**
     * Creates a new coin status bar instance.
     * Initializes the images, sets position, and starts with 0% collected coins.
     */
    constructor() {
        super();
        this.preloadImages(this.IMAGES);
        this.x = 30; // X position on the screen
        this.y = 30; // Y position on the screen
        this.height = 45; // Height of the status bar
        this.width = 200; // Width of the status bar
        this.setPercentage(0); // Start with 0% collected
    }

    /**
     * Increases the coin percentage by 20% for each collected coin.
     * The percentage is capped at 100%.
     */
    increase() {
        if (this.percentage < 100) {
            this.percentage += 20;
            this.setPercentage(this.percentage);
        }
    }

    /**
     * Updates the coin status bar based on the current percentage.
     * @param {number} percentage - The new percentage of coins collected (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the correct image index based on the percentage of coins collected.
     * @returns {number} - The index of the image to be displayed.
     */
    resolveImageIndex() {
        return Math.min(Math.floor(this.percentage / 20), 5);
    }
}
