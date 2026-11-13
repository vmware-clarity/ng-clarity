import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, DOCUMENT, Directive, ElementRef, HostBinding, HostListener, Inject, Injectable, Input, NgModule, Optional, PLATFORM_ID, ViewChild, inject } from "@angular/core";
import * as i1$1 from "@clr/angular/popover/common";
import { ClrIfOpen, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverPosition, ClrPopoverType, POPOVER_HOST_ORIGIN, SIGNPOST_POSITIONS } from "@clr/angular/popover/common";
import { Subject } from "rxjs";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import * as i1 from "@clr/angular/utils";
import { ClrFocusOnViewInitModule, uniqueIdFactory } from "@clr/angular/utils";
import * as i3 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, infoCircleIcon, windowCloseIcon } from "@clr/angular/icon";
var SignpostFocusManager = class SignpostFocusManager {
	set triggerEl(value) {
		this._triggerEl = value;
	}
	focusTrigger() {
		if (this._triggerEl) this._triggerEl.focus({ preventScroll: true });
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SignpostFocusManager,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SignpostFocusManager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SignpostFocusManager,
	decorators: [{ type: Injectable }]
});
var SignpostIdService = class SignpostIdService {
	constructor() {
		this._id = new Subject();
	}
	get id() {
		return this._id.asObservable();
	}
	setId(id) {
		this._id.next(id);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SignpostIdService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SignpostIdService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SignpostIdService,
	decorators: [{ type: Injectable }]
});
var ClrSignpostTrigger = class ClrSignpostTrigger {
	constructor(popoverService, el, signpostIdService, signpostFocusManager, document, platformId) {
		this.popoverService = popoverService;
		this.el = el;
		this.signpostIdService = signpostIdService;
		this.signpostFocusManager = signpostFocusManager;
		this.platformId = platformId;
		this.ariaExpanded = false;
		this.cdr = inject(ChangeDetectorRef);
		this.subscriptions = [];
		this.document = document;
	}
	ngOnInit() {
		this.popoverService.origin = this.el;
		this.signpostFocusManager.triggerEl = this.el.nativeElement;
		this.subscriptions.push(this.popoverService.openChange.subscribe((isOpen) => {
			this.ariaExpanded = isOpen;
			this.cdr.markForCheck();
			const prevIsOpen = this.isOpen;
			this.isOpen = isOpen;
			if (!this.isOpen && prevIsOpen) this.focusOnClose();
		}), this.signpostIdService.id.subscribe((idChange) => {
			this.ariaControl = idChange;
			this.cdr.markForCheck();
		}));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	onSignpostTriggerClick(event) {
		this.popoverService.toggleWithEvent(event);
	}
	focusOnClose() {
		if (!isPlatformBrowser(this.platformId)) return;
		if (!this.isOpen && this.document.activeElement === this.document.body) this.signpostFocusManager.focusTrigger();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpostTrigger,
			deps: [
				{ token: i1$1.ClrPopoverService },
				{ token: i0.ElementRef },
				{ token: SignpostIdService },
				{ token: SignpostFocusManager },
				{ token: DOCUMENT },
				{ token: PLATFORM_ID }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrSignpostTrigger,
			isStandalone: false,
			selector: "[clrSignpostTrigger]",
			host: {
				listeners: { "click": "onSignpostTriggerClick($event)" },
				properties: {
					"attr.aria-expanded": "ariaExpanded",
					"attr.aria-controls": "ariaControl",
					"class.active": "isOpen"
				},
				classAttribute: "signpost-trigger"
			},
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrSignpostTrigger,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrSignpostTrigger]",
			host: {
				class: "signpost-trigger",
				"[attr.aria-expanded]": "ariaExpanded",
				"[attr.aria-controls]": "ariaControl",
				"[class.active]": "isOpen"
			},
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i1$1.ClrPopoverService },
		{ type: i0.ElementRef },
		{ type: SignpostIdService },
		{ type: SignpostFocusManager },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [DOCUMENT]
			}]
		},
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		}
	],
	propDecorators: { onSignpostTriggerClick: [{
		type: HostListener,
		args: ["click", ["$event"]]
	}] }
});
var ClrSignpost = class ClrSignpost {
	constructor(commonStrings, popoverService) {
		this.commonStrings = commonStrings;
		this.popoverService = popoverService;
		this.useCustomTrigger = false;
		this.hideTrigger = false;
	}
	set customTrigger(trigger) {
		this.useCustomTrigger = !!trigger;
	}
	get showDefaultTrigger() {
		return !this.useCustomTrigger && !this.hideTrigger;
	}
	openAtPoint(point, targetElement) {
		this.popoverService.openAtPoint(point, targetElement);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpost,
			deps: [{ token: i1.ClrCommonStringsService }, { token: i1$1.ClrPopoverService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrSignpost,
			isStandalone: false,
			selector: "clr-signpost",
			inputs: {
				signpostTriggerAriaLabel: ["clrSignpostTriggerAriaLabel", "signpostTriggerAriaLabel"],
				hideTrigger: ["clrSignpostHideTrigger", "hideTrigger"]
			},
			host: { properties: { "class.signpost": "true" } },
			providers: [SignpostFocusManager, SignpostIdService],
			queries: [{
				propertyName: "customTrigger",
				first: true,
				predicate: ClrSignpostTrigger,
				descendants: true
			}],
			hostDirectives: [{ directive: i1$1.ClrPopoverHostDirective }],
			ngImport: i0,
			template: `
    @if (showDefaultTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `,
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i3.ClrIcon,
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
			}, {
				kind: "directive",
				type: ClrSignpostTrigger,
				selector: "[clrSignpostTrigger]"
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrSignpost,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-signpost",
			template: `
    @if (showDefaultTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `,
			host: { "[class.signpost]": "true" },
			providers: [SignpostFocusManager, SignpostIdService],
			hostDirectives: [ClrPopoverHostDirective],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: i1.ClrCommonStringsService }, { type: i1$1.ClrPopoverService }],
	propDecorators: {
		signpostTriggerAriaLabel: [{
			type: Input,
			args: ["clrSignpostTriggerAriaLabel"]
		}],
		hideTrigger: [{
			type: Input,
			args: ["clrSignpostHideTrigger"]
		}],
		customTrigger: [{
			type: ContentChild,
			args: [ClrSignpostTrigger]
		}]
	}
});
var ClrSignpostContent = class ClrSignpostContent {
	constructor(parentHost, element, commonStrings, signpostIdService, signpostFocusManager, platformId, document, popoverService, popoverContent) {
		this.element = element;
		this.commonStrings = commonStrings;
		this.signpostFocusManager = signpostFocusManager;
		this.platformId = platformId;
		this.document = document;
		this.popoverService = popoverService;
		this.popoverContent = popoverContent;
		this.signpostContentId = uniqueIdFactory();
		this._position = ClrPopoverPosition.RIGHT_MIDDLE;
		if (!parentHost) throw new Error("clr-signpost-content should only be used inside of a clr-signpost");
		signpostIdService.setId(this.signpostContentId);
		popoverService.panelClass.push("clr-signpost-container");
		popoverContent.contentType = ClrPopoverType.SIGNPOST;
		popoverContent.contentAt = this._position;
	}
	get position() {
		return this._position;
	}
	set position(position) {
		const posIndex = SIGNPOST_POSITIONS.indexOf(position);
		this._position = position && posIndex > -1 ? SIGNPOST_POSITIONS[posIndex] : ClrPopoverPosition.RIGHT_MIDDLE;
		this.popoverContent.contentAt = this._position;
	}
	get isOffScreen() {
		return !this.popoverService.open;
	}
	close() {
		this.popoverService.open = false;
	}
	ngAfterViewInit() {
		this.popoverService.closeButtonRef = this.closeButton;
		this.closeButton.nativeElement.focus();
	}
	onKeyDown(event) {
		if (event.key === "Tab") {
			const focusableElements = this.getFocusableElements(this.element.nativeElement);
			const focusableElementIndex = event.shiftKey ? 0 : focusableElements.length - 1;
			if (document.activeElement === focusableElements[focusableElementIndex]) {
				event.preventDefault();
				this.popoverService.open = false;
			}
		}
	}
	ngOnDestroy() {
		if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) this.signpostFocusManager.focusTrigger();
	}
	getFocusableElements(element) {
		return Array.from(element.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpostContent,
			deps: [
				{
					token: POPOVER_HOST_ORIGIN,
					optional: true
				},
				{ token: i0.ElementRef },
				{ token: i1.ClrCommonStringsService },
				{ token: SignpostIdService },
				{ token: SignpostFocusManager },
				{ token: PLATFORM_ID },
				{ token: DOCUMENT },
				{ token: i1$1.ClrPopoverService },
				{ token: i1$1.ClrPopoverContent }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrSignpostContent,
			isStandalone: false,
			selector: "clr-signpost-content",
			inputs: {
				signpostCloseAriaLabel: ["clrSignpostCloseAriaLabel", "signpostCloseAriaLabel"],
				position: ["clrPosition", "position"]
			},
			host: {
				attributes: { "role": "dialog" },
				listeners: { "keydown": "onKeyDown($event)" },
				properties: {
					"class.signpost-content": "true",
					"id": "signpostContentId",
					"class.is-off-screen": "this.isOffScreen"
				}
			},
			viewQueries: [{
				propertyName: "closeButton",
				first: true,
				predicate: ["closeButton"],
				descendants: true,
				read: ElementRef
			}],
			hostDirectives: [{ directive: i1$1.ClrPopoverContent }],
			ngImport: i0,
			template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i3.ClrIcon,
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
	type: ClrSignpostContent,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-signpost-content",
			template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
			host: {
				"[class.signpost-content]": "true",
				"[id]": "signpostContentId",
				role: "dialog"
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
		{ type: i0.ElementRef },
		{ type: i1.ClrCommonStringsService },
		{ type: SignpostIdService },
		{ type: SignpostFocusManager },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{
			type: Document,
			decorators: [{
				type: Inject,
				args: [DOCUMENT]
			}]
		},
		{ type: i1$1.ClrPopoverService },
		{ type: i1$1.ClrPopoverContent }
	],
	propDecorators: {
		signpostCloseAriaLabel: [{
			type: Input,
			args: ["clrSignpostCloseAriaLabel"]
		}],
		closeButton: [{
			type: ViewChild,
			args: ["closeButton", { read: ElementRef }]
		}],
		position: [{
			type: Input,
			args: ["clrPosition"]
		}],
		isOffScreen: [{
			type: HostBinding,
			args: ["class.is-off-screen"]
		}],
		onKeyDown: [{
			type: HostListener,
			args: ["keydown", ["$event"]]
		}]
	}
});
var ClrSignpostTitle = class ClrSignpostTitle {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpostTitle,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrSignpostTitle,
			isStandalone: false,
			selector: "clr-signpost-title",
			host: { properties: { "class.signpost-title": "true" } },
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
	type: ClrSignpostTitle,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-signpost-title",
			template: `<ng-content></ng-content>`,
			host: { "[class.signpost-title]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}]
});
const CLR_SIGNPOST_DIRECTIVES = [
	ClrSignpost,
	ClrSignpostContent,
	ClrSignpostTrigger,
	ClrSignpostTitle
];
var ClrSignpostModule = class ClrSignpostModule {
	constructor() {
		ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpostModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpostModule,
			declarations: [
				ClrSignpost,
				ClrSignpostContent,
				ClrSignpostTrigger,
				ClrSignpostTitle
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrFocusOnViewInitModule,
				ClrPopoverModuleNext,
				ClrIfOpen
			],
			exports: [
				ClrSignpost,
				ClrSignpostContent,
				ClrSignpostTrigger,
				ClrSignpostTitle,
				ClrIfOpen
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrSignpostModule,
			imports: [
				CommonModule,
				ClrIcon,
				ClrFocusOnViewInitModule,
				ClrPopoverModuleNext
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrSignpostModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrFocusOnViewInitModule,
				ClrPopoverModuleNext,
				ClrIfOpen
			],
			declarations: [CLR_SIGNPOST_DIRECTIVES],
			exports: [CLR_SIGNPOST_DIRECTIVES, ClrIfOpen]
		}]
	}],
	ctorParameters: () => []
});
export { CLR_SIGNPOST_DIRECTIVES, ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTitle, ClrSignpostTrigger };

//# sourceMappingURL=clr-angular-popover-signpost.mjs.map