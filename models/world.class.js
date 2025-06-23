class World {
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
        this.uiManager = new UIManager(canvas, this);
        this.statusBar = new Statusbar();
        this.coinStatusbar = new CoinStatusbar();
        this.bottleStatusbar = new BottleStatusbar();
        this.throwableObject = [];
        this.gameStarted = false;
        this.coins = [];
        this.showCoins();
        this.gameSounds = new GameSounds(this.musicManager);
        this.winPopup = new WinPopup(this);
        this.isPaused = false;
        this.pausePopup = new PausePopup(this); 
        this.uiManager.showStartScreen(); 
        this.gameStarted = false;
        this.uiManager.setupFullscreenControls();
        this.bottleStatusbar = new BottleStatusbar();
        this.bottleStatusbar.setPercentage(0); 
        this.level = new Level([...level1.enemies],[...level1.clouds],[...level1.backgroundObjects],this.createBottles() );
        this._gameOverPopupActive = false;

        this.renderer = new WorldRenderer(this);

    }

    /** Handles collection of bottles when Pepe collides with them.*/
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

    /** Generates and displays 5 coins at random positions within a defined range.*/
    showCoins() {
        this.coins = [];
        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (2200 - 200) + 200;
            let y = Math.random() * (90 - 50) + 50;
            this.coins.push(new CoinsHandle(x, y));
        }
    }

    /** Initializes level enemies and assigns the world and character to the Endboss. */
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
    
    /** Starts the game, initializes all systems, and begins rendering and logic loops. */
    startGame() {
        if (this.gameStarted) { return; }
        this.gameStarted = true;
        this.initializeCharacter();
        this.initializeLevel();
        this.initializeStatusBars();
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('info-btn').style.display = 'none';
        document.querySelector('.control-buttons').style.display = 'block';
        document.getElementById("mobile-controls").style.display = (window.innerWidth <= 1020) ? "flex" : "none";
        this.musicManager.playBackGroundMusic();
        this.renderer.draw();
        this.run();
    }

    /** Runs the main game logic interval that checks collisions and actions. */
    run() { 
        if (this.runInterval) { clearInterval(this.runInterval); }
        this.runInterval = setInterval(() => {
            if (this.gameStarted && !this.isPaused) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();
                this.checkPepeBottleCollection(); // to collect botles
            }
        }, 200);
    }
    
    /** Pauses the game, stops logic and animation, and shows the pause popup. */
    pauseGame() {
        if (this.isPaused) return;
        this.isPaused = true;
        clearInterval(this.gameLoopInterval);
        cancelAnimationFrame(this.animationFrame);
        this.musicManager.pauseBackgroundMusic();
        if (this.pausePopup) { this.pausePopup.show(); }
    }

    /** Resumes the game from pause state and restarts the game loop and animation. */
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.runGameLoop();
        this.animationFrame = requestAnimationFrame(() =>  this.renderer.draw());
        this.musicManager.playBackGroundMusic();
        const popup = document.getElementById('pausePopup');
        if (popup) popup.style.display = 'none';
        if (window.updateMobileControlsVisibility) { window.updateMobileControlsVisibility(); }
    }

    /** Starts the interval for checking collisions and gameplay logic. */
    runGameLoop() { 
        if (this.gameLoopInterval) { clearInterval(this.gameLoopInterval); }
        this.gameLoopInterval = setInterval(() => {
            if (this.gameStarted && !this.isPaused) {
                this.checkCollisions();
                this.checkThrowObject();
                this.checkBottleCollisions();
                this.checkPepeBottleCollection();
            }
        }, 200);
    }

    /** Checks all relevant collisions in the game. */
    checkCollisions() {
        this.checkCollisionWithChicken();
        this.checkCollisionWithCoin();
    }

    /** Checks for collisions between character and chickens, and handles hit or kill. */
    checkCollisionWithChicken() {
        [...this.level.enemies].forEach(enemy => {
            if (this.shouldKillEnemy(enemy)) {
                this.killEnemy(enemy);
            } else if (this.shouldTakeDamage(enemy)) { this.handleCharacterHit(); }
        });
    }

    /** Determines if an enemy should be killed based on collision from above. */
    shouldKillEnemy(enemy) {
        const result = this.character.isCollidingFromTop(enemy);
        if (this.character.isCollidingFromTop(enemy)) return result;
    }

    /** Kills an enemy or deals damage depending on its type. */
    killEnemy(enemy) {
        enemy.level ??= this.level;
        this.character.speedY = -12;
        if ((enemy instanceof Chicken || enemy instanceof SmallChicken) || enemy instanceof BossChicken && !enemy.isDead) {
            setTimeout(() => {
                enemy.die();
                this.musicManager.enemyKilledSound();
            }, 100);
        } else if (enemy instanceof Endboss) {
            enemy.takeDamage(1);
            this.musicManager.playEndBossHurtSound();
        }
    }

    /** Checks if the character should take damage from an enemy. */
    shouldTakeDamage(enemy) {
        return this.character.isColliding(enemy) && !this.character.isHurt();
    }

    /** Handles what happens when the character takes damage. */
    handleCharacterHit() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    /** Checks if the character collides with a coin and collects it. */
    checkCollisionWithCoin() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.coinStatusbar.increase();
                this.musicManager.collectedCoinsSound();
            }
        });
    }

    /** Throws a bottle if the D key is pressed and bottles are available. */
    checkThrowObject() {
        if (this.keyboard.D && this.bottleStatusbar.bottleCount > 0) {
            const throwDirection = this.character.otherDirection ? -1 : 1;
            const offsetX = this.character.otherDirection ? -100 : 100;
            let bottle = new ThrowableObject(
                this.character.x + offsetX,
                this.character.y + 100,
                this.character.otherDirection 
            );
            this.throwableObject.push(bottle);
            this.musicManager.playBottleThrowSound();
            this.bottleStatusbar.decrease();
        }
    }

    /** Checks for bottle collisions with enemies and handles damage or breakage. */
    checkBottleCollisions() {
        if (!this.throwableObject || !Array.isArray(this.throwableObject)) return;
        this.throwableObject.forEach((bottle) => {
            this.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.takeDamage(1);
                        this.musicManager.playEndBossHurtSound();
                        // console.log('Endboss hit! Health:', enemy.health);
                    }
                    bottle.broken = true;
                }
            });
        });
    }

    /** Restarts the game by resetting and reinitializing all core systems. */
    restartGame() {
        this.resetGameState();          
        this.initializeCharacter();     
        this.initializeLevel();         
        this.initializeStatusBars();
        this._gameOverShown = false;
        this.startGameLoop();
    }

    /** Fully resets the game state, objects, and UI for a fresh start. */
    resetGameState() {
        clearInterval(this.gameLoopInterval);
        clearInterval(this.runInterval);
        cancelAnimationFrame(this.animationFrame);
        if (this.character) { this.character.cleanup(); }
        this.enemies = [];
        this.throwableObject = [];
        this.coins = [];
        this.bottles = [];
        this.camera_x = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameStarted = false;
        this.isPaused = false;
        this._gameOverPopupActive = false;
        this._gameOverShown = false;
    }

    /** Initializes the level with default enemies, objects, and environment. */
    initializeLevel() {
        if (!this.character) { return;}
        this.level = new Level( [new Chicken(), new Chicken(), new Chicken(), new SmallChicken(), new SmallChicken(),new Endboss(), new Chicken()], [...level1.clouds], [...level1.backgroundObjects], this.createBottles() );
        this.enemies = this.level.enemies;
        this.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                if (this.character) {
                    enemy.setCharacter(this.character); 
                    enemy.statusBar.show();
                } else { console.warn('Skipping setCharacter for Endboss: character not available'); }
            }
        });
    }

    /** Creates bottles and places them at fixed positions in the level. */
    createBottles() {
        const bottles = [];
        const positions = [ 
            {x: 500, y: World.GROUND_Y - 60},
            {x: 650, y: World.GROUND_Y - 60},
            {x: 800, y: World.GROUND_Y - 60},
            {x: 1000, y: World.GROUND_Y - 60},
            {x: 1200, y: World.GROUND_Y - 60},
            {x: 1350, y: World.GROUND_Y - 60},
            {x: 1500, y: World.GROUND_Y - 60},
            {x: 1700, y: World.GROUND_Y - 60},
            {x: 1850, y: World.GROUND_Y - 60},
            {x: 2000, y: World.GROUND_Y - 60}
        ];
        positions.forEach(pos => { bottles.push(new BottleOnGround(pos.x, pos.y)); });
        return bottles;
    }

    /** Initializes the main character and sets its properties and world reference. */
    initializeCharacter() {
        if (this.character) { this.character.cleanup(); }
        const newCharacter = new Character(this.musicManager);
        newCharacter.world = this;
        newCharacter.energy = 100;
        newCharacter._deathHandled = false;
        newCharacter.isDeadAnimationPlayed = false;
        this.character = newCharacter;
    }

    /** Initializes all status bars and triggers coin generation. */
    initializeStatusBars() {
        this.statusBar = new Statusbar();
        this.coinStatusbar = new CoinStatusbar();
        this.bottleStatusbar = new BottleStatusbar();
        this.showCoins();
    }

    /** Starts the game loop and background music after winning or restarting. */
    startGameLoop() {
        this.createBottles();
        this.musicManager.playBackGroundMusic();
        if (this.winPopup) { this.winPopup.hide(); }
        this.gameStarted = true;
        this.runGameLoop();
        this.animationFrame = requestAnimationFrame(() => this.renderer.draw());
    }

    /** Creates and returns a new Endboss instance with default values. */
    createEndboss() {
        let endboss = new Endboss();
        endboss.world = this;
        endboss.health = 15;
        endboss.state = "walking";
        endboss.isDead = false;
        this.loadEndbossIMAGES();
        endboss.x = 2500;
        endboss.statusBar = new StatusbarEndboss();
        endboss.setCharacter(this.character);
        return endboss;
    }

    /** Loads all image assets required for Endboss animations. */
    loadEndbossIMAGES() {
        endboss.preloadImages(endboss.IMAGES_WALKING);
        endboss.preloadImages(endboss.IMAGES_ALERT);
        endboss.preloadImages(endboss.IMAGES_ATTACK);
        endboss.preloadImages(endboss.IMAGES_HURT);
        endboss.preloadImages(endboss.IMAGES_DEAD);
    }

    /**
     * Stops all active intervals and animations after game is won.
     */
    stopGameCompletely() {
        clearInterval(this.gameLoopInterval);
        clearInterval(this.runInterval);
        cancelAnimationFrame(this.animationFrame);
        this.gameStarted = false;
    }

   
}