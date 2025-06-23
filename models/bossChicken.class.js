class BossChicken extends MoveableObject {
  height = 40;
  width = 50;
  isDead = false;
  speed = 0.4;
  speedY = 0;
  accelerationY = 0.5;
  groundY = 430;
  falling = true;

  IMAGES_WALKING = [
      'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  IMAGES_DEAD = [
      'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
  ];

  constructor(x, y) {
      super();
      this.x = x;
      this.y = y;
      this.loadImage(this.IMAGES_WALKING[0]);
      this.preloadImages(this.IMAGES_WALKING);
      this.preloadImages(this.IMAGES_DEAD);
      this.animate();
    }
    
    /** Animates the character with falling and walking behavior at regular intervals. */
    animate() {
        this.walkingInterval = setInterval(() => {
            if (!this.world?.gameStarted || this.isDead) return;
            if (this.falling) {
                this.speedY += this.accelerationY;
                this.y += this.speedY;
                if (this.y >= this.groundY - this.height) {
                    this.y = this.groundY - this.height;
                    this.falling = false;
                    this.speedY = 0;
                }
            } else { this.moveLeft(); 
            }
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (!this.world?.gameStarted || this.isDead) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

/** Moves the character left by its current speed value. */
  moveLeft() {
      this.x -= this.speed;
  }

    /** Handles character death, stops animation, and removes it from the level after delay. */
  die() {
      if (this.isDead) return;
      this.isDead = true;
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
      clearInterval(this.walkingInterval);
      clearInterval(this.animationInterval);
      setTimeout(() => {
          const index = this.level?.enemies?.indexOf(this);
          if (index > -1) {
              this.level.enemies.splice(index, 1);
          }
      }, 300);
  }
}
