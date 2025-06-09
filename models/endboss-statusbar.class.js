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
      this.x = 570;
      this.y = y;
      this.width = width;
      this.height = height;
      this.imagePaths = imagePaths;
      this.images = [];
      this.isVisible = false;
      
       // Preload all status bar images
       this.preloadImages();
      
      this.img = this.images[0]; // Start with full health (blue)
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
    // Ensure health doesn't go below 0
    this.currentHealth = Math.max(0, currentHealth);
    const percentage = this.currentHealth / this.maxHealth;
    
    // Smooth transition between health states
    if (percentage > 0.66) {
        this.img = this.images[0]; // Blue (high health)
    } else if (percentage > 0.33) {
        this.img = this.images[1]; // Green (medium health)
    } else if (percentage > 0) {
        this.img = this.images[2]; // Orange (low health)
    } else {
        this.img = null; // Empty when health is 0
    }
}


  /**
   * Draws the status bar on the canvas if visible.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (this.isVisible && this.img) {
      // Draw health bar with smooth decrease effect
      ctx.drawImage(this.img, this.x, this.y, this.width * (this.currentHealth / this.maxHealth), this.height);
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