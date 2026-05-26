import * as i0 from '@angular/core';
import { Directive, Injectable, Optional, Input, HostBinding, Component, DOCUMENT, createComponent, PLATFORM_ID, HostListener, Inject, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/utils';
import { WillyWonka, OompaLoompa, commonStringsDefault, LARGE_BREAKPOINT, ClrStandaloneCdkTrapFocus } from '@clr/angular/utils';
import { ReplaySubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ClarityIcons, timesIcon, ClrIcon } from '@clr/angular/icon';
import * as i1$1 from '@angular/router';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MainContainerWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MainContainerWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: MainContainerWillyWonka, isStandalone: false, selector: "clr-main-container", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MainContainerWillyWonka, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ResponsiveNavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ResponsiveNavigationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ResponsiveNavigationService, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: NavDetectionOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: MainContainerWillyWonka, optional: true }, { token: ResponsiveNavigationService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: NavDetectionOompaLoompa, isStandalone: false, selector: "clr-header", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: NavDetectionOompaLoompa, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrHeader, deps: [{ token: ResponsiveNavigationService }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrHeader, isStandalone: false, selector: "clr-header", inputs: { role: "role" }, host: { properties: { "class.header": "true", "attr.role": "this.role" } }, ngImport: i0, template: `
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrHeader, decorators: [{
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
        }], ctorParameters: () => [{ type: ResponsiveNavigationService }, { type: i1.ClrCommonStringsService }], propDecorators: { role: [{
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
class ClrNavLevel {
    constructor(platformId, cdkTrapFocus, responsiveNavService, elementRef, renderer, injector, environmentInjector, appRef) {
        this.cdkTrapFocus = cdkTrapFocus;
        this.responsiveNavService = responsiveNavService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.injector = injector;
        this.environmentInjector = environmentInjector;
        this.appRef = appRef;
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
        const closeButton = this.createCloseButton();
        this.renderer.listen(closeButton, 'click', this.close.bind(this));
        this.renderer.insertBefore(this.elementRef.nativeElement, closeButton, this.elementRef.nativeElement.firstChild);
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
    createCloseButton() {
        ClarityIcons.addIcons(timesIcon);
        const closeButton = this._document.createElement('button');
        closeButton.setAttribute('aria-label', this.closeButtonAriaLabel);
        closeButton.setAttribute('aria-hidden', 'true');
        closeButton.setAttribute('hidden', 'true');
        closeButton.className = 'clr-nav-close';
        const iconRef = createComponent(ClrIcon, {
            hostElement: this._document.createElement('cds-icon'),
            environmentInjector: this.environmentInjector,
            elementInjector: this.injector,
        });
        iconRef.instance.shape = 'times';
        iconRef.instance.size = '32';
        this.appRef.attachView(iconRef.hostView);
        closeButton.appendChild(iconRef.location.nativeElement);
        return closeButton;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNavLevel, deps: [{ token: PLATFORM_ID }, { token: i1.ClrStandaloneCdkTrapFocus }, { token: ResponsiveNavigationService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i0.EnvironmentInjector }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrNavLevel, isStandalone: false, selector: "[clr-nav-level]", inputs: { _level: ["clr-nav-level", "_level"], closeButtonAriaLabel: ["closeAriaLabel", "closeButtonAriaLabel"] }, host: { listeners: { "window:resize": "onResize($event)", "click": "onMouseClick($event.target)" } }, hostDirectives: [{ directive: i1.ClrStandaloneCdkTrapFocus }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNavLevel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clr-nav-level]',
                    hostDirectives: [ClrStandaloneCdkTrapFocus],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.ClrStandaloneCdkTrapFocus }, { type: ResponsiveNavigationService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i0.EnvironmentInjector }, { type: i0.ApplicationRef }], propDecorators: { _level: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAriaCurrentLink, deps: [{ token: i1$1.RouterLinkActive }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrAriaCurrentLink, isStandalone: false, selector: "[clrAriaCurrentLink]", host: { properties: { "attr.aria-current": "ariaCurrent" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAriaCurrentLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrAriaCurrentLink]',
                    host: { '[attr.aria-current]': 'ariaCurrent' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$1.RouterLinkActive }] });

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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNavigationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrNavigationModule, declarations: [ClrHeader,
            ClrNavLevel,
            ClrAriaCurrentLink,
            NavDetectionOompaLoompa,
            MainContainerWillyWonka], imports: [CommonModule, ClrIcon, ClrDropdownModule], exports: [ClrHeader,
            ClrNavLevel,
            ClrAriaCurrentLink,
            NavDetectionOompaLoompa,
            MainContainerWillyWonka] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNavigationModule, imports: [CommonModule, ClrIcon, ClrDropdownModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNavigationModule, decorators: [{
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

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_NAVIGATION_DIRECTIVES, ClrAriaCurrentLink, ClrHeader, ClrNavLevel, ClrNavigationModule, MainContainerWillyWonka, NavDetectionOompaLoompa, ResponsiveNavCodes, ResponsiveNavControlMessage, ResponsiveNavigationService };
//# sourceMappingURL=clr-angular-layout-nav.mjs.map
