import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Directive, Input, NgModule, Optional, Self } from "@angular/core";
import * as i1$1 from "@clr/angular/forms/common";
import { ClrAbstractContainer, ClrCommonFormsModule, ControlClassService, ControlIdService, NgControlService, WrappedFormControl } from "@clr/angular/forms/common";
import * as i2 from "@angular/common";
import { CommonModule } from "@angular/common";
import * as i1 from "@angular/forms";
import { ClarityIcons, ClrIcon, errorStandardIcon, successStandardIcon } from "@clr/angular/icon";
import { ClrHostWrappingModule } from "@clr/angular/utils";
var ClrRangeContainer = class ClrRangeContainer extends ClrAbstractContainer {
	constructor(layoutService, controlClassService, ngControlService, renderer, idService) {
		super(layoutService, controlClassService, ngControlService);
		this.renderer = renderer;
		this.idService = idService;
		this._hasProgress = false;
	}
	get hasProgress() {
		return this._hasProgress;
	}
	set hasProgress(val) {
		const valBool = !!val;
		if (valBool !== this._hasProgress) this._hasProgress = valBool;
	}
	getRangeProgressFillWidth() {
		const input = this.selectRangeElement();
		if (!input) return this.lastRangeProgressFillWidth;
		const inputWidth = input.offsetWidth;
		const inputMinValue = +input.min;
		let inputMaxValue = +input.max;
		if (inputMinValue === 0 && inputMaxValue === 0) inputMaxValue = 100;
		const inputMiddle = (inputMinValue + inputMaxValue) / 2;
		const valueAsPercent = ((!!this.control && this.control.value !== void 0 ? this.control.value : inputMiddle) - inputMinValue) * 100 / (inputMaxValue - inputMinValue);
		this.lastRangeProgressFillWidth = valueAsPercent * inputWidth / 100 + "px";
		return this.lastRangeProgressFillWidth;
	}
	selectRangeElement() {
		try {
			return this.renderer.selectRootElement("[clrRange]#" + this.idService.id);
		} catch {
			return;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrRangeContainer,
			deps: [
				{
					token: i1$1.LayoutService,
					optional: true
				},
				{ token: i1$1.ControlClassService },
				{ token: i1$1.NgControlService },
				{ token: i0.Renderer2 },
				{ token: i1$1.ControlIdService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrRangeContainer,
			isStandalone: false,
			selector: "clr-range-container",
			inputs: { hasProgress: ["clrRangeHasProgress", "hasProgress"] },
			host: { properties: {
				"class.clr-form-control": "true",
				"class.clr-form-control-disabled": "control?.disabled",
				"class.clr-row": "addGrid()"
			} },
			providers: [
				NgControlService,
				ControlIdService,
				ControlClassService
			],
			usesInheritance: true,
			ngImport: i0,
			template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        @if (hasProgress) {
          <span class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
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
	type: ClrRangeContainer,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-range-container",
			template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        @if (hasProgress) {
          <span class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
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
				"[class.clr-form-control-disabled]": "control?.disabled",
				"[class.clr-row]": "addGrid()"
			},
			providers: [
				NgControlService,
				ControlIdService,
				ControlClassService
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
		{ type: i1$1.NgControlService },
		{ type: i0.Renderer2 },
		{ type: i1$1.ControlIdService }
	],
	propDecorators: { hasProgress: [{
		type: Input,
		args: ["clrRangeHasProgress"]
	}] }
});
var ClrRange = class ClrRange extends WrappedFormControl {
	constructor(vcr, injector, control, renderer, el) {
		super(vcr, ClrRangeContainer, injector, control, renderer, el);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrRange,
			deps: [
				{ token: i0.ViewContainerRef },
				{ token: i0.Injector },
				{
					token: i1.NgControl,
					optional: true,
					self: true
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
			type: ClrRange,
			isStandalone: false,
			selector: "[clrRange]",
			host: { properties: { "class.clr-range": "true" } },
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrRange,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrRange]",
			host: { "[class.clr-range]": "true" },
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
		{ type: i0.ElementRef }
	]
});
var ClrRangeModule = class ClrRangeModule {
	constructor() {
		ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrRangeModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrRangeModule,
			declarations: [ClrRange, ClrRangeContainer],
			imports: [
				CommonModule,
				ClrCommonFormsModule,
				ClrHostWrappingModule,
				ClrIcon
			],
			exports: [
				ClrCommonFormsModule,
				ClrRange,
				ClrRangeContainer
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrRangeModule,
			imports: [
				CommonModule,
				ClrCommonFormsModule,
				ClrHostWrappingModule,
				ClrIcon,
				ClrCommonFormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrRangeModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrCommonFormsModule,
				ClrHostWrappingModule,
				ClrIcon
			],
			declarations: [ClrRange, ClrRangeContainer],
			exports: [
				ClrCommonFormsModule,
				ClrRange,
				ClrRangeContainer
			]
		}]
	}],
	ctorParameters: () => []
});
export { ClrRange, ClrRangeContainer, ClrRangeModule };

//# sourceMappingURL=clr-angular-forms-range.mjs.map