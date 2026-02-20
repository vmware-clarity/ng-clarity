import * as i0 from '@angular/core';
import { OnDestroy, OnInit, ElementRef, Type, ChangeDetectorRef, Renderer2, Injector, ViewContainerRef, AfterContentInit, QueryList, EventEmitter } from '@angular/core';
import * as i1 from '@clr/angular/layout/main-container';
import * as i2 from '@clr/angular/layout/nav';
import { ResponsiveNavigationService as ResponsiveNavigationService$1, ResponsiveNavControlMessage as ResponsiveNavControlMessage$1 } from '@clr/angular/layout/nav';
import * as i3 from '@clr/angular/layout/tabs';
import * as i4 from '@clr/angular/layout/vertical-nav';
import * as i5 from '@clr/angular/layout/breadcrumbs';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';
import * as i11 from '@clr/angular/utils';
import { WillyWonka, OompaLoompa, ClrCommonStringsService, ClrStandaloneCdkTrapFocus, IfActiveService, TemplateRefContainer, ClrKeyFocus, IfExpandService } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i6$1 from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import * as i8 from '@clr/angular/popover/dropdown';
import * as i1$1 from '@clr/angular/popover/common';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { AnimationEvent } from '@angular/animations';

declare class ClrLayoutModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLayoutModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrLayoutModule, never, never, [typeof i1.ClrMainContainerModule, typeof i2.ClrNavigationModule, typeof i3.ClrTabsModule, typeof i4.ClrVerticalNavModule, typeof i5.ClrBreadcrumbsModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrLayoutModule>;
}

declare class ClrMainContainer implements OnDestroy, OnInit {
    private elRef;
    private responsiveNavService;
    private _subscription;
    private _classList;
    constructor(elRef: ElementRef<HTMLElement>, responsiveNavService: ResponsiveNavigationService$1);
    ngOnInit(): void;
    processMessage(message: ResponsiveNavControlMessage$1): void;
    controlNav(controlCode: string, navClass: string): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrMainContainer, "clr-main-container", never, {}, {}, never, never, false, never>;
}

declare const CLR_LAYOUT_DIRECTIVES: Type<any>[];
declare class ClrMainContainerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrMainContainerModule, [typeof ClrMainContainer], [typeof i6.CommonModule, typeof i7.ClrIcon], [typeof ClrMainContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrMainContainerModule>;
}

declare class MainContainerWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<MainContainerWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MainContainerWillyWonka, "clr-main-container", never, {}, {}, never, never, false, never>;
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

declare class NavDetectionOompaLoompa extends OompaLoompa {
    private responsiveNavService;
    constructor(cdr: ChangeDetectorRef, willyWonka: MainContainerWillyWonka, responsiveNavService: ResponsiveNavigationService);
    get flavor(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavDetectionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NavDetectionOompaLoompa, "clr-header", never, {}, {}, never, never, false, never>;
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
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNavLevel, "[clr-nav-level]", never, { "_level": { "alias": "clr-nav-level"; "required": false; }; "closeButtonAriaLabel": { "alias": "closeAriaLabel"; "required": false; }; }, {}, never, never, false, [{ directive: typeof i11.ClrStandaloneCdkTrapFocus; inputs: {}; outputs: {}; }]>;
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

declare const CLR_NAVIGATION_DIRECTIVES: Type<any>[];
declare class ClrNavigationModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNavigationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNavigationModule, [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink, typeof NavDetectionOompaLoompa, typeof MainContainerWillyWonka], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i8.ClrDropdownModule], [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink, typeof NavDetectionOompaLoompa, typeof MainContainerWillyWonka]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNavigationModule>;
}

