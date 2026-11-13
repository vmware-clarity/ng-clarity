import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, DOCUMENT, Directive, HostBinding, HostListener, Inject, Injectable, Input, NgModule, PLATFORM_ID, createComponent, linkedSignal, signal } from "@angular/core";
import { filter } from "rxjs/operators";
import { ReplaySubject, Subject } from "rxjs";
import * as i2 from "@clr/angular/utils";
import { ClrStandaloneCdkTrapFocus, LARGE_BREAKPOINT, commonStringsDefault } from "@clr/angular/utils";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ClarityIcons, ClrIcon, timesIcon } from "@clr/angular/icon";
import * as i1 from "@angular/router";
import { ClrDropdownModule } from "@clr/angular/popover/dropdown";
var ResponsiveNavCodes = class {
	static {
		this.NAV_LEVEL_1 = 1;
	}
	static {
		this.NAV_LEVEL_2 = 2;
	}
	static {
		this.NAV_CLOSE_ALL = "NAV_CLOSE_ALL";
	}
	static {
		this.NAV_OPEN = "NAV_OPEN";
	}
	static {
		this.NAV_CLOSE = "NAV_CLOSE";
	}
	static {
		this.NAV_TOGGLE = "NAV_TOGGLE";
	}
	static {
		this.NAV_CLASS_HAMBURGER_MENU = "open-hamburger-menu";
	}
	static {
		this.NAV_CLASS_OVERFLOW_MENU = "open-overflow-menu";
	}
	static {
		this.NAV_CLASS_TRIGGER_1 = "header-hamburger-trigger";
	}
	static {
		this.NAV_CLASS_TRIGGER_2 = "header-overflow-trigger";
	}
	static {
		this.NAV_CLASS_LEVEL_1 = "clr-nav-level-1";
	}
	static {
		this.NAV_CLASS_LEVEL_2 = "clr-nav-level-2";
	}
};
var ResponsiveNavControlMessage = class {
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
};
var ResponsiveNavigationService = class ResponsiveNavigationService {
	constructor() {
		this._responsiveNavList = signal([], {
			...ngDevMode ? { debugName: "_responsiveNavList" } : /* istanbul ignore next */ {},
			equal: () => false
		});
		this.registerNavSubject = new ReplaySubject();
		this.controlNavSubject = new Subject();
		this.closeAllNavs();
	}
	get responsiveNavList() {
		return this._responsiveNavList();
	}
	set responsiveNavList(value) {
		this._responsiveNavList.set(value);
	}
	get registeredNavs() {
		return this.registerNavSubject.asObservable();
	}
	get navControl() {
		return this.controlNavSubject.asObservable();
	}
	registerNav(navLevel) {
		if (!navLevel || this.isNavRegistered(navLevel)) return;
		const navList = this.responsiveNavList;
		navList.push(navLevel);
		if (navList.length > 2) console.error("More than 2 Nav Levels detected.");
		this._responsiveNavList.set(navList);
		this.registerNavSubject.next(navList);
	}
	isNavRegistered(navLevel) {
		if (this.responsiveNavList.indexOf(navLevel) > -1) {
			console.error("Multiple clr-nav-level " + navLevel + " attributes found. Please make sure that only one exists");
			return true;
		}
		return false;
	}
	unregisterNav(navLevel) {
		const index = this.responsiveNavList.indexOf(navLevel);
		if (index > -1) {
			const navList = this.responsiveNavList;
			navList.splice(index, 1);
			this._responsiveNavList.set(navList);
			this.registerNavSubject.next(navList);
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ResponsiveNavigationService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ResponsiveNavigationService,
			providedIn: "root"
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ResponsiveNavigationService,
	decorators: [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}],
	ctorParameters: () => []
});
var ClrHeader = class ClrHeader {
	constructor(responsiveNavService, commonStrings) {
		this.responsiveNavService = responsiveNavService;
		this.commonStrings = commonStrings;
		this.role = "banner";
		this.openNavLevel = null;
		this.responsiveNavCodes = ResponsiveNavCodes;
		this.navTriggers = linkedSignal(() => getNavTriggers(this.responsiveNavService.responsiveNavList), ...ngDevMode ? [{ debugName: "navTriggers" }] : /* istanbul ignore next */ []);
		this._subscription = responsiveNavService.navControl.pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE || controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL)).subscribe(() => {
			this.openNavLevel = null;
		});
	}
	get isNavLevel1OnPage() {
		return this.navTriggers().level1;
	}
	set isNavLevel1OnPage(value) {
		this.navTriggers.update((triggers) => ({
			...triggers,
			level1: value
		}));
	}
	get isNavLevel2OnPage() {
		return this.navTriggers().level2;
	}
	set isNavLevel2OnPage(value) {
		this.navTriggers.update((triggers) => ({
			...triggers,
			level2: value
		}));
	}
	get responsiveNavCommonString() {
		const myCommonStrings = this.commonStrings.keys;
		if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_1) return myCommonStrings.responsiveNavToggleOpen;
		else return myCommonStrings.responsiveNavToggleClose;
	}
	get responsiveOverflowCommonString() {
		const myCommonStrings = this.commonStrings.keys;
		if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_2) return myCommonStrings.responsiveNavOverflowOpen;
		else return myCommonStrings.responsiveNavOverflowClose;
	}
	resetNavTriggers() {
		this.navTriggers.set({
			level1: false,
			level2: false
		});
	}
	initializeNavTriggers(navList) {
		if (navList.length > 2) console.error("More than 2 Nav Levels detected.");
		this.navTriggers.set(getNavTriggers(navList));
	}
	closeOpenNav() {
		this.responsiveNavService.closeAllNavs();
	}
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrHeader,
			deps: [{ token: ResponsiveNavigationService }, { token: i2.ClrCommonStringsService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrHeader,
			isStandalone: false,
			selector: "clr-header",
			inputs: { role: "role" },
			host: { properties: {
				"class.header": "true",
				"attr.role": "this.role"
			} },
			ngImport: i0,
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
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrHeader,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-header",
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
			host: { "[class.header]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: ResponsiveNavigationService }, { type: i2.ClrCommonStringsService }],
	propDecorators: { role: [{ type: Input }, {
		type: HostBinding,
		args: ["attr.role"]
	}] }
});
function getNavTriggers(navList) {
	if (navList.length > 2) return {
		level1: false,
		level2: false
	};
	return {
		level1: navList.includes(ResponsiveNavCodes.NAV_LEVEL_1),
		level2: navList.includes(ResponsiveNavCodes.NAV_LEVEL_2)
	};
}
var ClrNavLevel = class ClrNavLevel {
	constructor(platformId, cdkTrapFocus, responsiveNavService, elementRef, renderer, injector, environmentInjector, appRef) {
		this.cdkTrapFocus = cdkTrapFocus;
		this.responsiveNavService = responsiveNavService;
		this.elementRef = elementRef;
		this.renderer = renderer;
		this.injector = injector;
		this.environmentInjector = environmentInjector;
		this.appRef = appRef;
		this._isOpen = false;
		if (isPlatformBrowser(platformId)) this._document = injector.get(DOCUMENT);
		this._subscription = responsiveNavService.navControl.pipe(filter((x) => x.navLevel === this.level), filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_OPEN && !this.isOpen || controlCode === ResponsiveNavCodes.NAV_CLOSE && this.isOpen)).subscribe(({ controlCode }) => {
			if (controlCode === ResponsiveNavCodes.NAV_OPEN) {
				this.open();
				return;
			}
			this.close();
		});
		this._subscription.add(responsiveNavService.navControl.pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL)).subscribe(() => this.close()));
	}
	get level() {
		return this._level;
	}
	get responsiveNavCodes() {
		return ResponsiveNavCodes;
	}
	get isOpen() {
		return this._isOpen;
	}
	ngOnInit() {
		this.cdkTrapFocus.enabled = false;
		if (!this.closeButtonAriaLabel) this.closeButtonAriaLabel = this._level === ResponsiveNavCodes.NAV_LEVEL_1 ? commonStringsDefault.responsiveNavToggleClose : commonStringsDefault.responsiveNavOverflowClose;
		if (this.level !== ResponsiveNavCodes.NAV_LEVEL_1 && this.level !== ResponsiveNavCodes.NAV_LEVEL_2) {
			console.error("Nav Level can only be 1 or 2");
			return;
		}
		this.responsiveNavService.registerNav(this.level);
		this.addNavClass(this.level);
	}
	ngAfterViewInit() {
		const closeButton = this.createCloseButton();
		this.renderer.listen(closeButton, "click", this.close.bind(this));
		this.renderer.insertBefore(this.elementRef.nativeElement, closeButton, this.elementRef.nativeElement.firstChild);
		if (this._document.body.clientWidth < LARGE_BREAKPOINT) this.close();
	}
	ngOnDestroy() {
		this.responsiveNavService.unregisterNav(this.level);
		this._subscription.unsubscribe();
	}
	onResize(event) {
		if (event.target.innerWidth < LARGE_BREAKPOINT && this.isOpen) {
			this.close();
			return;
		}
		this.showNavigation();
	}
	onMouseClick(target) {
		let current = target;
		const navHost = this.elementRef.nativeElement;
		while (current) {
			if (current === navHost) return;
			else if (current.classList.contains("nav-link") && this._document.body.clientWidth < LARGE_BREAKPOINT) {
				this.close();
				return;
			}
			current = current.parentNode;
		}
	}
	addNavClass(level) {
		const navHostClassList = this.elementRef.nativeElement.classList;
		if (level === ResponsiveNavCodes.NAV_LEVEL_1) navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_1);
		else if (level === ResponsiveNavCodes.NAV_LEVEL_2) navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_2);
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
		this.renderer.setAttribute(this.elementRef.nativeElement, "aria-hidden", "true");
		this.renderer.setAttribute(this.elementRef.nativeElement, "hidden", "true");
	}
	showNavigation() {
		this.renderer.setAttribute(this.elementRef.nativeElement, "aria-hidden", "false");
		this.renderer.removeAttribute(this.elementRef.nativeElement, "hidden");
	}
	hideCloseButton() {
		this.renderer.setAttribute(this.elementRef.nativeElement, "aria-hidden", "true");
		this.renderer.setAttribute(this.elementRef.nativeElement.querySelector(".clr-nav-close"), "hidden", "true");
	}
	showCloseButton() {
		this.renderer.setAttribute(this.elementRef.nativeElement.querySelector(".clr-nav-close"), "aria-hidden", "false");
		this.renderer.removeAttribute(this.elementRef.nativeElement.querySelector(".clr-nav-close"), "hidden");
	}
	createCloseButton() {
		ClarityIcons.addIcons(timesIcon);
		const closeButton = this._document.createElement("button");
		closeButton.setAttribute("aria-label", this.closeButtonAriaLabel);
		closeButton.setAttribute("aria-hidden", "true");
		closeButton.setAttribute("hidden", "true");
		closeButton.className = "clr-nav-close";
		const iconRef = createComponent(ClrIcon, {
			hostElement: this._document.createElement("cds-icon"),
			environmentInjector: this.environmentInjector,
			elementInjector: this.injector
		});
		iconRef.instance.shape = "times";
		iconRef.instance.size = "32";
		this.appRef.attachView(iconRef.hostView);
		closeButton.appendChild(iconRef.location.nativeElement);
		return closeButton;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrNavLevel,
			deps: [
				{ token: PLATFORM_ID },
				{ token: i2.ClrStandaloneCdkTrapFocus },
				{ token: ResponsiveNavigationService },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{ token: i0.Injector },
				{ token: i0.EnvironmentInjector },
				{ token: i0.ApplicationRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrNavLevel,
			isStandalone: false,
			selector: "[clr-nav-level]",
			inputs: {
				_level: ["clr-nav-level", "_level"],
				closeButtonAriaLabel: ["closeAriaLabel", "closeButtonAriaLabel"]
			},
			host: { listeners: {
				"window:resize": "onResize($event)",
				"click": "onMouseClick($event.target)"
			} },
			hostDirectives: [{ directive: i2.ClrStandaloneCdkTrapFocus }],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrNavLevel,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clr-nav-level]",
			hostDirectives: [ClrStandaloneCdkTrapFocus],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{ type: i2.ClrStandaloneCdkTrapFocus },
		{ type: ResponsiveNavigationService },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{ type: i0.Injector },
		{ type: i0.EnvironmentInjector },
		{ type: i0.ApplicationRef }
	],
	propDecorators: {
		_level: [{
			type: Input,
			args: ["clr-nav-level"]
		}],
		closeButtonAriaLabel: [{
			type: Input,
			args: ["closeAriaLabel"]
		}],
		onResize: [{
			type: HostListener,
			args: ["window:resize", ["$event"]]
		}],
		onMouseClick: [{
			type: HostListener,
			args: ["click", ["$event.target"]]
		}]
	}
});
var ClrAriaCurrentLink = class ClrAriaCurrentLink {
	constructor(rla) {
		this.rla = rla;
	}
	ngOnInit() {
		this.subscription = this.rla.isActiveChange.subscribe((isActive) => {
			this.ariaCurrent = isActive ? "page" : void 0;
		});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrAriaCurrentLink,
			deps: [{ token: i1.RouterLinkActive }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrAriaCurrentLink,
			isStandalone: false,
			selector: "[clrAriaCurrentLink]",
			host: { properties: { "attr.aria-current": "ariaCurrent" } },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrAriaCurrentLink,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrAriaCurrentLink]",
			host: { "[attr.aria-current]": "ariaCurrent" },
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i1.RouterLinkActive }]
});
const CLR_NAVIGATION_DIRECTIVES = [
	ClrHeader,
	ClrNavLevel,
	ClrAriaCurrentLink
];
var ClrNavigationModule = class ClrNavigationModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrNavigationModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrNavigationModule,
			declarations: [
				ClrHeader,
				ClrNavLevel,
				ClrAriaCurrentLink
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrDropdownModule
			],
			exports: [
				ClrHeader,
				ClrNavLevel,
				ClrAriaCurrentLink
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrNavigationModule,
			imports: [
				CommonModule,
				ClrIcon,
				ClrDropdownModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrNavigationModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrDropdownModule
			],
			declarations: [CLR_NAVIGATION_DIRECTIVES],
			exports: [CLR_NAVIGATION_DIRECTIVES]
		}]
	}]
});
export { CLR_NAVIGATION_DIRECTIVES, ClrAriaCurrentLink, ClrHeader, ClrNavLevel, ClrNavigationModule, ResponsiveNavCodes, ResponsiveNavControlMessage, ResponsiveNavigationService };

//# sourceMappingURL=clr-angular-layout-nav.mjs.map