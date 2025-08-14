import { OnDestroy, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { FocusService } from '../../../utils/focus/focus.service';
import { FocusableItem } from '../../../utils/focus/focusable-item/focusable-item';
import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
import * as i0 from "@angular/core";
export declare class DropdownFocusHandler implements OnDestroy, FocusableItem {
    private renderer;
    private parent;
    private toggleService;
    private focusService;
    private platformId;
    id: string;
    focusBackOnTriggerWhenClosed: boolean;
    right?: Observable<FocusableItem>;
    down?: Observable<FocusableItem>;
    up?: Observable<FocusableItem>;
    private _trigger;
    private _container;
    private children;
    private _unlistenFuncs;
    constructor(renderer: Renderer2, parent: DropdownFocusHandler, toggleService: ClrPopoverToggleService, focusService: FocusService, platformId: any);
    get trigger(): HTMLElement;
    set trigger(el: HTMLElement);
    get container(): HTMLElement;
    set container(el: HTMLElement);
    ngOnDestroy(): void;
    /**
     * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
     */
    moveToFirstItemWhenOpen(): void;
    /**
     * Focus on the menu when it opens, and focus back on the root trigger when the whole dropdown becomes closed
     */
    handleRootFocus(): void;
    focus(): void;
    blur(): void;
    activate(): void;
    resetChildren(): void;
    addChildren(children: FocusableItem[]): void;
    private openAndGetChildren;
    private closeAndGetThis;
    static ɵfac: i0.ɵɵFactoryDeclaration<DropdownFocusHandler, [null, { optional: true; skipSelf: true; }, null, null, null]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DropdownFocusHandler>;
}
export declare const DROPDOWN_FOCUS_HANDLER_PROVIDER: (import("@angular/core").Type<DropdownFocusHandler> | {
    provide: typeof FocusableItem;
    useExisting: import("@angular/core").Type<DropdownFocusHandler>;
})[];
