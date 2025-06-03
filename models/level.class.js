/**
 * Represents a level in the game.
 * Contains enemies, clouds, and background objects that define the environment.
 */
class Level {
    /**
     * Array of enemy objects present in the level.
     * @type {MoveableObject[]}
     */
    enemies;

    /**
     * Array of cloud objects used as background elements.
     * @type {DrawableObject[]}
     */
    clouds;

    /**
     * Array of background objects like scenery elements.
     * @type {DrawableObject[]}
     */
    backgroundObjects;

    /**
     * The maximum x-coordinate the player can move to (level boundary).
     * @type {number}
     * @default 2200
     */
    level_end_x = 2200; 

    /**
     * Creates a new level instance with specified enemies, clouds, and background objects.
     * @param {MoveableObject[]} enemies - Array of enemy objects.
     * @param {DrawableObject[]} clouds - Array of cloud objects.
     * @param {DrawableObject[]} backgroundObjects - Array of background scenery objects.
     */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}
