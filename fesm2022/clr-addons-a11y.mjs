import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Directive, HostBinding, Inject, Injectable, Input, NgModule, Optional } from "@angular/core";
import * as i1 from "@clr/addons/translate";
import { AppfxTranslateModule, AppfxTranslateService, appfxTranslationsToken } from "@clr/addons/translate";
import * as i1$2 from "@clr/angular/stepper";
import * as i2 from "@clr/angular/utils";
import * as i1$1 from "@clr/angular/layout/tabs";
import { Observable, ReplaySubject, Subscription, merge, of } from "rxjs";
import { debounceTime, delay } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
const a11ykeys = {
	enter: "Enter",
	arrowLeft: "ArrowLeft",
	arrowRight: "ArrowRight"
};
var OverrideClrStringsDirective = class OverrideClrStringsDirective {
	constructor(clrPanel, clrCommonStringsService) {
		this.clrPanel = clrPanel;
		this.clrCommonStringsService = clrCommonStringsService;
		this.appfxOverrideClrStrings = {};
	}
	ngOnInit() {
		const copiedStrings = Object.assign({}, this.clrCommonStringsService.keys);
		if (copiedStrings["stepComplete"] && copiedStrings["stepError"]) return;
		const keys = Object.assign(copiedStrings, this.appfxOverrideClrStrings);
		this.clrPanel.commonStrings = { keys };
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: OverrideClrStringsDirective,
			deps: [{ token: i1$2.ClrStepperPanel }, { token: i2.ClrCommonStringsService }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: OverrideClrStringsDirective,
			isStandalone: false,
			selector: "clr-stepper-panel [appfxOverrideClrStrings]",
			inputs: { appfxOverrideClrStrings: "appfxOverrideClrStrings" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: OverrideClrStringsDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-stepper-panel [appfxOverrideClrStrings]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i1$2.ClrStepperPanel }, { type: i2.ClrCommonStringsService }],
	propDecorators: { appfxOverrideClrStrings: [{ type: Input }] }
});
var ElementResizeService = class ElementResizeService {
	getResizeObservable(element) {
		return new Observable((subscriber) => {
			const observer = new ResizeObserver(() => subscriber.next());
			observer.observe(element);
			return () => {
				observer.unobserve(element);
			};
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ElementResizeService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ElementResizeService,
			providedIn: "root"
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ElementResizeService,
	decorators: [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}]
});
const resources = {
	layoutChangesDebounceDuration: 10,
	initialLoadDelay: 250,
	clrTabLinkClasses: ["btn-link", "nav-link"],
	appfxSecondaryTabButtonClass: "appfx-tab-button"
};
var OverflowClrTabsDirective = class OverflowClrTabsDirective {
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
		const tabs = this.clrTabsComponent["tabs"];
		this.parentElement = this.renderer.parentNode(this.element.nativeElement);
		this.subscription.add(merge(tabs.changes, of(void 0).pipe(delay(resources.initialLoadDelay)), this.elementResizeService.getResizeObservable(this.parentElement)).pipe(debounceTime(resources.layoutChangesDebounceDuration)).subscribe(() => this.updateOverflowMenu(this.parentElement)));
	}
	patchOverflowContent() {
		Object.defineProperty(this.clrTabsComponent, "_tabOverflowEl", {
			get: () => this.tabOverflowEl,
			set: (el) => {
				this.tabOverflowEl = el;
				if (!this.tabOverflowEl) return;
				if (this.clrTabsComponent.tabLinkDirectives.every((tabLink) => tabLink.inOverflow)) {
					this.renderer.setStyle(this.tabOverflowEl, "left", 0);
					this.renderer.setStyle(this.tabOverflowEl, "position", "fixed");
					this.renderer.setStyle(this.tabOverflowEl, "top", "auto");
				}
			}
		});
	}
	updateOverflowMenu(container) {
		const tabLinks = this.clrTabsComponent.tabLinkDirectives;
		this.showAllTabs(tabLinks);
		const clrTabLinkMargin = this.calculateTabLinkMargin(tabLinks);
		this.updateTabsInOverflow(tabLinks, clrTabLinkMargin, container);
	}
	showAllTabs(tabLinks) {
		let overflowStateChanged = false;
		tabLinks.forEach((tabLink) => {
			if (tabLink.inOverflow) {
				overflowStateChanged = true;
				tabLink.inOverflow = false;
				this.addTabLinkClasses(tabLink);
			}
		});
		if (overflowStateChanged) this.cdr.detectChanges();
	}
	calculateTabLinkMargin(tabLinks) {
		if (tabLinks.length < 2) return 0;
		const firstLinkEl = tabLinks[0].el.nativeElement;
		return tabLinks[1].el.nativeElement.getBoundingClientRect().left - firstLinkEl.getBoundingClientRect().right;
	}
	updateTabsInOverflow(tabLinks, clrTabLinkMargin, container) {
		let areNextTabLinksOverflowing = false;
		tabLinks.forEach((tabLink) => {
			if (!areNextTabLinksOverflowing) tabLink.inOverflow = areNextTabLinksOverflowing = this.isTabLinkOverflowing(container, clrTabLinkMargin, tabLink);
			else tabLink.inOverflow = true;
			if (tabLink.inOverflow) this.removeTabLinkClasses(tabLink);
			else this.addTabLinkClasses(tabLink);
		});
		this.cdr.detectChanges();
	}
	isTabLinkOverflowing(container, clrTabLinkMargin, tabLink) {
		const containerBcr = container.getBoundingClientRect();
		return tabLink.el.nativeElement.getBoundingClientRect().right + clrTabLinkMargin > containerBcr.right - clrTabLinkMargin;
	}
	addTabLinkClasses(tabLink) {
		if (tabLink.el.nativeElement.classList.contains(resources.appfxSecondaryTabButtonClass)) return;
		resources.clrTabLinkClasses.forEach((cssClass) => this.renderer.addClass(tabLink.el.nativeElement, cssClass));
	}
	removeTabLinkClasses(tabLink) {
		resources.clrTabLinkClasses.forEach((cssClass) => this.renderer.removeClass(tabLink.el.nativeElement, cssClass));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: OverflowClrTabsDirective,
			deps: [
				{ token: i0.ChangeDetectorRef },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{ token: i1$1.ClrTabs },
				{ token: ElementResizeService }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: OverflowClrTabsDirective,
			isStandalone: false,
			selector: "clr-tabs [appfxOverflowTabs]",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: OverflowClrTabsDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-tabs [appfxOverflowTabs]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ChangeDetectorRef },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{ type: i1$1.ClrTabs },
		{ type: ElementResizeService }
	]
});
const translations = {
	en: {
		legendPrefix: "Fields marked with",
		legendSuffix: "are required"
	},
	es: {
		legendPrefix: "Campos marcados con",
		legendSuffix: "son obligatorios"
	},
	fr: {
		legendPrefix: "Champs marqués d'un",
		legendSuffix: "sont requis"
	},
	ja: {
		legendPrefix: "フィールドのマークに使用される条件",
		legendSuffix: "は必須です"
	}
};
var RequiredFieldLegendComponent = class RequiredFieldLegendComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RequiredFieldLegendComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: RequiredFieldLegendComponent,
			isStandalone: false,
			selector: "appfx-required-field-legend",
			providers: [AppfxTranslateService, {
				provide: appfxTranslationsToken,
				useValue: translations
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"legend-wrapper\">\n  <span>{{ 'legendPrefix' | translate }}</span>\n  <span class=\"icon-margin clr-required-mark\"></span>\n  <span>{{ 'legendSuffix' | translate }}</span>\n</div>\n",
			styles: [".legend-wrapper{display:inline-block;position:relative;height:1.5rem;font-style:italic}.legend-wrapper .icon-margin{margin-right:.3rem}\n"],
			dependencies: [{
				kind: "pipe",
				type: i1.TranslatePipe,
				name: "translate"
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: RequiredFieldLegendComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-required-field-legend",
			standalone: false,
			providers: [AppfxTranslateService, {
				provide: appfxTranslationsToken,
				useValue: translations
			}],
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"legend-wrapper\">\n  <span>{{ 'legendPrefix' | translate }}</span>\n  <span class=\"icon-margin clr-required-mark\"></span>\n  <span>{{ 'legendSuffix' | translate }}</span>\n</div>\n",
			styles: [".legend-wrapper{display:inline-block;position:relative;height:1.5rem;font-style:italic}.legend-wrapper .icon-margin{margin-right:.3rem}\n"]
		}]
	}]
});
var ZoomLevel;
(function(ZoomLevel) {
	ZoomLevel["x2"] = "zoom2x";
	ZoomLevel["x4"] = "zoom4x";
	ZoomLevel["none"] = "no-zoom";
})(ZoomLevel || (ZoomLevel = {}));
const zoomBreakpoints = [
	{
		zoomLevel: ZoomLevel.x4,
		maxWidth: 575
	},
	{
		zoomLevel: ZoomLevel.x2,
		maxWidth: 1199
	},
	{
		zoomLevel: ZoomLevel.none,
		maxWidth: Number.MAX_VALUE
	}
];
var ZoomLevelService = class ZoomLevelService {
	constructor(document) {
		this.document = document;
		this.resizeSubject = new ReplaySubject(1);
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
			if (!entry) return;
			this.detectZoomLevelChange(entry);
		});
		this.observer.observe(this.document.documentElement);
	}
	unobserve() {
		this.observer.unobserve(this.document.documentElement);
	}
	detectZoomLevelChange(entry) {
		const docCurrentWidth = entry.contentRect.width;
		const newResponsiveBreakpoint = zoomBreakpoints.find((breakpoint) => {
			return breakpoint.maxWidth >= docCurrentWidth;
		});
		if (newResponsiveBreakpoint?.zoomLevel === this.lastZoomLevel) return;
		this.lastZoomLevel = newResponsiveBreakpoint?.zoomLevel;
		this.resizeSubject.next(this.lastZoomLevel);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ZoomLevelService,
			deps: [{ token: DOCUMENT }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ZoomLevelService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ZoomLevelService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{
		type: Document,
		decorators: [{
			type: Inject,
			args: [DOCUMENT]
		}]
	}]
});
var ZoomLevelIndicatorDirective = class ZoomLevelIndicatorDirective {
	constructor(zoomLevelService) {
		this.zoomLevelService = zoomLevelService;
	}
	ngOnInit() {
		if (this.zoomLevelService) this.subscription = this.zoomLevelService.onChange.subscribe((v) => {
			this.zoomLevel = v;
		});
	}
	ngOnDestroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ZoomLevelIndicatorDirective,
			deps: [{
				token: ZoomLevelService,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ZoomLevelIndicatorDirective,
			isStandalone: false,
			selector: "[zoomLevelIndicator]",
			host: { properties: { "class": "this.zoomLevel" } },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ZoomLevelIndicatorDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[zoomLevelIndicator]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: ZoomLevelService,
		decorators: [{ type: Optional }]
	}],
	propDecorators: { zoomLevel: [{
		type: HostBinding,
		args: ["class"]
	}] }
});
var AppfxA11yModule = class AppfxA11yModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxA11yModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxA11yModule,
			declarations: [
				OverflowClrTabsDirective,
				OverrideClrStringsDirective,
				RequiredFieldLegendComponent,
				ZoomLevelIndicatorDirective
			],
			imports: [AppfxTranslateModule],
			exports: [
				OverflowClrTabsDirective,
				OverrideClrStringsDirective,
				RequiredFieldLegendComponent,
				ZoomLevelIndicatorDirective
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxA11yModule,
			providers: [ZoomLevelService],
			imports: [AppfxTranslateModule]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxA11yModule,
	decorators: [{
		type: NgModule,
		args: [{
			declarations: [
				OverflowClrTabsDirective,
				OverrideClrStringsDirective,
				RequiredFieldLegendComponent,
				ZoomLevelIndicatorDirective
			],
			imports: [AppfxTranslateModule],
			exports: [
				OverflowClrTabsDirective,
				OverrideClrStringsDirective,
				RequiredFieldLegendComponent,
				ZoomLevelIndicatorDirective
			],
			providers: [ZoomLevelService]
		}]
	}]
});
export { AppfxA11yModule as A11yModule, AppfxA11yModule, ElementResizeService, OverflowClrTabsDirective, OverrideClrStringsDirective, RequiredFieldLegendComponent, ZoomLevel, ZoomLevelIndicatorDirective, ZoomLevelService, a11ykeys };

//# sourceMappingURL=clr-addons-a11y.mjs.map