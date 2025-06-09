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
    health = 12;

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
        this.musicManager = new MusicManager();

        this.maxHealth = 12; // Add this line
        this.health = this.maxHealth;
        this.initStatusBar();
    }

    initStatusBar() {
        this.statusBar = new EndbossStatusBar(
            this.maxHealth,
            canvas.width - 170,  // x position (top-right)
            10,                   // y position
            150,                  // width
            50,                   // height
            this.STATUSBAR_IMAGES
        );
        this.statusBar.hide(); // Initially hidden
    }

    updateStatusBar() {
        if (this.statusBar) {
            this.statusBar.update(this.health);
        }
    }

    /**
     * Sets the character reference for tracking Pepe's position.
     * @param {Character} character - The player character (Pepe).
     */
    setCharacter(character) {
        this.character = character;
        // Show status bar when character is set (when Endboss is activated)
        if (this.statusBar) {
            this.statusBar.show();
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
        } else if (this.state === 'alert' || this.state === 'attack') {
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
            this.musicManager.playEndBossHurtSound();
        } else if (this.isAttacking()) {
            this.state = 'attack';
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
    
        if (this.health <= 0) {
            this.die();
            if (this.statusBar) {
                this.statusBar.update(0); // Set to empty
                setTimeout(() => this.statusBar.hide(), 1000); // Hide after a delay
            }
        }
    }

    /**
     * Handles the Endboss's death, removing it from the world and triggering win conditions.
     */
    die() {
        this.state = 'dead';
        setTimeout(() => {
            if (!this.world) return;

            this.shouldRemove = true;
            this.musicManager.playEndBossDeadSound();
            this.world.enemies = this.world.enemies.filter(enemy => enemy !== this);

            if (!this.world.winPopup.isVisible) {
                this.world.playerWins();
            }
        }, 2000);
    }
}
