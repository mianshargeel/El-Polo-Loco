/**
 * Represents the game world.
 * Manages the character, enemies, level, UI elements, and game state.
 */
class World {
    /**
     * Initializes a new game world.
     * @param {HTMLCanvasElement} canvas - The canvas element for rendering the game.
     * @param {Keyboard} keyboard - The keyboard input handler for the game.
     */
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new Statusbar();
    coinStatusbar = new CoinStatusbar();
    bottleStatusbar = new BottleStatusbar();
    throwableObject = [];
    musicManager = new MusicManager();
    gameStarted = false;
    uiManager;
    isPaused = false; 
    pausePopup; 
    gameLoopInterval = null;
    animationFrame = null;
    static GROUND_Y = 420;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.musicManager = new MusicManager();
        this.character = new Character(this.musicManager);
        this.character.world = this;
        this.uiManager = new UIManager(canvas, this);
        this.creatingInstanceOfEndbossInWorld();
        this.statusBar = new Statusbar();
        this.coinStatusbar = new CoinStatusbar();
        this.bottleStatusbar = new BottleStatusbar();
        this.throwableObject = [];
        this.gameStarted = false;
        this.coins = [];
        this.showCoins();
        this.gameSounds = new GameSounds(this.musicManager);
        this.winPopup = new WinPopup(this);
        this.setWorld();

        this.isPaused = false;
        this.pausePopup = new PausePopup(this); // Initialize the pause popup
        // this.uiManager.createPauseButton();
        this.uiManager.showStartScreen(); // Show the start screen

        this.gameStarted = false;
        this.setupFullscreenControls();

