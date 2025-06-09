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
      this.speed = 0.2 + Math.random() * 0.5; // Small chickens can be a bit faster!

      this.animate();
  } 

  animate() {
      setInterval(() => {
          this.moveLeft();
      }, 1000 / 60);
      
      setInterval(() => {
          this.playAnimation(this.IMAGES_WALKING);
      }, 200);
  }

  update() {
      this.moveLeft();
    }
    
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGES_DEAD[0]]; // Show dead sprite immediately
    
        // Optional: Squash effect for visual feedback
        this.height = 60;
        this.y += 20;
    
        setTimeout(() => {
            if (this.level?.enemies) {
                const index = this.level.enemies.indexOf(this);
                if (index > -1) this.level.enemies.splice(index, 1);
            }
        }, 400);
    }
}
