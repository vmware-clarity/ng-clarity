import * as i0 from '@angular/core';
import { Input, Optional, Component, Self, Directive, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/forms/common';
import { ClrAbstractContainer, NgControlService, ControlIdService, ControlClassService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, ClrIcon } from '@clr/angular/icon';
import * as i1$1 from '@angular/forms';
import { ClrHostWrappingModule } from '@clr/angular/utils';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRangeContainer extends ClrAbstractContainer {
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
        if (valBool !== this._hasProgress) {
            this._hasProgress = valBool;
        }
    }
    getRangeProgressFillWidth() {
        const input = this.selectRangeElement();
        if (!input) {
            return this.lastRangeProgressFillWidth;
        }
        const inputWidth = input.offsetWidth;
        const inputMinValue = +input.min;
        let inputMaxValue = +input.max;
        if (inputMinValue === 0 && inputMaxValue === 0) {
            inputMaxValue = 100;
        }
        const inputMiddle = (inputMinValue + inputMaxValue) / 2;
        const inputValue = !!this.control && this.control.value !== undefined ? this.control.value : inputMiddle;
        const valueAsPercent = ((inputValue - inputMinValue) * 100) / (inputMaxValue - inputMinValue);
        this.lastRangeProgressFillWidth = (valueAsPercent * inputWidth) / 100 + 'px';
        return this.lastRangeProgressFillWidth;
    }
    selectRangeElement() {
        try {
            return this.renderer.selectRootElement('[clrRange]#' + this.idService.id);
        }
        catch {
            return undefined;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i1.ControlClassService }, { token: i1.NgControlService }, { token: i0.Renderer2 }, { token: i1.ControlIdService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrRangeContainer, isStandalone: false, selector: "clr-range-container", inputs: { hasProgress: ["clrRangeHasProgress", "hasProgress"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
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
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-range-container',
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
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
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
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [NgControlService, ControlIdService, ControlClassService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1.ControlClassService }, { type: i1.NgControlService }, { type: i0.Renderer2 }, { type: i1.ControlIdService }], propDecorators: { hasProgress: [{
                type: Input,
                args: ['clrRangeHasProgress']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRange extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrRangeContainer, injector, control, renderer, el);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRange, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrRange, isStandalone: false, selector: "[clrRange]", host: { properties: { "class.clr-range": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRange, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRange]',
                    host: { '[class.clr-range]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRangeModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, declarations: [ClrRange, ClrRangeContainer], imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon], exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon],
                    declarations: [ClrRange, ClrRangeContainer],
                    exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrRange, ClrRangeContainer, ClrRangeModule };
//# sourceMappingURL=clr-angular-forms-range.mjs.map
