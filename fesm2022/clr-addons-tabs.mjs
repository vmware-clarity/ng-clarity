import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Directive, EventEmitter, Host, HostBinding, Input, NgModule, Optional, Output, Self, ViewChildren } from "@angular/core";
import * as i1$2 from "@clr/angular/layout/tabs";
import { ClrTabLink, ClrTabsModule } from "@clr/angular/layout/tabs";
import * as i3 from "@clr/addons/a11y";
import { A11yModule, ZoomLevel } from "@clr/addons/a11y";
import * as i1$1 from "@clr/addons/workflow/strings";
import * as i2 from "@clr/angular/icon";
import { ClrIcon } from "@clr/angular/icon";
import * as i1 from "@clr/addons/var";
import { AppfxWorkflowCoreModule, RelevanceService, StepContainer, TabLayout, WorkflowModelManager } from "@clr/addons/var";
import { ReplaySubject, Subject, Subscription, combineLatest, of } from "rxjs";
import { debounceTime, filter, map, shareReplay, switchMap, take, tap } from "rxjs/operators";
import * as i6 from "@angular/common";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
var IfTabActiveDirective = class IfTabActiveDirective {
	constructor(tab, renderer) {
		this.tab = tab;
		this.renderer = renderer;
		this.appfxIfTabActiveChange = new EventEmitter();
	}
	set activateTab(value) {
		if (value && this.tab.ifActiveService.current !== this.tab.id) this.tab.ifActiveService.current = this.tab.id;
	}
	ngOnInit() {
		this.subscription = this.tab.ifActiveService.currentChange.subscribe(() => {
			if (this.activeClass) try {
				if (this.tab.active) this.renderer.addClass(this.getTabLinkElement().nativeElement, this.activeClass);
				else this.renderer.removeClass(this.getTabLinkElement().nativeElement, this.activeClass);
			} catch (e) {
				console.error("Clarity library unable to provide `elementRef` on tabLink");
			}
			this.appfxIfTabActiveChange.emit(this.tab.active);
		});
	}
	ngOnDestroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
	getTabLinkElement() {
		return this.tab.tabLink["el"];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IfTabActiveDirective,
			deps: [{
				token: i1$2.ClrTab,
				host: true,
				self: true
			}, { token: i0.Renderer2 }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: IfTabActiveDirective,
			isStandalone: false,
			selector: "[appfxIfTabActive]",
			inputs: {
				activeClass: "activeClass",
				activateTab: "activateTab"
			},
			outputs: { appfxIfTabActiveChange: "appfxIfTabActiveChange" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: IfTabActiveDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[appfxIfTabActive]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: i1$2.ClrTab,
		decorators: [{ type: Host }, { type: Self }]
	}, { type: i0.Renderer2 }],
	propDecorators: {
		appfxIfTabActiveChange: [{ type: Output }],
		activeClass: [{ type: Input }],
		activateTab: [{ type: Input }]
	}
});
var TabLinksComponent = class TabLinksComponent {
	constructor(workflowStrings, cdr) {
		this.workflowStrings = workflowStrings;
		this.cdr = cdr;
		this.opened = false;
		this.openedChange = new EventEmitter();
		this.currentZoomLevel = ZoomLevel.none;
	}
	changeOpened(opened) {
		this.opened = opened;
		this.openedChange.emit(this.opened);
		this.cdr.detectChanges();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TabLinksComponent,
			deps: [{ token: i1$1.WorkflowStrings }, { token: i0.ChangeDetectorRef }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: TabLinksComponent,
			isStandalone: false,
			selector: "appfx-tab-links",
			inputs: {
				opened: "opened",
				title: "title"
			},
			outputs: { openedChange: "openedChange" },
			host: { properties: { "class.opened": "this.opened" } },
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<button class=\"btn-close-tabs\" [attr.aria-label]=\"workflowStrings.closeStepNavAriaLabel\" (click)=\"changeOpened(false)\">\n  <cds-icon direction=\"left\" shape=\"angle\" class=\"tabs-close\"></cds-icon>\n</button>\n\n<div class=\"nav-step-title-wrapper\">\n  <button class=\"btn-show-tabs\" [attr.aria-label]=\"workflowStrings.openStepNavAriaLabel\" (click)=\"changeOpened(true)\">\n    <cds-icon shape=\"bars\"></cds-icon>\n  </button>\n  <h3 class=\"nav-step-title\" [textContent]=\"title\"></h3>\n</div>\n",
			styles: [":host .btn-show-tabs{cursor:pointer;display:inline-flex;border:0;background:transparent;padding-left:0;padding-top:0}:host .btn-show-tabs cds-icon{height:1.2rem;width:1rem;fill:var(--cds-alias-typography-color-400)}:host .btn-close-tabs{cursor:pointer;display:none;border:0;background:transparent;padding-left:0;margin-top:-.1rem}:host .btn-close-tabs cds-icon{height:1.2rem;width:1rem;fill:var(--cds-alias-typography-color-400)}:host .nav-step-title-wrapper{display:inline-flex}:host .nav-step-title-wrapper .nav-step-title{margin:0;padding:0 .15rem}:host.opened .btn-show-tabs{display:none}:host.opened .btn-close-tabs{display:inline-block}:host.opened .nav-step-title-wrapper{display:none}\n"],
			dependencies: [{
				kind: "component",
				type: i2.ClrIcon,
				selector: "clr-icon, cds-icon",
				inputs: [
					"shape",
					"size",
					"direction",
					"flip",
					"solid",
					"status",
					"inverse",
					"badge",
					"innerOffset"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: TabLinksComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-tab-links",
			standalone: false,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<button class=\"btn-close-tabs\" [attr.aria-label]=\"workflowStrings.closeStepNavAriaLabel\" (click)=\"changeOpened(false)\">\n  <cds-icon direction=\"left\" shape=\"angle\" class=\"tabs-close\"></cds-icon>\n</button>\n\n<div class=\"nav-step-title-wrapper\">\n  <button class=\"btn-show-tabs\" [attr.aria-label]=\"workflowStrings.openStepNavAriaLabel\" (click)=\"changeOpened(true)\">\n    <cds-icon shape=\"bars\"></cds-icon>\n  </button>\n  <h3 class=\"nav-step-title\" [textContent]=\"title\"></h3>\n</div>\n",
			styles: [":host .btn-show-tabs{cursor:pointer;display:inline-flex;border:0;background:transparent;padding-left:0;padding-top:0}:host .btn-show-tabs cds-icon{height:1.2rem;width:1rem;fill:var(--cds-alias-typography-color-400)}:host .btn-close-tabs{cursor:pointer;display:none;border:0;background:transparent;padding-left:0;margin-top:-.1rem}:host .btn-close-tabs cds-icon{height:1.2rem;width:1rem;fill:var(--cds-alias-typography-color-400)}:host .nav-step-title-wrapper{display:inline-flex}:host .nav-step-title-wrapper .nav-step-title{margin:0;padding:0 .15rem}:host.opened .btn-show-tabs{display:none}:host.opened .btn-close-tabs{display:inline-block}:host.opened .nav-step-title-wrapper{display:none}\n"]
		}]
	}],
	ctorParameters: () => [{ type: i1$1.WorkflowStrings }, { type: i0.ChangeDetectorRef }],
	propDecorators: {
		opened: [{ type: Input }, {
			type: HostBinding,
			args: ["class.opened"]
		}],
		title: [{ type: Input }],
		openedChange: [{ type: Output }]
	}
});
const resources = { clarity: { tabLinkNavigationClasses: ["nav-link", "btn-link"] } };
var RenderAsButtonDirective = class RenderAsButtonDirective {
	constructor(clrTabLink, renderer, el) {
		this.clrTabLink = clrTabLink;
		this.renderer = renderer;
		this.el = el;
		this.renderAsButton = true;
	}
	ngOnChanges() {
		this.patchClarityStyles();
	}
	ngAfterViewInit() {
		this.patchClarityStyles();
	}
	patchClarityStyles() {
		const tabLinkElem = this.el.nativeElement;
		if (!tabLinkElem) {
			console.error("RenderAsButtonDirective: Unable to find the element");
			return;
		}
		if (this.clrTabLink.inOverflow) return;
		if (this.renderAsButton) resources.clarity.tabLinkNavigationClasses.forEach((css) => this.renderer.removeClass(tabLinkElem, css));
		else resources.clarity.tabLinkNavigationClasses.forEach((css) => this.renderer.addClass(tabLinkElem, css));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RenderAsButtonDirective,
			deps: [
				{
					token: i1$2.ClrTabLink,
					host: true
				},
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: RenderAsButtonDirective,
			isStandalone: false,
			selector: "[renderAsButton]",
			inputs: { renderAsButton: "renderAsButton" },
			usesOnChanges: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: RenderAsButtonDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[renderAsButton]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{
			type: i1$2.ClrTabLink,
			decorators: [{ type: Host }]
		},
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef }
	],
	propDecorators: { renderAsButton: [{ type: Input }] }
});
var TabsComponent = class TabsComponent {
	constructor(modelMgr, relevanceService, cdr, workflowStrings, configService, zoomLevelService) {
		this.modelMgr = modelMgr;
		this.relevanceService = relevanceService;
		this.cdr = cdr;
		this.workflowStrings = workflowStrings;
		this.configService = configService;
		this.zoomLevelService = zoomLevelService;
		this.loading = false;
		this.tabLayout = TabLayout.horizontal;
		this.showLoadingIndicator = true;
		this.autoCollapseTabLinks = true;
		this.showTabLinks = true;
		this.onModelChange = new EventEmitter();
		this.tabLinksOpenedChange = new EventEmitter();
		this.activeTabChange = new EventEmitter();
		this.errorIconVisibleList = [];
		this.TabLayout = TabLayout;
		this.currentZoomLevel = ZoomLevel.none;
		this.ZoomLevel = ZoomLevel;
		this.tabLinksOpened = false;
		this.activeTabStep = {};
		this.awaitingActivePageOnLoad$ = new ReplaySubject(1);
		this.componentAfterViewInit$ = new Subject();
		this.subscriptions = new Subscription();
		this.errorActivatingStep = false;
		this.stepsValidationMap = /* @__PURE__ */ new Map();
		this.subscriptions.add(modelMgr.loading$.pipe(debounceTime(10)).subscribe((loading) => this.loading = loading));
		this.subscriptions.add(modelMgr.onModelChange$.subscribe((changes) => {
			this.onModelChange.emit(changes);
		}));
	}
	get tabs() {
		return this.steps;
	}
	set tabs(steps) {
		this.relevanceService.steps = steps;
		this.relevanceService.checkComplete$().pipe(take(1)).subscribe((checkedSteps) => {
			this.steps = checkedSteps;
			this.activateFirstTab();
			this.modelMgr.steps = checkedSteps;
			this.onStepsOrModelChange();
		});
	}
	get model() {
		return this.tabsModel;
	}
	set model(tabsModel) {
		this.tabsModel = tabsModel;
		this.modelMgr.model = tabsModel;
		this.onStepsOrModelChange();
	}
	get tabsInternal() {
		return this.steps;
	}
	get isLoading() {
		return this.loading || this.relevanceService.loading || !!this.pagesContainers && this.pagesContainers.some((value) => !!value.step.modelInstance && !!value.step.modelInstance.loading);
	}
	get showTabNav() {
		return this.showTabLinks && (this.showAppfxTabLinks ? this.tabLinksOpened : true);
	}
	get showTabContent() {
		return !this.tabLinksOpened;
	}
	get showAppfxTabLinks() {
		return this.showTabLinks && this.autoCollapseTabLinks && this.isVerticalLayout && this.currentZoomLevel !== ZoomLevel.none;
	}
	get isReady() {
		let hasIncompletePage = false;
		if (this.pagesContainers) hasIncompletePage = this.pagesContainers.some((p) => !p.readyToComplete);
		return !(hasIncompletePage || this.isLoading || this.errorActivatingStep);
	}
	ngOnInit() {
		if (this.zoomLevelService) this.subscriptions.add(this.zoomLevelService.onChange.subscribe((level) => {
			this.currentZoomLevel = level;
			this.cdr.detectChanges();
		}));
	}
	ngOnChanges(changes) {
		if (changes.tabLayout) {
			this.isVerticalLayout = this.tabLayout === TabLayout.vertical;
			this.isSecondaryLayout = this.tabLayout === TabLayout.secondary;
			this.clrTabsLayout = this.isVerticalLayout ? TabLayout.vertical : TabLayout.horizontal;
		}
	}
	ngAfterViewInit() {
		if (this.pagesContainers.length) this.componentAfterViewInit$.next();
		else this.pagesContainers.changes.pipe(take(1)).subscribe(() => {
			this.componentAfterViewInit$.next();
		});
	}
	ngAfterContentInit() {
		this.subscriptions.add(combineLatest([this.componentAfterViewInit$, this.awaitingActivePageOnLoad$]).pipe(filter(() => !!this.pagesContainers), switchMap(([, pendingStep]) => this.modelMgr.injectPropertiesToPendingStep(pendingStep))).subscribe((result) => {
			this.errorActivatingStep = !!result.error;
			this.activateStep(result);
		}));
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
		this.stepsValidationMap.clear();
		this.modelMgr.destroy();
		this.relevanceService.destroy();
		this.unsubscribeRetry();
	}
	isTabActive(step) {
		return step === this.activeTabStep;
	}
	onStepActiveChange(step, isStepActive) {
		this.tabLinksOpened = false;
		this.tabLinksOpenedChange.emit(this.tabLinksOpened);
		if (isStepActive) {
			this.activeTabChange.emit(step);
			const previousStep = this.activeTabStep;
			this.validateStep(previousStep).pipe(tap(() => this.modelMgr.ejectPropertiesFromCurrentStep(previousStep)), take(1)).subscribe(() => {
				this.activeTabStep = step;
				this.awaitingActivePageOnLoad$.next(this.activeTabStep);
			});
		}
	}
	validateActiveTab$() {
		return this.validateStep(this.activeTabStep).pipe(tap(() => this.modelMgr.ejectPropertiesFromCurrentStep(this.activeTabStep)), switchMap((validationResult) => {
			return this.disableTabsContent ? of(true) : of(validationResult);
		}));
	}
	validate$() {
		return this.validateActiveTab$().pipe(switchMap(() => {
			const stepsValidate$ = this.disableTabsContent ? [of(true)] : Array.from(this.stepsValidationMap.values());
			this.loading = this.showLoadingIndicator;
			return combineLatest(stepsValidate$).pipe(map((values) => {
				if (this.disableTabsContent) return true;
				return values.every((value) => value);
			}), tap((isValid) => {
				this.loading = false;
				if (!isValid) this.navigateToTabWithErrors();
			}));
		}));
	}
	activateFirstTab() {
		if (this.steps?.length) {
			const firstNotSkippedStepIndex = this.steps.findIndex((item) => !item.isSkipped);
			if (firstNotSkippedStepIndex !== -1) {
				this.steps[firstNotSkippedStepIndex].instantiateLazy = false;
				this.activeTabStep = this.steps[firstNotSkippedStepIndex];
				this.activeTabChange.emit(this.activeTabStep);
			}
		}
	}
	navigateToTabWithErrors() {
		if (!this.pagesContainers) return;
		const activeStepIndex = this.tabs.indexOf(this.activeTabStep);
		if (activeStepIndex !== -1 && this.errorIconVisibleList[activeStepIndex]) return;
		const firstStepWithErrorsIndex = this.errorIconVisibleList.findIndex((value) => value);
		if (firstStepWithErrorsIndex === -1) return;
		const firstStepWithErrors = this.tabs[firstStepWithErrorsIndex];
		const firstPageWithErrorsIndex = this.pagesContainers.toArray().findIndex((item) => item.step === firstStepWithErrors);
		if (firstPageWithErrorsIndex !== -1) {
			this.tabLinks.toArray()[firstPageWithErrorsIndex].activate();
			this.activeTabChange.emit(firstStepWithErrors);
		}
	}
	activateStep(result) {
		this.unsubscribeRetry();
		const pendingPage = this.pagesContainers.find((item) => item.step === result.pendingStep);
		if (pendingPage) {
			if (result.error) this.retrySubscription = pendingPage.onRetry.pipe(take(1)).subscribe((step) => this.retryStepTransition(step));
			pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);
			this.cdr.detectChanges();
		}
	}
	validateStep(step) {
		if (this.disableTabsContent || !step) return of(true);
		const pageToValidate = this.pagesContainers.find((item) => item.step === step);
		if (pageToValidate) {
			const pageIndex = this.tabs.indexOf(step);
			const validate$ = pageToValidate.onCommit().pipe(shareReplay(1));
			this.stepsValidationMap.set(step, validate$);
			this.loading = true;
			return validate$.pipe(tap((success) => {
				this.errorIconVisibleList[pageIndex] = !success;
				this.loading = false;
			}));
		}
		return of(true);
	}
	onStepsOrModelChange() {
		if (!this.activeTabStep || !this.model) return;
		this.awaitingActivePageOnLoad$.next(this.activeTabStep);
	}
	unsubscribeRetry() {
		if (this.retrySubscription && !this.retrySubscription.closed) this.retrySubscription.unsubscribe();
	}
	retryStepTransition(step) {
		this.awaitingActivePageOnLoad$.next(step);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TabsComponent,
			deps: [
				{ token: i1.WorkflowModelManager },
				{ token: i1.RelevanceService },
				{ token: i0.ChangeDetectorRef },
				{ token: i1$1.WorkflowStrings },
				{ token: i1.WorkflowConfigurationService },
				{
					token: i3.ZoomLevelService,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: TabsComponent,
			isStandalone: false,
			selector: "appfx-tabs",
			inputs: {
				disableTabsContent: "disableTabsContent",
				loading: "loading",
				tabLayout: "tabLayout",
				showLoadingIndicator: "showLoadingIndicator",
				autoCollapseTabLinks: "autoCollapseTabLinks",
				showTabLinks: "showTabLinks",
				tabs: "tabs",
				model: "model"
			},
			outputs: {
				onModelChange: "onModelChange",
				tabLinksOpenedChange: "tabLinksOpenedChange",
				activeTabChange: "activeTabChange"
			},
			host: { properties: { "class.loading": "this.loading" } },
			providers: [RelevanceService, WorkflowModelManager],
			viewQueries: [{
				propertyName: "pagesContainers",
				predicate: StepContainer,
				descendants: true
			}, {
				propertyName: "tabLinks",
				predicate: ClrTabLink,
				descendants: true
			}],
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  class=\"appfx-tabs\"\n  [class.div-disabled]=\"isLoading\"\n  [ngClass]=\"tabLayout\"\n  [class.show-tab-nav]=\"showTabNav\"\n  [class.show-tab-content]=\"!tabLinksOpened\"\n>\n  <appfx-tab-links\n    #appfxTabLinks\n    *ngIf=\"showAppfxTabLinks\"\n    [(opened)]=\"tabLinksOpened\"\n    (openedChange)=\"tabLinksOpenedChange.emit($event)\"\n    [title]=\"activeTabStep.title\"\n  >\n  </appfx-tab-links>\n  <appfx-spinner\n    *ngIf=\"showLoadingIndicator && isLoading\"\n    [message]=\"workflowStrings.loading\"\n    [isModal]=\"false\"\n  ></appfx-spinner>\n  <clr-tabs\n    *ngIf=\"tabs\"\n    [clrLayout]=\"clrTabsLayout\"\n    appfxOverflowTabs\n    [ngClass]=\"{\n      'appfx-secondary-tabs': isSecondaryLayout,\n    }\"\n  >\n    <ng-container *ngFor=\"let step of tabsInternal; let stepIndex = index\">\n      <clr-tab\n        *ngIf=\"!step.isSkipped\"\n        appfxIfTabActive\n        [activeClass]=\"'activeTab'\"\n        [activateTab]=\"isTabActive(step)\"\n        (appfxIfTabActiveChange)=\"onStepActiveChange(step, $event)\"\n      >\n        <button\n          clrTabLink\n          [renderAsButton]=\"isSecondaryLayout\"\n          [ngClass]=\"{\n            'btn-primary': isSecondaryLayout && isTabActive(step),\n            'btn-sm appfx-tab-button': isSecondaryLayout,\n          }\"\n        >\n          {{ step.title }}\n          <cds-icon\n            *ngIf=\"errorIconVisibleList[stepIndex]\"\n            class=\"alert-icon\"\n            shape=\"exclamation-circle\"\n            status=\"danger\"\n            size=\"md\"\n          >\n          </cds-icon>\n        </button>\n        <clr-tab-content>\n          <appfx-step-container\n            [step]=\"step\"\n            [class.div-disabled]=\"disableTabsContent\"\n            class=\"content-container clr-flex-column\"\n          >\n          </appfx-step-container>\n        </clr-tab-content>\n      </clr-tab>\n    </ng-container>\n  </clr-tabs>\n</div>\n",
			styles: [".div-disabled{left:0;top:0;z-index:10;pointer-events:none;opacity:.5}:host{min-height:inherit;display:block}:host.loading{position:relative}:host ::ng-deep .tab-content{width:100%}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav{gap:0;box-shadow:none}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav li[role=presentation]:not(:first-of-type) button{border-top-left-radius:0;border-bottom-left-radius:0}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav li[role=presentation]:not(:last-of-type) button{border-top-right-radius:0;border-bottom-right-radius:0}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav [role=tab]{margin-left:0;margin-right:0}:host .appfx-tabs.show-tab-nav ::ng-deep .nav{display:flex}:host .appfx-tabs:not(.show-tab-nav) ::ng-deep .nav{display:none}:host .appfx-tabs appfx-step-container.content-container{width:100%}:host .appfx-tabs clr-tabs.tabs-vertical ::ng-deep>ul.nav button{white-space:normal;height:auto;line-height:1.2rem;min-height:1.8rem;border:none!important}\n", ":host .appfx-tabs.show-tab-content ::ng-deep .tab-content{display:flex}:host .appfx-tabs:not(.show-tab-content) ::ng-deep .tab-content{display:none}\n"],
			dependencies: [
				{
					kind: "component",
					type: i1.StepContainerComponent,
					selector: "appfx-step-container",
					inputs: ["step", "description"],
					outputs: ["onRetry"]
				},
				{
					kind: "component",
					type: i1.SpinnerComponent,
					selector: "appfx-spinner",
					inputs: [
						"message",
						"politeness",
						"isModal",
						"progressDetails",
						"showActionButton",
						"actionButtonLabel"
					],
					outputs: ["actionClick"]
				},
				{
					kind: "directive",
					type: i3.OverflowClrTabsDirective,
					selector: "clr-tabs [appfxOverflowTabs]"
				},
				{
					kind: "component",
					type: i1$2.ClrTabContent,
					selector: "clr-tab-content",
					inputs: ["id"]
				},
				{
					kind: "component",
					type: i1$2.ClrTab,
					selector: "clr-tab"
				},
				{
					kind: "component",
					type: i1$2.ClrTabs,
					selector: "clr-tabs",
					inputs: ["clrLayout"]
				},
				{
					kind: "directive",
					type: i1$2.ClrTabLink,
					selector: "[clrTabLink]",
					inputs: ["id", "clrTabLinkInOverflow"]
				},
				{
					kind: "component",
					type: i2.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i6.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "directive",
					type: i6.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "directive",
					type: i6.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				},
				{
					kind: "component",
					type: TabLinksComponent,
					selector: "appfx-tab-links",
					inputs: ["opened", "title"],
					outputs: ["openedChange"]
				},
				{
					kind: "directive",
					type: IfTabActiveDirective,
					selector: "[appfxIfTabActive]",
					inputs: ["activeClass", "activateTab"],
					outputs: ["appfxIfTabActiveChange"]
				},
				{
					kind: "directive",
					type: RenderAsButtonDirective,
					selector: "[renderAsButton]",
					inputs: ["renderAsButton"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: TabsComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-tabs",
			changeDetection: ChangeDetectionStrategy.Eager,
			standalone: false,
			providers: [RelevanceService, WorkflowModelManager],
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  class=\"appfx-tabs\"\n  [class.div-disabled]=\"isLoading\"\n  [ngClass]=\"tabLayout\"\n  [class.show-tab-nav]=\"showTabNav\"\n  [class.show-tab-content]=\"!tabLinksOpened\"\n>\n  <appfx-tab-links\n    #appfxTabLinks\n    *ngIf=\"showAppfxTabLinks\"\n    [(opened)]=\"tabLinksOpened\"\n    (openedChange)=\"tabLinksOpenedChange.emit($event)\"\n    [title]=\"activeTabStep.title\"\n  >\n  </appfx-tab-links>\n  <appfx-spinner\n    *ngIf=\"showLoadingIndicator && isLoading\"\n    [message]=\"workflowStrings.loading\"\n    [isModal]=\"false\"\n  ></appfx-spinner>\n  <clr-tabs\n    *ngIf=\"tabs\"\n    [clrLayout]=\"clrTabsLayout\"\n    appfxOverflowTabs\n    [ngClass]=\"{\n      'appfx-secondary-tabs': isSecondaryLayout,\n    }\"\n  >\n    <ng-container *ngFor=\"let step of tabsInternal; let stepIndex = index\">\n      <clr-tab\n        *ngIf=\"!step.isSkipped\"\n        appfxIfTabActive\n        [activeClass]=\"'activeTab'\"\n        [activateTab]=\"isTabActive(step)\"\n        (appfxIfTabActiveChange)=\"onStepActiveChange(step, $event)\"\n      >\n        <button\n          clrTabLink\n          [renderAsButton]=\"isSecondaryLayout\"\n          [ngClass]=\"{\n            'btn-primary': isSecondaryLayout && isTabActive(step),\n            'btn-sm appfx-tab-button': isSecondaryLayout,\n          }\"\n        >\n          {{ step.title }}\n          <cds-icon\n            *ngIf=\"errorIconVisibleList[stepIndex]\"\n            class=\"alert-icon\"\n            shape=\"exclamation-circle\"\n            status=\"danger\"\n            size=\"md\"\n          >\n          </cds-icon>\n        </button>\n        <clr-tab-content>\n          <appfx-step-container\n            [step]=\"step\"\n            [class.div-disabled]=\"disableTabsContent\"\n            class=\"content-container clr-flex-column\"\n          >\n          </appfx-step-container>\n        </clr-tab-content>\n      </clr-tab>\n    </ng-container>\n  </clr-tabs>\n</div>\n",
			styles: [".div-disabled{left:0;top:0;z-index:10;pointer-events:none;opacity:.5}:host{min-height:inherit;display:block}:host.loading{position:relative}:host ::ng-deep .tab-content{width:100%}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav{gap:0;box-shadow:none}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav li[role=presentation]:not(:first-of-type) button{border-top-left-radius:0;border-bottom-left-radius:0}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav li[role=presentation]:not(:last-of-type) button{border-top-right-radius:0;border-bottom-right-radius:0}:host ::ng-deep clr-tabs.appfx-secondary-tabs>ul.nav [role=tab]{margin-left:0;margin-right:0}:host .appfx-tabs.show-tab-nav ::ng-deep .nav{display:flex}:host .appfx-tabs:not(.show-tab-nav) ::ng-deep .nav{display:none}:host .appfx-tabs appfx-step-container.content-container{width:100%}:host .appfx-tabs clr-tabs.tabs-vertical ::ng-deep>ul.nav button{white-space:normal;height:auto;line-height:1.2rem;min-height:1.8rem;border:none!important}\n", ":host .appfx-tabs.show-tab-content ::ng-deep .tab-content{display:flex}:host .appfx-tabs:not(.show-tab-content) ::ng-deep .tab-content{display:none}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: i1.WorkflowModelManager },
		{ type: i1.RelevanceService },
		{ type: i0.ChangeDetectorRef },
		{ type: i1$1.WorkflowStrings },
		{ type: i1.WorkflowConfigurationService },
		{
			type: i3.ZoomLevelService,
			decorators: [{ type: Optional }]
		}
	],
	propDecorators: {
		disableTabsContent: [{ type: Input }],
		loading: [{ type: Input }, {
			type: HostBinding,
			args: ["class.loading"]
		}],
		tabLayout: [{ type: Input }],
		showLoadingIndicator: [{ type: Input }],
		autoCollapseTabLinks: [{ type: Input }],
		showTabLinks: [{ type: Input }],
		onModelChange: [{ type: Output }],
		tabLinksOpenedChange: [{ type: Output }],
		activeTabChange: [{ type: Output }],
		pagesContainers: [{
			type: ViewChildren,
			args: [StepContainer]
		}],
		tabLinks: [{
			type: ViewChildren,
			args: [ClrTabLink]
		}],
		tabs: [{ type: Input }],
		model: [{ type: Input }]
	}
});
const components = [
	TabsComponent,
	TabLinksComponent,
	IfTabActiveDirective
];
const clarityDependencies = [ClrTabsModule, ClrIcon];
const appfxDependencies = [AppfxWorkflowCoreModule, A11yModule];
var AppfxTabsModule = class AppfxTabsModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTabsModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTabsModule,
			declarations: [
				TabsComponent,
				TabLinksComponent,
				IfTabActiveDirective,
				RenderAsButtonDirective
			],
			imports: [
				AppfxWorkflowCoreModule,
				A11yModule,
				ClrTabsModule,
				ClrIcon,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			exports: [
				TabsComponent,
				TabLinksComponent,
				IfTabActiveDirective
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTabsModule,
			imports: [
				appfxDependencies,
				clarityDependencies,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxTabsModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				...appfxDependencies,
				...clarityDependencies,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			declarations: [...components, RenderAsButtonDirective],
			exports: [...components]
		}]
	}]
});
export { TabsComponent as AppfxTabsComponent, TabsComponent as Tabs, TabsComponent, AppfxTabsModule, IfTabActiveDirective as IfTabActive, IfTabActiveDirective, TabLinksComponent as TabLinks, TabLinksComponent };

//# sourceMappingURL=clr-addons-tabs.mjs.map