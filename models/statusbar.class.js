/**
 * Represents the status bar for the player's health.
 * Displays the current health level as a percentage.
 * Extends `DrawableObject` to be rendered on the canvas.
 */
class Statusbar extends DrawableObject {
    /**
     * Array of image paths representing different health levels.
     * Each image corresponds to a specific percentage of health remaining.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    /**
     * The current percentage of health.
     * Defaults to 100% (full health).
     * @type {number}
     * @default 100
     */
    percentage = 100;

    /**
     * Creates a new status bar instance.
     * Initializes the images, position, and default health percentage.
     */
    constructor() {
        super();
        this.preloadImages(this.IMAGES);
        this.x = 30; // X position on the screen
        this.y = 0; // Y position on the screen
        this.height = 45; // Height of the status bar
        this.width = 200; // Width of the status bar
        this.setPercentage(100); // Start with full health
    }

    /**
     * Updates the health percentage and changes the displayed status bar image.
     * @param {number} percentage - The new health percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = new Image();
        this.img.src = path; // Force image update
    }

    /**
     * Determines the correct image index based on the percentage of health remaining.
     * @returns {number} - The index of the image to be displayed.
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