declare enum TabsLayout {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabs, "clr-tabs", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, ["tabsActions", "tabs"], ["clr-tabs-actions"], false, [{ directive: typeof i1$1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

type ClrTabsActionsPosition = 'left' | 'right';
declare class ClrTabsActions {
    position: ClrTabsActionsPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabsActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabsActions, "clr-tabs-actions", never, { "position": { "alias": "position"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrTabOverflowContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabOverflowContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabOverflowContent, "clr-tab-overflow-content", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTabAction {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabAction, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTabAction, "[clrTabAction]", never, {}, {}, never, never, false, never>;
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

declare const CLR_TABS_DIRECTIVES: Type<any>[];
declare class ClrTabsModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTabsModule, [typeof ClrTabContent, typeof ClrTab, typeof ClrTabs, typeof ClrTabOverflowContent, typeof ClrTabLink, typeof ClrTabAction, typeof ClrTabsActions, typeof TabsWillyWonka, typeof ActiveOompaLoompa], [typeof i6.CommonModule, typeof i11.ClrConditionalModule, typeof i7.ClrIcon, typeof i11.ClrTemplateRefModule, typeof i11.ClrKeyFocusModule], [typeof ClrTabContent, typeof ClrTab, typeof ClrTabs, typeof ClrTabOverflowContent, typeof ClrTabLink, typeof ClrTabAction, typeof ClrTabsActions, typeof TabsWillyWonka, typeof ActiveOompaLoompa, typeof i11.ClrConditionalModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTabsModule>;
}

declare class ClrVerticalNavGroupChildren {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavGroupChildren, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavGroupChildren, "clr-vertical-nav-group-children", never, {}, {}, never, ["*"], false, never>;
}

declare class VerticalNavGroupRegistrationService {
    navGroupCount: number;
    registerNavGroup(): void;
    unregisterNavGroup(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavGroupRegistrationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavGroupRegistrationService>;
}

declare class VerticalNavGroupService {
    private _expandChange;
    get expandChange(): Observable<boolean>;
    expand(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavGroupService>;
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

declare class VerticalNavIconService {
    private _icons;
    get hasIcons(): boolean;
    registerIcon(): void;
    unregisterIcon(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavIconService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavIconService>;
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

declare class ClrVerticalNavLink implements OnDestroy {
    private destroy$;
    constructor(host: ElementRef<HTMLElement>, ref: ChangeDetectorRef, navGroupService: VerticalNavGroupService | null);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavLink, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavLink, "[clrVerticalNavLink]", never, {}, {}, never, ["[clrVerticalNavIcon]", "*"], false, never>;
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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrVerticalNavModule, [typeof ClrVerticalNav, typeof ClrVerticalNavLink, typeof ClrVerticalNavGroup, typeof ClrVerticalNavGroupChildren, typeof ClrVerticalNavIcon], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i11.ClrConditionalModule, typeof i11.ClrFocusOnViewInitModule], [typeof ClrVerticalNav, typeof ClrVerticalNavLink, typeof ClrVerticalNavGroup, typeof ClrVerticalNavGroupChildren, typeof ClrVerticalNavIcon, typeof i11.ClrConditionalModule, typeof i7.ClrIcon, typeof i11.ClrFocusOnViewInitModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrVerticalNavModule>;
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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrBreadcrumbsModule, [typeof ClrBreadcrumbs, typeof ClrBreadcrumbItem], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i11.ClrHostWrappingModule, typeof i6$1.RouterModule], [typeof ClrBreadcrumbs, typeof i7.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrBreadcrumbsModule>;
}

export { CLR_LAYOUT_DIRECTIVES, CLR_NAVIGATION_DIRECTIVES, CLR_TABS_DIRECTIVES, CLR_VERTICAL_NAV_DIRECTIVES, ClrAriaCurrentLink, ClrBreadcrumbItem, ClrBreadcrumbs, ClrBreadcrumbsModule, ClrHeader, ClrLayoutModule, ClrMainContainer, ClrMainContainerModule, ClrNavLevel, ClrNavigationModule, ClrTab, ClrTabAction, ClrTabContent, ClrTabLink, ClrTabOverflowContent, ClrTabs, ClrTabsActions, ClrTabsModule, ClrVerticalNav, ClrVerticalNavGroup, ClrVerticalNavGroupChildren, ClrVerticalNavIcon, ClrVerticalNavLink, ClrVerticalNavModule, MainContainerWillyWonka, NavDetectionOompaLoompa, ResponsiveNavCodes, ResponsiveNavControlMessage, ResponsiveNavigationService, ActiveOompaLoompa as ÇlrActiveOompaLoompa, TabsWillyWonka as ÇlrTabsWillyWonka };
export type { BreadcrumbItem, ClrTabsActionsPosition };
