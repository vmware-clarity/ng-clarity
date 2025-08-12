import { Observable } from 'rxjs';
export declare abstract class FocusableItem {
    id: string;
    disabled?: boolean;
    up?: FocusableItem | Observable<FocusableItem>;
    down?: FocusableItem | Observable<FocusableItem>;
    left?: FocusableItem | Observable<FocusableItem>;
    right?: FocusableItem | Observable<FocusableItem>;
    abstract focus(): void;
    abstract blur(): void;
    abstract activate?(): void;
}
