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
        // Hide HTML buttons when game starts (add this line)
        // this.hideMenuButtons();
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


    /** Run the game loop */
    run() {
        setInterval(() => {
            if (this.gameStarted && !this.isPaused) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();
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

    runGameLoop() {
        // Clear any existing interval
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }
        
        this.gameLoopInterval = setInterval(() => {
            if (this.gameStarted && !this.isPaused) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();
                this.updateCameraPosition();
            }
        }, 200);
    }

    updateCameraPosition() {
        this.camera_x = -this.character.x + 100;
    }

    /** Check for collisions with enemies */
    checkCollisions() {
        this.checkCollisionWithChicken();
        this.checkCollisionWithCoin();
    }
    /** Check for collisions with chickens */
    checkCollisionWithChicken() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isCollidingFromTop(enemy)) {
                this.character.speedY = -12;
                this.level.enemies.splice(index, 1);
                this.musicManager.enemyKilledSound();
                this.character.energy = Math.min(this.character.energy + 20, 100);
                this.statusBar.setPercentage(this.character.energy);
            } else if (this.character.isColliding(enemy) && !this.character.isHurt()) {
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
        if (this.keyboard.D && this.bottleStatusbar.percentage > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
            this.musicManager.playBottleThrowSound();//sound at every throw
            this.bottleStatusbar.useBottle();
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
        console.log("🏠 Going to main menu...");
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
    this.cleanUpEnemies();
    this.startGameLoop();
}

/**
 * Resets the game state, clears intervals, and resets objects.
 */
resetGameState() {
    this.gameStarted = false;
    clearInterval(this.gameLoopInterval);
    cancelAnimationFrame(this.animationFrame);
    this.enemies = [];
    this.throwableObject = [];
    this.coins = [];
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
        [new Chicken(), new Chicken(), new Chicken()],
        [...level1.clouds],
        [...level1.backgroundObjects]
    );
    this.enemies = [...this.level.enemies];
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
 * Removes any existing Endboss instances and creates a fresh one.
 */
cleanUpEnemies() {
    this.enemies = this.enemies.filter(enemy => !(enemy instanceof Endboss));
    this.createNewEndboss();
}

/**
 * Starts the game loop, background music, and animation rendering.
 */
startGameLoop() {
    this.musicManager.playBackGroundMusic();
    if (this.winPopup) {
        this.winPopup.hide();
    }
    this.gameStarted = true;
    this.runGameLoop();
    this.animationFrame = requestAnimationFrame(() => this.draw());
}

    /**  New function to start the game loop properly */
    runGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            if (this.gameStarted) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();

                //  Continuously update camera position
                this.camera_x = -this.character.x + 100;
            }
        }, 200);
    }
    createNewEndboss() {
        this.enemies = this.enemies.filter(enemy => !(enemy instanceof Endboss));
        let endboss = new Endboss();
        endboss.world = this;
        endboss.health = 20;
        endboss.state = "walking";
        endboss.isDead = false;
        endboss.preloadImages(endboss.IMAGES_WALKING);
        endboss.preloadImages(endboss.IMAGES_ALERT);
        endboss.preloadImages(endboss.IMAGES_ATTACK);
        endboss.preloadImages(endboss.IMAGES_HURT);
        endboss.preloadImages(endboss.IMAGES_DEAD);
        endboss.x = 2500;
        this.enemies.push(endboss);
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
        
        // Add this check for pause state
        if (this.isPaused) {
            // Still request next frame but don't render
            this.animationFrame = requestAnimationFrame(() => this.draw());
            return;
        }
        
        this.clearCanvas();
        this.updateCamera();
        this.renderBackground();
        this.renderUI();
        this.renderGameObjects();
        this.restoreCamera();
        
        // Store the animation frame ID for cleanup
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
        this.camera_x = -this.character.x + 100;
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
        if (this.enemies) this.enemies.forEach(enemy => this.addToMap(enemy));
        if (this.throwableObject) this.addArrayObjectToMap(this.throwableObject);
        if (this.coins) this.addArrayObjectToMap(this.coins);
    }
        /**
     * Restores the camera position after rendering.
     */
    restoreCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }

    updateCamera() {
        this.camera_x = Math.min(0, -this.character.x + window.innerWidth / 2);
        this.ctx.translate(this.camera_x, 0);
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