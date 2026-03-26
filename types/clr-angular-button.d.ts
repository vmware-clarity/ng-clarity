import * as i0 from '@angular/core';
import { ElementRef, EventEmitter, Renderer2, Type, TemplateRef, AfterContentInit, AfterViewInit, QueryList } from '@angular/core';
import { LoadingListener, ClrLoadingState, FocusService, ClrCommonStringsService, ClrDestroyService } from '@clr/angular/utils';
import * as i2 from '@angular/common';
import { RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverService, ClrPopoverType, ClrPopoverPosition } from '@clr/angular/popover/common';
import * as i4 from '@clr/angular/icon';

declare class ClrLoadingButton implements LoadingListener {
    el: ElementRef<HTMLButtonElement>;
    private renderer;
    disabled: boolean;
    clrLoadingChange: EventEmitter<ClrLoadingState>;
    buttonState: typeof ClrLoadingState;
    state: ClrLoadingState;
    constructor(el: ElementRef<HTMLButtonElement>, renderer: Renderer2);
    loadingStateChange(state: ClrLoadingState): void;
    private setExplicitButtonWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoadingButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrLoadingButton, "button[clrLoading]", never, { "disabled": { "alias": "disabled"; "required": false; }; }, { "clrLoadingChange": "clrLoadingChange"; }, never, ["*"], false, never>;
}

declare const CLR_LOADING_BUTTON_DIRECTIVES: Type<any>[];
declare class ClrLoadingButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoadingButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrLoadingButtonModule, [typeof ClrLoadingButton], [typeof i2.CommonModule], [typeof ClrLoadingButton]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrLoadingButtonModule>;
}

declare class ButtonInGroupService {
    private _changes;
    get changes(): Observable<ClrButton>;
    updateButtonGroup(button: ClrButton): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonInGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonInGroupService>;
}

declare class ClrButton implements LoadingListener {
    private readonly routerLinkActive;
    buttonInGroupService: ButtonInGroupService;
    _click: EventEmitter<boolean>;
    routerLinkActiveClasses: string;
    templateRef: TemplateRef<ClrButton>;
    loading: boolean;
    private _inMenu;
    private _enableService;
    private _classNames;
    private _name;
    private _type;
    private _disabled;
    private _id;
    constructor(routerLinkActive: RouterLinkActive, buttonInGroupService: ButtonInGroupService);
    get inMenu(): boolean;
    set inMenu(value: boolean);
    get classNames(): string;
    set classNames(value: string);
    get name(): string;
    set name(value: string);
    get type(): string;
    set type(value: string);
    get id(): string;
    set id(value: string);
    get disabled(): any;
    set disabled(value: any);
    get role(): string;
    ngAfterViewInit(): void;
    loadingStateChange(state: ClrLoadingState): void;
    emitClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButton, [{ optional: true; }, { optional: true; skipSelf: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrButton, "clr-button", never, { "routerLinkActiveClasses": { "alias": "routerLinkActive"; "required": false; }; "inMenu": { "alias": "clrInMenu"; "required": false; }; "classNames": { "alias": "class"; "required": false; }; "name": { "alias": "name"; "required": false; }; "type": { "alias": "type"; "required": false; }; "id": { "alias": "id"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "_click": "click"; }, never, ["*"], false, never>;
}

declare enum InitialFocus {
    FIRST_ITEM = "first",
    LAST_ITEM = "last"
}

declare class ButtonGroupFocusHandler {
    private focusService;
    private popoverService;
    private renderer;
    initialFocus: InitialFocus;
    private menu;
    private menuToggle;
    private buttons;
    private _unlistenFuncs;
    constructor(focusService: FocusService, popoverService: ClrPopoverService, renderer: Renderer2);
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

declare class ClrButtonGroup implements AfterContentInit, AfterViewInit {
    buttonGroupNewService: ButtonInGroupService;
    private popoverService;
    commonStrings: ClrCommonStringsService;
    private destroy$;
    private focusHandler;
    clrToggleButtonAriaLabel: string;
    menuToggle: ElementRef<HTMLElement>;
    menu: ElementRef<HTMLElement>;
    buttons: QueryList<ClrButton>;
    popoverId: string;
    InitialFocus: typeof InitialFocus;
    inlineButtons: ClrButton[];
    menuButtons: ClrButton[];
    protected popoverType: ClrPopoverType;
    private _menuPosition;
    constructor(buttonGroupNewService: ButtonInGroupService, popoverService: ClrPopoverService, commonStrings: ClrCommonStringsService, destroy$: ClrDestroyService, focusHandler: ButtonGroupFocusHandler);
    get menuPosition(): ClrPopoverPosition;
    set menuPosition(pos: ClrPopoverPosition | string);
    get open(): boolean;
    /**
     * 1. Initializes the initial Button Group View
     * 2. Subscribes to changes on the ContentChildren
     *    in case the user content projection changes
     */
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    /**
     * Moves the button into the other ViewContainer
     * when an update is received.
     *
     * @param button
     */
    rearrangeButton(button: ClrButton): void;
    openMenu(event: Event, initialFocus: InitialFocus): void;
    /**
     * Author: Eudes
     *
     * Finds the order of a button w.r.t other buttons
     *
     * @param buttonToMove
     * @returns
     */
    getMoveIndex(buttonToMove: ClrButton): number;
    initializeButtons(): void;
    private handleFocusOnMenuOpen;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButtonGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrButtonGroup, "clr-button-group", never, { "clrToggleButtonAriaLabel": { "alias": "clrToggleButtonAriaLabel"; "required": false; }; "menuPosition": { "alias": "clrMenuPosition"; "required": false; }; }, {}, ["buttons"], never, false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare const CLR_BUTTON_GROUP_DIRECTIVES: Type<any>[];
declare class ClrButtonGroupModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButtonGroupModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrButtonGroupModule, [typeof ClrButton, typeof ClrButtonGroup], [typeof i2.CommonModule, typeof i4.ClrIcon, typeof i1.ClrPopoverModuleNext], [typeof ClrButton, typeof ClrButtonGroup]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrButtonGroupModule>;
}

declare class ClrButtonModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrButtonModule, never, never, [typeof ClrLoadingButtonModule, typeof ClrButtonGroupModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrButtonModule>;
}

export { CLR_BUTTON_GROUP_DIRECTIVES, CLR_LOADING_BUTTON_DIRECTIVES, ClrButton, ClrButtonGroup, ClrButtonGroupModule, ClrButtonModule, ClrLoadingButton, ClrLoadingButtonModule };
