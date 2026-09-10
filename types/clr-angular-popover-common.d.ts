import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin, OverlayContainer, Overlay } from '@angular/cdk/overlay';
import * as i0 from '@angular/core';
import { ElementRef, OnDestroy, AfterViewInit, ViewContainerRef, TemplateRef, NgZone, OnInit, InjectionToken, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ClrPosition } from '@clr/angular/utils';

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
declare function getOriginPosition(key: ClrPosition): Partial<ConnectedPosition>;
declare function getContentPosition(key: ClrPosition): Partial<ConnectedPosition>;

interface ClrPopoverPoint {
    x: number;
    y: number;
}
declare class ClrPopoverService {
    pointTargetElement: HTMLElement | undefined;
    origin: FlexibleConnectedPositionStrategyOrigin;
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
    get originElement(): ElementRef<HTMLElement> | null;
    get originPoint(): ClrPopoverPoint | null;
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
    /**
     * Opens the popover at a specific screen coordinate.
     * Useful for context menus where the popover should appear at the cursor position.
     */
    openAtPoint(point: ClrPopoverPoint, targetElement?: HTMLElement): void;
    popoverVisibleEmit(visible: boolean): void;
    resetPositions(): void;
    updatePosition(): void;
    focusCloseButton(): void;
    focusOrigin(): void;
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
    set contentOrigin(origin: FlexibleConnectedPositionStrategyOrigin);
    private get positionStrategy();
    private get preferredPosition();
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private _createOverlayRef;
    /**
     * Point-based origins (context menus) delay the subscription to avoid the
     * mouseup from the same right-click that opened the popover.
     */
    private createPointBasedOutsideClickSubscription;
    private handlePointOutsideClick;
    /**
     * Mirrors createCrossWindowOutsideClickSubscription for point-based origins (context
     * menus): pointTargetElement - the element the point was derived from, e.g. the
     * right-clicked element - can itself live inside a foreign iframe document, and CDK's
     * outsidePointerEvents() only listens on this window's document, so a click elsewhere
     * in that foreign document would otherwise never dismiss the menu. Delayed by the same
     * 500ms as the same-window stream, for the same reason: avoid the click that opened the
     * menu immediately closing it again.
     */
    private createCrossWindowPointOutsideClickSubscription;
    /**
     * Element-based origins close on outside clicks and suppress toggle-button
     * re-clicks so the popover doesn't immediately reopen.
     */
    private createElementBasedOutsideClickSubscription;
    private handleOutsideClick;
    /**
     * CDK's outsidePointerEvents() only listens on the document that owns the overlay
     * (this window's), so clicks inside a cross-window origin's own document (e.g. a
     * ShadowRoot hosted in an iframe) are invisible to it - see resolveCrossWindowOrigin
     * for the same cross-window scenario affecting positioning instead. Any pointer event
     * dispatched in that foreign document is guaranteed to be outside the overlay panel,
     * since the panel always renders in this window's document, so this only needs the
     * toggle-button exclusion handleOutsideClick already does, not the content-panel
     * containment check (which can never be true across documents).
     *
     * Listens on capture-phase click/auxclick, mirroring CDK's own OverlayOutsideClickDispatcher.
     * Capture phase matters: for a toggle re-click, this listener must run and
     * stopPropagation() BEFORE the trigger's own bubble-phase click handler
     * (ClrDropdownTrigger's toggleWithEvent) gets a chance to fire, otherwise the popover
     * closes here and immediately reopens there. A bubble-phase or pointerdown-based
     * listener can't suppress that handler at all, since pointerdown and click are separate
     * events and stopping one doesn't affect the other.
     *
     * The foreign document's own addEventListener isn't zone-patched (zone.js only patches
     * the window it's loaded into), so the listener is registered directly and the handler
     * is explicitly run back inside NgZone.
     */
    private createCrossWindowOutsideClickSubscription;
    /**
     * CDK's OverlayKeyboardDispatcher (the source behind `overlayRef.keydownEvents()`)
     * attaches a single keydown listener on this window's document.body once, at app
     * bootstrap - see its `add()`/`_keydownListener`. A keydown fired while focus sits
     * inside a cross-window origin's own document (e.g. a ShadowRoot hosted in an iframe)
     * never bubbles there, since events don't cross document boundaries, so Escape silently
     * does nothing once the trigger (and focus) has moved into that foreign document. This
     * mirrors createCrossWindowOutsideClickSubscription's rationale for outside clicks -
     * merged into a single stream/handler here since both ultimately just detect Escape and
     * close.
     */
    private createEscapeSubscription;
    private resetPosition;
    private closePopover;
    private showOverlay;
    private removeOverlay;
    /**
     * Walks ancestors looking for scrollable containers, following the node up through
     * ShadowRoots and, when the node's own ancestry crosses into an iframe (a different
     * window realm - e.g. a ShadowRoot hosted in a micro-frontend iframe), continuing the
     * walk into the parent window via window.frameElement, all the way up to the true
     * top-level document. Every embedded document passed through this way is added as its
     * own scrollable parent, so page-level scrolling inside an iframe is tracked too.
     *
     * `instanceof` checks are realm-sensitive (they fail for nodes created by a different
     * window's constructors), so this deliberately uses realm-independent shape checks
     * (nodeType, tagName, duck-typing ShadowRoot via `host`) instead, and always resolves
     * computed style through the node's own window rather than this one. This is what lets
     * the walk safely continue across a same-origin realm boundary instead of just
     * stopping at it.
     */
    private getScrollableParents;
    /**
     * Uses IntersectionObserver to detect when the origin element leaves the screen.
     * This handles the "Close on Scroll" logic much cheaper than getBoundingClientRect.
     */
    private setupIntersectionObserver;
    private listenToScrollEvents;
    private listenToScrollForElementOrigin;
    private getRootPopover;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverContent, [null, null, { optional: true; }, null, { optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverContent, "[clrPopoverContent]", never, { "open": { "alias": "clrPopoverContent"; "required": false; }; "contentAt": { "alias": "clrPopoverContentAt"; "required": false; }; "availablePositions": { "alias": "clrPopoverContentAvailablePositions"; "required": false; }; "contentType": { "alias": "clrPopoverContentType"; "required": false; }; "outsideClickClose": { "alias": "clrPopoverContentOutsideClickToClose"; "required": false; }; "scrollToClose": { "alias": "clrPopoverContentScrollToClose"; "required": false; }; "contentOrigin": { "alias": "clrPopoverContentOrigin"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrPopoverOrigin {
    constructor(popoverService: ClrPopoverService, element: ElementRef<HTMLButtonElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverOrigin, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverOrigin, "[clrPopoverOrigin]", never, {}, {}, never, never, false, never>;
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

declare const POPOVER_HOST_ORIGIN: InjectionToken<ElementRef<any>>;

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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPopoverModuleNext, [typeof ClrPopoverOrigin, typeof ClrPopoverCloseButton, typeof ClrPopoverOpenCloseButton], [typeof ClrPopoverContent, typeof ClrIfOpen], [typeof ClrPopoverOrigin, typeof ClrPopoverCloseButton, typeof ClrPopoverOpenCloseButton, typeof ClrPopoverContent, typeof ClrIfOpen]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPopoverModuleNext>;
}

export { ClrIfOpen, ClrPopoverCloseButton, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverOpenCloseButton, ClrPopoverOrigin, ClrPopoverPosition, ClrPopoverService, ClrPopoverType, ClrStopEscapePropagationDirective, DROPDOWN_POSITIONS, POPOVER_HOST_ORIGIN, SIGNPOST_POSITIONS, TOOLTIP_POSITIONS, getConnectedPositions, getContentPosition, getOriginPosition, getPositionsArray, mapPopoverKeyToPosition };
export type { ClrPopoverPoint };
