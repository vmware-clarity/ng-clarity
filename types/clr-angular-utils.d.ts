import { FormGroup } from '@angular/forms';
import * as i0 from '@angular/core';
import { OnDestroy, EventEmitter, ElementRef, Renderer2, NgZone, Type, TemplateRef, Injector, ViewContainerRef, InjectionToken, OnChanges, SimpleChanges, AfterViewInit, QueryList, FactoryProvider, ChangeDetectorRef, AfterViewChecked, AfterContentChecked } from '@angular/core';
import * as i2 from '@angular/common';
import * as _angular_animations from '@angular/animations';
import { AnimationMetadata, AnimationEvent, AnimationBuilder } from '@angular/animations';
export * from '@clr/angular/utils/loading';
export * from '@clr/angular/utils/conditional';
import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { Subscription, Observable, Observer, Subject } from 'rxjs';
import { Directionality } from '@angular/cdk/bidi';
import { CdkDrag, DragDropConfig, DragDrop } from '@angular/cdk/drag-drop';

declare function triggerAllFormControlValidation(formGroup: FormGroup): void;

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

declare class MockDomAdapter extends DomAdapter {
    _userDefinedWidth: number;
    _scrollBarWidth: number;
    _scrollWidth: number;
    _computedHeight: number;
    userDefinedWidth(_element: any): number;
    scrollBarWidth(_element: any): number;
    scrollWidth(_element: any): number;
    computedHeight(_element: any): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDomAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MockDomAdapter>;
}
declare const MOCK_DOM_ADAPTER_PROVIDER: {
    provide: typeof DomAdapter;
    useClass: typeof MockDomAdapter;
};

declare class OutsideClick implements OnDestroy {
    strict: boolean;
    outsideClick: EventEmitter<any>;
    private documentClickListener;
    constructor(host: ElementRef<HTMLElement>, renderer: Renderer2, ngZone: NgZone);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OutsideClick, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OutsideClick, "[clrOutsideClick]", never, { "strict": { "alias": "clrStrict"; "required": false; }; }, { "outsideClick": "clrOutsideClick"; }, never, never, false, never>;
}

declare const OUSTIDE_CLICK_DIRECTIVES: Type<any>[];
declare class ClrOutsideClickModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOutsideClickModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrOutsideClickModule, [typeof OutsideClick], [typeof i2.CommonModule], [typeof OutsideClick]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrOutsideClickModule>;
}

declare class TemplateRefContainer {
    template: TemplateRef<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TemplateRefContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TemplateRefContainer, "ng-component", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTemplateRefModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTemplateRefModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTemplateRefModule, [typeof TemplateRefContainer], [typeof i2.CommonModule], [typeof TemplateRefContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTemplateRefModule>;
}

/**
 * TODO:
 * Using core functions like:
 * - pluckPixelValue
 * - getCssPropertyValue
 *
 * to get the value of the design token.
 *
 * Note: Memoization/Cache usage possible.
 */
declare const DATEPICKER_ENABLE_BREAKPOINT = 768;
declare const SMALL_BREAKPOINT = 576;
declare const MEDIUM_BREAKPOINT = 768;
declare const LARGE_BREAKPOINT = 992;
declare const EXTRA_LARGE_BREAKPOINT = 1200;

declare class EmptyAnchor {
    static ɵfac: i0.ɵɵFactoryDeclaration<EmptyAnchor, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmptyAnchor, "ng-component", never, {}, {}, never, never, false, never>;
}

/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
 */
declare class HostWrapper<W> implements Injector {
    private injector;
    constructor(containerType: Type<W>, vcr: ViewContainerRef, index?: number);
    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
}

/**
 * Internal module, please do not export!
 */
declare class ClrHostWrappingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrHostWrappingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrHostWrappingModule, [typeof EmptyAnchor], never, [typeof EmptyAnchor]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrHostWrappingModule>;
}

declare function assertNever(value: never): void;

declare function isBooleanAttributeSet(value: string | boolean): boolean;

declare const defaultAnimationTiming = "0.2s ease-in-out";
declare const defaultExpandAnimation: _angular_animations.AnimationReferenceMetadata;

declare function collapse(): AnimationMetadata[];

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

declare const EXPANDABLE_ANIMATION_DIRECTIVES: Type<any>[];
declare class ClrExpandableAnimationModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrExpandableAnimationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrExpandableAnimationModule, [typeof ClrExpandableAnimation, typeof ClrExpandableAnimationDirective], [typeof i2.CommonModule], [typeof ClrExpandableAnimation, typeof ClrExpandableAnimationDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrExpandableAnimationModule>;
}

