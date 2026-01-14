import * as i0 from '@angular/core';
import { OnInit, OnDestroy, ElementRef, ChangeDetectorRef, QueryList, EventEmitter, Renderer2, AfterContentInit, AfterViewInit, ViewContainerRef, TemplateRef, NgZone, Type, InjectionToken, OnChanges, SimpleChanges, DoCheck, IterableDiffers, TrackByFunction, EnvironmentInjector, Injector, RendererFactory2, EmbeddedViewRef, AfterViewChecked, AfterContentChecked, SimpleChange, PipeTransform } from '@angular/core';
import * as rxjs from 'rxjs';
import { Observable, Subject, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import * as i2 from '@angular/common';
import { NgForOfContext } from '@angular/common';
import * as _angular_cdk_overlay from '@angular/cdk/overlay';
import { OverlayContainer, Overlay, ConnectedPosition } from '@angular/cdk/overlay';
import * as _clr_angular from '@clr/angular';
import { AnimationMetadata, AnimationEvent, AnimationBuilder } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';
import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualForOfContext, ScrollDispatcher, ViewportRuler, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import * as i4 from '@angular/forms';
import { NgControl, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, SelectMultipleControlValueAccessor, FormGroupName, NgModelGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { CdkDrag, DragDropConfig, DragDrop } from '@angular/cdk/drag-drop';
import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import * as i6 from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type IconSvgString = string;
type IconNameString = string;
type IconAliases = string[];
interface IconShapeCollection {
    outline?: IconSvgString;
    solid?: IconSvgString;
    outlineBadged?: IconSvgString;
    outlineAlerted?: IconSvgString;
    solidBadged?: IconSvgString;
    solidAlerted?: IconSvgString;
}
type IconShapeTuple = [IconNameString, IconSvgString | IconShapeCollection];
interface IconShapeSources {
    [key: string]: IconShapeTuple;
}
interface IconRegistrySources {
    [key: string]: IconSvgString | IconShapeCollection;
}
type IconRegistry = Partial<IconRegistrySources>;
type NameOfIconToAlias = string;
type IconAlias = [NameOfIconToAlias, IconAliases];
type Directions = 'up' | 'down' | 'left' | 'right';
type Orientations = 'horizontal' | 'vertical';
type StatusTypes = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

declare class ClrIcon implements OnInit, OnDestroy {
    el: ElementRef<HTMLElement>;
    private cdr;
    iconSVG: string;
    isStringIcon: boolean;
    private _shape;
    private _size;
    private _direction;
    private _flip;
    private _solid;
    private _status;
    private _inverse;
    private _badge;
    private subscription;
    private _priorShape;
    constructor(el: ElementRef<HTMLElement>, cdr: ChangeDetectorRef);
    get shape(): string;
    set shape(value: string);
    get size(): string;
    set size(value: string);
    get direction(): string;
    set direction(value: string);
    get flip(): Orientations;
    set flip(value: Orientations);
    get solid(): boolean;
    set solid(value: boolean);
    get status(): string;
    set status(value: string);
    get inverse(): boolean;
    set inverse(value: boolean);
    get badge(): string | boolean;
    set badge(value: string | boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    updateIcon(): void;
    updateIconSize(value: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIcon, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrIcon, "clr-icon, cds-icon", never, { "shape": { "alias": "shape"; "required": false; }; "size": { "alias": "size"; "required": false; }; "direction": { "alias": "direction"; "required": false; }; "flip": { "alias": "flip"; "required": false; }; "solid": { "alias": "solid"; "required": false; }; "status": { "alias": "status"; "required": false; }; "inverse": { "alias": "inverse"; "required": false; }; "badge": { "alias": "badge"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_solid: unknown;
    static ngAcceptInputType_inverse: unknown;
}

declare enum ClrBadgeColors {
    None = "",
    Info = "info",
    Warning = "warning",
    Danger = "danger",
    Success = "success",
    Gray = "gray",
    Blue = "blue",
    LightBlue = "light-blue",
    Orange = "orange",
    Purple = "purple"
}
declare class ClrBadge {
    color: ClrBadgeColors | string;
    get colorClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBadge, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBadge, "clr-badge", never, { "color": { "alias": "clrColor"; "required": false; }; }, {}, never, ["*"], true, never>;
}

declare enum ClrLabelColors {
    None = "",
    Info = "info",
    Warning = "warning",
    Danger = "danger",
    Success = "success",
    Gray = "gray",
    Blue = "blue",
    LightBlue = "light-blue",
    Orange = "orange",
    Purple = "purple"
}
declare class ClrLabel {
    color: ClrLabelColors | string;
    badgeText: string;
    textContent: string;
    clickable: boolean;
    disabled: boolean;
    get colorClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrLabel, "clr-label", never, { "color": { "alias": "clrColor"; "required": false; }; "badgeText": { "alias": "clrBadgeText"; "required": false; }; "textContent": { "alias": "clrText"; "required": false; }; "clickable": { "alias": "clrClickable"; "required": false; }; "disabled": { "alias": "clrDisabled"; "required": false; }; }, {}, never, ["*"], true, never>;
}

interface ClrCommonStrings {
    /**
     * Open button
     */
    open: string;
    /**
     * Close button
     */
    close: string;
    /**
     * Show button
     */
    show: string;
    /**
     * Hide button
     */
    hide: string;
    /**
     * Apply button
     */
    apply: string;
    /**
     * Cancel button
     */
    cancel: string;
    /**
     * Expandable components: expand caret
     */
    expand: string;
    /**
     * Expandable components: collapse caret
     */
    collapse: string;
    /**
     * Overflow menus: ellipsis button
     */
    more: string;
    /**
     * Selectable components: checkbox or radio
     */
    select: string;
    /**
     * Selectable components: checkbox to select all
     */
    selectAll: string;
    /**
     * Pagination: previous button
     */
    previous: string;
    /**
     * Pagination: next button
     */
    next: string;
    /**
     * Pagination: go to current
     */
    current: string;
    /**
     * Alert levels: info
     */
    info: string;
    /**
     * Alert levels: success
     */
    success: string;
    /**
     * Alert levels: warning
     */
    warning: string;
    /**
     * Alert levels: danger
     */
    danger: string;
    /**
     * Alert levels: neutral
     */
    neutral: string;
    /**
     * Alert levels: unknown
     */
    unknown: string;
    /**
     * Datagrid: row actions
     */
    rowActions: string;
    /**
     * Datagrid: pick columns
     */
    pickColumns: string;
    /**
     * Datagrid: show columns
     */
    showColumns: string;
    /**
     * Datagrid: sort of columns
     */
    sortColumn: string;
    /**
     * Datagrid: first page
     */
    firstPage: string;
    /**
     * Datagrid: last page
     */
    lastPage: string;
    /**
     * Datagrid: next page
     */
    nextPage: string;
    /**
     * Datagrid: previous page
     */
    previousPage: string;
    /**
     * Datagrid: previous page
     */
    currentPage: string;
    /**
     * Datagird: total pages
     */
    totalPages: string;
    /**
     * Datagrid string filter: filter items
     */
    filterItems: string;
    /**
     * Datagrid numeric filter: min
     */
    minValue: string;
    /**
     * Datagrid numeric filter: max
     */
    maxValue: string;
    /**
     * Datagrid filter toggle button
     */
    datagridFilterAriaLabel: string;
    /**
     * Datagrid filter label
     */
    datagridFilterLabel: string;
    /**
     * Datagrid filter dialog
     */
    datagridFilterDialogAriaLabel: string;
    /**
     * Datagrid column handler string
     */
    columnSeparatorAriaLabel: string;
    /**
     * Datagrid column resize handler string
     */
    columnSeparatorDescription: string;
    /**
     * Numeric filter from label string
     */
    fromLabel: string;
    /**
     * Numeric filter to label string
     */
    toLabel: string;
    /**
     * Modal start of content
     */
    modalContentStart: string;
    /**
     * Modal end of content
     */
    modalContentEnd: string;
    /**
     * Side Panel pin dialog
     */
    sidePanelPin: string;
    /**
     * Datagrid Show columns menu description
     */
    showColumnsMenuDescription: string;
    /**
     * Datagrid Show columns / All columns selected confirmation
     */
    allColumnsSelected: string;
    /**
     * Signpost Toggle Button
     */
    signpostToggle: string;
    /**
     * Signpost Close Button
     * (used inside signpost content components)
     */
    signpostClose: string;
    loading: string;
    /**
     * Datagrid: detail pane start content for screen reader
     */
    detailPaneStart: string;
    /**
     * Datagrid: detail pane end content for screen reader
     */
    detailPaneEnd: string;
    /**
     * Datagrid: Single selection header
     */
    singleSelectionAriaLabel: string;
    /**
     * Datagrid: Single actionable header
     */
    singleActionableAriaLabel: string;
    /**
     * Datagrid: Expandable row
     */
    detailExpandableAriaLabel: string;
    /**
     * Alert: Close alert button
     */
    alertCloseButtonAriaLabel: string;
    /**
     * Alert: Next Alert button
     */
    alertNextAlertAriaLabel: string;
    /**
     * Alert: Previous Alert button
     */
    alertPreviousAlertAriaLabel: string;
    /**
     * Datepicker UI labels
     */
    datepickerDialogLabel: string;
    datepickerToggleChooseDateLabel: string;
    datepickerToggleChangeDateLabel: string;
    datepickerPreviousMonth: string;
    datepickerCurrentMonth: string;
    datepickerNextMonth: string;
    datepickerPreviousDecade: string;
    datepickerNextDecade: string;
    datepickerCurrentDecade: string;
    datepickerSelectMonthText: string;
    datepickerSelectYearText: string;
    datepickerSelectedLabel: string;
    /**
     * Stack View: Record has changed
     */
    stackViewChanged: string;
    responsiveNavToggleOpen: string;
    responsiveNavToggleClose: string;
    responsiveNavOverflowOpen: string;
    responsiveNavOverflowClose: string;
    verticalNavToggle: string;
    /**
     * Timeline Steps
     */
    timelineStepNotStarted: string;
    timelineStepCurrent: string;
    timelineStepSuccess: string;
    timelineStepError: string;
    timelineStepProcessing: string;
    datagridExpandableBeginningOf: string;
    datagridExpandableEndOf: string;
    datagridExpandableRowContent: string;
    datagridExpandableRowsHelperText: string;
    /**
     * Combobox Searching Text
     */
    comboboxSearching: string;
    comboboxDelete: string;
    comboboxSelection: string;
    comboboxSelected: string;
    comboboxNoResults: string;
    comboboxOpen: string;
    /**
     * Wizard: Screen-reader text for "step" (read before step number).
     */
    wizardStep: string;
    /**
     * Wizard: Screen-reader text for current step.
     */
    wizardStepCurrent: string;
    /**
     * Wizard: Screen-reader text for completed step.
     */
    wizardStepSuccess: string;
    /**
     * Wizard: Screen-reader text for step with error.
     */
    wizardStepError: string;
    /**
     * Wizard: Aria-label for the stepnav section.
     */
    wizardStepnavAriaLabel: string;
    /**
     * Password Input
     * Screen-reader text for the hide/show password field button.
     */
    passwordHide: string;
    passwordShow: string;
    /**
     * Datagrid footer; sr-only text after the number of selected rows.
     */
    selectedRows: string;
    stepComplete: string;
    stepError: string;
    browse: string;
    fileCount: string;
    clearFile: string;
    clearFiles: string;
    selectedTreeNode: string;
    unselectedTreeNode: string;
    breadcrumbsLabel: string;
    expandBreadcrumbsLabel: string;
}

declare class ClrCommonStringsService {
    private _strings;
    /**
     * Access to all of the keys as strings
     */
    get keys(): Readonly<ClrCommonStrings>;
    /**
     * Allows you to pass in new overrides for localization
     */
    localize(overrides: Partial<ClrCommonStrings>): void;
    /**
     * Parse a string with a set of tokens to replace
     */
    parse(source: string, tokens?: {
        [key: string]: string;
    }): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCommonStringsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrCommonStringsService>;
}

interface AlertInfoObject {
    shape: string;
    cssClass: string;
    title: string;
}

declare class AlertIconAndTypesService {
    private commonStrings;
    private defaultIconShape;
    private _alertIconShape;
    private _alertType;
    constructor(commonStrings: ClrCommonStringsService);
    get alertType(): string;
    set alertType(val: string);
    get alertIconShape(): string;
    set alertIconShape(val: string);
    get alertIconTitle(): string;
    iconInfoFromType(type: string): AlertInfoObject;
    static ɵfac: i0.ɵɵFactoryDeclaration<AlertIconAndTypesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AlertIconAndTypesService>;
}

declare class MultiAlertService {
    private subscription;
    private allAlerts;
    private _change;
    private _current;
    /**
     * The Observable that lets other classes subscribe to changes
     */
    get changes(): Observable<number>;
    get current(): number;
    set current(index: number);
    get activeAlerts(): ClrAlert[];
    get currentAlert(): ClrAlert;
    set currentAlert(alert: ClrAlert);
    get count(): number;
    manage(alerts: QueryList<ClrAlert>): void;
    next(): void;
    previous(): void;
    open(): void;
    close(isCurrentAlert: boolean): void;
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiAlertService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MultiAlertService>;
}

declare class ClrAlert implements OnInit, OnDestroy {
    private iconService;
    private cdr;
    private multiAlertService;
    private commonStrings;
    private renderer;
    private hostElement;
    isSmall: boolean;
    closable: boolean;
    isAppLevel: boolean;
    clrCloseButtonAriaLabel: string;
    _closedChanged: EventEmitter<boolean>;
    _closed: boolean;
    private _hidden;
    private subscriptions;
    private _isLightweight;
    private _origAlertType;
    constructor(iconService: AlertIconAndTypesService, cdr: ChangeDetectorRef, multiAlertService: MultiAlertService, commonStrings: ClrCommonStringsService, renderer: Renderer2, hostElement: ElementRef<HTMLElement>);
    get isLightweight(): boolean;
    set isLightweight(val: boolean);
    get alertType(): string;
    set alertType(val: string);
    set alertIconShape(value: string);
    set closed(value: boolean);
    get alertClass(): string;
    get hidden(): boolean;
    set hidden(value: boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    configAlertType(val: string): void;
    open(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlert, [null, null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlert, "clr-alert", never, { "isSmall": { "alias": "clrAlertSizeSmall"; "required": false; }; "closable": { "alias": "clrAlertClosable"; "required": false; }; "isAppLevel": { "alias": "clrAlertAppLevel"; "required": false; }; "clrCloseButtonAriaLabel": { "alias": "clrCloseButtonAriaLabel"; "required": false; }; "isLightweight": { "alias": "clrAlertLightweight"; "required": false; }; "alertType": { "alias": "clrAlertType"; "required": false; }; "alertIconShape": { "alias": "clrAlertIcon"; "required": false; }; "closed": { "alias": "clrAlertClosed"; "required": false; }; }, { "_closedChanged": "clrAlertClosedChange"; }, never, ["*"], false, never>;
}

declare class ClrAlertItem {
    iconService: AlertIconAndTypesService;
    constructor(iconService: AlertIconAndTypesService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlertItem, "clr-alert-item", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAlerts implements AfterContentInit, OnDestroy {
    multiAlertService: MultiAlertService;
    currentAlertChange: EventEmitter<ClrAlert>;
    currentAlertIndexChange: EventEmitter<number>;
    private subscriptions;
    constructor(multiAlertService: MultiAlertService);
    set allAlerts(value: QueryList<ClrAlert>);
    /**
     * Input/Output to support two way binding on current alert index
     */
    set _inputCurrentIndex(index: number);
    get currentAlertIndex(): number;
    set currentAlertIndex(index: number);
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert(): ClrAlert;
    set currentAlert(alert: ClrAlert);
    /**
     * Ensure we are only dealing with alerts that have not been closed yet
     */
    get alerts(): ClrAlert[];
    get currentAlertType(): string;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlerts, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlerts, "clr-alerts", never, { "_inputCurrentIndex": { "alias": "clrCurrentAlertIndex"; "required": false; }; "currentAlert": { "alias": "clrCurrentAlert"; "required": false; }; }, { "currentAlertChange": "clrCurrentAlertChange"; "currentAlertIndexChange": "clrCurrentAlertIndexChange"; }, ["allAlerts"], ["clr-alert"], false, never>;
}

declare class ClrAlertsPager implements OnInit, OnDestroy {
    multiAlertService: MultiAlertService;
    commonStrings: ClrCommonStringsService;
    currentAlertChange: EventEmitter<ClrAlert>;
    currentAlertIndexChange: EventEmitter<number>;
    private multiAlertServiceChanges;
    constructor(multiAlertService: MultiAlertService, commonStrings: ClrCommonStringsService);
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert(): ClrAlert;
    set currentAlert(alert: ClrAlert);
    /**
     * Input/Output to support two way binding on current alert index
     */
    get currentAlertIndex(): number;
    set currentAlertIndex(index: number);
    protected get previousAlertAriaLabel(): string;
    protected get nextAlertAriaLabel(): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    pageUp(): void;
    pageDown(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertsPager, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlertsPager, "clr-alerts-pager", never, { "currentAlert": { "alias": "clrCurrentAlert"; "required": false; }; "currentAlertIndex": { "alias": "clrCurrentAlertIndex"; "required": false; }; }, { "currentAlertChange": "clrCurrentAlertChange"; "currentAlertIndexChange": "clrCurrentAlertIndexChange"; }, never, never, false, never>;
}

/**
 * @remark
 * This directive is used only of selectin alert text.
 */
declare class ClrAlertText {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertText, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAlertText, ".alert-text", never, {}, {}, never, never, false, never>;
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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPopoverModuleNext, [typeof ClrPopoverAnchor, typeof ClrPopoverCloseButton, typeof ClrPopoverOpenCloseButton], [typeof ClrPopoverContent], [typeof ClrPopoverAnchor, typeof ClrPopoverCloseButton, typeof ClrPopoverOpenCloseButton, typeof ClrPopoverContent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPopoverModuleNext>;
}

declare enum ArrowKeyDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}

declare abstract class FocusableItem$1 {
    id: string;
    disabled?: boolean;
    up?: FocusableItem$1 | Observable<FocusableItem$1>;
    down?: FocusableItem$1 | Observable<FocusableItem$1>;
    left?: FocusableItem$1 | Observable<FocusableItem$1>;
    right?: FocusableItem$1 | Observable<FocusableItem$1>;
    abstract focus(): void;
    abstract blur(): void;
    abstract activate?(): void;
}

declare class FocusService$1 {
    private renderer;
    private _current;
    private _unlistenFuncsMap;
    constructor(renderer: Renderer2);
    get current(): FocusableItem$1;
    reset(first: FocusableItem$1): void;
    registerContainer(el: HTMLElement): void;
    moveTo(item: FocusableItem$1): void;
    move(direction: ArrowKeyDirection): boolean;
    activateCurrent(): boolean;
    detachListeners(el: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusService$1, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FocusService$1>;
}

declare class DropdownFocusHandler implements OnDestroy, FocusableItem$1 {
    private renderer;
    private parent;
    private popoverService;
    private focusService;
    private platformId;
    id: string;
    right?: Observable<FocusableItem$1>;
    down?: Observable<FocusableItem$1>;
    up?: Observable<FocusableItem$1>;
    private _trigger;
    private _container;
    private children;
    private _unlistenFuncs;
    constructor(renderer: Renderer2, parent: DropdownFocusHandler, popoverService: ClrPopoverService, focusService: FocusService$1, platformId: any);
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
    addChildren(children: FocusableItem$1[]): void;
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
    popoverService: ClrPopoverService;
    focusHandler: DropdownFocusHandler;
    isMenuClosable: boolean;
    private subscriptions;
    constructor(parent: ClrDropdown, popoverService: ClrPopoverService, focusHandler: DropdownFocusHandler, cdr: ChangeDetectorRef, dropdownService: RootDropdownService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdown, [{ optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdown, "clr-dropdown", never, { "isMenuClosable": { "alias": "clrCloseMenuOnItemClick"; "required": false; }; }, {}, never, ["*"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrDropdownMenu implements AfterContentInit, OnDestroy {
    private focusHandler;
    private elementRef;
    private popoverService;
    private popoverContent;
    items: QueryList<FocusableItem$1>;
    constructor(parentHost: ElementRef<HTMLElement>, nested: ClrDropdownMenu, focusHandler: DropdownFocusHandler, elementRef: ElementRef, popoverService: ClrPopoverService, popoverContent: ClrPopoverContent);
    get isOffScreen(): boolean;
    set position(position: string | ClrPopoverPosition);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownMenu, [{ optional: true; }, { optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdownMenu, "clr-dropdown-menu", never, { "position": { "alias": "clrPosition"; "required": false; }; }, {}, ["items"], ["*"], false, [{ directive: typeof ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare class ClrDropdownTrigger {
    private popoverService;
    isRootLevelToggle: boolean;
    constructor(dropdown: ClrDropdown, popoverService: ClrPopoverService, el: ElementRef<HTMLElement>, focusHandler: DropdownFocusHandler);
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
    constructor(dropdown: ClrDropdown, _dropdownService: RootDropdownService, focusableItem: FocusableItem$1, el: ElementRef, renderer: Renderer2);
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

declare class IfActiveService {
    /********
     * @property _currentChange
     *
     * @description
     * A RXJS Subject that updates and provides subscriptions to for the current current state of a component template
     * implemting the IfActive structural directive.
     *
     */
    private _currentChange;
    /*********
     * @property _current
     *
     * @description
     * A property holding the current value for current/closed state of an IfActive structural directive.
     */
    private _current;
    /*********
     *
     * @description
     * A getter function that provides an observable for the _current Subject.
     *
     */
    get currentChange(): Observable<number>;
    /*********
     *
     * @description
     * A property that gets/sets the current state of _current for this instance of IfActive structural directive.
     * And, broadcasts the new value to all subscribers.
     *
     */
    get current(): number;
    set current(value: number);
    static ɵfac: i0.ɵɵFactoryDeclaration<IfActiveService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfActiveService>;
}

declare class ClrIfActive implements OnDestroy {
    private ifActiveService;
    private id;
    private template;
    private container;
    /**********
     * @property activeChange
     *
     * @description
     * An event emitter that emits when the active property is set to allow for 2way binding when the directive is
     * used with de-structured / de-sugared syntax.
     *
     */
    activeChange: EventEmitter<boolean>;
    private subscription;
    private wasActive;
    constructor(ifActiveService: IfActiveService, id: number, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @description
     * A property that gets/sets IfActiveService.active with value.
     *
     */
    get active(): boolean | string;
    set active(value: boolean | string);
    ngOnDestroy(): void;
    /**
     * @description
     * Function that takes a any value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     */
    updateView(value: boolean): void;
    private checkAndUpdateView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfActive, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfActive, "[clrIfActive]", never, { "active": { "alias": "clrIfActive"; "required": false; }; }, { "activeChange": "clrIfActiveChange"; }, never, never, false, never>;
}

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
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfOpen, "[clrIfOpen]", never, { "open": { "alias": "clrIfOpen"; "required": false; }; }, { "openChange": "clrIfOpenChange"; }, never, never, false, never>;
}

/**
 * This is an abstract class because we need it to still be a valid token for dependency injection after transpiling.
 * This does not mean you should extend it, simply implementing it is fine.
 */
declare abstract class LoadingListener {
    abstract loadingStateChange(state: ClrLoadingState | string): void;
}

declare enum ClrLoadingState {
    DEFAULT = 0,
    LOADING = 1,
    SUCCESS = 2,
    ERROR = 3
}
declare class ClrLoading implements OnDestroy {
    private listener;
    static ngAcceptInputType_loadingState: boolean | ClrLoadingState | null | string;
    private _loadingState;
    constructor(listener: LoadingListener);
    get loadingState(): boolean | string | ClrLoadingState;
    set loadingState(value: boolean | string | ClrLoadingState);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoading, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLoading, "[clrLoading]", never, { "loadingState": { "alias": "clrLoading"; "required": false; }; }, {}, never, never, false, never>;
}

declare class IfExpandService implements LoadingListener {
    expandable: number;
    hasExpandTemplate: boolean;
    protected _loading: boolean;
    protected _expanded: boolean;
    protected _expandChange: Subject<boolean>;
    get loading(): boolean;
    set loading(value: boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    get expandChange(): Observable<boolean>;
    toggle(): void;
    loadingStateChange(state: ClrLoadingState): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IfExpandService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfExpandService>;
}

declare class ClrIfExpanded implements OnInit, OnDestroy {
    private template;
    private container;
    private el;
    private renderer;
    private expand;
    expandedChange: EventEmitter<boolean>;
    private _expanded;
    /**
     * Subscriptions to all the services and queries changes
     */
    private _subscriptions;
    constructor(template: TemplateRef<any>, container: ViewContainerRef, el: ElementRef<HTMLElement>, renderer: Renderer2, expand: IfExpandService);
    get expanded(): boolean | string;
    set expanded(value: boolean | string);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private updateView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfExpanded, [{ optional: true; }, null, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfExpanded, "[clrIfExpanded]", never, { "expanded": { "alias": "clrIfExpanded"; "required": false; }; }, { "expandedChange": "clrIfExpandedChange"; }, never, never, false, never>;
}

declare const CONDITIONAL_DIRECTIVES: Type<any>[];
declare class ClrConditionalModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrConditionalModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrConditionalModule, [typeof ClrIfActive, typeof ClrIfOpen, typeof ClrIfExpanded], [typeof i2.CommonModule], [typeof ClrIfActive, typeof ClrIfOpen, typeof ClrIfExpanded]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrConditionalModule>;
}

declare const CLR_DROPDOWN_DIRECTIVES: Type<any>[];
declare class ClrDropdownModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDropdownModule, [typeof ClrDropdown, typeof ClrDropdownMenu, typeof ClrDropdownTrigger, typeof ClrDropdownItem], [typeof i2.CommonModule, typeof ClrIcon], [typeof ClrDropdown, typeof ClrDropdownMenu, typeof ClrDropdownTrigger, typeof ClrDropdownItem, typeof ClrConditionalModule, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDropdownModule>;
}

declare class ClrSpinner {
    private _inline;
    private _inverse;
    private _small;
    private _medium;
    /**
     * Default class for all spinners. This class is always true
     */
    get spinnerClass(): boolean;
    get inlineClass(): boolean;
    set clrInline(value: boolean | string);
    get inverseClass(): boolean;
    set clrInverse(value: boolean | string);
    get smallClass(): boolean;
    set clrSmall(value: boolean | string);
    /**
     * When clrSmall & clrMedium are set both to true.
     * The CSS with high priority will be small - so medium size will be ignored.
     *
     * For this reason if clrSmall is set we won't add clrMedium class.
     *
     * NOTE: This is dictated by the CSS rules.
     * DON'T USE clrSmall & clrMedium to toggle classes. This could change without notice.
     *
     * Also there is no logical need to have both of them set to TRUE or FALSE.
     */
    get mediumClass(): boolean;
    set clrMedium(value: boolean | string);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSpinner, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSpinner, "clr-spinner", never, { "clrInline": { "alias": "clrInline"; "required": false; }; "clrInverse": { "alias": "clrInverse"; "required": false; }; "clrSmall": { "alias": "clrSmall"; "required": false; }; "clrMedium": { "alias": "clrMedium"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const CLR_SPINNER_DIRECTIVES: Type<any>[];
declare class ClrSpinnerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSpinnerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSpinnerModule, [typeof ClrSpinner], [typeof i2.CommonModule], [typeof ClrSpinner]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSpinnerModule>;
}

declare const CLR_ALERT_DIRECTIVES: Type<any>[];
declare class ClrAlertModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrAlertModule, [typeof ClrAlert, typeof ClrAlertItem, typeof ClrAlerts, typeof ClrAlertsPager, typeof ClrAlertText], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrDropdownModule, typeof ClrSpinnerModule], [typeof ClrAlert, typeof ClrAlertItem, typeof ClrAlerts, typeof ClrAlertsPager, typeof ClrAlertText]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrAlertModule>;
}

declare class ClrEmphasisModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEmphasisModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrEmphasisModule, never, [typeof ClrBadge, typeof ClrLabel], [typeof ClrAlertModule, typeof ClrBadge, typeof ClrLabel]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrEmphasisModule>;
}

declare function collapse(): AnimationMetadata[];

declare class DomAdapter {
    userDefinedWidth(element: HTMLElement): number;
    scrollBarWidth(element: any): number;
    scrollWidth(element: any): any;
    computedHeight(element: any): number;
    clientRect(element: any): DOMRect;
    minWidth(element: any): number;
    focus(element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DomAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DomAdapter>;
}

declare class BaseExpandableAnimation {
    protected element: ElementRef<HTMLElement>;
    protected domAdapter: DomAdapter;
    protected renderer: Renderer2;
    startHeight: number;
    constructor(element: ElementRef<HTMLElement>, domAdapter: DomAdapter, renderer: Renderer2);
    updateStartHeight(): void;
    initAnimationEffects(): void;
    cleanupAnimationEffects(cancelAnimations?: boolean): void;
    private cancelElementAnimations;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseExpandableAnimation, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseExpandableAnimation, never, never, {}, {}, never, never, true, never>;
}

declare class ClrExpandableAnimation extends BaseExpandableAnimation {
    clrExpandTrigger: boolean;
    get expandAnimation(): {
        value: boolean;
        params: {
            startHeight: number;
        };
    };
    animationStart(event: AnimationEvent): void;
    animationDone(event: AnimationEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrExpandableAnimation, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrExpandableAnimation, "clr-expandable-animation", never, { "clrExpandTrigger": { "alias": "clrExpandTrigger"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const EXPANDABLE_ANIMATION_DIRECTIVES: Type<any>[];

declare function fade(opacity?: number): AnimationMetadata[];

declare function fadeSlide(direction: string): AnimationMetadata[];

declare function slide(direction: string): AnimationMetadata[];

declare const CLR_LOADING_DIRECTIVES: Type<any>[];
declare class ClrLoadingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoadingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrLoadingModule, [typeof ClrLoading], [typeof i2.CommonModule], [typeof ClrLoading]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrLoadingModule>;
}

declare const commonStringsDefault: ClrCommonStrings;

declare class ClrFocusOnViewInit implements AfterViewInit, OnDestroy {
    private el;
    private platformId;
    private focusOnViewInit;
    private renderer;
    private document;
    private directFocus;
    private destroy$;
    private _isEnabled;
    constructor(el: ElementRef<HTMLElement>, platformId: any, focusOnViewInit: boolean, document: any, renderer: Renderer2, ngZone: NgZone);
    set isEnabled(value: boolean | string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private focus;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFocusOnViewInit, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFocusOnViewInit, "[clrFocusOnViewInit]", never, { "isEnabled": { "alias": "clrFocusOnViewInit"; "required": false; }; }, {}, never, never, false, never>;
}

declare const FOCUS_ON_VIEW_INIT: InjectionToken<boolean>;

declare const FOCUS_ON_VIEW_INIT_DIRECTIVES: Type<any>[];
declare class ClrFocusOnViewInitModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFocusOnViewInitModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrFocusOnViewInitModule, [typeof ClrFocusOnViewInit], [typeof i2.CommonModule], [typeof ClrFocusOnViewInit]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrFocusOnViewInitModule>;
}

declare class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, focusTrapFactory: FocusTrapFactory, document: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStandaloneCdkTrapFocus, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStandaloneCdkTrapFocus, never, never, {}, {}, never, never, true, never>;
}

/**
 * @description
 *
 * Developers should explicitly add this service to providers; it then can be injected
 * into a constructor and used as a notifier for the `takeUntil` operator. This eliminates
 * the need for boilerplates with subscriptions, and we don't need to implement the `OnDestroy`
 * interface and teardown subscriptions there.
 *
 * This can be used as follows:
 * ```ts
 * @Component({
 *   selector: 'clr-button-group',
 *   templateUrl: 'button-group.html',
 *   providers: [ClrDestroyService],
 * })
 * export class ClrButtonGroup {
 *   constructor(public buttonGroupNewService: ButtonInGroupService, private destroy$: ClrDestroyService) {}
 *
 *   ngAfterContentInit() {
 *     this.buttonGroupNewService.changes.pipe(takeUntil(this.destroy$)).subscribe(button => this.rearrangeButton(button));
 *   }
 * }
 * ```
 */
declare class ClrDestroyService extends Subject<void> implements OnDestroy {
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDestroyService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrDestroyService>;
}

/**
 * Enumeration representing the sorting order of a datagrid column. It is a constant Enum,
 * i.e. each value needs to be treated as a `number`, starting at index 0.
 *
 * @export
 * @enum {number}
 */
declare enum ClrDatagridSortOrder {
    UNSORTED = 0,
    ASC = 1,
    DESC = -1
}

interface ClrDatagridComparatorInterface<T> {
    compare(a: T, b: T): number;
}

interface ClrDatagridFilterInterface<T, S = any> {
    readonly state?: S;
    changes: Observable<any>;
    isActive(): boolean;
    accepts(item: T): boolean;
    equals?(other: ClrDatagridFilterInterface<T, any>): boolean;
}

interface Closable {
    close(): void;
}
declare class ModalStackService {
    private readonly platformId;
    private readonly modalStack;
    private readonly keyUpEventListener;
    constructor(platformId: unknown);
    trackModalOpen(openedModal: Closable): void;
    trackModalClose(closedModal: Closable): void;
    private onKeyUp;
    static ɵfac: i0.ɵɵFactoryDeclaration<ModalStackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ModalStackService>;
}

declare class DetailService {
    private readonly modalStackService;
    id: string;
    private preventScroll;
    private toggleState;
    private cache;
    private button;
    private _enabled;
    private _state;
    constructor(modalStackService: ModalStackService);
    get enabled(): boolean;
    set enabled(state: boolean);
    get preventFocusScroll(): boolean;
    set preventFocusScroll(preventScroll: boolean);
    get state(): any;
    get stateChange(): Observable<boolean | null>;
    get isOpen(): boolean;
    open(item: any, button?: HTMLButtonElement): void;
    close(): void;
    returnFocus(): void;
    toggle(item: any, button?: HTMLButtonElement): void;
    isRowOpen(item: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DetailService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DetailService>;
}

declare class StateDebouncer {
    private nbChanges;
    /**
     * The Observable that lets other classes subscribe to global state changes
     */
    private _change;
    get change(): Observable<void>;
    changeStart(): void;
    changeDone(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateDebouncer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateDebouncer>;
}

declare class Page {
    private stateDebouncer;
    activated: boolean;
    /**
     * Page size, a value of 0 means no pagination
     */
    private _size;
    /**
     * Total items (needed to guess the last page)
     */
    private _totalItems?;
    /**
     * Last page
     */
    private _last;
    /**
     * Current page
     */
    private _current;
    /**
     * The Observable that lets other classes subscribe to page changes
     */
    private _change;
    private preventEmit;
    private _sizeChange;
    constructor(stateDebouncer: StateDebouncer);
    get size(): number;
    set size(size: number);
    get totalItems(): number;
    set totalItems(total: number);
    get last(): number;
    set last(page: number);
    get change(): Observable<number>;
    get sizeChange(): Observable<number>;
    get current(): number;
    set current(page: number);
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem(): number;
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem(): number;
    /**
     * Moves to the previous page if it exists
     */
    previous(): void;
    /**
     * Moves to the next page if it exists
     */
    next(): void;
    /**
     * Resets the page size to 0
     */
    resetPageSize(preventEmit?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Page, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Page>;
}

declare class FiltersProvider<T = any> {
    private _page;
    private stateDebouncer;
    /**
     * This subject is the list of filters that changed last, not the whole list.
     * We emit a list rather than just one filter to allow batch changes to several at once.
     */
    private _change;
    /**
     * List of all filters, whether they're active or not
     */
    private _all;
    constructor(_page: Page, stateDebouncer: StateDebouncer);
    get change(): Observable<ClrDatagridFilterInterface<T>[]>;
    /**
     * Tests if at least one filter is currently active
     */
    hasActiveFilters(): boolean;
    /**
     * Returns a list of all currently active filters
     */
    getActiveFilters(): ClrDatagridFilterInterface<T>[];
    /**
     * Registers a filter, and returns a deregistration function
     */
    add<F extends ClrDatagridFilterInterface<T>>(filter: F): RegisteredFilter<T, F>;
    /**
     * Accepts an item if it is accepted by all currently active filters
     */
    accepts(item: T): boolean;
    private resetPageAndEmitFilterChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<FiltersProvider<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FiltersProvider<any>>;
}
declare class RegisteredFilter<T, F extends ClrDatagridFilterInterface<T>> {
    filter: F;
    unregister: () => void;
    constructor(filter: F, unregister: () => void);
}

declare class Sort<T = any> {
    private stateDebouncer;
    /**
     * Currently active comparator
     */
    private _comparator;
    /**
     * Ascending order if false, descending if true
     */
    private _reverse;
    /**
     * The Observable that lets other classes subscribe to sort changes
     */
    private _change;
    constructor(stateDebouncer: StateDebouncer);
    get comparator(): ClrDatagridComparatorInterface<T>;
    set comparator(value: ClrDatagridComparatorInterface<T>);
    get reverse(): boolean;
    set reverse(value: boolean);
    get change(): Observable<Sort<T>>;
    /**
     * Sets a comparator as the current one, or toggles reverse if the comparator is already used. The
     * optional forceReverse input parameter allows to override that toggling behavior by sorting in
     * reverse order if `true`.
     *
     * @memberof Sort
     */
    toggle(sortBy: ClrDatagridComparatorInterface<T>, forceReverse?: boolean): void;
    /**
     * Clears the current sorting order
     */
    clear(): void;
    /**
     * Compares two objects according to the current comparator
     */
    compare(a: T, b: T): number;
    private emitChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<Sort<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Sort<any>>;
}

declare abstract class DatagridFilterRegistrar<T, F extends ClrDatagridFilterInterface<T>> implements OnDestroy {
    private filters;
    /**
     * @NOTEe Type `any` is set here to be able to pass templateStrictMode
     */
    registered: any;
    protected constructor(filters: FiltersProvider<T>);
    get filter(): F;
    ngOnDestroy(): void;
    setFilter(filter: F | RegisteredFilter<T, F>): void;
    deleteFilter(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFilterRegistrar<any, any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridFilterRegistrar<any, any>, never, never, {}, {}, never, never, true, never>;
}

declare class ClrDatagridColumn<T = any> extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>> implements OnDestroy, OnInit, OnChanges {
    private el;
    private _sort;
    private vcr;
    private detailService;
    private changeDetectorRef;
    private commonStrings;
    filterStringPlaceholder: string;
    filterNumberMaxPlaceholder: string;
    filterNumberMinPlaceholder: string;
    disableUnsort: boolean;
    sortOrderChange: EventEmitter<ClrDatagridSortOrder>;
    filterValueChange: EventEmitter<any>;
    titleContainer: ElementRef<HTMLElement>;
    /**
     * A custom filter for this column that can be provided in the projected content
     */
    customFilter: boolean;
    private _colType;
    private _field;
    /**
     * ClrDatagridComparatorInterface to use when sorting the column
     */
    private _sortBy;
    /**
     * Indicates how the column is currently sorted
     */
    private _sortOrder;
    private _sortDirection;
    private initFilterValue;
    private wrappedInjector;
    /**
     * Subscription to the sort service changes
     */
    private subscriptions;
    private _showSeparator;
    constructor(el: ElementRef<HTMLElement>, _sort: Sort<T>, filters: FiltersProvider<T>, vcr: ViewContainerRef, detailService: DetailService, changeDetectorRef: ChangeDetectorRef, commonStrings: ClrCommonStringsService);
    get isHidden(): boolean;
    get showSeparator(): boolean;
    set showSeparator(value: boolean);
    get colType(): "string" | "number";
    set colType(value: 'string' | 'number');
    get field(): string;
    set field(field: string);
    get sortBy(): ClrDatagridComparatorInterface<T> | string;
    set sortBy(comparator: ClrDatagridComparatorInterface<T> | string);
    get sortOrder(): ClrDatagridSortOrder;
    set sortOrder(value: ClrDatagridSortOrder);
    set updateFilterValue(newValue: string | [number, number]);
    set projectedFilter(custom: any);
    /**
     * Indicates if the column is sortable
     */
    get sortable(): boolean;
    get ariaSort(): "none" | "ascending" | "descending";
    get sortDirection(): 'up' | 'down' | null;
    /**
     * @NOTE type `any` here is to let us pass templateStrictMode, because in our code we try to handle
     * two types of filters String and Number with the same variable but both of them work with different
     * format we got an error for casting. We could not cast anything inside the template so to not mess the
     * casting, the last type is set to `any`
     *
     * Orignial types: string | [number, number]
     */
    get filterValue(): any;
    set filterValue(newValue: any);
    get _view(): any;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Sorts the datagrid based on this column
     */
    sort(reverse?: boolean): void;
    private listenForDetailPaneChanges;
    private setFilterToggleAriaLabel;
    private listenForSortingChanges;
    private setupDefaultFilter;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumn<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumn<any>, "clr-dg-column", never, { "filterStringPlaceholder": { "alias": "clrFilterStringPlaceholder"; "required": false; }; "filterNumberMaxPlaceholder": { "alias": "clrFilterNumberMaxPlaceholder"; "required": false; }; "filterNumberMinPlaceholder": { "alias": "clrFilterNumberMinPlaceholder"; "required": false; }; "disableUnsort": { "alias": "clrDgDisableUnsort"; "required": false; }; "colType": { "alias": "clrDgColType"; "required": false; }; "field": { "alias": "clrDgField"; "required": false; }; "sortBy": { "alias": "clrDgSortBy"; "required": false; }; "sortOrder": { "alias": "clrDgSortOrder"; "required": false; }; "updateFilterValue": { "alias": "clrFilterValue"; "required": false; }; }, { "sortOrderChange": "clrDgSortOrderChange"; "filterValueChange": "clrFilterValueChange"; }, ["projectedFilter"], ["clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter", "*"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

type ClrDatagridItemsIdentityFunction<T> = (item: T) => any;
declare class Items<T = any> {
    private _filters;
    private _sort;
    private _page;
    /**
     * Indicates if the data is currently loading
     */
    loading: boolean;
    /**
     * Subscriptions to the other providers changes.
     */
    private _filtersSub;
    private _sortSub;
    private _pageSub;
    /**
     * Whether we should use smart items for this datagrid or let the user handle
     * everything.
     */
    private _smart;
    /**
     * List of all items in the datagrid
     */
    private _all;
    /**
     * Internal temporary step, which we preserve to avoid re-filtering or re-sorting if not necessary
     */
    private _filtered;
    /**
     * List of items currently displayed
     */
    private _displayed;
    /**
     * The Observable that lets other classes subscribe to items changes
     */
    private _change;
    private _allChanges;
    constructor(_filters: FiltersProvider<T>, _sort: Sort<T>, _page: Page);
    get smart(): boolean;
    get all(): T[];
    set all(items: T[]);
    get displayed(): T[];
    get change(): Observable<T[]>;
    get allChanges(): Observable<T[]>;
    /**
     * Checks if we don't have data to process yet, to abort early operations
     */
    private get uninitialized();
    /**
     * Tracking function to identify objects.
     */
    identifyBy: ClrDatagridItemsIdentityFunction<T>;
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy(): void;
    smartenDown(): void;
    smartenUp(): void;
    /**
     * Manually recompute the list of displayed items
     */
    refresh(): void;
    private emitChange;
    private emitAllChanges;
    /**
     * FiltersProvider items from the raw list
     */
    private _filterItems;
    /**
     * Sorts items in the filtered list
     */
    private _sortItems;
    /**
     * Extracts the current page from the sorted list
     */
    private _changePage;
    static ɵfac: i0.ɵɵFactoryDeclaration<Items<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Items<any>>;
}

declare class ClrDatagridItems<T> implements DoCheck, OnDestroy {
    template: TemplateRef<NgForOfContext<T>>;
    private differs;
    private items;
    private iterableProxy;
    private _rawItems;
    private differ;
    private subscriptions;
    constructor(template: TemplateRef<NgForOfContext<T>>, differs: IterableDiffers, items: Items, vcr: ViewContainerRef);
    set rawItems(items: T[]);
    set trackBy(value: TrackByFunction<T>);
    /**
     * Asserts the correct type of the template context that the directive will render.
     * See https://angular.io/guide/structural-directives#typing-the-directives-context
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard<T>(_dir: ClrDatagridItems<T>, _ctx: unknown): _ctx is NgForOfContext<T>;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridItems<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridItems<any>, "[clrDgItems][clrDgItemsOf]", never, { "rawItems": { "alias": "clrDgItemsOf"; "required": false; }; "trackBy": { "alias": "clrDgItemsTrackBy"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrDatagridPlaceholder<T = any> {
    private items;
    constructor(items: Items<T>);
    /**
     * Tests if the datagrid is empty, meaning it doesn't contain any items
     */
    get emptyDatagrid(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPlaceholder<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPlaceholder<any>, "clr-dg-placeholder", never, {}, {}, never, ["*"], false, never>;
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
    constructor(popoverService: ClrPopoverService, el: ElementRef<HTMLElement>, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, document: any, platformId: any);
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpost, "clr-signpost", never, { "signpostTriggerAriaLabel": { "alias": "clrSignpostTriggerAriaLabel"; "required": false; }; }, {}, ["customTrigger"], ["*"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrDatagridCell implements OnInit {
    private vcr;
    /*********
     * @property signpost
     *
     * @description
     * @ContentChild is used to detect the presence of a Signpost in the projected content.
     * On the host, we set the .datagrid-signpost-trigger class on the cell when signpost.length is greater than 0.
     *
     */
    signpost: QueryList<ClrSignpost>;
    private wrappedInjector;
    constructor(vcr: ViewContainerRef);
    get _view(): any;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridCell, "clr-dg-cell", never, {}, {}, ["signpost"], ["*"], false, never>;
}

declare class DatagridIfExpandService extends IfExpandService {
    expandableId: string;
    private _replace;
    private _animate;
    constructor();
    get expanded(): boolean;
    set expanded(value: boolean);
    get replace(): Observable<boolean>;
    get animate(): Observable<void>;
    loadingStateChange(state: ClrLoadingState): void;
    setReplace(replaceValue: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridIfExpandService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridIfExpandService>;
}

declare enum SelectionType {
    None = 0,
    Single = 1,
    Multi = 2
}

declare enum DatagridDisplayMode {
    DISPLAY = 0,
    CALCULATE = 1
}

declare enum DatagridRenderStep {
    ALIGN_COLUMNS = 0,
    CALCULATE_MODE_ON = 1,
    CALCULATE_MODE_OFF = 2,
    CLEAR_WIDTHS = 3,// Note this is listened to by both cells and columns
    COMPUTE_COLUMN_WIDTHS = 4
}

declare class DatagridRenderOrganizer {
    protected _renderStep: Subject<DatagridRenderStep>;
    private alreadySized;
    get renderStep(): Observable<DatagridRenderStep>;
    filterRenderSteps(step: DatagridRenderStep): Observable<DatagridRenderStep>;
    resize(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRenderOrganizer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridRenderOrganizer>;
}

declare class DisplayModeService implements OnDestroy {
    protected _view: BehaviorSubject<DatagridDisplayMode>;
    private subscriptions;
    constructor(renderOrganizer: DatagridRenderOrganizer);
    get view(): Observable<DatagridDisplayMode>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DisplayModeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DisplayModeService>;
}

declare class ExpandableRowsCount {
    private detailService;
    private expandableCount;
    constructor(detailService: DetailService);
    /**
     * false means no rows with action
     * check if details are on, and disable rows entirely
     */
    get hasExpandableRow(): boolean;
    register(): void;
    unregister(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpandableRowsCount, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExpandableRowsCount>;
}

declare class RowActionService {
    private actionableCount;
    /**
     * false means no rows with action
     */
    get hasActionableRow(): boolean;
    register(): void;
    unregister(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RowActionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RowActionService>;
}

declare class Selection<T = any> {
    private _items;
    id: string;
    preserveSelection: boolean;
    /**
     * Last selection, for use in range selection.
     */
    rangeStart: T;
    /**
     * Shift key state, for use in range selection.
     */
    shiftPressed: boolean;
    /** @deprecated since 2.0, remove in 3.0 */
    rowSelectionMode: boolean;
    private lockedRefs;
    private _currentSelectionRefs;
    private valueCollector;
    private _selectionType;
    /**
     * The current selection
     */
    private _current;
    /**
     * The current selection in single selection type
     */
    private _currentSingle;
    /**
     * The Observable that lets other classes subscribe to selection changes
     */
    private _change;
    /**
     * Subscriptions to the other providers changes.
     */
    private subscriptions;
    /**
     * Differ to track changes of multi selection.
     */
    private _differ;
    private identifyBy;
    constructor(_items: Items<T>, filters: FiltersProvider<T>, differs: IterableDiffers);
    get selectionType(): SelectionType;
    set selectionType(value: SelectionType);
    get current(): T[];
    set current(value: T[]);
    get currentSingle(): T;
    set currentSingle(value: T);
    get change(): Observable<T[] | T>;
    private get _selectable();
    private get currentSelectionRefs();
    private get currentSingleSelectionRef();
    checkForChanges(): void;
    clearSelection(): void;
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy(): void;
    updateCurrent(value: T[], emit: boolean): void;
    /**
     * Checks if an item is currently selected
     */
    isSelected(item: T): boolean;
    /**
     * Selects or deselects an item
     */
    setSelected(item: T, selected: boolean): void;
    /**
     * Checks if all currently displayed items are selected
     */
    isAllSelected(): boolean;
    /**
     * Lock and unlock item
     */
    lockItem(item: T, lock: boolean): void;
    /**
     * Check is item locked or not by searching into lockedRefs for entry
     */
    isLocked(item: T): boolean;
    /**
     * Selects or deselects all currently displayed items
     */
    toggleAll(): void;
    /**
     * Selects an item
     */
    private selectItem;
    /**
     * Deselects an item
     */
    private deselectItem;
    /**
     * Make sure that it could be locked
     */
    private canItBeLocked;
    private emitChange;
    private updateCurrentSelectionRefs;
    static ɵfac: i0.ɵɵFactoryDeclaration<Selection<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Selection<any>>;
}

declare class ClrExpandableAnimationDirective extends BaseExpandableAnimation implements OnChanges, OnDestroy {
    private builder;
    expanded: boolean;
    private player;
    constructor(element: ElementRef<HTMLElement>, domAdapter: DomAdapter, renderer: Renderer2, builder: AnimationBuilder);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    playAnimation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrExpandableAnimationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrExpandableAnimationDirective, "[clrExpandableAnimation]", never, { "expanded": { "alias": "clrExpandableAnimation"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrDatagridRow<T = any> implements AfterContentInit, AfterViewInit {
    selection: Selection<T>;
    rowActionService: RowActionService;
    globalExpandable: ExpandableRowsCount;
    expand: DatagridIfExpandService;
    detailService: DetailService;
    private displayMode;
    private vcr;
    el: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private items;
    private document;
    selectedChanged: EventEmitter<boolean>;
    expandedChange: EventEmitter<boolean>;
    detailDisabled: boolean;
    detailHidden: boolean;
    skeletonLoading: boolean;
    id: string;
    radioId: string;
    checkboxId: string;
    expandableId: string;
    replaced: boolean;
    displayCells: boolean;
    expandAnimationTrigger: boolean;
    SELECTION_TYPE: typeof SelectionType;
    /**
     * @internal
     */
    itemChanges: ReplaySubject<T>;
    /*****
     * property dgCells
     *
     * @description
     * A Query List of the ClrDatagrid cells in this row.
     *
     */
    dgCells: QueryList<ClrDatagridCell>;
    expandAnimation: ClrExpandableAnimationDirective;
    detailButton: ElementRef<HTMLButtonElement>;
    _stickyCells: ViewContainerRef;
    _scrollableCells: ViewContainerRef;
    _calculatedCells: ViewContainerRef;
    _fixedCellTemplate: TemplateRef<any>;
    private _item;
    private _selected;
    private _detailOpenLabel;
    private _detailCloseLabel;
    private _rowSelectionLabel;
    private wrappedInjector;
    private subscriptions;
    private _selectable;
    constructor(selection: Selection<T>, rowActionService: RowActionService, globalExpandable: ExpandableRowsCount, expand: DatagridIfExpandService, detailService: DetailService, displayMode: DisplayModeService, vcr: ViewContainerRef, renderer: Renderer2, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, items: Items, document: any);
    /**
     * Model of the row, to use for selection
     */
    get item(): T;
    set item(item: T);
    get clrDgSelectable(): boolean | string;
    set clrDgSelectable(value: boolean | string);
    /**
     * Indicates if the row is selected
     */
    get selected(): boolean | string;
    set selected(value: boolean | string);
    get expanded(): boolean | string;
    set expanded(value: boolean | string);
    get clrDgDetailOpenLabel(): string;
    set clrDgDetailOpenLabel(label: string);
    get clrDgDetailCloseLabel(): string;
    set clrDgDetailCloseLabel(label: string);
    get clrDgRowSelectionLabel(): string;
    set clrDgRowSelectionLabel(label: string);
    get _view(): any;
    get identifyBy(): _clr_angular.ClrDatagridItemsIdentityFunction<any>;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    toggle(selected?: boolean): void;
    toggleExpand(): void;
    /**
     * The default behavior in Chrome and Firefox for shift-clicking on a label is to perform text-selection.
     * This prevents our intended range-selection, because this text-selection overrides our shift-click event.
     * We need to clear the stored selection range when shift-clicking. This will override the mostly unused shift-click
     * selection browser functionality, which is inconsistently implemented in browsers anyway.
     */
    clearRanges(event: MouseEvent): void;
    /**
     * @deprecated related to clrDgRowSelection, which is deprecated
     */
    protected selectRow(selected: boolean, $event: any): void;
    private rangeSelect;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridRow<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridRow<any>, "clr-dg-row", never, { "detailDisabled": { "alias": "clrDgDetailDisabled"; "required": false; }; "detailHidden": { "alias": "clrDgDetailHidden"; "required": false; }; "skeletonLoading": { "alias": "clrDgSkeletonLoading"; "required": false; }; "item": { "alias": "clrDgItem"; "required": false; }; "clrDgSelectable": { "alias": "clrDgSelectable"; "required": false; }; "selected": { "alias": "clrDgSelected"; "required": false; }; "expanded": { "alias": "clrDgExpanded"; "required": false; }; "clrDgDetailOpenLabel": { "alias": "clrDgDetailOpenLabel"; "required": false; }; "clrDgDetailCloseLabel": { "alias": "clrDgDetailCloseLabel"; "required": false; }; "clrDgRowSelectionLabel": { "alias": "clrDgRowSelectionLabel"; "required": false; }; }, { "selectedChanged": "clrDgSelectedChange"; "expandedChange": "clrDgExpandedChange"; }, ["dgCells"], ["clr-dg-action-overflow", "clr-dg-cell", "clr-dg-row-detail"], false, never>;
}

interface ClrDatagridVirtualScrollRangeInterface<T> {
    total: number;
    skip: number;
    data: T[];
}

declare enum DatagridColumnChanges {
    WIDTH = 0,
    HIDDEN = 1,
    INITIALIZE = 2
}

interface ColumnState {
    columnIndex?: number;
    changes?: DatagridColumnChanges[];
    width?: number;
    strictWidth?: number;
    hideable?: boolean;
    hidden?: boolean;
    titleTemplateRef?: TemplateRef<any>;
}
interface ColumnStateDiff extends ColumnState {
    changes: DatagridColumnChanges[];
}

declare class ColumnsService {
    columns: BehaviorSubject<ColumnState>[];
    columnsStateChange: BehaviorSubject<ColumnState>;
    private _cache;
    get columnStates(): ColumnState[];
    get hasHideableColumns(): boolean;
    get visibleColumns(): ColumnState[];
    cache(): void;
    hasCache(): boolean;
    resetToLastCache(): void;
    emitStateChangeAt(columnIndex: number, diff: ColumnStateDiff): void;
    emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnsService>;
}

type CdkVirtualForInputKey = 'cdkVirtualForOf' | 'cdkVirtualForTrackBy' | 'cdkVirtualForTemplate' | 'cdkVirtualForTemplateCacheSize';
type CdkVirtualForInputs<T> = Partial<Pick<CdkVirtualForOf<T>, CdkVirtualForInputKey>>;
type CdkFixedSizeVirtualScrollInputs = Pick<CdkFixedSizeVirtualScroll, 'itemSize' | 'minBufferPx' | 'maxBufferPx'>;
declare class ClrDatagridVirtualScrollDirective<T> implements AfterViewInit, DoCheck, OnDestroy {
    private readonly changeDetectorRef;
    private iterableDiffers;
    private items;
    private readonly ngZone;
    private readonly renderer2;
    private readonly templateRef;
    private readonly viewContainerRef;
    private readonly directionality;
    private readonly scrollDispatcher;
    private readonly viewportRuler;
    private readonly datagrid;
    private columnsService;
    private readonly injector;
    renderedRangeChange: EventEmitter<ListRange>;
    persistItems: boolean;
    private _isUserProvidedItemSize;
    private _itemSize;
    private _minBufferPx;
    private _maxBufferPx;
    private shouldUpdateAriaRowIndexes;
    private readonly datagridElementRef;
    private gridRoleElement;
    private readonly virtualScrollStrategy;
    private virtualScrollViewport;
    private cdkVirtualFor;
    private subscriptions;
    private topIndex;
    private mutationChanges;
    private viewRepeater;
    private cdkVirtualForInputs;
    private _totalItems;
    constructor(changeDetectorRef: ChangeDetectorRef, iterableDiffers: IterableDiffers, items: Items<T>, ngZone: NgZone, renderer2: Renderer2, templateRef: TemplateRef<CdkVirtualForOfContext<T>>, viewContainerRef: ViewContainerRef, directionality: Directionality, scrollDispatcher: ScrollDispatcher, viewportRuler: ViewportRuler, datagrid: ClrDatagrid, columnsService: ColumnsService, injector: EnvironmentInjector);
    get totalContentHeight(): string;
    get cdkVirtualForOf(): CdkVirtualForInputs<T>["cdkVirtualForOf"];
    set cdkVirtualForOf(value: CdkVirtualForInputs<T>['cdkVirtualForOf']);
    get cdkVirtualForTrackBy(): CdkVirtualForInputs<T>["cdkVirtualForTrackBy"];
    set cdkVirtualForTrackBy(value: CdkVirtualForInputs<T>['cdkVirtualForTrackBy']);
    get cdkVirtualForTemplate(): CdkVirtualForInputs<T>["cdkVirtualForTemplate"];
    set cdkVirtualForTemplate(value: CdkVirtualForInputs<T>['cdkVirtualForTemplate']);
    get cdkVirtualForTemplateCacheSize(): CdkVirtualForInputs<T>["cdkVirtualForTemplateCacheSize"];
    set cdkVirtualForTemplateCacheSize(value: CdkVirtualForInputs<T>['cdkVirtualForTemplateCacheSize']);
    get itemSize(): CdkFixedSizeVirtualScrollInputs["itemSize"];
    set itemSize(value: CdkFixedSizeVirtualScrollInputs['itemSize']);
    get minBufferPx(): CdkFixedSizeVirtualScrollInputs["minBufferPx"];
    set minBufferPx(value: CdkFixedSizeVirtualScrollInputs['minBufferPx']);
    get maxBufferPx(): CdkFixedSizeVirtualScrollInputs["maxBufferPx"];
    set maxBufferPx(value: CdkFixedSizeVirtualScrollInputs['maxBufferPx']);
    set dataRange(range: ClrDatagridVirtualScrollRangeInterface<T>);
    get totalItems(): number;
    private set totalItems(value);
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    scrollUp(offset: number, behavior?: ScrollBehavior): void;
    scrollDown(offset: number, behavior?: ScrollBehavior): void;
    scrollToIndex(index: number, behavior?: ScrollBehavior): void;
    private updateDataRange;
    private updateItemSize;
    private updateCdkVirtualForInputs;
    private updateFixedSizeVirtualScrollInputs;
    private updateAriaRowCount;
    private updateAriaRowIndexes;
    private createVirtualScrollViewportForDatagrid;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridVirtualScrollDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridVirtualScrollDirective<any>, "[clrVirtualScroll],[ClrVirtualScroll]", never, { "persistItems": { "alias": "clrVirtualPersistItems"; "required": false; }; "cdkVirtualForOf": { "alias": "clrVirtualRowsOf"; "required": false; }; "cdkVirtualForTrackBy": { "alias": "clrVirtualRowsTrackBy"; "required": false; }; "cdkVirtualForTemplate": { "alias": "clrVirtualRowsTemplate"; "required": false; }; "cdkVirtualForTemplateCacheSize": { "alias": "clrVirtualRowsTemplateCacheSize"; "required": false; }; "itemSize": { "alias": "clrVirtualRowsItemSize"; "required": false; }; "minBufferPx": { "alias": "clrVirtualRowsMinBufferPx"; "required": false; }; "maxBufferPx": { "alias": "clrVirtualRowsMaxBufferPx"; "required": false; }; "dataRange": { "alias": "clrVirtualDataRange"; "required": false; }; }, { "renderedRangeChange": "renderedRangeChange"; }, never, never, false, never>;
}

interface ClrDatagridStateInterface<T = any> {
    page?: {
        from?: number;
        to?: number;
        size?: number;
        current?: number;
    };
    sort?: {
        by: string | ClrDatagridComparatorInterface<T>;
        reverse: boolean;
    };
    filters?: any[];
}

/**
 * This provider aggregates state changes from the various providers of the Datagrid
 */
declare class StateProvider<T> {
    private filters;
    private sort;
    private page;
    private debouncer;
    /**
     * The Observable that lets other classes subscribe to global state changes
     */
    change: Observable<ClrDatagridStateInterface<T>>;
    constructor(filters: FiltersProvider<T>, sort: Sort<T>, page: Page, debouncer: StateDebouncer);
    get state(): ClrDatagridStateInterface<T>;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateProvider<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateProvider<any>>;
}

interface KeyNavigationGridConfig {
    keyGrid: string;
    keyGridRows: string;
    keyGridCells: string;
}
interface CellCoordinates {
    x: number;
    y: number;
    ariaRowIndex?: string;
}
declare class KeyNavigationGridController implements OnDestroy {
    private zone;
    nextCellCoordsEmitter: EventEmitter<CellCoordinates>;
    skipItemFocus: boolean;
    preventScrollOnFocus: boolean;
    config: KeyNavigationGridConfig;
    private keyNavUtils;
    private listenersAdded;
    private destroy$;
    constructor(zone: NgZone);
    ngOnDestroy(): void;
    addListeners(): void;
    initializeKeyGrid(host: HTMLElement): void;
    resetKeyGrid(): void;
    setActiveCell(activeCell: HTMLElement): void;
    focusElement(activeCell: HTMLElement, options?: FocusOptions): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyNavigationGridController, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyNavigationGridController>;
}

declare class ClrDatagrid<T = any> implements AfterContentInit, AfterViewInit, OnDestroy, DoCheck {
    private organizer;
    items: Items<T>;
    expandableRows: ExpandableRowsCount;
    selection: Selection<T>;
    rowActionService: RowActionService;
    private stateProvider;
    private displayMode;
    private renderer;
    detailService: DetailService;
    private document;
    el: ElementRef<HTMLElement>;
    private page;
    commonStrings: ClrCommonStringsService;
    keyNavigation: KeyNavigationGridController;
    private zone;
    loadingMoreItems: boolean;
    clrDgSingleSelectionAriaLabel: string;
    clrDgSingleActionableAriaLabel: string;
    clrDetailExpandableAriaLabel: string;
    clrDgDisablePageFocus: boolean;
    selectedChanged: EventEmitter<T[]>;
    singleSelectedChanged: EventEmitter<T>;
    /**
     * Output emitted whenever the data needs to be refreshed, based on user action or external ones
     */
    refresh: EventEmitter<ClrDatagridStateInterface<T>>;
    /**
     * The application can provide custom select all logic.
     */
    customSelectAllEnabled: boolean;
    customSelectAll: EventEmitter<boolean>;
    /**
     * Expose virtual scroll directive for applications to access its public methods
     */
    _virtualScroll: QueryList<ClrDatagridVirtualScrollDirective<any>>;
    /**
     * We grab the smart iterator from projected content
     */
    iterator: ClrDatagridItems<T>;
    /**
     * Custom placeholder detection
     */
    placeholder: ClrDatagridPlaceholder<T>;
    /**
     * Hideable Column data source / detection.
     */
    columns: QueryList<ClrDatagridColumn<T>>;
    /**
     * When the datagrid is user-managed without the smart iterator, we get the items displayed
     * by querying the projected content. This is needed to keep track of the models currently
     * displayed, typically for selection.
     */
    rows: QueryList<ClrDatagridRow<T>>;
    datagrid: ElementRef<HTMLElement>;
    datagridTable: ElementRef<HTMLElement>;
    datagridHeader: ElementRef<HTMLElement>;
    contentWrapper: ElementRef<HTMLElement>;
    rowsWrapper: ElementRef<HTMLElement>;
    scrollableColumns: ViewContainerRef;
    _projectedDisplayColumns: ViewContainerRef;
    _projectedCalculationColumns: ViewContainerRef;
    _displayedRows: ViewContainerRef;
    _calculationRows: ViewContainerRef;
    _fixedColumnTemplate: TemplateRef<any>;
    stickyHeaders: QueryList<ElementRef>;
    selectAllId: string;
    activeCellCoords: CellCoordinates;
    SELECTION_TYPE: typeof SelectionType;
    private selectAllCheckbox;
    /**
     * Subscriptions to all the services and queries changes
     */
    private _subscriptions;
    private _virtualScrollSubscriptions;
    private cachedRowsHeight;
    private cachedContentHeight;
    private resizeObserver;
    constructor(organizer: DatagridRenderOrganizer, items: Items<T>, expandableRows: ExpandableRowsCount, selection: Selection<T>, rowActionService: RowActionService, stateProvider: StateProvider<T>, displayMode: DisplayModeService, renderer: Renderer2, detailService: DetailService, document: any, el: ElementRef<HTMLElement>, page: Page, commonStrings: ClrCommonStringsService, keyNavigation: KeyNavigationGridController, zone: NgZone);
    /**
     * Freezes the datagrid while data is loading
     */
    get loading(): boolean;
    set loading(value: boolean);
    /**
     * Array of all selected items
     */
    set selected(value: T[] | undefined);
    /**
     * Selected item in single-select mode
     */
    set singleSelected(value: T);
    set clrDgPreserveSelection(state: boolean);
    /**
     * @deprecated since 2.0, remove in 3.0
     *
     * Selection/Deselection on row click mode
     */
    set rowSelectionMode(value: boolean);
    set identityFn(value: ClrDatagridItemsIdentityFunction<T>);
    /**
     * Indicates if all currently displayed items are selected
     */
    get allSelected(): boolean;
    set allSelected(value: boolean);
    get virtualScroll(): ClrDatagridVirtualScrollDirective<any>;
    ngAfterContentInit(): void;
    /**
     * Our setup happens in the view of some of our components, so we wait for it to be done before starting
     */
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    toggleAllSelected($event: any): void;
    resize(): void;
    /**
     * Checks the state of detail panel and if it's opened then
     * find the matching row and trigger the detail panel
     */
    updateDetailState(): void;
    /**
     * Public method to re-trigger the computation of displayed items manually
     */
    dataChanged(): void;
    private toggleVirtualScrollSubscriptions;
    private handleResizeChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagrid<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagrid<any>, "clr-datagrid", never, { "loadingMoreItems": { "alias": "clrLoadingMoreItems"; "required": false; }; "clrDgSingleSelectionAriaLabel": { "alias": "clrDgSingleSelectionAriaLabel"; "required": false; }; "clrDgSingleActionableAriaLabel": { "alias": "clrDgSingleActionableAriaLabel"; "required": false; }; "clrDetailExpandableAriaLabel": { "alias": "clrDetailExpandableAriaLabel"; "required": false; }; "clrDgDisablePageFocus": { "alias": "clrDgDisablePageFocus"; "required": false; }; "customSelectAllEnabled": { "alias": "clrDgCustomSelectAllEnabled"; "required": false; }; "loading": { "alias": "clrDgLoading"; "required": false; }; "selected": { "alias": "clrDgSelected"; "required": false; }; "singleSelected": { "alias": "clrDgSingleSelected"; "required": false; }; "clrDgPreserveSelection": { "alias": "clrDgPreserveSelection"; "required": false; }; "rowSelectionMode": { "alias": "clrDgRowSelection"; "required": false; }; "identityFn": { "alias": "clrDgItemsIdentityFn"; "required": false; }; }, { "selectedChanged": "clrDgSelectedChange"; "singleSelectedChanged": "clrDgSingleSelectedChange"; "refresh": "clrDgRefresh"; "customSelectAll": "clrDgCustomSelectAll"; }, ["iterator", "placeholder", "_virtualScroll", "columns", "rows"], ["clr-dg-action-bar", "clr-dg-placeholder", "clr-dg-footer", "[clrIfDetail],clr-dg-detail"], false, never>;
}

declare class ClrDatagridActionBar {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridActionBar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridActionBar, "clr-dg-action-bar", never, {}, {}, never, ["*"], false, never>;
}

declare const CLR_MENU_POSITIONS: string[];

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
    constructor(parentHost: ElementRef<HTMLElement>, element: ElementRef, commonStrings: ClrCommonStringsService, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, platformId: any, document: Document, popoverService: ClrPopoverService, popoverContent: ClrPopoverContent);
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
    get position(): string | ClrPopoverPosition;
    set position(position: string | ClrPopoverPosition);
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpostContent, "clr-signpost-content", never, { "signpostCloseAriaLabel": { "alias": "clrSignpostCloseAriaLabel"; "required": false; }; "position": { "alias": "clrPosition"; "required": false; }; }, {}, never, ["clr-signpost-title", "*"], false, [{ directive: typeof ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare class ClrSignpostTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpostTitle, "clr-signpost-title", never, {}, {}, never, ["*"], false, never>;
}

declare const CLR_SIGNPOST_DIRECTIVES: Type<any>[];
declare class ClrSignpostModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSignpostModule, [typeof ClrSignpost, typeof ClrSignpostContent, typeof ClrSignpostTrigger, typeof ClrSignpostTitle], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrFocusOnViewInitModule, typeof ClrPopoverModuleNext], [typeof ClrSignpost, typeof ClrSignpostContent, typeof ClrSignpostTrigger, typeof ClrSignpostTitle, typeof ClrConditionalModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSignpostModule>;
}

declare class ClrTooltip {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltip, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTooltip, "clr-tooltip", never, {}, {}, never, ["*"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
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
    constructor(popoverService: ClrPopoverService);
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
    constructor(popoverService: ClrPopoverService, tooltipIdService: TooltipIdService, tooltipMouseService: TooltipMouseService, element: ElementRef);
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
    constructor(parentHost: ElementRef<HTMLElement>, tooltipIdService: TooltipIdService, el: ElementRef, renderer: Renderer2, popoverService: ClrPopoverService, tooltipMouseService: TooltipMouseService, popoverContent: ClrPopoverContent);
    get id(): string;
    set id(value: string);
    get position(): string | ClrPopoverPosition;
    set position(value: string | ClrPopoverPosition);
    get size(): string;
    set size(value: string);
    ngOnInit(): void;
    private onMouseEnter;
    private onMouseLeave;
    private updateCssClass;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipContent, [{ optional: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTooltipContent, "clr-tooltip-content", never, { "id": { "alias": "id"; "required": false; }; "position": { "alias": "clrPosition"; "required": false; }; "size": { "alias": "clrSize"; "required": false; }; }, {}, never, ["*"], false, [{ directive: typeof ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare const CLR_TOOLTIP_DIRECTIVES: Type<any>[];
declare class ClrTooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTooltipModule, [typeof ClrTooltip, typeof ClrTooltipTrigger, typeof ClrTooltipContent], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrPopoverModuleNext], [typeof ClrTooltip, typeof ClrTooltipTrigger, typeof ClrTooltipContent, typeof ClrConditionalModule, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTooltipModule>;
}

declare class ClrPopoverModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPopoverModule, never, never, [typeof ClrDropdownModule, typeof ClrSignpostModule, typeof ClrTooltipModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPopoverModule>;
}

declare class ClrDatagridActionOverflow implements OnDestroy {
    private rowActionService;
    commonStrings: ClrCommonStringsService;
    private platformId;
    private popoverService;
    buttonLabel: string;
    openChange: EventEmitter<boolean>;
    popoverId: string;
    smartPosition: ClrPopoverPosition;
    protected positions: _angular_cdk_overlay.ConnectedPosition[];
    private readonly keyFocus;
    private _open;
    private subscriptions;
    constructor(rowActionService: RowActionService, commonStrings: ClrCommonStringsService, platformId: any, popoverService: ClrPopoverService);
    get open(): boolean;
    set open(open: boolean);
    ngOnDestroy(): void;
    closeOverflowContent(event: Event): void;
    private initializeFocus;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridActionOverflow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridActionOverflow, "clr-dg-action-overflow", never, { "buttonLabel": { "alias": "clrDgActionOverflowButtonLabel"; "required": false; }; "open": { "alias": "clrDgActionOverflowOpen"; "required": false; }; }, { "openChange": "clrDgActionOverflowOpenChange"; }, never, ["*"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ColumnResizerService {
    private el;
    private domAdapter;
    private organizer;
    isWithinMaxResizeRange: boolean;
    private widthBeforeResize;
    private _resizedBy;
    constructor(el: ElementRef<HTMLElement>, domAdapter: DomAdapter, organizer: DatagridRenderOrganizer);
    get resizedBy(): number;
    get minColumnWidth(): number;
    get maxResizeRange(): number;
    get widthAfterResize(): number;
    startResize(): void;
    endResize(): void;
    calculateResize(resizedBy: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnResizerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnResizerService>;
}

/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
declare class TableSizeService {
    private platformId;
    private _tableRef;
    constructor(platformId: any);
    get tableRef(): HTMLElement;
    set tableRef(element: HTMLElement);
    set table(table: ElementRef<HTMLElement>);
    getColumnDragHeight(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TableSizeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TableSizeService>;
}

declare class ClrDatagridColumnSeparator implements AfterViewInit, OnDestroy {
    private columnResizerService;
    private renderer;
    private ngZone;
    private tableSizeService;
    commonString: ClrCommonStringsService;
    private document;
    columnSeparatorId: string;
    private resizeStartedOnKeyDown;
    private isWithinMaxResizeRange;
    private unlisteners;
    private resizeTrackerRef;
    private columnHandleRef;
    constructor(columnResizerService: ColumnResizerService, renderer: Renderer2, ngZone: NgZone, tableSizeService: TableSizeService, commonString: ClrCommonStringsService, document: any);
    get descriptionId(): string;
    private get resizeTrackerEl();
    private get columnHandleEl();
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    showTracker(): void;
    moveTracker(movedBy: number): void;
    hideTracker(): void;
    private showTrackerOnFirstKeyDown;
    private moveTrackerOnKeyDown;
    private hideTrackerOnKeyUp;
    private redFlagTracker;
    private isArrowLeftKeyEvent;
    private isArrowRightKeyEvent;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnSeparator, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnSeparator, "clr-dg-column-separator", never, {}, {}, never, never, false, never>;
}

declare class ClrDatagridDetailHeader implements AfterViewInit {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    title: ElementRef<HTMLElement>;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get titleId(): string;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetailHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetailHeader, "clr-dg-detail-header", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrDatagridDetail {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    ariaLabelledBy: string;
    ariaLabel: string;
    header: ClrDatagridDetailHeader;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get labelledBy(): string;
    get label(): string;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetail, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetail, "clr-dg-detail", never, { "ariaLabelledBy": { "alias": "clrDetailAriaLabelledBy"; "required": false; }; "ariaLabel": { "alias": "clrDetailAriaLabel"; "required": false; }; }, {}, ["header"], ["*"], false, never>;
}

declare class ClrDatagridDetailBody {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetailBody, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetailBody, "clr-dg-detail-body", never, {}, {}, never, ["*"], false, never>;
}

declare abstract class CustomFilter {
}

/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
declare class ClrDatagridFilter<T = any> extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>> implements CustomFilter, OnDestroy {
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private keyNavigation;
    openChange: EventEmitter<boolean>;
    ariaExpanded: boolean;
    popoverId: string;
    popoverPosition: ClrPopoverPosition;
    popoverType: ClrPopoverType;
    anchor: ElementRef<HTMLButtonElement>;
    private subs;
    constructor(_filters: FiltersProvider<T>, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, keyNavigation: KeyNavigationGridController);
    get open(): boolean;
    set open(open: boolean);
    set customFilter(filter: ClrDatagridFilterInterface<T> | RegisteredFilter<T, ClrDatagridFilterInterface<T>>);
    /**
     * Indicates if the filter is currently active
     */
    get active(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridFilter<any>, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridFilter<any>, "clr-dg-filter", never, { "open": { "alias": "clrDgFilterOpen"; "required": false; }; "customFilter": { "alias": "clrDgFilter"; "required": false; }; }, { "openChange": "clrDgFilterOpenChange"; }, never, ["*"], false, never>;
}

declare class ClrDatagridFooter<T = any> {
    selection: Selection<T>;
    detailService: DetailService;
    private columnsService;
    commonStrings: ClrCommonStringsService;
    SELECTION_TYPE: typeof SelectionType;
    constructor(selection: Selection<T>, detailService: DetailService, columnsService: ColumnsService, commonStrings: ClrCommonStringsService);
    get hasHideableColumns(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridFooter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridFooter<any>, "clr-dg-footer", never, {}, {}, never, ["*", "clr-dg-pagination"], false, never>;
}

declare class ClrDatagridHideableColumn implements OnDestroy {
    private titleTemplateRef;
    private columnsService;
    private columnState;
    hiddenChange: EventEmitter<boolean>;
    /**
     *
     * @description
     * Used to initialize the column with either hidden or visible state.
     *
     */
    private _hidden;
    private subscriptions;
    constructor(titleTemplateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, columnsService: ColumnsService, columnState: BehaviorSubject<ColumnState>);
    /**
     *
     * @description
     * Setter fn for the @Input with the same name as this structural directive.
     * It allows the user to pre-configure the column's hide/show state. { hidden: true }
     * It's more verbose but has more Clarity.
     *
     * @example
     * *clrDgHideableColumn
     * *clrDgHideableColumn={hidden: false}
     * *clrDgHideableColumn={hidden: true}
     *
     */
    set clrDgHideableColumn(value: {
        hidden: boolean;
    } | string);
    set clrDgHidden(hidden: boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridHideableColumn, [null, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridHideableColumn, "[clrDgHideableColumn]", never, { "clrDgHideableColumn": { "alias": "clrDgHideableColumn"; "required": false; }; "clrDgHidden": { "alias": "clrDgHidden"; "required": false; }; }, { "hiddenChange": "clrDgHiddenChange"; }, never, never, false, never>;
}

interface Helpers {
    show?: boolean;
    showInvalid?: boolean;
    showValid?: boolean;
    showHelper?: boolean;
}
declare class NgControlService {
    private _control;
    private _additionalControls;
    private _controlChanges;
    private _additionalControlsChanges;
    private _helpers;
    get control(): NgControl;
    get controlChanges(): Observable<NgControl>;
    get additionalControls(): NgControl[];
    get additionalControlsChanges(): Observable<NgControl[]>;
    get hasAdditionalControls(): boolean;
    get helpersChange(): Observable<Helpers>;
    setControl(control: NgControl): void;
    addAdditionalControl(control: NgControl): void;
    setHelpers(state: Helpers): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgControlService>;
}

declare enum CONTROL_STATE {
    NONE = "NONE",
    VALID = "VALID",
    INVALID = "INVALID"
}
declare class IfControlStateService {
    readonly statusChanges: Observable<CONTROL_STATE>;
    private readonly triggerStatusChangeSubject;
    constructor(ngControlService: NgControlService);
    triggerStatusChange(): void;
    private getStatusChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<IfControlStateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfControlStateService>;
}

declare abstract class AbstractIfState {
    protected ifControlStateService: IfControlStateService;
    protected ngControlService: NgControlService;
    protected subscriptions: Subscription[];
    protected displayedContent: boolean;
    protected control: NgControl;
    protected additionalControls: NgControl[];
    protected constructor(ifControlStateService: IfControlStateService, ngControlService: NgControlService);
    ngOnDestroy(): void;
    protected handleState(_state: CONTROL_STATE): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractIfState, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractIfState, never, never, {}, {}, never, never, true, never>;
}

declare class ClrIfError extends AbstractIfState {
    private template;
    private container;
    error: string;
    private embeddedViewRef;
    constructor(ifControlStateService: IfControlStateService, ngControlService: NgControlService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @param state CONTROL_STATE
     */
    protected handleState(state: CONTROL_STATE): void;
    private displayError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfError, [{ optional: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfError, "[clrIfError]", never, { "error": { "alias": "clrIfError"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrIfSuccess extends AbstractIfState {
    private template;
    private container;
    constructor(ifControlStateService: IfControlStateService, ngControlService: NgControlService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @param state CONTROL_STATE
     */
    protected handleState(state: CONTROL_STATE): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfSuccess, [{ optional: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfSuccess, "[clrIfSuccess]", never, {}, {}, never, never, false, never>;
}

declare enum ClrFormLayout {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    COMPACT = "compact"
}
declare class LayoutService {
    readonly minLabelSize = 1;
    readonly maxLabelSize = 12;
    layout: ClrFormLayout | string;
    private layoutValues;
    private _labelSize;
    get labelSize(): number;
    set labelSize(size: number);
    get layoutClass(): string;
    isVertical(): boolean;
    isHorizontal(): boolean;
    isCompact(): boolean;
    isValid(layout: string): boolean;
    labelSizeIsValid(labelSize: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LayoutService>;
}

/**
 * @TODO No idea why I need to use provideIn .. without I'm getting error that
 * ContainerIdService is not defined - But this must be optional service!?
 *
 * There is something wrong - will come back to investigate it when I have more time
 *
 */
declare class ContainerIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContainerIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContainerIdService>;
}

declare class ControlIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ControlIdService>;
}

declare abstract class ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    /**
     * Hold the suffix for the ID
     */
    controlIdSuffix: string;
    protected constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    get id(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAbstractControl, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAbstractControl, never, never, {}, {}, never, never, true, never>;
}

declare class ClrControlError extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlError, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlError, "clr-control-error", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrControlSuccess extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlSuccess, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlSuccess, "clr-control-success", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrControlLabel implements OnInit, OnDestroy {
    private controlIdService;
    private layoutService;
    private ngControlService;
    private renderer;
    private el;
    idInput: string;
    idAttr: string;
    forAttr: string;
    private signpost;
    private enableGrid;
    private subscriptions;
    constructor(controlIdService: ControlIdService, layoutService: LayoutService, ngControlService: NgControlService, renderer: Renderer2, el: ElementRef<HTMLLabelElement>);
    get labelText(): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    disableGrid(): void;
    /**
     * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
     * automatically closed once clicked inside a <label>.
     * @param event
     */
    private onClick;
    private preventDefaultOnSignpostTarget;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlLabel, [{ optional: true; }, { optional: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrControlLabel, "label", never, { "idInput": { "alias": "id"; "required": false; }; "forAttr": { "alias": "for"; "required": false; }; }, {}, ["signpost"], never, false, never>;
}

declare class MarkControlService {
    private _touched;
    get touchedChange(): Observable<void>;
    markAsTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarkControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MarkControlService>;
}

declare class ClrForm {
    layoutService: LayoutService;
    private markControlService;
    labels: QueryList<ClrControlLabel>;
    constructor(layoutService: LayoutService, markControlService: MarkControlService);
    set labelSize(size: number | string);
    onFormSubmit(): void;
    markAsTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrForm, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrForm, "[clrForm]", never, { "labelSize": { "alias": "clrLabelSize"; "required": false; }; }, {}, ["labels"], never, false, never>;
}

declare class ClrControlHelper extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlHelper, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlHelper, "clr-control-helper", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrLayout implements OnInit {
    layoutService: LayoutService;
    layout: ClrFormLayout | string;
    constructor(layoutService: LayoutService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLayout, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLayout, "[clrForm][clrLayout]", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ControlClassService {
    private layoutService;
    className: string;
    constructor(layoutService: LayoutService);
    controlClass(state?: CONTROL_STATE, grid?: boolean, additional?: string): string;
    initControlClass(renderer: Renderer2, element: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlClassService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ControlClassService>;
}

declare abstract class ClrAbstractContainer implements OnDestroy, AfterContentInit {
    protected ifControlStateService: IfControlStateService;
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    label: ClrControlLabel;
    controlSuccessComponent: ClrControlSuccess;
    controlErrorComponent: ClrControlError;
    controlHelperComponent: ClrControlHelper;
    control: NgControl;
    additionalControls: NgControl[];
    protected subscriptions: Subscription[];
    private state;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService);
    /**
     * @NOTE
     * Helper control is a bit different than the others, it must be always visible:
     *   -  Labels and instructions must always accompany forms and are persistent.
     *   -  The recommendation here is to always have helper text or anything instructions visible.
     *   -  The expectation is to have error text + helper text in the errored state. this way all users will have the helper text information always available.
     */
    get showHelper(): boolean;
    get showValid(): boolean;
    get showInvalid(): boolean;
    protected get successMessagePresent(): boolean;
    protected get errorMessagePresent(): boolean;
    private get touched();
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    controlClass(): string;
    addGrid(): boolean;
    private updateHelpers;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAbstractContainer, [null, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAbstractContainer, never, never, {}, {}, ["label", "controlSuccessComponent", "controlErrorComponent", "controlHelperComponent"], never, true, never>;
}

declare class ClrControlContainer extends ClrAbstractContainer {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlContainer, "clr-control-container", never, {}, {}, never, ["label", "*", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare enum CHANGE_KEYS {
    FORM = "form",
    MODEL = "model"
}
declare class WrappedFormControl<W> implements OnInit, DoCheck, OnDestroy {
    protected vcr: ViewContainerRef;
    protected wrapperType: Type<W>;
    private _ngControl;
    protected renderer: Renderer2;
    protected el: ElementRef<HTMLElement>;
    _id: string;
    protected controlIdService: ControlIdService;
    protected ngControlService: NgControlService;
    protected index: number;
    protected subscriptions: Subscription[];
    private ifControlStateService;
    private controlClassService;
    private markControlService;
    private containerIdService;
    private _containerInjector;
    private differs;
    private differ;
    private additionalDiffer;
    private ngControl;
    constructor(vcr: ViewContainerRef, wrapperType: Type<W>, injector: Injector, _ngControl: NgControl | null, renderer: Renderer2, el: ElementRef<HTMLElement>);
    get id(): string;
    set id(value: string);
    private get hasAdditionalControls();
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    triggerValidation(): void;
    protected getProviderFromContainer<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
    private injectControlClassService;
    private triggerDoCheck;
    private markAsTouched;
    private setAriaDescribedBy;
    private getAriaDescribedById;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedFormControl<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WrappedFormControl<any>, never, never, { "id": { "alias": "id"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrControl extends WrappedFormControl<ClrControlContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControl, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrControl, "[clrControl]", never, {}, {}, never, never, false, never>;
}

declare class ClrCommonFormsModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCommonFormsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCommonFormsModule, [typeof ClrControlLabel, typeof ClrControlError, typeof ClrControlSuccess, typeof ClrControlHelper, typeof ClrIfError, typeof ClrIfSuccess, typeof ClrForm, typeof ClrLayout, typeof ClrControlContainer, typeof ClrControl], [typeof i2.CommonModule, typeof ClrIcon], [typeof ClrControlLabel, typeof ClrControlError, typeof ClrControlSuccess, typeof ClrControlHelper, typeof ClrIfError, typeof ClrIfSuccess, typeof ClrForm, typeof ClrLayout, typeof ClrControlContainer, typeof ClrControl, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCommonFormsModule>;
}

declare const IS_TOGGLE: InjectionToken<BehaviorSubject<boolean>>;
declare function isToggleFactory(): BehaviorSubject<boolean>;
declare const IS_TOGGLE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof isToggleFactory;
};
declare class ClrCheckboxWrapper implements OnInit, OnDestroy {
    label: ClrControlLabel;
    checkbox: ClrCheckbox;
    toggle: boolean;
    private subscriptions;
    constructor(toggleService: BehaviorSubject<boolean>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxWrapper, "clr-checkbox-wrapper,clr-toggle-wrapper", never, {}, {}, ["label", "checkbox"], ["[clrCheckbox],[clrToggle]", "label"], false, never>;
}

/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
declare class ClrCheckbox extends WrappedFormControl<ClrCheckboxWrapper> {
    private control;
    private toggle;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, toggle: string);
    get controlDisabled(): boolean;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckbox, [null, null, { optional: true; self: true; }, null, null, { attribute: "clrToggle"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrCheckbox, "[clrCheckbox],[clrToggle]", never, {}, {}, never, never, false, never>;
}

declare class ClrCheckboxContainer extends ClrAbstractContainer implements AfterContentInit {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    role: string;
    checkboxes: QueryList<ClrCheckbox>;
    private inline;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    protected get allCheckboxesDisabled(): boolean;
    ngAfterContentInit(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxContainer, [{ optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxContainer, "clr-checkbox-container,clr-toggle-container", never, { "clrInline": { "alias": "clrInline"; "required": false; }; }, {}, ["checkboxes"], ["label", "clr-checkbox-wrapper,clr-toggle-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class EmptyAnchor {
    static ɵfac: i0.ɵɵFactoryDeclaration<EmptyAnchor, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmptyAnchor, "ng-component", never, {}, {}, never, never, false, never>;
}

/**
 * Internal module, please do not export!
 */
declare class ClrHostWrappingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrHostWrappingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrHostWrappingModule, [typeof EmptyAnchor], never, [typeof EmptyAnchor]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrHostWrappingModule>;
}

declare class ClrCheckboxModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCheckboxModule, [typeof ClrCheckbox, typeof ClrCheckboxContainer, typeof ClrCheckboxWrapper], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrCommonFormsModule, typeof ClrHostWrappingModule], [typeof ClrCommonFormsModule, typeof ClrCheckbox, typeof ClrCheckboxContainer, typeof ClrCheckboxWrapper]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCheckboxModule>;
}

declare class ComboboxContainerService {
    labelOffset: number;
    labelText: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ComboboxContainerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ComboboxContainerService>;
}

declare class ClrComboboxContainer extends ClrAbstractContainer implements AfterContentInit, AfterViewInit {
    private containerService;
    private el;
    controlContainer: ElementRef<HTMLElement>;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, containerService: ComboboxContainerService, el: ElementRef<HTMLElement>);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrComboboxContainer, [null, { optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrComboboxContainer, "clr-combobox-container", never, {}, {}, never, ["label", "clr-combobox", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare abstract class ComboboxModel<T> {
    model: T | T[];
    displayField?: string;
    abstract containsItem(item: T): boolean;
    abstract select(item: T): void;
    abstract unselect(item: T): void;
    abstract toString(displayField?: string, index?: number): string;
    abstract isEmpty(): boolean;
    abstract pop(): T;
}

declare class ClrOptionSelected<T> {
    template: TemplateRef<{
        $implicit: T;
    }>;
    selected: T;
    constructor(template: TemplateRef<{
        $implicit: T;
    }>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionSelected<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrOptionSelected<any>, "[clrOptionSelected]", never, { "selected": { "alias": "clrOptionSelected"; "required": false; }; }, {}, never, never, false, never>;
}

declare class OptionSelectionService<T> {
    loading: boolean;
    editable: boolean;
    filtering: boolean;
    selectionModel: ComboboxModel<T>;
    inputChanged: Observable<string>;
    showAllOptions: boolean;
    private _currentInput;
    private _displayField;
    private _inputChanged;
    private _selectionChanged;
    constructor();
    get displayField(): string;
    set displayField(value: string);
    get currentInput(): string;
    set currentInput(input: string);
    get selectionChanged(): Observable<ComboboxModel<T>>;
    get multiselectable(): boolean;
    select(item: T): void;
    toggle(item: T): void;
    unselect(item: T): void;
    setSelectionValue(value: T | T[]): void;
    parseStringToModel(value: string): T;
    static ɵfac: i0.ɵɵFactoryDeclaration<OptionSelectionService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OptionSelectionService<any>>;
}

declare class SingleSelectComboboxModel<T> implements ComboboxModel<T> {
    model: T;
    containsItem(item: T): boolean;
    select(item: T): void;
    unselect(item: T): void;
    isEmpty(): boolean;
    pop(): T;
    toString(displayField?: string): string;
}

declare class PseudoFocusModel<T> extends SingleSelectComboboxModel<T> {
    private _focusChanged;
    get focusChanged(): Observable<T>;
    select(item: T): void;
}

declare class ComboboxFocusHandler<T> {
    private popoverService;
    private selectionService;
    private platformId;
    componentCdRef: ChangeDetectorRef;
    pseudoFocus: PseudoFocusModel<OptionData<T>>;
    private renderer;
    private _trigger;
    private _listbox;
    private _textInput;
    private optionData;
    constructor(rendererFactory: RendererFactory2, popoverService: ClrPopoverService, selectionService: OptionSelectionService<T>, platformId: any);
    get trigger(): HTMLElement;
    set trigger(el: HTMLElement);
    get listbox(): HTMLElement;
    set listbox(el: HTMLElement);
    get textInput(): HTMLElement;
    set textInput(el: HTMLElement);
    focusInput(): void;
    focusFirstActive(): void;
    addOptionValues(options: OptionData<T>[]): void;
    private handleFocusSubscription;
    private moveFocusTo;
    private openAndMoveTo;
    private handleTextInput;
    private scrollIntoSelectedModel;
    private preventViewportScrolling;
    private addFocusOnBlurListener;
    private focusOutOfComponent;
    static ɵfac: i0.ɵɵFactoryDeclaration<ComboboxFocusHandler<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ComboboxFocusHandler<any>>;
}
declare class OptionData<T> {
    id: string;
    value: T;
    el: HTMLElement;
    constructor(id: string, value: T);
    equals(other: OptionData<T>): boolean;
}

declare class ClrCombobox<T> extends WrappedFormControl<ClrComboboxContainer> implements ControlValueAccessor, LoadingListener, AfterContentInit {
    control: NgControl;
    protected renderer: Renderer2;
    protected el: ElementRef<HTMLElement>;
    optionSelectionService: OptionSelectionService<T>;
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private controlStateService;
    private containerService;
    private platformId;
    private focusHandler;
    private cdr;
    placeholder: string;
    clrInputChange: EventEmitter<string>;
    clrOpenChange: rxjs.Observable<boolean>;
    /**
     * This output should be used to set up a live region using aria-live and populate it with updates that reflect each combobox change.
     */
    clrSelectionChange: rxjs.Observable<ComboboxModel<T>>;
    textbox: ElementRef<HTMLInputElement>;
    trigger: ElementRef<HTMLButtonElement>;
    optionSelected: ClrOptionSelected<T>;
    invalid: boolean;
    focused: boolean;
    popoverPosition: ClrPopoverPosition;
    protected index: number;
    protected popoverType: ClrPopoverType;
    private options;
    private _searchText;
    private onTouchedCallback;
    private onChangeCallback;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>, optionSelectionService: OptionSelectionService<T>, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, controlStateService: IfControlStateService, containerService: ComboboxContainerService, platformId: any, focusHandler: ComboboxFocusHandler<T>, cdr: ChangeDetectorRef);
    get editable(): boolean;
    set editable(value: boolean);
    get multiSelect(): boolean | string;
    set multiSelect(value: boolean | string);
    get id(): string;
    set id(id: string);
    get searchText(): string;
    set searchText(text: string);
    get openState(): boolean;
    get multiSelectModel(): T[];
    get ariaControls(): string;
    get ariaOwns(): string;
    get ariaDescribedBySelection(): string;
    get displayField(): string;
    private get disabled();
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    onKeyUp(event: KeyboardEvent): void;
    inputId(): string;
    loadingStateChange(state: ClrLoadingState): void;
    unselect(item: T): void;
    onBlur(event: any): void;
    onFocus(): void;
    onChange(): void;
    getSelectionAriaLabel(): string;
    focusFirstActive(): void;
    writeValue(value: T | T[]): void;
    registerOnTouched(onTouched: any): void;
    registerOnChange(onChange: any): void;
    getActiveDescendant(): string;
    setDisabledState(): void;
    onWrapperClick(event: any): void;
    private initializeSubscriptions;
    private updateInputValue;
    private updateControlValue;
    private getDisplayNames;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCombobox<any>, [null, null, { optional: true; self: true; }, null, null, null, null, null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCombobox<any>, "clr-combobox", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "editable": { "alias": "clrEditable"; "required": false; }; "multiSelect": { "alias": "clrMulti"; "required": false; }; }, { "clrInputChange": "clrInputChange"; "clrOpenChange": "clrOpenChange"; "clrSelectionChange": "clrSelectionChange"; }, ["optionSelected", "options"], ["*"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrOption<T> implements OnInit {
    elRef: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private focusHandler;
    private optionSelectionService;
    optionProxy: OptionData<T>;
    private _id;
    private _value;
    constructor(elRef: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, optionSelectionService: OptionSelectionService<T>);
    get optionId(): string;
    set optionId(id: string);
    get value(): T;
    set value(value: T);
    get selected(): boolean;
    get focusClass(): boolean;
    ngOnInit(): void;
    onClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOption<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOption<any>, "clr-option", never, { "optionId": { "alias": "id"; "required": false; }; "value": { "alias": "clrValue"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrOptions<T> implements AfterViewInit, LoadingListener, OnDestroy {
    optionSelectionService: OptionSelectionService<T>;
    id: number;
    el: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private focusHandler;
    private popoverService;
    private document;
    optionsId: string;
    loading: boolean;
    _items: QueryList<ClrOption<T>>;
    private subscriptions;
    constructor(optionSelectionService: OptionSelectionService<T>, id: number, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, popoverService: ClrPopoverService, parentHost: ElementRef<HTMLElement>, document: any);
    get items(): QueryList<ClrOption<T>>;
    set items(items: QueryList<ClrOption<T>>);
    /**
     * Tests if the list of options is empty, meaning it doesn't contain any items
     */
    get emptyOptions(): boolean;
    get editable(): boolean;
    get noResultsElementId(): string;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    searchText(input: string): string;
    loadingStateChange(state: ClrLoadingState): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptions<any>, [null, null, null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOptions<any>, "clr-options", never, { "optionsId": { "alias": "id"; "required": false; }; }, {}, ["items"], ["*"], false, never>;
}

declare class ClrOptionItems<T> implements DoCheck, OnDestroy {
    template: TemplateRef<NgForOfContext<T>>;
    private differs;
    private optionService;
    private iterableProxy;
    private _rawItems;
    private filteredItems;
    private subscriptions;
    private filter;
    private _filterField;
    private differ;
    constructor(template: TemplateRef<NgForOfContext<T>>, differs: IterableDiffers, optionService: OptionSelectionService<T>, vcr: ViewContainerRef);
    set rawItems(items: T[]);
    set trackBy(value: TrackByFunction<T>);
    set field(field: string);
    get hasResults(): number;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    private updateItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionItems<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrOptionItems<any>, "[clrOptionItems][clrOptionItemsOf]", never, { "rawItems": { "alias": "clrOptionItemsOf"; "required": false; }; "trackBy": { "alias": "clrOptionItemsTrackBy"; "required": false; }; "field": { "alias": "clrOptionItemsField"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrOptionGroup<T> {
    label: string;
    protected clrOptionItems: ClrOptionItems<T>;
    protected labelId: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionGroup<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOptionGroup<any>, "clr-option-group", never, { "label": { "alias": "clrOptionGroupLabel"; "required": false; }; }, {}, ["clrOptionItems"], ["*"], false, never>;
}

declare enum ClrFocusDirection {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    BOTH = "both"
}

interface FocusableItem {
    tabIndex?: number;
    focus: () => void;
    nativeElement?: HTMLElement;
}

declare class ClrKeyFocusItem {
    private elementRef;
    private platformId;
    constructor(elementRef: ElementRef<HTMLElement>, platformId: any);
    get nativeElement(): HTMLElement;
    focus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrKeyFocusItem, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrKeyFocusItem, "[clrKeyFocusItem]", never, {}, {}, never, never, false, never>;
}

declare class ClrKeyFocus {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrKeyFocus, "[clrKeyFocus]", never, { "direction": { "alias": "clrDirection"; "required": false; }; "focusOnLoad": { "alias": "clrFocusOnLoad"; "required": false; }; "focusableItems": { "alias": "clrKeyFocus"; "required": false; }; }, { "focusChange": "clrFocusChange"; }, ["clrKeyFocusItems"], ["*"], false, never>;
}

declare class ClrRovingTabindex extends ClrKeyFocus {
    private renderer;
    private disabled;
    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2);
    get rovingIndexItems(): Array<FocusableItem> | string;
    set rovingIndexItems(elements: Array<FocusableItem> | string);
    set rovingTabindexDisabled(disabled: boolean);
    handleKeyboardEvent(event: KeyboardEvent): void;
    setClickedItemCurrent(event: any): void;
    protected initializeFocus(): void;
    private updateTabindex;
    private setTabindex;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRovingTabindex, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRovingTabindex, "[clrRovingTabindex]", never, { "rovingIndexItems": { "alias": "clrRovingTabindex"; "required": false; }; "rovingTabindexDisabled": { "alias": "clrRovingTabindexDisabled"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrKeyFocusModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrKeyFocusModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrKeyFocusModule, [typeof ClrKeyFocus, typeof ClrRovingTabindex, typeof ClrKeyFocusItem], [typeof i2.CommonModule], [typeof ClrKeyFocus, typeof ClrRovingTabindex, typeof ClrKeyFocusItem]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrKeyFocusModule>;
}

declare class ClrComboboxModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrComboboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrComboboxModule, [typeof ClrCombobox, typeof ClrComboboxContainer, typeof ClrOptions, typeof ClrOption, typeof ClrOptionGroup, typeof ClrOptionSelected, typeof ClrOptionItems], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrKeyFocusModule, typeof ClrCommonFormsModule, typeof ClrConditionalModule, typeof ClrPopoverModuleNext, typeof ClrSpinnerModule], [typeof ClrCommonFormsModule, typeof ClrCombobox, typeof ClrComboboxContainer, typeof ClrOptions, typeof ClrOption, typeof ClrOptionGroup, typeof ClrOptionSelected, typeof ClrConditionalModule, typeof ClrOptionItems]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrComboboxModule>;
}

declare class DatalistIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatalistIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatalistIdService>;
}

declare class ClrDatalist implements AfterContentInit {
    private datalistIdService;
    datalistId: string;
    private subscriptions;
    constructor(datalistIdService: DatalistIdService);
    set id(idValue: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalist, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalist, "datalist", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, never, false, never>;
}

declare class FocusService {
    private _focused;
    get focusChange(): Observable<boolean>;
    set focused(state: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FocusService>;
}

declare class ClrDatalistContainer extends ClrAbstractContainer {
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FocusService, ifControlStateService: IfControlStateService);
    showPicker(datalist: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistContainer, [null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatalistContainer, "clr-datalist-container", never, {}, {}, never, ["label", "[clrDatalistInput]", "datalist", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrDatalistInput extends WrappedFormControl<ClrDatalistContainer> implements AfterContentInit {
    private focusService;
    private datalistIdService;
    listValue: string;
    constructor(focusService: FocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, datalistIdService: DatalistIdService);
    ngAfterContentInit(): void;
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalistInput, "[clrDatalistInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrInputContainer extends ClrAbstractContainer {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInputContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrInputContainer, "clr-input-container", never, {}, {}, never, ["label", "[clrInputPrefix]", "[clrInput]", "[clrInputSuffix]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrInput extends WrappedFormControl<ClrInputContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInput, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrInput, "[clrInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrInputModule, [typeof ClrInput, typeof ClrInputContainer], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrCommonFormsModule], [typeof ClrCommonFormsModule, typeof ClrInput, typeof ClrInputContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrInputModule>;
}

declare class ClrDatalistModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatalistModule, [typeof ClrDatalist, typeof ClrDatalistInput, typeof ClrDatalistContainer], [typeof i2.CommonModule, typeof ClrInputModule, typeof ClrIcon], [typeof ClrDatalist, typeof ClrDatalistInput, typeof ClrDatalistContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatalistModule>;
}

declare class DateFormControlService {
    disabled: boolean;
    private _touchedChange;
    private _dirtyChange;
    get touchedChange(): Observable<void>;
    get dirtyChange(): Observable<void>;
    markAsTouched(): void;
    markAsDirty(): void;
    setDisabled(state: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFormControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateFormControlService>;
}

interface ClrDayOfWeek {
    readonly day: string;
    readonly narrow: string;
}

/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
declare class LocaleHelperService {
    locale: string;
    private _firstDayOfWeek;
    private _localeDays;
    private _localeMonthsAbbreviated;
    private _localeMonthsWide;
    private _localeDateFormat;
    constructor(locale: string);
    get firstDayOfWeek(): number;
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get localeDaysNarrow(): ReadonlyArray<string>;
    get localeMonthsAbbreviated(): ReadonlyArray<string>;
    get localeMonthsWide(): ReadonlyArray<string>;
    get localeDateFormat(): string;
    /**
     * Initializes the locale data.
     */
    private initializeLocaleData;
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    private initializeLocaleDays;
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    private initializeLocaleMonthsAbbreviated;
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    private initializeLocaleMonthsWide;
    /**
     * Initializes the first day of the week based on the locale.
     */
    private initializeFirstDayOfWeek;
    private initializeLocaleDateFormat;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocaleHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocaleHelperService>;
}

declare class DayModel {
    readonly year: number;
    readonly month: number;
    readonly date: number;
    constructor(year: number, month: number, date: number);
    /**
     * Checks if the passed CalendarDate is equal to itself.
     */
    isEqual(day: DayModel): boolean;
    toDate(): Date;
    /**
     * Returns a new DayModel which is incremented based on the value passed.
     */
    incrementBy(value: number): DayModel;
    /**
     * Clones the current day model.
     */
    clone(): DayModel;
    toComparisonString(): string;
    toDateString(): string;
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isBefore(day: DayModel, dayInclusive?: boolean): boolean;
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isAfter(day: DayModel, dayInclusive?: boolean): boolean;
    private pad;
}

interface DateRange {
    minDate?: DayModel;
    maxDate?: DayModel;
}
interface DateRangeInput {
    startDate: DayModel;
    endDate?: DayModel;
}
interface DateRangeOption {
    label: string;
    value: Date[];
}

declare class DateIOService {
    disabledDates: DateRange;
    cldrLocaleDateFormat: string;
    minDateChange: Subject<DayModel>;
    maxDateChange: Subject<DayModel>;
    private dateRangeOptions;
    private localeDisplayFormat;
    private delimiters;
    constructor(localeHelperService: LocaleHelperService);
    get placeholderText(): string;
    setMinDate(date: string): void;
    setMaxDate(date: string): void;
    setRangeOptions(rangeOptions: DateRangeOption[]): void;
    getRangeOptions(): any;
    toLocaleDisplayFormatString(date: Date): string;
    getDateValueFromDateString(date: string): Date;
    private validateDateRangeOptions;
    private initializeLocaleDisplayFormat;
    private extractDelimiters;
    /**
     * Checks if the month entered by the user is valid or not.
     * Note: Month is 0 based.
     */
    private isValidMonth;
    /**
     * Checks if the date is valid depending on the year and month provided.
     */
    private isValidDate;
    /**
     * Validates the parameters provided and returns the date.
     * If the parameters are not
     * valid then return null.
     * NOTE: (Month here is 1 based since the user has provided that as an input)
     */
    private validateAndGetDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateIOService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateIOService>;
}

declare class CalendarModel {
    readonly year: number;
    readonly month: number;
    days: DayModel[];
    constructor(year: number, month: number);
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar: CalendarModel): boolean;
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day: DayModel): boolean;
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear(): CalendarModel;
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear(): CalendarModel;
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    private initializeDaysInCalendar;
}

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
declare class DateNavigationService {
    persistedDate: DayModel;
    persistedEndDate: DayModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    focusedDay: DayModel;
    hoveredDay: DayModel;
    hoveredMonth: number;
    hoveredYear: number;
    isRangePicker: boolean;
    hasActionButtons: boolean;
    private _displayedCalendar;
    private _todaysFullDate;
    private _today;
    private _selectedDayChange;
    private _selectedEndDayChange;
    private _displayedCalendarChange;
    private _focusOnCalendarChange;
    private _refreshCalendarView;
    private _focusedDayChange;
    get today(): DayModel;
    get displayedCalendar(): CalendarModel;
    get selectedDayChange(): Observable<DayModel>;
    get selectedEndDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView(): Observable<void>;
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject: DayModel | DateRangeInput, { emitEvent }?: {
        emitEvent: boolean;
    }): void;
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar(): void;
    changeMonth(month: number): void;
    changeYear(year: number): void;
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth(): void;
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth(): void;
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear(): void;
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear(): void;
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth(): void;
    moveToSpecificMonth(day: DayModel): void;
    incrementFocusDay(value: number): void;
    resetSelectedDay(): void;
    convertDateToDayModel(date: Date): DayModel;
    private setSelectedDay;
    private setSelectedEndDay;
    private setDisplayedCalendar;
    private initializeTodaysDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateNavigationService>;
}

declare class DatepickerEnabledService {
    private _document;
    private _isUserAgentMobile;
    private _innerWidth;
    constructor(_document: any);
    /**
     * Returns if the calendar should be active or not.
     * If the user agent is mobile and the screen width is less than DATEPICKER_ACTIVE_BREAKPOINT
     * then the calendar is inactive.
     */
    get isEnabled(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerEnabledService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatepickerEnabledService>;
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
declare class ViewManagerService {
    position: ClrPopoverPosition;
    private _currentView;
    get isDayView(): boolean;
    get isYearView(): boolean;
    get isMonthView(): boolean;
    changeToMonthView(): void;
    changeToYearView(): void;
    changeToDayView(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ViewManagerService>;
}

declare class ClrDateContainer extends ClrAbstractContainer implements AfterViewInit {
    protected renderer: Renderer2;
    protected elem: ElementRef;
    private popoverService;
    private dateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private dateIOService;
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    protected controlClassService: ControlClassService;
    protected layoutService: LayoutService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    protected popoverType: ClrPopoverType;
    private toggleButton;
    constructor(renderer: Renderer2, elem: ElementRef, popoverService: ClrPopoverService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, dateIOService: DateIOService, commonStrings: ClrCommonStringsService, focusService: FocusService, viewManagerService: ViewManagerService, controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag: boolean);
    set clrPosition(position: string | ClrPopoverPosition);
    set rangeOptions(rangeOptions: any);
    set min(dateString: string);
    set max(dateString: string);
    set actionButton(button: ElementRef<HTMLButtonElement>);
    get popoverPosition(): ClrPopoverPosition;
    get open(): boolean;
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled(): boolean;
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled(): boolean;
    protected get isRangePicker(): boolean;
    ngAfterViewInit(): void;
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    private getToggleButtonLabel;
    private listenForDateChanges;
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    private initializeCalendar;
    private dateRangeStructuralChecks;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateContainer, [null, null, null, null, null, null, null, null, null, null, null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDateContainer, "clr-date-container, clr-date-range-container", never, { "showActionButtons": { "alias": "showActionButtons"; "required": false; }; "clrPosition": { "alias": "clrPosition"; "required": false; }; "rangeOptions": { "alias": "rangeOptions"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, {}, never, ["label", "[clrStartDate]", "[clrEndDate]", "[clrDate]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

/**
 * This service focuses the day that is focusable in the calendar.
 */
declare class DatepickerFocusService {
    private _ngZone;
    private platformId;
    constructor(_ngZone: NgZone, platformId: any);
    focusCell(elRef: ElementRef<HTMLElement>): void;
    focusInput(element: HTMLInputElement): void;
    elementIsFocused(element: HTMLInputElement): boolean;
    private ngZoneIsStableInBrowser;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerFocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatepickerFocusService>;
}

declare abstract class ClrDateInputBase extends WrappedFormControl<ClrDateContainer> implements OnInit, AfterViewInit, OnDestroy {
    protected el: ElementRef<HTMLInputElement>;
    protected renderer: Renderer2;
    protected control: NgControl;
    private container;
    protected dateIOService: DateIOService;
    protected dateNavigationService: DateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private platformId;
    private focusService;
    protected datepickerFocusService: DatepickerFocusService;
    static ngAcceptInputType_date: Date | null | string;
    placeholder: string;
    protected index: number;
    private initialClrDateInputValue;
    private previousDateChange;
    protected abstract dateChange: EventEmitter<Date>;
    constructor(viewContainerRef: ViewContainerRef, injector: Injector, el: ElementRef<HTMLInputElement>, renderer: Renderer2, control: NgControl, container: ClrDateContainer, dateIOService: DateIOService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, platformId: any, focusService: FocusService, datepickerFocusService: DatepickerFocusService);
    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    get placeholderText(): string;
    get inputType(): string;
    protected abstract get userSelectedDayChange(): Observable<DayModel>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    setFocusStates(): void;
    triggerValidation(): void;
    onValueChange(target: HTMLInputElement): void;
    protected datepickerHasFormControl(): boolean;
    protected setDate(date: Date | string): void;
    protected triggerControlInputValidation(): void;
    private usingClarityDatepicker;
    private usingNativeDatepicker;
    private setFocus;
    private populateServicesFromContainerComponent;
    private processInitialInputs;
    private updateDate;
    private updateInput;
    private getValidDateValueFromDate;
    private emitDateOutput;
    private listenForControlValueChanges;
    private listenForUserSelectedDayChanges;
    private listenForTouchChanges;
    private listenForDirtyChanges;
    private listenForInputRefocus;
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    private validateDateRange;
    protected abstract updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputBase, [null, null, null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputBase, never, never, { "placeholder": { "alias": "placeholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    set date(date: Date | string);
    set min(dateString: string);
    set max(dateString: string);
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInput, "[clrDate]", never, { "date": { "alias": "clrDate"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, { "dateChange": "clrDateChange"; }, never, never, false, never>;
}

declare class ClrStartDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInput, "[clrStartDate]", never, { "inputWidth": { "alias": "inputWidth"; "required": false; }; "date": { "alias": "clrStartDate"; "required": false; }; }, { "dateChange": "clrStartDateChange"; }, never, never, false, never>;
}

declare class ClrEndDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInput, "[clrEndDate]", never, { "inputWidth": { "alias": "inputWidth"; "required": false; }; "date": { "alias": "clrEndDate"; "required": false; }; }, { "dateChange": "clrEndDateChange"; }, never, never, false, never>;
}

declare class ClrDateInputValidator implements Validator {
    private dateIOService;
    constructor(dateIOService: DateIOService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputValidator, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputValidator, "[clrDate], [clrStartDate], [clrEndDate]", never, {}, {}, never, never, false, never>;
}
declare class ClrStartDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInputValidator, "[clrStartDate]", never, {}, {}, never, never, false, never>;
}
declare class ClrEndDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInputValidator, "[clrEndDate]", never, {}, {}, never, never, false, never>;
}

declare class ClrDatepickerViewManager {
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    private dateNavigationService;
    private dateIOService;
    constructor(commonStrings: ClrCommonStringsService, viewManagerService: ViewManagerService, dateNavigationService: DateNavigationService, dateIOService: DateIOService);
    /**
     * Returns if the current view is the monthpicker.
     */
    get isMonthView(): boolean;
    /**
     * Returns if the current view is the yearpicker.
     */
    get isYearView(): boolean;
    /**
     * Returns if the current view is the daypicker.
     */
    get isDayView(): boolean;
    get hasRangeOptions(): boolean;
    protected get hasActionButtons(): boolean;
    protected get dateRangeOptions(): any;
    onRangeOptionSelect(selectedRange: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerViewManager, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerViewManager, "clr-datepicker-view-manager", never, {}, {}, never, never, false, never>;
}

declare class ClrDaypicker {
    private _viewManagerService;
    private _dateNavigationService;
    private _localeHelperService;
    commonStrings: ClrCommonStringsService;
    constructor(_viewManagerService: ViewManagerService, _dateNavigationService: DateNavigationService, _localeHelperService: LocaleHelperService, commonStrings: ClrCommonStringsService);
    get monthAttrString(): string;
    get yearAttrString(): string;
    /**
     * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
     */
    get calendarMonth(): string;
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear(): number;
    /**
     * Calls the ViewManagerService to change to the monthpicker view.
     */
    changeToMonthView(): void;
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView(): void;
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextMonth(): void;
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousMonth(): void;
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentMonth(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDaypicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDaypicker, "clr-daypicker", never, {}, {}, never, never, false, never>;
}

declare class ClrMonthpicker implements AfterViewInit {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _elRef;
    private _viewManagerService;
    commonStrings: ClrCommonStringsService;
    /**
     * Keeps track of the current focused month.
     */
    private _focusedMonthIndex;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _elRef: ElementRef, _viewManagerService: ViewManagerService, commonStrings: ClrCommonStringsService);
    /**
     * Gets the months array which is used to rendered the monthpicker view.
     * Months are in the TranslationWidth.Wide format.
     */
    get monthNames(): ReadonlyArray<string>;
    /**
     * Gets the month value of the Calendar.
     */
    get calendarMonthIndex(): number;
    /**
     * Gets the year which the user is currently on.
     */
    get calendarEndMonthIndex(): number;
    get yearAttrString(): string;
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear(): number;
    get currentCalendarYear(): number;
    get currentCalendarMonth(): number;
    getIsRangeStartMonth(monthIndex: number): boolean;
    getIsRangeEndMonth(monthIndex: number): boolean;
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView(): void;
    /**
     * Focuses on the current calendar month when the View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Handles the Keyboard arrow navigation for the monthpicker.
     */
    onKeyDown(event: KeyboardEvent): void;
    isSelected(monthIndex: number): boolean;
    /**
     * Calls the DateNavigationService to update the hovered month value of the calendar
     */
    onHover(monthIndex: number): void;
    /**
     * Calls the DateNavigationService to update the month value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeMonth(monthIndex: number): void;
    /**
     * Compares the month passed to the focused month and returns the tab index.
     */
    getTabIndex(monthIndex: number): number;
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextYear(): void;
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousYear(): void;
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentYear(): void;
    /**
     * Applicable only to date range picker
     * Compares the month passed is in between the start and end date range
     */
    isInRange(monthIndex: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMonthpicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrMonthpicker, "clr-monthpicker", never, {}, {}, never, never, false, never>;
}

declare class YearRangeModel {
    private readonly year;
    yearRange: number[];
    constructor(year: number);
    /**
     * Gets the number in the middle of the range.
     */
    get middleYear(): number;
    /**
     * Generates the YearRangeModel for the next decade.
     */
    nextDecade(): YearRangeModel;
    /**
     * Generates the YearRangeModel for the previous decade.
     */
    previousDecade(): YearRangeModel;
    /**
     * Generates the YearRangeModel for the current decade.
     */
    currentDecade(): YearRangeModel;
    /**
     * Checks if the value is in the YearRangeModel.
     */
    inRange(value: number): boolean;
    /**
     * Generates the year range based on the year parameter.
     * eg: If 2018 is passed the output will be [2010, 2011, ..., 2019]
     */
    private generateYearRange;
    /**
     * Function which generate a range of numbers from floor to ceil.
     */
    private generateRange;
}

declare class ClrYearpicker implements AfterViewInit {
    private _dateNavigationService;
    private _viewManagerService;
    private _datepickerFocusService;
    private _elRef;
    commonStrings: ClrCommonStringsService;
    /**
     * YearRangeModel which is used to build the YearPicker view.
     */
    yearRangeModel: YearRangeModel;
    /**
     * Keeps track of the current focused year.
     */
    private _focusedYear;
    constructor(_dateNavigationService: DateNavigationService, _viewManagerService: ViewManagerService, _datepickerFocusService: DatepickerFocusService, _elRef: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService);
    get selectedStartYear(): number;
    get selectedEndYear(): number;
    /**
     * Gets the year which the user is currently on.
     */
    get calendarYear(): number;
    isCurrentCalendarYear(year: number): boolean;
    getIsRangeStartYear(year: number): boolean;
    getIsRangeEndYear(year: number): boolean;
    /**
     * Focuses on the current calendar year when the View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Handles the Keyboard arrow navigation for the yearpicker.
     */
    onKeyDown(event: KeyboardEvent): void;
    /**
     * Calls the DateNavigationService to update the year value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeYear(year: number): void;
    /**
     * Calls the DateNavigationService to update the hovered year value of the calendar
     */
    onHover(year: number): void;
    /**
     * Updates the YearRangeModel to the previous decade.
     */
    previousDecade(): void;
    /**
     * Updates the YearRangeModel to the current decade.
     */
    currentDecade(): void;
    /**
     * Updates the YearRangeModel to the next decade.
     */
    nextDecade(): void;
    /**
     * Compares the year passed to the focused year and returns the tab index.
     */
    getTabIndex(year: number): number;
    /**
     * Applicable only to date range picker
     * Compares the year passed is in between the start and end date range
     */
    isInRange(year: number): boolean;
    changeToDayView(): void;
    /**
     * Increments the focus year by the value passed. Updates the YearRangeModel if the
     * new value is not in the current decade.
     */
    private incrementFocusYearBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrYearpicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrYearpicker, "clr-yearpicker", never, {}, {}, never, never, false, never>;
}

declare class DayViewModel {
    dayModel: DayModel;
    isTodaysDate: boolean;
    isExcluded: boolean;
    isDisabled: boolean;
    isSelected: boolean;
    isFocusable: boolean;
    isRangeStartDay: boolean;
    isRangeEndDay: boolean;
    constructor(dayModel: DayModel, isTodaysDate?: boolean, isExcluded?: boolean, isDisabled?: boolean, isSelected?: boolean, isFocusable?: boolean, isRangeStartDay?: boolean, isRangeEndDay?: boolean);
    /**
     * Gets the tab index based on the isFocusable flag.
     */
    get tabIndex(): number;
}

declare class CalendarViewModel {
    calendar: CalendarModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    private focusableDay;
    private today;
    firstDayOfWeek: number;
    private excludedDates;
    private currMonthDayViews;
    private _calendarView;
    constructor(calendar: CalendarModel, selectedDay: DayModel, selectedEndDay: DayModel, focusableDay: DayModel, today: DayModel, firstDayOfWeek: number, excludedDates: DateRange);
    /**
     * DayViewModel matrix. Size 6x7
     */
    get calendarView(): DayViewModel[][];
    /**
     * Updates the focusable day in the calendar.
     */
    updateFocusableDay(day: DayModel): void;
    /**
     * Updates the selected day in the calendar
     */
    updateSelectedDay(day: DayModel | undefined): void;
    /**
     * Updates the selected end day in the calendar
     */
    updateSelectedEndDay(day: DayModel | undefined): void;
    /**
     * Generates a 6x7 matrix of DayViewModel based on the Calendar.
     * The 6x7 matrix is structured according to the first day of the week.
     * 6 rows to accommodate months which might have dates spanning over 6 weeks.
     * 7 columns because there are 7 days in a week :P :D
     */
    private initializeCalendarView;
    private isDateExcluded;
    /**
     * Generates a DayViewModel array based on the DayModel passed
     */
    private generateDayViewModels;
    /**
     * Gets the first day of the current month to figure out how many dates of previous month
     * are needed to complete the Calendar View based on the first day of the week.
     * eg: Assuming locale en-US, the first day of the week is Sunday,
     * if first day of the current month lands on Wednesday, then
     * (this.getDay function would return 3 since
     * first day of the week is 0), we need the 3 days from the previous month.
     */
    private numDaysFromPrevMonthInCalView;
    /**
     * Checks if the Day passed is in the CalendarView.
     */
    private isDayInCalendarView;
    /**
     * Using the DayViewModels from the previous, current and next month, this function
     * generates the CalendarView.
     */
    private generateCalendarView;
    /**
     * Initialize the selected day if the day is in the calendar.
     */
    private initializeSelectedDay;
    /**
     * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
     * we check for the selected day. If selected day is not set then check if today is in the current
     * calendar. If not then just set the 15th of the current calendar month.
     */
    private initializeFocusableDay;
    private setFocusableFlag;
    private setSelectedDay;
}

declare class ClrCalendar implements OnDestroy {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _dateIOService;
    private _elRef;
    private _dateFormControlService;
    private _popoverService;
    /**
     * Calendar View Model to generate the Calendar.
     */
    calendarViewModel: CalendarViewModel;
    private _subs;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _dateIOService: DateIOService, _elRef: ElementRef<HTMLElement>, _dateFormControlService: DateFormControlService, _popoverService: ClrPopoverService);
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get calendar(): CalendarModel;
    get selectedDay(): DayModel;
    get selectedEndDay(): DayModel;
    get focusedDay(): DayModel;
    get today(): DayModel;
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy(): void;
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event: KeyboardEvent): void;
    setSelectedDay(day: DayModel): void;
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    private initializeSubscriptions;
    private validateAndCloseDatePicker;
    private updateCalendarViewModal;
    private refreshCalendarViewModal;
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    private generateCalendarView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCalendar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCalendar, "clr-calendar", never, {}, {}, never, never, false, never>;
}

declare class ClrDay {
    private _dateNavigationService;
    private commonStrings;
    onSelectDay: EventEmitter<DayModel>;
    private _dayView;
    constructor(_dateNavigationService: DateNavigationService, commonStrings: ClrCommonStringsService);
    /**
     * DayViewModel input which is used to build the Day View.
     */
    get dayView(): DayViewModel;
    set dayView(day: DayViewModel);
    get dayString(): string;
    get isRangeStartDay(): boolean;
    get isRangeEndDay(): boolean;
    /**
     * Calls the DateNavigationService to update the hovered day value of the calendar
     */
    hoverListener(): void;
    /**
     * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
     */
    onDayViewFocus(): void;
    /**
     * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
     */
    selectDay(): void;
    /**
     * Applicable only to date range picker
     * Compares whether the day is in between the start and end date range
     */
    isInRange(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDay, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDay, "clr-day", never, { "dayView": { "alias": "clrDayView"; "required": false; }; }, { "onSelectDay": "selectDay"; }, never, never, false, never>;
}

declare class ClrDatepickerActions {
    protected commonStrings: ClrCommonStringsService;
    private popoverService;
    private dateNavigationService;
    private dateFormControlService;
    constructor(commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, dateNavigationService: DateNavigationService, dateFormControlService: DateFormControlService);
    protected apply(): void;
    protected cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerActions, "clr-datepicker-actions", never, {}, {}, never, never, false, never>;
}

/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
declare class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, focusTrapFactory: FocusTrapFactory, document: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkTrapFocusModule_CdkTrapFocus, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkTrapFocusModule_CdkTrapFocus, "[cdkTrapFocus]", never, {}, {}, never, never, false, never>;
}
/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
declare class CdkTrapFocusModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkTrapFocusModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CdkTrapFocusModule, [typeof CdkTrapFocusModule_CdkTrapFocus], never, [typeof CdkTrapFocusModule_CdkTrapFocus]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CdkTrapFocusModule>;
}

declare class VerticalNavGroupRegistrationService {
    navGroupCount: number;
    registerNavGroup(): void;
    unregisterNavGroup(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavGroupRegistrationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavGroupRegistrationService>;
}

declare class VerticalNavIconService {
    private _icons;
    get hasIcons(): boolean;
    registerIcon(): void;
    unregisterIcon(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavIconService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavIconService>;
}

declare class VerticalNavService {
    private _animateOnCollapsed;
    private _collapsedChanged;
    private _collapsed;
    private _collapsible;
    get animateOnCollapsed(): Observable<boolean>;
    get collapsedChanged(): Observable<boolean>;
    get collapsed(): boolean;
    set collapsed(value: boolean);
    get collapsible(): boolean;
    set collapsible(value: boolean);
    private updateCollapseBehavior;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavService>;
}

declare class ClrVerticalNav implements OnDestroy {
    private _navService;
    private _navIconService;
    private _navGroupRegistrationService;
    commonStrings: ClrCommonStringsService;
    toggleLabel: string;
    contentId: string;
    private _collapsedChanged;
    private _sub;
    constructor(_navService: VerticalNavService, _navIconService: VerticalNavIconService, _navGroupRegistrationService: VerticalNavGroupRegistrationService, commonStrings: ClrCommonStringsService);
    get collapsible(): boolean | string;
    set collapsible(value: boolean | string);
    get collapsed(): boolean | string;
    set collapsed(value: boolean | string);
    get hasNavGroups(): boolean;
    get hasIcons(): boolean;
    get ariaExpanded(): string;
    ngOnDestroy(): void;
    toggleByButton(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNav, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNav, "clr-vertical-nav", never, { "toggleLabel": { "alias": "clrVerticalNavToggleLabel"; "required": false; }; "collapsible": { "alias": "clrVerticalNavCollapsible"; "required": false; }; "collapsed": { "alias": "clrVerticalNavCollapsed"; "required": false; }; }, { "_collapsedChanged": "clrVerticalNavCollapsedChange"; }, never, ["*"], false, never>;
}

declare class VerticalNavGroupService {
    private _expandChange;
    get expandChange(): Observable<boolean>;
    expand(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavGroupService>;
}

declare class ClrVerticalNavLink implements OnDestroy {
    private destroy$;
    constructor(host: ElementRef<HTMLElement>, ref: ChangeDetectorRef, navGroupService: VerticalNavGroupService | null);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavLink, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavLink, "[clrVerticalNavLink]", never, {}, {}, never, ["[clrVerticalNavIcon]", "*"], false, never>;
}

declare class ClrVerticalNavGroup implements AfterContentInit, OnDestroy {
    private _itemExpand;
    private _navGroupRegistrationService;
    private _navService;
    commonStrings: ClrCommonStringsService;
    expandedChange: EventEmitter<boolean>;
    private wasExpanded;
    private _subscriptions;
    private _expandAnimationState;
    constructor(_itemExpand: IfExpandService, _navGroupRegistrationService: VerticalNavGroupRegistrationService, navGroupService: VerticalNavGroupService, _navService: VerticalNavService, commonStrings: ClrCommonStringsService);
    get expanded(): boolean;
    set expanded(value: boolean);
    set userExpandedInput(value: boolean | string);
    get expandAnimationState(): string;
    set expandAnimationState(value: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    expandGroup(): void;
    collapseGroup(): void;
    expandAnimationDone($event: AnimationEvent): void;
    toggleExpand(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavGroup, "clr-vertical-nav-group", never, { "userExpandedInput": { "alias": "clrVerticalNavGroupExpanded"; "required": false; }; }, { "expandedChange": "clrVerticalNavGroupExpandedChange"; }, never, ["[clrVerticalNavLink]", "[clrVerticalNavIcon]", "*", "[clrIfExpanded], clr-vertical-nav-group-children"], false, never>;
}

declare class ClrVerticalNavGroupChildren {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavGroupChildren, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavGroupChildren, "clr-vertical-nav-group-children", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrVerticalNavIcon implements OnDestroy {
    private _verticalNavIconService;
    constructor(_verticalNavIconService: VerticalNavIconService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrVerticalNavIcon, "[clrVerticalNavIcon]", never, {}, {}, never, never, false, never>;
}

declare const CLR_VERTICAL_NAV_DIRECTIVES: Type<any>[];
declare class ClrVerticalNavModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrVerticalNavModule, [typeof ClrVerticalNav, typeof ClrVerticalNavLink, typeof ClrVerticalNavGroup, typeof ClrVerticalNavGroupChildren, typeof ClrVerticalNavIcon], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrConditionalModule, typeof ClrFocusOnViewInitModule], [typeof ClrVerticalNav, typeof ClrVerticalNavLink, typeof ClrVerticalNavGroup, typeof ClrVerticalNavGroupChildren, typeof ClrVerticalNavIcon, typeof ClrConditionalModule, typeof ClrIcon, typeof ClrFocusOnViewInitModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrVerticalNavModule>;
}

declare const CLR_DATEPICKER_DIRECTIVES: Type<any>[];
declare class ClrDatepickerModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatepickerModule, [typeof ClrDateInput, typeof ClrDay, typeof ClrDateContainer, typeof ClrDateInputValidator, typeof ClrStartDateInput, typeof ClrEndDateInput, typeof ClrStartDateInputValidator, typeof ClrEndDateInputValidator, typeof ClrDatepickerViewManager, typeof ClrMonthpicker, typeof ClrYearpicker, typeof ClrDaypicker, typeof ClrCalendar, typeof ClrDatepickerActions], [typeof i2.CommonModule, typeof CdkTrapFocusModule, typeof ClrHostWrappingModule, typeof ClrConditionalModule, typeof ClrPopoverModuleNext, typeof ClrIcon, typeof ClrCommonFormsModule, typeof ClrVerticalNavModule], [typeof ClrDateInput, typeof ClrDay, typeof ClrDateContainer, typeof ClrDateInputValidator, typeof ClrStartDateInput, typeof ClrEndDateInput, typeof ClrStartDateInputValidator, typeof ClrEndDateInputValidator, typeof ClrDatepickerViewManager, typeof ClrMonthpicker, typeof ClrYearpicker, typeof ClrDaypicker, typeof ClrCalendar, typeof ClrDatepickerActions]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatepickerModule>;
}

interface ClrFileListValidationErrors {
    required?: boolean;
    accept?: ClrFileAcceptError[];
    minFileSize?: ClrFileMinFileSizeError[];
    maxFileSize?: ClrFileMaxFileSizeError[];
}
interface ClrFileAcceptError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The file types that are accepted by the file input.
     */
    accept: string[];
    /**
     * The actual MIME type of the selected file.
     */
    type: string;
    /**
     * The actual extension of the selected file.
     */
    extension: string;
}
interface ClrFileMinFileSizeError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The minimum file size that is accepted by the file input.
     */
    minFileSize: number;
    /**
     * The actual size of the selected file.
     */
    actualFileSize: number;
}
interface ClrFileMaxFileSizeError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The maximum file size that is accepted by the file input.
     */
    maxFileSize: number;
    /**
     * The actual size of the selected file.
     */
    actualFileSize: number;
}

interface ClrSingleFileValidationErrors {
    accept?: ClrFileAcceptError;
    minFileSize?: ClrFileMinFileSizeError;
    maxFileSize?: ClrFileMaxFileSizeError;
}
interface ClrFileMessagesTemplateContext {
    $implicit: File;
    success: boolean;
    errors: ClrSingleFileValidationErrors;
}
declare class ClrFileMessagesTemplate {
    readonly templateRef: TemplateRef<ClrFileMessagesTemplateContext>;
    static ngTemplateContextGuard(directive: ClrFileMessagesTemplate, context: unknown): context is ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileMessagesTemplate, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileMessagesTemplate, "ng-template[clr-file-messages]", never, {}, {}, never, never, false, never>;
}

declare class ClrFileList {
    protected readonly fileMessagesTemplate: ClrFileMessagesTemplate;
    private readonly injector;
    private readonly commonStrings;
    private readonly ngControlService;
    private readonly fileInputContainer;
    constructor();
    protected get files(): File[];
    protected getClearFileLabel(filename: string): string;
    protected clearFile(fileToRemove: File): void;
    protected createFileMessagesTemplateContext(file: File): ClrFileMessagesTemplateContext;
    protected createFileMessagesTemplateInjector(fileMessagesTemplateContext: ClrFileMessagesTemplateContext): i0.DestroyableInjector;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileList, "clr-file-list", never, {}, {}, ["fileMessagesTemplate"], never, false, never>;
}

declare class ClrFileInputContainer extends ClrAbstractContainer {
    customButtonLabel: string;
    readonly fileInput: ClrFileInput;
    protected readonly fileList: ClrFileList;
    private browseButtonElementRef;
    private fileListFileInputElementRef;
    private readonly fileSuccessComponent;
    private readonly fileErrorComponent;
    private readonly commonStrings;
    protected get accept(): string;
    protected get multiple(): boolean;
    protected get disabled(): boolean;
    protected get browseButtonText(): string;
    protected get browseButtonDescribedBy(): string;
    protected get successMessagePresent(): boolean;
    protected get errorMessagePresent(): boolean;
    focusBrowseButton(): void;
    protected browse(): void;
    protected clearSelectedFiles(): void;
    protected addFilesToSelection(newFiles: FileList): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInputContainer, "clr-file-input-container", never, { "customButtonLabel": { "alias": "clrButtonLabel"; "required": false; }; }, {}, ["fileInput", "fileList", "fileSuccessComponent", "fileErrorComponent"], ["label", "[clrFileInput]", "clr-control-helper", "clr-control-error", "clr-control-success", "clr-file-list"], false, never>;
}

interface ClrFileInputSelection {
    fileCount: number;
    buttonLabel: string;
    clearFilesButtonLabel: string;
}
declare class ClrFileInput extends WrappedFormControl<ClrFileInputContainer> {
    readonly elementRef: ElementRef<HTMLInputElement>;
    private readonly control;
    private readonly commonStrings;
    selection: ClrFileInputSelection;
    constructor(injector: Injector, renderer: Renderer2, viewContainerRef: ViewContainerRef, elementRef: ElementRef<HTMLInputElement>, control: NgControl, commonStrings: ClrCommonStringsService);
    protected get disabled(): boolean;
    private handleChange;
    private updateSelection;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInput, [null, null, null, null, { optional: true; self: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInput, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrFileInputValidator implements Validator {
    private readonly elementRef;
    minFileSize: number;
    maxFileSize: number;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    validate(control: AbstractControl<FileList>): ValidationErrors;
    private getSuffixByDepth;
    private validateAccept;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValidator, "input[type=\"file\"][clrFileInput]", never, { "minFileSize": { "alias": "clrMinFileSize"; "required": false; }; "maxFileSize": { "alias": "clrMaxFileSize"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrFileInputValueAccessor implements ControlValueAccessor {
    private readonly elementRef;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: FileList): void;
    registerOnChange(fn: (value: FileList) => void): void;
    registerOnTouched(fn: () => void): void;
    private handleChange;
    private onChange;
    private onTouched;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValueAccessor, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

declare const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT: InjectionToken<ClrFileMessagesTemplateContext>;
declare class ClrFileInfo {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInfo, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInfo, "clr-file-info", never, {}, {}, never, ["*"], false, never>;
}
declare class ClrFileSuccess {
    protected readonly context: ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileSuccess, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileSuccess, "clr-file-success", never, {}, {}, never, ["*"], false, never>;
}
declare class ClrFileError {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileError, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileError, "clr-file-error", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrFileInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrFileInputModule, [typeof ClrFileInput, typeof ClrFileInputContainer, typeof ClrFileInputValidator, typeof ClrFileInputValueAccessor, typeof ClrFileList, typeof ClrFileMessagesTemplate, typeof ClrFileInfo, typeof ClrFileSuccess, typeof ClrFileError], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrCommonFormsModule], [typeof ClrCommonFormsModule, typeof ClrFileInput, typeof ClrFileInputContainer, typeof ClrFileInputValidator, typeof ClrFileInputValueAccessor, typeof ClrFileList, typeof ClrFileMessagesTemplate, typeof ClrFileInfo, typeof ClrFileSuccess, typeof ClrFileError]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrFileInputModule>;
}

declare class ClrNumberInputContainer extends ClrAbstractContainer {
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    protected readonly input: ClrNumberInput;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FocusService, ifControlStateService: IfControlStateService);
    focusOut(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputContainer, [null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrNumberInputContainer, "clr-number-input-container", never, {}, {}, ["input"], ["label", "[clrNumberInput]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrNumberInput extends WrappedFormControl<ClrNumberInputContainer> {
    private focusService;
    private control;
    protected el: ElementRef<HTMLInputElement>;
    protected index: number;
    constructor(focusService: FocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    get readonly(): boolean;
    triggerFocus(): void;
    triggerValidation(): void;
    stepUp(): void;
    stepDown(): void;
    dispatchBlur(): void;
    private dispatchStepChangeEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNumberInput, "input[type=\"number\"][clrNumberInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrNumberInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNumberInputModule, [typeof ClrNumberInput, typeof ClrNumberInputContainer], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrCommonFormsModule], [typeof ClrCommonFormsModule, typeof ClrNumberInput, typeof ClrNumberInputContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNumberInputModule>;
}

declare const TOGGLE_SERVICE: InjectionToken<BehaviorSubject<boolean>>;
declare function ToggleServiceFactory(): BehaviorSubject<boolean>;
declare const TOGGLE_SERVICE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof ToggleServiceFactory;
};
declare class ClrPasswordContainer extends ClrAbstractContainer {
    focusService: FocusService;
    private toggleService;
    commonStrings: ClrCommonStringsService;
    show: boolean;
    focus: boolean;
    private _toggle;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, focusService: FocusService, toggleService: BehaviorSubject<boolean>, commonStrings: ClrCommonStringsService);
    get clrToggle(): boolean;
    set clrToggle(state: boolean);
    toggle(): void;
    showPasswordText(label: string): string;
    hidePasswordText(label: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordContainer, [null, { optional: true; }, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrPasswordContainer, "clr-password-container", never, { "clrToggle": { "alias": "clrToggle"; "required": false; }; }, {}, never, ["label", "[clrPassword]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrPassword extends WrappedFormControl<ClrPasswordContainer> implements OnInit, OnDestroy {
    private focusService;
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, focusService: FocusService, toggleService: BehaviorSubject<boolean>);
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPassword, [null, null, { optional: true; self: true; }, null, null, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPassword, "[clrPassword]", never, {}, {}, never, never, false, never>;
}

declare class ClrPasswordModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPasswordModule, [typeof ClrPassword, typeof ClrPasswordContainer], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrCommonFormsModule], [typeof ClrCommonFormsModule, typeof ClrPassword, typeof ClrPasswordContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPasswordModule>;
}

declare class ClrRadioWrapper implements OnInit {
    label: ClrControlLabel;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRadioWrapper, "clr-radio-wrapper", never, {}, {}, ["label"], ["[clrRadio]", "label"], false, never>;
}

declare class ClrRadio extends WrappedFormControl<ClrRadioWrapper> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadio, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRadio, "[clrRadio]", never, {}, {}, never, never, false, never>;
}

declare class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    role: string;
    ariaLabelledBy: string;
    radios: QueryList<ClrRadio>;
    groupLabel: ElementRef<HTMLElement>;
    private inline;
    private _generatedId;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    ngAfterContentInit(): void;
    private setAriaRoles;
    private setAriaLabelledBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioContainer, [{ optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRadioContainer, "clr-radio-container", never, { "clrInline": { "alias": "clrInline"; "required": false; }; }, {}, ["groupLabel", "radios"], ["label", "clr-radio-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrRadioModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrRadioModule, [typeof ClrRadio, typeof ClrRadioContainer, typeof ClrRadioWrapper], [typeof i2.CommonModule, typeof ClrCommonFormsModule, typeof ClrHostWrappingModule, typeof ClrIcon], [typeof ClrCommonFormsModule, typeof ClrRadio, typeof ClrRadioContainer, typeof ClrRadioWrapper]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrRadioModule>;
}

declare class ClrSelectContainer extends ClrAbstractContainer {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    multiple: SelectMultipleControlValueAccessor;
    private multi;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    ngOnInit(): void;
    wrapperClass(): "clr-multiselect-wrapper" | "clr-select-wrapper";
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectContainer, [{ optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSelectContainer, "clr-select-container", never, {}, {}, ["multiple"], ["label", "[clrSelect]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrSelect extends WrappedFormControl<ClrSelectContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLSelectElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelect, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrSelect, "[clrSelect]", never, {}, {}, never, never, false, never>;
}

declare class ClrSelectModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSelectModule, [typeof ClrSelect, typeof ClrSelectContainer], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrCommonFormsModule], [typeof ClrCommonFormsModule, typeof ClrSelect, typeof ClrSelectContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSelectModule>;
}

declare class ClrTextareaContainer extends ClrAbstractContainer {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextareaContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTextareaContainer, "clr-textarea-container", never, {}, {}, never, ["label", "[clrTextarea]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrTextarea extends WrappedFormControl<ClrTextareaContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLTextAreaElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextarea, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTextarea, "[clrTextarea]", never, {}, {}, never, never, false, never>;
}

declare class ClrTextareaModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextareaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTextareaModule, [typeof ClrTextarea, typeof ClrTextareaContainer], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrCommonFormsModule], [typeof ClrCommonFormsModule, typeof ClrTextarea, typeof ClrTextareaContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTextareaModule>;
}

declare class ClrRangeContainer extends ClrAbstractContainer {
    private renderer;
    private idService;
    protected ifControlStateService: IfControlStateService;
    private _hasProgress;
    private lastRangeProgressFillWidth;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, renderer: Renderer2, idService: ControlIdService, ifControlStateService: IfControlStateService);
    get hasProgress(): boolean;
    set hasProgress(val: boolean);
    getRangeProgressFillWidth(): string;
    private selectRangeElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRangeContainer, [{ optional: true; }, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRangeContainer, "clr-range-container", never, { "hasProgress": { "alias": "clrRangeHasProgress"; "required": false; }; }, {}, never, ["label", "[clrRange]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrRange extends WrappedFormControl<ClrRangeContainer> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRange, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRange, "[clrRange]", never, {}, {}, never, never, false, never>;
}

declare class ClrRangeModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRangeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrRangeModule, [typeof ClrRange, typeof ClrRangeContainer], [typeof i2.CommonModule, typeof ClrCommonFormsModule, typeof ClrHostWrappingModule, typeof ClrIcon], [typeof ClrCommonFormsModule, typeof ClrRange, typeof ClrRangeContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrRangeModule>;
}

declare class ClrFormsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFormsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrFormsModule, never, [typeof i2.CommonModule], [typeof ClrCommonFormsModule, typeof ClrCheckboxModule, typeof ClrComboboxModule, typeof ClrDatepickerModule, typeof ClrFileInputModule, typeof ClrInputModule, typeof ClrPasswordModule, typeof ClrRadioModule, typeof ClrSelectModule, typeof ClrTextareaModule, typeof ClrRangeModule, typeof ClrDatalistModule, typeof ClrNumberInputModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrFormsModule>;
}

declare class ClrDatagridPageSize {
    page: Page;
    pageSizeOptions: number[];
    pageSizeOptionsId: string;
    constructor(page: Page);
    set label(label: ClrControlLabel);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPageSize, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPageSize, "clr-dg-page-size", never, { "pageSizeOptions": { "alias": "clrPageSizeOptions"; "required": false; }; "pageSizeOptionsId": { "alias": "clrPageSizeOptionsId"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrDatagridPagination implements OnDestroy, OnInit {
    page: Page;
    commonStrings: ClrCommonStringsService;
    detailService: DetailService;
    disableCurrentPageInput: boolean;
    currentChanged: EventEmitter<number>;
    _pageSizeComponent: ClrDatagridPageSize;
    currentPageInputRef: ElementRef<HTMLInputElement>;
    /**
     * Subscription to the page service changes
     */
    private _pageSubscription;
    constructor(page: Page, commonStrings: ClrCommonStringsService, detailService: DetailService);
    /**
     * Page size
     */
    get pageSize(): number;
    set pageSize(size: number);
    /**
     * Total items (needed to guess the last page)
     */
    get totalItems(): number;
    set totalItems(total: number);
    /**
     * Last page
     */
    get lastPage(): number;
    set lastPage(last: number);
    /**
     * Current page
     */
    get currentPage(): number;
    set currentPage(page: number);
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem(): number;
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem(): number;
    /**
     * Conditionally adds page numbers before and after the current page
     */
    get middlePages(): number[];
    /**********
     * Subscription to the Page service for page changes.
     * Note: this only emits after the datagrid is initialized/stabalized and the page changes.
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Moves to the previous page if it exists
     */
    previous(): void;
    /**
     * Moves to the next page if it exists
     */
    next(): void;
    verifyCurrentPage(event: any): void;
    /**
     * We only update the pagination's current page on enter.
     */
    updateCurrentPage(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPagination, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPagination, "clr-dg-pagination", never, { "disableCurrentPageInput": { "alias": "clrDgPageInputDisabled"; "required": false; }; "pageSize": { "alias": "clrDgPageSize"; "required": false; }; "totalItems": { "alias": "clrDgTotalItems"; "required": false; }; "lastPage": { "alias": "clrDgLastPage"; "required": false; }; "currentPage": { "alias": "clrDgPage"; "required": false; }; }, { "currentChanged": "clrDgPageChange"; }, ["_pageSizeComponent"], ["clr-dg-page-size", "*"], false, never>;
}

/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
declare class ClrDatagridRowDetail implements AfterContentInit, OnDestroy {
    selection: Selection;
    rowActionService: RowActionService;
    expand: DatagridIfExpandService;
    expandableRows: ExpandableRowsCount;
    commonStrings: ClrCommonStringsService;
    _beginningOfExpandableContentAriaText: string;
    _endOfExpandableContentAriaText: string;
    replacedRow: boolean;
    SELECTION_TYPE: typeof SelectionType;
    cells: QueryList<ClrDatagridCell>;
    private subscriptions;
    constructor(selection: Selection, rowActionService: RowActionService, expand: DatagridIfExpandService, expandableRows: ExpandableRowsCount, commonStrings: ClrCommonStringsService);
    set replace(value: boolean);
    get beginningOfExpandableContentAriaText(): string;
    get endOfExpandableContentAriaText(): string;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridRowDetail, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridRowDetail, "clr-dg-row-detail", never, { "_beginningOfExpandableContentAriaText": { "alias": "clrRowDetailBeginningAriaText"; "required": false; }; "_endOfExpandableContentAriaText": { "alias": "clrRowDetailEndAriaText"; "required": false; }; "replace": { "alias": "clrDgReplace"; "required": false; }; }, {}, ["cells"], ["*"], false, never>;
}

declare class ClrDatagridSelectionCellDirective {
    private readonly selection;
    constructor(selection: Selection);
    private onSelectionCellClick;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridSelectionCellDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridSelectionCellDirective, ".datagrid-select", never, {}, {}, never, never, false, never>;
}

declare class ClrIfDetail implements OnInit, OnDestroy {
    private templateRef;
    private viewContainer;
    private detailService;
    stateChange: EventEmitter<any>;
    private subscriptions;
    private skip;
    private embeddedViewRef;
    constructor(templateRef: TemplateRef<any>, viewContainer: ViewContainerRef, detailService: DetailService);
    set state(model: any);
    get viewContext(): {
        $implicit: any;
    };
    ngOnInit(): void;
    ngOnDestroy(): void;
    private togglePanel;
    /**
     * For a given outlet instance, we create a proxy object that delegates
     * to the user-specified context. This allows changing, or swapping out
     * the context object completely without having to destroy/re-create the view.
     */
    private _createContextForwardProxy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfDetail, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfDetail, "[clrIfDetail]", never, { "state": { "alias": "clrIfDetail"; "required": false; }; }, { "stateChange": "clrIfDetailChange"; }, never, never, false, never>;
}

declare class DatagridDetailRegisterer {
    private expandableRowsCount;
    constructor(expandableRowsCount: ExpandableRowsCount);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridDetailRegisterer, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridDetailRegisterer, "[clrIfExpanded]", never, {}, {}, never, never, false, never>;
}

declare class WrappedCell implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    cellView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedCell, "dg-wrapped-cell", never, {}, {}, never, ["*"], false, never>;
}

declare class WrappedColumn implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    columnView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedColumn, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedColumn, "dg-wrapped-column", never, {}, {}, never, ["*"], false, never>;
}

declare class WrappedRow implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    rowView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedRow, "dg-wrapped-row", never, {}, {}, never, ["*"], false, never>;
}

declare class DatagridCellRenderer implements OnDestroy {
    private el;
    private renderer;
    private stateSubscription;
    private subscriptions;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, organizer: DatagridRenderOrganizer);
    ngOnDestroy(): void;
    resetState(state: ColumnState): void;
    setWidth(state: ColumnState): void;
    setHidden(state: ColumnState): void;
    private clearWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridCellRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridCellRenderer, "clr-dg-cell", never, {}, {}, never, never, false, never>;
}

declare class DatagridHeaderRenderer implements OnDestroy {
    private el;
    private renderer;
    private domAdapter;
    private columnResizerService;
    private columnsService;
    private columnState;
    resizeEmitter: EventEmitter<number>;
    /**
     * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
     */
    private widthSet;
    private autoSet;
    private subscriptions;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, organizer: DatagridRenderOrganizer, domAdapter: DomAdapter, columnResizerService: ColumnResizerService, columnsService: ColumnsService, columnState: BehaviorSubject<ColumnState>);
    ngOnDestroy(): void;
    getColumnWidthState(): Partial<ColumnState>;
    setColumnState(index: number): void;
    setWidth(state: ColumnState): void;
    setHidden(state: ColumnState): void;
    private clearWidth;
    private detectStrictWidth;
    private computeWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridHeaderRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridHeaderRenderer, "clr-dg-column", never, {}, { "resizeEmitter": "clrDgColumnResize"; }, never, never, false, never>;
}

declare class DatagridMainRenderer implements AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
    private datagrid;
    private organizer;
    private items;
    private page;
    private el;
    private renderer;
    private tableSizeService;
    private columnsService;
    private ngZone;
    private keyNavigation;
    private changeDetectorRef;
    private headers;
    private rows;
    private _heightSet;
    private shouldStabilizeColumns;
    private subscriptions;
    private intersectionObserver;
    /**
     * Indicates if we want to re-compute columns width. This should only happen:
     * 1) When headers change, with columns being added or removed
     * 2) When rows are lazily loaded for the first time
     */
    private columnsSizesStable;
    constructor(datagrid: ClrDatagrid, organizer: DatagridRenderOrganizer, items: Items, page: Page, el: ElementRef<HTMLElement>, renderer: Renderer2, detailService: DetailService, tableSizeService: TableSizeService, columnsService: ColumnsService, ngZone: NgZone, keyNavigation: KeyNavigationGridController, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    toggleDetailPane(state: boolean): void;
    private setupColumns;
    private shouldComputeHeight;
    /**
     * Computes the height of the datagrid.
     *
     * NOTE: We had to choose to set the height instead of the min-height because
     * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
     * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
     * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
     *
     * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
     */
    private computeDatagridHeight;
    private resetDatagridHeight;
    /**
     * Makes each header compute its width.
     */
    private computeHeadersWidth;
    private columnStateChanged;
    /**
     * Triggers a whole re-rendring cycle to set column sizes, if needed.
     */
    private stabilizeColumns;
    private updateColumnSeparatorsVisibility;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridMainRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridMainRenderer, "clr-datagrid", never, {}, {}, ["headers", "rows"], never, false, never>;
}

declare class DatagridRowRenderer implements AfterContentInit, OnDestroy {
    private columnsService;
    cells: QueryList<DatagridCellRenderer>;
    expandableRows: DatagridRowDetailRenderer[];
    private subscriptions;
    constructor(columnsService: ColumnsService);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    setCellsState(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRowRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridRowRenderer, "clr-dg-row", never, {}, {}, ["cells"], never, false, never>;
}

declare class DatagridRowDetailRenderer extends DatagridRowRenderer implements OnDestroy {
    private parentRow;
    constructor(parentRow: DatagridRowRenderer, columnsService: ColumnsService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRowDetailRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridRowDetailRenderer, "clr-dg-row-detail", never, {}, {}, never, never, false, never>;
}

declare class WillyWonka implements AfterViewChecked {
    disableChocolateCheck: boolean;
    private _chocolate;
    get chocolate(): Observable<void>;
    ngAfterViewChecked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WillyWonka, never, never, {}, {}, never, never, true, never>;
}

declare class DatagridWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridWillyWonka, "clr-datagrid", never, {}, {}, never, never, false, never>;
}

declare abstract class OompaLoompa implements AfterContentChecked, OnDestroy {
    private latestFlavor;
    private subscription;
    protected constructor(cdr: ChangeDetectorRef, willyWonka: WillyWonka);
    abstract get flavor(): any;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OompaLoompa, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OompaLoompa, never, never, {}, {}, never, never, true, never>;
}

declare class ActionableOompaLoompa extends OompaLoompa {
    private rowActions;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, rowActions: RowActionService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActionableOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ActionableOompaLoompa, "clr-datagrid, clr-dg-row", never, {}, {}, never, never, false, never>;
}

declare class ExpandableOompaLoompa extends OompaLoompa {
    private expandableCount;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, expandableCount: ExpandableRowsCount);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpandableOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ExpandableOompaLoompa, "clr-datagrid, clr-dg-row", never, {}, {}, never, never, false, never>;
}

interface ClrDatagridNumericFilterInterface<T> {
    accepts(item: T, low: number, high: number): boolean;
}

declare class DatagridNumericFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
    filterFn: ClrDatagridNumericFilterInterface<T>;
    /**
     * The Observable required as part of the Filter interface
     */
    private _changes;
    /**
     * Internal values and accessor
     */
    private _low;
    private _high;
    constructor(filterFn: ClrDatagridNumericFilterInterface<T>);
    get changes(): Observable<[number, number]>;
    get value(): [number, number];
    set value(vals: [number, number]);
    get low(): number;
    set low(low: number);
    get high(): number;
    set high(high: number);
    get state(): this | {
        property: string;
        low: number;
        high: number;
    };
    /**
     * Indicates if the filter is currently active, (at least one input is set)
     */
    isActive(): boolean;
    /**
     * Tests if an item matches a search text
     */
    accepts(item: T): boolean;
    equals(other: ClrDatagridFilterInterface<T, any>): boolean;
}

declare class DatagridNumericFilter<T = any> extends DatagridFilterRegistrar<T, DatagridNumericFilterImpl<T>> implements CustomFilter, AfterViewInit {
    private domAdapter;
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private ngZone;
    minPlaceholder: string;
    maxPlaceholder: string;
    fromLabel: string;
    toLabel: string;
    filterValueChange: EventEmitter<any>;
    /**
     * Indicates if the filter dropdown is open
     */
    open: boolean;
    /**
     * We need the actual input element to automatically focus on it
     */
    input: ElementRef<HTMLInputElement>;
    /**
     * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
     */
    filterContainer: ClrDatagridFilter<T>;
    private initFilterValues;
    private subscriptions;
    constructor(filters: FiltersProvider<T>, domAdapter: DomAdapter, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, ngZone: NgZone);
    /**
     * Common setter for the input values
     */
    get value(): [number, number];
    set value(values: [number, number]);
    /**
     * Customizable filter logic based on high and low values
     */
    set customNumericFilter(value: ClrDatagridNumericFilterInterface<T> | RegisteredFilter<T, DatagridNumericFilterImpl<T>>);
    get maxPlaceholderValue(): string;
    get minPlaceholderValue(): string;
    get fromLabelValue(): string;
    get toLabelValue(): string;
    get low(): number | string;
    set low(low: number | string);
    get high(): number | string;
    set high(high: number | string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridNumericFilter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridNumericFilter<any>, "clr-dg-numeric-filter", never, { "minPlaceholder": { "alias": "clrFilterMinPlaceholder"; "required": false; }; "maxPlaceholder": { "alias": "clrFilterMaxPlaceholder"; "required": false; }; "fromLabel": { "alias": "clrFilterFromLabel"; "required": false; }; "toLabel": { "alias": "clrFilterToLabel"; "required": false; }; "value": { "alias": "clrFilterValue"; "required": false; }; "customNumericFilter": { "alias": "clrDgNumericFilter"; "required": false; }; }, { "filterValueChange": "clrFilterValueChange"; }, never, never, false, never>;
}

interface ClrDatagridStringFilterInterface<T> {
    accepts(item: T, search: string): boolean;
}

declare class DatagridStringFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
    filterFn: ClrDatagridStringFilterInterface<T>;
    /**
     * The Observable required as part of the Filter interface
     */
    private _changes;
    /**
     * Input value converted to lowercase
     */
    private _lowerCaseValue;
    /**
     * Raw input value
     */
    private _rawValue;
    constructor(filterFn: ClrDatagridStringFilterInterface<T>);
    get changes(): Observable<string>;
    get lowerCaseValue(): string;
    get state(): this | {
        property: string;
        value: string;
    };
    get value(): string;
    /**
     * Common setter for the input value
     */
    set value(value: string);
    /**
     * Indicates if the filter is currently active, meaning the input is not empty
     */
    isActive(): boolean;
    /**
     * Tests if an item matches a search text
     */
    accepts(item: T): boolean;
    equals(other: ClrDatagridFilterInterface<T, any>): boolean;
}

declare class DatagridStringFilter<T = any> extends DatagridFilterRegistrar<T, DatagridStringFilterImpl<T>> implements CustomFilter, AfterViewInit, OnChanges, OnDestroy {
    private domAdapter;
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private elementRef;
    private cdr;
    private ngZone;
    /**
     * Provide a way to pass external placeholder and aria-label to the filter input
     */
    placeholder: string;
    label: string;
    filterValueChange: EventEmitter<any>;
    /**
     * Indicates if the filter dropdown is open
     */
    open: boolean;
    /**
     * We need the actual input element to automatically focus on it
     */
    input: ElementRef<HTMLInputElement>;
    /**
     * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
     */
    filterContainer: ClrDatagridFilter<T>;
    labelValue: string;
    private initFilterValue;
    private subs;
    constructor(filters: FiltersProvider<T>, domAdapter: DomAdapter, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone);
    /**
     * Customizable filter logic based on a search text
     */
    set customStringFilter(value: ClrDatagridStringFilterInterface<T> | RegisteredFilter<T, DatagridStringFilterImpl<T>>);
    /**
     * Common setter for the input value
     */
    get value(): string;
    set value(value: string);
    get placeholderValue(): string;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    /**
     * This is not in a getter to prevent "expression has changed after it was checked" errors.
     */
    private setFilterLabel;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridStringFilter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridStringFilter<any>, "clr-dg-string-filter", never, { "placeholder": { "alias": "clrFilterPlaceholder"; "required": false; }; "label": { "alias": "clrFilterLabel"; "required": false; }; "customStringFilter": { "alias": "clrDgStringFilter"; "required": false; }; "value": { "alias": "clrFilterValue"; "required": false; }; }, { "filterValueChange": "clrFilterValueChange"; }, never, never, false, never>;
}

declare class ClrDatagridColumnToggle implements OnDestroy {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    popoverId: string;
    openState: boolean;
    popoverPosition: ClrPopoverPosition;
    popoverType: ClrPopoverType;
    readonly trackByFn: i0.TrackByFunction<ColumnState>;
    private _allColumnsVisible;
    private subscription;
    private allSelectedElement;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService, popoverService: ClrPopoverService);
    get allColumnsVisible(): boolean;
    set allColumnsVisible(value: boolean);
    get hideableColumnStates(): ColumnState[];
    get hasOnlyOneVisibleColumn(): boolean;
    ngOnDestroy(): void;
    toggleColumnState(columnState: ColumnState, event: boolean): void;
    toggleSwitchPanel(): void;
    allColumnsSelected(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnToggle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnToggle, "clr-dg-column-toggle", never, {}, {}, never, never, false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrDatagridColumnToggleButton {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    private allSelected;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService);
    get clrAllSelected(): Observable<boolean>;
    get allHideablesVisible(): boolean;
    selectAll(): void;
    private hideableColumns;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnToggleButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnToggleButton, "clr-dg-column-toggle-button", never, {}, { "clrAllSelected": "clrAllSelected"; }, never, never, false, never>;
}

/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
declare class CdkDragModule_CdkDrag extends CdkDrag {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, dropContainer: any, document: any, ngZone: NgZone, viewContainerRef: ViewContainerRef, config: DragDropConfig, dir: Directionality, dragDrop: DragDrop, changeDetectorRef: ChangeDetectorRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkDragModule_CdkDrag, [null, { optional: true; }, { optional: true; }, null, null, { optional: true; }, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkDragModule_CdkDrag, "[cdkDrag]", never, {}, {}, never, never, false, never>;
}
/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
declare class CdkDragModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkDragModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CdkDragModule, [typeof CdkDragModule_CdkDrag], never, [typeof CdkDragModule_CdkDrag]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CdkDragModule>;
}

declare class OutsideClick implements OnDestroy {
    strict: boolean;
    outsideClick: EventEmitter<any>;
    private documentClickListener;
    constructor(host: ElementRef<HTMLElement>, renderer: Renderer2, ngZone: NgZone);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OutsideClick, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OutsideClick, "[clrOutsideClick]", never, { "strict": { "alias": "clrStrict"; "required": false; }; }, { "outsideClick": "clrOutsideClick"; }, never, never, false, never>;
}

declare class ClrOutsideClickModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOutsideClickModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrOutsideClickModule, [typeof OutsideClick], [typeof i2.CommonModule], [typeof OutsideClick]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrOutsideClickModule>;
}

declare class ClrExpandableAnimationModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrExpandableAnimationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrExpandableAnimationModule, [typeof ClrExpandableAnimation, typeof ClrExpandableAnimationDirective], [typeof i2.CommonModule], [typeof ClrExpandableAnimation, typeof ClrExpandableAnimationDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrExpandableAnimationModule>;
}

declare class ClrDatagridSingleSelectionValueAccessor implements ControlValueAccessor {
    private renderer;
    private elementRef;
    value: any;
    clrDgIdentityFn: (value: any) => unknown;
    private state;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>);
    onChange: (value: any) => void;
    onTouched: () => void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
    private keyOf;
    private updateChecked;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridSingleSelectionValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridSingleSelectionValueAccessor, "input[type=radio][clrDgSingleSelectionRadio]", never, { "value": { "alias": "value"; "required": false; }; "clrDgIdentityFn": { "alias": "clrDgIdentityFn"; "required": false; }; }, {}, never, never, true, never>;
}

declare const CLR_DATAGRID_DIRECTIVES: Type<any>[];
declare class ClrDatagridModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatagridModule, [typeof ClrDatagrid, typeof ClrDatagridActionBar, typeof ClrDatagridActionOverflow, typeof ClrDatagridCell, typeof ClrDatagridColumn, typeof ClrDatagridColumnSeparator, typeof ClrDatagridDetail, typeof ClrDatagridDetailBody, typeof ClrDatagridDetailHeader, typeof ClrDatagridFilter, typeof ClrDatagridFooter, typeof ClrDatagridHideableColumn, typeof ClrDatagridItems, typeof ClrDatagridPageSize, typeof ClrDatagridPagination, typeof ClrDatagridPlaceholder, typeof ClrDatagridRow, typeof ClrDatagridRowDetail, typeof ClrDatagridSelectionCellDirective, typeof ClrDatagridVirtualScrollDirective, typeof ClrIfDetail, typeof DatagridDetailRegisterer, typeof WrappedCell, typeof WrappedColumn, typeof WrappedRow, typeof DatagridCellRenderer, typeof DatagridHeaderRenderer, typeof DatagridMainRenderer, typeof DatagridRowDetailRenderer, typeof DatagridRowRenderer, typeof ActionableOompaLoompa, typeof DatagridWillyWonka, typeof ExpandableOompaLoompa, typeof DatagridNumericFilter, typeof DatagridStringFilter, typeof ClrDatagridColumnToggle, typeof ClrDatagridColumnToggleButton], [typeof i2.CommonModule, typeof CdkDragModule, typeof CdkTrapFocusModule, typeof ClrIcon, typeof ClrFormsModule, typeof i4.FormsModule, typeof ClrLoadingModule, typeof ClrConditionalModule, typeof ClrOutsideClickModule, typeof ClrExpandableAnimationModule, typeof ClrSpinnerModule, typeof ClrPopoverModuleNext, typeof ClrKeyFocusModule, typeof ClrDatagridSingleSelectionValueAccessor], [typeof ClrDatagrid, typeof ClrDatagridActionBar, typeof ClrDatagridActionOverflow, typeof ClrDatagridCell, typeof ClrDatagridColumn, typeof ClrDatagridColumnSeparator, typeof ClrDatagridDetail, typeof ClrDatagridDetailBody, typeof ClrDatagridDetailHeader, typeof ClrDatagridFilter, typeof ClrDatagridFooter, typeof ClrDatagridHideableColumn, typeof ClrDatagridItems, typeof ClrDatagridPageSize, typeof ClrDatagridPagination, typeof ClrDatagridPlaceholder, typeof ClrDatagridRow, typeof ClrDatagridRowDetail, typeof ClrDatagridSelectionCellDirective, typeof ClrDatagridVirtualScrollDirective, typeof ClrIfDetail, typeof DatagridDetailRegisterer, typeof WrappedCell, typeof WrappedColumn, typeof WrappedRow, typeof DatagridCellRenderer, typeof DatagridHeaderRenderer, typeof DatagridMainRenderer, typeof DatagridRowDetailRenderer, typeof DatagridRowRenderer, typeof ActionableOompaLoompa, typeof DatagridWillyWonka, typeof ExpandableOompaLoompa, typeof DatagridNumericFilter, typeof DatagridStringFilter, typeof ClrDatagridSingleSelectionValueAccessor]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatagridModule>;
}

declare class ClrStackView {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackView, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackView, "clr-stack-view", never, {}, {}, never, ["clr-stack-header", "*"], false, never>;
}

declare class ClrStackHeader {
    stackView: ClrStackView;
    constructor(stackView: ClrStackView);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackHeader, "clr-stack-header", never, {}, {}, never, ["*", ".stack-action"], false, never>;
}

declare class ClrStackBlock implements OnInit {
    private parent;
    commonStrings: ClrCommonStringsService;
    expanded: boolean;
    expandable: boolean;
    /**
     * Depth of the stack view starting from 1 for first level
     */
    ariaLevel: number;
    expandedChange: EventEmitter<boolean>;
    stackBlockTitle: any;
    focused: boolean;
    uniqueId: string;
    private _changedChildren;
    private _fullyInitialized;
    private _changed;
    constructor(parent: ClrStackBlock, commonStrings: ClrCommonStringsService);
    set setChangedValue(value: boolean);
    get getChangedValue(): boolean;
    get onStackLabelFocus(): boolean;
    get labelledById(): any;
    get headingLevel(): string;
    get caretDirection(): string;
    get role(): string;
    get tabIndex(): string;
    get ariaExpanded(): string;
    ngOnInit(): void;
    addChild(): void;
    toggleExpand(event?: Event): void;
    getStackChildrenId(): string;
    protected preventDefaultIfNotInputEvent(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackBlock, [{ optional: true; skipSelf: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackBlock, "clr-stack-block", never, { "expanded": { "alias": "clrSbExpanded"; "required": false; }; "expandable": { "alias": "clrSbExpandable"; "required": false; }; "ariaLevel": { "alias": "clrStackViewLevel"; "required": false; }; "setChangedValue": { "alias": "clrSbNotifyChange"; "required": false; }; }, { "expandedChange": "clrSbExpandedChange"; }, ["stackBlockTitle"], ["clr-stack-label", "*", "clr-stack-block"], false, never>;
}

declare class ClrStackContentInput {
    uniqueId: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackContentInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackContentInput, "[clrStackInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrStackViewCustomTags {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewCustomTags, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackViewCustomTags, "clr-stack-content", never, {}, {}, never, never, false, never>;
}
declare class ClrStackViewLabel implements OnInit {
    private _generatedId;
    private _id;
    get id(): string;
    set id(val: string);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackViewLabel, "clr-stack-label", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const CLR_STACK_VIEW_DIRECTIVES: Type<any>[];
declare class ClrStackViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStackViewModule, [typeof ClrStackView, typeof ClrStackHeader, typeof ClrStackBlock, typeof ClrStackContentInput, typeof ClrStackViewLabel, typeof ClrStackViewCustomTags], [typeof i2.CommonModule, typeof i4.FormsModule, typeof ClrIcon, typeof ClrExpandableAnimationModule], [typeof ClrStackView, typeof ClrStackHeader, typeof ClrStackBlock, typeof ClrStackContentInput, typeof ClrStackViewLabel, typeof ClrStackViewCustomTags]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrStackViewModule>;
}

type AsyncArray<T> = T[] | null | undefined | Promise<T[] | null | undefined> | Observable<T[] | null | undefined>;

declare enum ClrSelectedState {
    UNSELECTED = 0,
    SELECTED = 1,
    INDETERMINATE = 2
}

declare abstract class TreeNodeModel<T> {
    nodeId: string;
    expanded: boolean;
    model: T | null;
    textContent: string;
    loading$: BehaviorSubject<boolean>;
    selected: BehaviorSubject<ClrSelectedState>;
    private _loading;
    private _disabled;
    abstract parent: TreeNodeModel<T> | null;
    abstract children: TreeNodeModel<T>[];
    get loading(): boolean;
    set loading(isLoading: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    destroy(): void;
    setSelected(state: ClrSelectedState, propagateUp: boolean, propagateDown: boolean): void;
    toggleSelection(propagate: boolean): void;
    _updateSelectionFromChildren(): void;
    private computeSelectionStateFromChildren;
}

declare class RecursiveTreeNodeModel<T> extends TreeNodeModel<T> {
    private getChildren;
    private featuresService;
    parent: RecursiveTreeNodeModel<T> | null;
    private subscription;
    private childrenFetched;
    private _children;
    constructor(model: T, parent: RecursiveTreeNodeModel<T> | null, getChildren: (node: T) => AsyncArray<T> | undefined, featuresService: TreeFeaturesService<T> | undefined);
    get children(): RecursiveTreeNodeModel<T>[];
    set children(value: RecursiveTreeNodeModel<T>[]);
    destroy(): void;
    clearChildren(): void;
    fetchChildren(): void;
    private wrapChildren;
}

interface ClrRecursiveForOfContext<T> {
    $implicit: T;
    clrModel: TreeNodeModel<T>;
}
declare class ClrRecursiveForOf<T> implements OnChanges, OnDestroy {
    private template;
    private featuresService;
    private cdr;
    nodes: T | T[];
    getChildren: (node: T) => AsyncArray<T>;
    private childrenFetchSubscription;
    constructor(template: TemplateRef<ClrRecursiveForOfContext<T>>, featuresService: TreeFeaturesService<T>, cdr: ChangeDetectorRef);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRecursiveForOf<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRecursiveForOf<any>, "[clrRecursiveFor][clrRecursiveForOf]", never, { "nodes": { "alias": "clrRecursiveForOf"; "required": false; }; "getChildren": { "alias": "clrRecursiveForGetChildren"; "required": false; }; }, {}, never, never, false, never>;
}

declare class TreeFeaturesService<T> {
    selectable: boolean;
    eager: boolean;
    recursion: {
        template: TemplateRef<ClrRecursiveForOfContext<T>>;
        root: RecursiveTreeNodeModel<T>[];
    };
    childrenFetched: Subject<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeFeaturesService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TreeFeaturesService<any>>;
}

declare class TreeFocusManagerService<T> {
    rootNodeModels: TreeNodeModel<T>[];
    private focusedNodeId;
    private _focusRequest;
    private _focusChange;
    get focusRequest(): Observable<string>;
    get focusChange(): Observable<string>;
    focusNode(model: TreeNodeModel<T>): void;
    broadcastFocusedNode(nodeId: string): void;
    focusParent(model: TreeNodeModel<T>): void;
    focusFirstVisibleNode(): void;
    focusLastVisibleNode(): void;
    focusNodeAbove(model: TreeNodeModel<T>): void;
    focusNodeBelow(model: TreeNodeModel<T>): void;
    focusNodeStartsWith(searchString: string, model: TreeNodeModel<T>): void;
    private findSiblings;
    private findLastVisibleInNode;
    private findNextFocusable;
    private findLastVisibleInTree;
    private findNodeAbove;
    private findNodeBelow;
    private findDescendentNodeStartsWith;
    private findSiblingNodeStartsWith;
    private findRootNodeStartsWith;
    private findNodeStartsWith;
    private findClosestNodeStartsWith;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeFocusManagerService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TreeFocusManagerService<any>>;
}

declare class ClrTree<T> implements AfterContentInit, OnDestroy {
    featuresService: TreeFeaturesService<T>;
    private focusManagerService;
    private renderer;
    private el;
    private rootNodes;
    private subscriptions;
    private _isMultiSelectable;
    constructor(featuresService: TreeFeaturesService<T>, focusManagerService: TreeFocusManagerService<T>, renderer: Renderer2, el: ElementRef<HTMLElement>, ngZone: NgZone);
    set lazy(value: boolean);
    get isMultiSelectable(): boolean;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private setMultiSelectable;
    private setRootNodes;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTree<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTree<any>, "clr-tree", never, { "lazy": { "alias": "clrLazy"; "required": false; }; }, {}, ["rootNodes"], ["*"], false, never>;
}

declare class ClrTreeNodeLink {
    private el;
    constructor(el: ElementRef<HTMLElement>);
    get active(): boolean;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeNodeLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTreeNodeLink, ".clr-treenode-link", never, {}, {}, never, never, false, never>;
}

declare class ClrTreeNode<T> implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    private platformId;
    featuresService: TreeFeaturesService<T>;
    expandService: IfExpandService;
    commonStrings: ClrCommonStringsService;
    private focusManager;
    private elementRef;
    expandable: boolean | undefined;
    selectedChange: EventEmitter<ClrSelectedState>;
    expandedChange: EventEmitter<boolean>;
    STATES: typeof ClrSelectedState;
    isModelLoading: boolean;
    nodeId: string;
    contentContainerTabindex: number;
    _model: TreeNodeModel<T>;
    private skipEmitChange;
    private typeAheadKeyBuffer;
    private typeAheadKeyEvent;
    private subscriptions;
    private contentContainer;
    private treeNodeLinkList;
    constructor(platformId: any, parent: ClrTreeNode<T>, featuresService: TreeFeaturesService<T>, expandService: IfExpandService, commonStrings: ClrCommonStringsService, focusManager: TreeFocusManagerService<T>, elementRef: ElementRef<HTMLElement>, injector: Injector);
    get disabled(): boolean;
    set disabled(value: boolean);
    get selected(): ClrSelectedState | boolean;
    set selected(value: ClrSelectedState | boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    set clrForTypeAhead(value: string);
    get ariaSelected(): boolean;
    get treeNodeLink(): ClrTreeNodeLink;
    private get isParent();
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    isExpandable(): boolean;
    isSelectable(): boolean;
    focusTreeNode(): void;
    broadcastFocusOnContainer(): void;
    onKeyDown(event: KeyboardEvent): void;
    private setTabIndex;
    private checkTabIndex;
    private toggleExpandOrTriggerDefault;
    private expandOrFocusFirstChild;
    private collapseOrFocusParent;
    private triggerDefaultAction;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeNode<any>, [null, { optional: true; skipSelf: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTreeNode<any>, "clr-tree-node", never, { "expandable": { "alias": "clrExpandable"; "required": false; }; "disabled": { "alias": "clrDisabled"; "required": false; }; "selected": { "alias": "clrSelected"; "required": false; }; "expanded": { "alias": "clrExpanded"; "required": false; }; "clrForTypeAhead": { "alias": "clrForTypeAhead"; "required": false; }; }, { "selectedChange": "clrSelectedChange"; "expandedChange": "clrExpandedChange"; }, ["treeNodeLinkList"], ["*", "clr-tree-node", "[clrIfExpanded]"], false, never>;
}

declare class RecursiveChildren<T> {
    featuresService: TreeFeaturesService<T>;
    private expandService;
    parent: TreeNodeModel<T>;
    children: TreeNodeModel<T>[];
    subscription: Subscription;
    role: string;
    constructor(featuresService: TreeFeaturesService<T>, expandService: IfExpandService);
    ngAfterContentInit(): void;
    shouldRender(): boolean;
    getContext(node: TreeNodeModel<T>): ClrRecursiveForOfContext<T>;
    ngOnDestroy(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecursiveChildren<any>, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecursiveChildren<any>, "clr-recursive-children", never, { "parent": { "alias": "parent"; "required": false; }; "children": { "alias": "children"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_TREE_VIEW_DIRECTIVES: Type<any>[];
declare class ClrTreeViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTreeViewModule, [typeof ClrTree, typeof ClrTreeNode, typeof ClrRecursiveForOf, typeof ClrTreeNodeLink, typeof RecursiveChildren], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrLoadingModule], [typeof ClrTree, typeof ClrTreeNode, typeof ClrRecursiveForOf, typeof ClrTreeNodeLink]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTreeViewModule>;
}

declare class ClrDataModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDataModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDataModule, never, never, [typeof ClrDatagridModule, typeof ClrStackViewModule, typeof ClrTreeViewModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDataModule>;
}

/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
declare class ClrIconCustomTag {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIconCustomTag, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIconCustomTag, "clr-icon", never, {}, {}, never, never, false, never>;
}
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
declare class CdsIconCustomTag {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdsIconCustomTag, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdsIconCustomTag, "cds-icon", never, {}, {}, never, never, false, never>;
}

declare const CLR_ICON_DIRECTIVES: Type<any>[];
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
declare class ClrIconModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIconModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrIconModule, [typeof ClrIconCustomTag, typeof CdsIconCustomTag], [typeof i2.CommonModule], [typeof ClrIconCustomTag, typeof CdsIconCustomTag]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrIconModule>;
}

declare class ClrModalConfigurationService {
    fadeMove: string;
    backdrop: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalConfigurationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrModalConfigurationService>;
}

declare class ScrollingService {
    private _document;
    constructor(_document: any);
    stopScrolling(): void;
    resumeScrolling(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScrollingService>;
}

declare class ClrModal implements OnChanges, OnDestroy {
    private _scrollingService;
    commonStrings: ClrCommonStringsService;
    private modalStackService;
    private configuration;
    modalId: string;
    title: ElementRef<HTMLElement>;
    _open: boolean;
    _openChanged: EventEmitter<boolean>;
    closable: boolean;
    closeButtonAriaLabel: string;
    size: string;
    staticBackdrop: boolean;
    skipAnimation: boolean;
    stopClose: boolean;
    altClose: EventEmitter<boolean>;
    labelledBy: string;
    bypassScrollService: boolean;
    protected readonly modalContentTemplate: TemplateRef<any>;
    private readonly bodyElementRef;
    constructor(_scrollingService: ScrollingService, commonStrings: ClrCommonStringsService, modalStackService: ModalStackService, configuration: ClrModalConfigurationService);
    get fadeMove(): string;
    set fadeMove(move: string);
    get backdrop(): boolean;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    ngOnDestroy(): void;
    open(): void;
    backdropClick(): void;
    close(): void;
    fadeDone(e: AnimationEvent): void;
    scrollTop(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModal, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrModal, "clr-modal", never, { "_open": { "alias": "clrModalOpen"; "required": false; }; "closable": { "alias": "clrModalClosable"; "required": false; }; "closeButtonAriaLabel": { "alias": "clrModalCloseButtonAriaLabel"; "required": false; }; "size": { "alias": "clrModalSize"; "required": false; }; "staticBackdrop": { "alias": "clrModalStaticBackdrop"; "required": false; }; "skipAnimation": { "alias": "clrModalSkipAnimation"; "required": false; }; "stopClose": { "alias": "clrModalPreventClose"; "required": false; }; "labelledBy": { "alias": "clrModalLabelledById"; "required": false; }; "bypassScrollService": { "alias": "clrModalOverrideScrollService"; "required": false; }; }, { "_openChanged": "clrModalOpenChange"; "altClose": "clrModalAlternateClose"; }, ["modalContentTemplate"], [".leading-button", ".modal-title", ".modal-body", ".modal-footer"], false, never>;
}

/**
 * Allows modal overflow area to be scrollable via keyboard.
 * The modal body will focus with keyboard navigation only.
 * This allows inner focusable items to be focused without
 * the overflow scroll being focused.
 */
declare class ClrModalBody implements OnDestroy {
    private readonly renderer;
    private readonly host;
    private tabindex;
    private unlisteners;
    private observer;
    constructor(renderer: Renderer2, host: ElementRef<HTMLElement>, ngZone: NgZone);
    ngOnDestroy(): void;
    private addTabIndex;
    private removeTabIndex;
    private addOrRemoveTabIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalBody, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrModalBody, ".modal-body", never, {}, {}, never, never, false, never>;
}

declare class ClrModalHostComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalHostComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrModalHostComponent, "[clrModalHost]", never, {}, {}, never, ["*"], false, never>;
}

declare const CLR_MODAL_DIRECTIVES: Type<any>[];
declare class ClrModalModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrModalModule, [typeof ClrModal, typeof ClrModalBody, typeof ClrModalHostComponent], [typeof i2.CommonModule, typeof CdkTrapFocusModule, typeof ClrIcon], [typeof ClrModal, typeof ClrModalBody, typeof ClrModalHostComponent, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrModalModule>;
}

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
    constructor(focusService: FocusService$1, popoverService: ClrPopoverService, renderer: Renderer2);
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrButtonGroup, "clr-button-group", never, { "clrToggleButtonAriaLabel": { "alias": "clrToggleButtonAriaLabel"; "required": false; }; "menuPosition": { "alias": "clrMenuPosition"; "required": false; }; }, {}, ["buttons"], never, false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare const CLR_BUTTON_GROUP_DIRECTIVES: Type<any>[];
declare class ClrButtonGroupModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButtonGroupModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrButtonGroupModule, [typeof ClrButton, typeof ClrButtonGroup], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrPopoverModuleNext], [typeof ClrButton, typeof ClrButtonGroup]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrButtonGroupModule>;
}

declare class ClrButtonModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrButtonModule, never, never, [typeof ClrLoadingButtonModule, typeof ClrButtonGroupModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrButtonModule>;
}

declare class ResponsiveNavControlMessage {
    private _controlCode;
    private _navLevel;
    constructor(_controlCode: string, _navLevel: number);
    get controlCode(): string;
    get navLevel(): number;
}

declare class ResponsiveNavigationService {
    responsiveNavList: number[];
    private registerNavSubject;
    private controlNavSubject;
    constructor();
    get registeredNavs(): Observable<number[]>;
    get navControl(): Observable<ResponsiveNavControlMessage>;
    registerNav(navLevel: number): void;
    isNavRegistered(navLevel: number): boolean;
    unregisterNav(navLevel: number): void;
    sendControlMessage(controlCode: string, navLevel: number): void;
    closeAllNavs(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResponsiveNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ResponsiveNavigationService>;
}

declare class ClrMainContainer implements OnDestroy, OnInit {
    private elRef;
    private responsiveNavService;
    private _subscription;
    private _classList;
    constructor(elRef: ElementRef<HTMLElement>, responsiveNavService: ResponsiveNavigationService);
    ngOnInit(): void;
    processMessage(message: ResponsiveNavControlMessage): void;
    controlNav(controlCode: string, navClass: string): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrMainContainer, "clr-main-container", never, {}, {}, never, never, false, never>;
}

declare const CLR_LAYOUT_DIRECTIVES: Type<any>[];
declare class ClrMainContainerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrMainContainerModule, [typeof ClrMainContainer], [typeof i2.CommonModule, typeof ClrIcon], [typeof ClrMainContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrMainContainerModule>;
}

declare class ResponsiveNavCodes {
    static NAV_LEVEL_1: number;
    static NAV_LEVEL_2: number;
    static NAV_CLOSE_ALL: string;
    static NAV_OPEN: string;
    static NAV_CLOSE: string;
    static NAV_TOGGLE: string;
    static NAV_CLASS_HAMBURGER_MENU: string;
    static NAV_CLASS_OVERFLOW_MENU: string;
    static NAV_CLASS_TRIGGER_1: string;
    static NAV_CLASS_TRIGGER_2: string;
    static NAV_CLASS_LEVEL_1: string;
    static NAV_CLASS_LEVEL_2: string;
}

declare class ClrHeader implements OnDestroy {
    private responsiveNavService;
    commonStrings: ClrCommonStringsService;
    role: string;
    isNavLevel1OnPage: boolean;
    isNavLevel2OnPage: boolean;
    openNavLevel: number;
    responsiveNavCodes: typeof ResponsiveNavCodes;
    private _subscription;
    constructor(responsiveNavService: ResponsiveNavigationService, commonStrings: ClrCommonStringsService);
    get responsiveNavCommonString(): string;
    get responsiveOverflowCommonString(): string;
    resetNavTriggers(): void;
    initializeNavTriggers(navList: number[]): void;
    closeOpenNav(): void;
    /**
     * @deprecated Will be removed in with @clr/angular v15.0.0
     *
     * Use `openNav(navLevel)` instead to open the navigation and ResponsiveNavService to close it.
     */
    toggleNav(navLevel: number): void;
    openNav(navLevel: number): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrHeader, "clr-header", never, { "role": { "alias": "role"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrNavLevel implements OnInit {
    private cdkTrapFocus;
    private responsiveNavService;
    private elementRef;
    private renderer;
    _level: number;
    closeButtonAriaLabel: string;
    private _isOpen;
    private _document;
    private _subscription;
    constructor(platformId: any, cdkTrapFocus: ClrStandaloneCdkTrapFocus, responsiveNavService: ResponsiveNavigationService, elementRef: ElementRef<HTMLElement>, renderer: Renderer2, injector: Injector);
    get level(): number;
    get responsiveNavCodes(): ResponsiveNavCodes;
    get isOpen(): boolean;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onResize(event: Event): void;
    onMouseClick(target: any): void;
    addNavClass(level: number): void;
    open(): void;
    close(): void;
    protected hideNavigation(): void;
    protected showNavigation(): void;
    protected hideCloseButton(): void;
    protected showCloseButton(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNavLevel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNavLevel, "[clr-nav-level]", never, { "_level": { "alias": "clr-nav-level"; "required": false; }; "closeButtonAriaLabel": { "alias": "closeAriaLabel"; "required": false; }; }, {}, never, never, false, [{ directive: typeof ClrStandaloneCdkTrapFocus; inputs: {}; outputs: {}; }]>;
}

declare class ClrAriaCurrentLink implements OnInit, OnDestroy {
    private rla;
    ariaCurrent: string | undefined;
    private subscription;
    constructor(rla: RouterLinkActive);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAriaCurrentLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAriaCurrentLink, "[clrAriaCurrentLink]", never, {}, {}, never, never, false, never>;
}

declare class MainContainerWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<MainContainerWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MainContainerWillyWonka, "clr-main-container", never, {}, {}, never, never, false, never>;
}

declare class NavDetectionOompaLoompa extends OompaLoompa {
    private responsiveNavService;
    constructor(cdr: ChangeDetectorRef, willyWonka: MainContainerWillyWonka, responsiveNavService: ResponsiveNavigationService);
    get flavor(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavDetectionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NavDetectionOompaLoompa, "clr-header", never, {}, {}, never, never, false, never>;
}

declare const CLR_NAVIGATION_DIRECTIVES: Type<any>[];
declare class ClrNavigationModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNavigationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNavigationModule, [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink, typeof NavDetectionOompaLoompa, typeof MainContainerWillyWonka], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrDropdownModule], [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink, typeof NavDetectionOompaLoompa, typeof MainContainerWillyWonka]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNavigationModule>;
}

declare enum TabsLayout {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}

declare class TemplateRefContainer {
    template: TemplateRef<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TemplateRefContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TemplateRefContainer, "ng-component", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTabLink {
    ifActiveService: IfActiveService;
    readonly id: number;
    el: ElementRef<HTMLElement>;
    private tabsService;
    tabsId: number;
    tabLinkId: string;
    templateRefContainer: TemplateRefContainer;
    private _inOverflow;
    constructor(ifActiveService: IfActiveService, id: number, el: ElementRef<HTMLElement>, viewContainerRef: ViewContainerRef, tabsService: TabsService, tabsId: number);
    get inOverflow(): boolean;
    set inOverflow(inOverflow: boolean);
    get addLinkClasses(): boolean;
    get ariaControls(): string;
    get active(): boolean;
    get tabindex(): 0 | -1;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTabLink, "[clrTabLink]", never, { "tabLinkId": { "alias": "id"; "required": false; }; "inOverflow": { "alias": "clrTabLinkInOverflow"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrTab {
    ifActiveService: IfActiveService;
    id: number;
    private tabsService;
    tabLink: ClrTabLink;
    tabContent: ClrTabContent;
    constructor(ifActiveService: IfActiveService, id: number, tabsService: TabsService);
    get active(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTab, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTab, "clr-tab", never, {}, {}, ["tabLink", "tabContent"], ["*"], false, never>;
}

declare class TabsService {
    layout: TabsLayout | string;
    tabContentViewContainer: ViewContainerRef;
    private _children;
    get children(): ClrTab[];
    get activeTab(): ClrTab;
    get overflowTabs(): ClrTab[];
    register(tab: ClrTab): void;
    unregister(tab: ClrTab): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TabsService>;
}

declare class ClrTabContent implements OnDestroy {
    ifActiveService: IfActiveService;
    id: number;
    private tabsService;
    tabContentId: string;
    private viewRef;
    constructor(ifActiveService: IfActiveService, id: number, tabsService: TabsService);
    get active(): boolean;
    get ariaLabelledBy(): string;
    private set templateRef(value);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabContent, "clr-tab-content", never, { "tabContentId": { "alias": "id"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrTabs implements AfterContentInit, OnDestroy {
    ifActiveService: IfActiveService;
    popoverService: ClrPopoverService;
    tabsService: TabsService;
    tabsId: number;
    commonStrings: ClrCommonStringsService;
    tabLinkElements: HTMLElement[];
    _mousedown: boolean;
    keyFocus: ClrKeyFocus;
    tabsActions: QueryList<ElementRef>;
    private tabs;
    private subscriptions;
    private _tabOverflowEl;
    private _tabLinkDirectives;
    constructor(ifActiveService: IfActiveService, popoverService: ClrPopoverService, tabsService: TabsService, tabsId: number, commonStrings: ClrCommonStringsService);
    get layout(): TabsLayout | string;
    set layout(layout: TabsLayout | string);
    get tabLinkDirectives(): ClrTabLink[];
    get activeTabInOverflow(): boolean;
    get activeTabPosition(): number;
    get isCurrentInOverflow(): boolean;
    get isVertical(): boolean;
    set tabOverflowEl(value: ElementRef<HTMLElement>);
    private get overflowPosition();
    private set tabContentViewContainer(value);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    toggleOverflowOnPosition(position: number): void;
    resetKeyFocusCurrentToActive(event: FocusEvent): void;
    toggleOverflowOnClick(): void;
    openOverflowOnFocus(): void;
    closeOnFocusOut(event: FocusEvent): void;
    closeOnEscapeKey(): void;
    closeOnOutsideClick(event: Event, tabOverflowTrigger: HTMLElement): void;
    private setTabLinkElements;
    private listenForTabLinkChanges;
    private listedForTabsActionsChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabs, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabs, "clr-tabs", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, ["tabsActions", "tabs"], ["clr-tabs-actions"], false, [{ directive: typeof ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrTabOverflowContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabOverflowContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabOverflowContent, "clr-tab-overflow-content", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTabAction {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabAction, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTabAction, "[clrTabAction]", never, {}, {}, never, never, false, never>;
}

type ClrTabsActionsPosition = 'left' | 'right';
declare class ClrTabsActions {
    position: ClrTabsActionsPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabsActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabsActions, "clr-tabs-actions", never, { "position": { "alias": "position"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class TabsWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<TabsWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TabsWillyWonka, "clr-tabs", never, {}, {}, never, never, false, never>;
}

declare class ActiveOompaLoompa extends OompaLoompa {
    private ifActive;
    private id;
    constructor(cdr: ChangeDetectorRef, willyWonka: TabsWillyWonka, id: number, ifActive: IfActiveService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActiveOompaLoompa, [null, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ActiveOompaLoompa, "[clrTabLink], clr-tab-content", never, {}, {}, never, never, false, never>;
}

declare class ClrTemplateRefModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTemplateRefModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTemplateRefModule, [typeof TemplateRefContainer], [typeof i2.CommonModule], [typeof TemplateRefContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTemplateRefModule>;
}

declare const CLR_TABS_DIRECTIVES: Type<any>[];
declare class ClrTabsModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTabsModule, [typeof ClrTabContent, typeof ClrTab, typeof ClrTabs, typeof ClrTabOverflowContent, typeof ClrTabLink, typeof ClrTabAction, typeof ClrTabsActions, typeof TabsWillyWonka, typeof ActiveOompaLoompa], [typeof i2.CommonModule, typeof ClrConditionalModule, typeof ClrIcon, typeof ClrTemplateRefModule, typeof ClrKeyFocusModule], [typeof ClrTabContent, typeof ClrTab, typeof ClrTabs, typeof ClrTabOverflowContent, typeof ClrTabLink, typeof ClrTabAction, typeof ClrTabsActions, typeof TabsWillyWonka, typeof ActiveOompaLoompa, typeof ClrConditionalModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTabsModule>;
}

interface BreadcrumbItem {
    label: string;
    href?: string;
    routerLink?: string;
    queryParams?: {
        [key: string]: string;
    };
    target?: string;
}

declare class ClrBreadcrumbs {
    protected commonStrings: ClrCommonStringsService;
    isExpanded: boolean;
    items: BreadcrumbItem[];
    clrBreadcrumbItemClick: EventEmitter<BreadcrumbItem>;
    protected limit: number;
    protected max: number;
    constructor(commonStrings: ClrCommonStringsService);
    protected expand(): void;
    protected handleItemClick(breadcrumb: BreadcrumbItem): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBreadcrumbs, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBreadcrumbs, "clr-breadcrumbs", never, { "items": { "alias": "items"; "required": false; }; }, { "clrBreadcrumbItemClick": "clrBreadcrumbItemClick"; }, never, never, false, never>;
}

declare class ClrBreadcrumbItem {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBreadcrumbItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBreadcrumbItem, "clr-breadcrumb-item", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrBreadcrumbsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBreadcrumbsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrBreadcrumbsModule, [typeof ClrBreadcrumbs, typeof ClrBreadcrumbItem], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrHostWrappingModule, typeof i6.RouterModule], [typeof ClrBreadcrumbs, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrBreadcrumbsModule>;
}

declare class ClrLayoutModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLayoutModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrLayoutModule, never, never, [typeof ClrMainContainerModule, typeof ClrNavigationModule, typeof ClrTabsModule, typeof ClrVerticalNavModule, typeof ClrBreadcrumbsModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrLayoutModule>;
}

declare class ButtonHubService {
    buttonsReady: boolean;
    private _previousBtnClicked;
    private _nextBtnClicked;
    private _dangerBtnClicked;
    private _cancelBtnClicked;
    private _finishBtnClicked;
    private _customBtnClicked;
    get previousBtnClicked(): Observable<void>;
    get nextBtnClicked(): Observable<void>;
    get dangerBtnClicked(): Observable<void>;
    get cancelBtnClicked(): Observable<void>;
    get finishBtnClicked(): Observable<void>;
    get customBtnClicked(): Observable<string>;
    buttonClicked(buttonType: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonHubService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonHubService>;
}

declare class ClrWizardHeaderAction {
    title: string;
    _id: string;
    disabled: boolean;
    headerActionClicked: EventEmitter<string>;
    get id(): string;
    click(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardHeaderAction, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardHeaderAction, "clr-wizard-header-action", never, { "title": { "alias": "title"; "required": false; }; "_id": { "alias": "id"; "required": false; }; "disabled": { "alias": "clrWizardHeaderActionDisabled"; "required": false; }; }, { "headerActionClicked": "actionClicked"; }, never, ["*"], false, never>;
}

/**
 * PageCollectionService manages the collection of pages assigned to the wizard and offers
 * a number of functions useful across the wizards providers and subcomponents -- all related
 * to essentially lookups on the collection of pages.
 *
 * The easiest way to access PageCollectionService is via the wizard. The
 * following example would allow you to access your instance of the wizard from your host
 * component and thereby access the page collection via YourHostComponent.wizard.pageCollection.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 * The heart of the page collection is the query list of pages, which it is assigned as a
 * reference to the Wizard.pages QueryList when the wizard is created.
 *
 */
declare class PageCollectionService {
    /**
     * A reference to the Wizard.pages QueryList.
     *
     * Populated when the wizard is created.
     *
     * @memberof PageCollectionService
     */
    pages: QueryList<ClrWizardPage>;
    /**
     *
     * @memberof PageCollectionService
     */
    private _pagesReset;
    /**
     * Converts the PageCollectionService.pages QueryList to an array and returns it.
     *
     * Useful for many instances when you would prefer a QueryList to act like an array.
     *
     * @memberof PageCollectionService
     */
    get pagesAsArray(): ClrWizardPage[];
    /**
     * Returns the length of the pages query list.
     *
     * @memberof PageCollectionService
     */
    get pagesCount(): number;
    /**
     * Returns the next-to-last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get penultimatePage(): ClrWizardPage;
    /**
     * Returns the last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get lastPage(): ClrWizardPage;
    /**
     * Returns the first page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get firstPage(): ClrWizardPage;
    /**
     * An observable that the navigation service listens to in order to know when
     * the page collection completed states have been reset to false so that way it
     * can also reset the navigation to make the first page in the page collection
     * current/active.
     *
     * @memberof PageCollectionService
     */
    get pagesReset(): Observable<boolean>;
    /**
     * Used mostly internally, but accepts a string ID and returns a ClrWizardPage
     * object that matches the ID passed. Note that IDs here should include the prefix
     * "clr-wizard-page-".
     *
     * Returns the next-to-last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    getPageById(id: string): ClrWizardPage;
    /**
     * Accepts s number as a parameter and treats that number as the index of the page
     * you're looking for in the collection of pages. Returns a  wizard page object.
     *
     * @memberof PageCollectionService
     */
    getPageByIndex(index: number): ClrWizardPage;
    /**
     * Takes a wizard page object as a parameter and returns its index in the
     * collection of pages.
     *
     * @memberof PageCollectionService
     */
    getPageIndex(page: ClrWizardPage): number;
    /**
     * Accepts two numeric indexes and returns an array of wizard page objects that include
     * all wizard pages in the page collection from the first index to the second.
     *
     * @memberof PageCollectionService
     */
    pageRange(start: number, end: number): ClrWizardPage[];
    /**
     * Accepts two wizard page objects and returns those page objects with all other page
     * objects between them in the page collection. It doesn't care which page is ahead of the
     * other in the parameters. It will be smart enough to figure that out  on its own.
     *
     * @memberof PageCollectionService
     */
    getPageRangeFromPages(page: ClrWizardPage, otherPage: ClrWizardPage): ClrWizardPage[];
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately before it in the page collection. Returns null if there is
     * no page before the page it is passed.
     *
     * @memberof PageCollectionService
     */
    getPreviousPage(page: ClrWizardPage): ClrWizardPage;
    /**
     * Accepts a wizard page object as a parameter and returns a Boolean that says if
     * the page you sent it is complete.
     *
     * @memberof PageCollectionService
     */
    previousPageIsCompleted(page: ClrWizardPage): boolean;
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately after it in the page collection. Returns null if there is
     * no page after the page it is passed.
     *
     * @memberof PageCollectionService
     */
    getNextPage(page: ClrWizardPage): ClrWizardPage;
    /**
     * Takes a wizard page object as a parameter and generates a step item id from the
     * page ID. Returns the generated step item ID as a string.
     *
     * @memberof PageCollectionService
     */
    getStepItemIdForPage(page: ClrWizardPage): string;
    /**
     * Generally only used internally to mark that a specific page has been "committed".
     * This involves marking the page complete and firing the ClrWizardPage.onCommit
     * (clrWizardPageOnCommit) output. Takes the wizard page object that you intend to
     * mark completed as a parameter.
     *
     * @memberof PageCollectionService
     */
    commitPage(page: ClrWizardPage): void;
    /**
     * Sets all completed states of the pages in the page collection to false and
     * notifies the navigation service to likewise reset the navigation.
     *
     * @memberof PageCollectionService
     */
    reset(): void;
    /**
     * Rolls through all the pages in the page collection to make sure there are no
     * incomplete pages sandwiched between completed pages in the workflow. Identifies
     * the first incomplete page index and sets all pages behind it to a completed
     * state of false.
     *
     * @memberof PageCollectionService
     */
    updateCompletedStates(): void;
    /**
     * Retrieves the index of the first incomplete page in the page collection.
     *
     * @memberof PageCollectionService
     */
    findFirstIncompletePageIndex(): number;
    findFirstIncompletePage(): ClrWizardPage;
    /**
     * Consolidates guard logic that prevents a couple of unfortunate edge cases with
     * look ups on the collection of pages.
     *
     * @memberof PageCollectionService
     */
    private checkResults;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageCollectionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageCollectionService>;
}

declare class ClrWizardPageButtons {
    pageButtonsTemplateRef: TemplateRef<any>;
    constructor(pageButtonsTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageButtons, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageButtons, "[clrPageButtons]", never, {}, {}, never, never, false, never>;
}

declare class ClrWizardPageHeaderActions {
    pageHeaderActionsTemplateRef: TemplateRef<any>;
    constructor(pageHeaderActionsTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageHeaderActions, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageHeaderActions, "[clrPageHeaderActions]", never, {}, {}, never, never, false, never>;
}

declare class ClrWizardPageNavTitle {
    pageNavTitleTemplateRef: TemplateRef<any>;
    constructor(pageNavTitleTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageNavTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageNavTitle, "[clrPageNavTitle]", never, {}, {}, never, never, false, never>;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | '1' | '2' | '3' | '4' | '5' | '6';

declare class ClrWizardPageTitle {
    pageTitleTemplateRef: TemplateRef<any>;
    headingLevel: HeadingLevel;
    constructor(pageTitleTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageTitle, "[clrPageTitle]", never, { "headingLevel": { "alias": "clrHeadingLevel"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * The ClrWizardPage component is responsible for displaying the content of each step
 * in the wizard workflow.
 *
 * ClrWizardPage component has hooks into the navigation service (ClrWizardPage.navService),
 * page collection (ClrWizardPage.pageCollection), and button service
 * (ClrWizardPage.buttonService). These three providers are shared across the components
 * within each instance of a Wizard.
 *
 */
declare class ClrWizardPage implements OnInit {
    private navService;
    pageCollection: PageCollectionService;
    buttonService: ButtonHubService;
    /**
     * An input value that is used internally to generate the ClrWizardPage ID as
     * well as the step nav item ID.
     *
     * Typed as any because it should be able to accept numbers as well as
     * strings. Passing an index for wizard whose pages are created with an
     * ngFor loop is a common use case.
     *
     * @memberof WizardPage
     *
     */
    _id: any;
    /**
     * Overrides all actions from the page level, so you can use an alternate function for
     * validation or data-munging with a ClrWizardPage.onCommit (clrWizardPageOnCommit output),
     * ClrWizardPage.onCancel (clrWizardPageOnCancel output), or one
     * of the granular page-level button click event emitters.
     *
     * @memberof WizardPage
     *
     */
    preventDefault: boolean | string;
    /**
     * Emits when the value of ClrWizardPage.nextStepDisabled changes.
     * Should emit the new value of nextStepDisabled.
     *
     * @memberof WizardPage
     *
     */
    nextStepDisabledChange: EventEmitter<boolean>;
    /**
     * Emits when the value of ClrWizardPage.previousStepDisabled changes.
     * Should emit the new value of previousStepDisabled.
     *
     * @memberof WizardPage
     *
     */
    previousStepDisabledChange: EventEmitter<boolean>;
    /**
     *
     * @memberof WizardPage
     *
     */
    stopCancelChange: EventEmitter<boolean>;
    /**
     * An event emitter carried over from a legacy version of ClrWizardPage.
     * Fires an event on ClrWizardPage whenever the next or finish buttons
     * are clicked and the page is the current page of the Wizard.
     *
     * Note that this does not automatically emit an event when a custom
     * button is used in place of a next or finish button.
     *
     * @memberof WizardPage
     *
     */
    onCommit: EventEmitter<string>;
    /**
     * Emits an event when ClrWizardPage becomes the current page of the
     * Wizard.
     *
     * @memberof WizardPage
     *
     */
    onLoad: EventEmitter<string>;
    /**
     * Emits an event when the ClrWizardPage invokes the cancel routine for the wizard.
     *
     * Can be used in conjunction with the ClrWizardPage.stopCancel
     * (clrWizardPagePreventDefaultCancel) or ClrWizardPage.preventDefault
     * (clrWizardPagePagePreventDefault) inputs to implement custom cancel
     * functionality at the page level. This is useful if you would like to do
     * validation, save data, or warn users before cancelling the wizard.
     *
     * Note that this requires you to call Wizard.close() from the host component.
     * This constitues a full replacement of the cancel functionality.
     *
     * @memberof WizardPage
     *
     */
    pageOnCancel: EventEmitter<ClrWizardPage>;
    /**
     * Emits an event when the finish button is clicked and the ClrWizardPage is
     * the wizard's current page.
     *
     * Can be used in conjunction with the ClrWizardPage.preventDefault
     * (clrWizardPagePagePreventDefault) input to implement custom finish
     * functionality at the page level. This is useful if you would like to do
     * validation, save data, or warn users before allowing them to complete
     * the wizard.
     *
     * Note that this requires you to call Wizard.finish() or Wizard.forceFinish()
     * from the host component. This combination creates a full replacement of
     * the finish functionality.
     *
     * @memberof WizardPage
     *
     */
    finishButtonClicked: EventEmitter<ClrWizardPage>;
    /**
     * Emits an event when the previous button is clicked and the ClrWizardPage is
     * the wizard's current page.
     *
     * Can be used in conjunction with the ClrWizardPage.preventDefault
     * (clrWizardPagePagePreventDefault) input to implement custom backwards
     * navigation at the page level. This is useful if you would like to do
     * validation, save data, or warn users before allowing them to go
     * backwards in the wizard.
     *
     * Note that this requires you to call Wizard.previous()
     * from the host component. This combination creates a full replacement of
     * the backwards navigation functionality.
     *
     * @memberof WizardPage
     *
     */
    previousButtonClicked: EventEmitter<ClrWizardPage>;
    /**
     * Emits an event when the next button is clicked and the ClrWizardPage is
     * the wizard's current page.
     *
     * Can be used in conjunction with the ClrWizardPage.preventDefault
     * (clrWizardPagePagePreventDefault) input to implement custom forwards
     * navigation at the page level. This is useful if you would like to do
     * validation, save data, or warn users before allowing them to go
     * to the next page in the wizard.
     *
     * Note that this requires you to call Wizard.forceNext() or Wizard.next()
     * from the host component. This combination creates a full replacement of
     * the forward navigation functionality.
     *
     * @memberof WizardPage
     *
     */
    nextButtonClicked: EventEmitter<ClrWizardPage>;
    /**
     * Emits an event when a danger button is clicked and the ClrWizardPage is
     * the wizard's current page. By default, a danger button will act as
     * either a "next" or "finish" button depending on if the ClrWizardPage is the
     * last page or not.
     *
     * Can be used in conjunction with the ClrWizardPage.preventDefault
     * (clrWizardPagePagePreventDefault) input to implement custom forwards
     * or finish navigation at the page level when the danger button is clicked.
     * This is useful if you would like to do validation, save data, or warn
     * users before allowing them to go to the next page in the wizard or
     * finish the wizard.
     *
     * Note that this requires you to call Wizard.finish(), Wizard.forceFinish(),
     * Wizard.forceNext() or Wizard.next() from the host component. This
     * combination creates a full replacement of the forward navigation and
     * finish functionality.
     *
     * @memberof WizardPage
     *
     */
    dangerButtonClicked: EventEmitter<ClrWizardPage>;
    /**
     * Emits an event when a next, finish, or danger button is clicked and the
     * ClrWizardPage is the wizard's current page.
     *
     * Can be used in conjunction with the ClrWizardPage.preventDefault
     * (clrWizardPagePagePreventDefault) input to implement custom forwards
     * or finish navigation at the page level, regardless of the type of
     * primary button.
     *
     * This is useful if you would like to do validation, save data, or warn
     * users before allowing them to go to the next page in the wizard or
     * finish the wizard.
     *
     * Note that this requires you to call Wizard.finish(), Wizard.forceFinish(),
     * Wizard.forceNext() or Wizard.next() from the host component. This
     * combination creates a full replacement of the forward navigation and
     * finish functionality.
     *
     * @memberof WizardPage
     *
     */
    primaryButtonClicked: EventEmitter<string>;
    customButtonClicked: EventEmitter<string>;
    /**
     * Contains a reference to the page title which is used for a number
     * of different tasks for display in the wizard.
     *
     * @memberof WizardPage
     *
     */
    pageTitle: ClrWizardPageTitle;
    /**
     * Contains a reference to the desired title for the page's step in the
     * navigation on the left side of the wizard. Can be projected to change the
     * navigation link's text.
     *
     * If not defined, then ClrWizardPage.pageTitle will be displayed in the stepnav.
     *
     * @memberof WizardPage
     *
     */
    pageNavTitle: ClrWizardPageNavTitle;
    /**
     * Contains a reference to the buttons defined within the page. If not defined,
     * the wizard defaults to the set of buttons defined as a direct child of the
     * wizard.
     *
     * @memberof WizardPage
     *
     */
    _buttons: ClrWizardPageButtons;
    /**
     * Contains a reference to the header actions defined within the page. If not defined,
     * the wizard defaults to the set of header actions defined as a direct child of the
     * wizard.
     *
     * @memberof WizardPage
     *
     */
    _headerActions: ClrWizardPageHeaderActions;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _nextStepDisabled;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _previousStepDisabled;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _hasError;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _stopCancel;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _stopNext;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _complete;
    /**
     * Creates an instance of ClrWizardPage.
     *
     * @memberof WizardPage
     */
    constructor(navService: WizardNavigationService, pageCollection: PageCollectionService, buttonService: ButtonHubService);
    /**
     * A property that tells whether or not the wizard should be allowed
     * to move to the next page.
     *
     * Useful for in-page validation because it prevents forward navigation
     * and visibly disables the next button.
     *
     * Does not require that you re-implement navigation routines like you
     * would if you were using ClrWizardPage.preventDefault or
     * Wizard.preventDefault.
     *
     * @memberof WizardPage
     *
     */
    get nextStepDisabled(): boolean;
    set nextStepDisabled(val: boolean);
    /**
     * A property that tells whether or not the wizard should be allowed
     * to move to the previous page.
     *
     * Useful for in-page validation because it prevents backward navigation
     * and visibly disables the previous button.
     *
     * Does not require that you re-implement navigation routines like you
     * would if you were using ClrWizardPage.preventDefault or
     * Wizard.preventDefault.
     *
     * @memberof WizardPage
     *
     */
    get previousStepDisabled(): boolean;
    set previousStepDisabled(val: boolean);
    /**
     * Whether the page has an error and also resolve the "falsy" value. The
     * current logic treat a "0" or an empty string as false and likewise will treat any
     * "truthy" value as true.
     *
     * @memberof WizardPage
     *
     */
    get hasError(): boolean;
    set hasError(val: boolean);
    /**
     * Overrides the cancel action from the page level. Allows you to use an
     * alternate function for validation or data-munging before cancelling the
     * wizard when combined with the ClrWizardPage.onCancel
     * (the clrWizardPageOnCancel output).
     *
     * Requires that you manually close the wizard from your host component,
     * usually with a call to Wizard.forceNext() or wizard.next();
     *
     * @memberof ClrWizardPage
     */
    get stopCancel(): boolean;
    set stopCancel(val: boolean);
    /**
     * Overrides forward navigation from the page level. Allows you to use an
     * alternate function for validation or data-munging before moving the
     * wizard to the next pagewhen combined with the ClrWizardPage.onCommit
     * (clrWizardPageOnCommit) or ClrWizardPage.nextButtonClicked
     * (clrWizardPageNext) outputs.
     *
     * Requires that you manually tell the wizard to navigate forward from
     * the hostComponent, usually with a call to Wizard.forceNext() or
     * wizard.next();
     *
     * @memberof ClrWizardPage
     */
    get stopNext(): boolean;
    set stopNext(val: boolean);
    /**
     * A read-only getter that generates an ID string for the wizard page from
     * either the value passed to the ClrWizardPage "id" input or a wizard page
     * counter shared across all wizard pages in the application.
     *
     * Note that the value passed into the ID input Will be prefixed with
     * "clr-wizard-page-".
     *
     * @readonly
     *
     * @memberof ClrWizardPage
     */
    get id(): string;
    /**
     * A read-only getter that serves as a convenience for those who would rather
     * not think in the terms of !ClrWizardPage.nextStepDisabled. For some use cases,
     * ClrWizardPage.readyToComplete is more logical and declarative.
     *
     * @memberof WizardPage
     *
     */
    get readyToComplete(): boolean;
    /**
     * A page is marked as completed if it is both readyToComplete and completed,
     * as in the next or finish action has been executed while this page was current.
     *
     * Note there is and open question about how to handle pages that are marked
     * complete but who are no longer readyToComplete. This might indicate an error
     * state for the ClrWizardPage. Currently, the wizard does not acknowledge this state
     * and only returns that the page is incomplete.
     *
     * @memberof WizardPage
     *
     */
    get completed(): boolean;
    /**
     * A ClrWizardPage can be manually set to completed using this boolean setter.
     * It is recommended that users rely on the convenience functions in the wizard
     * and navigation service instead of manually setting pages’ completion state.
     *
     * @memberof ClrWizardPage
     */
    set completed(value: boolean);
    /**
     * Checks with the navigation service to see if it is the current page.
     *
     * @memberof WizardPage
     *
     */
    get current(): boolean;
    get disabled(): boolean;
    /**
     * A read-only getter that returns whether or not the page is navigable
     * in the wizard. A wizard page can be navigated to if it is completed
     * or the page before it is completed.
     *
     * This getter handles the logic for enabling or disabling the links in
     * the step nav on the left Side of the wizard.
     *
     * @memberof WizardPage
     *
     */
    get enabled(): boolean;
    /**
     * A read-only getter that returns whether or not the page before this
     * ClrWizardPage is completed. This is useful for determining whether or not
     * a page is navigable if it is not current or already completed.
     *
     * @memberof WizardPage
     *
     */
    get previousCompleted(): boolean;
    /**
     *
     * @memberof WizardPage
     *
     */
    get title(): TemplateRef<any>;
    /**
     *
     * @memberof WizardPage
     *
     */
    get navTitle(): TemplateRef<any>;
    /**
     *
     * @memberof WizardPage
     *
     */
    get headerActions(): TemplateRef<any>;
    /**
     *
     * @memberof WizardPage
     *
     */
    get hasHeaderActions(): boolean;
    /**
     *
     * @memberof WizardPage
     *
     */
    get buttons(): TemplateRef<any>;
    /**
     * A read-only getter that returns a boolean that says whether or
     * not the ClrWizardPage includes buttons. Used to determine if the
     * Wizard should override the default button set defined as
     * its direct children.
     *
     * @memberof WizardPage
     *
     */
    get hasButtons(): boolean;
    /**
     * A read-only getter that returns the id used by the step nav item associated with the page.
     *
     * ClrWizardPage needs this ID string for aria information.
     *
     * @memberof WizardPage
     *
     */
    get stepItemId(): string;
    /**
     * Links the nav service and establishes the current page if one is not defined.
     *
     * @memberof WizardPage
     *
     */
    ngOnInit(): void;
    /**
     * Uses the nav service to make the ClrWizardPage the current page in the
     * wizard. Bypasses all checks but still emits the ClrWizardPage.onLoad
     * (clrWizardPageOnLoad) output.
     *
     * In most cases, it is better to use the default navigation functions
     * in Wizard.
     *
     * @memberof WizardPage
     *
     */
    makeCurrent(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardPage, "clr-wizard-page", never, { "_id": { "alias": "id"; "required": false; }; "preventDefault": { "alias": "clrWizardPagePreventDefault"; "required": false; }; "nextStepDisabled": { "alias": "clrWizardPageNextDisabled"; "required": false; }; "previousStepDisabled": { "alias": "clrWizardPagePreviousDisabled"; "required": false; }; "hasError": { "alias": "clrWizardPageHasError"; "required": false; }; "stopCancel": { "alias": "clrWizardPagePreventDefaultCancel"; "required": false; }; "stopNext": { "alias": "clrWizardPagePreventDefaultNext"; "required": false; }; }, { "nextStepDisabledChange": "clrWizardPageNextDisabledChange"; "previousStepDisabledChange": "clrWizardPagePreviousDisabledChange"; "stopCancelChange": "clrWizardPagePreventDefaultCancelChange"; "onCommit": "clrWizardPageOnCommit"; "onLoad": "clrWizardPageOnLoad"; "pageOnCancel": "clrWizardPageOnCancel"; "finishButtonClicked": "clrWizardPageFinish"; "previousButtonClicked": "clrWizardPagePrevious"; "nextButtonClicked": "clrWizardPageNext"; "dangerButtonClicked": "clrWizardPageDanger"; "primaryButtonClicked": "clrWizardPagePrimary"; "customButtonClicked": "clrWizardPageCustomButton"; }, ["pageTitle", "pageNavTitle", "_buttons", "_headerActions"], ["*"], false, never>;
}

/**
 * Performs navigation functions for a wizard and manages the current page. Presented as a
 * separate service to encapsulate the behavior of navigating and completing the wizard so
 * that it can be shared across the wizard and its sub-components.
 *
 * The easiest way to access the navigation service is there a reference on your wizard. The
 * Following example would allow you to access your instance of the wizard from your host
 * component and thereby access the navigation service via YourHostComponent.wizard.navService.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 */
declare class WizardNavigationService implements OnDestroy {
    pageCollection: PageCollectionService;
    buttonService: ButtonHubService;
    /**
     * Is notified when a previous button is clicked in the wizard. Performs checks
     * before alerting the current page of the button click. Enacts navigation to
     * the previous page if not overridden at the page level.
     *
     * @memberof WizardNavigationService
     */
    previousButtonSubscription: Subscription;
    /**
     * Is notified when a Next button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    nextButtonSubscription: Subscription;
    /**
     * Is notified when a danger button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    dangerButtonSubscription: Subscription;
    /**
     * Is notified when a  finish button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    finishButtonSubscription: Subscription;
    /**
     * Is notified when a Custom button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    customButtonSubscription: Subscription;
    /**
     * Is notified when a Cancel button is clicked in the wizard. Notifies the wizard,
     * which handles all cancel functionality, if cancel is not overridden at the page
     * level.
     *
     * @memberof WizardNavigationService
     */
    cancelButtonSubscription: Subscription;
    /**
     * Resets navigation to make the first page current when the page collection service
     * emits an event notifying WizardNavigationService that it has reset all pages
     * to their pristine, incomplete state.
     *
     * @memberof WizardNavigationService
     */
    pagesResetSubscription: Subscription;
    /**
     * A Boolean flag used by the ClrWizardPage to avoid a race condition when pages are
     * loading and there is no current page defined.
     *
     * @memberof WizardNavigationService
     */
    navServiceLoaded: boolean;
    /**
     * A boolean flag shared across the Wizard subcomponents that follows the value
     * of the Wizard.forceForward (clrWizardForceForwardNavigation) input. When true,
     * navigating backwards in the stepnav menu will reset any skipped pages' completed
     * state to false.
     *
     * This is useful when a wizard executes validation on a page-by-page basis when
     * the next button is clicked.
     *
     * @memberof WizardNavigationService
     */
    forceForwardNavigation: boolean;
    /**
     * A boolean flag shared across the Wizard subcomponents that follows the value
     * of the Wizard.stopCancel (clrWizardPreventDefaultCancel) input. When true, the cancel
     * routine is subverted and must be reinstated in the host component calling Wizard.close()
     * at some point.
     *
     * @memberof WizardNavigationService
     */
    wizardHasAltCancel: boolean;
    /**
     * A boolean flag shared across the Wizard subcomponents that follows the value
     * of the Wizard.stopNext (clrWizardPreventDefaultNext) input. When true, the next and finish
     * routines are subverted and must be reinstated in the host component calling Wizard.next(),
     * Wizard.forceNext(), Wizard.finish(), or Wizard.forceFinish().
     *
     * @memberof WizardNavigationService
     */
    wizardHasAltNext: boolean;
    /**
     * A boolean flag shared across the Wizard subcomponents that follows the value
     * of the Wizard.stopNavigation (clrWizardPreventNavigation) input. When true, all
     * navigational elements in the wizard are disabled.
     *
     * This is intended to freeze the wizard in place. Events are not fired so this is
     * not a way to implement alternate functionality for navigation.
     *
     * @memberof WizardNavigationService
     */
    wizardStopNavigation: boolean;
    /**
     * A boolean flag shared with the stepnav items that prevents user clicks on
     * stepnav items from navigating the wizard.
     *
     * @memberof WizardNavigationService
     */
    wizardDisableStepnav: boolean;
    /**
     * @memberof WizardNavigationService
     */
    private _currentPage;
    /**
     *
     * @memberof WizardNavigationService
     */
    private _currentChanged;
    /**
     * @memberof WizardNavigationService
     */
    private _movedToNextPage;
    /**
     * @memberof WizardNavigationService
     */
    private _wizardFinished;
    /**
     * @memberof WizardNavigationService
     */
    private _movedToPreviousPage;
    /**
     * @memberof WizardNavigationService
     */
    private _cancelWizard;
    /**
     * Creates an instance of WizardNavigationService. Also sets up subscriptions
     * that listen to the button service to determine when a button has been clicked
     * in the wizard. Is also responsible for taking action when the page collection
     * requests that navigation be reset to its pristine state.
     *
     * @memberof WizardNavigationService
     */
    constructor(pageCollection: PageCollectionService, buttonService: ButtonHubService);
    /**
     * An Observable that is predominantly used amongst the subcomponents and services
     * of the wizard. It is recommended that users listen to the ClrWizardPage.onLoad
     * (clrWizardPageOnLoad) output instead of this Observable.
     *
     * @memberof WizardNavigationService
     */
    get currentPageChanged(): Observable<ClrWizardPage>;
    /**
     * @memberof WizardNavigationService
     */
    get currentPageTitle(): TemplateRef<any>;
    /**
     * Returns a Boolean that tells you whether or not the current page is the first
     * page in the Wizard.
     *
     * This is helpful for determining whether a page is navigable.
     *
     * @memberof WizardNavigationService
     */
    get currentPageIsFirst(): boolean;
    /**
     * Returns a Boolean that tells you whether or not the current page is the
     * last page in the Wizard.
     *
     * This is used to determine which buttons should display in the wizard footer.
     *
     * @memberof WizardNavigationService
     */
    get currentPageIsLast(): boolean;
    /**
     * Returns the ClrWizardPage object of the current page or null.
     *
     * @memberof WizardNavigationService
     */
    get currentPage(): ClrWizardPage;
    /**
     * Accepts a ClrWizardPage object, since that object to be the current/active
     * page in the wizard, and emits the ClrWizardPage.onLoad (clrWizardPageOnLoad)
     * event for that page.
     *
     * Note that all of this work is bypassed if the ClrWizardPage object is already
     * the current page.
     *
     * @memberof WizardNavigationService
     */
    set currentPage(page: ClrWizardPage);
    /**
     * An observable used internally to alert the wizard that forward navigation
     * has occurred. It is recommended that you use the Wizard.onMoveNext
     * (clrWizardOnNext) output instead of this one.
     *
     * @memberof WizardNavigationService
     */
    get movedToNextPage(): Observable<boolean>;
    /**
     * An observable used internally to alert the wizard that the nav service
     * has approved completion of the wizard.
     *
     * It is recommended that you use the Wizard.wizardFinished (clrWizardOnFinish)
     * output instead of this one.
     *
     * @memberof WizardNavigationService
     */
    get wizardFinished(): Observable<void>;
    /**
     * Notifies the wizard when backwards navigation has occurred via the
     * previous button.
     *
     * @memberof WizardNavigationService
     */
    get movedToPreviousPage(): Observable<boolean>;
    /**
     * Notifies the wizard that a user is trying to cancel it.
     *
     * @memberof WizardNavigationService
     */
    get notifyWizardCancel(): Observable<any>;
    /**
     *
     * @memberof WizardNavigationService
     */
    ngOnDestroy(): void;
    /**
     * This is a public function that can be used to programmatically advance
     * the user to the next page.
     *
     * When invoked, this method will move the wizard to the next page after
     * successful validation. Note that this method goes through all checks
     * and event emissions as if Wizard.next(false) had been called.
     *
     * In most cases, it makes more sense to use Wizard.next(false).
     *
     * @memberof WizardNavigationService
     */
    next(): void;
    /**
     * Bypasses checks and most event emissions to force a page to navigate forward.
     *
     * Comparable to calling Wizard.next() or Wizard.forceNext().
     *
     * @memberof WizardNavigationService
     */
    forceNext(): void;
    /**
     * Accepts a button/action type as a parameter. Encapsulates all logic for
     * event emissions, state of the current page, and wizard and page level overrides.
     *
     * Avoid calling this function directly unless you really know what you're doing.
     *
     * @memberof WizardNavigationService
     */
    checkAndCommitCurrentPage(buttonType: string): void;
    /**
     * This is a public function that can be used to programmatically conclude
     * the wizard.
     *
     * When invoked, this method will  initiate the work involved with finalizing
     * and finishing the wizard workflow. Note that this method goes through all
     * checks and event emissions as if Wizard.finish(false) had been called.
     *
     * In most cases, it makes more sense to use Wizard.finish(false).
     *
     * @memberof WizardNavigationService
     */
    finish(): void;
    /**
     * Programmatically moves the wizard to the page before the current page.
     *
     * In most instances, it makes more sense to call Wizard.previous()
     * which does the same thing.
     *
     * @memberof WizardNavigationService
     */
    previous(): void;
    /**
     * Allows a hook into the cancel workflow of the wizard from the nav service. Note that
     * this route goes through all checks and event emissions as if a cancel button had
     * been clicked.
     *
     * In most cases, users looking for a hook into the cancel routine are actually looking
     * for a way to close the wizard from their host component because they have prevented
     * the default cancel action.
     *
     * In this instance, it is recommended that you use Wizard.close() to avoid any event
     * emission loop resulting from an event handler calling back into routine that will
     * again evoke the events it handles.
     *
     * @memberof WizardNavigationService
     */
    cancel(): void;
    /**
     * Performs all required checks to determine if a user can navigate to a page. Checking at each
     * point if a page is navigable -- completed where the page immediately after the last completed
     * page.
     *
     * Takes two parameters. The first one must be either the ClrWizardPage object or the ID of the
     * ClrWizardPage object that you want to make the current page.
     *
     * The second parameter is optional and is a Boolean flag for "lazy completion". What this means
     * is the Wizard will mark all pages between the current page and the page you want to navigate
     * to as completed. This is useful for informational wizards that do not require user action,
     * allowing an easy means for users to jump ahead.
     *
     * To avoid checks on navigation, use ClrWizardPage.makeCurrent() instead.
     *
     * @memberof WizardNavigationService
     */
    goTo(pageToGoToOrId: any, lazyComplete?: boolean): void;
    /**
     * Accepts a range of ClrWizardPage objects as a parameter. Performs the work of checking
     * those objects to determine if navigation can be accomplished.
     *
     * @memberof WizardNavigationService
     */
    canGoTo(pagesToCheck: ClrWizardPage[]): boolean;
    /**
     * Looks through the collection of pages to find the first one that is incomplete
     * and makes that page the current/active page.
     *
     * @memberof WizardNavigationService
     */
    setLastEnabledPageCurrent(): void;
    /**
     * Finds the first page in the collection of pages and makes that page the
     * current/active page.
     *
     * @memberof WizardNavigationService
     */
    setFirstPageCurrent(): void;
    /**
     * Updates the stepnav on the left side of the wizard when pages are dynamically
     * added or removed from the collection of pages.
     *
     * @memberof WizardNavigationService
     */
    updateNavigation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WizardNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WizardNavigationService>;
}

declare class HeaderActionService {
    navService: WizardNavigationService;
    wizardHeaderActions: QueryList<ClrWizardHeaderAction>;
    constructor(navService: WizardNavigationService);
    get wizardHasHeaderActions(): boolean;
    get currentPageHasHeaderActions(): boolean;
    get showWizardHeaderActions(): boolean;
    get displayHeaderActionsWrapper(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeaderActionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HeaderActionService>;
}

declare class ClrWizardTitle {
    headingLevel: HeadingLevel;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardTitle, "clr-wizard-title", never, { "headingLevel": { "alias": "clrHeadingLevel"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrWizard implements OnDestroy, AfterContentInit, DoCheck {
    private platformId;
    commonStrings: ClrCommonStringsService;
    navService: WizardNavigationService;
    pageCollection: PageCollectionService;
    buttonService: ButtonHubService;
    headerActionService: HeaderActionService;
    private elementRef;
    /**
     * Set the aria-label for the stepnav section of the wizard. Set using `[clrWizardStepnavAriaLabel]` input.
     */
    stepnavAriaLabel: string;
    /**
     * Set the modal size of the wizard. Set using `[clrWizardSize]` input.
     */
    size: string;
    /**
     * Enable "in page" wizard. Set using `[clrWizardInPage]` input.
     */
    inPage: boolean;
    /**
     * Make an "in page" wizard fill the `.content-area`. Set using `[clrWizardInPageFillContentArea]` input.
     * If you can't use this option, you will likely need to provide custom CSS to set the wizard's height and margins.
     */
    inPageFillContentArea: boolean;
    /**
     * Tells the modal part of the wizard whether it should have a close "X"
     * in the top right corner. Set using `[clrWizardClosable]` input.
     */
    closable: boolean;
    /**
     * Used to communicate to the underlying modal that animations are not
     * wanted. Primary use is for the display of static/inline wizards.
     * Set using `[clrWizardPreventModalAnimation]` input.
     */
    _stopModalAnimations: boolean;
    /**
     * Emits when the wizard is opened or closed.
     * Listen via `(clrWizardOpenChange)` event.
     */
    _openChanged: EventEmitter<boolean>;
    /**
     * Emits when the wizard is canceled. Listen via `(clrWizardOnCancel)` event.
     * Can be combined with the `[clrWizardPreventDefaultCancel]` input to create
     * wizard-level custom cancel routines.
     */
    onCancel: EventEmitter<any>;
    /**
     * Emits when the wizard is completed. Listen via `(clrWizardOnFinish)` event.
     * Can be combined with the `[clrWizardPreventDefaultNext]` input to create
     * wizard-level custom completion routines.
     */
    wizardFinished: EventEmitter<any>;
    /**
     * Emits when the wizard is reset. Listen via `(clrWizardOnReset)` event.
     */
    onReset: EventEmitter<any>;
    /**
     * Emits when the current page has changed. Listen via `(clrWizardCurrentPageChanged)` event.
     * output. Useful for non-blocking validation.
     */
    currentPageChanged: EventEmitter<any>;
    /**
     * Emits when the wizard moves to the next page. Listen via `(clrWizardOnNext)` event.
     * Can be combined with the `[clrWizardPreventDefaultNext]` input to create
     * wizard-level custom navigation routines, which are useful for validation.
     */
    onMoveNext: EventEmitter<any>;
    /**
     * Emits when the wizard moves to the previous page. Can be useful for validation.
     * Listen via `(clrWizardOnPrevious)` event.
     */
    onMovePrevious: EventEmitter<any>;
    pageTitle: ElementRef<HTMLElement>;
    pages: QueryList<ClrWizardPage>;
    headerActions: QueryList<ClrWizardHeaderAction>;
    _open: boolean;
    wizardId: string;
    protected wizardTitle: ClrWizardTitle;
    private readonly bodyElementRef;
    private _forceForward;
    private _stopNext;
    private _stopCancel;
    private _stopNavigation;
    private _disableStepnav;
    private differ;
    private subscriptions;
    private readonly modal;
    constructor(platformId: any, commonStrings: ClrCommonStringsService, navService: WizardNavigationService, pageCollection: PageCollectionService, buttonService: ButtonHubService, headerActionService: HeaderActionService, elementRef: ElementRef<HTMLElement>, differs: IterableDiffers);
    /**
     * Resets page completed states when navigating backwards.
     * Set using `[clrWizardForceForwardNavigation]` input.
     */
    get forceForward(): boolean;
    set forceForward(value: boolean);
    /**
     * Toggles open/close of the wizard component.
     * Set using the `[clrWizardOpen]` input.
     */
    set clrWizardOpen(open: boolean);
    /**
     * Prevents ClrWizard from moving to the next page or closing itself on finishing.
     * Set using the `[clrWizardPreventDefaultNext]` input. Note that using stopNext
     * will require you to create your own calls to .next() and .finish() in your
     * host component to make the ClrWizard work as expected.
     */
    get stopNext(): boolean;
    set stopNext(value: boolean);
    /**
     * Prevents ClrWizard from closing when the cancel button or close "X" is clicked.
     * Set using the `[clrWizardPreventDefaultCancel]` input.
     *
     * Note that using stopCancel will require you to create your own calls to `close()` in your host compone`nt
     * to make the ClrWizard work as expected. Useful for doing checks or prompts
     * before closing a ClrWizard.
     */
    get stopCancel(): boolean;
    set stopCancel(value: boolean);
    /**
     * Prevents ClrWizard from performing any form of navigation away from the current
     * page. Set using the `[clrWizardPreventNavigation]` input.
     * Note that stopNavigation is meant to freeze the wizard in place, typically
     * during a long validation or background action where you want the wizard to
     * display loading content but not allow the user to execute navigation in
     * the stepnav, close X, or the  back, finish, or next buttons.
     */
    get stopNavigation(): boolean;
    set stopNavigation(value: boolean);
    /**
     * Prevents clicks on the links in the stepnav from working.
     * Set using `[clrWizardDisableStepnav]` input.
     * A more granular bypassing of navigation which can be useful when your
     * ClrWizard is in a state of completion and you don't want users to be
     * able to jump backwards and change things.
     */
    get disableStepnav(): boolean;
    set disableStepnav(value: boolean);
    get currentPage(): ClrWizardPage;
    set currentPage(page: ClrWizardPage);
    get isLast(): boolean;
    get isFirst(): boolean;
    get isInline(): boolean;
    get stopModalAnimations(): boolean;
    ngAfterContentInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    /**
     * Marks Wizard as finished. By default it does not execute event
     * emissions or checks before completing and closing. This method is commonly
     * used as part of an alternative navigation with `[clrWizardPreventDefaultNext]`.
     *
     * If `skipChecksAndEmits` is true, the wizard will complete and close
     * regardless of the state of its current page. This is useful for alternative
     * navigation where event emissions have already been done and firing them again
     * may cause an event loop.
     */
    finish(skipChecksAndEmits?: boolean): void;
    /**
     * Marks the wizard as finished but does run checks and emissions.
     * Good for a last step in an alternate workflow. Does the same thing as
     * calling `ClrWizard.finish(true)` or `ClrWizard.finish()` without a parameter.
     */
    forceFinish(): void;
    /**
     * Opens the wizard. If there is no current page defined, sets the first page in the wizard to be current.
     */
    open(): void;
    /**
     * Closes the wizard. Call this directly instead of `cancel()` to implement alternative cancel functionality.
     */
    close(): void;
    /**
     * Used to open and close the wizard. By default the wizard will
     * close if invoked with no parameter. If parameter is true wizard will open
     * else if false will close.
     */
    toggle(open: boolean): void;
    /**
     * Moves the wizard to the previous page.
     */
    previous(): void;
    /**
     * By default, `next()` does not execute event emissions.
     * This method is commonly called as part of an alternative navigation
     * with `[clrWizardPreventDefaultNext]`. The wizard will move to the next page
     * regardless of the state of its current page. This is useful for alternative
     * navigation where event emissions have already been done and firing them again
     * may cause an event loop.
     *
     * If `skipChecksAndEmits` is false, the wizard will execute default checks
     * and emit events as normal. This is useful for custom buttons or programmatic
     * workflows that are not executing the wizards default checks and emissions.
     * It is another way to navigate without having to rewrite the wizard’s default
     * functionality from scratch.
     */
    next(skipChecksAndEmits?: boolean): void;
    /**
     * Moves the wizard to the next page without the checks and emissions.
     * Good for a last step in an alternate workflow.
     * Alias for `ClrWizard.next(true)` or `ClrWizard.next()`
     */
    forceNext(): void;
    /**
     * Cancels and closes the wizard. Do not use this for an override of the cancel
     * the functionality with `[clrWizardPreventDefaultCancel]`, `[clrWizardPreventPageDefaultCancel]`,
     * or `[clrWizardPagePreventDefault]` because it will initiate the same checks
     * and event emissions that invoked your event handler. Use `ClrWizard.close()` instead.
     */
    cancel(): void;
    /**
     * Overrides behavior of the underlying modal to avoid collisions with
     * alternative cancel functionality. In most cases, use `ClrWizard.cancel()` instead.
     */
    modalCancel(): void;
    /**
     * Checks for alternative cancel flows defined at the current page or
     * wizard level. Performs a canceled if not. Emits events that initiate
     * the alternative cancel outputs `(clrWizardPageOnCancel)` and `(clrWizardOnCancel)`.
     */
    checkAndCancel(): void;
    /**
     * Navigates to a given page in the Wizard. Navigation will invoke the wizard’s default
     * checks and event emissions.
     *
     * The format of the expected ID parameter can be found in the return of the
     * ClrWizardPage.id getter, usually prefixed with `clr-wizard-page-` and then either a
     * numeric ID or the ID specified for the `ClrWizardPage` component’s `id` input.
     */
    goTo(pageId: string): void;
    /**
     * Reset sets all WizardPages to incomplete and sets the first page in the `ClrWizard` to
     * be the current page, resetting the wizard navigation.
     * Use `(clrWizardOnReset)` event to reset the data or model of your wizard.
     */
    reset(): void;
    private listenForNextPageChanges;
    private listenForPreviousPageChanges;
    private listenForCancelChanges;
    private listenForFinishedChanges;
    private listenForPageChanges;
    private updateNavOnPageChanges;
    private initializeButtons;
    private emitWizardFinished;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizard, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizard, "clr-wizard", never, { "stepnavAriaLabel": { "alias": "clrWizardStepnavAriaLabel"; "required": false; }; "size": { "alias": "clrWizardSize"; "required": false; }; "inPage": { "alias": "clrWizardInPage"; "required": false; }; "inPageFillContentArea": { "alias": "clrWizardInPageFillContentArea"; "required": false; }; "closable": { "alias": "clrWizardClosable"; "required": false; }; "_stopModalAnimations": { "alias": "clrWizardPreventModalAnimation"; "required": false; }; "forceForward": { "alias": "clrWizardForceForwardNavigation"; "required": false; }; "clrWizardOpen": { "alias": "clrWizardOpen"; "required": false; }; "stopNext": { "alias": "clrWizardPreventDefaultNext"; "required": false; }; "stopCancel": { "alias": "clrWizardPreventDefaultCancel"; "required": false; }; "stopNavigation": { "alias": "clrWizardPreventNavigation"; "required": false; }; "disableStepnav": { "alias": "clrWizardDisableStepnav"; "required": false; }; }, { "_openChanged": "clrWizardOpenChange"; "onCancel": "clrWizardOnCancel"; "wizardFinished": "clrWizardOnFinish"; "onReset": "clrWizardOnReset"; "currentPageChanged": "clrWizardCurrentPageChanged"; "onMoveNext": "clrWizardOnNext"; "onMovePrevious": "clrWizardOnPrevious"; }, ["wizardTitle", "pages", "headerActions"], ["clr-wizard-title", "clr-wizard-header-action", "*", "clr-wizard-button"], false, never>;
}

declare class ClrWizardStepnav {
    pageService: PageCollectionService;
    label: string;
    constructor(pageService: PageCollectionService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardStepnav, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardStepnav, "clr-wizard-stepnav", never, { "label": { "alias": "label"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrWizardStepnavItem implements OnInit, OnDestroy {
    navService: WizardNavigationService;
    pageCollection: PageCollectionService;
    commonStrings: ClrCommonStringsService;
    private readonly elementRef;
    page: ClrWizardPage;
    private subscription;
    /**
     * This is used to prevent the steps from scrolling as the user clicks on the steps.
     */
    private skipNextScroll;
    constructor(navService: WizardNavigationService, pageCollection: PageCollectionService, commonStrings: ClrCommonStringsService, elementRef: ElementRef<HTMLElement>);
    get id(): string;
    get stepAriaCurrent(): string;
    get isDisabled(): boolean;
    get isCurrent(): boolean;
    get isComplete(): boolean;
    get hasError(): boolean;
    get canNavigate(): boolean;
    protected get stepIconId(): string;
    protected get stepTextId(): string;
    protected get stepNumberId(): string;
    protected get stepTitleId(): string;
    protected get labelledby(): string;
    protected get icon(): {
        shape: string;
        label: string;
    } | null;
    ngOnInit(): void;
    ngOnDestroy(): void;
    click(): void;
    private pageGuard;
    private ensureCurrentStepIsScrolledIntoView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardStepnavItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardStepnavItem, "[clr-wizard-stepnav-item]", never, { "page": { "alias": "page"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const DEFAULT_BUTTON_TYPES: any;
declare const CUSTOM_BUTTON_TYPES: any;
declare class ClrWizardButton {
    navService: WizardNavigationService;
    buttonService: ButtonHubService;
    type: string;
    disabled: boolean;
    hidden: boolean;
    wasClicked: EventEmitter<string>;
    constructor(navService: WizardNavigationService, buttonService: ButtonHubService);
    get isCancel(): boolean;
    get isNext(): boolean;
    get isPrevious(): boolean;
    get isFinish(): boolean;
    get isDanger(): boolean;
    get isPrimaryAction(): boolean;
    get _disabledAttribute(): string | null;
    get isDisabled(): boolean;
    get isHidden(): boolean;
    click(): void;
    private checkDefaultAndCustomType;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardButton, "clr-wizard-button", never, { "type": { "alias": "type"; "required": false; }; "disabled": { "alias": "clrWizardButtonDisabled"; "required": false; }; "hidden": { "alias": "clrWizardButtonHidden"; "required": false; }; }, { "wasClicked": "clrWizardButtonClicked"; }, never, ["*"], false, never>;
}

declare const CLR_WIZARD_DIRECTIVES: any[];
declare class ClrWizardModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrWizardModule, [typeof ClrWizard, typeof ClrWizardPage, typeof ClrWizardStepnav, typeof ClrWizardStepnavItem, typeof ClrWizardButton, typeof ClrWizardHeaderAction, typeof ClrWizardTitle, typeof ClrWizardPageTitle, typeof ClrWizardPageNavTitle, typeof ClrWizardPageButtons, typeof ClrWizardPageHeaderActions], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrModalModule, typeof ClrAlertModule], [typeof ClrWizard, typeof ClrWizardPage, typeof ClrWizardStepnav, typeof ClrWizardStepnavItem, typeof ClrWizardButton, typeof ClrWizardHeaderAction, typeof ClrWizardTitle, typeof ClrWizardPageTitle, typeof ClrWizardPageNavTitle, typeof ClrWizardPageButtons, typeof ClrWizardPageHeaderActions]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrWizardModule>;
}

declare class ClrSidePanel implements OnInit, OnDestroy {
    private element;
    private configuration;
    commonStrings: ClrCommonStringsService;
    openChange: EventEmitter<boolean>;
    closeButtonAriaLabel: string | undefined;
    skipAnimation: boolean;
    labelledById: string;
    staticBackdrop: boolean;
    closable: boolean;
    preventClose: boolean;
    altClose: EventEmitter<boolean>;
    private _pinnable;
    private _pinned;
    private originalStopClose;
    private _position;
    private _modal;
    private __open;
    private _size;
    constructor(element: ElementRef<HTMLElement>, configuration: ClrModalConfigurationService, commonStrings: ClrCommonStringsService);
    get _open(): boolean;
    set _open(open: boolean);
    get size(): string;
    set size(value: string);
    get position(): string;
    set position(position: string);
    get pinned(): boolean;
    set pinned(pinned: boolean);
    get clrSidePanelBackdrop(): boolean;
    set clrSidePanelBackdrop(backdrop: boolean);
    get clrSidePanelPinnable(): boolean;
    set clrSidePanelPinnable(pinnable: boolean);
    private get modal();
    private set modal(value);
    private get hostElement();
    private get bottomPositionCssClass();
    ngOnInit(): void;
    ngOnDestroy(): void;
    handleModalOpen(open: boolean): void;
    open(): void;
    close(): void;
    togglePinned(): void;
    private documentClick;
    private updateModalState;
    private cleanupPinnedClasses;
    private updatePinnedClasses;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSidePanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSidePanel, "clr-side-panel", never, { "closeButtonAriaLabel": { "alias": "clrSidePanelCloseButtonAriaLabel"; "required": false; }; "skipAnimation": { "alias": "clrSidePanelSkipAnimation"; "required": false; }; "labelledById": { "alias": "clrSidePanelLabelledById"; "required": false; }; "staticBackdrop": { "alias": "clrSidePanelStaticBackdrop"; "required": false; }; "closable": { "alias": "clrSidePanelClosable"; "required": false; }; "preventClose": { "alias": "clrSidePanelPreventClose"; "required": false; }; "_open": { "alias": "clrSidePanelOpen"; "required": false; }; "size": { "alias": "clrSidePanelSize"; "required": false; }; "position": { "alias": "clrSidePanelPosition"; "required": false; }; "pinned": { "alias": "clrSidePanelPinned"; "required": false; }; "clrSidePanelBackdrop": { "alias": "clrSidePanelBackdrop"; "required": false; }; "clrSidePanelPinnable": { "alias": "clrSidePanelPinnable"; "required": false; }; }, { "openChange": "clrSidePanelOpenChange"; "altClose": "clrSidePanelAlternateClose"; }, never, [".side-panel-title", ".side-panel-body", ".side-panel-footer"], false, never>;
}

declare const CLR_SIDEPANEL_DIRECTIVES: Type<any>[];
declare class ClrSidePanelModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSidePanelModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSidePanelModule, [typeof ClrSidePanel], [typeof i2.CommonModule, typeof CdkTrapFocusModule, typeof ClrIcon, typeof ClrModalModule], [typeof ClrSidePanel, typeof ClrModalModule, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSidePanelModule>;
}

declare enum AccordionStrategy {
    Default = "default",// only one panel at a time
    Multi = "multi"
}

declare enum AccordionStatus {
    Inactive = "inactive",
    Error = "error",
    Complete = "complete"
}

declare class AccordionPanelModel {
    id: string;
    accordionId: number | string;
    status: AccordionStatus;
    index: number;
    disabled: boolean;
    open: boolean;
    templateId: string;
    constructor(id: string, accordionId: number | string);
}
declare class AccordionModel {
    protected strategy: AccordionStrategy;
    protected accordionCount: number;
    protected _panels: {
        [id: string]: AccordionPanelModel;
    };
    get panels(): AccordionPanelModel[];
    setStrategy(strategy: AccordionStrategy): void;
    updatePanelOrder(ids: string[]): void;
    addPanel(id: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled: boolean): void;
    private closeAllPanels;
    private removeOldPanels;
}

declare class AccordionService {
    protected accordion: AccordionModel;
    protected readonly _panelsChanges: BehaviorSubject<AccordionPanelModel[]>;
    getPanelChanges(panelId: string): Observable<AccordionPanelModel>;
    setStrategy(strategy: AccordionStrategy): void;
    addPanel(panelId: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled?: boolean): void;
    updatePanelOrder(ids: string[]): void;
    protected emitUpdatedPanels(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AccordionService>;
}

declare class StepperModel extends AccordionModel {
    private stepperModelInitialize;
    private initialPanel;
    get allPanelsCompleted(): boolean;
    get shouldOpenFirstPanel(): boolean;
    addPanel(id: string, open?: boolean): void;
    updatePanelOrder(ids: string[]): void;
    togglePanel(panelId: string): void;
    navigateToPreviousPanel(currentPanelId: string): void;
    navigateToNextPanel(currentPanelId: string, currentPanelValid?: boolean): void;
    overrideInitialPanel(panelId: string): void;
    setPanelValid(panelId: string): void;
    setPanelInvalid(panelId: string): void;
    setPanelsWithErrors(ids: string[]): void;
    resetPanels(): void;
    getNextPanel(currentPanelId: string): AccordionPanelModel;
    getPreviousPanel(currentPanelId: string): AccordionPanelModel;
    private resetAllFuturePanels;
    private resetPanel;
    private openFirstPanel;
    private completePanel;
    private openNextPanel;
    private openPreviousPanel;
    private setPanelError;
    private getFirstPanel;
    private getNumberOfIncompletePanels;
    private getNumberOfOpenPanels;
}

declare class StepperService extends AccordionService {
    readonly activeStep: Observable<string>;
    readonly panelsCompleted: Observable<boolean>;
    protected accordion: StepperModel;
    private _activeStepChanges;
    constructor();
    resetPanels(): void;
    setPanelValid(panelId: string): void;
    setPanelInvalid(panelId: string): void;
    setPanelsWithErrors(ids: string[]): void;
    navigateToPreviousPanel(currentPanelId: string): void;
    navigateToNextPanel(currentPanelId: string, currentPanelValid?: boolean): void;
    overrideInitialPanel(panelId: string): void;
    private updateNextStep;
    private updatePreviousStep;
    private getAllCompletedPanelChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StepperService>;
}

declare class ClrAccordionDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionDescription, "clr-accordion-description, clr-step-description", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAccordionPanel implements OnInit, OnChanges {
    private parent;
    commonStrings: ClrCommonStringsService;
    private accordionService;
    private ifExpandService;
    private cdr;
    disabled: boolean;
    panelOpen: boolean;
    headingEnabled: boolean;
    /**
     * Level of the accordion/stepper heading from 1 to 6.
     */
    explicitHeadingLevel: HeadingLevel;
    panelOpenChange: EventEmitter<boolean>;
    accordionDescription: QueryList<ClrAccordionDescription>;
    panel: Observable<AccordionPanelModel>;
    private _id;
    private _panelIndex;
    constructor(parent: ClrAccordionPanel, commonStrings: ClrCommonStringsService, accordionService: AccordionService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(value: string);
    get panelNumber(): number;
    get headingLevel(): HeadingLevel;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    togglePanel(): void;
    collapsePanelOnAnimationDone(panel: AccordionPanelModel): void;
    getPanelStateClasses(panel: AccordionPanelModel): string;
    getAccordionContentId(id: string): string;
    getAccordionHeaderId(id: string): string;
    protected stepCompleteText(panelNumber: number): string;
    protected stepErrorText(panelNumber: number): string;
    private emitPanelChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionPanel, [{ optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionPanel, "clr-accordion-panel", never, { "disabled": { "alias": "clrAccordionPanelDisabled"; "required": false; }; "panelOpen": { "alias": "clrAccordionPanelOpen"; "required": false; }; "headingEnabled": { "alias": "clrAccordionPanelHeadingEnabled"; "required": false; }; "explicitHeadingLevel": { "alias": "clrAccordionPanelHeadingLevel"; "required": false; }; }, { "panelOpenChange": "clrAccordionPanelOpenChange"; }, ["accordionDescription"], ["clr-accordion-title, clr-step-title", "clr-accordion-description, clr-step-description", "*"], false, never>;
}

declare class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
    private platformId;
    commonStrings: ClrCommonStringsService;
    private formGroupName;
    private ngModelGroup;
    private stepperService;
    headerButton: ElementRef<HTMLButtonElement>;
    readonly AccordionStatus: typeof AccordionStatus;
    private subscriptions;
    constructor(platformId: any, commonStrings: ClrCommonStringsService, formGroupName: FormGroupName, ngModelGroup: NgModelGroup, stepperService: StepperService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(_value: string);
    get formGroup(): i4.FormGroup<any>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private listenToFocusChanges;
    private triggerAllFormControlValidationIfError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperPanel, [null, null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepperPanel, "clr-stepper-panel", never, {}, {}, never, ["clr-step-title", "clr-step-description", "*"], false, never>;
}

declare class ClrStepper implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private formGroup;
    private ngForm;
    private stepperService;
    initialPanel: string;
    panels: QueryList<ClrStepperPanel>;
    subscriptions: Subscription[];
    form: FormGroupDirective | NgForm;
    constructor(formGroup: FormGroupDirective, ngForm: NgForm, stepperService: StepperService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private listenForFormResetChanges;
    private listenForPanelsCompleted;
    private setPanelsWithFormErrors;
    private listenForDOMChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepper, [{ optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepper, "form[clrStepper]", never, { "initialPanel": { "alias": "clrInitialStep"; "required": false; }; }, {}, ["panels"], ["*"], false, never>;
}

declare enum ClrStepButtonType {
    Next = "next",
    Previous = "previous",
    Submit = "submit"
}
declare class ClrStepButton implements OnInit {
    private clrStep;
    private stepperService;
    type: ClrStepButtonType | string;
    submitButton: boolean;
    previousButton: boolean;
    constructor(clrStep: ClrStepperPanel, stepperService: StepperService);
    ngOnInit(): void;
    navigateToNextPanel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStepButton, "[clrStepButton]", never, { "type": { "alias": "clrStepButton"; "required": false; }; }, {}, never, never, false, never>;
}

declare class StepperWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<StepperWillyWonka, "form[clrStepper]", never, {}, {}, never, never, false, never>;
}

declare class StepperOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: StepperWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<StepperOompaLoompa, "clr-stepper-panel, [clrStepButton]", never, {}, {}, never, never, false, never>;
}

declare class ClrAccordion implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private accordionService;
    multiPanel: boolean | string;
    panels: QueryList<ClrAccordionPanel>;
    subscriptions: Subscription[];
    constructor(accordionService: AccordionService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private setAccordionStrategy;
    private listenForDOMChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordion, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordion, "clr-accordion", never, { "multiPanel": { "alias": "clrAccordionMultiPanel"; "required": false; }; }, {}, ["panels"], ["*"], false, never>;
}

declare class ClrAccordionTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionTitle, "clr-accordion-title, clr-step-title", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAccordionContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionContent, "clr-accordion-content, clr-step-content", never, {}, {}, never, ["*"], false, never>;
}

declare class AccordionWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AccordionWillyWonka, "clr-accordion", never, {}, {}, never, never, false, never>;
}

declare class AccordionOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: AccordionWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AccordionOompaLoompa, "clr-accordion-panel", never, {}, {}, never, never, false, never>;
}

declare class ClrAccordionModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrAccordionModule, [typeof ClrAccordion, typeof ClrAccordionPanel, typeof ClrAccordionTitle, typeof ClrAccordionDescription, typeof ClrAccordionContent, typeof AccordionOompaLoompa, typeof AccordionWillyWonka], [typeof i2.CommonModule, typeof ClrIcon], [typeof ClrAccordion, typeof ClrAccordionPanel, typeof ClrAccordionTitle, typeof ClrAccordionDescription, typeof ClrAccordionContent, typeof AccordionOompaLoompa, typeof AccordionWillyWonka]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrAccordionModule>;
}

declare class ClrStepperModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStepperModule, [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepperPanel, typeof StepperOompaLoompa, typeof StepperWillyWonka], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrAccordionModule], [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepperPanel, typeof StepperOompaLoompa, typeof StepperWillyWonka, typeof ClrAccordionModule, typeof ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrStepperModule>;
}

declare class ClrProgressBar {
    max: number | string;
    displayval: string;
    color: string;
    value: number | string;
    externalId: string;
    private _ID;
    private _labeled;
    private _fade;
    private _loop;
    private _flash;
    private _flashDanger;
    private _compact;
    get id(): string;
    set id(value: string);
    get progressClass(): boolean;
    set clrCompact(value: boolean | string);
    get compactClass(): boolean;
    set clrLabeled(value: boolean | string);
    get labeledClass(): boolean;
    set clrFade(value: boolean | string);
    get fadeClass(): boolean;
    set clrLoop(value: boolean | string);
    get loopClass(): boolean;
    get warningClass(): boolean;
    get successClass(): boolean;
    get dangerClass(): boolean;
    set clrFlash(value: boolean | string);
    get flashClass(): boolean;
    /** @deprecated since 2.0, remove in 4.0 */
    set clrFlashDanger(value: boolean | string);
    get flashDangerClass(): boolean;
    /**
     * Make sure that we always will have something that is readable
     * for the screen reader
     */
    get displayValue(): string;
    /**
     * Display optional text only when labeled is eneabled
     */
    displayStringValue(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrProgressBar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrProgressBar, "clr-progress-bar", never, { "max": { "alias": "clrMax"; "required": false; }; "displayval": { "alias": "clrDisplayval"; "required": false; }; "color": { "alias": "clrColor"; "required": false; }; "value": { "alias": "clrValue"; "required": false; }; "id": { "alias": "id"; "required": false; }; "clrCompact": { "alias": "clrCompact"; "required": false; }; "clrLabeled": { "alias": "clrLabeled"; "required": false; }; "clrFade": { "alias": "clrFade"; "required": false; }; "clrLoop": { "alias": "clrLoop"; "required": false; }; "clrFlash": { "alias": "clrFlash"; "required": false; }; "clrFlashDanger": { "alias": "clrFlashDanger"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_PROGRESS_BAR_DIRECTIVES: Type<any>[];
declare class ClrProgressBarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrProgressBarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrProgressBarModule, [typeof ClrProgressBar], [typeof i2.CommonModule], [typeof ClrProgressBar]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrProgressBarModule>;
}

declare enum ClrTimelineLayout {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}

declare class ClrTimeline {
    layout: ClrTimelineLayout;
    get isVertical(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimeline, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimeline, "clr-timeline", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare enum ClrTimelineStepState {
    NOT_STARTED = "not-started",
    CURRENT = "current",
    PROCESSING = "processing",
    SUCCESS = "success",
    ERROR = "error"
}

declare class TimelineIconAttributeService {
    private attributeMap;
    constructor(commonStrings: ClrCommonStringsService);
    getAriaLabel(step: ClrTimelineStepState): string;
    getIconShape(step: ClrTimelineStepState): string;
    getIconStatus(step: ClrTimelineStepState): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimelineIconAttributeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimelineIconAttributeService>;
}

declare class ClrTimelineStep {
    private iconAttributeService;
    private platformId;
    state: ClrTimelineStepState;
    stepTitle: ElementRef<HTMLElement>;
    stepTitleText: string;
    constructor(iconAttributeService: TimelineIconAttributeService, platformId: any);
    get iconAriaLabel(): string;
    get iconShape(): string;
    get iconStatus(): string;
    get isProcessing(): boolean;
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStep, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStep, "clr-timeline-step", never, { "state": { "alias": "clrState"; "required": false; }; }, {}, ["stepTitle"], ["clr-timeline-step-header", "clr-timeline-step-title", "clr-timeline-step-description"], false, never>;
}

declare class ClrTimelineStepDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStepDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStepDescription, "clr-timeline-step-description", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTimelineStepHeader {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStepHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStepHeader, "clr-timeline-step-header", never, {}, {}, never, ["*"], false, never>;
}

/**
 * Note: Why does this component have aria-hidden attribute?
 *
 * tl;dr: we want screen readers to ignore this element when its reading out to blind users.
 *
 * In order to make a timeline step accessible to screen readers we need the title read out before the
 * icon. In order to do this, ClrTimeLine step has a ContentChild that queries for the ClrTimelineStepTitle and
 * then adds the projected text into a .clr-sr-only element that is a sibling element to the icon. See the
 * ClrTimlineStep template for the DOM structure.
 */
declare class ClrTimelineStepTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStepTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStepTitle, "clr-timeline-step-title", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTimelineModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTimelineModule, [typeof ClrTimeline, typeof ClrTimelineStep, typeof ClrTimelineStepDescription, typeof ClrTimelineStepHeader, typeof ClrTimelineStepTitle], [typeof i2.CommonModule, typeof ClrIcon, typeof ClrSpinnerModule], [typeof ClrTimeline, typeof ClrTimelineStep, typeof ClrTimelineStepDescription, typeof ClrTimelineStepHeader, typeof ClrTimelineStepTitle, typeof ClrIcon, typeof ClrSpinnerModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTimelineModule>;
}

declare class ClarityModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClarityModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClarityModule, never, [typeof ClrIcon], [typeof ClrEmphasisModule, typeof ClrDataModule, typeof ClrIcon, typeof ClrIconModule, typeof ClrModalModule, typeof ClrLoadingModule, typeof ClrConditionalModule, typeof ClrFocusOnViewInitModule, typeof ClrButtonModule, typeof ClrFormsModule, typeof ClrLayoutModule, typeof ClrPopoverModule, typeof ClrWizardModule, typeof ClrSidePanelModule, typeof ClrStepperModule, typeof ClrSpinnerModule, typeof ClrProgressBarModule, typeof ClrPopoverModuleNext, typeof ClrTimelineModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClarityModule>;
}

declare class DatagridPropertyStringFilter<T = any> implements ClrDatagridStringFilterInterface<T> {
    prop: string;
    exact: boolean;
    private nestedProp;
    constructor(prop: string, exact?: boolean);
    accepts(item: T, search: string): boolean;
}

declare class DatagridPropertyNumericFilter<T = any> implements ClrDatagridNumericFilterInterface<T> {
    prop: string;
    exact: boolean;
    private nestedProp;
    constructor(prop: string, exact?: boolean);
    accepts(item: T, low: number, high: number): boolean;
}

declare class DatagridPropertyComparator<T = any> implements ClrDatagridComparatorInterface<T> {
    prop: string;
    private nestedProp;
    constructor(prop: string);
    compare(a: T, b: T): number;
}

declare class IconHtmlPipe implements PipeTransform {
    private sanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(value: string): SafeHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<IconHtmlPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IconHtmlPipe, "iconHtml", true>;
}

/**
 * ClarityIcons is a static class that gives users the ability to interact with
 * the icon registry. This includes capabilities to add, retrieve, or alias icons
 * in the registry.
 *
 * @privateRemarks
 *
 * The icon registry is private to the module. There is no way to access it directly
 * outside of the module.
 *
 */
declare class ClarityIcons {
    /**
     * Returns a readonly reference of the icon registry.
     */
    static get registry(): Readonly<IconRegistry>;
    static addIcons(...shapes: IconShapeTuple[]): void;
    /**
     * @description
     * Use `addIcons` instead of `addAliases`
     *
     * This method is a backwords compatibility function to the old API
     *
     * The team will revisit this method for possible deprecation.
     */
    static addAliases(...aliases: IconAlias[]): void;
    static getIconNameFromShape(iconShape: IconShapeTuple): string;
}

declare function renderIcon(shapeOrStringIcon: IconShapeCollection | string): string | IconShapeCollection;

declare const unknownIconName = "unknown";
declare const unknownIcon: IconShapeTuple;

declare const angleIconName = "angle";
declare const angleIcon: IconShapeTuple;

declare const angleDoubleIconName = "angle-double";
declare const angleDoubleIcon: IconShapeTuple;

declare const arrowIconName = "arrow";
declare const arrowIcon: IconShapeTuple;

declare const barsIconName = "bars";
declare const barsIcon: IconShapeTuple;

declare const bellIconName = "bell";
declare const bellIcon: IconShapeTuple;

declare const calendarIconName = "calendar";
declare const calendarIcon: IconShapeTuple;

declare const checkIconName = "check";
declare const checkIcon: IconShapeTuple;

declare const checkCircleIconName = "check-circle";
declare const checkCircleIcon: IconShapeTuple;

declare const cloudIconName = "cloud";
declare const cloudIcon: IconShapeTuple;

declare const cogIconName = "cog";
declare const cogIcon: IconShapeTuple;

declare const ellipsisHorizontalIconName = "ellipsis-horizontal";
declare const ellipsisHorizontalIcon: IconShapeTuple;

declare const ellipsisVerticalIconName = "ellipsis-vertical";
declare const ellipsisVerticalIcon: IconShapeTuple;

declare const errorStandardIconName = "error-standard";
declare const errorStandardIcon: IconShapeTuple;

declare const eventIconName = "event";
declare const eventIcon: IconShapeTuple;

declare const exclamationCircleIconName = "exclamation-circle";
declare const exclamationCircleIcon: IconShapeTuple;

declare const exclamationTriangleIconName = "exclamation-triangle";
declare const exclamationTriangleIcon: IconShapeTuple;

declare const eyeIconName = "eye";
declare const eyeIcon: IconShapeTuple;

declare const eyeHideIconName = "eye-hide";
declare const eyeHideIcon: IconShapeTuple;

declare const filterGridIconName = "filter-grid";
declare const filterGridIcon: IconShapeTuple;

declare const filterGridCircleIconName = "filter-grid-circle";
declare const filterGridCircleIcon: IconShapeTuple;

declare const folderIconName = "folder";
declare const folderIcon: IconShapeTuple;

declare const folderOpenIconName = "folder-open";
declare const folderOpenIcon: IconShapeTuple;

declare const helpInfoIconName = "help-info";
declare const helpInfoIcon: IconShapeTuple;

declare const homeIconName = "home";
declare const homeIcon: IconShapeTuple;

declare const imageIconName = "image";
declare const imageIcon: IconShapeTuple;

declare const infoCircleIconName = "info-circle";
declare const infoCircleIcon: IconShapeTuple;

declare const infoStandardIconName = "info-standard";
declare const infoStandardIcon: IconShapeTuple;

declare const searchIconName = "search";
declare const searchIcon: IconShapeTuple;

declare const stepForward2IconName = "step-forward-2";
declare const stepForward2Icon: IconShapeTuple;

declare const successStandardIconName = "success-standard";
declare const successStandardIcon: IconShapeTuple;

declare const timesIconName = "times";
declare const timesIcon: IconShapeTuple;

declare const unknownStatusIconName = "unknown-status";
declare const unknownStatusIcon: IconShapeTuple;

declare const userIconName = "user";
declare const userIcon: IconShapeTuple;

declare const viewColumnsIconName = "view-columns";
declare const viewColumnsIcon: IconShapeTuple;

declare const vmBugIconName = "vm-bug";
declare const vmBugIcon: IconShapeTuple;

declare const vmBugInverseIconName = "vm-bug-inverse";
declare const vmBugInverseIcon: IconShapeTuple;

declare const warningStandardIconName = "warning-standard";
declare const warningStandardIcon: IconShapeTuple;

declare const detailExpandIconName = "detail-expand";
declare const detailExpandIcon: IconShapeTuple;

declare const detailCollapseIconName = "detail-collapse";
declare const detailCollapseIcon: IconShapeTuple;

declare const accessibility1IconName = "accessibility-1";
declare const accessibility1Icon: IconShapeTuple;

declare const accessibility2IconName = "accessibility-2";
declare const accessibility2Icon: IconShapeTuple;

declare const announcementIconName = "announcement";
declare const announcementIcon: IconShapeTuple;

declare const addTextIconName = "add-text";
declare const addTextIcon: IconShapeTuple;

declare const alarmClockIconName = "alarm-clock";
declare const alarmClockIcon: IconShapeTuple;

declare const alarmOffIconName = "alarm-off";
declare const alarmOffIcon: IconShapeTuple;

declare const asteriskIconName = "asterisk";
declare const asteriskIcon: IconShapeTuple;

declare const banIconName = "ban";
declare const banIcon: IconShapeTuple;

declare const betaIconName = "beta";
declare const betaIcon: IconShapeTuple;

declare const birthdayCakeIconName = "birthday-cake";
declare const birthdayCakeIcon: IconShapeTuple;

declare const boltIconName = "bolt";
declare const boltIcon: IconShapeTuple;

declare const bookIconName = "book";
declare const bookIcon: IconShapeTuple;

declare const briefcaseIconName = "briefcase";
declare const briefcaseIcon: IconShapeTuple;

declare const bubbleExclamationIconName = "bubble-exclamation";
declare const bubbleExclamationIcon: IconShapeTuple;

declare const bugIconName = "bug";
declare const bugIcon: IconShapeTuple;

declare const bullseyeIconName = "bullseye";
declare const bullseyeIcon: IconShapeTuple;

declare const childArrowIconName = "child-arrow";
declare const childArrowIcon: IconShapeTuple;

declare const circleIconName = "circle";
declare const circleIcon: IconShapeTuple;

declare const circleArrowIconName = "circle-arrow";
declare const circleArrowIcon: IconShapeTuple;

declare const clipboardIconName = "clipboard";
declare const clipboardIcon: IconShapeTuple;

declare const clockIconName = "clock";
declare const clockIcon: IconShapeTuple;

declare const cloneIconName = "clone";
declare const cloneIcon: IconShapeTuple;

declare const collapseCardIconName = "collapse-card";
declare const collapseCardIcon: IconShapeTuple;

declare const colorPaletteIconName = "color-palette";
declare const colorPaletteIcon: IconShapeTuple;

declare const colorPickerIconName = "color-picker";
declare const colorPickerIcon: IconShapeTuple;

declare const copyIconName = "copy";
declare const copyIcon: IconShapeTuple;

declare const copyToClipboardIconName = "copy-to-clipboard";
declare const copyToClipboardIcon: IconShapeTuple;

declare const crosshairsIconName = "crosshairs";
declare const crosshairsIcon: IconShapeTuple;

declare const cursorArrowIconName = "cursor-arrow";
declare const cursorArrowIcon: IconShapeTuple;

declare const cursorHandIconName = "cursor-hand";
declare const cursorHandIcon: IconShapeTuple;

declare const cursorHandClickIconName = "cursor-hand-click";
declare const cursorHandClickIcon: IconShapeTuple;

declare const cursorHandGrabIconName = "cursor-hand-grab";
declare const cursorHandGrabIcon: IconShapeTuple;

declare const cursorHandOpenIconName = "cursor-hand-open";
declare const cursorHandOpenIcon: IconShapeTuple;

declare const cursorMoveIconName = "cursor-move";
declare const cursorMoveIcon: IconShapeTuple;

declare const detailsIconName = "details";
declare const detailsIcon: IconShapeTuple;

declare const dotCircleIconName = "dot-circle";
declare const dotCircleIcon: IconShapeTuple;

declare const downloadIconName = "download";
declare const downloadIcon: IconShapeTuple;

declare const dragHandleIconName = "drag-handle";
declare const dragHandleIcon: IconShapeTuple;

declare const dragHandleCornerIconName = "drag-handle-corner";
declare const dragHandleCornerIcon: IconShapeTuple;

declare const eraserIconName = "eraser";
declare const eraserIcon: IconShapeTuple;

declare const expandCardIconName = "expand-card";
declare const expandCardIcon: IconShapeTuple;

declare const fileIconName = "file";
declare const fileIcon: IconShapeTuple;

declare const fileGroupIconName = "file-group";
declare const fileGroupIcon: IconShapeTuple;

declare const fileSettingsIconName = "file-settings";
declare const fileSettingsIcon: IconShapeTuple;

declare const fileZipIconName = "file-zip";
declare const fileZipIcon: IconShapeTuple;

declare const filterIconName = "filter";
declare const filterIcon: IconShapeTuple;

declare const filter2IconName = "filter-2";
declare const filter2Icon: IconShapeTuple;

declare const filterOffIconName = "filter-off";
declare const filterOffIcon: IconShapeTuple;

declare const firewallIconName = "firewall";
declare const firewallIcon: IconShapeTuple;

declare const firstAidIconName = "first-aid";
declare const firstAidIcon: IconShapeTuple;

declare const fishIconName = "fish";
declare const fishIcon: IconShapeTuple;

declare const flameIconName = "flame";
declare const flameIcon: IconShapeTuple;

declare const formIconName = "form";
declare const formIcon: IconShapeTuple;

declare const fuelIconName = "fuel";
declare const fuelIcon: IconShapeTuple;

declare const gavelIconName = "gavel";
declare const gavelIcon: IconShapeTuple;

declare const gridViewIconName = "grid-view";
declare const gridViewIcon: IconShapeTuple;

declare const helpIconName = "help";
declare const helpIcon: IconShapeTuple;

declare const historyIconName = "history";
declare const historyIcon: IconShapeTuple;

declare const hourglassIconName = "hourglass";
declare const hourglassIcon: IconShapeTuple;

declare const idBadgeIconName = "id-badge";
declare const idBadgeIcon: IconShapeTuple;

declare const keyIconName = "key";
declare const keyIcon: IconShapeTuple;

declare const landscapeIconName = "landscape";
declare const landscapeIcon: IconShapeTuple;

declare const launchpadIconName = "launchpad";
declare const launchpadIcon: IconShapeTuple;

declare const libraryIconName = "library";
declare const libraryIcon: IconShapeTuple;

declare const lightbulbIconName = "lightbulb";
declare const lightbulbIcon: IconShapeTuple;

declare const listIconName = "list";
declare const listIcon: IconShapeTuple;

declare const lockIconName = "lock";
declare const lockIcon: IconShapeTuple;

declare const loginIconName = "login";
declare const loginIcon: IconShapeTuple;

declare const logoutIconName = "logout";
declare const logoutIcon: IconShapeTuple;

declare const minusIconName = "minus";
declare const minusIcon: IconShapeTuple;

declare const minusCircleIconName = "minus-circle";
declare const minusCircleIcon: IconShapeTuple;

declare const moonIconName = "moon";
declare const moonIcon: IconShapeTuple;

declare const newIconName = "new";
declare const newIcon: IconShapeTuple;

declare const noAccessIconName = "no-access";
declare const noAccessIcon: IconShapeTuple;

declare const noteIconName = "note";
declare const noteIcon: IconShapeTuple;

declare const objectsIconName = "objects";
declare const objectsIcon: IconShapeTuple;

declare const organizationIconName = "organization";
declare const organizationIcon: IconShapeTuple;

declare const paperclipIconName = "paperclip";
declare const paperclipIcon: IconShapeTuple;

declare const pasteIconName = "paste";
declare const pasteIcon: IconShapeTuple;

declare const pencilIconName = "pencil";
declare const pencilIcon: IconShapeTuple;

declare const pinIconName = "pin";
declare const pinIcon: IconShapeTuple;

declare const pinboardIconName = "pinboard";
declare const pinboardIcon: IconShapeTuple;

declare const plusIconName = "plus";
declare const plusIcon: IconShapeTuple;

declare const plusCircleIconName = "plus-circle";
declare const plusCircleIcon: IconShapeTuple;

declare const popOutIconName = "pop-out";
declare const popOutIcon: IconShapeTuple;

declare const portraitIconName = "portrait";
declare const portraitIcon: IconShapeTuple;

declare const printerIconName = "printer";
declare const printerIcon: IconShapeTuple;

declare const recycleIconName = "recycle";
declare const recycleIcon: IconShapeTuple;

declare const redoIconName = "redo";
declare const redoIcon: IconShapeTuple;

declare const refreshIconName = "refresh";
declare const refreshIcon: IconShapeTuple;

declare const repeatIconName = "repeat";
declare const repeatIcon: IconShapeTuple;

declare const resizeIconName = "resize";
declare const resizeIcon: IconShapeTuple;

declare const scissorsIconName = "scissors";
declare const scissorsIcon: IconShapeTuple;

declare const scrollIconName = "scroll";
declare const scrollIcon: IconShapeTuple;

declare const shrinkIconName = "shrink";
declare const shrinkIcon: IconShapeTuple;

declare const sliderIconName = "slider";
declare const sliderIcon: IconShapeTuple;

declare const snowflakeIconName = "snowflake";
declare const snowflakeIcon: IconShapeTuple;

declare const sortByIconName = "sort-by";
declare const sortByIcon: IconShapeTuple;

declare const sunIconName = "sun";
declare const sunIcon: IconShapeTuple;

declare const switchIconName = "switch";
declare const switchIcon: IconShapeTuple;

declare const syncIconName = "sync";
declare const syncIcon: IconShapeTuple;

declare const tableIconName = "table";
declare const tableIcon: IconShapeTuple;

declare const tagIconName = "tag";
declare const tagIcon: IconShapeTuple;

declare const tagsIconName = "tags";
declare const tagsIcon: IconShapeTuple;

declare const targetIconName = "target";
declare const targetIcon: IconShapeTuple;

declare const thermometerIconName = "thermometer";
declare const thermometerIcon: IconShapeTuple;

declare const timelineIconName = "timeline";
declare const timelineIcon: IconShapeTuple;

declare const timesCircleIconName = "times-circle";
declare const timesCircleIcon: IconShapeTuple;

declare const toolsIconName = "tools";
declare const toolsIcon: IconShapeTuple;

declare const trashIconName = "trash";
declare const trashIcon: IconShapeTuple;

declare const treeIconName = "tree";
declare const treeIcon: IconShapeTuple;

declare const treeViewIconName = "tree-view";
declare const treeViewIcon: IconShapeTuple;

declare const twoWayArrowsIconName = "two-way-arrows";
declare const twoWayArrowsIcon: IconShapeTuple;

declare const undoIconName = "undo";
declare const undoIcon: IconShapeTuple;

declare const unpinIconName = "unpin";
declare const unpinIcon: IconShapeTuple;

declare const unlockIconName = "unlock";
declare const unlockIcon: IconShapeTuple;

declare const uploadIconName = "upload";
declare const uploadIcon: IconShapeTuple;

declare const usersIconName = "users";
declare const usersIcon: IconShapeTuple;

declare const viewCardsIconName = "view-cards";
declare const viewCardsIcon: IconShapeTuple;

declare const viewListIconName = "view-list";
declare const viewListIcon: IconShapeTuple;

declare const volumeIconName = "volume";
declare const volumeIcon: IconShapeTuple;

declare const wandIconName = "wand";
declare const wandIcon: IconShapeTuple;

declare const windowCloseIconName = "window-close";
declare const windowCloseIcon: IconShapeTuple;

declare const windowMaxIconName = "window-max";
declare const windowMaxIcon: IconShapeTuple;

declare const windowMinIconName = "window-min";
declare const windowMinIcon: IconShapeTuple;

declare const windowRestoreIconName = "window-restore";
declare const windowRestoreIcon: IconShapeTuple;

declare const worldIconName = "world";
declare const worldIcon: IconShapeTuple;

declare const wrenchIconName = "wrench";
declare const wrenchIcon: IconShapeTuple;

declare const zoomInIconName = "zoom-in";
declare const zoomInIcon: IconShapeTuple;

declare const zoomOutIconName = "zoom-out";
declare const zoomOutIcon: IconShapeTuple;

declare const axisChartIconName = "axis-chart";
declare const axisChartIcon: IconShapeTuple;

declare const barChartIconName = "bar-chart";
declare const barChartIcon: IconShapeTuple;

declare const bellCurveIconName = "bell-curve";
declare const bellCurveIcon: IconShapeTuple;

declare const boxPlotIconName = "box-plot";
declare const boxPlotIcon: IconShapeTuple;

declare const bubbleChartIconName = "bubble-chart";
declare const bubbleChartIcon: IconShapeTuple;

declare const cloudChartIconName = "cloud-chart";
declare const cloudChartIcon: IconShapeTuple;

declare const curveChartIconName = "curve-chart";
declare const curveChartIcon: IconShapeTuple;

declare const gridChartIconName = "grid-chart";
declare const gridChartIcon: IconShapeTuple;

declare const heatMapIconName = "heat-map";
declare const heatMapIcon: IconShapeTuple;

declare const lineChartIconName = "line-chart";
declare const lineChartIcon: IconShapeTuple;

declare const pieChartIconName = "pie-chart";
declare const pieChartIcon: IconShapeTuple;

declare const scatterPlotIconName = "scatter-plot";
declare const scatterPlotIcon: IconShapeTuple;

declare const tickChartIconName = "tick-chart";
declare const tickChartIcon: IconShapeTuple;

declare const bankIconName = "bank";
declare const bankIcon: IconShapeTuple;

declare const bitcoinIconName = "bitcoin";
declare const bitcoinIcon: IconShapeTuple;

declare const calculatorIconName = "calculator";
declare const calculatorIcon: IconShapeTuple;

declare const coinBagIconName = "coin-bag";
declare const coinBagIcon: IconShapeTuple;

declare const creditCardIconName = "credit-card";
declare const creditCardIcon: IconShapeTuple;

declare const dollarIconName = "dollar";
declare const dollarIcon: IconShapeTuple;

declare const dollarBillIconName = "dollar-bill";
declare const dollarBillIcon: IconShapeTuple;

declare const eCheckIconName = "e-check";
declare const eCheckIcon: IconShapeTuple;

declare const employeeIconName = "employee";
declare const employeeIcon: IconShapeTuple;

declare const employeeGroupIconName = "employee-group";
declare const employeeGroupIcon: IconShapeTuple;

declare const euroIconName = "euro";
declare const euroIcon: IconShapeTuple;

declare const factoryIconName = "factory";
declare const factoryIcon: IconShapeTuple;

declare const pesoIconName = "peso";
declare const pesoIcon: IconShapeTuple;

declare const piggyBankIconName = "piggy-bank";
declare const piggyBankIcon: IconShapeTuple;

declare const poundIconName = "pound";
declare const poundIcon: IconShapeTuple;

declare const rubleIconName = "ruble";
declare const rubleIcon: IconShapeTuple;

declare const rupeeIconName = "rupee";
declare const rupeeIcon: IconShapeTuple;

declare const shoppingBagIconName = "shopping-bag";
declare const shoppingBagIcon: IconShapeTuple;

declare const shoppingCartIconName = "shopping-cart";
declare const shoppingCartIcon: IconShapeTuple;

declare const storeIconName = "store";
declare const storeIcon: IconShapeTuple;

declare const walletIconName = "wallet";
declare const walletIcon: IconShapeTuple;

declare const wonIconName = "won";
declare const wonIcon: IconShapeTuple;

declare const yenIconName = "yen";
declare const yenIcon: IconShapeTuple;

declare const cameraIconName = "camera";
declare const cameraIcon: IconShapeTuple;

declare const fastForwardIconName = "fast-forward";
declare const fastForwardIcon: IconShapeTuple;

declare const filmStripIconName = "film-strip";
declare const filmStripIcon: IconShapeTuple;

declare const headphonesIconName = "headphones";
declare const headphonesIcon: IconShapeTuple;

declare const imageGalleryIconName = "image-gallery";
declare const imageGalleryIcon: IconShapeTuple;

declare const microphoneIconName = "microphone";
declare const microphoneIcon: IconShapeTuple;

declare const microphoneMuteIconName = "microphone-mute";
declare const microphoneMuteIcon: IconShapeTuple;

declare const musicNoteIconName = "music-note";
declare const musicNoteIcon: IconShapeTuple;

declare const pauseIconName = "pause";
declare const pauseIcon: IconShapeTuple;

declare const playIconName = "play";
declare const playIcon: IconShapeTuple;

declare const powerIconName = "power";
declare const powerIcon: IconShapeTuple;

declare const replayAllIconName = "replay-all";
declare const replayAllIcon: IconShapeTuple;

declare const replayOneIconName = "replay-one";
declare const replayOneIcon: IconShapeTuple;

declare const rewindIconName = "rewind";
declare const rewindIcon: IconShapeTuple;

declare const shuffleIconName = "shuffle";
declare const shuffleIcon: IconShapeTuple;

declare const stepForwardIconName = "step-forward";
declare const stepForwardIcon: IconShapeTuple;

declare const stopIconName = "stop";
declare const stopIcon: IconShapeTuple;

declare const videoCameraIconName = "video-camera";
declare const videoCameraIcon: IconShapeTuple;

declare const videoGalleryIconName = "video-gallery";
declare const videoGalleryIcon: IconShapeTuple;

declare const volumeDownIconName = "volume-down";
declare const volumeDownIcon: IconShapeTuple;

declare const volumeMuteIconName = "volume-mute";
declare const volumeMuteIcon: IconShapeTuple;

declare const volumeUpIconName = "volume-up";
declare const volumeUpIcon: IconShapeTuple;

declare const arrowMiniIconName = "arrow-mini";
declare const arrowMiniIcon: IconShapeTuple;

declare const calendarMiniIconName = "calendar-mini";
declare const calendarMiniIcon: IconShapeTuple;

declare const checkCircleMiniIconName = "check-circle-mini";
declare const checkCircleMiniIcon: IconShapeTuple;

declare const checkMiniIconName = "check-mini";
declare const checkMiniIcon: IconShapeTuple;

declare const errorMiniIconName = "error-mini";
declare const errorMiniIcon: IconShapeTuple;

declare const eventMiniIconName = "event-mini";
declare const eventMiniIcon: IconShapeTuple;

declare const filterGridCircleMiniIconName = "filter-grid-circle-mini";
declare const filterGridCircleMiniIcon: IconShapeTuple;

declare const filterGridMiniIconName = "filter-grid-mini";
declare const filterGridMiniIcon: IconShapeTuple;

declare const infoCircleMiniIconName = "info-circle-mini";
declare const infoCircleMiniIcon: IconShapeTuple;

declare const timesMiniIconName = "times-mini";
declare const timesMiniIcon: IconShapeTuple;

declare const warningMiniIconName = "warning-mini";
declare const warningMiniIcon: IconShapeTuple;

declare const administratorIconName = "administrator";
declare const administratorIcon: IconShapeTuple;

declare const animationIconName = "animation";
declare const animationIcon: IconShapeTuple;

declare const applicationIconName = "application";
declare const applicationIcon: IconShapeTuple;

declare const applicationsIconName = "applications";
declare const applicationsIcon: IconShapeTuple;

declare const archiveIconName = "archive";
declare const archiveIcon: IconShapeTuple;

declare const assignUserIconName = "assign-user";
declare const assignUserIcon: IconShapeTuple;

declare const atomIconName = "atom";
declare const atomIcon: IconShapeTuple;

declare const backupIconName = "backup";
declare const backupIcon: IconShapeTuple;

declare const backupRestoreIconName = "backup-restore";
declare const backupRestoreIcon: IconShapeTuple;

declare const barCodeIconName = "bar-code";
declare const barCodeIcon: IconShapeTuple;

declare const batteryIconName = "battery";
declare const batteryIcon: IconShapeTuple;

declare const blockIconName = "block";
declare const blockIcon: IconShapeTuple;

declare const blocksGroupIconName = "blocks-group";
declare const blocksGroupIcon: IconShapeTuple;

declare const bluetoothIconName = "bluetooth";
declare const bluetoothIcon: IconShapeTuple;

declare const bluetoothOffIconName = "bluetooth-off";
declare const bluetoothOffIcon: IconShapeTuple;

declare const buildingIconName = "building";
declare const buildingIcon: IconShapeTuple;

declare const bundleIconName = "bundle";
declare const bundleIcon: IconShapeTuple;

declare const capacitorIconName = "capacitor";
declare const capacitorIcon: IconShapeTuple;

declare const cdDvdIconName = "cd-dvd";
declare const cdDvdIcon: IconShapeTuple;

declare const certificateIconName = "certificate";
declare const certificateIcon: IconShapeTuple;

declare const ciCdIconName = "ci-cd";
declare const ciCdIcon: IconShapeTuple;

declare const cloudNetworkIconName = "cloud-network";
declare const cloudNetworkIcon: IconShapeTuple;

declare const cloudScaleIconName = "cloud-scale";
declare const cloudScaleIcon: IconShapeTuple;

declare const cloudTrafficIconName = "cloud-traffic";
declare const cloudTrafficIcon: IconShapeTuple;

declare const clusterIconName = "cluster";
declare const clusterIcon: IconShapeTuple;

declare const codeIconName = "code";
declare const codeIcon: IconShapeTuple;

declare const computerIconName = "computer";
declare const computerIcon: IconShapeTuple;

declare const connectIconName = "connect";
declare const connectIcon: IconShapeTuple;

declare const containerIconName = "container";
declare const containerIcon: IconShapeTuple;

declare const containerGroupIconName = "container-group";
declare const containerGroupIcon: IconShapeTuple;

declare const containerVolumeIconName = "container-volume";
declare const containerVolumeIcon: IconShapeTuple;

declare const controlLunIconName = "control-lun";
declare const controlLunIcon: IconShapeTuple;

declare const cpuIconName = "cpu";
declare const cpuIcon: IconShapeTuple;

declare const dashboardIconName = "dashboard";
declare const dashboardIcon: IconShapeTuple;

declare const dataClusterIconName = "data-cluster";
declare const dataClusterIcon: IconShapeTuple;

declare const deployIconName = "deploy";
declare const deployIcon: IconShapeTuple;

declare const devicesIconName = "devices";
declare const devicesIcon: IconShapeTuple;

declare const digitalSignatureIconName = "digital-signature";
declare const digitalSignatureIcon: IconShapeTuple;

declare const disconnectIconName = "disconnect";
declare const disconnectIcon: IconShapeTuple;

declare const displayIconName = "display";
declare const displayIcon: IconShapeTuple;

declare const downloadCloudIconName = "download-cloud";
declare const downloadCloudIcon: IconShapeTuple;

declare const exportIconName = "export";
declare const exportIcon: IconShapeTuple;

declare const fileShare2IconName = "file-share-2";
declare const fileShare2Icon: IconShapeTuple;

declare const fileShareIconName = "file-share";
declare const fileShareIcon: IconShapeTuple;

declare const flaskIconName = "flask";
declare const flaskIcon: IconShapeTuple;

declare const floppyIconName = "floppy";
declare const floppyIcon: IconShapeTuple;

declare const forkingIconName = "forking";
declare const forkingIcon: IconShapeTuple;

declare const hardDiskIconName = "hard-disk";
declare const hardDiskIcon: IconShapeTuple;

declare const hardDriveDisksIconName = "hard-drive-disks";
declare const hardDriveDisksIcon: IconShapeTuple;

declare const hardDriveIconName = "hard-drive";
declare const hardDriveIcon: IconShapeTuple;

declare const helixIconName = "helix";
declare const helixIcon: IconShapeTuple;

declare const hostGroupIconName = "host-group";
declare const hostGroupIcon: IconShapeTuple;

declare const hostIconName = "host";
declare const hostIcon: IconShapeTuple;

declare const importIconName = "import";
declare const importIcon: IconShapeTuple;

declare const inductorIconName = "inductor";
declare const inductorIcon: IconShapeTuple;

declare const installIconName = "install";
declare const installIcon: IconShapeTuple;

declare const internetOfThingsIconName = "internet-of-things";
declare const internetOfThingsIcon: IconShapeTuple;

declare const keyboardIconName = "keyboard";
declare const keyboardIcon: IconShapeTuple;

declare const layersIconName = "layers";
declare const layersIcon: IconShapeTuple;

declare const linkIconName = "link";
declare const linkIcon: IconShapeTuple;

declare const mediaChangerIconName = "media-changer";
declare const mediaChangerIcon: IconShapeTuple;

declare const memoryIconName = "memory";
declare const memoryIcon: IconShapeTuple;

declare const mobileIconName = "mobile";
declare const mobileIcon: IconShapeTuple;

declare const mouseIconName = "mouse";
declare const mouseIcon: IconShapeTuple;

declare const namespaceIconName = "namespace";
declare const namespaceIcon: IconShapeTuple;

declare const networkGlobeIconName = "network-globe";
declare const networkGlobeIcon: IconShapeTuple;

declare const networkSettingsIconName = "network-settings";
declare const networkSettingsIcon: IconShapeTuple;

declare const networkSwitchIconName = "network-switch";
declare const networkSwitchIcon: IconShapeTuple;

declare const nodeGroupIconName = "node-group";
declare const nodeGroupIcon: IconShapeTuple;

declare const nodeIconName = "node";
declare const nodeIcon: IconShapeTuple;

declare const nodesIconName = "nodes";
declare const nodesIcon: IconShapeTuple;

declare const noWifiIconName = "no-wifi";
declare const noWifiIcon: IconShapeTuple;

declare const nvmeIconName = "nvme";
declare const nvmeIcon: IconShapeTuple;

declare const pdfFileIconName = "pdf-file";
declare const pdfFileIcon: IconShapeTuple;

declare const phoneHandsetIconName = "phone-handset";
declare const phoneHandsetIcon: IconShapeTuple;

declare const pluginIconName = "plugin";
declare const pluginIcon: IconShapeTuple;

declare const podIconName = "pod";
declare const podIcon: IconShapeTuple;

declare const processOnVmIconName = "process-on-vm";
declare const processOnVmIcon: IconShapeTuple;

declare const qrCodeIconName = "qr-code";
declare const qrCodeIcon: IconShapeTuple;

declare const rackServerIconName = "rack-server";
declare const rackServerIcon: IconShapeTuple;

declare const radarIconName = "radar";
declare const radarIcon: IconShapeTuple;

declare const resistorIconName = "resistor";
declare const resistorIcon: IconShapeTuple;

declare const resourcePoolIconName = "resource-pool";
declare const resourcePoolIcon: IconShapeTuple;

declare const routerIconName = "router";
declare const routerIcon: IconShapeTuple;

declare const rulerPencilIconName = "ruler-pencil";
declare const rulerPencilIcon: IconShapeTuple;

declare const scriptExecuteIconName = "script-execute";
declare const scriptExecuteIcon: IconShapeTuple;

declare const scriptScheduleIconName = "script-schedule";
declare const scriptScheduleIcon: IconShapeTuple;

declare const shieldCheckIconName = "shield-check";
declare const shieldCheckIcon: IconShapeTuple;

declare const shieldIconName = "shield";
declare const shieldIcon: IconShapeTuple;

declare const shieldXIconName = "shield-x";
declare const shieldXIcon: IconShapeTuple;

declare const squidIconName = "squid";
declare const squidIcon: IconShapeTuple;

declare const ssdIconName = "ssd";
declare const ssdIcon: IconShapeTuple;

declare const storageAdapterIconName = "storage-adapter";
declare const storageAdapterIcon: IconShapeTuple;

declare const storageIconName = "storage";
declare const storageIcon: IconShapeTuple;

declare const tabletIconName = "tablet";
declare const tabletIcon: IconShapeTuple;

declare const tapeDriveIconName = "tape-drive";
declare const tapeDriveIcon: IconShapeTuple;

declare const terminalIconName = "terminal";
declare const terminalIcon: IconShapeTuple;

declare const thinClientIconName = "thin-client";
declare const thinClientIcon: IconShapeTuple;

declare const unarchiveIconName = "unarchive";
declare const unarchiveIcon: IconShapeTuple;

declare const uninstallIconName = "uninstall";
declare const uninstallIcon: IconShapeTuple;

declare const unlinkIconName = "unlink";
declare const unlinkIcon: IconShapeTuple;

declare const updateIconName = "update";
declare const updateIcon: IconShapeTuple;

declare const uploadCloudIconName = "upload-cloud";
declare const uploadCloudIcon: IconShapeTuple;

declare const usbIconName = "usb";
declare const usbIcon: IconShapeTuple;

declare const vmIconName = "vm";
declare const vmIcon: IconShapeTuple;

declare const vmwAppIconName = "vmw-app";
declare const vmwAppIcon: IconShapeTuple;

declare const wifiIconName = "wifi";
declare const wifiIcon: IconShapeTuple;

declare const xlsFileIconName = "xls-file";
declare const xlsFileIcon: IconShapeTuple;

declare const bookmarkIconName = "bookmark";
declare const bookmarkIcon: IconShapeTuple;

declare const chatBubbleIconName = "chat-bubble";
declare const chatBubbleIcon: IconShapeTuple;

declare const contractIconName = "contract";
declare const contractIcon: IconShapeTuple;

declare const crownIconName = "crown";
declare const crownIcon: IconShapeTuple;

declare const envelopeIconName = "envelope";
declare const envelopeIcon: IconShapeTuple;

declare const flagIconName = "flag";
declare const flagIcon: IconShapeTuple;

declare const halfStarIconName = "half-star";
declare const halfStarIcon: IconShapeTuple;

declare const happyFaceIconName = "happy-face";
declare const happyFaceIcon: IconShapeTuple;

declare const hashtagIconName = "hashtag";
declare const hashtagIcon: IconShapeTuple;

declare const heartIconName = "heart";
declare const heartIcon: IconShapeTuple;

declare const heartBrokenIconName = "heart-broken";
declare const heartBrokenIcon: IconShapeTuple;

declare const inboxIconName = "inbox";
declare const inboxIcon: IconShapeTuple;

declare const neutralFaceIconName = "neutral-face";
declare const neutralFaceIcon: IconShapeTuple;

declare const pictureIconName = "picture";
declare const pictureIcon: IconShapeTuple;

declare const sadFaceIconName = "sad-face";
declare const sadFaceIcon: IconShapeTuple;

declare const shareIconName = "share";
declare const shareIcon: IconShapeTuple;

declare const starIconName = "star";
declare const starIcon: IconShapeTuple;

declare const talkBubblesIconName = "talk-bubbles";
declare const talkBubblesIcon: IconShapeTuple;

declare const tasksIconName = "tasks";
declare const tasksIcon: IconShapeTuple;

declare const thumbsDownIconName = "thumbs-down";
declare const thumbsDownIcon: IconShapeTuple;

declare const thumbsUpIconName = "thumbs-up";
declare const thumbsUpIcon: IconShapeTuple;

declare const alignBottomIconName = "align-bottom";
declare const alignBottomIcon: IconShapeTuple;

declare const alignCenterIconName = "align-center";
declare const alignCenterIcon: IconShapeTuple;

declare const alignLeftIconName = "align-left";
declare const alignLeftIcon: IconShapeTuple;

declare const alignLeftTextIconName = "align-left-text";
declare const alignLeftTextIcon: IconShapeTuple;

declare const alignMiddleIconName = "align-middle";
declare const alignMiddleIcon: IconShapeTuple;

declare const alignRightIconName = "align-right";
declare const alignRightIcon: IconShapeTuple;

declare const alignRightTextIconName = "align-right-text";
declare const alignRightTextIcon: IconShapeTuple;

declare const alignTopIconName = "align-top";
declare const alignTopIcon: IconShapeTuple;

declare const blockQuoteIconName = "block-quote";
declare const blockQuoteIcon: IconShapeTuple;

declare const boldIconName = "bold";
declare const boldIcon: IconShapeTuple;

declare const bulletListIconName = "bullet-list";
declare const bulletListIcon: IconShapeTuple;

declare const centerTextIconName = "center-text";
declare const centerTextIcon: IconShapeTuple;

declare const checkboxListIconName = "checkbox-list";
declare const checkboxListIcon: IconShapeTuple;

declare const fontSizeIconName = "font-size";
declare const fontSizeIcon: IconShapeTuple;

declare const highlighterIconName = "highlighter";
declare const highlighterIcon: IconShapeTuple;

declare const indentIconName = "indent";
declare const indentIcon: IconShapeTuple;

declare const italicIconName = "italic";
declare const italicIcon: IconShapeTuple;

declare const justifyTextIconName = "justify-text";
declare const justifyTextIcon: IconShapeTuple;

declare const languageIconName = "language";
declare const languageIcon: IconShapeTuple;

declare const numberListIconName = "number-list";
declare const numberListIcon: IconShapeTuple;

declare const outdentIconName = "outdent";
declare const outdentIcon: IconShapeTuple;

declare const paintRollerIconName = "paint-roller";
declare const paintRollerIcon: IconShapeTuple;

declare const strikethroughIconName = "strikethrough";
declare const strikethroughIcon: IconShapeTuple;

declare const subscriptIconName = "subscript";
declare const subscriptIcon: IconShapeTuple;

declare const superscriptIconName = "superscript";
declare const superscriptIcon: IconShapeTuple;

declare const textIconName = "text";
declare const textIcon: IconShapeTuple;

declare const textColorIconName = "text-color";
declare const textColorIcon: IconShapeTuple;

declare const underlineIconName = "underline";
declare const underlineIcon: IconShapeTuple;

declare const airplaneIconName = "airplane";
declare const airplaneIcon: IconShapeTuple;

declare const bicycleIconName = "bicycle";
declare const bicycleIcon: IconShapeTuple;

declare const boatIconName = "boat";
declare const boatIcon: IconShapeTuple;

declare const campervanIconName = "campervan";
declare const campervanIcon: IconShapeTuple;

declare const carIconName = "car";
declare const carIcon: IconShapeTuple;

declare const caravanIconName = "caravan";
declare const caravanIcon: IconShapeTuple;

declare const compassIconName = "compass";
declare const compassIcon: IconShapeTuple;

declare const ferryIconName = "ferry";
declare const ferryIcon: IconShapeTuple;

declare const mapIconName = "map";
declare const mapIcon: IconShapeTuple;

declare const mapMarkerIconName = "map-marker";
declare const mapMarkerIcon: IconShapeTuple;

declare const onHolidayIconName = "on-holiday";
declare const onHolidayIcon: IconShapeTuple;

declare const trailerIconName = "trailer";
declare const trailerIcon: IconShapeTuple;

declare const truckIconName = "truck";
declare const truckIcon: IconShapeTuple;

declare const chartCollectionIcons: IconShapeTuple[];
declare const chartCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadChartIconSet } from '@clr/angular';
 *
 * loadChartIconSet();
 * ```
 *
 */
declare function loadChartIconSet(): void;

declare const commerceCollectionIcons: IconShapeTuple[];
declare const commerceCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadCommerceIconSet } from '@clr/angular';
 *
 * loadCommerceIconSet();
 * ```
 *
 */
declare function loadCommerceIconSet(): void;

declare const coreCollectionIcons: IconShapeTuple[];
declare const coreCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadCoreIconSet } from '@clr/angular';
 *
 * loadCoreIconSet();
 * ```
 *
 */
declare function loadCoreIconSet(): void;

declare const essentialCollectionIcons: IconShapeTuple[];
declare const essentialCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadEssentialIconSet } from '@clr/angular';
 *
 * loadEssentialIconSet();
 * ```
 *
 */
declare function loadEssentialIconSet(): void;

declare const mediaCollectionIcons: IconShapeTuple[];
declare const mediaCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadMediaIconSet } from '@clr/angular';
 *
 * loadMediaIconSet();
 * ```
 *
 */
declare function loadMediaIconSet(): void;

declare const miniCollectionIcons: IconShapeTuple[];
declare const miniCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the mini icon set.
 *
 * ```typescript@clr/angular';
 *
 * loadMiniIconSet();
 * ```
 *
 */
declare function loadMiniIconSet(): void;

declare const technologyCollectionIcons: IconShapeTuple[];
declare const technologyCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTechnologyIconSet } from '@clr/angular';
 *
 * loadTechnologyIconSet();
 * ```
 *
 */
declare function loadTechnologyIconSet(): void;

declare const socialCollectionIcons: IconShapeTuple[];
declare const socialCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadSocialIconSet } from '@clr/angular';
 *
 * loadSocialIconSet();
 * ```
 *
 */
declare function loadSocialIconSet(): void;

declare const textEditCollectionIcons: IconShapeTuple[];
declare const textEditCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTextEditIconSet } from '@clr/angular';
 *
 * loadTextEditIconSet();
 * ```
 *
 */
declare function loadTextEditIconSet(): void;

declare const travelCollectionIcons: IconShapeTuple[];
declare const travelCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTravelIconSet } from '@clr/angular';
 *
 * loadTravelIconSet();
 * ```
 *
 */
declare function loadTravelIconSet(): void;

export { BaseExpandableAnimation, CHANGE_KEYS, CLR_ALERT_DIRECTIVES, CLR_BUTTON_GROUP_DIRECTIVES, CLR_DATAGRID_DIRECTIVES, CLR_DATEPICKER_DIRECTIVES, CLR_DROPDOWN_DIRECTIVES, CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, CLR_ICON_DIRECTIVES, CLR_LAYOUT_DIRECTIVES, CLR_LOADING_BUTTON_DIRECTIVES, CLR_LOADING_DIRECTIVES, CLR_MENU_POSITIONS, CLR_MODAL_DIRECTIVES, CLR_NAVIGATION_DIRECTIVES, CLR_PROGRESS_BAR_DIRECTIVES, CLR_SIDEPANEL_DIRECTIVES, CLR_SIGNPOST_DIRECTIVES, CLR_SPINNER_DIRECTIVES, CLR_STACK_VIEW_DIRECTIVES, CLR_TABS_DIRECTIVES, CLR_TOOLTIP_DIRECTIVES, CLR_TREE_VIEW_DIRECTIVES, CLR_VERTICAL_NAV_DIRECTIVES, CLR_WIZARD_DIRECTIVES, CONDITIONAL_DIRECTIVES, CUSTOM_BUTTON_TYPES, CdsIconCustomTag, ClarityIcons, ClarityModule, ClrAbstractContainer, ClrAccordion, ClrAccordionContent, ClrAccordionDescription, ClrAccordionModule, ClrAccordionPanel, ClrAccordionTitle, ClrAlert, ClrAlertItem, ClrAlertModule, ClrAlertText, ClrAlerts, ClrAlertsPager, ClrAriaCurrentLink, ClrBadge, ClrBadgeColors, ClrBreadcrumbItem, ClrBreadcrumbs, ClrBreadcrumbsModule, ClrButton, ClrButtonGroup, ClrButtonGroupModule, ClrButtonModule, ClrCalendar, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxModule, ClrCheckboxWrapper, ClrCombobox, ClrComboboxContainer, ClrComboboxModule, ClrCommonFormsModule, ClrCommonStringsService, ClrConditionalModule, ClrControl, ClrControlContainer, ClrControlError, ClrControlHelper, ClrControlLabel, ClrControlSuccess, ClrDataModule, ClrDatagrid, ClrDatagridActionBar, ClrDatagridActionOverflow, ClrDatagridCell, ClrDatagridColumn, ClrDatagridColumnSeparator, ClrDatagridColumnToggle, ClrDatagridColumnToggleButton, ClrDatagridDetail, ClrDatagridDetailBody, ClrDatagridDetailHeader, ClrDatagridFilter, ClrDatagridFooter, ClrDatagridHideableColumn, ClrDatagridItems, ClrDatagridModule, ClrDatagridPageSize, ClrDatagridPagination, ClrDatagridPlaceholder, ClrDatagridRow, ClrDatagridRowDetail, ClrDatagridSortOrder, ClrDatalist, ClrDatalistContainer, ClrDatalistInput, ClrDatalistModule, ClrDateContainer, ClrDateInput, ClrDateInputBase, ClrDateInputValidator, ClrDatepickerActions, ClrDatepickerModule, ClrDatepickerViewManager, ClrDay, ClrDaypicker, ClrDestroyService, ClrDropdown, ClrDropdownItem, ClrDropdownMenu, ClrDropdownModule, ClrDropdownTrigger, ClrEmphasisModule, ClrEndDateInput, ClrEndDateInputValidator, ClrExpandableAnimation, ClrFileError, ClrFileInfo, ClrFileInput, ClrFileInputContainer, ClrFileInputModule, ClrFileInputValidator, ClrFileInputValueAccessor, ClrFileList, ClrFileMessagesTemplate, ClrFileSuccess, ClrFocusOnViewInit, ClrFocusOnViewInitModule, ClrForm, ClrFormLayout, ClrFormsModule, ClrHeader, ClrIcon, ClrIconCustomTag, ClrIconModule, ClrIfActive, ClrIfDetail, ClrIfError, ClrIfExpanded, ClrIfOpen, ClrIfSuccess, ClrInput, ClrInputContainer, ClrInputModule, ClrLabel, ClrLabelColors, ClrLayout, ClrLayoutModule, ClrLoading, ClrLoadingButton, ClrLoadingButtonModule, ClrLoadingModule, ClrLoadingState, ClrMainContainer, ClrMainContainerModule, ClrModal, ClrModalBody, ClrModalConfigurationService, ClrModalHostComponent, ClrModalModule, ClrMonthpicker, ClrNavLevel, ClrNavigationModule, ClrNumberInput, ClrNumberInputContainer, ClrNumberInputModule, ClrOption, ClrOptionGroup, ClrOptionItems, ClrOptionSelected, ClrOptions, ClrPassword, ClrPasswordContainer, ClrPasswordModule, ClrPopoverAnchor, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModule, ClrPopoverService, ClrProgressBar, ClrProgressBarModule, ClrRadio, ClrRadioContainer, ClrRadioModule, ClrRadioWrapper, ClrRange, ClrRangeContainer, ClrRangeModule, ClrRecursiveForOf, ClrSelect, ClrSelectContainer, ClrSelectModule, ClrSelectedState, ClrSidePanel, ClrSidePanelModule, ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTitle, ClrSignpostTrigger, ClrSpinner, ClrSpinnerModule, ClrStackBlock, ClrStackContentInput, ClrStackHeader, ClrStackView, ClrStackViewCustomTags, ClrStackViewLabel, ClrStackViewModule, ClrStandaloneCdkTrapFocus, ClrStartDateInput, ClrStartDateInputValidator, ClrStepButton, ClrStepButtonType, ClrStepper, ClrStepperModule, ClrStepperPanel, ClrStopEscapePropagationDirective, ClrTab, ClrTabAction, ClrTabContent, ClrTabLink, ClrTabOverflowContent, ClrTabs, ClrTabsActions, ClrTabsModule, ClrTextarea, ClrTextareaContainer, ClrTextareaModule, ClrTimeline, ClrTimelineLayout, ClrTimelineModule, ClrTimelineStep, ClrTimelineStepDescription, ClrTimelineStepHeader, ClrTimelineStepState, ClrTimelineStepTitle, ClrTooltip, ClrTooltipContent, ClrTooltipModule, ClrTooltipTrigger, ClrTree, ClrTreeNode, ClrTreeNodeLink, ClrTreeViewModule, ClrVerticalNav, ClrVerticalNavGroup, ClrVerticalNavGroupChildren, ClrVerticalNavIcon, ClrVerticalNavLink, ClrVerticalNavModule, ClrWizard, ClrWizardButton, ClrWizardHeaderAction, ClrWizardModule, ClrWizardPage, ClrWizardPageButtons, ClrWizardPageHeaderActions, ClrWizardPageNavTitle, ClrWizardPageTitle, ClrWizardStepnav, ClrWizardStepnavItem, ClrWizardTitle, ClrYearpicker, DEFAULT_BUTTON_TYPES, DatagridNumericFilter, DatagridPropertyComparator, DatagridPropertyNumericFilter, DatagridPropertyStringFilter, DatagridStringFilter, EXPANDABLE_ANIMATION_DIRECTIVES, FOCUS_ON_VIEW_INIT, FOCUS_ON_VIEW_INIT_DIRECTIVES, IS_TOGGLE, IS_TOGGLE_PROVIDER, IconHtmlPipe, LoadingListener, MainContainerWillyWonka, NavDetectionOompaLoompa, Selection, TOGGLE_SERVICE, TOGGLE_SERVICE_PROVIDER, ToggleServiceFactory, WrappedFormControl, accessibility1Icon, accessibility1IconName, accessibility2Icon, accessibility2IconName, addTextIcon, addTextIconName, administratorIcon, administratorIconName, airplaneIcon, airplaneIconName, alarmClockIcon, alarmClockIconName, alarmOffIcon, alarmOffIconName, alignBottomIcon, alignBottomIconName, alignCenterIcon, alignCenterIconName, alignLeftIcon, alignLeftIconName, alignLeftTextIcon, alignLeftTextIconName, alignMiddleIcon, alignMiddleIconName, alignRightIcon, alignRightIconName, alignRightTextIcon, alignRightTextIconName, alignTopIcon, alignTopIconName, angleDoubleIcon, angleDoubleIconName, angleIcon, angleIconName, animationIcon, animationIconName, announcementIcon, announcementIconName, applicationIcon, applicationIconName, applicationsIcon, applicationsIconName, archiveIcon, archiveIconName, arrowIcon, arrowIconName, arrowMiniIcon, arrowMiniIconName, assignUserIcon, assignUserIconName, asteriskIcon, asteriskIconName, atomIcon, atomIconName, axisChartIcon, axisChartIconName, backupIcon, backupIconName, backupRestoreIcon, backupRestoreIconName, banIcon, banIconName, bankIcon, bankIconName, barChartIcon, barChartIconName, barCodeIcon, barCodeIconName, barsIcon, barsIconName, batteryIcon, batteryIconName, bellCurveIcon, bellCurveIconName, bellIcon, bellIconName, betaIcon, betaIconName, bicycleIcon, bicycleIconName, birthdayCakeIcon, birthdayCakeIconName, bitcoinIcon, bitcoinIconName, blockIcon, blockIconName, blockQuoteIcon, blockQuoteIconName, blocksGroupIcon, blocksGroupIconName, bluetoothIcon, bluetoothIconName, bluetoothOffIcon, bluetoothOffIconName, boatIcon, boatIconName, boldIcon, boldIconName, boltIcon, boltIconName, bookIcon, bookIconName, bookmarkIcon, bookmarkIconName, boxPlotIcon, boxPlotIconName, briefcaseIcon, briefcaseIconName, bubbleChartIcon, bubbleChartIconName, bubbleExclamationIcon, bubbleExclamationIconName, bugIcon, bugIconName, buildingIcon, buildingIconName, bulletListIcon, bulletListIconName, bullseyeIcon, bullseyeIconName, bundleIcon, bundleIconName, calculatorIcon, calculatorIconName, calendarIcon, calendarIconName, calendarMiniIcon, calendarMiniIconName, cameraIcon, cameraIconName, campervanIcon, campervanIconName, capacitorIcon, capacitorIconName, carIcon, carIconName, caravanIcon, caravanIconName, cdDvdIcon, cdDvdIconName, centerTextIcon, centerTextIconName, certificateIcon, certificateIconName, chartCollectionAliases, chartCollectionIcons, chatBubbleIcon, chatBubbleIconName, checkCircleIcon, checkCircleIconName, checkCircleMiniIcon, checkCircleMiniIconName, checkIcon, checkIconName, checkMiniIcon, checkMiniIconName, checkboxListIcon, checkboxListIconName, childArrowIcon, childArrowIconName, ciCdIcon, ciCdIconName, circleArrowIcon, circleArrowIconName, circleIcon, circleIconName, clipboardIcon, clipboardIconName, clockIcon, clockIconName, cloneIcon, cloneIconName, cloudChartIcon, cloudChartIconName, cloudIcon, cloudIconName, cloudNetworkIcon, cloudNetworkIconName, cloudScaleIcon, cloudScaleIconName, cloudTrafficIcon, cloudTrafficIconName, clusterIcon, clusterIconName, codeIcon, codeIconName, cogIcon, cogIconName, coinBagIcon, coinBagIconName, collapse, collapseCardIcon, collapseCardIconName, colorPaletteIcon, colorPaletteIconName, colorPickerIcon, colorPickerIconName, commerceCollectionAliases, commerceCollectionIcons, commonStringsDefault, compassIcon, compassIconName, computerIcon, computerIconName, connectIcon, connectIconName, containerGroupIcon, containerGroupIconName, containerIcon, containerIconName, containerVolumeIcon, containerVolumeIconName, contractIcon, contractIconName, controlLunIcon, controlLunIconName, copyIcon, copyIconName, copyToClipboardIcon, copyToClipboardIconName, coreCollectionAliases, coreCollectionIcons, cpuIcon, cpuIconName, creditCardIcon, creditCardIconName, crosshairsIcon, crosshairsIconName, crownIcon, crownIconName, cursorArrowIcon, cursorArrowIconName, cursorHandClickIcon, cursorHandClickIconName, cursorHandGrabIcon, cursorHandGrabIconName, cursorHandIcon, cursorHandIconName, cursorHandOpenIcon, cursorHandOpenIconName, cursorMoveIcon, cursorMoveIconName, curveChartIcon, curveChartIconName, dashboardIcon, dashboardIconName, dataClusterIcon, dataClusterIconName, deployIcon, deployIconName, detailCollapseIcon, detailCollapseIconName, detailExpandIcon, detailExpandIconName, detailsIcon, detailsIconName, devicesIcon, devicesIconName, digitalSignatureIcon, digitalSignatureIconName, disconnectIcon, disconnectIconName, displayIcon, displayIconName, dollarBillIcon, dollarBillIconName, dollarIcon, dollarIconName, dotCircleIcon, dotCircleIconName, downloadCloudIcon, downloadCloudIconName, downloadIcon, downloadIconName, dragHandleCornerIcon, dragHandleCornerIconName, dragHandleIcon, dragHandleIconName, eCheckIcon, eCheckIconName, ellipsisHorizontalIcon, ellipsisHorizontalIconName, ellipsisVerticalIcon, ellipsisVerticalIconName, employeeGroupIcon, employeeGroupIconName, employeeIcon, employeeIconName, envelopeIcon, envelopeIconName, eraserIcon, eraserIconName, errorMiniIcon, errorMiniIconName, errorStandardIcon, errorStandardIconName, essentialCollectionAliases, essentialCollectionIcons, euroIcon, euroIconName, eventIcon, eventIconName, eventMiniIcon, eventMiniIconName, exclamationCircleIcon, exclamationCircleIconName, exclamationTriangleIcon, exclamationTriangleIconName, expandCardIcon, expandCardIconName, exportIcon, exportIconName, eyeHideIcon, eyeHideIconName, eyeIcon, eyeIconName, factoryIcon, factoryIconName, fade, fadeSlide, fastForwardIcon, fastForwardIconName, ferryIcon, ferryIconName, fileGroupIcon, fileGroupIconName, fileIcon, fileIconName, fileSettingsIcon, fileSettingsIconName, fileShare2Icon, fileShare2IconName, fileShareIcon, fileShareIconName, fileZipIcon, fileZipIconName, filmStripIcon, filmStripIconName, filter2Icon, filter2IconName, filterGridCircleIcon, filterGridCircleIconName, filterGridCircleMiniIcon, filterGridCircleMiniIconName, filterGridIcon, filterGridIconName, filterGridMiniIcon, filterGridMiniIconName, filterIcon, filterIconName, filterOffIcon, filterOffIconName, firewallIcon, firewallIconName, firstAidIcon, firstAidIconName, fishIcon, fishIconName, flagIcon, flagIconName, flameIcon, flameIconName, flaskIcon, flaskIconName, floppyIcon, floppyIconName, folderIcon, folderIconName, folderOpenIcon, folderOpenIconName, fontSizeIcon, fontSizeIconName, forkingIcon, forkingIconName, formIcon, formIconName, fuelIcon, fuelIconName, gavelIcon, gavelIconName, gridChartIcon, gridChartIconName, gridViewIcon, gridViewIconName, halfStarIcon, halfStarIconName, happyFaceIcon, happyFaceIconName, hardDiskIcon, hardDiskIconName, hardDriveDisksIcon, hardDriveDisksIconName, hardDriveIcon, hardDriveIconName, hashtagIcon, hashtagIconName, headphonesIcon, headphonesIconName, heartBrokenIcon, heartBrokenIconName, heartIcon, heartIconName, heatMapIcon, heatMapIconName, helixIcon, helixIconName, helpIcon, helpIconName, helpInfoIcon, helpInfoIconName, highlighterIcon, highlighterIconName, historyIcon, historyIconName, homeIcon, homeIconName, hostGroupIcon, hostGroupIconName, hostIcon, hostIconName, hourglassIcon, hourglassIconName, idBadgeIcon, idBadgeIconName, imageGalleryIcon, imageGalleryIconName, imageIcon, imageIconName, importIcon, importIconName, inboxIcon, inboxIconName, indentIcon, indentIconName, inductorIcon, inductorIconName, infoCircleIcon, infoCircleIconName, infoCircleMiniIcon, infoCircleMiniIconName, infoStandardIcon, infoStandardIconName, installIcon, installIconName, internetOfThingsIcon, internetOfThingsIconName, isToggleFactory, italicIcon, italicIconName, justifyTextIcon, justifyTextIconName, keyIcon, keyIconName, keyboardIcon, keyboardIconName, landscapeIcon, landscapeIconName, languageIcon, languageIconName, launchpadIcon, launchpadIconName, layersIcon, layersIconName, libraryIcon, libraryIconName, lightbulbIcon, lightbulbIconName, lineChartIcon, lineChartIconName, linkIcon, linkIconName, listIcon, listIconName, loadChartIconSet, loadCommerceIconSet, loadCoreIconSet, loadEssentialIconSet, loadMediaIconSet, loadMiniIconSet, loadSocialIconSet, loadTechnologyIconSet, loadTextEditIconSet, loadTravelIconSet, lockIcon, lockIconName, loginIcon, loginIconName, logoutIcon, logoutIconName, mapIcon, mapIconName, mapMarkerIcon, mapMarkerIconName, mediaChangerIcon, mediaChangerIconName, mediaCollectionAliases, mediaCollectionIcons, memoryIcon, memoryIconName, microphoneIcon, microphoneIconName, microphoneMuteIcon, microphoneMuteIconName, miniCollectionAliases, miniCollectionIcons, minusCircleIcon, minusCircleIconName, minusIcon, minusIconName, mobileIcon, mobileIconName, moonIcon, moonIconName, mouseIcon, mouseIconName, musicNoteIcon, musicNoteIconName, namespaceIcon, namespaceIconName, networkGlobeIcon, networkGlobeIconName, networkSettingsIcon, networkSettingsIconName, networkSwitchIcon, networkSwitchIconName, neutralFaceIcon, neutralFaceIconName, newIcon, newIconName, noAccessIcon, noAccessIconName, noWifiIcon, noWifiIconName, nodeGroupIcon, nodeGroupIconName, nodeIcon, nodeIconName, nodesIcon, nodesIconName, noteIcon, noteIconName, numberListIcon, numberListIconName, nvmeIcon, nvmeIconName, objectsIcon, objectsIconName, onHolidayIcon, onHolidayIconName, organizationIcon, organizationIconName, outdentIcon, outdentIconName, paintRollerIcon, paintRollerIconName, paperclipIcon, paperclipIconName, pasteIcon, pasteIconName, pauseIcon, pauseIconName, pdfFileIcon, pdfFileIconName, pencilIcon, pencilIconName, pesoIcon, pesoIconName, phoneHandsetIcon, phoneHandsetIconName, pictureIcon, pictureIconName, pieChartIcon, pieChartIconName, piggyBankIcon, piggyBankIconName, pinIcon, pinIconName, pinboardIcon, pinboardIconName, playIcon, playIconName, pluginIcon, pluginIconName, plusCircleIcon, plusCircleIconName, plusIcon, plusIconName, podIcon, podIconName, popOutIcon, popOutIconName, portraitIcon, portraitIconName, poundIcon, poundIconName, powerIcon, powerIconName, printerIcon, printerIconName, processOnVmIcon, processOnVmIconName, qrCodeIcon, qrCodeIconName, rackServerIcon, rackServerIconName, radarIcon, radarIconName, recycleIcon, recycleIconName, redoIcon, redoIconName, refreshIcon, refreshIconName, renderIcon, repeatIcon, repeatIconName, replayAllIcon, replayAllIconName, replayOneIcon, replayOneIconName, resistorIcon, resistorIconName, resizeIcon, resizeIconName, resourcePoolIcon, resourcePoolIconName, rewindIcon, rewindIconName, routerIcon, routerIconName, rubleIcon, rubleIconName, rulerPencilIcon, rulerPencilIconName, rupeeIcon, rupeeIconName, sadFaceIcon, sadFaceIconName, scatterPlotIcon, scatterPlotIconName, scissorsIcon, scissorsIconName, scriptExecuteIcon, scriptExecuteIconName, scriptScheduleIcon, scriptScheduleIconName, scrollIcon, scrollIconName, searchIcon, searchIconName, shareIcon, shareIconName, shieldCheckIcon, shieldCheckIconName, shieldIcon, shieldIconName, shieldXIcon, shieldXIconName, shoppingBagIcon, shoppingBagIconName, shoppingCartIcon, shoppingCartIconName, shrinkIcon, shrinkIconName, shuffleIcon, shuffleIconName, slide, sliderIcon, sliderIconName, snowflakeIcon, snowflakeIconName, socialCollectionAliases, socialCollectionIcons, sortByIcon, sortByIconName, squidIcon, squidIconName, ssdIcon, ssdIconName, starIcon, starIconName, stepForward2Icon, stepForward2IconName, stepForwardIcon, stepForwardIconName, stopIcon, stopIconName, storageAdapterIcon, storageAdapterIconName, storageIcon, storageIconName, storeIcon, storeIconName, strikethroughIcon, strikethroughIconName, subscriptIcon, subscriptIconName, successStandardIcon, successStandardIconName, sunIcon, sunIconName, superscriptIcon, superscriptIconName, switchIcon, switchIconName, syncIcon, syncIconName, tableIcon, tableIconName, tabletIcon, tabletIconName, tagIcon, tagIconName, tagsIcon, tagsIconName, talkBubblesIcon, talkBubblesIconName, tapeDriveIcon, tapeDriveIconName, targetIcon, targetIconName, tasksIcon, tasksIconName, technologyCollectionAliases, technologyCollectionIcons, terminalIcon, terminalIconName, textColorIcon, textColorIconName, textEditCollectionAliases, textEditCollectionIcons, textIcon, textIconName, thermometerIcon, thermometerIconName, thinClientIcon, thinClientIconName, thumbsDownIcon, thumbsDownIconName, thumbsUpIcon, thumbsUpIconName, tickChartIcon, tickChartIconName, timelineIcon, timelineIconName, timesCircleIcon, timesCircleIconName, timesIcon, timesIconName, timesMiniIcon, timesMiniIconName, toolsIcon, toolsIconName, trailerIcon, trailerIconName, trashIcon, trashIconName, travelCollectionAliases, travelCollectionIcons, treeIcon, treeIconName, treeViewIcon, treeViewIconName, truckIcon, truckIconName, twoWayArrowsIcon, twoWayArrowsIconName, unarchiveIcon, unarchiveIconName, underlineIcon, underlineIconName, undoIcon, undoIconName, uninstallIcon, uninstallIconName, unknownIcon, unknownIconName, unknownStatusIcon, unknownStatusIconName, unlinkIcon, unlinkIconName, unlockIcon, unlockIconName, unpinIcon, unpinIconName, updateIcon, updateIconName, uploadCloudIcon, uploadCloudIconName, uploadIcon, uploadIconName, usbIcon, usbIconName, userIcon, userIconName, usersIcon, usersIconName, videoCameraIcon, videoCameraIconName, videoGalleryIcon, videoGalleryIconName, viewCardsIcon, viewCardsIconName, viewColumnsIcon, viewColumnsIconName, viewListIcon, viewListIconName, vmBugIcon, vmBugIconName, vmBugInverseIcon, vmBugInverseIconName, vmIcon, vmIconName, vmwAppIcon, vmwAppIconName, volumeDownIcon, volumeDownIconName, volumeIcon, volumeIconName, volumeMuteIcon, volumeMuteIconName, volumeUpIcon, volumeUpIconName, walletIcon, walletIconName, wandIcon, wandIconName, warningMiniIcon, warningMiniIconName, warningStandardIcon, warningStandardIconName, wifiIcon, wifiIconName, windowCloseIcon, windowCloseIconName, windowMaxIcon, windowMaxIconName, windowMinIcon, windowMinIconName, windowRestoreIcon, windowRestoreIconName, wonIcon, wonIconName, worldIcon, worldIconName, wrenchIcon, wrenchIconName, xlsFileIcon, xlsFileIconName, yenIcon, yenIconName, zoomInIcon, zoomInIconName, zoomOutIcon, zoomOutIconName, AccordionOompaLoompa as ÇlrAccordionOompaLoompa, AccordionWillyWonka as ÇlrAccordionWillyWonka, ActionableOompaLoompa as ÇlrActionableOompaLoompa, ActiveOompaLoompa as ÇlrActiveOompaLoompa, ClrPopoverCloseButton as ÇlrClrPopoverCloseButton, ClrPopoverModuleNext as ÇlrClrPopoverModuleNext, ClrPopoverOpenCloseButton as ÇlrClrPopoverOpenCloseButton, DatagridCellRenderer as ÇlrDatagridCellRenderer, DatagridDetailRegisterer as ÇlrDatagridDetailRegisterer, DatagridHeaderRenderer as ÇlrDatagridHeaderRenderer, DatagridMainRenderer as ÇlrDatagridMainRenderer, DatagridRowDetailRenderer as ÇlrDatagridRowDetailRenderer, DatagridRowRenderer as ÇlrDatagridRowRenderer, ClrDatagridSelectionCellDirective as ÇlrDatagridSelectionCellDirective, ClrDatagridSingleSelectionValueAccessor as ÇlrDatagridSingleSelectionValueAccessor, ClrDatagridVirtualScrollDirective as ÇlrDatagridVirtualScrollDirective, DatagridWillyWonka as ÇlrDatagridWillyWonka, ExpandableOompaLoompa as ÇlrExpandableOompaLoompa, StepperOompaLoompa as ÇlrStepperOompaLoompa, StepperWillyWonka as ÇlrStepperWillyWonka, TabsWillyWonka as ÇlrTabsWillyWonka, WrappedCell as ÇlrWrappedCell, WrappedColumn as ÇlrWrappedColumn, WrappedRow as ÇlrWrappedRow };
export type { BreadcrumbItem, ClrCommonStrings, ClrDatagridComparatorInterface, ClrDatagridFilterInterface, ClrDatagridItemsIdentityFunction, ClrDatagridNumericFilterInterface, ClrDatagridStateInterface, ClrDatagridStringFilterInterface, ClrDatagridVirtualScrollRangeInterface, ClrFileAcceptError, ClrFileInputSelection, ClrFileListValidationErrors, ClrFileMaxFileSizeError, ClrFileMessagesTemplateContext, ClrFileMinFileSizeError, ClrRecursiveForOfContext, ClrSingleFileValidationErrors, ClrTabsActionsPosition, Directions, HeadingLevel, IconAlias, IconRegistry, IconRegistrySources, IconShapeCollection, IconShapeSources, IconShapeTuple, Orientations, StatusTypes };
