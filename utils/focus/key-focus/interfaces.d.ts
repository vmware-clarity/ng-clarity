export interface FocusableItem {
    tabIndex?: number;
    focus: () => void;
    nativeElement?: HTMLElement;
}