declare function fade(opacity?: number): AnimationMetadata[];

declare function fadeSlide(direction: string): AnimationMetadata[];

declare function slide(direction: string): AnimationMetadata[];

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
    comboboxSelectAll: string;
    comboboxUnselectAll: string;
    comboboxAllSelected: string;
    comboboxShowAll: string;
    comboboxShowLess: string;
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

declare enum ClrFocusDirection {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    BOTH = "both"
}

interface FocusableItem$1 {
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
    get focusableItems(): Array<FocusableItem$1> | any;
    set focusableItems(elements: Array<FocusableItem$1> | any);
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

declare function preventArrowKeyScroll(event: KeyboardEvent): void;
declare function isKeyEitherLetterOrNumber(event: KeyboardEvent): boolean;

declare class ClrRovingTabindex extends ClrKeyFocus {
    private renderer;
    private disabled;
    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2);
    get rovingIndexItems(): Array<FocusableItem$1> | string;
    set rovingIndexItems(elements: Array<FocusableItem$1> | string);
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

declare abstract class FocusableItem {
    id: string;
    disabled?: boolean;
    up?: FocusableItem | Observable<FocusableItem>;
    down?: FocusableItem | Observable<FocusableItem>;
    left?: FocusableItem | Observable<FocusableItem>;
    right?: FocusableItem | Observable<FocusableItem>;
    abstract focus(): void;
    abstract blur(): void;
    abstract activate?(): void;
}

declare class MockFocusableItem implements FocusableItem {
    id: string;
    disabled: boolean;
    up?: FocusableItem | Observable<FocusableItem>;
    down?: FocusableItem | Observable<FocusableItem>;
    left?: FocusableItem | Observable<FocusableItem>;
    right?: FocusableItem | Observable<FocusableItem>;
    constructor(id: string);
    focus(): void;
    blur(): void;
    activate(): void;
}

declare class BasicFocusableItem implements FocusableItem {
    private el;
    private renderer;
    private platformId;
    id: string;
    disabled: boolean;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, platformId: any);
    focus(): void;
    blur(): void;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BasicFocusableItem, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BasicFocusableItem>;
}
declare const BASIC_FOCUSABLE_ITEM_PROVIDER: {
    provide: typeof FocusableItem;
    useClass: typeof BasicFocusableItem;
}[];

declare function customFocusableItemProvider<T>(implementation: Type<T>): (Type<T> | {
    provide: typeof FocusableItem;
    useExisting: Type<T>;
})[];

declare enum ArrowKeyDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}

declare class Linkers {
    /**
     * Links a set of focusable items to a parent along one direction
     */
    static linkParent(items: FocusableItem[], parent: FocusableItem | Observable<FocusableItem>, direction: ArrowKeyDirection): void;
    /**
     * Double-links a set of focusable items vertically, possibly looping
     */
    static linkVertical(items: FocusableItem[], loop?: boolean): void;
}

declare function wrapObservable<T>(observable: Observable<T>, onSubscribe?: (observer: Observer<T>) => void, onUnsubscribe?: (observer: Observer<T>) => void): Observable<T>;

