import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, EventEmitter, HostBinding, Inject, Injectable, Injector, Input, NgModule, Optional, Output, ViewChild, afterNextRender, inject } from "@angular/core";
import * as i1 from "@clr/angular/utils";
import { ClrConditionalModule, ClrFocusOnViewInitModule, IfExpandService, animateHeight, measureHeight, noopAnimations, uniqueIdFactory } from "@clr/angular/utils";
import { Subject, fromEvent } from "rxjs";
import * as i5 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleDoubleIcon, angleIcon } from "@clr/angular/icon";
import { takeUntil } from "rxjs/operators";
import { CommonModule } from "@angular/common";
var ClrVerticalNavGroupChildren = class ClrVerticalNavGroupChildren {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavGroupChildren,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrVerticalNavGroupChildren,
			isStandalone: false,
			selector: "clr-vertical-nav-group-children",
			ngImport: i0,
			template: `<ng-content></ng-content>`,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrVerticalNavGroupChildren,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-vertical-nav-group-children",
			template: `<ng-content></ng-content>`,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}]
});
var VerticalNavGroupService = class VerticalNavGroupService {
	constructor() {
		this._expandChange = new Subject();
	}
	get expandChange() {
		return this._expandChange.asObservable();
	}
	expand() {
		this._expandChange.next(true);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavGroupService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavGroupService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: VerticalNavGroupService,
	decorators: [{ type: Injectable }]
});
var VerticalNavGroupRegistrationService = class VerticalNavGroupRegistrationService {
	constructor() {
		this.navGroupCount = 0;
	}
	registerNavGroup() {
		this.navGroupCount++;
	}
	unregisterNavGroup() {
		this.navGroupCount--;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavGroupRegistrationService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavGroupRegistrationService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: VerticalNavGroupRegistrationService,
	decorators: [{ type: Injectable }]
});
var VerticalNavService = class VerticalNavService {
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
		if (this.collapsible && this._collapsed !== value) this.updateCollapseBehavior(value);
	}
	get collapsible() {
		return this._collapsible;
	}
	set collapsible(value) {
		value = !!value;
		if (this._collapsible !== value) {
			if (!value && this.collapsed) this.updateCollapseBehavior(false);
			this._collapsible = value;
		}
	}
	updateCollapseBehavior(value) {
		this._animateOnCollapsed.next(value);
		this._collapsed = value;
		this._collapsedChanged.next(value);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: VerticalNavService,
	decorators: [{ type: Injectable }]
});
const EXPANDED_STATE = "expanded";
const COLLAPSED_STATE = "collapsed";
var ClrVerticalNavGroup = class ClrVerticalNavGroup {
	constructor(_itemExpand, _navGroupRegistrationService, navGroupService, _navService, commonStrings) {
		this._itemExpand = _itemExpand;
		this._navGroupRegistrationService = _navGroupRegistrationService;
		this._navService = _navService;
		this.commonStrings = commonStrings;
		this.expandedChange = new EventEmitter(true);
		this.animatesChildren = false;
		this.noopAnimations = noopAnimations();
		this.wasExpanded = false;
		this._subscriptions = [];
		this._expandAnimationState = COLLAPSED_STATE;
		this.injector = inject(Injector);
		this.cdr = inject(ChangeDetectorRef);
		_navGroupRegistrationService.registerNavGroup();
		this._subscriptions.push(_itemExpand.expandChange.subscribe((value) => {
			if (value && this.expandAnimationState === COLLAPSED_STATE) {
				if (_navService.collapsed) _navService.collapsed = false;
				this.animateChildrenExpand();
				this.expandAnimationState = EXPANDED_STATE;
			} else if (!value && this.expandAnimationState === EXPANDED_STATE) this.expandAnimationState = COLLAPSED_STATE;
		}));
		this._subscriptions.push(_navService.animateOnCollapsed.subscribe((goingToCollapse) => {
			if (goingToCollapse && this.expanded) {
				this.wasExpanded = true;
				this.collapseGroup();
			} else if (!goingToCollapse && this.wasExpanded) {
				this.expandGroup();
				this.wasExpanded = false;
			}
		}));
		this._subscriptions.push(navGroupService.expandChange.subscribe((expand) => {
			if (expand && !this.expanded) this.expandGroup();
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
		if (this.expandAnimationState === EXPANDED_STATE !== value) this.toggleExpand();
	}
	get expandAnimationState() {
		return this._expandAnimationState;
	}
	set expandAnimationState(value) {
		if (value !== this._expandAnimationState) this._expandAnimationState = value;
	}
	ngAfterContentInit() {
		if (this._navService.collapsed && this.expanded) {
			this.wasExpanded = true;
			this.collapseGroup();
		}
	}
	ngOnDestroy() {
		this._subscriptions.forEach((sub) => sub.unsubscribe());
		this._navGroupRegistrationService.unregisterNavGroup();
	}
	expandGroup() {
		if (this.expanded) this.animateChildrenExpand();
		this.expanded = true;
		this.expandAnimationState = EXPANDED_STATE;
	}
	collapseGroup() {
		this.expandAnimationState = COLLAPSED_STATE;
		const children = this.children.nativeElement;
		const animation = this.animatesChildren ? animateHeight(children, {
			from: measureHeight(children),
			to: 0
		}) : null;
		if (animation) animation.finished.then(() => this.closeGroup(), () => {});
		else this.closeGroup();
	}
	expandAnimationDone(_$event) {}
	toggleExpand() {
		if (this.expandAnimationState === EXPANDED_STATE) this.collapseGroup();
		else {
			if (this._navService.collapsed) this._navService.collapsed = false;
			this.expandGroup();
		}
	}
	animateChildrenExpand() {
		if (!this.animatesChildren) return;
		const children = this.children.nativeElement;
		const from = measureHeight(children);
		afterNextRender({ read: () => this.expandAnimationState === EXPANDED_STATE && animateHeight(children, { from }) }, { injector: this.injector });
	}
	closeGroup() {
		if (this.expandAnimationState === COLLAPSED_STATE) {
			this.expanded = false;
			this.cdr.markForCheck();
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavGroup,
			deps: [
				{ token: i1.IfExpandService },
				{ token: VerticalNavGroupRegistrationService },
				{ token: VerticalNavGroupService },
				{ token: VerticalNavService },
				{ token: i1.ClrCommonStringsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrVerticalNavGroup,
			isStandalone: false,
			selector: "clr-vertical-nav-group",
			inputs: { userExpandedInput: ["clrVerticalNavGroupExpanded", "userExpandedInput"] },
			outputs: { expandedChange: "clrVerticalNavGroupExpandedChange" },
			host: {
				properties: { "class.is-expanded": "this.expanded" },
				classAttribute: "nav-group"
			},
			providers: [IfExpandService, VerticalNavGroupService],
			viewQueries: [{
				propertyName: "children",
				first: true,
				predicate: ["children"],
				descendants: true,
				static: true
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<div\n  #children\n  class=\"nav-group-children\"\n  [class.is-expanded]=\"expanded\"\n  (animate.enter)=\"animatesChildren = !noopAnimations\"\n>\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n",
			dependencies: [{
				kind: "component",
				type: i5.ClrIcon,
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
	type: ClrVerticalNavGroup,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-vertical-nav-group",
			providers: [IfExpandService, VerticalNavGroupService],
			host: { class: "nav-group" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<div\n  #children\n  class=\"nav-group-children\"\n  [class.is-expanded]=\"expanded\"\n  (animate.enter)=\"animatesChildren = !noopAnimations\"\n>\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: i1.IfExpandService },
		{ type: VerticalNavGroupRegistrationService },
		{ type: VerticalNavGroupService },
		{ type: VerticalNavService },
		{ type: i1.ClrCommonStringsService }
	],
	propDecorators: {
		expandedChange: [{
			type: Output,
			args: ["clrVerticalNavGroupExpandedChange"]
		}],
		children: [{
			type: ViewChild,
			args: ["children", { static: true }]
		}],
		expanded: [{
			type: HostBinding,
			args: ["class.is-expanded"]
		}],
		userExpandedInput: [{
			type: Input,
			args: ["clrVerticalNavGroupExpanded"]
		}]
	}
});
var VerticalNavIconService = class VerticalNavIconService {
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavIconService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: VerticalNavIconService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: VerticalNavIconService,
	decorators: [{ type: Injectable }]
});
var ClrVerticalNav = class ClrVerticalNav {
	constructor(_navService, _navIconService, _navGroupRegistrationService, commonStrings) {
		this._navService = _navService;
		this._navIconService = _navIconService;
		this._navGroupRegistrationService = _navGroupRegistrationService;
		this.commonStrings = commonStrings;
		this.contentId = uniqueIdFactory();
		this._collapsedChanged = new EventEmitter(true);
		this._sub = _navService.collapsedChanged.subscribe((value) => {
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
		if (!this.collapsible) return null;
		return !this.collapsed ? "true" : "false";
	}
	ngOnDestroy() {
		this._sub.unsubscribe();
	}
	toggleByButton() {
		this.collapsed = !this.collapsed;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNav,
			deps: [
				{ token: VerticalNavService },
				{ token: VerticalNavIconService },
				{ token: VerticalNavGroupRegistrationService },
				{ token: i1.ClrCommonStringsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrVerticalNav,
			isStandalone: false,
			selector: "clr-vertical-nav",
			inputs: {
				toggleLabel: ["clrVerticalNavToggleLabel", "toggleLabel"],
				collapsible: ["clrVerticalNavCollapsible", "collapsible"],
				collapsed: ["clrVerticalNavCollapsed", "collapsed"]
			},
			outputs: { _collapsedChanged: "clrVerticalNavCollapsedChange" },
			host: {
				properties: {
					"class.is-collapsed": "collapsed",
					"class.has-nav-groups": "hasNavGroups",
					"class.has-icons": "hasIcons"
				},
				classAttribute: "clr-vertical-nav"
			},
			providers: [
				VerticalNavService,
				VerticalNavIconService,
				VerticalNavGroupRegistrationService
			],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (collapsible) {\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n>\n  <cds-icon shape=\"angle-double\" class=\"nav-trigger-icon\" [direction]=\"(collapsed) ? 'right' : 'left'\"></cds-icon>\n</button>\n}\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  @if (collapsible && collapsed) {\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  ></button>\n  }\n</div>\n",
			dependencies: [{
				kind: "component",
				type: i5.ClrIcon,
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
	type: ClrVerticalNav,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-vertical-nav",
			providers: [
				VerticalNavService,
				VerticalNavIconService,
				VerticalNavGroupRegistrationService
			],
			host: {
				class: "clr-vertical-nav",
				"[class.is-collapsed]": "collapsed",
				"[class.has-nav-groups]": "hasNavGroups",
				"[class.has-icons]": "hasIcons"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (collapsible) {\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n>\n  <cds-icon shape=\"angle-double\" class=\"nav-trigger-icon\" [direction]=\"(collapsed) ? 'right' : 'left'\"></cds-icon>\n</button>\n}\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  @if (collapsible && collapsed) {\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  ></button>\n  }\n</div>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: VerticalNavService },
		{ type: VerticalNavIconService },
		{ type: VerticalNavGroupRegistrationService },
		{ type: i1.ClrCommonStringsService }
	],
	propDecorators: {
		toggleLabel: [{
			type: Input,
			args: ["clrVerticalNavToggleLabel"]
		}],
		_collapsedChanged: [{
			type: Output,
			args: ["clrVerticalNavCollapsedChange"]
		}],
		collapsible: [{
			type: Input,
			args: ["clrVerticalNavCollapsible"]
		}],
		collapsed: [{
			type: Input,
			args: ["clrVerticalNavCollapsed"]
		}]
	}
});
var ClrVerticalNavLink = class ClrVerticalNavLink {
	constructor(host, ref, navGroupService) {
		this.destroy$ = new Subject();
		navGroupService && fromEvent(host.nativeElement, "click").pipe(takeUntil(this.destroy$)).subscribe(() => {
			navGroupService.expand();
			ref.markForCheck();
		});
	}
	ngOnDestroy() {
		this.destroy$.next();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavLink,
			deps: [
				{ token: i0.ElementRef },
				{ token: i0.ChangeDetectorRef },
				{
					token: VerticalNavGroupService,
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
			type: ClrVerticalNavLink,
			isStandalone: false,
			selector: "[clrVerticalNavLink]",
			host: { classAttribute: "nav-link" },
			ngImport: i0,
			template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
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
	type: ClrVerticalNavLink,
	decorators: [{
		type: Component,
		args: [{
			selector: "[clrVerticalNavLink]",
			template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `,
			host: { class: "nav-link" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i0.ChangeDetectorRef },
		{
			type: VerticalNavGroupService,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [VerticalNavGroupService]
			}]
		}
	]
});
var ClrVerticalNavIcon = class ClrVerticalNavIcon {
	constructor(_verticalNavIconService) {
		this._verticalNavIconService = _verticalNavIconService;
		_verticalNavIconService.registerIcon();
	}
	ngOnDestroy() {
		this._verticalNavIconService.unregisterIcon();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavIcon,
			deps: [{ token: VerticalNavIconService }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrVerticalNavIcon,
			isStandalone: false,
			selector: "[clrVerticalNavIcon]",
			host: { classAttribute: "nav-icon" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrVerticalNavIcon,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrVerticalNavIcon]",
			host: { class: "nav-icon" },
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: VerticalNavIconService }]
});
const CLR_VERTICAL_NAV_DIRECTIVES = [
	ClrVerticalNav,
	ClrVerticalNavLink,
	ClrVerticalNavGroup,
	ClrVerticalNavGroupChildren,
	ClrVerticalNavIcon
];
var ClrVerticalNavModule = class ClrVerticalNavModule {
	constructor() {
		ClarityIcons.addIcons(angleIcon, angleDoubleIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavModule,
			declarations: [
				ClrVerticalNav,
				ClrVerticalNavLink,
				ClrVerticalNavGroup,
				ClrVerticalNavGroupChildren,
				ClrVerticalNavIcon
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrConditionalModule,
				ClrFocusOnViewInitModule
			],
			exports: [
				ClrVerticalNav,
				ClrVerticalNavLink,
				ClrVerticalNavGroup,
				ClrVerticalNavGroupChildren,
				ClrVerticalNavIcon,
				ClrConditionalModule,
				ClrIcon,
				ClrFocusOnViewInitModule
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrVerticalNavModule,
			imports: [
				CommonModule,
				ClrIcon,
				ClrConditionalModule,
				ClrFocusOnViewInitModule,
				ClrConditionalModule,
				ClrFocusOnViewInitModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrVerticalNavModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrConditionalModule,
				ClrFocusOnViewInitModule
			],
			declarations: [CLR_VERTICAL_NAV_DIRECTIVES],
			exports: [
				CLR_VERTICAL_NAV_DIRECTIVES,
				ClrConditionalModule,
				ClrIcon,
				ClrFocusOnViewInitModule
			]
		}]
	}],
	ctorParameters: () => []
});
export { CLR_VERTICAL_NAV_DIRECTIVES, ClrVerticalNav, ClrVerticalNavGroup, ClrVerticalNavGroupChildren, ClrVerticalNavIcon, ClrVerticalNavLink, ClrVerticalNavModule };

//# sourceMappingURL=clr-angular-layout-vertical-nav.mjs.map