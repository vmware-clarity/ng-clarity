import { ClrAlignment } from '../enums/alignment.enum';
import { ClrAxis } from '../enums/axis.enum';
import { ClrSide } from '../enums/side.enum';
/**
 * ClrPopoverPosition
 *
 * @description
 * A ClrPopover needs a way to describe the relationship between the anchor and the content (for when its
 * visible). The ClrPopoverPosition interface is that description.
 */
export interface ClrPopoverPosition {
    axis: ClrAxis;
    side: ClrSide;
    anchor: ClrAlignment;
    content: ClrAlignment;
}
