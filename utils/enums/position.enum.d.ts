/**
 * A (clockwise) enumeration for positions around an element.
 *
 *     A    B    C
 *  L  ----------- D
 *     |         |
 *     |         |
 *  K  |         | E
 *     |         |
 *     |         |
 *  J  ----------- F
 *    I    H    G
 *
 * TOP_LEFT      = A
 * TOP_CENTER    = B
 * TOP_RIGHT     = C
 * RIGHT_TOP     = D
 * RIGHT_CENTER  = E
 * RIGHT_BOTTOM  = F
 * BOTTOM_RIGHT  = G
 * BOTTOM_CENTER = H
 * BOTTOM_LEFT   = I
 * LEFT_BOTTOM   = J
 * LEFT_CENTER   = K
 * LEFT_TOP      = L
 *
 *
 * Consumers tell us that they want something to display on the TOP_LEFT of the trigger and that they want the
 * _content_ container to anchor/orient AT the bottom left.
 * In order to calculate the position for the content I need to match up the anchor/toggle ClrPosition with the
 * content ClrPosition.
 *
 * Anchor TOP_LEFT **AT** Content BOTTOM_LEFT.
 *     -----------
 *     |         |
 *     |         |
 *     | content |
 *     |         |
 *     |         |
 *     -----------
 *     |/
 *      -----------
 *     |         |
 *     |         |
 *     | trigger |
 *     |         |
 *     |         |
 *     -----------
 *
 */
export declare enum ClrPosition {
    TOP_LEFT = 0,
    TOP_CENTER = 1,
    TOP_RIGHT = 2,
    RIGHT_TOP = 3,
    RIGHT_CENTER = 4,
    RIGHT_BOTTOM = 5,
    BOTTOM_RIGHT = 6,
    BOTTOM_CENTER = 7,
    BOTTOM_LEFT = 8,
    LEFT_BOTTOM = 9,
    LEFT_CENTER = 10,
    LEFT_TOP = 11
}
