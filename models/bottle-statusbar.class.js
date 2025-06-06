/**
 * Represents the status bar for bottles in the game.
 * Displays the current number of bottles used.
 * Extends `DrawableObject` to render the status bar on the canvas.
 */
class BottleStatusbar extends DrawableObject {
    /**
     * Array of image paths representing different bottle levels.
     * Each image corresponds to a specific percentage of bottles available.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    /**
     * The current percentage of bottles available.
     * The percentage determines which image is displayed in the status bar.
     * @type {number}
     * @default 0
     */
    percentage = 0;
    bottleCount = 0; 
    maxBottles = 10;
    /**
     * Creates a new bottle status bar instance.
     * Initializes the images, position, and default percentage (full).
     */
    constructor() {
        super();
        this.preloadImages(this.IMAGES);
        this.x = 30; // X position on the screen
        this.y = 60; // Y position on the screen
        this.height = 45; // Height of the status bar
        this.width = 200; // Width of the status bar
        this.setPercentage(100); // Default to full bottles
    }

    increase() {
        this.bottleCount = Math.min(this.bottleCount + 1, this.maxBottles);
        this.updatePercentage();
    }

    decrease() {
        this.bottleCount = Math.max(this.bottleCount - 1, 0);
        this.updatePercentage();
    }

    updatePercentage() {
        this.percentage = (this.bottleCount / this.maxBottles) * 100;
        this.setPercentage(this.percentage);
    }

    /**
     * Sets the percentage of bottles available and updates the displayed image.
     * @param {number} percentage - The new percentage of bottles (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the correct image index based on the percentage of bottles available.
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

    /**
     * Reduces the bottle count when a bottle is used.
     * Updates the status bar accordingly.
     */
    useBottle() {
        if (this.percentage > 0) {
            this.percentage -= 34; // MAX 3-BOTLES BY DEFAULT
            this.setPercentage(this.percentage);
        }
    }
}
