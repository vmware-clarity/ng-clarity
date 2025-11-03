import { Observable } from 'rxjs';
import { FocusableItem } from './focusable-item';
export declare class MockFocusableItem implements FocusableItem {
    id: string;
    disabled: boolean;
    up?: FocusableItem | Observable<FocusableItem>;
    down?: FocusableItem | Observable<FocusableItem>;
    left?: FocusableItem | Observable<FocusableItem>;
    right?: FocusableItem | Observable<FocusableItem>;
    constructor(id: string);
    focus(): void;
    blur(): void;
    activate(): void;
}
