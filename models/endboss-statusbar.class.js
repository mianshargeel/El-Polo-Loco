class EndbossStatusBar extends DrawableObject{
  /**
   * Creates a status bar for displaying health with three states.
   * @param {number} maxHealth - Maximum health value
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width of the bar
   * @param {number} height - Height of the bar
   * @param {string[]} imagePaths - Array of three image paths [high, medium, low]
   * 
   */
  static IMAGE_PATHS = [
    'img/endBossStatusbar/endBossStatusBar0.png',
    'img/endBossStatusbar/endBossStatusBar20.png',
    'img/endBossStatusbar/endBossStatusBar40.png',
    'img/endBossStatusbar/endBossStatusBar60.png',
    'img/endBossStatusbar/endBossStatusBar80.png',
    'img/endBossStatusbar/endBossStatusBar100.png'
    ];
    
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
    const percentage = currentHealth / this.maxHealth;
    let index = 0;

    if (percentage > 0.8) index = 5;       
    else if (percentage > 0.6) index = 4; 
    else if (percentage > 0.4) index = 3;  
    else if (percentage > 0.2) index = 2; 
    else if (percentage > 0)   index = 1; 
    else                       index = 0;  

    this.img = this.images[index];
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