import { Renderer2 } from '@angular/core';
import { ClrPopoverToggleService } from '../../utils';
import { FocusService } from '../../utils/focus/focus.service';
import { InitialFocus } from './button-group-focus.enum';
import * as i0 from "@angular/core";
export declare class ButtonGroupFocusHandler {
    private focusService;
    private toggleService;
    private renderer;
    initialFocus: InitialFocus;
    private menu;
    private menuToggle;
    private buttons;
    private _unlistenFuncs;
    constructor(focusService: FocusService, toggleService: ClrPopoverToggleService, renderer: Renderer2);
    ngOnDestroy(): void;
    initialize({ menu, menuToggle }: {
        menu: HTMLElement;
        menuToggle: HTMLElement;
    }): void;
    private resetButtonsFocus;
    private listenToKeys;
    private closeMenu;
    private linkButtons;
    private focusFirstItem;
    private focusLastItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonGroupFocusHandler, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonGroupFocusHandler>;
}
export declare const BUTTON_GROUP_FOCUS_HANDLER_PROVIDER: {
    provide: typeof ButtonGroupFocusHandler;
};
