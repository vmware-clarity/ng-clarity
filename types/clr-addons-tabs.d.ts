import * as i0 from '@angular/core';
import { OnInit, OnDestroy, EventEmitter, Renderer2, ChangeDetectorRef, OnChanges, AfterViewInit, AfterContentInit, SimpleChanges, ElementRef } from '@angular/core';
import * as i7 from '@clr/angular/layout/tabs';
import { ClrTab, ClrTabLink } from '@clr/angular/layout/tabs';
import * as i6 from '@clr/addons/a11y';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import * as i5 from '@clr/addons/var';
import { WorkflowModelManager, WorkflowConfigurationService, TabLayout, ModelChange, Step, RelevanceService, WorkflowModel, StepInternal } from '@clr/addons/var';
import { Observable } from 'rxjs';
import * as i8 from '@clr/angular/icon';
import * as i9 from '@angular/common';
import * as i10 from '@angular/forms';

/**
 * Detects when an active tab changes and emits a notification.
 * Optionally applies a CSS class to the active tab link element.
 *
 * Note: this directive peers into Clarity tab internals and requires maintenance
 * if Clarity changes its internal structure.
 */
declare class IfTabActiveDirective implements OnInit, OnDestroy {
    tab: ClrTab;
    private renderer;
    appfxIfTabActiveChange: EventEmitter<boolean>;
    activeClass: string;
    private subscription;
    constructor(tab: ClrTab, renderer: Renderer2);
    /** Programmatically activate the tab when set to true. */
    set activateTab(value: boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Accesses the underlying tab link element via Clarity internals. */
    private getTabLinkElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<IfTabActiveDirective, [{ host: true; self: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IfTabActiveDirective, "[appfxIfTabActive]", never, { "activeClass": { "alias": "activeClass"; "required": false; }; "activateTab": { "alias": "activateTab"; "required": false; }; }, { "appfxIfTabActiveChange": "appfxIfTabActiveChange"; }, never, never, false, never>;
}

declare class TabLinksComponent {
    workflowStrings: WorkflowStrings;
    private cdr;
    opened: boolean;
    title?: string;
    openedChange: EventEmitter<boolean>;
    currentZoomLevel: ZoomLevel;
    constructor(workflowStrings: WorkflowStrings, cdr: ChangeDetectorRef);
    changeOpened(opened: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabLinksComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabLinksComponent, "appfx-tab-links", never, { "opened": { "alias": "opened"; "required": false; }; "title": { "alias": "title"; "required": false; }; }, { "openedChange": "openedChange"; }, never, never, false, never>;
}

/**
 * Component used to render the composition of step components as tabs
 * (using Clarity tabs component). Workflow of the steps is handled by the
 * {@link WorkflowModelManager} - the same responsible for the {@link Wizard} workflow.
 * This guarantees the same API and UX for the inline and dialog wizards.
 *
 * @example
 * <appfx-tabs
 *             [loading]="loading"
 *             [tabs]="tabs"
 *             [disableTabsContent]="false"
 *             [tabLayout]="TabLayout.horizontal"
 *             [model]="tabsModel">
 * </appfx-tabs>
 */
declare class TabsComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit, OnDestroy {
    modelMgr: WorkflowModelManager;
    private relevanceService;
    private cdr;
    workflowStrings: WorkflowStrings;
    configService: WorkflowConfigurationService;
    private zoomLevelService?;
    /** Disable the content of the tabs. */
    disableTabsContent: boolean;
    /** Display loading indicator. */
    loading: boolean;
    /** The tabs layout. Defaults to horizontal. */
    tabLayout: TabLayout;
    /** Set to false to suppress the loading indicator; check {@link isLoading} instead. */
    showLoadingIndicator: boolean;
    /** Set to false to disable auto-collapsible tab links. */
    autoCollapseTabLinks: boolean;
    /** Set to false to hide the tab links (useful when there is only one step). */
    showTabLinks: boolean;
    /** Emits when the workflow model changes. */
    readonly onModelChange: EventEmitter<ModelChange[]>;
    tabLinksOpenedChange: EventEmitter<boolean>;
    /** Emits with the activated step when the active tab changes. */
    activeTabChange: EventEmitter<Step>;
    errorIconVisibleList: boolean[];
    clrTabsLayout: TabLayout;
    TabLayout: typeof TabLayout;
    currentZoomLevel: ZoomLevel;
    ZoomLevel: typeof ZoomLevel;
    tabLinksOpened: boolean;
    activeTabStep: Step;
    isVerticalLayout: boolean;
    isSecondaryLayout: boolean;
    private pagesContainers;
    private tabLinks;
    private steps;
    private tabsModel;
    private awaitingActivePageOnLoad$;
    private componentAfterViewInit$;
    private subscriptions;
    private errorActivatingStep;
    private retrySubscription;
    private stepsValidationMap;
    constructor(modelMgr: WorkflowModelManager, relevanceService: RelevanceService, cdr: ChangeDetectorRef, workflowStrings: WorkflowStrings, configService: WorkflowConfigurationService, zoomLevelService?: ZoomLevelService);
    get tabs(): Step[];
    set tabs(steps: Step[]);
    /**
     * Supply any structure that has the needed properties to inject to / eject from step models.
     * If not specified the steps will stay disconnected from each other.
     */
    get model(): WorkflowModel;
    set model(tabsModel: WorkflowModel);
    get tabsInternal(): StepInternal[];
    get isLoading(): boolean;
    get showTabNav(): boolean;
    get showTabContent(): boolean;
    get showAppfxTabLinks(): boolean;
    get isReady(): boolean;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Checks if the tab is currently active. */
    isTabActive(step: StepInternal): boolean;
    /** Triggered when the tab page is changed. */
    onStepActiveChange(step: StepInternal, isStepActive: boolean): void;
    /** Validates only the active tab. */
    validateActiveTab$(): Observable<boolean>;
    /** Validates all tabs. Navigates to the first invalid tab if any fail. */
    validate$(): Observable<boolean>;
    private activateFirstTab;
    private navigateToTabWithErrors;
    private activateStep;
    private validateStep;
    private onStepsOrModelChange;
    private unsubscribeRetry;
    private retryStepTransition;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabsComponent, [null, null, null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabsComponent, "appfx-tabs", never, { "disableTabsContent": { "alias": "disableTabsContent"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "tabLayout": { "alias": "tabLayout"; "required": false; }; "showLoadingIndicator": { "alias": "showLoadingIndicator"; "required": false; }; "autoCollapseTabLinks": { "alias": "autoCollapseTabLinks"; "required": false; }; "showTabLinks": { "alias": "showTabLinks"; "required": false; }; "tabs": { "alias": "tabs"; "required": false; }; "model": { "alias": "model"; "required": false; }; }, { "onModelChange": "onModelChange"; "tabLinksOpenedChange": "tabLinksOpenedChange"; "activeTabChange": "activeTabChange"; }, never, never, false, never>;
}

/**
 * Toggles CSS classes on a ClrTabLink to switch between default tab style and
 * a button-like appearance, enabling more versatile use of clr-tabs.
 */
declare class RenderAsButtonDirective implements OnChanges, AfterViewInit {
    private clrTabLink;
    private renderer;
    private el;
    renderAsButton: boolean;
    constructor(clrTabLink: ClrTabLink, renderer: Renderer2, el: ElementRef);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    private patchClarityStyles;
    static ɵfac: i0.ɵɵFactoryDeclaration<RenderAsButtonDirective, [{ host: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RenderAsButtonDirective, "[renderAsButton]", never, { "renderAsButton": { "alias": "renderAsButton"; "required": false; }; }, {}, never, never, false, never>;
}

declare class AppfxTabsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxTabsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxTabsModule, [typeof TabsComponent, typeof TabLinksComponent, typeof IfTabActiveDirective, typeof RenderAsButtonDirective], [typeof i5.AppfxWorkflowCoreModule, typeof i6.AppfxA11yModule, typeof i7.ClrTabsModule, typeof i8.ClrIcon, typeof i9.CommonModule, typeof i10.FormsModule, typeof i10.ReactiveFormsModule], [typeof TabsComponent, typeof TabLinksComponent, typeof IfTabActiveDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxTabsModule>;
}

export { TabsComponent as AppfxTabsComponent, AppfxTabsModule, IfTabActiveDirective as IfTabActive, IfTabActiveDirective, TabLinksComponent as TabLinks, TabLinksComponent, TabsComponent as Tabs, TabsComponent };