        this.bottleStatusbar = new BottleStatusbar();
        this.bottleStatusbar.setPercentage(0); 

    }
    
    checkPepeBottleCollection() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && !bottle.collected) {
                if (bottle.collect()) {
                    this.level.bottles.splice(index, 1);
                    this.bottleStatusbar.increase();
                    this.musicManager.playCollectBotleSound();
                }
            }
        });
    }

    // In World class:
    setupFullscreenControls() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (!fullscreenBtn) return;

        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        fullscreenBtn.addEventListener('pointerdown', (e) => e.preventDefault());
        
        // Sync fullscreen state changes
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.adjustForFullscreen();
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        const element = this.canvas || document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen()
                .then(() => {
                    this.isFullscreen = true;
                    this.adjustForFullscreen();
                })
                .catch(err => {
                    console.error("Fullscreen error:", err);
                });
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen()
                .then(() => {
                    this.isFullscreen = false;
                    this.adjustForFullscreen();
                });
        }
    }

    adjustForFullscreen() {
        // Add any necessary adjustments when entering/exiting fullscreen
        if (this.isFullscreen) {
            // Fullscreen-specific adjustments
        } else {
            // Normal mode adjustments
        }

    }
    

    hideMenuButtons() {
        const startBtn = document.getElementById('start-btn');
        const infoBtn = document.getElementById('info-btn');
        console.log(startBtn, infoBtn); 
        if (startBtn) startBtn.style.display = 'none';
        if (infoBtn) infoBtn.style.display = 'none';
    }

    /** Set the world reference for the character */
    setWorld() {
        this.character.world = this;
    }

    /** Create instances of coins */
    showCoins() {
        this.coins = [];
        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (2200 - 200) + 200;
            let y = Math.random() * (90 - 50) + 50;
            this.coins.push(new CoinsHandle(x, y));
        }
    }
    /** Create an instance of the end boss */
    creatingInstanceOfEndbossInWorld() {
        this.level = level1;
        this.enemies = this.level.enemies;
        this.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.setCharacter(this.character);
            }
        });
    }
    /** Start the game
     * document.getElementById("mobile-controls").style.display = (window.innerWidth <= 1020) ? "flex" : "none";
     */
    startGame() {
        if (this.gameStarted) return;
        this.gameStarted = true;
        
        // Hide menu buttons
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('info-btn').style.display = 'none';
        
        // Show game controls (pause/sound/fullscreen)
        document.querySelector('.control-buttons').style.display = 'block'; // or 'flex' if needed
        
        // Rest of your game start logic...
        document.getElementById("mobile-controls").style.display = (window.innerWidth <= 1020) ? "flex" : "none";
        this.musicManager.playBackGroundMusic();
        this.draw();
        this.run();
    }


    /**Main-Game-Run loop */
    run() { 
        if (this.runInterval) {
            clearInterval(this.runInterval);
        }
    
        this.runInterval = setInterval(() => {
            if (this.gameStarted && !this.isPaused) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();
                this.checkPepeBottleCollection(); // to collect botles
            }
        }, 200);
    }
    
    

    togglePause() {
        if (!this.gameStarted) return;
        
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame() {
        if (this.isPaused) return;
        
        console.log("Pausing game...");
        this.isPaused = true;
        
        // 1. Stop game loops
        clearInterval(this.gameLoopInterval);
        cancelAnimationFrame(this.animationFrame);
        
        // 2. Pause audio
        this.musicManager.pauseBackgroundMusic();
        
        // 3. Show UI
        if (this.pausePopup) {
            this.pausePopup.show();
        }
    }

    resumeGame() {
        if (!this.isPaused) return;
        
        console.log("Resuming game...");
        this.isPaused = false;
        
        // 1. Restart game loops
        this.runGameLoop();
        this.animationFrame = requestAnimationFrame(() => this.draw());
        
        // 2. Resume audio
        this.musicManager.playBackGroundMusic();
        
        // 3. Hide UI
        if (this.pausePopup) {
            this.pausePopup.hide();
        }
    }

    runGameLoop() { //at restart regenerate whole game objects
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }
    
        this.gameLoopInterval = setInterval(() => {
            if (this.gameStarted && !this.isPaused) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();
                this.checkPepeBottleCollection();
            }
        }, 200);
    }
    

    /** Check for collisions with enemies */
    checkCollisions() {
        this.checkCollisionWithChicken();
        this.checkCollisionWithCoin();
    }
    /** Check for collisions with chickens */
    checkCollisionWithChicken() {
        // Make a copy of the array to avoid modification during iteration
        const enemiesCopy = [...this.level.enemies];
        
        enemiesCopy.forEach((enemy) => {
            const isCollidingTop = this.character.isCollidingFromTop(enemy);
            const isRegularColliding = this.character.isColliding(enemy);
            const isJumpKill = 
                this.character.speedY > 0 && // Pepe is moving upward
                this.character.x + this.character.width > enemy.x && 
                this.character.x < enemy.x + enemy.width;
    
            if (isCollidingTop || isJumpKill) {
                // Set the enemy's level reference if it doesn't have one
                if (enemy.level === undefined) {
                    enemy.level = this.level;
                }
                
                this.character.speedY = -12; // Bounce effect
                
                if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                    if (!enemy.isDead) {  // Only process if not already dead
                        enemy.die();
                        this.musicManager.enemyKilledSound();
                        this.character.energy = Math.min(this.character.energy + 20, 100);
                        this.statusBar.setPercentage(this.character.energy);
                    }
                } else {
                    // Fallback for non-Chicken enemies
                    const index = this.level.enemies.indexOf(enemy);
                    if (index > -1) {
                        this.level.enemies.splice(index, 1);
                        this.musicManager.enemyKilledSound();
                        this.character.energy = Math.min(this.character.energy + 20, 100);
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }
            } else if (isRegularColliding && !this.character.isHurt()) {
                // Hurt the character
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }
    
    
    
    /** Check for collisions with coins */
    checkCollisionWithCoin() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.coinStatusbar.increase();
                this.musicManager.collectedCoinsSound();
            }
        });
    }
    /** Check if a throwable object (bottle) should be thrown */
    checkThrowObject() {
        if (this.keyboard.D && this.bottleStatusbar.bottleCount > 0) {
            const throwDirection = this.character.otherDirection ? -1 : 1;
            const offsetX = this.character.otherDirection ? -100 : 100;
            
            let bottle = new ThrowableObject(
                this.character.x + offsetX,
                this.character.y + 100,
                this.character.otherDirection // Pass direction to bottle
            );
            
            this.throwableObject.push(bottle);
            this.musicManager.playBottleThrowSound();
            this.bottleStatusbar.decrease();
        }
    }
    /** Check for collisions with bottles */
    checkBottleCollisions() {
        if (!this.throwableObject || !Array.isArray(this.throwableObject)) return;

        this.throwableObject.forEach((bottle) => {
            this.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.takeDamage(1);
                        console.log('Endboss hit! Health:', enemy.health);
                    }
                    bottle.broken = true;
                }
            });
        });
    }
    /** Handle player winning the game */
    playerWins() {
        if (!this.gameStarted) return; // Prevent multiple calls
        this.gameStarted = false; // Prevent duplicate popups
        this.winPopup.show(); // Show the win popup
    }
    
    goToMainMenu() {
        console.log(" Going to main menu...");
        setTimeout(() => {
            window.location.href = "index.html"; // Replace with your main menu URL
        }, 100);
    }
    /** Restart the game */
   /**
 * Restarts the game by resetting all necessary components and starting fresh.
 */
    restartGame() {
        this.resetGameState();
        this.initializeLevel();
        this.initializeCharacter();
        this.initializeStatusBars();
        this.startGameLoop();
    }

    /**
     * Resets the all game-objects state, clears intervals, and resets objects.
     */
    resetGameState() {
        this.gameStarted = false;
        clearInterval(this.gameLoopInterval);
        clearInterval(this.runInterval); 
        cancelAnimationFrame(this.animationFrame);
        this.enemies = [];
        this.throwableObject = [];
        this.coins = [];
        this.bottles = [];
        this.character = null;
        this.level = null;
        this.camera_x = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Initializes the game level with new enemies, clouds, and background objects.
     */
    initializeLevel() {
        this.level = new Level(
            [
                new Chicken(), new Chicken(), new Chicken(),
                new SmallChicken(), new SmallChicken(),
                new Endboss(), new Chicken()
            ],
            [...level1.clouds],
            [...level1.backgroundObjects],
            this.createBottles()
        );
    
        this.enemies = this.level.enemies;
        this.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.setCharacter(this.character); // this already shows status bar!
                // ADD THIS to force status bar shown after restart:
                enemy.statusBar.show();
            }
        });
    }
    
    
    

    createBottles() {
        const bottles = [];
        // gnerate botles from at every restart
        const positions = [
            {x: 500, y: World.GROUND_Y - 60},
            {x: 650, y: World.GROUND_Y - 60},
            {x: 800, y: World.GROUND_Y - 60},
            {x: 1000, y: World.GROUND_Y - 60},
            {x: 1200, y: World.GROUND_Y - 60},
            {x: 1700, y: World.GROUND_Y - 60},
            {x: 1850, y: World.GROUND_Y - 60},
            {x: 2000, y: World.GROUND_Y - 60}
        ];
        
        positions.forEach(pos => {
            bottles.push(new BottleOnGround(pos.x, pos.y));
        });
        
        return bottles;
    }

    /**
     * Initializes the player character and assigns it to the game world.
     */
    initializeCharacter() {
        this.character = new Character(this.musicManager);
        this.character.world = this;
    }

    /**
     * Initializes all status bars (health, coins, bottles) and displays coins.
     */
    initializeStatusBars() {
        this.statusBar = new Statusbar();
        this.coinStatusbar = new CoinStatusbar();
        this.bottleStatusbar = new BottleStatusbar();
        this.showCoins();
    }

    /**
     * Starts the game loop, background music, and animation rendering.
     */
    startGameLoop() {
        this.createBottles();
        this.musicManager.playBackGroundMusic();
        if (this.winPopup) {
            this.winPopup.hide();
        }
        this.gameStarted = true;
        this.runGameLoop();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    createEndboss() {
        let endboss = new Endboss();
        endboss.world = this;
        endboss.health = 12;
        endboss.state = "walking";
        endboss.isDead = false;
        endboss.preloadImages(endboss.IMAGES_WALKING);
        endboss.preloadImages(endboss.IMAGES_ALERT);
        endboss.preloadImages(endboss.IMAGES_ATTACK);
        endboss.preloadImages(endboss.IMAGES_HURT);
        endboss.preloadImages(endboss.IMAGES_DEAD);
        endboss.x = 2500;
        endboss.statusBar = new StatusbarEndboss();
        endboss.setCharacter(this.character);
        return endboss;
    }
    
    /**
     * Draws all game objects onto the canvas and updates the scene.
     * Ensures proper rendering order and handles camera translation.
     */
    draw() {
        if (!this.gameStarted) {
            this.uiManager.showStartScreen();
            return;
        }
        
        if (this.isPaused) {
            this.animationFrame = requestAnimationFrame(() => this.draw());
            return;
        }
        
        this.clearCanvas();
        this.updateCamera();
        
        // Draw backgrounds first
        this.renderBackground();
        
        // Draw all game objects (including bottles)
        this.renderGameObjects();

        // Draw Endboss status bar (fixed position)
        this.ctx.save(); // Save current canvas state
        this.ctx.resetTransform(); // Remove all transformations
        if (this.level?.enemies) {
            const endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (endboss?.statusBar && endboss.health > 0) {
                endboss.statusBar.draw(this.ctx);
            }
        }
        this.ctx.restore(); // Restore previous canvas state
        
        // Draw UI elements last
        this.renderUI();
        
        this.restoreCamera();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }
        /**
     * Clears the entire game canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * Updates the camera position to follow the character.
     */
    updateCamera() {
        let cameraMarginLeft = 200;
        let cameraMarginRight = window.innerWidth / 2; 
    
        let targetCameraX;
    
        if (this.character.x + this.camera_x < cameraMarginLeft) {
            targetCameraX = -this.character.x + cameraMarginLeft;
        } else if (this.character.x + this.camera_x > cameraMarginRight) {
            targetCameraX = -this.character.x + cameraMarginRight;
        } else {
            targetCameraX = this.camera_x;
        }
    
        this.camera_x = -this.character.x + 100;
        this.camera_x = Math.floor(this.camera_x);
        this.ctx.translate(this.camera_x, 0);
    }
    
    /**
     * Renders the background elements in the game world.
     */

    renderBackground() {
        if (this.level?.backgroundObjects) {
            this.addArrayObjectToMap(this.level.backgroundObjects);
        }
    }
    /**
     * Renders static UI elements like status bars.
     */
    renderUI() {
        this.ctx.translate(-this.camera_x, 0); // Keep UI static
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusbar);
        this.addToMap(this.bottleStatusbar);
        this.ctx.translate(this.camera_x, 0); // Restore camera
    }

    renderGameObjects() {
        if (this.character) this.addToMap(this.character);
        if (this.level?.enemies) this.level.enemies.forEach(enemy => this.addToMap(enemy));
        if (this.throwableObject) this.addArrayObjectToMap(this.throwableObject);
        if (this.coins) this.addArrayObjectToMap(this.coins);
        if (this.level?.bottles) this.addArrayObjectToMap(this.level.bottles); 
    }
        /**
     * Restores the camera position after rendering.
     */
    restoreCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }

    /** Add an array of objects to the map */
    addArrayObjectToMap(arrays) {
        arrays.forEach(arr => this.addToMap(arr));
    }
    /** Add a single object to the map */
    addToMap(mObj) {
        if (mObj.otherDirection) {
            this.flipImage(mObj);
        }
        if (mObj.img) {
            mObj.drawImg(this.ctx);
            // mObj.drawFrame(this.ctx);
        }
        if (mObj.otherDirection) {
            this.flipImageBack(mObj);
        }
    }
    /** Flip an image horizontally */
    flipImage(mObj) {
        this.ctx.save();
        this.ctx.translate(mObj.width, 0);
        this.ctx.scale(-1, 1);
        mObj.x = mObj.x * -1;
    }
    /** Flip an image back to its original state */
    flipImageBack(mObj) {
        mObj.x = mObj.x * -1;
        this.ctx.restore();
    }
}