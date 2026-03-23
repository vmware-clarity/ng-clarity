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
    openAtPoint(point) {
        if (this._open) {
            this._open = false;
            this._openChange.next(false);
        }
        this.origin = point;
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
        this.scrollableParents = [];
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
        if (origin instanceof Element) {
            this.popoverService.origin = new ElementRef(origin);
        }
        else {
            this.popoverService.origin = origin;
        }
    }
    get positionStrategy() {
        return this.overlay
            .position()
            .flexibleConnectedTo(this.popoverService.origin)
            .setOrigin(this.popoverService.origin)
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
        }), this.overlayRef.keydownEvents().subscribe(event => {
            if (event && event.key && event.key === Keys.Escape && !hasModifierKey(event)) {
                event.preventDefault();
                this.closePopover();
            }
        }), this.popoverService.originPoint
            ? this.createPointBasedOutsideClickSubscription()
            : this.createElementBasedOutsideClickSubscription());
    }
    /**
     * Point-based origins (context menus) delay the subscription to avoid the
     * mouseup from the same right-click that opened the popover.
     */
    createPointBasedOutsideClickSubscription() {
        return timer(500)
            .pipe(switchMap(() => this.overlayRef.outsidePointerEvents()))
            .subscribe(event => {
            if (this.elementRef?.nativeElement?.contains(event.target)) {
                return;
            }
            if (this._outsideClickClose) {
                this.closePopover();
            }
        });
    }
    /**
     * Element-based origins close on outside clicks and suppress toggle-button
     * re-clicks so the popover doesn't immediately reopen.
     */
    createElementBasedOutsideClickSubscription() {
        return this.overlayRef.outsidePointerEvents().subscribe(event => {
            // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
            if (this.elementRef?.nativeElement?.contains(event.target)) {
                return;
            }
            // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
            const isToggleButton = this.popoverService.openEvent &&
                (this.popoverService.openEvent.target.contains(event.target) ||
                    this.popoverService.openEvent.target.parentElement.contains(event.target) ||
                    this.popoverService.openEvent.target === event.target);
            if (isToggleButton) {
                event.stopPropagation();
            }
            if (this._outsideClickClose || isToggleButton) {
                this.closePopover();
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
        this.popoverService.popoverVisibleEmit(false);
    }
    getScrollableParents(node) {
        let parent = node;
        const overflowScrollKeys = ['auto', 'scroll', 'clip'];
        const scrollableParents = [window.document];
        while (parent && !(parent instanceof HTMLHtmlElement)) {
            if (parent instanceof ShadowRoot) {
                parent = parent.host;
            }
            const { overflowY, overflowX } = window.getComputedStyle(parent);
            if (overflowScrollKeys.includes(overflowY) || overflowScrollKeys.includes(overflowX)) {
                scrollableParents.push(parent);
            }
            parent = parent.parentNode;
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
        if (this.popoverService.originPoint) {
            this.listenToScrollForPointOrigin();
        }
        else {
            this.listenToScrollForElementOrigin();
        }
    }
    // Point origins have no scrollable parent chain — close on any scroll.
    listenToScrollForPointOrigin() {
        this.zone.runOutsideAngular(() => {
            this.subscriptions.push(fromEvent(window, 'scroll', { passive: true, capture: true }).subscribe(() => {
                this.zone.run(() => this.closePopover());
            }));
        });
    }
    // Element origins track ancestor scroll containers to reposition or close.
    listenToScrollForElementOrigin() {
        const originEl = this.getRootPopover(this)?.popoverService?.originElement?.nativeElement;
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
