import { hasModifierKey } from '@angular/cdk/keycodes';
import * as i1 from '@angular/cdk/overlay';
import { OverlayConfig } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import * as i0 from '@angular/core';
import { ElementRef, Injectable, PLATFORM_ID, Input, Optional, SkipSelf, Inject, Directive, InjectionToken, HostListener, EventEmitter, Output, NgModule } from '@angular/core';
import { preventArrowKeyScroll, ClrPosition, Keys } from '@clr/angular/utils';
import { Subject, merge, timer, switchMap, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

class ClrPopoverService {
    constructor() {
        this.panelClass = [];
        this._open = false;
        this._openChange = new Subject();
        this._openEventChange = new Subject();
        this._positionChange = new Subject();
        this._resetPositions = new Subject();
        this._updatePosition = new Subject();
        this._popoverVisible = new Subject();
    }
    get originElement() {
        return this.origin instanceof ElementRef ? this.origin : null;
    }
    get originPoint() {
        return this.origin && 'x' in this.origin && 'y' in this.origin ? this.origin : null;
    }
    get openChange() {
        return this._openChange.asObservable();
    }
    get popoverVisible() {
        return this._popoverVisible.asObservable();
    }
    get openEvent() {
        return this._openEvent;
    }
    set openEvent(event) {
        this._openEvent = event;
        this._openEventChange.next(event);
    }
    get open() {
        return this._open;
    }
    set open(value) {
        value = !!value;
        if (this._open !== value) {
            this._open = value;
            this._openChange.next(value);
        }
    }
    get resetPositionsChange() {
        return this._resetPositions.asObservable();
    }
    positionChange(position) {
        this._positionChange.next(position);
    }
    updatePositionChange() {
        return this._updatePosition.asObservable();
    }
    getPositionChange() {
        return this._positionChange.asObservable();
    }
    getEventChange() {
        return this._openEventChange.asObservable();
    }
    /**
     * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
     * This is for instance the case of components that open on a click, but close on a click outside.
     */
    toggleWithEvent(event) {
        preventArrowKeyScroll(event);
        this.openEvent = event;
        this.open = !this.open;
    }
    /**
     * Opens the popover at a specific screen coordinate.
     * Useful for context menus where the popover should appear at the cursor position.
     */
    openAtPoint(point, targetElement) {
        if (this._open) {
            this._open = false;
            this._openChange.next(false);
        }
        this.origin = point;
        this.pointTargetElement = targetElement;
        this.open = true;
    }
    popoverVisibleEmit(visible) {
        this._popoverVisible.next(visible);
    }
    resetPositions() {
        this._resetPositions.next();
    }
    updatePosition() {
        this._updatePosition.next();
    }
    focusCloseButton() {
        this.closeButtonRef.nativeElement?.focus();
    }
    focusOrigin() {
        this.originElement?.nativeElement?.focus({ preventScroll: true });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Realm-independent shape checks for getScrollableParents(): `instanceof` fails for
// nodes created by a different window's constructors (e.g. an iframe's own Element,
// ShadowRoot, or HTMLHtmlElement classes), so these duck-type via nodeType/tagName
// instead, which works the same regardless of which window created the node.
function isElementOrShadowRoot(node) {
    return node.nodeType === Node.ELEMENT_NODE || isShadowRoot(node);
}
function isShadowRoot(node) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in node;
}
function isHtmlElement(node) {
    return node.nodeType === Node.ELEMENT_NODE && node.tagName === 'HTML';
}
// Same-origin-safe: returns null (rather than throwing) if `frameElement` can't be
// read, which happens when `win` is embedded in a cross-origin parent window.
function getFrameElement(win) {
    try {
        return win.frameElement;
    }
    catch {
        return null;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Resolves an origin to its element and owning window, but only when that window differs
 * from this one - i.e. the origin lives inside an iframe. Returns null for same-window
 * origins and for non-element (point) origins, so a single check lets callers skip all
 * cross-window handling for the overwhelming majority of popovers.
 *
 * Cheap: a few property reads, no layout access.
 */
function getCrossWindowOriginContext(origin) {
    const element = getOriginElement(origin);
    const elementWindow = element?.ownerDocument?.defaultView;
    return element && elementWindow && elementWindow !== window ? { element, elementWindow } : null;
}
/**
 * CDK's FlexibleConnectedPositionStrategy anchors the overlay by reading
 * origin.getBoundingClientRect() (for an Element/ElementRef origin) directly off the
 * origin, relative to the origin's own window. That only matches the overlay panel's
 * window (always the one this code runs in) when the origin lives in the same document.
 * When the origin sits inside an iframe (e.g. a micro-frontend mounting its trigger in a
 * nested document, possibly combined with a ShadowRoot), the raw rect is relative to the
 * wrong viewport and the overlay is mispositioned.
 *
 * If the origin is same-window (or not an Element/ElementRef at all), this returns it
 * unchanged. Otherwise it returns a Point-based origin (the other shape
 * FlexibleConnectedPositionStrategy natively supports) whose x/y/width/height are live
 * getters that recompute the element's rect plus the cumulative offset of every ancestor
 * iframe between the origin's window and this one, so the overlay still anchors
 * correctly across repositions (scroll, resize). This has no effect on anything besides
 * overlay positioning math - it never replaces the origin ElementRef consumers rely on
 * elsewhere (e.g. scroll listeners), since it only wraps a local copy used for
 * positioning.
 *
 * If the ancestor iframe chain can't be safely resolved (e.g. a cross-origin frame
 * boundary this code can't introspect), the getters fall back to the element's own
 * un-translated rect - the exact numbers CDK would compute if given the raw
 * Element/ElementRef directly, so behavior for that case is unchanged.
 */
function resolveCrossWindowOrigin(origin) {
    const crossWindowOrigin = getCrossWindowOriginContext(origin);
    // Same-window origins (and point origins) are handed back untouched - no wrapping, no
    // translation, no behavior change from a popover that never crosses a window boundary.
    if (!crossWindowOrigin) {
        return origin;
    }
    const { element, elementWindow } = crossWindowOrigin;
    let cached = null;
    // CDK's position strategy reads x/y/width/height several times per apply() (it builds
    // a rect from a Point origin as {top: y, bottom: y + height, left: x, right: x + width}).
    // Memoizing per microtask collapses that into a single rect/offset computation instead
    // of one forced layout read per property access, while still recomputing fresh on the
    // next reposition (scroll, resize), since the cache clears before the next microtask.
    const read = () => {
        if (!cached) {
            const rect = element.getBoundingClientRect();
            const offset = getCumulativeFrameOffset(elementWindow) ?? { x: 0, y: 0 };
            cached = { x: rect.left + offset.x, y: rect.top + offset.y, width: rect.width, height: rect.height };
            queueMicrotask(() => (cached = null));
        }
        return cached;
    };
    return {
        get x() {
            return read().x;
        },
        get y() {
            return read().y;
        },
        get width() {
            return read().width;
        },
        get height() {
            return read().height;
        },
    };
}
function getOriginElement(origin) {
    if (origin instanceof ElementRef) {
        return origin.nativeElement;
    }
    // `instanceof Element` is realm-sensitive and misses raw elements belonging to
    // another window - exactly the population this util targets - so duck-type instead.
    if (origin?.nodeType === Node.ELEMENT_NODE) {
        return origin;
    }
    return null;
}
/**
 * Walks the chain of window.frameElement references from `originWindow` up to this
 * code's own window, summing each ancestor iframe's position. Returns null if the
 * chain can't be fully resolved (cross-origin boundary, or `originWindow` isn't
 * actually embedded within this window).
 */
function getCumulativeFrameOffset(originWindow) {
    let offsetX = 0;
    let offsetY = 0;
    let currentWindow = originWindow;
    while (currentWindow && currentWindow !== window) {
        const frameElement = getFrameElement(currentWindow);
        if (!frameElement) {
            return null;
        }
        const frameRect = frameElement.getBoundingClientRect();
        // clientLeft/clientTop only cover the frame's border, not any CSS padding, which
        // would otherwise skew the anchor - read computed style through the frame's own
        // window for realm-safety.
        const frameWindow = frameElement.ownerDocument?.defaultView ?? window;
        const { borderLeftWidth, borderTopWidth, paddingLeft, paddingTop } = frameWindow.getComputedStyle(frameElement);
        offsetX += frameRect.left + (parseFloat(borderLeftWidth) || 0) + (parseFloat(paddingLeft) || 0);
        offsetY += frameRect.top + (parseFloat(borderTopWidth) || 0) + (parseFloat(paddingTop) || 0);
        currentWindow = frameElement.ownerDocument?.defaultView ?? null;
    }
    return currentWindow === window ? { x: offsetX, y: offsetY } : null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrPopoverType;
(function (ClrPopoverType) {
    ClrPopoverType[ClrPopoverType["SIGNPOST"] = 0] = "SIGNPOST";
    ClrPopoverType[ClrPopoverType["TOOLTIP"] = 1] = "TOOLTIP";
    ClrPopoverType[ClrPopoverType["DROPDOWN"] = 2] = "DROPDOWN";
    ClrPopoverType[ClrPopoverType["DEFAULT"] = 3] = "DEFAULT";
})(ClrPopoverType || (ClrPopoverType = {}));
var ClrPopoverPosition;
(function (ClrPopoverPosition) {
    ClrPopoverPosition["TOP_RIGHT"] = "top-right";
    ClrPopoverPosition["TOP_MIDDLE"] = "top-middle";
    ClrPopoverPosition["TOP_LEFT"] = "top-left";
    ClrPopoverPosition["RIGHT"] = "right";
    ClrPopoverPosition["RIGHT_TOP"] = "right-top";
    ClrPopoverPosition["RIGHT_MIDDLE"] = "right-middle";
    ClrPopoverPosition["RIGHT_BOTTOM"] = "right-bottom";
    ClrPopoverPosition["LEFT"] = "left";
    ClrPopoverPosition["LEFT_TOP"] = "left-top";
    ClrPopoverPosition["LEFT_MIDDLE"] = "left-middle";
    ClrPopoverPosition["LEFT_BOTTOM"] = "left-bottom";
    ClrPopoverPosition["BOTTOM_RIGHT"] = "bottom-right";
    ClrPopoverPosition["BOTTOM_MIDDLE"] = "bottom-middle";
    ClrPopoverPosition["BOTTOM_LEFT"] = "bottom-left";
})(ClrPopoverPosition || (ClrPopoverPosition = {}));
const TOOLTIP_POSITIONS = [
    ClrPopoverPosition.RIGHT, // default. must be at index 0
    ClrPopoverPosition.LEFT,
    ClrPopoverPosition.BOTTOM_RIGHT,
    ClrPopoverPosition.BOTTOM_LEFT,
    ClrPopoverPosition.TOP_RIGHT,
    ClrPopoverPosition.TOP_LEFT,
];
const DROPDOWN_POSITIONS = [
    ClrPopoverPosition.BOTTOM_LEFT, // default. must be at index 0
    ClrPopoverPosition.BOTTOM_RIGHT,
    ClrPopoverPosition.TOP_LEFT,
    ClrPopoverPosition.TOP_RIGHT,
    ClrPopoverPosition.RIGHT_TOP,
    ClrPopoverPosition.RIGHT_BOTTOM,
    ClrPopoverPosition.LEFT_TOP,
    ClrPopoverPosition.LEFT_BOTTOM,
];
const SIGNPOST_POSITIONS = [
    ClrPopoverPosition.RIGHT_MIDDLE, // default. must be at index 0
    ClrPopoverPosition.RIGHT_TOP,
    ClrPopoverPosition.RIGHT_BOTTOM,
    ClrPopoverPosition.TOP_RIGHT,
    ClrPopoverPosition.TOP_LEFT,
    ClrPopoverPosition.TOP_MIDDLE,
    ClrPopoverPosition.BOTTOM_RIGHT,
    ClrPopoverPosition.BOTTOM_MIDDLE,
    ClrPopoverPosition.BOTTOM_LEFT,
    ClrPopoverPosition.LEFT_BOTTOM,
    ClrPopoverPosition.LEFT_MIDDLE,
    ClrPopoverPosition.LEFT_TOP,
];
function getPositionsArray(type) {
    switch (type) {
        case ClrPopoverType.TOOLTIP:
            return TOOLTIP_POSITIONS;
        case ClrPopoverType.DROPDOWN:
            return DROPDOWN_POSITIONS;
        case ClrPopoverType.SIGNPOST:
        case ClrPopoverType.DEFAULT:
        default:
            return SIGNPOST_POSITIONS;
    }
}
function getConnectedPositions(type) {
    const result = [];
    getPositionsArray(type).forEach(position => {
        result.push(mapPopoverKeyToPosition(position, type));
    });
    return result;
}
const POPOVER_OFFSETS = {
    [ClrPopoverType.SIGNPOST]: 16,
    [ClrPopoverType.TOOLTIP]: 21,
    [ClrPopoverType.DROPDOWN]: 2,
    [ClrPopoverType.DEFAULT]: 0,
};
function getOffset(key, type) {
    const offset = POPOVER_OFFSETS[type] || 0;
    switch (key) {
        // TOP
        case ClrPopoverPosition.TOP_LEFT:
        case ClrPopoverPosition.TOP_MIDDLE:
        case ClrPopoverPosition.TOP_RIGHT:
            return {
                offsetY: -offset,
                offsetX: 0,
            };
        // LEFT
        case ClrPopoverPosition.LEFT_TOP:
        case ClrPopoverPosition.LEFT_MIDDLE:
        case ClrPopoverPosition.LEFT:
        case ClrPopoverPosition.LEFT_BOTTOM:
            return {
                offsetY: 0,
                offsetX: -offset,
            };
        // RIGHT
        case ClrPopoverPosition.RIGHT_TOP:
        case ClrPopoverPosition.RIGHT_MIDDLE:
        case ClrPopoverPosition.RIGHT:
        case ClrPopoverPosition.RIGHT_BOTTOM:
            return {
                offsetY: 0,
                offsetX: offset,
            };
        // BOTTOM and DEFAULT
        case ClrPopoverPosition.BOTTOM_RIGHT:
        case ClrPopoverPosition.BOTTOM_MIDDLE:
        case ClrPopoverPosition.BOTTOM_LEFT:
        default:
            return {
                offsetY: offset,
                offsetX: 0,
            };
    }
}
const STANDARD_ORIGINS = {
    // TOP
    [ClrPopoverPosition.TOP_RIGHT]: { origin: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_LEFT },
    [ClrPopoverPosition.TOP_MIDDLE]: { origin: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_CENTER },
    [ClrPopoverPosition.TOP_LEFT]: { origin: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_RIGHT },
    // LEFT
    [ClrPopoverPosition.LEFT]: { origin: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_TOP },
    [ClrPopoverPosition.LEFT_TOP]: { origin: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_BOTTOM },
    [ClrPopoverPosition.LEFT_MIDDLE]: { origin: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_CENTER },
    [ClrPopoverPosition.LEFT_BOTTOM]: { origin: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_TOP },
    // RIGHT
    [ClrPopoverPosition.RIGHT]: { origin: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_TOP },
    [ClrPopoverPosition.RIGHT_TOP]: { origin: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_BOTTOM },
    [ClrPopoverPosition.RIGHT_MIDDLE]: { origin: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_CENTER },
    [ClrPopoverPosition.RIGHT_BOTTOM]: { origin: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_TOP },
    // BOTTOM
    [ClrPopoverPosition.BOTTOM_RIGHT]: { origin: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_LEFT },
    [ClrPopoverPosition.BOTTOM_MIDDLE]: { origin: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_CENTER },
    [ClrPopoverPosition.BOTTOM_LEFT]: { origin: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_RIGHT },
};
const DROPDOWN_ORIGINS = {
    // TOP
    [ClrPopoverPosition.TOP_RIGHT]: { origin: ClrPosition.TOP_RIGHT, content: ClrPosition.BOTTOM_RIGHT },
    [ClrPopoverPosition.TOP_LEFT]: { origin: ClrPosition.TOP_LEFT, content: ClrPosition.BOTTOM_LEFT },
    // LEFT
    [ClrPopoverPosition.LEFT_TOP]: { origin: ClrPosition.LEFT_TOP, content: ClrPosition.TOP_RIGHT },
    [ClrPopoverPosition.LEFT_BOTTOM]: { origin: ClrPosition.LEFT_BOTTOM, content: ClrPosition.BOTTOM_RIGHT },
    // RIGHT
    [ClrPopoverPosition.RIGHT_TOP]: { origin: ClrPosition.RIGHT_TOP, content: ClrPosition.LEFT_TOP },
    [ClrPopoverPosition.RIGHT_BOTTOM]: { origin: ClrPosition.RIGHT_BOTTOM, content: ClrPosition.LEFT_BOTTOM },
    // BOTTOM
    [ClrPopoverPosition.BOTTOM_RIGHT]: { origin: ClrPosition.BOTTOM_LEFT, content: ClrPosition.TOP_RIGHT },
    [ClrPopoverPosition.BOTTOM_LEFT]: { origin: ClrPosition.BOTTOM_RIGHT, content: ClrPosition.TOP_LEFT },
};
function mapPopoverKeyToPosition(key, type) {
    let offset = getOffset(key, type);
    const defaultPosition = { origin: ClrPosition.BOTTOM_LEFT, content: ClrPosition.TOP_LEFT };
    const { origin, content } = (type === ClrPopoverType.DROPDOWN ? DROPDOWN_ORIGINS[key] : STANDARD_ORIGINS[key]) ?? defaultPosition;
    return {
        ...getOriginPosition(origin),
        ...getContentPosition(content),
        ...offset,
        panelClass: key,
    };
}
function getOriginPosition(key) {
    switch (key) {
        // TOP Positions
        case ClrPosition.TOP_LEFT:
            return {
                originX: 'start',
                originY: 'top',
            };
        case ClrPosition.TOP_CENTER:
            return {
                originX: 'center',
                originY: 'top',
            };
        case ClrPosition.TOP_RIGHT:
            return {
                originX: 'end',
                originY: 'top',
            };
        // LEFT Positions
        case ClrPosition.LEFT_TOP:
            return {
                originX: 'start',
                originY: 'top',
            };
        case ClrPosition.LEFT_CENTER:
            return {
                originX: 'start',
                originY: 'center',
            };
        case ClrPosition.LEFT_BOTTOM:
            return {
                originX: 'start',
                originY: 'bottom',
            };
        // RIGHT Positions
        case ClrPosition.RIGHT_TOP:
            return {
                originX: 'end',
                originY: 'top',
            };
        case ClrPosition.RIGHT_CENTER:
            return {
                originX: 'end',
                originY: 'center',
            };
        case ClrPosition.RIGHT_BOTTOM:
            return {
                originX: 'end',
                originY: 'bottom',
            };
        // BOTTOM positions and default
        case ClrPosition.BOTTOM_LEFT:
            return {
                originX: 'end',
                originY: 'bottom',
            };
        case ClrPosition.BOTTOM_CENTER:
            return {
                originX: 'center',
                originY: 'bottom',
            };
        case ClrPosition.BOTTOM_RIGHT:
        default:
            return {
                originX: 'start',
                originY: 'bottom',
            };
    }
}
function getContentPosition(key) {
    switch (key) {
        // TOP Positions
        case ClrPosition.TOP_LEFT:
            return {
                overlayX: 'start',
                overlayY: 'top',
            };
        case ClrPosition.TOP_CENTER:
            return {
                overlayX: 'center',
                overlayY: 'top',
            };
        case ClrPosition.TOP_RIGHT:
            return {
                overlayX: 'end',
                overlayY: 'top',
            };
        // LEFT Positions
        case ClrPosition.LEFT_TOP:
            return {
                overlayX: 'start',
                overlayY: 'top',
            };
        case ClrPosition.LEFT_CENTER:
            return {
                overlayX: 'start',
                overlayY: 'center',
            };
        case ClrPosition.LEFT_BOTTOM:
            return {
                overlayX: 'start',
                overlayY: 'bottom',
            };
        // RIGHT Positions
        case ClrPosition.RIGHT_TOP:
            return {
                overlayX: 'end',
                overlayY: 'top',
            };
        case ClrPosition.RIGHT_CENTER:
            return {
                overlayX: 'end',
                overlayY: 'center',
            };
        case ClrPosition.RIGHT_BOTTOM:
            return {
                overlayX: 'end',
                overlayY: 'bottom',
            };
        // BOTTOM positions and default
        case ClrPosition.BOTTOM_LEFT:
            return {
                overlayX: 'start',
                overlayY: 'bottom',
            };
        case ClrPosition.BOTTOM_CENTER:
            return {
                overlayX: 'center',
                overlayY: 'bottom',
            };
        case ClrPosition.BOTTOM_RIGHT:
        default:
            return {
                overlayX: 'end',
                overlayY: 'bottom',
            };
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @dynamic */
class ClrPopoverContent {
    constructor(element, container, template, overlayContainer, parent, overlay, popoverService, zone, platformId) {
        this.container = container;
        this.template = template;
        this.parent = parent;
        this.overlay = overlay;
        this.popoverService = popoverService;
        this.zone = zone;
        this.platformId = platformId;
        this._outsideClickClose = true;
        this._scrollToClose = false;
        this.popoverType = ClrPopoverType.DEFAULT;
        this._availablePositions = [];
        this._position = ClrPopoverPosition.BOTTOM_LEFT;
        this.subscriptions = [];
        this.preferredPositionIsSet = false;
        this.availablePositionsAreSet = false;
        this._preferredPosition = {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            panelClass: ClrPopoverPosition.LEFT_TOP,
        };
        popoverService.panelClass.push('clr-popover-content');
        overlayContainer.getContainerElement().classList.add('clr-overlay-container');
        if (!template) {
            this.elementRef = element;
        }
    }
    set open(value) {
        this.popoverService.open = !!value;
    }
    get contentAt() {
        return this.preferredPositionIsSet ? this._preferredPosition : this._position;
    }
    set contentAt(position) {
        if (typeof position === 'string') {
            if (!position || Object.values(ClrPopoverPosition).indexOf(position) === -1) {
                return;
            }
            // set the popover values based on menu position
            this._position = position;
            this.popoverService.positionChange(this._position);
        }
        else {
            this.preferredPositionIsSet = true;
            this._preferredPosition = position;
        }
    }
    set availablePositions(positions) {
        this.availablePositionsAreSet = true;
        this._availablePositions = positions;
    }
    set contentType(type) {
        this.popoverType = type;
        if (!this.availablePositionsAreSet) {
            this._availablePositions = getConnectedPositions(type);
        }
    }
    get outsideClickClose() {
        return this._outsideClickClose;
    }
    set outsideClickClose(clickToClose) {
        this._outsideClickClose = !!clickToClose;
    }
    get scrollToClose() {
        return this._scrollToClose;
    }
    set scrollToClose(scrollToClose) {
        this._scrollToClose = !!scrollToClose;
    }
    set contentOrigin(origin) {
        // `instanceof Element` is realm-sensitive and misses a raw element belonging to
        // another window, so a consumer passing one here would bypass the ElementRef wrap
        // resolveCrossWindowOrigin() relies on to detect a cross-window origin.
        if (origin?.nodeType === Node.ELEMENT_NODE) {
            this.popoverService.origin = new ElementRef(origin);
        }
        else {
            this.popoverService.origin = origin;
        }
    }
    get positionStrategy() {
        const origin = resolveCrossWindowOrigin(this.popoverService.origin);
        return this.overlay
            .position()
            .flexibleConnectedTo(origin)
            .setOrigin(origin)
            .withPush(true)
            .withPositions([this.preferredPosition, ...this._availablePositions])
            .withFlexibleDimensions(true);
    }
    get preferredPosition() {
        if (this.preferredPositionIsSet) {
            return this._preferredPosition;
        }
        // Default position is "bottom-left"
        return mapPopoverKeyToPosition(this._position, this.popoverType);
    }
    ngAfterViewInit() {
        if (this.popoverService.open) {
            this.showOverlay();
        }
        this.openCloseSubscription = this.popoverService.openChange.subscribe(change => {
            if (change) {
                this.showOverlay();
            }
            else {
                this.closePopover();
            }
        });
    }
    ngOnDestroy() {
        this.removeOverlay();
        this.openCloseSubscription?.unsubscribe();
    }
    _createOverlayRef() {
        this.overlayRef = this.overlay.create(new OverlayConfig({
            // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
            positionStrategy: this.positionStrategy,
            // the scrolling behaviour is controlled by this popover content directive
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            panelClass: this.popoverService.panelClass,
            hasBackdrop: false,
        }));
        this.subscriptions.push(merge(this.popoverService.resetPositionsChange, this.popoverService.getPositionChange()).subscribe(() => {
            this.resetPosition();
        }), this.popoverService.updatePositionChange().subscribe(() => {
            this.overlayRef?.updatePosition();
        }), this.createEscapeSubscription(), this.popoverService.originPoint
            ? this.createPointBasedOutsideClickSubscription()
            : this.createElementBasedOutsideClickSubscription());
    }
    /**
     * Point-based origins (context menus) delay the subscription to avoid the
     * mouseup from the same right-click that opened the popover.
     */
    createPointBasedOutsideClickSubscription() {
        const subscription = timer(500)
            .pipe(switchMap(() => this.overlayRef.outsidePointerEvents()))
            .subscribe(event => this.handlePointOutsideClick(event));
        const crossWindowSubscription = this.createCrossWindowPointOutsideClickSubscription();
        if (crossWindowSubscription) {
            subscription.add(crossWindowSubscription);
        }
        return subscription;
    }
    handlePointOutsideClick(event) {
        if (this.elementRef?.nativeElement?.contains(event.target)) {
            return;
        }
        if (this._outsideClickClose) {
            this.closePopover();
        }
    }
    /**
     * Mirrors createCrossWindowOutsideClickSubscription for point-based origins (context
     * menus): pointTargetElement - the element the point was derived from, e.g. the
     * right-clicked element - can itself live inside a foreign iframe document, and CDK's
     * outsidePointerEvents() only listens on this window's document, so a click elsewhere
     * in that foreign document would otherwise never dismiss the menu. Delayed by the same
     * 500ms as the same-window stream, for the same reason: avoid the click that opened the
     * menu immediately closing it again.
     */
    createCrossWindowPointOutsideClickSubscription() {
        const pointTargetElement = this.popoverService.pointTargetElement;
        const crossWindowOrigin = pointTargetElement ? getCrossWindowOriginContext(pointTargetElement) : null;
        if (!crossWindowOrigin) {
            return null;
        }
        const originWindow = crossWindowOrigin.elementWindow;
        return timer(500)
            .pipe(switchMap(() => this.zone.runOutsideAngular(() => merge(fromEvent(originWindow.document, 'click', { capture: true }), fromEvent(originWindow.document, 'auxclick', { capture: true })))))
            .subscribe(event => this.zone.run(() => this.handlePointOutsideClick(event)));
    }
    /**
     * Element-based origins close on outside clicks and suppress toggle-button
     * re-clicks so the popover doesn't immediately reopen.
     */
    createElementBasedOutsideClickSubscription() {
        const subscription = this.overlayRef.outsidePointerEvents().subscribe(event => this.handleOutsideClick(event));
        const crossWindowSubscription = this.createCrossWindowOutsideClickSubscription();
        if (crossWindowSubscription) {
            subscription.add(crossWindowSubscription);
        }
        return subscription;
    }
    handleOutsideClick(event) {
        // The very click that opened this popover must never be treated as an outside click.
        // CDK's OverlayOutsideClickDispatcher listens in the capture phase on this window's
        // document.body, so it normally runs *before* the trigger's own click handler has
        // attached the overlay, and the opening click is therefore never delivered here.
        // That ordering does not hold everywhere: when the trigger lives in a ShadowRoot
        // owned by a separately bootstrapped Angular application (an ESM micro-frontend
        // plugin with its own CDK instance), the overlay can already be attached by the time
        // the dispatcher sees the click, which delivers the opening click straight back as an
        // "outside" click and tears the popover down microseconds after it opened.
        // Comparing against the stored open event is exact - CDK re-emits the same Event
        // object - and it leaves toggle-to-close untouched, since a later click on the
        // trigger is always a different Event instance.
        if (event === this.popoverService.openEvent) {
            return;
        }
        // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
        if (this.elementRef?.nativeElement?.contains(event.target)) {
            return;
        }
        // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
        // openEvent.target can itself be null (e.g. the original toggle button was removed
        // from the DOM before this handler runs), so every access below is optional - an
        // unguarded `.contains()` call here throws and aborts the whole handler, which is
        // exactly what stops closePopover() from ever running.
        const openEventTarget = this.popoverService.openEvent?.target;
        const isToggleButton = !!openEventTarget &&
            (openEventTarget.contains(event.target) ||
                openEventTarget.parentElement?.contains(event.target) ||
                openEventTarget === event.target);
        if (isToggleButton) {
            event.stopPropagation();
        }
        if (this._outsideClickClose || isToggleButton) {
            this.closePopover();
        }
    }
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
    createCrossWindowOutsideClickSubscription() {
        // Same-window origins bail out here, so a popover that never crosses a window
        // boundary registers no extra listeners at all.
        const crossWindowOrigin = getCrossWindowOriginContext(this.popoverService.origin);
        if (!crossWindowOrigin) {
            return null;
        }
        const originWindow = crossWindowOrigin.elementWindow;
        return this.zone.runOutsideAngular(() => merge(fromEvent(originWindow.document, 'click', { capture: true }), fromEvent(originWindow.document, 'auxclick', { capture: true })).subscribe(event => this.zone.run(() => this.handleOutsideClick(event))));
    }
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
    createEscapeSubscription() {
        const crossWindowOrigin = getCrossWindowOriginContext(this.popoverService.origin);
        const keydownEvents = crossWindowOrigin
            ? merge(this.overlayRef.keydownEvents(), this.zone.runOutsideAngular(() => fromEvent(crossWindowOrigin.elementWindow.document, 'keydown')))
            : this.overlayRef.keydownEvents();
        return keydownEvents.subscribe(event => {
            if (isEscapeKey(event)) {
                this.zone.run(() => {
                    event.preventDefault();
                    this.closePopover();
                });
            }
        });
    }
    resetPosition() {
        if (this.overlayRef) {
            this.overlayRef.updatePositionStrategy(this.positionStrategy);
            this.overlayRef.updatePosition();
        }
    }
    closePopover() {
        if (!this.overlayRef) {
            return;
        }
        this.removeOverlay();
        this.popoverService.popoverVisibleEmit(false);
        this.popoverService.open = false;
        if (this.popoverService.originElement) {
            const shouldFocusTrigger = this.popoverType !== ClrPopoverType.TOOLTIP &&
                (document.activeElement === document.body ||
                    document.activeElement === this.popoverService.originElement.nativeElement);
            if (shouldFocusTrigger) {
                this.popoverService.focusOrigin();
            }
        }
    }
    showOverlay() {
        if (!this.overlayRef) {
            this._createOverlayRef();
        }
        if (!this.view && this.template) {
            this.view = this.container.createEmbeddedView(this.template);
            if (!this.elementRef) {
                const [rootNode] = this.view.rootNodes;
                this.elementRef = new ElementRef(rootNode); // So we know where/what to set close focus on
            }
        }
        if (!this.domPortal) {
            this.domPortal = new DomPortal(this.elementRef);
            this.overlayRef.attach(this.domPortal);
        }
        if (this.popoverService.originElement) {
            this.popoverService.originElement.nativeElement.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
                inline: 'nearest',
            });
            this.setupIntersectionObserver();
        }
        setTimeout(() => {
            // Get Scrollable Parents
            this.listenToScrollEvents();
            this.popoverService.popoverVisibleEmit(true);
            if (this.elementRef?.nativeElement?.focus) {
                this.elementRef.nativeElement.focus();
            }
        });
    }
    removeOverlay() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
        }
        if (this.domPortal?.isAttached) {
            this.domPortal.detach();
        }
        if (this.view) {
            this.view.destroy();
        }
        this.overlayRef = null;
        this.domPortal = null;
        if (this.template) {
            this.elementRef = null;
        }
        this.view = null;
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = null;
    }
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
    getScrollableParents(node) {
        const overflowScrollKeys = ['auto', 'scroll', 'clip'];
        const scrollableParents = [window.document];
        let parent = node;
        while (parent && isElementOrShadowRoot(parent)) {
            if (isShadowRoot(parent)) {
                parent = parent.host;
                continue;
            }
            const element = parent;
            const elementWindow = element.ownerDocument?.defaultView;
            if (isHtmlElement(element)) {
                const frameElement = elementWindow && elementWindow !== window ? getFrameElement(elementWindow) : null;
                if (!frameElement) {
                    break;
                }
                // Leaving this document for its parent window - track its own page-level scroll too.
                scrollableParents.push(element.ownerDocument);
                parent = frameElement;
                continue;
            }
            const { overflowY, overflowX } = (elementWindow ?? window).getComputedStyle(element);
            if (overflowScrollKeys.includes(overflowY) || overflowScrollKeys.includes(overflowX)) {
                scrollableParents.push(element);
            }
            parent = element.parentNode;
        }
        return scrollableParents;
    }
    /**
     * Uses IntersectionObserver to detect when the origin element leaves the screen.
     * This handles the "Close on Scroll" logic much cheaper than getBoundingClientRect.
     */
    setupIntersectionObserver() {
        if (!this.popoverService.originElement || this.intersectionObserver) {
            return;
        }
        this.intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // If the origin is no longer visible (scrolled out of view)
                if (!entry.isIntersecting && this.popoverService.open) {
                    this.zone.run(() => this.closePopover());
                }
            });
        }, { root: null, threshold: 0.8 });
        this.intersectionObserver.observe(this.popoverService.originElement.nativeElement);
    }
    listenToScrollEvents() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const originEl = this.popoverService.originPoint
            ? this.popoverService.pointTargetElement
            : this.getRootPopover(this)?.popoverService?.originElement?.nativeElement;
        this.listenToScrollForElementOrigin(originEl);
    }
    // Element origins track ancestor scroll containers to reposition or close.
    listenToScrollForElementOrigin(originEl) {
        const scrollableParents = this.getScrollableParents(originEl);
        this.zone.runOutsideAngular(() => {
            this.subscriptions.push(merge(...scrollableParents.map(parent => fromEvent(parent, 'scroll', { passive: true }))).subscribe(() => {
                if (this._scrollToClose) {
                    this.zone.run(() => this.closePopover());
                    return;
                }
                this.overlayRef?.updatePosition();
            }));
        });
    }
    getRootPopover(popover) {
        if (popover && popover.parent) {
            return this.getRootPopover(popover.parent);
        }
        return popover;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverContent, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.TemplateRef, optional: true }, { token: i1.OverlayContainer }, { token: ClrPopoverContent, optional: true, skipSelf: true }, { token: i1.Overlay }, { token: ClrPopoverService }, { token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverContent, isStandalone: true, selector: "[clrPopoverContent]", inputs: { open: ["clrPopoverContent", "open"], contentAt: ["clrPopoverContentAt", "contentAt"], availablePositions: ["clrPopoverContentAvailablePositions", "availablePositions"], contentType: ["clrPopoverContentType", "contentType"], outsideClickClose: ["clrPopoverContentOutsideClickToClose", "outsideClickClose"], scrollToClose: ["clrPopoverContentScrollToClose", "scrollToClose"], contentOrigin: ["clrPopoverContentOrigin", "contentOrigin"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverContent]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.TemplateRef, decorators: [{
                    type: Optional
                }] }, { type: i1.OverlayContainer }, { type: ClrPopoverContent, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.Overlay }, { type: ClrPopoverService, decorators: [{
                    type: Inject,
                    args: [ClrPopoverService]
                }] }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { open: [{
                type: Input,
                args: ['clrPopoverContent']
            }], contentAt: [{
                type: Input,
                args: ['clrPopoverContentAt']
            }], availablePositions: [{
                type: Input,
                args: ['clrPopoverContentAvailablePositions']
            }], contentType: [{
                type: Input,
                args: ['clrPopoverContentType']
            }], outsideClickClose: [{
                type: Input,
                args: ['clrPopoverContentOutsideClickToClose']
            }], scrollToClose: [{
                type: Input,
                args: ['clrPopoverContentScrollToClose']
            }], contentOrigin: [{
                type: Input,
                args: ['clrPopoverContentOrigin']
            }] } });
