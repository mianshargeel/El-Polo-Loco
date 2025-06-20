class EndbossStatusBar extends DrawableObject{
  /**
   * Creates a status bar for displaying health with three states.
   * @param {number} maxHealth - Maximum health value
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width of the bar
   * @param {number} height - Height of the bar
   * @param {string[]} imagePaths - Array of three image paths [high, medium, low]
   */
  constructor(maxHealth, x, y, width, height, imagePaths) {
      super();
      this.maxHealth = maxHealth;
      this.currentHealth = maxHealth;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.imagePaths = imagePaths;
      this.images = [];
      this.isVisible = false;
      this.preloadImages();
      
      this.img = this.images[0]; 
  }
   /**
   * Preloads all status bar images for better performance
   */
   preloadImages() {
    this.imagePaths.forEach(path => {
        let img = new Image();
        img.src = path;
        this.images.push(img);
    });
  }
  
  /**
   * Updates the status bar based on current health.
   * @param {number} currentHealth - Current health value
   */
  update(currentHealth) {
    const target = Math.max(0, currentHealth); 
    if (target < this.currentHealth) {
        this.currentHealth -= 0.5; 
        if (this.currentHealth < target) {
            this.currentHealth = target;
        }
    } else { this.currentHealth = target;
    }
    const percentage = this.currentHealth / this.maxHealth;
    if (percentage > 0.66) { this.img = this.images[0];
    } else if (percentage > 0.33) { this.img = this.images[1]; 
    } else { this.img = this.images[2]; 
    }
 }
  /**
   * Draws the status bar on the canvas if visible.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (this.isVisible && this.img) {
        const percentage = this.currentHealth / this.maxHealth;
        const fillWidth = this.width * percentage;
        ctx.globalAlpha = 0.25;
        ctx.drawImage(this.images[0], this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
        if (fillWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, fillWidth, this.height);
        }
    }
}
  /**
   * Shows the status bar.
   */
  show() {
      this.isVisible = true;
  }

  /**
   * Hides the status bar.
   */
  hide() {
      this.isVisible = false;
  }
}