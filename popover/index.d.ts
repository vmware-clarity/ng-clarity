import * as i0 from '@angular/core';
import { OnDestroy, Renderer2, ChangeDetectorRef, AfterContentInit, QueryList, ElementRef, Type, AfterViewInit, ViewContainerRef, TemplateRef, NgZone, OnInit, InjectionToken, EventEmitter } from '@angular/core';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverService as ClrPopoverService$1, ClrPopoverContent as ClrPopoverContent$1, ClrPopoverPosition as ClrPopoverPosition$1 } from '@clr/angular/popover/common';
import * as i7 from '@clr/angular/utils';
import { FocusableItem, FocusService, ClrPosition, ClrCommonStringsService } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i5 from '@angular/common';
import * as i6 from '@clr/angular/icon';
import { ConnectedPosition, OverlayContainer, Overlay } from '@angular/cdk/overlay';
import * as i1$1 from '@clr/angular/popover/dropdown';
import * as i2 from '@clr/angular/popover/signpost';
import * as i3 from '@clr/angular/popover/tooltip';

declare class DropdownFocusHandler implements OnDestroy, FocusableItem {
    private renderer;
    private parent;
    private popoverService;
    private focusService;
    private platformId;
    id: string;
    right?: Observable<FocusableItem>;
    down?: Observable<FocusableItem>;
    up?: Observable<FocusableItem>;
    private _trigger;
    private _container;
    private children;
    private _unlistenFuncs;
    constructor(renderer: Renderer2, parent: DropdownFocusHandler, popoverService: ClrPopoverService$1, focusService: FocusService, platformId: any);
    get trigger(): HTMLElement;
    set trigger(el: HTMLElement);
    get container(): HTMLElement;
    set container(el: HTMLElement);
    ngOnDestroy(): void;
    /**
     * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
     */
    moveToFirstItemWhenOpen(): void;
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

declare class RootDropdownService {
    private _changes;
    get changes(): Observable<boolean>;
    closeMenus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RootDropdownService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RootDropdownService>;
}

declare class ClrDropdown implements OnDestroy {
    parent: ClrDropdown;
    popoverService: ClrPopoverService$1;
    focusHandler: DropdownFocusHandler;
    isMenuClosable: boolean;
    private subscriptions;
    constructor(parent: ClrDropdown, popoverService: ClrPopoverService$1, focusHandler: DropdownFocusHandler, cdr: ChangeDetectorRef, dropdownService: RootDropdownService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdown, [{ optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdown, "clr-dropdown", never, { "isMenuClosable": { "alias": "clrCloseMenuOnItemClick"; "required": false; }; }, {}, never, ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrDropdownMenu implements AfterContentInit, OnDestroy {
    private focusHandler;
    private elementRef;
    private popoverService;
    private popoverContent;
    items: QueryList<FocusableItem>;
    constructor(parentHost: ElementRef<HTMLElement>, nested: ClrDropdownMenu, focusHandler: DropdownFocusHandler, elementRef: ElementRef, popoverService: ClrPopoverService$1, popoverContent: ClrPopoverContent$1);
    get isOffScreen(): boolean;
    set position(position: string | ClrPopoverPosition$1);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownMenu, [{ optional: true; }, { optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdownMenu, "clr-dropdown-menu", never, { "position": { "alias": "clrPosition"; "required": false; }; }, {}, ["items"], ["*"], false, [{ directive: typeof i1.ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare class ClrDropdownTrigger {
    private popoverService;
    isRootLevelToggle: boolean;
    constructor(dropdown: ClrDropdown, popoverService: ClrPopoverService$1, el: ElementRef<HTMLElement>, focusHandler: DropdownFocusHandler);
    get active(): boolean;
    onDropdownTriggerClick(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDropdownTrigger, "[clrDropdownTrigger],[clrDropdownToggle]", never, {}, {}, never, never, false, never>;
}

declare class ClrDropdownItem {
    private dropdown;
    private _dropdownService;
    private focusableItem;
    private el;
    private renderer;
    constructor(dropdown: ClrDropdown, _dropdownService: RootDropdownService, focusableItem: FocusableItem, el: ElementRef, renderer: Renderer2);
    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    /**
     * Let you overwrite the focusable auto increment id.
     */
    get dropdownItemId(): string;
    set dropdownItemId(value: string);
    private onDropdownItemClick;
    private onSpaceKeydown;
    private onEnterKeydown;
    private stopImmediatePropagationIfDisabled;
    private findRootDropdown;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownItem, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDropdownItem, "[clrDropdownItem]", never, { "disabled": { "alias": "clrDisabled"; "required": false; }; "dropdownItemId": { "alias": "id"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_MENU_POSITIONS: string[];

declare const CLR_DROPDOWN_DIRECTIVES: Type<any>[];
declare class ClrDropdownModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDropdownModule, [typeof ClrDropdown, typeof ClrDropdownMenu, typeof ClrDropdownTrigger, typeof ClrDropdownItem], [typeof i5.CommonModule, typeof i6.ClrIcon, typeof i1.ClrIfOpen], [typeof ClrDropdown, typeof ClrDropdownMenu, typeof ClrDropdownTrigger, typeof ClrDropdownItem, typeof i1.ClrIfOpen, typeof i6.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDropdownModule>;
}

declare enum ClrPopoverType {
    SIGNPOST = 0,
    TOOLTIP = 1,
    DROPDOWN = 2,
    DEFAULT = 3
}
declare enum ClrPopoverPosition {
    TOP_RIGHT = "top-right",
    TOP_MIDDLE = "top-middle",
    TOP_LEFT = "top-left",
    RIGHT = "right",
    RIGHT_TOP = "right-top",
    RIGHT_MIDDLE = "right-middle",
    RIGHT_BOTTOM = "right-bottom",
    LEFT = "left",
    LEFT_TOP = "left-top",
    LEFT_MIDDLE = "left-middle",
    LEFT_BOTTOM = "left-bottom",
    BOTTOM_RIGHT = "bottom-right",
    BOTTOM_MIDDLE = "bottom-middle",
    BOTTOM_LEFT = "bottom-left"
}
declare const TOOLTIP_POSITIONS: ClrPopoverPosition[];
declare const DROPDOWN_POSITIONS: ClrPopoverPosition[];
declare const SIGNPOST_POSITIONS: ClrPopoverPosition[];
declare function getPositionsArray(type: ClrPopoverType): ClrPopoverPosition[];
declare function getConnectedPositions(type: ClrPopoverType): ConnectedPosition[];
declare function mapPopoverKeyToPosition(key: ClrPopoverPosition, type: ClrPopoverType): ConnectedPosition;
declare function getAnchorPosition(key: ClrPosition): Partial<ConnectedPosition>;
declare function getContentPosition(key: ClrPosition): Partial<ConnectedPosition>;

declare class ClrPopoverService {
    anchorElementRef: ElementRef<HTMLElement>;
    closeButtonRef: ElementRef;
    panelClass: string[];
    private _open;
    private _openChange;
    private _openEvent;
    private _openEventChange;
    private _positionChange;
    private _resetPositions;
    private _updatePosition;
    private _popoverVisible;
    get openChange(): Observable<boolean>;
    get popoverVisible(): Observable<boolean>;
    get openEvent(): Event;
    set openEvent(event: Event);
    get open(): boolean;
    set open(value: boolean);
    get resetPositionsChange(): Observable<void>;
    positionChange(position: ClrPopoverPosition): void;
    updatePositionChange(): Observable<void>;
    getPositionChange(): Observable<string>;
    getEventChange(): Observable<Event>;
    /**
     * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
     * This is for instance the case of components that open on a click, but close on a click outside.
     */
    toggleWithEvent(event: any): void;
    popoverVisibleEmit(visible: boolean): void;
    resetPositions(): void;
    updatePosition(): void;
    focusCloseButton(): void;
    focusAnchor(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrPopoverService>;
}

/** @dynamic */
declare class ClrPopoverContent implements OnDestroy, AfterViewInit {
    private container;
    private template;
    private parent;
    private overlay;
    private popoverService;
    private zone;
    private platformId;
    private _outsideClickClose;
    private _scrollToClose;
    private view;
    private elementRef;
    private overlayRef;
    private popoverType;
    private _availablePositions;
    private _position;
    private scrollableParents;
    private subscriptions;
    private openCloseSubscription;
    private domPortal;
    private preferredPositionIsSet;
    private availablePositionsAreSet;
    private _preferredPosition;
    private intersectionObserver;
    constructor(element: ElementRef, container: ViewContainerRef, template: TemplateRef<any>, overlayContainer: OverlayContainer, parent: ClrPopoverContent, overlay: Overlay, popoverService: ClrPopoverService, zone: NgZone, platformId: any);
    set open(value: boolean);
    get contentAt(): string | ClrPopoverPosition | ConnectedPosition;
    set contentAt(position: string | ClrPopoverPosition | ConnectedPosition);
    set availablePositions(positions: ConnectedPosition[]);
    set contentType(type: ClrPopoverType);
    get outsideClickClose(): boolean;
    set outsideClickClose(clickToClose: boolean);
    get scrollToClose(): boolean;
    set scrollToClose(scrollToClose: boolean);
    private get positionStrategy();
    private get preferredPosition();
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private _createOverlayRef;
    private resetPosition;
    private closePopover;
    private showOverlay;
    private removeOverlay;
    private getScrollableParents;
    /**
     * Uses IntersectionObserver to detect when the anchor leaves the screen.
     * This handles the "Close on Scroll" logic much cheaper than getBoundingClientRect.
     */
    private setupIntersectionObserver;
    private listenToMouseEvents;
    private getRootPopover;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverContent, [null, null, { optional: true; }, null, { optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverContent, "[clrPopoverContent]", never, { "open": { "alias": "clrPopoverContent"; "required": false; }; "contentAt": { "alias": "clrPopoverContentAt"; "required": false; }; "availablePositions": { "alias": "clrPopoverContentAvailablePositions"; "required": false; }; "contentType": { "alias": "clrPopoverContentType"; "required": false; }; "outsideClickClose": { "alias": "clrPopoverContentOutsideClickToClose"; "required": false; }; "scrollToClose": { "alias": "clrPopoverContentScrollToClose"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrPopoverAnchor {
    constructor(popoverService: ClrPopoverService, element: ElementRef<HTMLButtonElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverAnchor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverAnchor, "[clrPopoverAnchor]", never, {}, {}, never, never, false, never>;
}

declare class ClrStopEscapePropagationDirective implements OnInit, OnDestroy {
    private popoverService;
    private subscription;
    private lastOpenChange;
    constructor(popoverService: ClrPopoverService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onEscapeKey(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStopEscapePropagationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStopEscapePropagationDirective, never, never, {}, {}, never, never, true, never>;
}

declare class ClrPopoverHostDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverHostDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverHostDirective, never, never, {}, {}, never, never, true, [{ directive: typeof ClrStopEscapePropagationDirective; inputs: {}; outputs: {}; }]>;
}

declare const POPOVER_HOST_ANCHOR: InjectionToken<ElementRef<any>>;

/**********
 *
 * @class ClrIfOpen
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: ClrPopoverService to maintain state between itself and the component
 * using it in the component template.
 *
 */
declare class ClrIfOpen implements OnDestroy {
    private popoverService;
    private template;
    private container;
    static ngAcceptInputType_open: boolean | '';
    /**********
     * @property openChange
     *
     * @description
     * An event emitter that emits when the open property is set to allow for 2way binding when the directive is
     * used with de-structured / de-sugared syntax.
     */
    openChange: EventEmitter<boolean>;
    private subscriptions;
    constructor(popoverService: ClrPopoverService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @description
     * A property that gets/sets ClrPopoverService.open with value.
     */
    get open(): boolean | string;
    set open(value: boolean | string);
    ngOnDestroy(): void;
    /**
     * @description
     * Function that takes a boolean value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     *
     * @param value
     */
    updateView(value: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfOpen, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfOpen, "[clrIfOpen]", never, { "open": { "alias": "clrIfOpen"; "required": false; }; }, { "openChange": "clrIfOpenChange"; }, never, never, true, never>;
}

declare class ClrPopoverCloseButton implements OnDestroy, AfterViewInit {
    private elementRef;
    private popoverService;
    closeChange: EventEmitter<void>;
    private subscriptions;
    constructor(elementRef: ElementRef<HTMLButtonElement>, popoverService: ClrPopoverService);
    handleClick(event: MouseEvent): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverCloseButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverCloseButton, "[clrPopoverCloseButton]", never, {}, { "closeChange": "clrPopoverOnCloseChange"; }, never, never, false, never>;
}

declare class ClrPopoverOpenCloseButton implements OnDestroy {
    private popoverService;
    openCloseChange: EventEmitter<boolean>;
    private subscriptions;
    constructor(popoverService: ClrPopoverService);
    handleClick(event: MouseEvent): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverOpenCloseButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverOpenCloseButton, "[clrPopoverOpenCloseButton]", never, {}, { "openCloseChange": "clrPopoverOpenCloseChange"; }, never, never, false, never>;
}

declare class ClrPopoverModuleNext {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverModuleNext, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPopoverModuleNext, [typeof ClrPopoverAnchor, typeof ClrPopoverCloseButton, typeof ClrPopoverOpenCloseButton], [typeof ClrPopoverContent, typeof ClrIfOpen], [typeof ClrPopoverAnchor, typeof ClrPopoverCloseButton, typeof ClrPopoverOpenCloseButton, typeof ClrPopoverContent, typeof ClrIfOpen]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPopoverModuleNext>;
}

declare class ClrPopoverModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPopoverModule, never, never, [typeof i1$1.ClrDropdownModule, typeof i2.ClrSignpostModule, typeof i3.ClrTooltipModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPopoverModule>;
}

declare class SignpostFocusManager {
    private _triggerEl;
    set triggerEl(value: HTMLElement);
    focusTrigger(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SignpostFocusManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SignpostFocusManager>;
}

declare class SignpostIdService {
    private _id;
    get id(): Observable<string>;
    setId(id: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SignpostIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SignpostIdService>;
}

declare class ClrSignpostTrigger implements OnDestroy {
    private popoverService;
    private el;
    private signpostIdService;
    private signpostFocusManager;
    private platformId;
    ariaExpanded: boolean;
    ariaControl: string;
    isOpen: boolean;
    private document;
    private subscriptions;
    constructor(popoverService: ClrPopoverService$1, el: ElementRef<HTMLElement>, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, document: any, platformId: any);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**********
     *
     * @description
     * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
     */
    onSignpostTriggerClick(event: Event): void;
    private focusOnClose;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrSignpostTrigger, "[clrSignpostTrigger]", never, {}, {}, never, never, false, never>;
}

declare class ClrSignpost {
    commonStrings: ClrCommonStringsService;
    /**********
     * @property useCustomTrigger
     *
     * @description
     * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
     *
     */
    useCustomTrigger: boolean;
    signpostTriggerAriaLabel: string;
    constructor(commonStrings: ClrCommonStringsService);
    /**********
     * @property signPostTrigger
     *
     * @description
     * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
     *
     */
    set customTrigger(trigger: ClrSignpostTrigger);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpost, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpost, "clr-signpost", never, { "signpostTriggerAriaLabel": { "alias": "clrSignpostTriggerAriaLabel"; "required": false; }; }, {}, ["customTrigger"], ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrSignpostContent implements OnDestroy, AfterViewInit {
    private element;
    commonStrings: ClrCommonStringsService;
    private signpostFocusManager;
    private platformId;
    private document;
    private popoverService;
    private popoverContent;
    signpostCloseAriaLabel: string;
    closeButton: ElementRef<HTMLButtonElement>;
    signpostContentId: string;
    private _position;
    constructor(parentHost: ElementRef<HTMLElement>, element: ElementRef, commonStrings: ClrCommonStringsService, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, platformId: any, document: Document, popoverService: ClrPopoverService$1, popoverContent: ClrPopoverContent$1);
    /*********
     *
     * @description
     * A setter for the position of the ClrSignpostContent popover. This is a combination of the following:
     * - anchorPoint - where on the trigger to anchor the ClrSignpostContent
     * - popoverPoint - where on the ClrSignpostContent container to align with the anchorPoint
     * - offsetY - where on the Y axis to align the ClrSignpostContent so it meets specs
     * - offsetX - where on the X axis to align the ClrSignpostContent so it meets specs
     * There are 12 possible positions to place a ClrSignpostContent container:
     * - top-left
     * - top-middle
     * - top-right
     * - right-top
     * - right-middle
     * - right-bottom
     * - bottom-right
     * - bottom-middle
     * - bottom-left
     * - left-bottom
     * - left-middle
     * - left-top
     *
     * I think of it as follows for 'top-left' -> CONTAINER_SIDE-SIDE_POSITION. In this case CONTAINER_SIDE is 'top'
     * meaning the top of the trigger icon (above the icon that hides/shows) the ClrSignpostContent. And, SIDE_POSITION
     * is 'left' meaning two things: 1) the ClrSignpostContent container extends to the left and 2) the 'arrow/pointer'
     * linking the SignpostContent to the trigger points down at the horizontal center of the trigger icon.
     *
     * @param newPosition
     */
    get position(): string | ClrPopoverPosition$1;
    set position(position: string | ClrPopoverPosition$1);
    get isOffScreen(): boolean;
    /**********
     *
     * @description
     * Close function that uses the signpost instance to toggle the state of the content popover.
     *
     */
    close(): void;
    ngAfterViewInit(): void;
    onKeyDown(event: KeyboardEvent): void;
    ngOnDestroy(): void;
    private getFocusableElements;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostContent, [{ optional: true; }, null, null, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpostContent, "clr-signpost-content", never, { "signpostCloseAriaLabel": { "alias": "clrSignpostCloseAriaLabel"; "required": false; }; "position": { "alias": "clrPosition"; "required": false; }; }, {}, never, ["clr-signpost-title", "*"], false, [{ directive: typeof i1.ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare class ClrSignpostTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpostTitle, "clr-signpost-title", never, {}, {}, never, ["*"], false, never>;
}

declare const CLR_SIGNPOST_DIRECTIVES: Type<any>[];
declare class ClrSignpostModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSignpostModule, [typeof ClrSignpost, typeof ClrSignpostContent, typeof ClrSignpostTrigger, typeof ClrSignpostTitle], [typeof i5.CommonModule, typeof i6.ClrIcon, typeof i7.ClrFocusOnViewInitModule, typeof i1.ÇlrClrPopoverModuleNext, typeof i1.ClrIfOpen], [typeof ClrSignpost, typeof ClrSignpostContent, typeof ClrSignpostTrigger, typeof ClrSignpostTitle, typeof i1.ClrIfOpen]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSignpostModule>;
}

declare class ClrTooltip {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltip, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTooltip, "clr-tooltip", never, {}, {}, never, ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class TooltipIdService {
    private _id;
    get id(): Observable<string>;
    updateId(id: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TooltipIdService>;
}

declare class TooltipMouseService {
    private readonly popoverService;
    private mouseOutDelay;
    private mouseOverTrigger;
    private mouseOverContent;
    constructor(popoverService: ClrPopoverService$1);
    onMouseEnterTrigger(): void;
    onMouseLeaveTrigger(): void;
    onMouseEnterContent(): void;
    onMouseLeaveContent(): void;
    private hideIfMouseOut;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipMouseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TooltipMouseService>;
}

declare class ClrTooltipTrigger {
    private popoverService;
    private tooltipMouseService;
    ariaDescribedBy: string;
    private subs;
    constructor(popoverService: ClrPopoverService$1, tooltipIdService: TooltipIdService, tooltipMouseService: TooltipMouseService, element: ElementRef);
    ngOnDestroy(): void;
    showTooltip(): void;
    hideTooltip(): void;
    private onMouseEnter;
    private onMouseLeave;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTooltipTrigger, "[clrTooltipTrigger]", never, {}, {}, never, never, false, never>;
}

declare class ClrTooltipContent implements OnInit {
    private tooltipIdService;
    el: ElementRef;
    private renderer;
    private tooltipMouseService;
    private popoverContent;
    private _id;
    private _position;
    private _size;
    constructor(parentHost: ElementRef<HTMLElement>, tooltipIdService: TooltipIdService, el: ElementRef, renderer: Renderer2, popoverService: ClrPopoverService$1, tooltipMouseService: TooltipMouseService, popoverContent: ClrPopoverContent$1);
    get id(): string;
    set id(value: string);
    get position(): string | ClrPopoverPosition$1;
    set position(value: string | ClrPopoverPosition$1);
    get size(): string;
    set size(value: string);
    ngOnInit(): void;
    private onMouseEnter;
    private onMouseLeave;
    private updateCssClass;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipContent, [{ optional: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTooltipContent, "clr-tooltip-content", never, { "id": { "alias": "id"; "required": false; }; "position": { "alias": "clrPosition"; "required": false; }; "size": { "alias": "clrSize"; "required": false; }; }, {}, never, ["*"], false, [{ directive: typeof i1.ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare const CLR_TOOLTIP_DIRECTIVES: Type<any>[];
declare class ClrTooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTooltipModule, [typeof ClrTooltip, typeof ClrTooltipTrigger, typeof ClrTooltipContent], [typeof i5.CommonModule, typeof i6.ClrIcon, typeof i1.ÇlrClrPopoverModuleNext], [typeof ClrTooltip, typeof ClrTooltipTrigger, typeof ClrTooltipContent, typeof i1.ClrIfOpen, typeof i6.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTooltipModule>;
}

export { CLR_DROPDOWN_DIRECTIVES, CLR_MENU_POSITIONS, CLR_SIGNPOST_DIRECTIVES, CLR_TOOLTIP_DIRECTIVES, ClrDropdown, ClrDropdownItem, ClrDropdownMenu, ClrDropdownModule, ClrDropdownTrigger, ClrIfOpen, ClrPopoverAnchor, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModule, ClrPopoverPosition, ClrPopoverService, ClrPopoverType, ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTitle, ClrSignpostTrigger, ClrStopEscapePropagationDirective, ClrTooltip, ClrTooltipContent, ClrTooltipModule, ClrTooltipTrigger, DROPDOWN_POSITIONS, POPOVER_HOST_ANCHOR, SIGNPOST_POSITIONS, TOOLTIP_POSITIONS, getAnchorPosition, getConnectedPositions, getContentPosition, getPositionsArray, mapPopoverKeyToPosition, ClrPopoverCloseButton as ÇlrClrPopoverCloseButton, ClrPopoverModuleNext as ÇlrClrPopoverModuleNext, ClrPopoverOpenCloseButton as ÇlrClrPopoverOpenCloseButton };
