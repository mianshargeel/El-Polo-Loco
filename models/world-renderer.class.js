/**
 * Handles all rendering and drawing operations for the World.
 * Delegates canvas drawing, background rendering, object rendering, and camera updates.
 */

class WorldRenderer {
    /**
     * Creates a renderer instance tied to a World.
     * @param {World} world - The World instance to render.
     */
  constructor(world) {
      this.world = world;
      this.ctx = world.ctx;
  }

 /**
     * Main draw loop for the game.
     * Renders background, objects, UI, and schedules the next frame.
     */
  draw() {
      if (!this.world.gameStarted) {
          this.world.uiManager.showStartScreen();
          return;
      }
      if (this.world.isPaused) {
          this.world.animationFrame = requestAnimationFrame(() => this.draw());
          return;
      }

      this.clearCanvas();
      this.updateCamera();
      this.renderBackground();
      this.renderGameObjects();
      this.drawEndbossHealthBar();
      this.renderUI();
      this.restoreCamera();

      this.world.animationFrame = requestAnimationFrame(() => this.draw());
  }

  /**
     * Clears the entire canvas area before redrawing.
     */
  clearCanvas() {
      this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
  }

    /**
     * Adjusts the camera based on the character's position.
     */
  updateCamera() {
      const char = this.world.character;
      let marginLeft = 200;
      let marginRight = window.innerWidth / 2;

      if (char.x + this.world.camera_x < marginLeft) {
          this.world.camera_x = -char.x + marginLeft;
      } else if (char.x + this.world.camera_x > marginRight) {
          this.world.camera_x = -char.x + marginRight;
      }

      this.world.camera_x = Math.floor(-char.x + 100);
      this.ctx.translate(this.world.camera_x, 0);
  }

   /**
     * Renders all background elements like sky, ground, and clouds.
     */
  renderBackground() {
      const level = this.world.level;
      if (level?.backgroundObjects) this.addArrayToMap(level.backgroundObjects);
      if (level?.clouds) this.addArrayToMap(level.clouds);
  }

   /**
     * Renders all game objects including player, enemies, coins, and bottles.
     */
  renderGameObjects() {
      if (this.world.character) this.addToMap(this.world.character);
      if (this.world.level?.enemies) this.world.level.enemies.forEach(e => this.addToMap(e));
      if (this.world.throwableObject) this.addArrayToMap(this.world.throwableObject);
      if (this.world.coins) this.addArrayToMap(this.world.coins);
      if (this.world.level?.bottles) this.addArrayToMap(this.world.level.bottles);
  }

  /**
     * Renders fixed UI elements like health, coin, and bottle status bars.
     */
  renderUI() {
      this.ctx.translate(-this.world.camera_x, 0);
      this.addToMap(this.world.statusBar);
      this.addToMap(this.world.coinStatusbar);
      this.addToMap(this.world.bottleStatusbar);
      this.ctx.translate(this.world.camera_x, 0);
  }

    /**
     * Draws the Endboss's health/status bar if the Endboss is alive.
     */
  drawEndbossHealthBar() {
      this.ctx.save();
      this.ctx.resetTransform();
      const endboss = this.world.level?.enemies.find(e => e instanceof Endboss);
      if (endboss?.statusBar && endboss.health > 0) {
          endboss.statusBar.draw(this.ctx);
      }
      this.ctx.restore();
  }

  /**
     * Restores camera position after rendering UI.
     */
  restoreCamera() {
      this.ctx.translate(-this.world.camera_x, 0);
  }

   /**
     * Adds an array of game objects to the map and renders them.
     * @param {Array} array - Array of drawable game objects.
     */
  addArrayToMap(array) {
      array.forEach(obj => this.addToMap(obj));
  }

   /**
     * Adds a single game object to the map, handling flipping if needed.
     * @param {Object} obj - A drawable game object.
     */
  addToMap(obj) {
      if (obj.otherDirection) this.flipImage(obj);
      if (obj.img) obj.drawImg(this.ctx);
      if (obj.otherDirection) this.flipImageBack(obj);
  }

  /**
     * Flips an image horizontally before drawing (for mirrored sprites).
     * @param {Object} obj - The object to flip.
     */
  flipImage(obj) {
      this.ctx.save();
      this.ctx.translate(obj.width, 0);
      this.ctx.scale(-1, 1);
      obj.x *= -1;
  }

  /**
     * Restores the image position after horizontal flip.
     * @param {Object} obj - The object to restore.
     */
  flipImageBack(obj) {
      obj.x *= -1;
      this.ctx.restore();
  }
}
