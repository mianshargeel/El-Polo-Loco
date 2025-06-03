/**
 * Represents the keyboard state for player input.
 * Tracks whether specific keys are currently pressed.
 */
class Keyboard {
    /**
     * Indicates whether the left arrow key (←) is pressed.
     * @type {boolean}
     * @default false
     */
    LEFT = false;

    /**
     * Indicates whether the right arrow key (→) is pressed.
     * @type {boolean}
     * @default false
     */
    RIGHT = false;

    /**
     * Indicates whether the up arrow key (↑) is pressed.
     * @type {boolean}
     * @default false
     */
    UP = false;

    /**
     * Indicates whether the down arrow key (↓) is pressed.
     * @type {boolean}
     * @default false
     */
    DOWN = false;

    /**
     * Indicates whether the spacebar (Jump) is pressed.
     * @type {boolean}
     * @default false
     */
    SPACE = false;

    /**
     * Indicates whether the "D" key (Throw bottle) is pressed.
     * @type {boolean}
     * @default false
     */
    D = false;
}
