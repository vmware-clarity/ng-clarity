import { ElementRef, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClrFocusDirection } from './enums/focus-direction.enum';
import { FocusableItem } from './interfaces';
import { ClrKeyFocusItem } from './key-focus-item';
import * as i0 from "@angular/core";
export declare class ClrKeyFocus {
    private elementRef;
    direction: ClrFocusDirection | string;
    focusOnLoad: boolean;
    protected clrKeyFocusItems: QueryList<ClrKeyFocusItem>;
    protected subscriptions: Subscription[];
    private focusChange;
    private _current;
    private _focusableItems;
    constructor(elementRef: ElementRef<HTMLElement>);
    /**
     * Here we use `any` cause any other type require reworking all methods below and a lot of more ifs.
     * this method will only work with array with FocusableItems anyway so any other value will be ignored.
     */
    get focusableItems(): Array<FocusableItem> | any;
    set focusableItems(elements: Array<FocusableItem> | any);
    get nativeElement(): HTMLElement;
    get current(): number;
    set current(value: number);
    get currentItem(): any;
    get currentItemElement(): HTMLElement;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    handleKeyboardEvent(event: KeyboardEvent): void;
    setClickedItemCurrent(event: any): void;
    focusCurrent(): void;
    moveTo(position: number): void;
    protected positionInRange(position: number): boolean;
    protected currentFocusIsNotFirstItem(): boolean;
    protected currentFocusIsNotLastItem(): boolean;
    protected initializeFocus(): void;
    protected nextKeyPressed(event: KeyboardEvent): boolean;
    protected prevKeyPressed(event: KeyboardEvent): boolean;
    private getItemPosition;
    private listenForItemUpdates;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrKeyFocus, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrKeyFocus, "[clrKeyFocus]", never, { "direction": "clrDirection"; "focusOnLoad": "clrFocusOnLoad"; "focusableItems": "clrKeyFocus"; }, { "focusChange": "clrFocusChange"; }, ["clrKeyFocusItems"], ["*"], false, never>;
}
