/**
 * Represents the Endboss in the game.
 * The Endboss has multiple states: walking, alert, attacking, hurt, and dead.
 * It interacts with Pepe and reacts to bottle hits.
 */
class Endboss extends MoveableObject {
    /**
     * Height of the Endboss.
     * @type {number}
     * @default 400
     */
    height = 400;
    /**
     * Width of the Endboss.
     * @type {number}
     * @default 250
     */
    width = 250;
    /**
     * Vertical position of the Endboss.
     * @type {number}
     * @default 55
     */
    y = 55;
    /**
     * Health points of the Endboss.
     * @type {number}
     * @default 15
     */
    health = 15;
    /**
     * Current state of the Endboss.
     * Can be: 'walking', 'alert', 'attack', 'hurt', or 'dead'.
     * @type {string}
     * @default 'walking'
     */
    state = 'walking';
    /**
     * Indicates whether the Endboss is dead.
     * @type {boolean}
     * @default false
     */
    isDead = false;
    /**
     * Image paths for different animations.
     * @type {string[]}
     */

    ttackCooldown = false;
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

    STATUSBAR_IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue.png',
        'img/7_statusbars/2_statusbar_endboss/green.png',
        'img/7_statusbars/2_statusbar_endboss/orange.png'
    ]
    /**
     * Creates the Endboss with initial attributes.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]); 
        this.preloadImages(this.IMAGES_WALKING);
        this.preloadImages(this.IMAGES_ALERT);
        this.preloadImages(this.IMAGES_ATTACK);
        this.preloadImages(this.IMAGES_HURT);
        this.preloadImages(this.IMAGES_DEAD);
        this.preloadImages(this.STATUSBAR_IMAGES);
        this.x = 2500;
        this.speed = 2;
        this.state = 'walking';
        this.isDead = false;
        this.animate();
        this.maxHealth = 15; 
        this.health = this.maxHealth;
        this.initStatusBar();
    }

    initStatusBar() {
        this.statusBar = new EndbossStatusBar(
            this.maxHealth,
            500,    
            15,  
            200,   
            45,    
            this.STATUSBAR_IMAGES
        );
    }

    updateStatusBar() {
        if (!this.statusBar || !this.character) return;
        const distance = Math.abs(this.x - this.character.x);
        if (distance < 600 && !this.isDead) {
            this.statusBar.show();
        } else {
            this.statusBar.hide();
        }
        this.statusBar.update(this.health);
    }
    /**
     * Sets the character reference for tracking Pepe's position.
     * @param {Character} character - The player character (Pepe).
     */
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
    /**
     * Handles animation, movement, and state updates.
     */
    animate() {
        setInterval(() => {
            this.updateState();
            this.move();
            this.playAnimation(this.getAnimation());
            this.updateStatusBar();
        }, 100);
    }
    /**
     * Moves the Endboss based on its current state.
     */
    move() {
        if (this.state === 'walking') {
            this.moveLeft();
        } else if ((this.state === 'alert') && !this.attackInProgress) {
            this.moveTowardPepe();
        }
    }
    /**
     * Moves the Endboss left or reverses direction when reaching limits.
     */
    moveLeft() {
        this.x -= this.speed;
        if (this.x < 2000 || this.x > 2500) {
            this.speed = -this.speed;
        }
    }
    /**
     * Moves the Endboss toward Pepe when alert or attacking.
     */
    moveTowardPepe() {
        if (this.x > this.character.x) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }
    /**
     * Updates the Endboss's state based on health, attacks, and distance from Pepe.
     */
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
    /**
     * Returns the correct animation array based on the Endboss's state.
     * @returns {string[]} - Array of image paths for the current animation.
     */
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
    /**
     * Checks if the Endboss is currently hurt.
     * @returns {boolean} - `true` if the Endboss is hurt, `false` otherwise.
     */
    isHurt() {
        return this.state === 'hurt' && this.lastHurtTime + 500 > Date.now();
    }
    /**
     * Determines if the Endboss is in attacking range of Pepe.
     * @returns {boolean} - `true` if in attack range, `false` otherwise.
     */
    isAttacking() {
        if (!this.character) return false;
        return Math.abs(this.x - this.character.x) < 200;
    }
    /**
     * Determines if the Endboss should be in an alert state.
     * @returns {boolean} - `true` if Pepe is nearby, `false` otherwise.
     */
    isAlert() {
        if (!this.character) return false;
        return Math.abs(this.x - this.character.x) < 400;
    }

    canStartAttack() {
        return (
            !this.attackCooldown &&
            !this.attackInProgress &&
            this.character &&
            Math.abs(this.x - this.character.x) < 200
        );
    }

    canStartSpitting() {
        return (
            !this.attackCooldown &&
            !this.attackInProgress &&
            !this.chickenThrowInterval &&
            this.character &&
            Math.abs(this.x - this.character.x) < 400
        );
    }
    /**
     * Reduces the Endboss's health when hit and updates its state.
     * @param {number} damage - Amount of damage taken.
     */
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

    spitChicken() {
        if (this.chickenThrowInterval || this.attackInProgress || this.isDead) return;
        this.chickenCount = 0;
        this.chickenThrowInterval = setInterval(() => {
            if (!this.character || this.isDead || this.attackInProgress) return;
            let chicken = new BossChicken(this.x, this.y + 200);
            chicken.world = this.world; 
            this.world.level.enemies.push(chicken);
            this.chickenCount++;
            if (this.chickenCount >= this.chickensPerCycle) {
                clearInterval(this.chickenThrowInterval);
                this.chickenThrowInterval = null;
                this.runAttack(); 
            }
        }, 3500); 
    }
    /**
     * Handles the Endboss's death, removing it from the world and triggering win conditions.
     */
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
            if (!this.world.winPopup.isVisible) { this.world.uiManager.playerWins(); }
        }, 2000);
    }
}
