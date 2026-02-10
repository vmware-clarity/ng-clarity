import * as i0 from '@angular/core';
import { NgModule, Directive, Injectable, Optional, Input, HostBinding, Component, DOCUMENT, PLATFORM_ID, HostListener, Inject, ViewChild, InjectionToken, ContentChild, ElementRef, ViewContainerRef, ContentChildren, EventEmitter, Output } from '@angular/core';
import { ClrBreadcrumbsModule as ClrBreadcrumbsModule$1 } from '@clr/angular/layout/breadcrumbs';
import { ClrMainContainerModule as ClrMainContainerModule$1 } from '@clr/angular/layout/main-container';
import * as i1 from '@clr/angular/layout/nav';
import { ClrNavigationModule as ClrNavigationModule$1, ResponsiveNavCodes as ResponsiveNavCodes$1 } from '@clr/angular/layout/nav';
import { ClrTabsModule as ClrTabsModule$1 } from '@clr/angular/layout/tabs';
import { ClrVerticalNavModule as ClrVerticalNavModule$1 } from '@clr/angular/layout/vertical-nav';
import * as i4 from '@angular/common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as i5 from '@clr/angular/icon';
import { ClrIcon, ClarityIcons, timesIcon, ellipsisHorizontalIcon, angleIcon, angleDoubleIcon } from '@clr/angular/icon';
import * as i1$1 from '@clr/angular/utils';
import { WillyWonka, OompaLoompa, commonStringsDefault, LARGE_BREAKPOINT, ClrStandaloneCdkTrapFocus, IF_ACTIVE_ID, TemplateRefContainer, IF_ACTIVE_ID_PROVIDER, ClrKeyFocus, IfActiveService, ClrConditionalModule, ClrTemplateRefModule, ClrKeyFocusModule, IfExpandService, uniqueIdFactory, ClrFocusOnViewInitModule, ClrHostWrappingModule } from '@clr/angular/utils';
import { ReplaySubject, Subject, fromEvent } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import * as i1$2 from '@angular/router';
import { RouterModule } from '@angular/router';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import * as i2 from '@clr/angular/popover/common';
import { ClrPopoverHostDirective } from '@clr/angular/popover/common';
import { trigger, state, transition, style, animate } from '@angular/animations';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrLayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrLayoutModule, exports: [ClrMainContainerModule$1, ClrNavigationModule$1, ClrTabsModule$1, ClrVerticalNavModule$1, ClrBreadcrumbsModule$1] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLayoutModule, imports: [ClrMainContainerModule$1, ClrNavigationModule$1, ClrTabsModule$1, ClrVerticalNavModule$1, ClrBreadcrumbsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrMainContainerModule$1, ClrNavigationModule$1, ClrTabsModule$1, ClrVerticalNavModule$1, ClrBreadcrumbsModule$1],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrMainContainer {
    constructor(elRef, responsiveNavService) {
        this.elRef = elRef;
        this.responsiveNavService = responsiveNavService;
    }
    ngOnInit() {
        this._classList = this.elRef.nativeElement.classList;
        this._subscription = this.responsiveNavService.navControl.subscribe({
            next: (message) => {
                this.processMessage(message);
            },
        });
    }
    processMessage(message) {
        let navClass = ResponsiveNavCodes$1.NAV_CLASS_HAMBURGER_MENU;
        if (message.controlCode === ResponsiveNavCodes$1.NAV_CLOSE_ALL) {
            this._classList.remove(ResponsiveNavCodes$1.NAV_CLASS_HAMBURGER_MENU);
            this._classList.remove(ResponsiveNavCodes$1.NAV_CLASS_OVERFLOW_MENU);
        }
        else if (message.navLevel === ResponsiveNavCodes$1.NAV_LEVEL_1) {
            this.controlNav(message.controlCode, navClass);
        }
        else if (message.navLevel === ResponsiveNavCodes$1.NAV_LEVEL_2) {
            navClass = ResponsiveNavCodes$1.NAV_CLASS_OVERFLOW_MENU;
            this.controlNav(message.controlCode, navClass);
        }
    }
    controlNav(controlCode, navClass) {
        if (controlCode === ResponsiveNavCodes$1.NAV_OPEN) {
            this._classList.add(navClass);
        }
        else if (controlCode === ResponsiveNavCodes$1.NAV_CLOSE) {
            this._classList.remove(navClass);
        }
        else if (controlCode === ResponsiveNavCodes$1.NAV_TOGGLE) {
            this._classList.toggle(navClass);
        }
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMainContainer, deps: [{ token: i0.ElementRef }, { token: i1.ResponsiveNavigationService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrMainContainer, isStandalone: false, selector: "clr-main-container", host: { properties: { "class.main-container": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMainContainer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-main-container',
                    host: { '[class.main-container]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.ResponsiveNavigationService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_LAYOUT_DIRECTIVES = [ClrMainContainer];
class ClrMainContainerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMainContainerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrMainContainerModule, declarations: [ClrMainContainer], imports: [CommonModule, ClrIcon], exports: [ClrMainContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMainContainerModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMainContainerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon],
                    declarations: [CLR_LAYOUT_DIRECTIVES],
                    exports: [CLR_LAYOUT_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MainContainerWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MainContainerWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: MainContainerWillyWonka, isStandalone: false, selector: "clr-main-container", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MainContainerWillyWonka, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-main-container',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ResponsiveNavCodes {
    static { this.NAV_LEVEL_1 = 1; }
    static { this.NAV_LEVEL_2 = 2; }
    static { this.NAV_CLOSE_ALL = 'NAV_CLOSE_ALL'; }
    static { this.NAV_OPEN = 'NAV_OPEN'; }
    static { this.NAV_CLOSE = 'NAV_CLOSE'; }
    static { this.NAV_TOGGLE = 'NAV_TOGGLE'; }
    static { this.NAV_CLASS_HAMBURGER_MENU = 'open-hamburger-menu'; }
    static { this.NAV_CLASS_OVERFLOW_MENU = 'open-overflow-menu'; }
    static { this.NAV_CLASS_TRIGGER_1 = 'header-hamburger-trigger'; }
    static { this.NAV_CLASS_TRIGGER_2 = 'header-overflow-trigger'; }
    static { this.NAV_CLASS_LEVEL_1 = 'clr-nav-level-1'; }
    static { this.NAV_CLASS_LEVEL_2 = 'clr-nav-level-2'; }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ResponsiveNavControlMessage {
    constructor(_controlCode, _navLevel) {
        this._controlCode = _controlCode;
        this._navLevel = _navLevel;
    }
    get controlCode() {
        return this._controlCode;
    }
    get navLevel() {
        return this._navLevel;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ResponsiveNavigationService {
    constructor() {
        this.responsiveNavList = [];
        this.registerNavSubject = new ReplaySubject();
        this.controlNavSubject = new Subject();
        this.closeAllNavs(); // We start with all navs closed
    }
    get registeredNavs() {
        return this.registerNavSubject.asObservable();
    }
    get navControl() {
        return this.controlNavSubject.asObservable();
    }
    registerNav(navLevel) {
        if (!navLevel || this.isNavRegistered(navLevel)) {
            return;
        }
        this.responsiveNavList.push(navLevel);
        this.registerNavSubject.next(this.responsiveNavList);
    }
    isNavRegistered(navLevel) {
        if (this.responsiveNavList.indexOf(navLevel) > -1) {
            console.error('Multiple clr-nav-level ' + navLevel + ' attributes found. Please make sure that only one exists');
            return true;
        }
        return false;
    }
    unregisterNav(navLevel) {
        const index = this.responsiveNavList.indexOf(navLevel);
        if (index > -1) {
            this.responsiveNavList.splice(index, 1);
            this.registerNavSubject.next(this.responsiveNavList);
        }
    }
    sendControlMessage(controlCode, navLevel) {
        const message = new ResponsiveNavControlMessage(controlCode, navLevel);
        this.controlNavSubject.next(message);
    }
    closeAllNavs() {
        const message = new ResponsiveNavControlMessage(ResponsiveNavCodes.NAV_CLOSE_ALL, -999);
        this.controlNavSubject.next(message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ResponsiveNavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ResponsiveNavigationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ResponsiveNavigationService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class NavDetectionOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, responsiveNavService) {
        if (!willyWonka) {
            throw new Error('clr-header should only be used inside of a clr-main-container');
        }
        super(cdr, willyWonka);
        this.responsiveNavService = responsiveNavService;
    }
    // NavDetectionOompaLoompa is the addition of the nav levels
    // Since we support 2 levels, the possibilities are 0, 1 or 3 (1 + 2)
    get flavor() {
        return this.responsiveNavService.responsiveNavList.reduce((sum, navLevel) => sum + navLevel, 0);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NavDetectionOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: MainContainerWillyWonka, optional: true }, { token: ResponsiveNavigationService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: NavDetectionOompaLoompa, isStandalone: false, selector: "clr-header", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NavDetectionOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-header',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: MainContainerWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: ResponsiveNavigationService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrHeader {
    constructor(responsiveNavService, commonStrings) {
        this.responsiveNavService = responsiveNavService;
        this.commonStrings = commonStrings;
        this.role = 'banner';
        this.isNavLevel1OnPage = false;
        this.isNavLevel2OnPage = false;
        this.openNavLevel = null;
        this.responsiveNavCodes = ResponsiveNavCodes;
        this._subscription = responsiveNavService.registeredNavs.subscribe({
            next: (navLevelList) => {
                this.initializeNavTriggers(navLevelList);
            },
        });
        this._subscription.add(responsiveNavService.navControl
            .pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE || controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL))
            .subscribe(() => {
            this.openNavLevel = null;
        }));
    }
    get responsiveNavCommonString() {
        const myCommonStrings = this.commonStrings.keys;
        if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_1) {
            return myCommonStrings.responsiveNavToggleOpen;
        }
        else {
            return myCommonStrings.responsiveNavToggleClose;
        }
    }
    get responsiveOverflowCommonString() {
        const myCommonStrings = this.commonStrings.keys;
        if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_2) {
            return myCommonStrings.responsiveNavOverflowOpen;
        }
        else {
            return myCommonStrings.responsiveNavOverflowClose;
        }
    }
    // reset triggers. handles cases when an application has different nav levels on different pages.
    resetNavTriggers() {
        this.isNavLevel1OnPage = false;
        this.isNavLevel2OnPage = false;
    }
    // decides which triggers to show on the header
    initializeNavTriggers(navList) {
        this.resetNavTriggers();
        if (navList.length > 2) {
            console.error('More than 2 Nav Levels detected.');
            return;
        }
        navList.forEach(navLevel => {
            if (navLevel === ResponsiveNavCodes.NAV_LEVEL_1) {
                this.isNavLevel1OnPage = true;
            }
            else if (navLevel === ResponsiveNavCodes.NAV_LEVEL_2) {
                this.isNavLevel2OnPage = true;
            }
        });
    }
    // closes the nav that is open
    closeOpenNav() {
        this.responsiveNavService.closeAllNavs();
    }
    /**
     * @deprecated Will be removed in with @clr/angular v15.0.0
     *
     * Use `openNav(navLevel)` instead to open the navigation and ResponsiveNavService to close it.
     */
    toggleNav(navLevel) {
        if (this.openNavLevel === navLevel) {
            this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, navLevel);
            return;
        }
        this.openNav(navLevel);
    }
    openNav(navLevel) {
        this.openNavLevel = navLevel;
        this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, navLevel);
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrHeader, deps: [{ token: ResponsiveNavigationService }, { token: i1$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrHeader, isStandalone: false, selector: "clr-header", inputs: { role: "role" }, host: { properties: { "class.header": "true", "attr.role": "this.role" } }, ngImport: i0, template: `
    @if (isNavLevel1OnPage) {
      <button
        type="button"
        class="header-hamburger-trigger"
        [attr.aria-label]="responsiveNavCommonString"
        (click)="openNav(responsiveNavCodes.NAV_LEVEL_1)"
      >
        <span></span>
      </button>
    }
    <ng-content></ng-content>
    @if (isNavLevel2OnPage) {
      <button
        type="button"
        class="header-overflow-trigger"
        [attr.aria-label]="responsiveOverflowCommonString"
        (click)="openNav(responsiveNavCodes.NAV_LEVEL_2)"
      >
        <span></span>
      </button>
    }
    <div class="header-backdrop" (click)="closeOpenNav()"></div>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrHeader, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-header',
                    template: `
    @if (isNavLevel1OnPage) {
      <button
        type="button"
        class="header-hamburger-trigger"
        [attr.aria-label]="responsiveNavCommonString"
        (click)="openNav(responsiveNavCodes.NAV_LEVEL_1)"
      >
        <span></span>
      </button>
    }
    <ng-content></ng-content>
    @if (isNavLevel2OnPage) {
      <button
        type="button"
        class="header-overflow-trigger"
        [attr.aria-label]="responsiveOverflowCommonString"
        (click)="openNav(responsiveNavCodes.NAV_LEVEL_2)"
      >
        <span></span>
      </button>
    }
    <div class="header-backdrop" (click)="closeOpenNav()"></div>
  `,
                    host: { '[class.header]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ResponsiveNavigationService }, { type: i1$1.ClrCommonStringsService }], propDecorators: { role: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.role']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const createCloseButton = (document, ariaLabel) => {
    ClarityIcons.addIcons(timesIcon);
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', ariaLabel);
    closeButton.setAttribute('aria-hidden', 'true');
    closeButton.innerHTML = `
    <cds-icon
      inner-offset="1"
      shape="times"
      size="32"
    ></cds-icon>
  `;
    /**
     * The button is hidden by default based on our Desktop-first approach.
     */
    closeButton.setAttribute('hidden', 'true');
    closeButton.className = 'clr-nav-close';
    return closeButton;
};
class ClrNavLevel {
    constructor(platformId, cdkTrapFocus, responsiveNavService, elementRef, renderer, injector) {
        this.cdkTrapFocus = cdkTrapFocus;
        this.responsiveNavService = responsiveNavService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._isOpen = false;
        if (isPlatformBrowser(platformId)) {
            this._document = injector.get(DOCUMENT);
        }
        this._subscription = responsiveNavService.navControl
            .pipe(filter(x => x.navLevel === this.level), filter(({ controlCode }) => (controlCode === ResponsiveNavCodes.NAV_OPEN && !this.isOpen) ||
            (controlCode === ResponsiveNavCodes.NAV_CLOSE && this.isOpen)))
            .subscribe(({ controlCode }) => {
            if (controlCode === ResponsiveNavCodes.NAV_OPEN) {
                this.open();
                return;
            }
            this.close();
        });
        this._subscription.add(responsiveNavService.navControl
            .pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL))
            .subscribe(() => this.close()));
    }
    get level() {
        return this._level;
    }
    // getter to access the responsive navigation codes from the template
    get responsiveNavCodes() {
        return ResponsiveNavCodes;
    }
    get isOpen() {
        return this._isOpen;
    }
    ngOnInit() {
        this.cdkTrapFocus.enabled = false;
        if (!this.closeButtonAriaLabel) {
            this.closeButtonAriaLabel =
                this._level === ResponsiveNavCodes.NAV_LEVEL_1
                    ? commonStringsDefault.responsiveNavToggleClose
                    : commonStringsDefault.responsiveNavOverflowClose;
        }
        if (this.level !== ResponsiveNavCodes.NAV_LEVEL_1 && this.level !== ResponsiveNavCodes.NAV_LEVEL_2) {
            console.error('Nav Level can only be 1 or 2');
            return;
        }
        this.responsiveNavService.registerNav(this.level);
        this.addNavClass(this.level);
    }
    ngAfterViewInit() {
        const closeButton = createCloseButton(this._document, this.closeButtonAriaLabel);
        this.renderer.listen(closeButton, 'click', this.close.bind(this));
        this.renderer.insertBefore(this.elementRef.nativeElement, closeButton, this.elementRef.nativeElement.firstChild); // Adding the button at the top of the nav
        if (this._document.body.clientWidth < LARGE_BREAKPOINT) {
            /**
             * Close if the document body is smaller than the large breakpoint for example:
             * - Refreshing the page
             * - Browser window size is changed when opening the applicaiton
             * - Browser zoom is turned on and zoomed to a size that makes the document smaller than the large breakpoint
             */
            this.close();
        }
    }
    ngOnDestroy() {
        this.responsiveNavService.unregisterNav(this.level);
        this._subscription.unsubscribe();
    }
    onResize(event) {
        const target = event.target;
        if (target.innerWidth < LARGE_BREAKPOINT && this.isOpen) {
            this.close();
            return;
        }
        this.showNavigation();
    }
    // TODO: Figure out whats the best way to do this. Possible methods
    // 1. HostListener (current solution)
    // 2. Directives on the .nav-link class. We discussed on moving away from class selectors but I forget the reason
    // why
    onMouseClick(target) {
        let current = target; // Get the element in the DOM on which the mouse was clicked
        const navHost = this.elementRef.nativeElement; // Get the current nav native HTML element
        // Start checking if current and navHost are equal.
        // If not traverse to the parentNode and check again.
        while (current) {
            if (current === navHost) {
                return;
            }
            else if (current.classList.contains('nav-link') && this._document.body.clientWidth < LARGE_BREAKPOINT) {
                this.close();
                return;
            }
            current = current.parentNode;
        }
    }
    addNavClass(level) {
        const navHostClassList = this.elementRef.nativeElement.classList;
        if (level === ResponsiveNavCodes.NAV_LEVEL_1) {
            navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_1);
        }
        else if (level === ResponsiveNavCodes.NAV_LEVEL_2) {
            navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_2);
        }
    }
    open() {
        this._isOpen = true;
        this.showNavigation();
        this.cdkTrapFocus.enabled = true;
        this.showCloseButton();
        this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, this.level);
    }
    close() {
        this._isOpen = false;
        this.hideNavigation();
        this.cdkTrapFocus.enabled = false;
        this.hideCloseButton();
        this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, this.level);
    }
    hideNavigation() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'true');
        this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', 'true');
    }
    showNavigation() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'false');
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'hidden');
    }
    hideCloseButton() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'true');
        this.renderer.setAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'hidden', 'true');
    }
    showCloseButton() {
        this.renderer.setAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'aria-hidden', 'false');
        this.renderer.removeAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'hidden');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNavLevel, deps: [{ token: PLATFORM_ID }, { token: i1$1.ClrStandaloneCdkTrapFocus }, { token: ResponsiveNavigationService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrNavLevel, isStandalone: false, selector: "[clr-nav-level]", inputs: { _level: ["clr-nav-level", "_level"], closeButtonAriaLabel: ["closeAriaLabel", "closeButtonAriaLabel"] }, host: { listeners: { "window:resize": "onResize($event)", "click": "onMouseClick($event.target)" } }, hostDirectives: [{ directive: i1$1.ClrStandaloneCdkTrapFocus }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNavLevel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clr-nav-level]',
                    hostDirectives: [ClrStandaloneCdkTrapFocus],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1$1.ClrStandaloneCdkTrapFocus }, { type: ResponsiveNavigationService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }], propDecorators: { _level: [{
                type: Input,
                args: ['clr-nav-level']
            }], closeButtonAriaLabel: [{
                type: Input,
                args: ['closeAriaLabel']
            }], onResize: [{
                type: HostListener,
                args: ['window:resize', ['$event']]
            }], onMouseClick: [{
                type: HostListener,
                args: ['click', ['$event.target']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAriaCurrentLink {
    constructor(rla) {
        this.rla = rla;
    }
    ngOnInit() {
        this.subscription = this.rla.isActiveChange.subscribe(isActive => {
            this.ariaCurrent = isActive ? 'page' : undefined;
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrAriaCurrentLink, deps: [{ token: i1$2.RouterLinkActive }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrAriaCurrentLink, isStandalone: false, selector: "[clrAriaCurrentLink]", host: { properties: { "attr.aria-current": "ariaCurrent" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrAriaCurrentLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrAriaCurrentLink]',
                    host: { '[attr.aria-current]': 'ariaCurrent' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.RouterLinkActive }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_NAVIGATION_DIRECTIVES = [
    ClrHeader,
    ClrNavLevel,
    ClrAriaCurrentLink,
    NavDetectionOompaLoompa,
    MainContainerWillyWonka,
];
class ClrNavigationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNavigationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrNavigationModule, declarations: [ClrHeader,
            ClrNavLevel,
            ClrAriaCurrentLink,
            NavDetectionOompaLoompa,
            MainContainerWillyWonka], imports: [CommonModule, ClrIcon, ClrDropdownModule], exports: [ClrHeader,
            ClrNavLevel,
            ClrAriaCurrentLink,
            NavDetectionOompaLoompa,
            MainContainerWillyWonka] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNavigationModule, imports: [CommonModule, ClrIcon, ClrDropdownModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNavigationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrDropdownModule],
                    declarations: [CLR_NAVIGATION_DIRECTIVES],
                    exports: [CLR_NAVIGATION_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var TabsLayout;
(function (TabsLayout) {
    TabsLayout["HORIZONTAL"] = "horizontal";
    TabsLayout["VERTICAL"] = "vertical";
})(TabsLayout || (TabsLayout = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TabsService {
    constructor() {
        this.layout = TabsLayout.HORIZONTAL;
        this._children = [];
    }
    get children() {
        return this._children;
    }
    get activeTab() {
        return this.children.find((tab) => {
            return tab.active;
        });
    }
    get overflowTabs() {
        if (this.layout === TabsLayout.VERTICAL) {
            return [];
        }
        else {
            return this.children.filter((tab) => tab.tabLink.inOverflow === true);
        }
    }
    register(tab) {
        this._children.push(tab);
    }
    unregister(tab) {
        const index = this.children.indexOf(tab);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbTabContentComponents = 0;
class ClrTabContent {
    constructor(ifActiveService, id, tabsService) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.tabsService = tabsService;
        if (!this.tabContentId) {
            this.tabContentId = 'clr-tab-content-' + nbTabContentComponents++;
        }
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    get ariaLabelledBy() {
        return this.tabsService.children.find(tab => tab.tabLink.id === this.id)?.tabLink?.tabLinkId;
    }
    // The template must be applied on the top-down phase of view-child initialization to prevent
    // components in the content from initializing before a content container exists.
    // Some child components need their container for sizing calculations.
    set templateRef(value) {
        this.viewRef = this.tabsService.tabContentViewContainer.createEmbeddedView(value);
    }
    ngOnDestroy() {
        const index = this.tabsService.tabContentViewContainer.indexOf(this.viewRef);
        if (index > -1) {
            this.tabsService.tabContentViewContainer.remove(index);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabContent, deps: [{ token: i1$1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: TabsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabContent, isStandalone: false, selector: "clr-tab-content", inputs: { tabContentId: ["id", "tabContentId"] }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["tabContentProjectedRef"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab-content',
                    template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `,
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: TabsService }], propDecorators: { tabContentId: [{
                type: Input,
                args: ['id']
            }], templateRef: [{
                type: ViewChild,
                args: ['tabContentProjectedRef', { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbTabsComponent = 0;
const TABS_ID = new InjectionToken('TABS_ID');
function tokenFactory() {
    return 'clr-tabs-' + nbTabsComponent++;
}
const TABS_ID_PROVIDER = {
    provide: TABS_ID,
    useFactory: tokenFactory,
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbTabLinkComponents = 0;
class ClrTabLink {
    constructor(ifActiveService, id, el, viewContainerRef, tabsService, tabsId) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.el = el;
        this.tabsService = tabsService;
        this.tabsId = tabsId;
        if (!this.tabLinkId) {
            this.tabLinkId = 'clr-tab-link-' + nbTabLinkComponents++;
        }
        // Tab links can be rendered in one of two places: in the main area or inside the overflow dropdown menu.
        // Here, we create a container so that its template can be used to create embeddedView on the fly.
        // See TabsService's renderView() method and how it's used in Tabs class for an example.
        this.templateRefContainer = viewContainerRef.createComponent(TemplateRefContainer, {
            projectableNodes: [[el.nativeElement]],
        }).instance;
    }
    get inOverflow() {
        return this._inOverflow && this.tabsService.layout !== TabsLayout.VERTICAL;
    }
    set inOverflow(inOverflow) {
        this._inOverflow = inOverflow;
    }
    get addLinkClasses() {
        return !this.inOverflow;
    }
    get ariaControls() {
        return this.tabsService.children.find(tab => tab.tabLink === this)?.tabContent?.tabContentId;
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    get tabindex() {
        return this.active ? 0 : -1;
    }
    activate() {
        this.ifActiveService.current = this.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabLink, deps: [{ token: i1$1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: TabsService }, { token: TABS_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabLink, isStandalone: false, selector: "[clrTabLink]", inputs: { tabLinkId: ["id", "tabLinkId"], inOverflow: ["clrTabLinkInOverflow", "inOverflow"] }, host: { attributes: { "role": "tab", "type": "button" }, listeners: { "click": "activate()" }, properties: { "class.btn": "true", "id": "this.tabLinkId", "class.btn-link": "this.addLinkClasses", "class.nav-link": "this.addLinkClasses", "attr.aria-controls": "this.ariaControls", "class.active": "this.active", "attr.aria-selected": "this.active", "attr.tabindex": "this.tabindex" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabLink]',
                    host: {
                        '[class.btn]': 'true',
                        role: 'tab',
                        type: 'button',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: TabsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [TABS_ID]
                }] }], propDecorators: { tabLinkId: [{
                type: Input,
                args: ['id']
            }, {
                type: HostBinding,
                args: ['id']
            }], inOverflow: [{
                type: Input,
                args: ['clrTabLinkInOverflow']
            }], addLinkClasses: [{
                type: HostBinding,
                args: ['class.btn-link']
            }, {
                type: HostBinding,
                args: ['class.nav-link']
            }], ariaControls: [{
                type: HostBinding,
                args: ['attr.aria-controls']
            }], active: [{
                type: HostBinding,
                args: ['class.active']
            }, {
                type: HostBinding,
                args: ['attr.aria-selected']
            }], tabindex: [{
                type: HostBinding,
                args: ['attr.tabindex']
            }], activate: [{
                type: HostListener,
                args: ['click']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTab {
    constructor(ifActiveService, id, tabsService) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.tabsService = tabsService;
        tabsService.register(this);
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    ngOnDestroy() {
        this.tabsService.unregister(this);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTab, deps: [{ token: i1$1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: TabsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTab, isStandalone: false, selector: "clr-tab", providers: [IF_ACTIVE_ID_PROVIDER], queries: [{ propertyName: "tabLink", first: true, predicate: ClrTabLink, descendants: true, static: true }, { propertyName: "tabContent", first: true, predicate: ClrTabContent, descendants: true, static: true }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTab, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab',
                    template: `<ng-content></ng-content>`,
                    providers: [IF_ACTIVE_ID_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: TabsService }], propDecorators: { tabLink: [{
                type: ContentChild,
                args: [ClrTabLink, { static: true }]
            }], tabContent: [{
                type: ContentChild,
                args: [ClrTabContent, { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabAction {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabAction, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabAction, isStandalone: false, selector: "[clrTabAction]", host: { attributes: { "tabindex": "0" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabAction, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabAction]',
                    host: {
                        tabindex: '0',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabOverflowContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabOverflowContent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabOverflowContent, isStandalone: false, selector: "clr-tab-overflow-content", host: { properties: { "class.dropdown-menu": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabOverflowContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab-overflow-content',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.dropdown-menu]': 'true',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabs {
    constructor(ifActiveService, popoverService, tabsService, tabsId, commonStrings) {
        this.ifActiveService = ifActiveService;
        this.popoverService = popoverService;
        this.tabsService = tabsService;
        this.tabsId = tabsId;
        this.commonStrings = commonStrings;
        this.tabLinkElements = [];
        // in order to check focus is triggered by click
        // we are using this _mousedown flag
        this._mousedown = false;
        this.subscriptions = [];
        this._tabLinkDirectives = [];
    }
    get layout() {
        return this.tabsService.layout;
    }
    set layout(layout) {
        if (Object.keys(TabsLayout)
            .map(key => {
            return TabsLayout[key];
        })
            .indexOf(layout) >= 0) {
            this.tabsService.layout = layout;
        }
    }
    get tabLinkDirectives() {
        return this._tabLinkDirectives;
    }
    get activeTabInOverflow() {
        return this.tabsService.overflowTabs.indexOf(this.tabsService.activeTab) > -1;
    }
    get activeTabPosition() {
        return this._tabLinkDirectives.findIndex(link => link.active);
    }
    get isCurrentInOverflow() {
        return this.keyFocus.current >= this.overflowPosition;
    }
    get isVertical() {
        return this.layout === TabsLayout.VERTICAL;
    }
    set tabOverflowEl(value) {
        this._tabOverflowEl = value && value.nativeElement;
        if (this.popoverService.open && value) {
            // only when tab overflow view element is registered,
            // we need to move the focus to the first item
            this.keyFocus.focusCurrent();
        }
    }
    get overflowPosition() {
        return this._tabLinkDirectives.filter(link => !link.inOverflow).length;
    }
    set tabContentViewContainer(value) {
        this.tabsService.tabContentViewContainer = value;
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.listenForTabLinkChanges());
        this.subscriptions.push(this.listedForTabsActionsChanges());
        if (typeof this.ifActiveService.current === 'undefined' && this.tabLinkDirectives[0]) {
            this.tabLinkDirectives[0].activate();
        }
        // set initial current position
        this.keyFocus.current = this.activeTabPosition;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
    toggleOverflowOnPosition(position) {
        // we need to check current position to determine
        // whether we need to open the tab overflow or not
        this.popoverService.open = position >= this.overflowPosition;
    }
    resetKeyFocusCurrentToActive(event) {
        const keyFocusContainsFocus = this.keyFocus.nativeElement.contains(event.relatedTarget);
        if (!keyFocusContainsFocus && this.keyFocus.current !== this.activeTabPosition) {
            this.keyFocus.current = this.activeTabPosition;
        }
    }
    toggleOverflowOnClick() {
        if (this.isCurrentInOverflow && this.popoverService.open) {
            this.keyFocus.moveTo(this.overflowPosition - 1);
        }
        else {
            this.keyFocus.moveTo(this.overflowPosition);
        }
        // once click handler completes running,
        // reset the _mousedown flag
        this._mousedown = false;
    }
    openOverflowOnFocus() {
        // This method should be called only on keyboard generated focus
        // when the active tab is in the overflow
        if (!this._mousedown && !this.popoverService.open) {
            this.keyFocus.moveTo(this.activeTabPosition);
        }
    }
    closeOnFocusOut(event) {
        if (!this._tabOverflowEl.contains(event.relatedTarget) &&
            this.popoverService.open &&
            !this._mousedown) {
            this.popoverService.open = false;
            // if the focus is out of overflow and lands on the active tab link
            // which is currently visible, set the key focus current to activeTabPosition
            if (this.tabLinkElements[this.activeTabPosition] === event.relatedTarget) {
                this.keyFocus.current = this.activeTabPosition;
            }
        }
    }
    closeOnEscapeKey() {
        // Move current to the last visible focusable item
        this.keyFocus.moveTo(this.overflowPosition - 1);
    }
    closeOnOutsideClick(event, tabOverflowTrigger) {
        // Exit early if the event target is the trigger element itself or element that's inside the trigger element.
        // This is because we have another handler on the tabOverflowTrigger element itself.
        // As this handler method is on the document level so the event bubbles up to it and conflicts
        // with the tabOverflowTrigger handler resulting in opening the tab overflow and closing it right away consecutively.
        const isTabsAction = this.tabsActions.some(action => action.nativeElement.contains(event.target));
        if (event.target === tabOverflowTrigger ||
            tabOverflowTrigger.contains(event.target) ||
            isTabsAction) {
            return;
        }
        // Move current to the last visible focusable item
        if (!this._tabOverflowEl.contains(event.target) && this.isCurrentInOverflow) {
            this.keyFocus.moveTo(this.overflowPosition - 1);
        }
    }
    setTabLinkElements() {
        this._tabLinkDirectives = this.tabs.map(tab => tab.tabLink);
        this.tabLinkElements = this._tabLinkDirectives.map(tab => tab.el.nativeElement);
        if (this.tabsActions && this.tabsActions) {
            this.tabLinkElements.push(...this.tabsActions.map(action => action.nativeElement));
        }
    }
    listenForTabLinkChanges() {
        return this.tabs.changes
            .pipe(startWith(this.tabs.map(tab => tab.tabLink)))
            .subscribe(() => this.setTabLinkElements());
    }
    listedForTabsActionsChanges() {
        return this.tabsActions.changes.subscribe(() => this.setTabLinkElements());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabs, deps: [{ token: i1$1.IfActiveService }, { token: i2.ClrPopoverService }, { token: TabsService }, { token: TABS_ID }, { token: i1$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrTabs, isStandalone: false, selector: "clr-tabs", inputs: { layout: ["clrLayout", "layout"] }, host: { properties: { "class.tabs-vertical": "this.isVertical" } }, providers: [IfActiveService, TabsService, TABS_ID_PROVIDER], queries: [{ propertyName: "tabsActions", predicate: ClrTabAction, descendants: true, read: ElementRef }, { propertyName: "tabs", predicate: ClrTab }], viewQueries: [{ propertyName: "keyFocus", first: true, predicate: ClrKeyFocus, descendants: true, static: true }, { propertyName: "tabOverflowEl", first: true, predicate: ClrTabOverflowContent, descendants: true, read: ElementRef }, { propertyName: "tabContentViewContainer", first: true, predicate: ["tabContentViewContainer"], descendants: true, read: ViewContainerRef, static: true }], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ul
      class="nav"
      role="tablist"
      [clrKeyFocus]="tabLinkElements"
      clrDirection="both"
      (clrFocusChange)="toggleOverflowOnPosition($event)"
      (focusout)="resetKeyFocusCurrentToActive($event)"
    >
      <!--tab links-->
      @for (link of tabLinkDirectives; track link) {
        @if (link.tabsId === tabsId && !link.inOverflow) {
          <li role="presentation" class="nav-item">
            <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
          </li>
        }
      }
      @if (tabsService.overflowTabs.length > 0) {
        <div class="tabs-overflow bottom-right" role="presentation" [class.open]="popoverService.open">
          <li role="application" class="nav-item">
            <button
              #tabOverflowTrigger
              class="btn btn-link nav-link dropdown-toggle"
              type="button"
              aria-hidden="true"
              [attr.tabindex]="activeTabInOverflow && !popoverService.open ? 0 : -1"
              [class.active]="activeTabInOverflow"
              [class.open]="popoverService.open"
              (mousedown)="_mousedown = true"
              (focus)="openOverflowOnFocus()"
              (click)="toggleOverflowOnClick()"
              [attr.title]="commonStrings.keys.more"
            >
              <cds-icon
                shape="ellipsis-horizontal"
                [status]="popoverService.open ? 'info' : null"
                [attr.title]="commonStrings.keys.more"
              ></cds-icon>
            </button>
          </li>
          <!--tab links in overflow menu-->
          @if (popoverService.open) {
            <clr-tab-overflow-content
              (document:keydown.escape)="closeOnEscapeKey()"
              (document:click)="closeOnOutsideClick($event, tabOverflowTrigger)"
              (focusout)="closeOnFocusOut($event)"
            >
              @for (link of tabLinkDirectives; track link) {
                @if (link.tabsId === tabsId && link.inOverflow) {
                  <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
                }
              }
            </clr-tab-overflow-content>
          }
        </div>
      }
      <ng-content select="clr-tabs-actions"></ng-content>
    </ul>
    <ng-container #tabContentViewContainer></ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i1$1.ClrKeyFocus, selector: "[clrKeyFocus]", inputs: ["clrDirection", "clrFocusOnLoad", "clrKeyFocus"], outputs: ["clrFocusChange"] }, { kind: "component", type: ClrTabOverflowContent, selector: "clr-tab-overflow-content" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabs, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tabs',
                    template: `
    <ul
      class="nav"
      role="tablist"
      [clrKeyFocus]="tabLinkElements"
      clrDirection="both"
      (clrFocusChange)="toggleOverflowOnPosition($event)"
      (focusout)="resetKeyFocusCurrentToActive($event)"
    >
      <!--tab links-->
      @for (link of tabLinkDirectives; track link) {
        @if (link.tabsId === tabsId && !link.inOverflow) {
          <li role="presentation" class="nav-item">
            <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
          </li>
        }
      }
      @if (tabsService.overflowTabs.length > 0) {
        <div class="tabs-overflow bottom-right" role="presentation" [class.open]="popoverService.open">
          <li role="application" class="nav-item">
            <button
              #tabOverflowTrigger
              class="btn btn-link nav-link dropdown-toggle"
              type="button"
              aria-hidden="true"
              [attr.tabindex]="activeTabInOverflow && !popoverService.open ? 0 : -1"
              [class.active]="activeTabInOverflow"
              [class.open]="popoverService.open"
              (mousedown)="_mousedown = true"
              (focus)="openOverflowOnFocus()"
              (click)="toggleOverflowOnClick()"
              [attr.title]="commonStrings.keys.more"
            >
              <cds-icon
                shape="ellipsis-horizontal"
                [status]="popoverService.open ? 'info' : null"
                [attr.title]="commonStrings.keys.more"
              ></cds-icon>
            </button>
          </li>
          <!--tab links in overflow menu-->
          @if (popoverService.open) {
            <clr-tab-overflow-content
              (document:keydown.escape)="closeOnEscapeKey()"
              (document:click)="closeOnOutsideClick($event, tabOverflowTrigger)"
              (focusout)="closeOnFocusOut($event)"
            >
              @for (link of tabLinkDirectives; track link) {
                @if (link.tabsId === tabsId && link.inOverflow) {
                  <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
                }
              }
            </clr-tab-overflow-content>
          }
        </div>
      }
      <ng-content select="clr-tabs-actions"></ng-content>
    </ul>
    <ng-container #tabContentViewContainer></ng-container>
  `,
                    providers: [IfActiveService, TabsService, TABS_ID_PROVIDER],
                    hostDirectives: [ClrPopoverHostDirective],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$1.IfActiveService }, { type: i2.ClrPopoverService }, { type: TabsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [TABS_ID]
                }] }, { type: i1$1.ClrCommonStringsService }], propDecorators: { keyFocus: [{
                type: ViewChild,
                args: [ClrKeyFocus, { static: true }]
            }], tabsActions: [{
                type: ContentChildren,
                args: [ClrTabAction, { read: ElementRef, descendants: true }]
            }], tabs: [{
                type: ContentChildren,
                args: [ClrTab]
            }], layout: [{
                type: Input,
                args: ['clrLayout']
            }], isVertical: [{
                type: HostBinding,
                args: ['class.tabs-vertical']
            }], tabOverflowEl: [{
                type: ViewChild,
                args: [ClrTabOverflowContent, { read: ElementRef }]
            }], tabContentViewContainer: [{
                type: ViewChild,
                args: ['tabContentViewContainer', { static: true, read: ViewContainerRef }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabsActions {
    constructor() {
        this.position = 'right';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsActions, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabsActions, isStandalone: false, selector: "clr-tabs-actions", inputs: { position: "position" }, host: { properties: { "class.tabs-actions": "true", "attr.position": "this.position" } }, ngImport: i0, template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsActions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tabs-actions',
                    template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `,
                    host: {
                        '[class.tabs-actions]': 'true',
                    },
                    standalone: false,
                }]
        }], propDecorators: { position: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.position']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TabsWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: TabsWillyWonka, isStandalone: false, selector: "clr-tabs", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsWillyWonka, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-tabs',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ActiveOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, id, ifActive) {
        if (!willyWonka) {
            throw new Error('clrTabLink and clr-tab-content should only be used inside of a clr-tabs');
        }
        super(cdr, willyWonka);
        this.ifActive = ifActive;
        this.id = id;
    }
    get flavor() {
        return this.ifActive.current === this.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ActiveOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: TabsWillyWonka, optional: true }, { token: IF_ACTIVE_ID }, { token: i1$1.IfActiveService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ActiveOompaLoompa, isStandalone: false, selector: "[clrTabLink], clr-tab-content", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ActiveOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabLink], clr-tab-content',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: TabsWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i1$1.IfActiveService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_TABS_DIRECTIVES = [
    ClrTabContent,
    ClrTab,
    ClrTabs,
    ClrTabOverflowContent,
    ClrTabLink,
    ClrTabAction,
    ClrTabsActions,
    TabsWillyWonka,
    ActiveOompaLoompa,
];
class ClrTabsModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisHorizontalIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, declarations: [ClrTabContent,
            ClrTab,
            ClrTabs,
            ClrTabOverflowContent,
            ClrTabLink,
            ClrTabAction,
            ClrTabsActions,
            TabsWillyWonka,
            ActiveOompaLoompa], imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule], exports: [ClrTabContent,
            ClrTab,
            ClrTabs,
            ClrTabOverflowContent,
            ClrTabLink,
            ClrTabAction,
            ClrTabsActions,
            TabsWillyWonka,
            ActiveOompaLoompa, ClrConditionalModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule, ClrConditionalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule],
                    declarations: [CLR_TABS_DIRECTIVES],
                    exports: [CLR_TABS_DIRECTIVES, ClrConditionalModule],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNavGroupChildren {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavGroupChildren, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrVerticalNavGroupChildren, isStandalone: false, selector: "clr-vertical-nav-group-children", ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavGroupChildren, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-vertical-nav-group-children',
                    template: `<ng-content></ng-content>`,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavGroupService {
    constructor() {
        this._expandChange = new Subject();
    }
    get expandChange() {
        return this._expandChange.asObservable();
    }
    expand() {
        this._expandChange.next(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavGroupService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavGroupService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavGroupService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavGroupRegistrationService {
    constructor() {
        this.navGroupCount = 0;
    }
    registerNavGroup() {
        this.navGroupCount++;
    }
    unregisterNavGroup() {
        this.navGroupCount--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavGroupRegistrationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavGroupRegistrationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavGroupRegistrationService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavService {
    constructor() {
        this._animateOnCollapsed = new Subject();
        this._collapsedChanged = new Subject();
        this._collapsed = false;
        this._collapsible = false;
    }
    get animateOnCollapsed() {
        return this._animateOnCollapsed.asObservable();
    }
    get collapsedChanged() {
        return this._collapsedChanged.asObservable();
    }
    get collapsed() {
        return this._collapsed;
    }
    set collapsed(value) {
        value = !!value;
        if (this.collapsible && this._collapsed !== value) {
            this.updateCollapseBehavior(value);
        }
    }
    get collapsible() {
        return this._collapsible;
    }
    set collapsible(value) {
        value = !!value;
        if (this._collapsible !== value) {
            if (!value && this.collapsed) {
                this.updateCollapseBehavior(false);
            }
            this._collapsible = value;
        }
    }
    updateCollapseBehavior(value) {
        this._animateOnCollapsed.next(value);
        this._collapsed = value;
        this._collapsedChanged.next(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const EXPANDED_STATE = 'expanded';
const COLLAPSED_STATE = 'collapsed';
class ClrVerticalNavGroup {
    constructor(_itemExpand, _navGroupRegistrationService, navGroupService, _navService, commonStrings) {
        this._itemExpand = _itemExpand;
        this._navGroupRegistrationService = _navGroupRegistrationService;
        this._navService = _navService;
        this.commonStrings = commonStrings;
        this.expandedChange = new EventEmitter(true);
        this.wasExpanded = false;
        this._subscriptions = [];
        this._expandAnimationState = COLLAPSED_STATE;
        _navGroupRegistrationService.registerNavGroup();
        // FIXME: This subscription handles a corner case
        // Vertical Nav collapse requires the animation to run first and then
        // remove the nodes from the DOM. If the user directly sets the input
        // on the clrIfExpanded directive, we have no chance to run the animation
        // and wait for it to complete. This subscription makes sure that the
        // animation states are correct for that edge case.
        this._subscriptions.push(_itemExpand.expandChange.subscribe(value => {
            if (value && this.expandAnimationState === COLLAPSED_STATE) {
                if (_navService.collapsed) {
                    _navService.collapsed = false;
                }
                this.expandAnimationState = EXPANDED_STATE;
            }
            else if (!value && this.expandAnimationState === EXPANDED_STATE) {
                this.expandAnimationState = COLLAPSED_STATE;
            }
        }));
        // 1. If the nav is collapsing, close the open nav group + save its state
        // 2. If the nav is expanding, expand the nav group if the previous state was expanded
        this._subscriptions.push(_navService.animateOnCollapsed.subscribe((goingToCollapse) => {
            if (goingToCollapse && this.expanded) {
                this.wasExpanded = true;
                this.expandAnimationState = COLLAPSED_STATE;
            }
            else if (!goingToCollapse && this.wasExpanded) {
                this.expandGroup();
                this.wasExpanded = false;
            }
        }));
        // If a link is clicked, expand the nav group
        this._subscriptions.push(navGroupService.expandChange.subscribe((expand) => {
            if (expand && !this.expanded) {
                this.expandGroup();
            }
        }));
    }
    get expanded() {
        return this._itemExpand.expanded;
    }
    set expanded(value) {
        if (this._itemExpand.expanded !== value) {
            this._itemExpand.expanded = value;
            this.expandedChange.emit(value);
        }
    }
    set userExpandedInput(value) {
        value = !!value;
        if (this.expanded !== value) {
            // We have to call toggleExpand because some cases require animations to occur first
            // Directly setting the Expand service value skips the animation and can result in
            // nodes in the DOM but the nav group still being collapsed
            this.toggleExpand();
        }
    }
    get expandAnimationState() {
        return this._expandAnimationState;
    }
    set expandAnimationState(value) {
        if (value !== this._expandAnimationState) {
            this._expandAnimationState = value;
        }
    }
    ngAfterContentInit() {
        // This makes sure that if someone marks a nav group expanded in a collapsed nav
        // the expanded property is switched back to collapsed state.
        if (this._navService.collapsed && this.expanded) {
            this.wasExpanded = true;
            this.expandAnimationState = COLLAPSED_STATE;
        }
    }
    ngOnDestroy() {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
        this._navGroupRegistrationService.unregisterNavGroup();
    }
    expandGroup() {
        this.expanded = true;
        // Expanded animation occurs after Expand.expand is set to true
        this.expandAnimationState = EXPANDED_STATE;
    }
    collapseGroup() {
        // If a Vertical Nav Group toggle button is clicked while the Vertical Nav is in Collapsed state,
        // the Vertical Nav should be expanded first.
        this.expandAnimationState = COLLAPSED_STATE;
    }
    // closes a group after the collapse animation
    expandAnimationDone($event) {
        if ($event.toState === COLLAPSED_STATE) {
            this.expanded = false;
        }
    }
    toggleExpand() {
        if (this.expanded) {
            this.collapseGroup();
        }
        else {
            // If nav is collasped, first open the nav
            if (this._navService.collapsed) {
                this._navService.collapsed = false;
            }
            // then expand the nav group
            this.expandGroup();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavGroup, deps: [{ token: i1$1.IfExpandService }, { token: VerticalNavGroupRegistrationService }, { token: VerticalNavGroupService }, { token: VerticalNavService }, { token: i1$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrVerticalNavGroup, isStandalone: false, selector: "clr-vertical-nav-group", inputs: { userExpandedInput: ["clrVerticalNavGroupExpanded", "userExpandedInput"] }, outputs: { expandedChange: "clrVerticalNavGroupExpandedChange" }, host: { properties: { "class.is-expanded": "this.expanded" }, classAttribute: "nav-group" }, providers: [IfExpandService, VerticalNavGroupService], ngImport: i0, template: "<!--\n~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<!--TODO: This animation needs to be added to the clr-vertical-nav-group-children component-->\n<div class=\"nav-group-children\" [@clrExpand]=\"expandAnimationState\" (@clrExpand.done)=\"expandAnimationDone($event)\">\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }], animations: [
            trigger('clrExpand', [
                state(EXPANDED_STATE, style({ height: '*' })),
                state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
                transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
            ]),
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavGroup, decorators: [{
            type: Component,
            args: [{ selector: 'clr-vertical-nav-group', providers: [IfExpandService, VerticalNavGroupService], animations: [
                        trigger('clrExpand', [
                            state(EXPANDED_STATE, style({ height: '*' })),
                            state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
                            transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
                        ]),
                    ], host: { class: 'nav-group' }, standalone: false, template: "<!--\n~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<!--TODO: This animation needs to be added to the clr-vertical-nav-group-children component-->\n<div class=\"nav-group-children\" [@clrExpand]=\"expandAnimationState\" (@clrExpand.done)=\"expandAnimationDone($event)\">\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1$1.IfExpandService }, { type: VerticalNavGroupRegistrationService }, { type: VerticalNavGroupService }, { type: VerticalNavService }, { type: i1$1.ClrCommonStringsService }], propDecorators: { expandedChange: [{
                type: Output,
                args: ['clrVerticalNavGroupExpandedChange']
            }], expanded: [{
                type: HostBinding,
                args: ['class.is-expanded']
            }], userExpandedInput: [{
                type: Input,
                args: ['clrVerticalNavGroupExpanded']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavIconService {
    constructor() {
        this._icons = 0;
    }
    get hasIcons() {
        return this._icons > 0;
    }
    registerIcon() {
        this._icons++;
    }
    unregisterIcon() {
        this._icons--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavIconService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavIconService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: VerticalNavIconService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNav {
    constructor(_navService, _navIconService, _navGroupRegistrationService, commonStrings) {
        this._navService = _navService;
        this._navIconService = _navIconService;
        this._navGroupRegistrationService = _navGroupRegistrationService;
        this.commonStrings = commonStrings;
        this.contentId = uniqueIdFactory();
        this._collapsedChanged = new EventEmitter(true);
        this._sub = _navService.collapsedChanged.subscribe(value => {
            this._collapsedChanged.emit(value);
        });
    }
    get collapsible() {
        return this._navService.collapsible;
    }
    set collapsible(value) {
        this._navService.collapsible = value;
    }
    get collapsed() {
        return this._navService.collapsed;
    }
    set collapsed(value) {
        this._navService.collapsed = value;
    }
    get hasNavGroups() {
        return this._navGroupRegistrationService.navGroupCount > 0;
    }
    get hasIcons() {
        return this._navIconService.hasIcons;
    }
    get ariaExpanded() {
        if (!this.collapsible) {
            return null;
        }
        return !this.collapsed ? 'true' : 'false';
    }
    ngOnDestroy() {
        this._sub.unsubscribe();
    }
    toggleByButton() {
        this.collapsed = !this.collapsed;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNav, deps: [{ token: VerticalNavService }, { token: VerticalNavIconService }, { token: VerticalNavGroupRegistrationService }, { token: i1$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrVerticalNav, isStandalone: false, selector: "clr-vertical-nav", inputs: { toggleLabel: ["clrVerticalNavToggleLabel", "toggleLabel"], collapsible: ["clrVerticalNavCollapsible", "collapsible"], collapsed: ["clrVerticalNavCollapsed", "collapsed"] }, outputs: { _collapsedChanged: "clrVerticalNavCollapsedChange" }, host: { properties: { "class.is-collapsed": "collapsed", "class.has-nav-groups": "hasNavGroups", "class.has-icons": "hasIcons" }, classAttribute: "clr-vertical-nav" }, providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService], ngImport: i0, template: "<!--\n~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n@if (collapsible) {\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n>\n  <cds-icon shape=\"angle-double\" class=\"nav-trigger-icon\" [direction]=\"(collapsed) ? 'right' : 'left'\"></cds-icon>\n</button>\n}\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  @if (collapsible && collapsed) {\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  ></button>\n  }\n</div>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNav, decorators: [{
            type: Component,
            args: [{ selector: 'clr-vertical-nav', providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService], host: {
                        class: 'clr-vertical-nav',
                        '[class.is-collapsed]': 'collapsed',
                        '[class.has-nav-groups]': 'hasNavGroups',
                        '[class.has-icons]': 'hasIcons',
                    }, standalone: false, template: "<!--\n~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n@if (collapsible) {\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n>\n  <cds-icon shape=\"angle-double\" class=\"nav-trigger-icon\" [direction]=\"(collapsed) ? 'right' : 'left'\"></cds-icon>\n</button>\n}\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  @if (collapsible && collapsed) {\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  ></button>\n  }\n</div>\n" }]
        }], ctorParameters: () => [{ type: VerticalNavService }, { type: VerticalNavIconService }, { type: VerticalNavGroupRegistrationService }, { type: i1$1.ClrCommonStringsService }], propDecorators: { toggleLabel: [{
                type: Input,
                args: ['clrVerticalNavToggleLabel']
            }], _collapsedChanged: [{
                type: Output,
                args: ['clrVerticalNavCollapsedChange']
            }], collapsible: [{
                type: Input,
                args: ['clrVerticalNavCollapsible']
            }], collapsed: [{
                type: Input,
                args: ['clrVerticalNavCollapsed']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNavLink {
    constructor(host, ref, navGroupService) {
        this.destroy$ = new Subject();
        // Note: since the `VerticalNavGroupService` is an optional provider, we'll setup the event
        // listener only when the `[clrVerticalLink]` is located within the `clr-vertical-nav-group`.
        navGroupService &&
            fromEvent(host.nativeElement, 'click')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                navGroupService.expand();
                ref.markForCheck();
            });
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavLink, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: VerticalNavGroupService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrVerticalNavLink, isStandalone: false, selector: "[clrVerticalNavLink]", host: { classAttribute: "nav-link" }, ngImport: i0, template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavLink, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrVerticalNavLink]',
                    template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `,
                    host: {
                        class: 'nav-link',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: VerticalNavGroupService, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [VerticalNavGroupService]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNavIcon {
    constructor(_verticalNavIconService) {
        this._verticalNavIconService = _verticalNavIconService;
        _verticalNavIconService.registerIcon();
    }
    ngOnDestroy() {
        this._verticalNavIconService.unregisterIcon();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavIcon, deps: [{ token: VerticalNavIconService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrVerticalNavIcon, isStandalone: false, selector: "[clrVerticalNavIcon]", host: { classAttribute: "nav-icon" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVerticalNavIcon]',
                    host: { class: 'nav-icon' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: VerticalNavIconService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_VERTICAL_NAV_DIRECTIVES = [
    ClrVerticalNav,
    ClrVerticalNavLink,
    ClrVerticalNavGroup,
    ClrVerticalNavGroupChildren,
    ClrVerticalNavIcon,
];
class ClrVerticalNavModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, angleDoubleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavModule, declarations: [ClrVerticalNav,
            ClrVerticalNavLink,
            ClrVerticalNavGroup,
            ClrVerticalNavGroupChildren,
            ClrVerticalNavIcon], imports: [CommonModule, ClrIcon, ClrConditionalModule, ClrFocusOnViewInitModule], exports: [ClrVerticalNav,
            ClrVerticalNavLink,
            ClrVerticalNavGroup,
            ClrVerticalNavGroupChildren,
            ClrVerticalNavIcon, ClrConditionalModule, ClrIcon, ClrFocusOnViewInitModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavModule, imports: [CommonModule, ClrIcon, ClrConditionalModule, ClrFocusOnViewInitModule, ClrConditionalModule, ClrFocusOnViewInitModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrVerticalNavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrConditionalModule, ClrFocusOnViewInitModule],
                    declarations: [CLR_VERTICAL_NAV_DIRECTIVES],
                    exports: [CLR_VERTICAL_NAV_DIRECTIVES, ClrConditionalModule, ClrIcon, ClrFocusOnViewInitModule],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const MAX_DISPLAY_ITEMS = 3;

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrBreadcrumbItem {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbItem, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrBreadcrumbItem, isStandalone: false, selector: "clr-breadcrumb-item", host: { properties: { "attr.role": "\"list-item\"" }, classAttribute: "clr-breadcrumb-item" }, ngImport: i0, template: '<ng-content />', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-breadcrumb-item',
                    template: '<ng-content />',
                    host: {
                        class: 'clr-breadcrumb-item',
                        '[attr.role]': '"list-item"',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrBreadcrumbs {
    constructor(commonStrings) {
        this.commonStrings = commonStrings;
        this.isExpanded = false;
        this.items = [];
        this.clrBreadcrumbItemClick = new EventEmitter();
        this.limit = MAX_DISPLAY_ITEMS;
        this.max = MAX_DISPLAY_ITEMS;
    }
    expand() {
        this.isExpanded = true;
        this.limit = this.items?.length;
    }
    handleItemClick(breadcrumb) {
        this.clrBreadcrumbItemClick.emit(breadcrumb);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbs, deps: [{ token: i1$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrBreadcrumbs, isStandalone: false, selector: "clr-breadcrumbs", inputs: { items: "items" }, outputs: { clrBreadcrumbItemClick: "clrBreadcrumbItemClick" }, host: { properties: { "attr.aria-label": "commonStrings.keys.breadcrumbsLabel", "attr.role": "\"navigation\"" }, classAttribute: "clr-breadcrumb" }, ngImport: i0, template: "@if (items?.length) {\n<div role=\"list\" class=\"clr-breadcrumb-menu\">\n  @if (items.length > max && !isExpanded) {\n  <clr-breadcrumb-item>\n    <button\n      [attr.aria-label]=\"commonStrings.keys.expandBreadcrumbsLabel\"\n      class=\"btn btn-link btn-sm clr-breadcrumb-expand\"\n      (click)=\"expand()\"\n      (keydown)=\"expand()\"\n    >\n      <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n    </button>\n  </clr-breadcrumb-item>\n  } @for (breadcrumb of items | slice: -limit : items.length; track breadcrumb; let isLastItem = $last) {\n  <clr-breadcrumb-item>\n    @if (isLastItem) {\n    <span aria-current=\"page\">{{ breadcrumb.label }}</span>\n    } @else { @if (breadcrumb.routerLink) {\n    <a\n      [routerLink]=\"breadcrumb.routerLink\"\n      [queryParams]=\"breadcrumb.queryParams\"\n      [target]=\"breadcrumb.target || '_self'\"\n      (click)=\"handleItemClick(breadcrumb)\"\n    >\n      {{ breadcrumb.label }}\n    </a>\n    } @if (breadcrumb.href) {\n    <a [href]=\"breadcrumb.href\" [target]=\"breadcrumb.target || '_self'\" (click)=\"handleItemClick(breadcrumb)\">\n      {{ breadcrumb.label }}\n    </a>\n    } }\n  </clr-breadcrumb-item>\n  }\n</div>\n}\n", styles: [":where(:root,:host),:where(:root,:host) [clr-density]{--clr-breadcrumb-item-space: var(--clr-base-gap-s)}.clr-breadcrumb-menu{display:flex;flex-wrap:wrap;align-items:center}.clr-breadcrumb-menu .clr-breadcrumb-item{display:flex;align-items:center;height:var(--clr-base-row-height-s);color:var(--cds-alias-typography-color-400);font-size:var(--clr-base-typography-font-size-inline);font-weight:var(--cds-alias-typography-secondary-font-weight);line-height:var(--clr-base-typography-line-height-16);letter-spacing:calc(-.1 * 1rem / var(--cds-global-base))}.clr-breadcrumb-menu .clr-breadcrumb-item a{text-decoration:none;text-align:center}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited{color:var(--clr-link-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:hover{color:var(--clr-link-hover-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:active{color:var(--clr-link-active-color)}.clr-breadcrumb-menu .clr-breadcrumb-item:not(:last-child):after{content:\"/\";margin:0 var(--clr-breadcrumb-item-space)}.clr-breadcrumb-menu .clr-breadcrumb-expand{height:var(--clr-base-icon-size-l);width:var(--clr-base-icon-size-l);min-height:var(--clr-base-icon-size-l);min-width:var(--clr-base-icon-size-l);margin:0;padding:0;gap:0}\n"], dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: ClrBreadcrumbItem, selector: "clr-breadcrumb-item" }, { kind: "pipe", type: i4.SlicePipe, name: "slice" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbs, decorators: [{
            type: Component,
            args: [{ selector: 'clr-breadcrumbs', host: {
                        class: 'clr-breadcrumb',
                        '[attr.aria-label]': 'commonStrings.keys.breadcrumbsLabel',
                        '[attr.role]': '"navigation"',
                    }, standalone: false, template: "@if (items?.length) {\n<div role=\"list\" class=\"clr-breadcrumb-menu\">\n  @if (items.length > max && !isExpanded) {\n  <clr-breadcrumb-item>\n    <button\n      [attr.aria-label]=\"commonStrings.keys.expandBreadcrumbsLabel\"\n      class=\"btn btn-link btn-sm clr-breadcrumb-expand\"\n      (click)=\"expand()\"\n      (keydown)=\"expand()\"\n    >\n      <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n    </button>\n  </clr-breadcrumb-item>\n  } @for (breadcrumb of items | slice: -limit : items.length; track breadcrumb; let isLastItem = $last) {\n  <clr-breadcrumb-item>\n    @if (isLastItem) {\n    <span aria-current=\"page\">{{ breadcrumb.label }}</span>\n    } @else { @if (breadcrumb.routerLink) {\n    <a\n      [routerLink]=\"breadcrumb.routerLink\"\n      [queryParams]=\"breadcrumb.queryParams\"\n      [target]=\"breadcrumb.target || '_self'\"\n      (click)=\"handleItemClick(breadcrumb)\"\n    >\n      {{ breadcrumb.label }}\n    </a>\n    } @if (breadcrumb.href) {\n    <a [href]=\"breadcrumb.href\" [target]=\"breadcrumb.target || '_self'\" (click)=\"handleItemClick(breadcrumb)\">\n      {{ breadcrumb.label }}\n    </a>\n    } }\n  </clr-breadcrumb-item>\n  }\n</div>\n}\n", styles: [":where(:root,:host),:where(:root,:host) [clr-density]{--clr-breadcrumb-item-space: var(--clr-base-gap-s)}.clr-breadcrumb-menu{display:flex;flex-wrap:wrap;align-items:center}.clr-breadcrumb-menu .clr-breadcrumb-item{display:flex;align-items:center;height:var(--clr-base-row-height-s);color:var(--cds-alias-typography-color-400);font-size:var(--clr-base-typography-font-size-inline);font-weight:var(--cds-alias-typography-secondary-font-weight);line-height:var(--clr-base-typography-line-height-16);letter-spacing:calc(-.1 * 1rem / var(--cds-global-base))}.clr-breadcrumb-menu .clr-breadcrumb-item a{text-decoration:none;text-align:center}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited{color:var(--clr-link-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:hover{color:var(--clr-link-hover-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:active{color:var(--clr-link-active-color)}.clr-breadcrumb-menu .clr-breadcrumb-item:not(:last-child):after{content:\"/\";margin:0 var(--clr-breadcrumb-item-space)}.clr-breadcrumb-menu .clr-breadcrumb-expand{height:var(--clr-base-icon-size-l);width:var(--clr-base-icon-size-l);min-height:var(--clr-base-icon-size-l);min-width:var(--clr-base-icon-size-l);margin:0;padding:0;gap:0}\n"] }]
        }], ctorParameters: () => [{ type: i1$1.ClrCommonStringsService }], propDecorators: { items: [{
                type: Input
            }], clrBreadcrumbItemClick: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrBreadcrumbsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbsModule, declarations: [ClrBreadcrumbs, ClrBreadcrumbItem], imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule], exports: [ClrBreadcrumbs, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbsModule, imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrBreadcrumbsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
                    exports: [ClrBreadcrumbs, ClrIcon],
                    imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_LAYOUT_DIRECTIVES, CLR_NAVIGATION_DIRECTIVES, CLR_TABS_DIRECTIVES, CLR_VERTICAL_NAV_DIRECTIVES, ClrAriaCurrentLink, ClrBreadcrumbItem, ClrBreadcrumbs, ClrBreadcrumbsModule, ClrHeader, ClrLayoutModule, ClrMainContainer, ClrMainContainerModule, ClrNavLevel, ClrNavigationModule, ClrTab, ClrTabAction, ClrTabContent, ClrTabLink, ClrTabOverflowContent, ClrTabs, ClrTabsActions, ClrTabsModule, ClrVerticalNav, ClrVerticalNavGroup, ClrVerticalNavGroupChildren, ClrVerticalNavIcon, ClrVerticalNavLink, ClrVerticalNavModule, MainContainerWillyWonka, NavDetectionOompaLoompa, ResponsiveNavCodes, ResponsiveNavControlMessage, ResponsiveNavigationService, ActiveOompaLoompa as ÇlrActiveOompaLoompa, TabsWillyWonka as ÇlrTabsWillyWonka };
//# sourceMappingURL=clr-angular-layout.mjs.map
