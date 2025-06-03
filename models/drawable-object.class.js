/**
 * Represents a drawable object in the game.
 * Provides methods for loading images, preloading images, and rendering them on the canvas.
 */
class DrawableObject {
  x = 120;
  y = 280;
  height = 150;
  width = 100;
  img;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads a single image and assigns it to the object.
   * @param {string} path - The file path of the image to be loaded.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads multiple images and stores them in the image cache.
   * This helps in optimizing performance by ensuring images are available when needed.
   * @param {string[]} arrImg - Array of image file paths to be preloaded.
   */
  preloadImages(arrImg) {
    arrImg.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object's image on the provided canvas context.
   * Prevents rendering if the image is not fully loaded.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawImg(ctx) {
    if (!this.img || !this.img.complete) return;

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a bounding box around characters (only applied to `Character` and `Chicken` objects).
   * Useful for debugging hitboxes.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}
