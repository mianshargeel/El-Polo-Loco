class Endboss extends MoveableObject {
    height = 400;
    width = 250;
    y = 55;
    health = 15;
    state = 'walking';
    isDead = false;
    attackCooldown = false;
    attackInProgress = false;
    attackDelay = 3000;
    attackSpeed = 8;
    originalX = 2500;
    
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];
    
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]); 
        this.preloadImages(this.IMAGES_WALKING);
        this.preloadImages(this.IMAGES_ALERT);
        this.preloadImages(this.IMAGES_ATTACK);
        this.preloadImages(this.IMAGES_HURT);
        this.preloadImages(this.IMAGES_DEAD);
        this.preloadImages(EndbossStatusBar.IMAGE_PATHS);
        this.x = 2500;
        this.speed = 2;
        this.state = 'walking';
        this.isDead = false;
        this.animate();
        this.maxHealth = 15; 
        this.health = this.maxHealth;
        this.initStatusBar();
        this.totalChickensSpawned = 0;  
        this.maxChickens = 4
    }

    /** Initializes the Endboss status bar with default configuration. */
    initStatusBar() {
        this.statusBar = new EndbossStatusBar( this.maxHealth,500,15,200,45, EndbossStatusBar.IMAGE_PATHS);
    }

    /** Updates the Endboss status bar visibility and health based on distance and state. */
    updateStatusBar() {
        if (!this.statusBar || !this.character) return;
        const distance = Math.abs(this.x - this.character.x);
        if (distance < 600 && !this.isDead) { this.statusBar.show();
        } else { this.statusBar.hide();
        }
        this.statusBar.update(this.health);
    }

    /** Sets the character (Pepe) reference and updates status bar visibility. */
    setCharacter(character) {
        if (!character) return; 
        this.character = character;
        if (character.world) {
            this.musicManager = character.world.musicManager;
        } else {
            const checkWorld = setInterval(() => {
                if (character.world) {
                    this.musicManager = character.world.musicManager;
                    clearInterval(checkWorld);
                    if (this.statusBar) {
                        this.statusBar.update(this.health);
                        this.statusBar.show();
                    }
                }
            }, 100);
        }
    }

    /** Handles animation, movement, and state updates.*/
    animate() {
        setInterval(() => {
            this.updateState();
            this.move();
            this.playAnimation(this.getAnimation());
            this.updateStatusBar();
        }, 100);
    }

    /** Moves the Endboss based on its current state. */
    move() {
        if (this.state === 'walking') {
            this.moveLeft();
        } else if ((this.state === 'alert') && !this.attackInProgress) {
            this.moveTowardPepe();
        }
    }

    /** Moves the Endboss left or reverses direction when reaching limits. */
    moveLeft() {
        this.x -= this.speed;
        if (this.x < 2000 || this.x > 2500) {
            this.speed = -this.speed;
        }
    }

    /** Moves the Endboss toward Pepe when alert or attacking. */
    moveTowardPepe() {
        if (this.x > this.character.x) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }

    /**  Updates the Endboss's state based on health, attacks, and distance from Pepe. */
    updateState() {
        if (this.health <= 0) {
            this.state = 'dead';
        } else if (this.isHurt()) {
            this.state = 'hurt';
        } else if (this.canStartAttack()) {
            this.runAttack(); 
        } else if (this.canStartSpitting()) {
            this.spitChicken();
        } else if (this.isAlert()) {
            this.state = 'alert';
        } else {
            this.state = 'walking';
        }
    }

    /** Gets the correct animation image array based on the current state. */
    getAnimation() {
        switch (this.state) {
            case 'walking': return this.IMAGES_WALKING;
            case 'alert': return this.IMAGES_ALERT;
            case 'attack': return this.IMAGES_ATTACK;
            case 'hurt': return this.IMAGES_HURT;
            case 'dead': return this.IMAGES_DEAD;
            default: return this.IMAGES_WALKING;
        }
    }

    /** Returns true if the Endboss is in a hurt state. */
    isHurt() {
        return this.state === 'hurt' && this.lastHurtTime + 500 > Date.now();
    }

    /** Returns true if the Endboss is within attack range of the player. */
    isAttacking() {
        if (!this.character) return false;
        return Math.abs(this.x - this.character.x) < 200;
    }

   /** Returns true if the Endboss is alert due to player's proximity. */
    isAlert() {
        if (!this.character) return false;
        return Math.abs(this.x - this.character.x) < 400;
    }

    /** Returns true if the Endboss can start a dash attack. */
    canStartAttack() {
        return (
            !this.attackCooldown &&
            !this.attackInProgress &&
            this.character &&
            Math.abs(this.x - this.character.x) < 200
        );
    }

    /** Returns true if the Endboss can begin spitting chickens. */
    canStartSpitting() {
        return (
            !this.attackCooldown &&
            !this.attackInProgress &&
            !this.chickenThrowInterval &&
            this.character &&
            Math.abs(this.x - this.character.x) < 400
        );
    }

    /** Reduces Endboss health and triggers hurt or death logic. */
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        this.updateStatusBar();
        this.state = 'hurt';
        this.lastHurtTime = Date.now();
        setTimeout(() => {
            if (this.health > 0) {
                this.state = 'alert';
            }
        }, 500);
        if (this.health <= 0) { this.die();
            if (this.statusBar) {
                this.statusBar.update(0);
                setTimeout(() => this.statusBar.hide(), 1000);
            }
        }
    }

    /** Executes the Endboss's dash attack toward the player. */
    runAttack() {
        this.attackInProgress = true;
        this.originalX = this.x;
        this.state = 'attack';
        const direction = this.x > this.character.x ? -1 : 1;
        const targetX = this.character.x + (direction * 50);
        const attackInterval = setInterval(() => {
            this.x += direction * this.attackSpeed;
            if ((direction === -1 && this.x <= targetX) || (direction === 1 && this.x >= targetX)) {
                clearInterval(attackInterval);
                this.returnToStart();
            }
        }, 50);
    }

    /** Returns the Endboss to its original position after attack ends. */
    returnToStart() {
        const direction = this.x > this.originalX ? -1 : 1;
        const returnInterval = setInterval(() => {
            this.x += direction * this.attackSpeed;
            if ((direction === -1 && this.x <= this.originalX) ||
                (direction === 1 && this.x >= this.originalX)) {
                clearInterval(returnInterval);
                this.x = this.originalX;
                this.attackInProgress = false;
                this.attackCooldown = true;
                setTimeout(() => {
                    this.attackCooldown = false;
                }, this.attackDelay);
                this.state = 'alert';
            }
        }, 50);
    }

    /** Starts the cycle to spit chickens with limits and triggers attack afterward. */
    spitChicken() {
        if (this.shouldAbortSpit()) return;
        this.chickensPerCycle = this.getRandomCycleCount();
        this.chickenCount = 0;
        this.chickenThrowInterval = setInterval(() => {
            if (this.shouldAbortDuringInterval()) {
                this.endSpitInterval();
                return;
            }
            this.spawnSingleChicken();
            if (this.shouldEndCycle()) {
                this.endSpitInterval();
                this.runAttack();
            }
        }, 3500);
    }
    
    /** Checks if chicken spit should not start at all */
    shouldAbortSpit() {
        return (
            this.chickenThrowInterval ||
            this.attackInProgress ||
            this.isDead ||
            this.totalChickensSpawned >= this.maxChickens
        );
    }
    
    /** Checks if chicken spit interval should be stopped mid-cycle */
    shouldAbortDuringInterval() {
        return (
            !this.character ||
            this.isDead ||
            this.attackInProgress ||
            this.totalChickensSpawned >= this.maxChickens
        );
    }
    
    /** Randomizes chicken spawn count per cycle between 3 and 4 */
    getRandomCycleCount() {
        return Math.floor(Math.random() * 2) + 3;
    }
    
    /** Spawns a single BossChicken and increments counters */
    spawnSingleChicken() {
        let chicken = new BossChicken(this.x, this.y + 200);
        chicken.world = this.world;
        this.world.level.enemies.push(chicken);
        this.chickenCount++;
        this.totalChickensSpawned++;
    }
    
    /** Checks if the current spit cycle should end */
    shouldEndCycle() {
        return (
            this.chickenCount >= this.chickensPerCycle ||
            this.totalChickensSpawned >= this.maxChickens
        );
    }
    
    /** Clears the chicken throw interval and resets reference */
    endSpitInterval() {
        clearInterval(this.chickenThrowInterval);
        this.chickenThrowInterval = null;
    }
    
    /** Triggers Endboss death logic, sound, removal, and win condition. */
    die() {
        this.state = 'dead';
        if (this.musicManager && !this.musicManager.isMuted) {
            this.musicManager.playEndBossDeadSound();
        } if (this.chickenThrowInterval) {
            clearInterval(this.chickenThrowInterval);
            this.chickenThrowInterval = null;
        }        
        setTimeout(() => {
            if (!this.world) return;
            this.shouldRemove = true;
            this.world.enemies = this.world.enemies.filter(enemy => enemy !== this);
            if (!this.world.winPopup.isVisible) {
                this.world.uiManager.playerWins();
                this.world.stopGameCompletely();
            }
        }, 2000);
    }
}