function isEscapeKey(event) {
    return !!event && event.key === Keys.Escape && !hasModifierKey(event);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverOrigin {
    constructor(popoverService, element) {
        popoverService.origin = element;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverOrigin, deps: [{ token: ClrPopoverService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverOrigin, isStandalone: false, selector: "[clrPopoverOrigin]", host: { properties: { "class.clr-popover-origin": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverOrigin, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverOrigin]',
                    host: {
                        '[class.clr-popover-origin]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }, { type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const POPOVER_HOST_ORIGIN = new InjectionToken('POPOVER_HOST_ORIGIN');

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStopEscapePropagationDirective {
    constructor(popoverService) {
        this.popoverService = popoverService;
        this.lastOpenChange = null;
    }
    ngOnInit() {
        this.subscription = this.popoverService.openChange.subscribe(open => {
            this.lastOpenChange = open;
        });
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    onEscapeKey(event) {
        if (this.lastOpenChange !== null) {
            if (this.lastOpenChange === false) {
                event.stopPropagation();
            }
            this.lastOpenChange = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStopEscapePropagationDirective, deps: [{ token: ClrPopoverService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrStopEscapePropagationDirective, isStandalone: true, host: { listeners: { "keyup.escape": "onEscapeKey($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStopEscapePropagationDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }], propDecorators: { onEscapeKey: [{
                type: HostListener,
                args: ['keyup.escape', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverHostDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverHostDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverHostDirective, isStandalone: true, providers: [ClrPopoverService, { provide: POPOVER_HOST_ORIGIN, useExisting: ElementRef }], hostDirectives: [{ directive: ClrStopEscapePropagationDirective }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverHostDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                    providers: [ClrPopoverService, { provide: POPOVER_HOST_ORIGIN, useExisting: ElementRef }],
                    hostDirectives: [ClrStopEscapePropagationDirective],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class ClrIfOpen {
    constructor(popoverService, template, container) {
        this.popoverService = popoverService;
        this.template = template;
        this.container = container;
        /**********
         * @property openChange
         *
         * @description
         * An event emitter that emits when the open property is set to allow for 2way binding when the directive is
         * used with de-structured / de-sugared syntax.
         */
        this.openChange = new EventEmitter(false);
        this.subscriptions = [];
        this.subscriptions.push(popoverService.openChange.subscribe(change => {
            // OPEN before overlay is built
            if (change) {
                container.createEmbeddedView(template);
                this.openChange.emit(change);
            }
        }), popoverService.popoverVisible.subscribe(change => {
            // CLOSE after overlay is destroyed
            if (!change) {
                container.clear();
                this.openChange.emit(change);
            }
        }));
    }
    /**
     * @description
     * A property that gets/sets ClrPopoverService.open with value.
     */
    get open() {
        return this.popoverService.open;
    }
    set open(value) {
        this.popoverService.open = value;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    /**
     * @description
     * Function that takes a boolean value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     *
     * @param value
     */
    updateView(value) {
        if (value) {
            this.container.createEmbeddedView(this.template);
        }
        else {
            this.container.clear();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfOpen, deps: [{ token: ClrPopoverService }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrIfOpen, isStandalone: true, selector: "[clrIfOpen]", inputs: { open: ["clrIfOpen", "open"] }, outputs: { openChange: "clrIfOpenChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfOpen, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfOpen]',
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { openChange: [{
                type: Output,
                args: ['clrIfOpenChange']
            }], open: [{
                type: Input,
                args: ['clrIfOpen']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverCloseButton {
    constructor(elementRef, popoverService) {
        this.elementRef = elementRef;
        this.popoverService = popoverService;
        this.closeChange = new EventEmitter();
        this.subscriptions = [];
        this.subscriptions.push(popoverService.openChange.pipe(filter(value => !value)).subscribe(() => {
            this.closeChange.emit();
        }));
    }
    handleClick(event) {
        this.popoverService.toggleWithEvent(event);
        this.popoverService.focusOrigin();
    }
    ngAfterViewInit() {
        this.popoverService.closeButtonRef = this.elementRef;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverCloseButton, deps: [{ token: i0.ElementRef }, { token: ClrPopoverService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverCloseButton, isStandalone: false, selector: "[clrPopoverCloseButton]", outputs: { closeChange: "clrPopoverOnCloseChange" }, host: { listeners: { "click": "handleClick($event)" }, properties: { "class.clr-smart-close-button": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverCloseButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverCloseButton]',
                    host: {
                        '[class.clr-smart-close-button]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: ClrPopoverService }], propDecorators: { closeChange: [{
                type: Output,
                args: ['clrPopoverOnCloseChange']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverOpenCloseButton {
    constructor(popoverService) {
        this.popoverService = popoverService;
        this.openCloseChange = new EventEmitter();
        this.subscriptions = [];
        this.subscriptions.push(popoverService.openChange.subscribe(change => {
            this.openCloseChange.emit(change);
        }));
    }
    handleClick(event) {
        this.popoverService.toggleWithEvent(event);
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverOpenCloseButton, deps: [{ token: ClrPopoverService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverOpenCloseButton, isStandalone: false, selector: "[clrPopoverOpenCloseButton]", outputs: { openCloseChange: "clrPopoverOpenCloseChange" }, host: { listeners: { "click": "handleClick($event)" }, properties: { "class.clr-smart-open-close": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverOpenCloseButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverOpenCloseButton]',
                    host: {
                        '[class.clr-smart-open-close]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }], propDecorators: { openCloseChange: [{
                type: Output,
                args: ['clrPopoverOpenCloseChange']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverModuleNext {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext, declarations: [ClrPopoverOrigin, ClrPopoverCloseButton, ClrPopoverOpenCloseButton], imports: [ClrPopoverContent, ClrIfOpen], exports: [ClrPopoverOrigin, ClrPopoverCloseButton, ClrPopoverOpenCloseButton, ClrPopoverContent, ClrIfOpen] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ClrPopoverContent, ClrIfOpen],
                    declarations: [ClrPopoverOrigin, ClrPopoverCloseButton, ClrPopoverOpenCloseButton],
                    exports: [ClrPopoverOrigin, ClrPopoverCloseButton, ClrPopoverOpenCloseButton, ClrPopoverContent, ClrIfOpen],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrIfOpen, ClrPopoverCloseButton, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverOpenCloseButton, ClrPopoverOrigin, ClrPopoverPosition, ClrPopoverService, ClrPopoverType, ClrStopEscapePropagationDirective, DROPDOWN_POSITIONS, POPOVER_HOST_ORIGIN, SIGNPOST_POSITIONS, TOOLTIP_POSITIONS, getConnectedPositions, getContentPosition, getOriginPosition, getPositionsArray, mapPopoverKeyToPosition };
//# sourceMappingURL=clr-angular-popover-common.mjs.map
