import * as i0 from '@angular/core';
import { Component, Self, Optional, Directive, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/forms/common';
import { ClrAbstractContainer, NgControlService, ControlIdService, ControlClassService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ClarityIcons, successStandardIcon, errorStandardIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrInputContainer extends ClrAbstractContainer {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrInputContainer, isStandalone: false, selector: "clr-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
        </div>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
        </div>
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
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrInput extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrInputContainer, injector, control, renderer, el);
        this.index = 1;
        if (this.el.nativeElement.getAttribute('type') === 'number') {
            console.warn(`Warning: Inputs of type "number" should utilize the number-input component for proper handling.\n
  Example usage:
  <clr-number-input-container>
    <label>Number Input</label>
    <input clrNumberInput type="number"/>
  </clr-number-input-container>
      `);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInput, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrInput, isStandalone: false, selector: "[clrInput]", host: { properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrInput]',
                    host: { '[class.clr-input]': 'true' },
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
class ClrInputModule {
    constructor() {
        ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrInputModule, declarations: [ClrInput, ClrInputContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrInput, ClrInputContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInputModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
                    declarations: [ClrInput, ClrInputContainer],
                    exports: [ClrCommonFormsModule, ClrInput, ClrInputContainer],
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

export { ClrInput, ClrInputContainer, ClrInputModule };
//# sourceMappingURL=clr-angular-forms-input.mjs.map
