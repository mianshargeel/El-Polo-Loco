/**
 * Defines Level 1 of the game.
 * 
 * This level consists of:
 * - A list of enemies, including multiple chickens and an Endboss.
 * - Cloud objects to create depth.
 * - Background layers for a parallax scrolling effect.
 */

/**
 * The first level of the game.
 * Creates a new `Level` instance with:
 * - Enemies: 4 Chickens + 1 Endboss
 * - Clouds: 1 Cloud
 * - Background objects: Layered backgrounds for a parallax effect
 * 
 * @constant {Level} level1
 */
let baseX = 720 + 100; //
const level1 = new Level(
  /**
   * List of enemies in the level.
   * 
   * @type {MoveableObject[]}
   * Contains:
   * - 4 Chickens as small enemies
   * - 1 Endboss as the final boss
   */
  [
    new Chicken(baseX),
    new SmallChicken(baseX),
    new Chicken(baseX),
    new SmallChicken(baseX + 200),
    new Chicken(baseX + 300), 
    new Chicken(baseX + 600),
    new Endboss()
  ],

  /**
   * List of clouds in the level.
   * 
   * @type {Cloud[]}
   * Contains:
   * - 1 Cloud object for atmospheric effect
   */
  [
    new Cloud()
  ],

  /**
   * List of background objects to create depth and parallax scrolling.
   * 
   * @type {BackgroundObject[]}
   * The backgrounds are layered in the following order:
   * - Air (Sky)
   * - Third layer (Distant mountains)
   * - Second layer (Midground)
   * - First layer (Foreground)
   * 
   * Each set of layers repeats at specific X positions for smooth scrolling.
   */
  [
    // First set of backgrounds
    new BackgroundObject('img/5_background/layers/air.png', -719),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

    // Second set of backgrounds
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

    // Third set of backgrounds
    new BackgroundObject('img/5_background/layers/air.png', 719),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

    // Fourth set of backgrounds
    new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

    // Fifth set of backgrounds
    new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
  ], 

  [  // Bottles array
    new BottleOnGround(500, 370),
    new BottleOnGround(600, 370),
    new BottleOnGround(800, 370),
    new BottleOnGround(1200, 370),
    new BottleOnGround(1500, 370),
    new BottleOnGround(1700, 370),
    new BottleOnGround(1800, 370),
    new BottleOnGround(2000, 370)
  ]
);
