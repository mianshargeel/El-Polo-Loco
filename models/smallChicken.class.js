class SmallChicken extends MoveableObject {  
  y = 330; // slightly lower
  height = 40;
  width = 50;

  IMAGES_WALKING = [
      'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  health = 1;

  constructor(startX = 720 + Math.random() * 200) {
      super();
      this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png'); 
      this.preloadImages(this.IMAGES_WALKING);

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
}
