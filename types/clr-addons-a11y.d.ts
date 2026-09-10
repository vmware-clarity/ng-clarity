import * as i0 from '@angular/core';
import { AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, Renderer2, OnInit } from '@angular/core';
import { ClrTabs } from '@clr/angular/layout/tabs';
import { Observable } from 'rxjs';
import { ClrStepperPanel } from '@clr/angular/stepper';
import { ClrCommonStrings, ClrCommonStringsService } from '@clr/angular/utils';
import * as i5 from '@clr/addons/translate';

/**
 * Accessibility mode keys
 */
declare const a11ykeys: {
    enter: string;
    arrowLeft: string;
    arrowRight: string;
};

/**
 * Abstracts the ResizeObserver to limit its API.
 */
declare class ElementResizeService {
    getResizeObservable(element: Element): Observable<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ElementResizeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ElementResizeService>;
}

/**
 * Automatically include the tab links in overflow if there is not enough width.
 *
 * This directive relies on the following Clarity internals:
 * 1. ClrTabLink:
 * <code>
 *    @HostBinding('class.btn-link')
 *    @HostBinding('class.nav-link')
 *    get addLinkClasses() {...}
 * </code>
 *
 * 2. ClrTabs:
 * <code>
 *    @ContentChildren(ClrTab) private tabs: QueryList<ClrTab>;
 *
 *    private _tabOverflowEl: HTMLElement;
 * </code>
 */
declare class OverflowClrTabsDirective implements AfterViewInit, OnDestroy {
    private cdr;
    private element;
    private renderer;
    private clrTabsComponent;
    private elementResizeService;
    private readonly subscription;
    private parentElement;
    private tabOverflowEl;
    constructor(cdr: ChangeDetectorRef, element: ElementRef, renderer: Renderer2, clrTabsComponent: ClrTabs, elementResizeService: ElementResizeService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private setup;
    /**
     * When the More button (...) is clicked, ClrTabOverflowContent is displayed.
     * It is a dropdown with style 'bottom-right'. However when there is just one tab,
     * the overflow component overflows to the left of the viewport and is not visible.
     * This method overrides private field in ClrTabs - _tabOverflowEl - that is set when
     * the ClrTabOverflowContent is created. If all tabs are in overflow, then change the
     * style of &lt;clr-tab-overflow-content&gt; element so that it takes the entire width
     * of the viewport.
     */
    private patchOverflowContent;
    /**
     * Determine which tab links to be shelved into the overflow menu.
     */
    private updateOverflowMenu;
    private showAllTabs;
    private calculateTabLinkMargin;
    private updateTabsInOverflow;
    private isTabLinkOverflowing;
    private addTabLinkClasses;
    private removeTabLinkClasses;
    static ɵfac: i0.ɵɵFactoryDeclaration<OverflowClrTabsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OverflowClrTabsDirective, "clr-tabs [appfxOverflowTabs]", never, {}, {}, never, never, false, never>;
}

/**
 * This directive overrides strings used in ClrStepperPanel. It creates a copy of the strings, returned by
 * ClrCommonStringsService and does not modify the original resources.
 *
 * This directive relies on the following Clarity internals:
 * <code>
 * export class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
 *     public constructor(
 *        public commonStrings: ClrCommonStringsService,
 *        ...
 *     ) {}
 *     ...
 * }
 * </code>
 *
 * common-strings.default.ts:
 * <code>
 *   // Accordion/Stepper
 *   stepComplete: 'Step {STEP} complete',
 *   stepError: 'Error in step {STEP}',
 * </code>
 *
 * Usage:
 * <code>
 *    <clr-stepper-panel formGroupName="step0" [appfxOverrideClrStrings]="stepPanelOverriddenStrings">
 *    ...
 *    </clr-stepper-panel>
 *
 *    const stepPanelOverriddenStrings: Partial<ClrCommonStrings> = {
 *       success: "The step is successfully completed",
 *       danger: "The step is in serious danger",
 *    };
 * </code>
 */
declare class OverrideClrStringsDirective implements OnInit {
    private clrPanel;
    private clrCommonStringsService;
    appfxOverrideClrStrings: Partial<ClrCommonStrings>;
    constructor(clrPanel: ClrStepperPanel, clrCommonStringsService: ClrCommonStringsService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OverrideClrStringsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OverrideClrStringsDirective, "clr-stepper-panel [appfxOverrideClrStrings]", never, { "appfxOverrideClrStrings": { "alias": "appfxOverrideClrStrings"; "required": false; }; }, {}, never, never, false, never>;
}

declare class RequiredFieldLegendComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<RequiredFieldLegendComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RequiredFieldLegendComponent, "appfx-required-field-legend", never, {}, {}, never, never, false, never>;
}

declare enum ZoomLevel {
    x2 = "zoom2x",
    x4 = "zoom4x",
    none = "no-zoom"
}

/**
 * Service for detecting zoom level based on document body size. Uses
 * ResizeObserver for detecting body size changes.
 * @private
 *  ResizeObserver spec: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
declare class ZoomLevelService implements OnDestroy {
    private document;
    private observer;
    private resizeSubject;
    private lastZoomLevel;
    /**
     * Emits when the zoom level is changed.
     *
     * NOTE: This observable emits <b>outside Angular</b>. You might need to explicitly invoke
     * <code>ChangeDetectorRef.detectChanges()</code> to trigger Angular change detection.
     */
    private _onChange;
    constructor(document: Document);
    get onChange(): Observable<ZoomLevel>;
    set onChange(value: Observable<ZoomLevel>);
    ngOnDestroy(): void;
    private observe;
    private unobserve;
    private detectZoomLevelChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZoomLevelService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ZoomLevelService>;
}

declare class ZoomLevelIndicatorDirective implements OnInit, OnDestroy {
    private zoomLevelService;
    zoomLevel: ZoomLevel;
    private subscription;
    constructor(zoomLevelService: ZoomLevelService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZoomLevelIndicatorDirective, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ZoomLevelIndicatorDirective, "[zoomLevelIndicator]", never, {}, {}, never, never, false, never>;
}

/**
 * Provides accessibility related services.
 */
declare class AppfxA11yModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxA11yModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxA11yModule, [typeof OverflowClrTabsDirective, typeof OverrideClrStringsDirective, typeof RequiredFieldLegendComponent, typeof ZoomLevelIndicatorDirective], [typeof i5.AppfxTranslateModule], [typeof OverflowClrTabsDirective, typeof OverrideClrStringsDirective, typeof RequiredFieldLegendComponent, typeof ZoomLevelIndicatorDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxA11yModule>;
}

export { AppfxA11yModule as A11yModule, AppfxA11yModule, ElementResizeService, OverflowClrTabsDirective, OverrideClrStringsDirective, RequiredFieldLegendComponent, ZoomLevel, ZoomLevelIndicatorDirective, ZoomLevelService, a11ykeys };
