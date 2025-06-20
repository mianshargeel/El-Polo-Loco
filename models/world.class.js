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
        this.level = new Level(
            [...level1.enemies],        
            [...level1.clouds],
            [...level1.backgroundObjects],
            this.createBottles()        
        );
        this._gameOverPopupActive = false;
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
    showCoins() {
        this.coins = [];
        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (2200 - 200) + 200;
            let y = Math.random() * (90 - 50) + 50;
            this.coins.push(new CoinsHandle(x, y));
        }
    }
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
        this.draw();
        this.run();
    }
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
    pauseGame() {
        if (this.isPaused) return;
        this.isPaused = true;
        clearInterval(this.gameLoopInterval);
        cancelAnimationFrame(this.animationFrame);
        this.musicManager.pauseBackgroundMusic();
        if (this.pausePopup) { this.pausePopup.show(); }
    }
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.runGameLoop();
        this.animationFrame = requestAnimationFrame(() => this.draw());
        this.musicManager.playBackGroundMusic();
        const popup = document.getElementById('pausePopup');
        if (popup) popup.style.display = 'none';
        if (window.updateMobileControlsVisibility) { window.updateMobileControlsVisibility(); }
    }
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
    checkCollisions() {
        this.checkCollisionWithChicken();
        this.checkCollisionWithCoin();
    }
    checkCollisionWithChicken() {
        [...this.level.enemies].forEach(enemy => {
            if (this.shouldKillEnemy(enemy)) {
                this.killEnemy(enemy);
            } else if (this.shouldTakeDamage(enemy)) {
                this.handleCharacterHit();
            }
        });
    }
    shouldKillEnemy(enemy) {
        const jumpKill = this.character.speedY > 0 &&
            this.character.x + this.character.width > enemy.x &&
            this.character.x < enemy.x + enemy.width;
        const topHit = this.character.isCollidingFromTop(enemy);
        return topHit || jumpKill;
    }
    killEnemy(enemy) {
        enemy.level ??= this.level;
        this.character.speedY = -12;
    
        if ((enemy instanceof Chicken || enemy instanceof SmallChicken) && !enemy.isDead) {
            enemy.die();
            this.musicManager.enemyKilledSound();
        } else if (enemy instanceof Endboss) {
            enemy.takeDamage(1);
            this.musicManager.playEndBossHurtSound();
        }
    }
    shouldTakeDamage(enemy) {
        return this.character.isColliding(enemy) && !this.character.isHurt();
    }
    handleCharacterHit() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }
    checkCollisionWithCoin() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.coinStatusbar.increase();
                this.musicManager.collectedCoinsSound();
            }
        });
    }
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
    restartGame() {
        this.resetGameState();          
        this.initializeCharacter();     
        this.initializeLevel();         
        this.initializeStatusBars();
        this._gameOverShown = false;
        this.startGameLoop();
    }
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
    initializeCharacter() {
        if (this.character) { this.character.cleanup(); }
        const newCharacter = new Character(this.musicManager);
        newCharacter.world = this;
        newCharacter.energy = 100;
        newCharacter._deathHandled = false;
        newCharacter.isDeadAnimationPlayed = false;
        this.character = newCharacter;
    }
    initializeStatusBars() {
        this.statusBar = new Statusbar();
        this.coinStatusbar = new CoinStatusbar();
        this.bottleStatusbar = new BottleStatusbar();
        this.showCoins();
    }
    startGameLoop() {
        this.createBottles();
        this.musicManager.playBackGroundMusic();
        if (this.winPopup) { this.winPopup.hide(); }
        this.gameStarted = true;
        this.runGameLoop();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }
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
    loadEndbossIMAGES() {
        endboss.preloadImages(endboss.IMAGES_WALKING);
        endboss.preloadImages(endboss.IMAGES_ALERT);
        endboss.preloadImages(endboss.IMAGES_ATTACK);
        endboss.preloadImages(endboss.IMAGES_HURT);
        endboss.preloadImages(endboss.IMAGES_DEAD);
    }
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
        this.renderBackground();
        this.renderGameObjects();
        this.ctx.save(); 
        this.ctx.resetTransform(); 
        if (this.level?.enemies) {
            const endboss = this.level.enemies.find(e => e instanceof Endboss);
             if (endboss?.statusBar && endboss.health > 0) { endboss.statusBar.draw(this.ctx); } }
        this.ctx.restore(); 
        this.renderUI();
        this.restoreCamera();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
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
    renderBackground() {
        if (this.level?.backgroundObjects) { this.addArrayObjectToMap(this.level.backgroundObjects); }
        if (this.level?.clouds) { this.addArrayObjectToMap(this.level.clouds); }
    }
    renderUI() {
        this.ctx.translate(-this.camera_x, 0); 
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusbar);
        this.addToMap(this.bottleStatusbar);
        this.ctx.translate(this.camera_x, 0);
    }
    renderGameObjects() {
        if (this.character) this.addToMap(this.character);
        if (this.level?.enemies) this.level.enemies.forEach(enemy => this.addToMap(enemy));
        if (this.throwableObject) this.addArrayObjectToMap(this.throwableObject);
        if (this.coins) this.addArrayObjectToMap(this.coins);
        if (this.level?.bottles) this.addArrayObjectToMap(this.level.bottles); 
    }
    restoreCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }
    addArrayObjectToMap(arrays) {
        arrays.forEach(arr => this.addToMap(arr));
    }
    addToMap(mObj) {
        if (mObj.otherDirection) { this.flipImage(mObj); }
        if (mObj.img) { mObj.drawImg(this.ctx); }
        if (mObj.otherDirection) { this.flipImageBack(mObj); }
    }
    flipImage(mObj) {
        this.ctx.save();
        this.ctx.translate(mObj.width, 0);
        this.ctx.scale(-1, 1);
        mObj.x = mObj.x * -1;
    }
    flipImageBack(mObj) {
        mObj.x = mObj.x * -1;
        this.ctx.restore();
    }
}