declare class FocusService {
    private renderer;
    private _current;
    private _unlistenFuncsMap;
    constructor(renderer: Renderer2);
    get current(): FocusableItem;
    reset(first: FocusableItem): void;
    registerContainer(el: HTMLElement): void;
    moveTo(item: FocusableItem): void;
    move(direction: ArrowKeyDirection): boolean;
    activateCurrent(): boolean;
    detachListeners(el: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FocusService>;
}
declare function clrFocusServiceFactory(existing: FocusService, renderer: Renderer2): FocusService;
declare const FOCUS_SERVICE_PROVIDER: FactoryProvider;

declare function uniqueIdFactory(): string;

declare class ScrollingService {
    private _document;
    constructor(_document: any);
    stopScrolling(): void;
    resumeScrolling(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScrollingService>;
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

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | '1' | '2' | '3' | '4' | '5' | '6';

declare enum Keys {
    ArrowLeft = "ArrowLeft",
    ArrowUp = "ArrowUp",
    ArrowRight = "ArrowRight",
    ArrowDown = "ArrowDown",
    Backspace = "Backspace",
    Tab = "Tab",
    Enter = "Enter",
    Escape = "Escape",
    Space = "Space",
    Spacebar = " ",
    Home = "Home",
    End = "End",
    PageDown = "PageDown",
    PageUp = "PageUp"
}

/**
 * A (clockwise) enumeration for positions around an element.
 *
 *     A    B    C
 *  L  ----------- D
 *     |         |
 *     |         |
 *  K  |         | E
 *     |         |
 *     |         |
 *  J  ----------- F
 *     I    H    G
 *
 * TOP_LEFT      = A
 * TOP_CENTER    = B
 * TOP_RIGHT     = C
 * RIGHT_TOP     = D
 * RIGHT_CENTER  = E
 * RIGHT_BOTTOM  = F
 * BOTTOM_RIGHT  = G
 * BOTTOM_CENTER = H
 * BOTTOM_LEFT   = I
 * LEFT_BOTTOM   = J
 * LEFT_CENTER   = K
 * LEFT_TOP      = L
 *
 *
 * Consumers tell us that they want something to display on the TOP_LEFT of the trigger and that they want the
 * _content_ container to orient AT the bottom left.
 * In order to calculate the position for the content I need to match up the origin/trigger ClrPosition with the
 * content ClrPosition.
 *
 * Origin TOP_LEFT **AT** Content BOTTOM_LEFT.
 *     -----------
 *     |         |
 *     |         |
 *     | content |
 *     |         |
 *     |         |
 *     -----------
 *     |/
 *     -----------
 *     |         |
 *     |         |
 *     | trigger |
 *     |         |
 *     |         |
 *     -----------
 *
 */
declare enum ClrPosition {
    TOP_LEFT = 0,
    TOP_CENTER = 1,
    TOP_RIGHT = 2,
    RIGHT_TOP = 3,
    RIGHT_CENTER = 4,
    RIGHT_BOTTOM = 5,
    BOTTOM_RIGHT = 6,
    BOTTOM_CENTER = 7,
    BOTTOM_LEFT = 8,
    LEFT_BOTTOM = 9,
    LEFT_CENTER = 10,
    LEFT_TOP = 11
}

declare class WillyWonka implements AfterViewChecked {
    disableChocolateCheck: boolean;
    private _chocolate;
    get chocolate(): Observable<void>;
    ngAfterViewChecked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WillyWonka, never, never, {}, {}, never, never, true, never>;
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

export { ArrowKeyDirection, BASIC_FOCUSABLE_ITEM_PROVIDER, BaseExpandableAnimation, BasicFocusableItem, CdkDragModule, CdkDragModule_CdkDrag, CdkTrapFocusModule, CdkTrapFocusModule_CdkTrapFocus, ClrCommonStringsService, ClrDestroyService, ClrExpandableAnimation, ClrExpandableAnimationDirective, ClrExpandableAnimationModule, ClrFocusOnViewInit, ClrFocusOnViewInitModule, ClrHostWrappingModule, ClrKeyFocus, ClrKeyFocusItem, ClrKeyFocusModule, ClrOutsideClickModule, ClrPosition, ClrRovingTabindex, ClrStandaloneCdkTrapFocus, ClrTemplateRefModule, DATEPICKER_ENABLE_BREAKPOINT, DomAdapter, EXPANDABLE_ANIMATION_DIRECTIVES, EXTRA_LARGE_BREAKPOINT, EmptyAnchor, FOCUS_ON_VIEW_INIT, FOCUS_ON_VIEW_INIT_DIRECTIVES, FOCUS_SERVICE_PROVIDER, FocusService, FocusableItem, HostWrapper, Keys, LARGE_BREAKPOINT, Linkers, MEDIUM_BREAKPOINT, MOCK_DOM_ADAPTER_PROVIDER, MockDomAdapter, MockFocusableItem, OUSTIDE_CLICK_DIRECTIVES, OompaLoompa, OutsideClick, SMALL_BREAKPOINT, ScrollingService, TemplateRefContainer, WillyWonka, assertNever, clrFocusServiceFactory, collapse, commonStringsDefault, customFocusableItemProvider, defaultAnimationTiming, defaultExpandAnimation, fade, fadeSlide, isBooleanAttributeSet, isKeyEitherLetterOrNumber, preventArrowKeyScroll, slide, triggerAllFormControlValidation, uniqueIdFactory, wrapObservable };
export type { ClrCommonStrings, HeadingLevel };
