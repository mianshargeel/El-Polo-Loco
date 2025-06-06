/**
 * Represents a throwable bottle in the game.
 * Bottles follow a projectile motion and can damage or kill enemies on impact.
 * Extends `MoveableObject` to allow movement and gravity effects.
 */
class ThrowableObject extends MoveableObject {
    /**
     * Creates a new throwable bottle instance.
     * The bottle is thrown immediately upon creation.
     * @param {number} x - The x-coordinate where the bottle is thrown.
     * @param {number} y - The y-coordinate where the bottle is thrown.
     */
    constructor(x, y, throwLeft) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60; 
        this.width = 40; 
        this.throw(); 
        this.throwLeft = throwLeft;
    }

    /**
     * Applies the bottle's throwing motion.
     * Moves the bottle forward in a parabolic arc using gravity.
     */
    throw() {
        this.speedY = 30; 
        this.applyGravity();

        /**
         * Moves the bottle forward at a fixed speed.
         * Runs every 25 milliseconds to simulate motion.
         */
        this.throwInterval = setInterval(() => {
            this.x += this.throwLeft ? -10 : 10;
        }, 25);
    }
    
}
