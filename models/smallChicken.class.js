class SmallChicken extends MoveableObject {  
  y = 330; // slightly lower
  height = 40;
  width = 50;

  IMAGES_WALKING = [
      'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    isDead = false;
    
  health = 1;

  constructor(startX = 720 + Math.random() * 200) {
      super();
      this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png'); 
      this.preloadImages(this.IMAGES_WALKING);
      this.preloadImages(this.IMAGES_DEAD);

      const groundY = 430; // Ground line!
      this.y = groundY - this.height;
      
      this.x = startX;
      this.speed = 0.2 + Math.random() * 0.5; 
      this.animate();
  } 

  /** Starts the movement and walking animation intervals if the game is running and the object is alive. */
  animate() {
        this.walkingInterval = setInterval(() => {
            if (this.world?.gameStarted && !this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60); 

        this.animationInterval = setInterval(() => {
            if (this.world?.gameStarted && !this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
    
    /** Returns the object's hitbox with defined offsets for collision detection. */
    getHitbox() {
        const offsetX = 20; 
        const offsetY = 20; 
        const width = this.width - 2 * offsetX;
        const height = this.height - offsetY;
    
        return {
            left: this.x + offsetX,
            right: this.x + offsetX + width,
            top: this.y + offsetY,
            bottom: this.y + offsetY + height
        };
    }
    
    /** Moves the object left on each update cycle. */
    update() {
        this.moveLeft();
    }
    
    /** Marks the object as dead, stops its intervals, and removes it from the level after a short delay. */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
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
