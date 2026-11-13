import * as i0 from "@angular/core";
import { Attribute, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Directive, Inject, InjectionToken, Input, NgModule, Optional, Self, forwardRef } from "@angular/core";
import * as i1$1 from "@clr/angular/forms/common";
import { ClrAbstractContainer, ClrCommonFormsModule, ClrControlLabel, ContainerIdService, ControlClassService, ControlIdService, NgControlService, WrappedFormControl } from "@clr/angular/forms/common";
import * as i2$1 from "rxjs";
import { BehaviorSubject } from "rxjs";
import * as i1 from "@angular/forms";
import { ClrHostWrappingModule, uniqueIdFactory } from "@clr/angular/utils";
import * as i2 from "@angular/common";
import { CommonModule } from "@angular/common";
import { ClarityIcons, ClrIcon, errorStandardIcon, successStandardIcon } from "@clr/angular/icon";
const IS_TOGGLE = new InjectionToken("IS_TOGGLE");
function isToggleFactory() {
	return new BehaviorSubject(false);
}
const IS_TOGGLE_PROVIDER = {
	provide: IS_TOGGLE,
	useFactory: isToggleFactory
};
var ClrCheckboxWrapper = class ClrCheckboxWrapper {
	constructor(toggleService) {
		this.toggle = false;
		this.subscriptions = [];
		this.subscriptions.push(toggleService.subscribe((state) => {
			this.toggle = state;
		}));
	}
	ngOnInit() {
		if (this.label) this.label.disableGrid();
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCheckboxWrapper,
			deps: [{ token: IS_TOGGLE }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrCheckboxWrapper,
			isStandalone: false,
			selector: "clr-checkbox-wrapper,clr-toggle-wrapper",
			host: { properties: {
				"class.clr-checkbox-wrapper": "!toggle",
				"class.clr-checkbox-wrapper-disabled": "checkbox?.controlDisabled",
				"class.clr-toggle-wrapper": "toggle"
			} },
			providers: [ControlIdService, IS_TOGGLE_PROVIDER],
			queries: [{
				propertyName: "label",
				first: true,
				predicate: ClrControlLabel,
				descendants: true,
				static: true
			}, {
				propertyName: "checkbox",
				first: true,
				predicate: i0.forwardRef(() => ClrCheckbox),
				descendants: true,
				static: true
			}],
			ngImport: i0,
			template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i1$1.ClrControlLabel,
				selector: "label",
				inputs: ["id", "for"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrCheckboxWrapper,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-checkbox-wrapper,clr-toggle-wrapper",
			template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `,
			host: {
				"[class.clr-checkbox-wrapper]": "!toggle",
				"[class.clr-checkbox-wrapper-disabled]": "checkbox?.controlDisabled",
				"[class.clr-toggle-wrapper]": "toggle"
			},
			providers: [ControlIdService, IS_TOGGLE_PROVIDER],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{
		type: i2$1.BehaviorSubject,
		decorators: [{
			type: Inject,
			args: [IS_TOGGLE]
		}]
	}],
	propDecorators: {
		label: [{
			type: ContentChild,
			args: [ClrControlLabel, { static: true }]
		}],
		checkbox: [{
			type: ContentChild,
			args: [forwardRef(() => ClrCheckbox), { static: true }]
		}]
	}
});
var ClrCheckbox = class ClrCheckbox extends WrappedFormControl {
	constructor(vcr, injector, control, renderer, el, toggle) {
		super(vcr, ClrCheckboxWrapper, injector, control, renderer, el);
		this.control = control;
		this.toggle = toggle;
	}
	get controlDisabled() {
		return this.control?.disabled;
	}
	ngOnInit() {
		super.ngOnInit();
		const toggleService = this.getProviderFromContainer(IS_TOGGLE, null);
		if (toggleService && this.toggle !== null) toggleService.next(true);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCheckbox,
			deps: [
				{ token: i0.ViewContainerRef },
				{ token: i0.Injector },
				{
					token: i1.NgControl,
					optional: true,
					self: true
				},
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef },
				{
					token: "clrToggle",
					attribute: true
				}
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrCheckbox,
			isStandalone: false,
			selector: "[clrCheckbox],[clrToggle]",
			host: { properties: { "attr.role": "toggle !== null ? \"switch\" : null" } },
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrCheckbox,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrCheckbox],[clrToggle]",
			host: { "[attr.role]": "toggle !== null ? \"switch\" : null" },
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ViewContainerRef },
		{ type: i0.Injector },
		{
			type: i1.NgControl,
			decorators: [{ type: Self }, { type: Optional }]
		},
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef },
		{
			type: void 0,
			decorators: [{
				type: Attribute,
				args: ["clrToggle"]
			}]
		}
	]
});
var ClrCheckboxContainer = class ClrCheckboxContainer extends ClrAbstractContainer {
	constructor(layoutService, controlClassService, ngControlService) {
		super(layoutService, controlClassService, ngControlService);
		this.layoutService = layoutService;
		this.controlClassService = controlClassService;
		this.ngControlService = ngControlService;
		this.inline = false;
		this._generatedId = uniqueIdFactory();
	}
	get clrInline() {
		return this.inline;
	}
	set clrInline(value) {
		if (typeof value === "string") this.inline = value === "false" ? false : true;
		else this.inline = !!value;
	}
	get allCheckboxesDisabled() {
		if (!this.controls?.length) return false;
		return this.controls.every((control) => control.disabled);
	}
	ngAfterContentInit() {
		this.setAriaRoles();
		this.setAriaLabelledBy();
	}
	setAriaRoles() {
		this.role = this.checkboxes?.length ? "group" : null;
	}
	setAriaLabelledBy() {
		if (this.label && !this.label.idAttr) this.label.idAttr = this._generatedId;
		this.ariaLabelledBy = this.checkboxes?.length && this.label ? this.label.idAttr : null;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCheckboxContainer,
			deps: [
				{
					token: i1$1.LayoutService,
					optional: true
				},
				{ token: i1$1.ControlClassService },
				{ token: i1$1.NgControlService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrCheckboxContainer,
			isStandalone: false,
			selector: "clr-checkbox-container,clr-toggle-container",
			inputs: { clrInline: "clrInline" },
			host: { properties: {
				"class.clr-form-control": "true",
				"class.clr-form-control-disabled": "allCheckboxesDisabled",
				"class.clr-row": "addGrid()",
				"attr.role": "role",
				"attr.aria-labelledby": "ariaLabelledBy"
			} },
			providers: [
				NgControlService,
				ControlClassService,
				ContainerIdService
			],
			queries: [{
				propertyName: "checkboxes",
				predicate: ClrCheckbox,
				descendants: true
			}],
			usesInheritance: true,
			ngImport: i0,
			template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i2.NgClass,
				selector: "[ngClass]",
				inputs: ["class", "ngClass"]
			}, {
				kind: "directive",
				type: i1$1.ClrControlLabel,
				selector: "label",
				inputs: ["id", "for"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrCheckboxContainer,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-checkbox-container,clr-toggle-container",
			template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
			host: {
				"[class.clr-form-control]": "true",
				"[class.clr-form-control-disabled]": "allCheckboxesDisabled",
				"[class.clr-row]": "addGrid()",
				"[attr.role]": "role",
				"[attr.aria-labelledby]": "ariaLabelledBy"
			},
			providers: [
				NgControlService,
				ControlClassService,
				ContainerIdService
			],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{
			type: i1$1.LayoutService,
			decorators: [{ type: Optional }]
		},
		{ type: i1$1.ControlClassService },
		{ type: i1$1.NgControlService }
	],
	propDecorators: {
		checkboxes: [{
			type: ContentChildren,
			args: [ClrCheckbox, { descendants: true }]
		}],
		clrInline: [{ type: Input }]
	}
});
var ClrCheckboxModule = class ClrCheckboxModule {
	constructor() {
		ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCheckboxModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCheckboxModule,
			declarations: [
				ClrCheckbox,
				ClrCheckboxContainer,
				ClrCheckboxWrapper
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrCommonFormsModule,
				ClrHostWrappingModule
			],
			exports: [
				ClrCommonFormsModule,
				ClrCheckbox,
				ClrCheckboxContainer,
				ClrCheckboxWrapper
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCheckboxModule,
			imports: [
				CommonModule,
				ClrIcon,
				ClrCommonFormsModule,
				ClrHostWrappingModule,
				ClrCommonFormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrCheckboxModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrCommonFormsModule,
				ClrHostWrappingModule
			],
			declarations: [
				ClrCheckbox,
				ClrCheckboxContainer,
				ClrCheckboxWrapper
			],
			exports: [
				ClrCommonFormsModule,
				ClrCheckbox,
				ClrCheckboxContainer,
				ClrCheckboxWrapper
			]
		}]
	}],
	ctorParameters: () => []
});
export { ClrCheckbox, ClrCheckboxContainer, ClrCheckboxModule, ClrCheckboxWrapper, IS_TOGGLE, IS_TOGGLE_PROVIDER, isToggleFactory };

//# sourceMappingURL=clr-angular-forms-checkbox.mjs.map