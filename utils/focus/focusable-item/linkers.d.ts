import { Observable } from 'rxjs';
import { ArrowKeyDirection } from '../arrow-key-direction.enum';
import { FocusableItem } from './focusable-item';
export declare class Linkers {
    /**
     * Links a set of focusable items to a parent along one direction
     */
    static linkParent(items: FocusableItem[], parent: FocusableItem | Observable<FocusableItem>, direction: ArrowKeyDirection): void;
    /**
     * Double-links a set of focusable items vertically, possibly looping
     */
    static linkVertical(items: FocusableItem[], loop?: boolean): void;
}
