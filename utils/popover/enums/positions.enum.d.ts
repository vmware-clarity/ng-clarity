import { ClrAlignment } from './alignment.enum';
import { ClrAxis } from './axis.enum';
import { ClrSide } from './side.enum';
interface ClrPopoverPositionsInterface {
    axis: ClrAxis;
    side: ClrSide;
    anchor: ClrAlignment;
    content: ClrAlignment;
}
export interface ClrPopoverPositions {
    [key: string]: any;
}
export declare class ClrPopoverPositions {
    static 'top-right': ClrPopoverPositionsInterface;
    static 'top-left': ClrPopoverPositionsInterface;
    static 'bottom-right': ClrPopoverPositionsInterface;
    static 'bottom-left': ClrPopoverPositionsInterface;
    static 'right-top': ClrPopoverPositionsInterface;
    static 'right-bottom': ClrPopoverPositionsInterface;
    static 'left-top': ClrPopoverPositionsInterface;
    static 'left-bottom': ClrPopoverPositionsInterface;
}
export {};
