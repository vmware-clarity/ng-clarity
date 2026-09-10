import * as i0 from '@angular/core';
import { Input, Directive, Injectable, Component, Inject, HostBinding, Optional, NgModule } from '@angular/core';
import * as i1$2 from '@clr/addons/translate';
import { AppfxTranslateService, appfxTranslationsToken, AppfxTranslateModule } from '@clr/addons/translate';
import * as i1 from '@clr/angular/stepper';
import * as i2 from '@clr/angular/utils';
import * as i1$1 from '@clr/angular/layout/tabs';
import { Observable, Subscription, merge, of, ReplaySubject } from 'rxjs';
import { delay, debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Accessibility mode keys
 */
const a11ykeys = {
    enter: 'Enter',
    arrowLeft: 'ArrowLeft',
    arrowRight: 'ArrowRight',
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class OverrideClrStringsDirective {
    constructor(clrPanel, clrCommonStringsService) {
        this.clrPanel = clrPanel;
        this.clrCommonStringsService = clrCommonStringsService;
        this.appfxOverrideClrStrings = {};
    }
    ngOnInit() {
        const copiedStrings = Object.assign({}, this.clrCommonStringsService.keys);
        // TODO syuleymanovg: Remove this workaround after upgrading to Clarity 18.
        //
        // Clarity versions 16.4.0 and 17.1.0 introduced new `stepComplete` and `stepError` strings
        // to address accessibility (a11y) issues. Unfortunately, this change is a breaking change for AppFx.
        // For more details, see the related pull request: https://github.com/vmware-clarity/ng-clarity/pull/1334
        // If these strings are present, it indicates that the Clarity version is 16.4.0/17.1.0 or newer,
        // and no further string overriding is necessary.
        if (copiedStrings['stepComplete'] && copiedStrings['stepError']) {
            return;
        }
        const keys = Object.assign(copiedStrings, this.appfxOverrideClrStrings);
        this.clrPanel.commonStrings = {
            keys: keys,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OverrideClrStringsDirective, deps: [{ token: i1.ClrStepperPanel }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: OverrideClrStringsDirective, isStandalone: false, selector: "clr-stepper-panel [appfxOverrideClrStrings]", inputs: { appfxOverrideClrStrings: "appfxOverrideClrStrings" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OverrideClrStringsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-stepper-panel [appfxOverrideClrStrings]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.ClrStepperPanel }, { type: i2.ClrCommonStringsService }], propDecorators: { appfxOverrideClrStrings: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Abstracts the ResizeObserver to limit its API.
 */
class ElementResizeService {
    getResizeObservable(element) {
        return new Observable(subscriber => {
            const observer = new ResizeObserver(() => subscriber.next());
            observer.observe(element);
            return () => {
                observer.unobserve(element);
            };
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ElementResizeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ElementResizeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ElementResizeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const resources = {
    layoutChangesDebounceDuration: 10,
    initialLoadDelay: 250,
    clrTabLinkClasses: ['btn-link', 'nav-link'],
    appfxSecondaryTabButtonClass: 'appfx-tab-button',
};
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
class OverflowClrTabsDirective {
    constructor(cdr, element, renderer, clrTabsComponent, elementResizeService) {
        this.cdr = cdr;
        this.element = element;
        this.renderer = renderer;
        this.clrTabsComponent = clrTabsComponent;
        this.elementResizeService = elementResizeService;
        this.subscription = new Subscription();
    }
    ngAfterViewInit() {
        this.setup();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    setup() {
        this.patchOverflowContent();
        const tabs = this.clrTabsComponent['tabs'];
        this.parentElement = this.renderer.parentNode(this.element.nativeElement);
        this.subscription.add(merge(tabs.changes, of(undefined).pipe(delay(resources.initialLoadDelay)), this.elementResizeService.getResizeObservable(this.parentElement))
            .pipe(debounceTime(resources.layoutChangesDebounceDuration))
            .subscribe(() => this.updateOverflowMenu(this.parentElement)));
    }
    /**
     * When the More button (...) is clicked, ClrTabOverflowContent is displayed.
     * It is a dropdown with style 'bottom-right'. However when there is just one tab,
     * the overflow component overflows to the left of the viewport and is not visible.
     * This method overrides private field in ClrTabs - _tabOverflowEl - that is set when
     * the ClrTabOverflowContent is created. If all tabs are in overflow, then change the
     * style of &lt;clr-tab-overflow-content&gt; element so that it takes the entire width
     * of the viewport.
     */
    patchOverflowContent() {
        Object.defineProperty(this.clrTabsComponent, '_tabOverflowEl', {
            get: () => this.tabOverflowEl,
            set: (el) => {
                this.tabOverflowEl = el;
                if (!this.tabOverflowEl) {
                    return;
                }
                const tabLinks = this.clrTabsComponent.tabLinkDirectives;
                const allTabsInOverflow = tabLinks.every((tabLink) => tabLink.inOverflow);
                if (allTabsInOverflow) {
                    this.renderer.setStyle(this.tabOverflowEl, 'left', 0);
                    this.renderer.setStyle(this.tabOverflowEl, 'position', 'fixed');
                    this.renderer.setStyle(this.tabOverflowEl, 'top', 'auto');
                }
            },
        });
    }
    /**
     * Determine which tab links to be shelved into the overflow menu.
     */
    updateOverflowMenu(container) {
        const tabLinks = this.clrTabsComponent.tabLinkDirectives;
        this.showAllTabs(tabLinks);
        const clrTabLinkMargin = this.calculateTabLinkMargin(tabLinks);
        this.updateTabsInOverflow(tabLinks, clrTabLinkMargin, container);
    }
    showAllTabs(tabLinks) {
        let overflowStateChanged = false;
        // Move all tabs out of overflow, then update the underlying view to sync the shifted tabs.
        tabLinks.forEach((tabLink) => {
            if (tabLink.inOverflow) {
                overflowStateChanged = true;
                tabLink.inOverflow = false;
                // Hidden tabs are displayed, but their style is like regular button. They are
                // wider and this affect the overflow calculation. Temporary add link classes
                // for more precise width calculation.
                this.addTabLinkClasses(tabLink);
            }
        });
        // Trigger change detection only if the overflow of tabs was changed.
        if (overflowStateChanged) {
            this.cdr.detectChanges();
        }
    }
    calculateTabLinkMargin(tabLinks) {
        if (tabLinks.length < 2) {
            return 0;
        }
        const firstLinkEl = tabLinks[0].el.nativeElement;
        const secondLinkEl = tabLinks[1].el.nativeElement;
        return secondLinkEl.getBoundingClientRect().left - firstLinkEl.getBoundingClientRect().right;
    }
    updateTabsInOverflow(tabLinks, clrTabLinkMargin, container) {
        let areNextTabLinksOverflowing = false;
        tabLinks.forEach((tabLink) => {
            if (!areNextTabLinksOverflowing) {
                tabLink.inOverflow = areNextTabLinksOverflowing = this.isTabLinkOverflowing(container, clrTabLinkMargin, tabLink);
            }
            else {
                // presume and hide remaining tabs
                tabLink.inOverflow = true;
            }
            // Manually restore the classes that ClrTabLink adds to its parent button.
            // Change detection updates the visibility of the tabs, but does not
            // update the @HostBinding properly.
            if (tabLink.inOverflow) {
                this.removeTabLinkClasses(tabLink);
            }
            else {
                this.addTabLinkClasses(tabLink);
            }
        });
        // as tabs may have shifted position in/out of menu, synchronize view
        this.cdr.detectChanges();
    }
    isTabLinkOverflowing(container, clrTabLinkMargin, tabLink) {
        const containerBcr = container.getBoundingClientRect();
        const clrTabLinkEl = tabLink.el.nativeElement;
        const clrTabLinkElementBcr = clrTabLinkEl.getBoundingClientRect();
        // layout decision making process for showing or hiding a tab
        // include natural margin around tab and guarantee some inset padding for the "..." against right edge
        return clrTabLinkElementBcr.right + clrTabLinkMargin > containerBcr.right - clrTabLinkMargin;
    }
    addTabLinkClasses(tabLink) {
        const buttonClassList = tabLink.el.nativeElement.classList;
        if (buttonClassList.contains(resources.appfxSecondaryTabButtonClass)) {
            // when appfx tabs are rendered as secondary tabs, no need to adjust the tab link classes.
            return;
        }
        resources.clrTabLinkClasses.forEach((cssClass) => this.renderer.addClass(tabLink.el.nativeElement, cssClass));
    }
    removeTabLinkClasses(tabLink) {
        resources.clrTabLinkClasses.forEach((cssClass) => this.renderer.removeClass(tabLink.el.nativeElement, cssClass));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OverflowClrTabsDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1$1.ClrTabs }, { token: ElementResizeService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: OverflowClrTabsDirective, isStandalone: false, selector: "clr-tabs [appfxOverflowTabs]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OverflowClrTabsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-tabs [appfxOverflowTabs]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1$1.ClrTabs }, { type: ElementResizeService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const translations = {
    en: {
        legendPrefix: 'Fields marked with',
        legendSuffix: 'are required',
    },
    es: {
        legendPrefix: 'Campos marcados con',
        legendSuffix: 'son obligatorios',
    },
    fr: {
        legendPrefix: "Champs marqués d'un",
        legendSuffix: 'sont requis',
    },
    ja: {
        legendPrefix: 'フィールドのマークに使用される条件',
        legendSuffix: 'は必須です',
    },
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class RequiredFieldLegendComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RequiredFieldLegendComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: RequiredFieldLegendComponent, isStandalone: false, selector: "appfx-required-field-legend", providers: [
            AppfxTranslateService,
            {
                provide: appfxTranslationsToken,
                useValue: translations,
            },
        ], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"legend-wrapper\">\n  <span>{{ 'legendPrefix' | translate }}</span>\n  <span class=\"icon-margin clr-required-mark\"></span>\n  <span>{{ 'legendSuffix' | translate }}</span>\n</div>\n", styles: [".legend-wrapper{display:inline-block;position:relative;height:1.5rem;font-style:italic}.legend-wrapper .icon-margin{margin-right:.3rem}\n"], dependencies: [{ kind: "pipe", type: i1$2.TranslatePipe, name: "translate" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RequiredFieldLegendComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-required-field-legend', standalone: false, providers: [
                        AppfxTranslateService,
                        {
                            provide: appfxTranslationsToken,
                            useValue: translations,
                        },
                    ], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"legend-wrapper\">\n  <span>{{ 'legendPrefix' | translate }}</span>\n  <span class=\"icon-margin clr-required-mark\"></span>\n  <span>{{ 'legendSuffix' | translate }}</span>\n</div>\n", styles: [".legend-wrapper{display:inline-block;position:relative;height:1.5rem;font-style:italic}.legend-wrapper .icon-margin{margin-right:.3rem}\n"] }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Supported zoom levels are 200% and 400% with breakpoints based on
// Bootstrap responsive breakpoints:
// https://getbootstrap.com/docs/4.5/layout/overview/
// The mapping between zoom levels and Bootstrap breakpoints is:
// 400% = Bootstrap XS - <576px
// 200% = Bootstrap SM | MD | L - ≥576px
// none (no-zoom) = Bootstrap XL - ≥1200px
var ZoomLevel;
(function (ZoomLevel) {
    ZoomLevel["x2"] = "zoom2x";
    ZoomLevel["x4"] = "zoom4x";
    ZoomLevel["none"] = "no-zoom";
})(ZoomLevel || (ZoomLevel = {}));
const zoomBreakpoints = [
    {
        zoomLevel: ZoomLevel.x4,
        maxWidth: 575,
    },
    {
        zoomLevel: ZoomLevel.x2,
        maxWidth: 1199,
    },
    {
        zoomLevel: ZoomLevel.none,
        maxWidth: Number.MAX_VALUE,
    },
];

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Service for detecting zoom level based on document body size. Uses
 * ResizeObserver for detecting body size changes.
 * @private
 *  ResizeObserver spec: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
class ZoomLevelService {
    constructor(document) {
        this.document = document;
        this.resizeSubject = new ReplaySubject(1);
        /**
         * Emits when the zoom level is changed.
         *
         * NOTE: This observable emits <b>outside Angular</b>. You might need to explicitly invoke
         * <code>ChangeDetectorRef.detectChanges()</code> to trigger Angular change detection.
         */
        // debounceTime() operator is added to avoid the following error:
        // "ResizeObserver loop limit exceeded thrown"
        // This error means that ResizeObserver was not able to deliver all observations within
        // a single animation frame. This happens if a change detection is run inside the subscriber.
        this._onChange = this.resizeSubject.pipe(debounceTime(10));
        this.observe();
    }
    get onChange() {
        return this._onChange;
    }
    set onChange(value) {
        this._onChange = value;
    }
    ngOnDestroy() {
        this.unobserve();
        this.resizeSubject.complete();
    }
    observe() {
        this.observer = new ResizeObserver((entries) => {
            const entry = entries && entries[0];
            if (!entry) {
                return;
            }
            this.detectZoomLevelChange(entry);
        });
        this.observer.observe(this.document.documentElement);
    }
    unobserve() {
        this.observer.unobserve(this.document.documentElement);
    }
    detectZoomLevelChange(entry) {
        const docCurrentWidth = entry.contentRect.width;
        const newResponsiveBreakpoint = zoomBreakpoints.find(breakpoint => {
            return breakpoint.maxWidth >= docCurrentWidth;
        });
        if (newResponsiveBreakpoint?.zoomLevel === this.lastZoomLevel) {
            return;
        }
        this.lastZoomLevel = newResponsiveBreakpoint?.zoomLevel;
        this.resizeSubject.next(this.lastZoomLevel);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ZoomLevelService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ZoomLevelService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ZoomLevelService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ZoomLevelIndicatorDirective {
    constructor(zoomLevelService) {
        this.zoomLevelService = zoomLevelService;
    }
    ngOnInit() {
        if (this.zoomLevelService) {
            this.subscription = this.zoomLevelService.onChange.subscribe(v => {
                this.zoomLevel = v;
            });
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ZoomLevelIndicatorDirective, deps: [{ token: ZoomLevelService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ZoomLevelIndicatorDirective, isStandalone: false, selector: "[zoomLevelIndicator]", host: { properties: { "class": "this.zoomLevel" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ZoomLevelIndicatorDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[zoomLevelIndicator]', standalone: false }]
        }], ctorParameters: () => [{ type: ZoomLevelService, decorators: [{
                    type: Optional
                }] }], propDecorators: { zoomLevel: [{
                type: HostBinding,
                args: ['class']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Provides accessibility related services.
 */
class AppfxA11yModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxA11yModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxA11yModule, declarations: [OverflowClrTabsDirective,
            OverrideClrStringsDirective,
            RequiredFieldLegendComponent,
            ZoomLevelIndicatorDirective], imports: [AppfxTranslateModule], exports: [OverflowClrTabsDirective,
            OverrideClrStringsDirective,
            RequiredFieldLegendComponent,
            ZoomLevelIndicatorDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxA11yModule, providers: [ZoomLevelService], imports: [AppfxTranslateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxA11yModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        OverflowClrTabsDirective,
                        OverrideClrStringsDirective,
                        RequiredFieldLegendComponent,
                        ZoomLevelIndicatorDirective,
                    ],
                    imports: [AppfxTranslateModule],
                    exports: [
                        OverflowClrTabsDirective,
                        OverrideClrStringsDirective,
                        RequiredFieldLegendComponent,
                        ZoomLevelIndicatorDirective,
                    ],
                    providers: [ZoomLevelService],
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

export { AppfxA11yModule as A11yModule, AppfxA11yModule, ElementResizeService, OverflowClrTabsDirective, OverrideClrStringsDirective, RequiredFieldLegendComponent, ZoomLevel, ZoomLevelIndicatorDirective, ZoomLevelService, a11ykeys };
//# sourceMappingURL=clr-addons-a11y.mjs.map
