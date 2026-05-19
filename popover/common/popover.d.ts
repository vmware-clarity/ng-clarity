import { Observable } from 'rxjs';
import { PopoverOptions } from './popover-options.interface';
export declare enum Point {
    RIGHT_CENTER = 0,
    RIGHT_TOP = 1,
    RIGHT_BOTTOM = 2,
    TOP_CENTER = 3,
    TOP_RIGHT = 4,
    TOP_LEFT = 5,
    BOTTOM_CENTER = 6,
    BOTTOM_RIGHT = 7,
    BOTTOM_LEFT = 8,
    LEFT_CENTER = 9,
    LEFT_TOP = 10,
    LEFT_BOTTOM = 11
}
export declare class Popover {
    private element;
    private _scroll;
    private boundOnScrollListener;
    private scrollableElements;
    constructor(element: any);
    anchor(anchor: any, anchorAlign: Point, popoverAlign: Point, { offsetX, offsetY, useAnchorParent }?: PopoverOptions): Observable<any>;
    release(): void;
    private isPositioned;
    private emitScrollEvent;
    private addScrollEventListeners;
    private removeScrollEventListeners;
    private scrolls;
}
