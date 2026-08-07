import * as i0 from '@angular/core';
import { OnDestroy, ElementRef, ViewContainerRef, AfterContentInit, QueryList, ChangeDetectorRef, Type } from '@angular/core';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverService } from '@clr/angular/popover/common';
import * as i11 from '@clr/angular/utils';
import { IfActiveService, TemplateRefContainer, ClrCommonStringsService, ClrKeyFocus, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import * as i10 from '@angular/common';
import * as i12 from '@clr/angular/icon';

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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabs, "clr-tabs", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, ["tabsActions", "tabs"], ["clr-tabs-actions"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTabsModule, [typeof ClrTabContent, typeof ClrTab, typeof ClrTabs, typeof ClrTabOverflowContent, typeof ClrTabLink, typeof ClrTabAction, typeof ClrTabsActions, typeof TabsWillyWonka, typeof ActiveOompaLoompa], [typeof i10.CommonModule, typeof i11.ClrConditionalModule, typeof i12.ClrIcon, typeof i11.ClrTemplateRefModule, typeof i11.ClrKeyFocusModule], [typeof ClrTabContent, typeof ClrTab, typeof ClrTabs, typeof ClrTabOverflowContent, typeof ClrTabLink, typeof ClrTabAction, typeof ClrTabsActions, typeof TabsWillyWonka, typeof ActiveOompaLoompa, typeof i11.ClrConditionalModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTabsModule>;
}

export { ActiveOompaLoompa, CLR_TABS_DIRECTIVES, ClrTab, ClrTabAction, ClrTabContent, ClrTabLink, ClrTabOverflowContent, ClrTabs, ClrTabsActions, ClrTabsModule, TabsWillyWonka };
export type { ClrTabsActionsPosition };
