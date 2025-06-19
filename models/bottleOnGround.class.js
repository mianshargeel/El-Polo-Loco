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
      this.x = x;
      this.y = y;
      this.animate();
      this.setCollisionBox();
  }

  animate() {
    this.animationInterval = setInterval(() => {
        this.currentImage = (this.currentImage + 1) % this.IMAGES.length;
        this.img = this.imageCache[this.IMAGES[this.currentImage]];
    }, 500); 
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
          // this.playCollectionEffect();
          return true;
      }
      return false;
  }

  getHitbox() {
    const padding = 30;
    return {
        left: this.x + padding,
        right: this.x + this.width - padding,
        top: this.y + padding,
        bottom: this.y + this.height - padding
    };
}
  remove() {
      this.width = 0;
      this.height = 0;
      this.collisionBox.width = 0;
      this.collisionBox.height = 0;
  }
  
}