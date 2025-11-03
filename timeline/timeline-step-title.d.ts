/**
 * Note: Why does this component have aria-hidden attribute?
 *
 * tl;dr: we want screen readers to ignore this element when its reading out to blind users.
 *
 * In order to make a timeline step accessible to screen readers we need the title read out before the
 * icon. In order to do this, ClrTimeLine step has a ContentChild that queries for the ClrTimelineStepTitle and
 * then adds the projected text into a .clr-sr-only element that is a sibling element to the icon. See the
 * ClrTimlineStep template for the DOM structure.
 */
export declare class ClrTimelineStepTitle {
}
