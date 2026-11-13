import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, HostBinding, HostListener, Inject, Injectable, Input, NgModule, Optional, PLATFORM_ID, SkipSelf } from "@angular/core";
import * as i1 from "@clr/angular/popover/common";
import { ClrIfOpen, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverPosition, ClrPopoverType, DROPDOWN_POSITIONS, POPOVER_HOST_ORIGIN } from "@clr/angular/popover/common";
import * as i2 from "@clr/angular/utils";
import { ArrowKeyDirection, BASIC_FOCUSABLE_ITEM_PROVIDER, FOCUS_SERVICE_PROVIDER, FocusableItem, Linkers, customFocusableItemProvider, uniqueIdFactory, wrapObservable } from "@clr/angular/utils";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { EMPTY, ReplaySubject, Subject, Subscription, of, timer } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { ClrIcon } from "@clr/angular/icon";
var DropdownFocusHandler = class DropdownFocusHandler {
	constructor(renderer, parent, popoverService, focusService, platformId) {
		this.renderer = renderer;
		this.parent = parent;
		this.popoverService = popoverService;
		this.focusService = focusService;
		this.platformId = platformId;
		this.id = uniqueIdFactory();
		this._unlistenFuncs = [];
		this.subscriptions = new Subscription();
		this.recoverFocus = new Subject();
		this.resetChildren();
		this.moveToFirstItemWhenOpen();
		this.subscriptions.add(popoverService.openChange.pipe(switchMap((open) => open ? this.recoverFocus.pipe(switchMap(() => timer(0)), switchMap(() => document.activeElement === document.body ? (parent ? this.right : this.down).pipe(take(1)) : EMPTY)) : EMPTY)).subscribe((item) => item && focusService.moveTo(item)));
	}
	get trigger() {
		return this._trigger;
	}
	set trigger(el) {
		this._trigger = el;
		if (this.parent) this._unlistenFuncs.push(this.renderer.listen(el, "keydown.arrowright", (event) => this.popoverService.toggleWithEvent(event)));
		else {
			this._unlistenFuncs.push(this.renderer.listen(el, "keydown.arrowup", (event) => this.popoverService.toggleWithEvent(event)));
			this._unlistenFuncs.push(this.renderer.listen(el, "keydown.arrowdown", (event) => this.popoverService.toggleWithEvent(event)));
		}
	}
	get container() {
		return this._container;
	}
	set container(el) {
		this._container = el;
		this._unlistenFuncs.push(this.renderer.listen(el, "keydown.tab", (event) => this.popoverService.toggleWithEvent(event)), this.renderer.listen(el, "keydown.shift.tab", (event) => this.popoverService.toggleWithEvent(event)));
		this.focusService.registerContainer(el);
		this._unlistenFuncs.push(this.renderer.listen(el, "focusout", () => this.recoverFocus.next()));
		if (this.parent) this._unlistenFuncs.push(this.renderer.listen(el, "keydown.escape", (event) => {
			this.focusService.move(ArrowKeyDirection.LEFT);
			event.stopPropagation();
		}));
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
		this._unlistenFuncs.forEach((unlisten) => unlisten());
		this.focusService.detachListeners(this.container);
	}
	moveToFirstItemWhenOpen() {
		this.subscriptions.add(this.popoverService.openChange.pipe(switchMap((open) => open && this.popoverService.openEvent ? timer(0) : EMPTY)).subscribe(() => {
			this.focusService.moveTo(this);
			this.focusService.move(this.parent ? ArrowKeyDirection.RIGHT : ArrowKeyDirection.DOWN);
		}));
	}
	focus() {
		if (this.trigger && isPlatformBrowser(this.platformId)) this.trigger.focus();
	}
	blur() {
		if (this.trigger && isPlatformBrowser(this.platformId)) this.trigger.blur();
	}
	activate() {
		if (isPlatformBrowser(this.platformId)) this.trigger.click();
	}
	moveTo(item) {
		if (this.focusService.current === item) return;
		this.focusService.moveTo(item);
	}
	resetChildren() {
		this.children = new ReplaySubject(1);
		if (this.parent) this.right = this.openAndGetChildren().pipe(map((all) => all[0]));
		else {
			this.down = this.openAndGetChildren().pipe(map((all) => all[0]));
			this.up = this.openAndGetChildren().pipe(map((all) => all[all.length - 1]));
		}
	}
	addChildren(children) {
		Linkers.linkVertical(children);
		if (this.parent) Linkers.linkParent(children, this.closeAndGetThis(), ArrowKeyDirection.LEFT);
		this.children.next(children);
	}
	openAndGetChildren() {
		return wrapObservable(this.children, () => this.popoverService.open = true);
	}
	closeAndGetThis() {
		return wrapObservable(of(this), () => this.popoverService.open = false);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DropdownFocusHandler,
			deps: [
				{ token: i0.Renderer2 },
				{
					token: DropdownFocusHandler,
					optional: true,
					skipSelf: true
				},
				{ token: i1.ClrPopoverService },
				{ token: i2.FocusService },
				{ token: PLATFORM_ID }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DropdownFocusHandler
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DropdownFocusHandler,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: i0.Renderer2 },
		{
			type: DropdownFocusHandler,
			decorators: [{ type: SkipSelf }, { type: Optional }]
		},
		{ type: i1.ClrPopoverService },
		{ type: i2.FocusService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		}
	]
});
const DROPDOWN_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(DropdownFocusHandler);
var RootDropdownService = class RootDropdownService {
	constructor() {
		this._changes = new Subject();
	}
	get changes() {
		return this._changes.asObservable();
	}
	closeMenus() {
		this._changes.next(false);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RootDropdownService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RootDropdownService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: RootDropdownService,
	decorators: [{ type: Injectable }]
});
function clrRootDropdownFactory(existing) {
	return existing || new RootDropdownService();
}
const ROOT_DROPDOWN_PROVIDER = {
	provide: RootDropdownService,
	useFactory: clrRootDropdownFactory,
	deps: [[
		new Optional(),
		new SkipSelf(),
		RootDropdownService
	]]
};
var ClrDropdown = class ClrDropdown {
	constructor(parent, popoverService, focusHandler, cdr, dropdownService) {
		this.parent = parent;
		this.popoverService = popoverService;
		this.focusHandler = focusHandler;
		this.isMenuClosable = true;
		this.subscriptions = [];
		this.subscriptions.push(dropdownService.changes.subscribe((value) => popoverService.open = value));
		this.subscriptions.push(popoverService.openChange.subscribe(() => cdr.markForCheck()));
	}
	openAtPoint(point, targetElement) {
		this.popoverService.openAtPoint(point, targetElement);
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdown,
			deps: [
				{
					token: ClrDropdown,
					optional: true,
					skipSelf: true
				},
				{ token: i1.ClrPopoverService },
				{ token: DropdownFocusHandler },
				{ token: i0.ChangeDetectorRef },
				{ token: RootDropdownService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDropdown,
			isStandalone: false,
			selector: "clr-dropdown",
			inputs: { isMenuClosable: ["clrCloseMenuOnItemClick", "isMenuClosable"] },
			host: { properties: {
				"class.dropdown": "true",
				"class.open": "popoverService.open"
			} },
			providers: [
				ROOT_DROPDOWN_PROVIDER,
				FOCUS_SERVICE_PROVIDER,
				DROPDOWN_FOCUS_HANDLER_PROVIDER
			],
			hostDirectives: [{ directive: i1.ClrPopoverHostDirective }],
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
	type: ClrDropdown,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dropdown",
			template: `<ng-content></ng-content>`,
			host: {
				"[class.dropdown]": "true",
				"[class.open]": "popoverService.open"
			},
			providers: [
				ROOT_DROPDOWN_PROVIDER,
				FOCUS_SERVICE_PROVIDER,
				DROPDOWN_FOCUS_HANDLER_PROVIDER
			],
			hostDirectives: [ClrPopoverHostDirective],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{
			type: ClrDropdown,
			decorators: [{ type: SkipSelf }, { type: Optional }]
		},
		{ type: i1.ClrPopoverService },
		{ type: DropdownFocusHandler },
		{ type: i0.ChangeDetectorRef },
		{ type: RootDropdownService }
	],
	propDecorators: { isMenuClosable: [{
		type: Input,
		args: ["clrCloseMenuOnItemClick"]
	}] }
});
var ClrDropdownMenu = class ClrDropdownMenu {
	constructor(parentHost, nested, focusHandler, elementRef, popoverService, popoverContent) {
		this.focusHandler = focusHandler;
		this.elementRef = elementRef;
		this.popoverService = popoverService;
		this.popoverContent = popoverContent;
		if (!parentHost) throw new Error("clr-dropdown-menu should only be used inside of a clr-dropdown");
		popoverContent.scrollToClose = true;
		popoverContent.contentType = ClrPopoverType.DROPDOWN;
		popoverContent.contentAt = nested ? ClrPopoverPosition.RIGHT_TOP : ClrPopoverPosition.BOTTOM_LEFT;
		popoverService.panelClass.push("clr-dropdown-container");
	}
	get isOffScreen() {
		return !this.popoverService.open;
	}
	set position(position) {
		if (!position) return;
		const posIndex = DROPDOWN_POSITIONS.indexOf(position);
		if (posIndex === -1) return;
		this.popoverContent.contentAt = DROPDOWN_POSITIONS[posIndex];
	}
	ngAfterContentInit() {
		this.focusHandler.container = this.elementRef.nativeElement;
		this.items.changes.subscribe(() => this.focusHandler.addChildren(this.items.toArray()));
		this.items.notifyOnChanges();
	}
	ngOnDestroy() {
		this.focusHandler.resetChildren();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdownMenu,
			deps: [
				{
					token: POPOVER_HOST_ORIGIN,
					optional: true
				},
				{
					token: ClrDropdownMenu,
					optional: true,
					skipSelf: true
				},
				{ token: DropdownFocusHandler },
				{ token: i0.ElementRef },
				{ token: i1.ClrPopoverService },
				{ token: i1.ClrPopoverContent }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDropdownMenu,
			isStandalone: false,
			selector: "clr-dropdown-menu",
			inputs: { position: ["clrPosition", "position"] },
			host: { properties: {
				"class.dropdown-menu": "true",
				"attr.role": "\"menu\"",
				"class.is-off-screen": "this.isOffScreen"
			} },
			queries: [{
				propertyName: "items",
				predicate: FocusableItem
			}],
			hostDirectives: [{ directive: i1.ClrPopoverContent }],
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
	type: ClrDropdownMenu,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dropdown-menu",
			template: `<ng-content></ng-content>`,
			host: {
				"[class.dropdown-menu]": "true",
				"[attr.role]": "\"menu\""
			},
			standalone: false,
			hostDirectives: [ClrPopoverContent],
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{
			type: i0.ElementRef,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [POPOVER_HOST_ORIGIN]
			}]
		},
		{
			type: ClrDropdownMenu,
			decorators: [{ type: Optional }, { type: SkipSelf }]
		},
		{ type: DropdownFocusHandler },
		{ type: i0.ElementRef },
		{ type: i1.ClrPopoverService },
		{ type: i1.ClrPopoverContent }
	],
	propDecorators: {
		items: [{
			type: ContentChildren,
			args: [FocusableItem]
		}],
		isOffScreen: [{
			type: HostBinding,
			args: ["class.is-off-screen"]
		}],
		position: [{
			type: Input,
			args: ["clrPosition"]
		}]
	}
});
var ClrDropdownTrigger = class ClrDropdownTrigger {
	constructor(dropdown, popoverService, el, focusHandler) {
		this.popoverService = popoverService;
		this.isRootLevelToggle = true;
		if (dropdown.parent) this.isRootLevelToggle = false;
		focusHandler.trigger = el.nativeElement;
		popoverService.origin = el;
	}
	get active() {
		return this.popoverService.open;
	}
	onDropdownTriggerClick(event) {
		this.popoverService.toggleWithEvent(event);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdownTrigger,
			deps: [
				{ token: ClrDropdown },
				{ token: i1.ClrPopoverService },
				{ token: i0.ElementRef },
				{ token: DropdownFocusHandler }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDropdownTrigger,
			isStandalone: false,
			selector: "[clrDropdownTrigger],[clrDropdownToggle]",
			host: {
				listeners: { "click": "onDropdownTriggerClick($event)" },
				properties: {
					"class.dropdown-toggle": "isRootLevelToggle",
					"class.dropdown-item": "!isRootLevelToggle",
					"class.expandable": "!isRootLevelToggle",
					"class.active": "active",
					"attr.aria-haspopup": "\"menu\"",
					"attr.aria-expanded": "active"
				}
			},
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDropdownTrigger,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDropdownTrigger],[clrDropdownToggle]",
			host: {
				"[class.dropdown-toggle]": "isRootLevelToggle",
				"[class.dropdown-item]": "!isRootLevelToggle",
				"[class.expandable]": "!isRootLevelToggle",
				"[class.active]": "active",
				"[attr.aria-haspopup]": "\"menu\"",
				"[attr.aria-expanded]": "active"
			},
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: ClrDropdown },
		{ type: i1.ClrPopoverService },
		{ type: i0.ElementRef },
		{ type: DropdownFocusHandler }
	],
	propDecorators: { onDropdownTriggerClick: [{
		type: HostListener,
		args: ["click", ["$event"]]
	}] }
});
var ClrDropdownItem = class ClrDropdownItem {
	constructor(dropdown, _dropdownService, focusableItem, el, renderer) {
		this.dropdown = dropdown;
		this._dropdownService = _dropdownService;
		this.focusableItem = focusableItem;
		this.el = el;
		this.renderer = renderer;
		this.role = "menuitem";
	}
	get disabled() {
		return this.focusableItem.disabled;
	}
	set disabled(value) {
		this.focusableItem.disabled = !!value || value === "";
	}
	get dropdownItemId() {
		return this.focusableItem.id;
	}
	set dropdownItemId(value) {
		this.focusableItem.id = value;
	}
	onDropdownItemClick() {
		if (this.dropdown.isMenuClosable && !this.disabled && this.dropdown.popoverService.open) this.findRootDropdown().focusHandler.focus();
		setTimeout(() => {
			if (this.dropdown.isMenuClosable && !this.disabled) this._dropdownService.closeMenus();
		});
	}
	onSpaceKeydown($event) {
		this.stopImmediatePropagationIfDisabled($event);
	}
	onEnterKeydown($event) {
		this.stopImmediatePropagationIfDisabled($event);
	}
	stopImmediatePropagationIfDisabled($event) {
		if (this.disabled) {
			$event.preventDefault();
			$event.stopImmediatePropagation();
		}
	}
	findRootDropdown() {
		let rootDropdown = this.dropdown;
		while (rootDropdown.parent) rootDropdown = rootDropdown.parent;
		return rootDropdown;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdownItem,
			deps: [
				{ token: ClrDropdown },
				{ token: RootDropdownService },
				{ token: i2.FocusableItem },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDropdownItem,
			isStandalone: false,
			selector: "[clrDropdownItem]",
			inputs: {
				role: "role",
				disabled: ["clrDisabled", "disabled"],
				dropdownItemId: ["id", "dropdownItemId"]
			},
			host: {
				listeners: {
					"click": "onDropdownItemClick()",
					"keydown.space": "onSpaceKeydown($event)",
					"keydown.enter": "onEnterKeydown($event)"
				},
				properties: {
					"class.disabled": "disabled",
					"class.dropdown-item": "true",
					"attr.role": "role",
					"attr.aria-disabled": "disabled",
					"attr.id": "dropdownItemId"
				}
			},
			providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDropdownItem,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDropdownItem]",
			host: {
				"[class.disabled]": "disabled",
				"[class.dropdown-item]": "true",
				"[attr.role]": "role",
				"[attr.aria-disabled]": "disabled",
				"[attr.id]": "dropdownItemId"
			},
			providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: ClrDropdown },
		{ type: RootDropdownService },
		{ type: i2.FocusableItem },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 }
	],
	propDecorators: {
		role: [{ type: Input }],
		disabled: [{
			type: Input,
			args: ["clrDisabled"]
		}],
		dropdownItemId: [{
			type: Input,
			args: ["id"]
		}],
		onDropdownItemClick: [{
			type: HostListener,
			args: ["click"]
		}],
		onSpaceKeydown: [{
			type: HostListener,
			args: ["keydown.space", ["$event"]]
		}],
		onEnterKeydown: [{
			type: HostListener,
			args: ["keydown.enter", ["$event"]]
		}]
	}
});
const CLR_MENU_POSITIONS = [
	"bottom-left",
	"bottom-right",
	"left-bottom",
	"left-top",
	"right-bottom",
	"right-top",
	"top-left",
	"top-right"
];
const CLR_DROPDOWN_DIRECTIVES = [
	ClrDropdown,
	ClrDropdownMenu,
	ClrDropdownTrigger,
	ClrDropdownItem
];
var ClrDropdownModule = class ClrDropdownModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdownModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdownModule,
			declarations: [
				ClrDropdown,
				ClrDropdownMenu,
				ClrDropdownTrigger,
				ClrDropdownItem
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrIfOpen
			],
			exports: [
				ClrDropdown,
				ClrDropdownMenu,
				ClrDropdownTrigger,
				ClrDropdownItem,
				ClrIfOpen,
				ClrIcon
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDropdownModule,
			imports: [CommonModule, ClrIcon]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDropdownModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrIfOpen
			],
			declarations: [CLR_DROPDOWN_DIRECTIVES],
			exports: [
				CLR_DROPDOWN_DIRECTIVES,
				ClrIfOpen,
				ClrIcon
			]
		}]
	}]
});
export { CLR_DROPDOWN_DIRECTIVES, CLR_MENU_POSITIONS, ClrDropdown, ClrDropdownItem, ClrDropdownMenu, ClrDropdownModule, ClrDropdownTrigger, DROPDOWN_FOCUS_HANDLER_PROVIDER, DropdownFocusHandler, ROOT_DROPDOWN_PROVIDER, RootDropdownService, clrRootDropdownFactory };

//# sourceMappingURL=clr-angular-popover-dropdown.mjs.map