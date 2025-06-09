class EndbossStatusBar {
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
      this.maxHealth = maxHealth;
      this.currentHealth = maxHealth;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.imagePaths = imagePaths;
      this.images = [];
      this.isVisible = false;
      
      // Load all status bar images
      this.imagePaths.forEach(path => {
          let img = new Image();
          img.src = path;
          this.images.push(img);
      });
      
      this.img = this.images[0]; // Start with full health (blue)
  }
  
  /**
   * Updates the status bar based on current health.
   * @param {number} currentHealth - Current health value
   */
  update(currentHealth) {
      this.currentHealth = currentHealth;
      const percentage = this.currentHealth / this.maxHealth;
      
      // Determine which image to use based on health percentage
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
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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