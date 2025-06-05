class BottleOnGround extends DrawableObject {
  height = 70;
  width = 40;
  collected = false;
  IMAGES = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];

  constructor(x, y) {
      super();
    this.preloadImages(this.IMAGES);
    // console.log('Bottle images loaded:', this.imageCache);
      this.x = x;
      this.y = y;
      this.animate();
      this.setCollisionBox();
  }

  animate() {
    this.animationInterval = setInterval(() => {
        this.currentImage = (this.currentImage + 1) % this.IMAGES.length;
        this.img = this.imageCache[this.IMAGES[this.currentImage]];
    }, 500); // Switch image every 0.5 seconds
  }

  setCollisionBox() {
      this.collisionBox = {
          x: this.x + 5,
          y: this.y + 5,
          width: this.width - 10,
          height: this.height - 10
      };
  }

  collect() {
      if (!this.collected) {
          this.collected = true;
          clearInterval(this.animationInterval);
          this.playCollectionEffect();
          return true;
      }
      return false;
  }

  playCollectionEffect() {
      // Add visual/audio effects here
      this.img = new Image();
      this.img.src = 'img/effects/collected.png'; // Sparkle effect
      setTimeout(() => this.remove(), 300);
  }

  remove() {
      this.width = 0;
      this.height = 0;
      this.collisionBox.width = 0;
      this.collisionBox.height = 0;
  }
  
}