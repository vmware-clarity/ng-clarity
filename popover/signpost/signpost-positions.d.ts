import { Point } from '../common/popover';
export interface Position {
    anchorPoint: Point;
    popoverPoint: Point;
    offsetY: number;
    offsetX: number;
}
export declare const SIGNPOST_POSITIONS: {
    [input: string]: Position;
};
