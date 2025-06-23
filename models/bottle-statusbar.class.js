class BottleStatusbar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/10.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/30.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/50.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/70.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/90.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    percentage = 0;
    bottleCount = 0;
    maxBottles = 10;

    constructor() {
        super();
        this.preloadImages(this.IMAGES);
        this.x = 30;
        this.y = 60;
        this.height = 45;
        this.width = 200;
        this.setPercentage(0); // Start empty
    }

    /** Increases the bottle count and updates the percentage display. */
    increase() {
        if (this.bottleCount >= this.maxBottles) return;
        
        this.bottleCount++;
        this.percentage = (this.bottleCount / this.maxBottles) * 100;
        this.setPercentage(this.percentage); // Using existing method
    }

    /** Decreases the bottle count and updates the percentage display. */
    decrease() {
        if (this.bottleCount <= 0) return;
        
        this.bottleCount--;
        this.percentage = (this.bottleCount / this.maxBottles) * 100;
        this.setPercentage(this.percentage); // Using existing method
    }

    /** Sets the percentage of bottles and updates the corresponding image. */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    /** Resolves the image index based on the current percentage. */
    resolveImageIndex() {
        const step = 100 / (this.IMAGES.length - 1);
        return Math.min(Math.floor(this.percentage / step), this.IMAGES.length - 1);
    }

    /** Uses one bottle if available and updates the UI accordingly. */
    useBottle() {
        if (this.bottleCount > 0) {
            this.bottleCount--;
            this.percentage = (this.bottleCount / this.maxBottles) * 100;
            this.setPercentage(this.percentage);
        }
    }
}