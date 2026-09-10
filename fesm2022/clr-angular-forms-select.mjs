import * as i0 from '@angular/core';
import { ContentChild, Optional, Component, Self, Directive, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/forms/common';
import { ClrAbstractContainer, NgControlService, ControlIdService, ControlClassService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i1$1 from '@angular/forms';
import { SelectMultipleControlValueAccessor, FormsModule } from '@angular/forms';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import { ClarityIcons, successStandardIcon, errorStandardIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSelectContainer extends ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService) {
        super(layoutService, controlClassService, ngControlService);
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
    }
    get multi() {
        return this.control?.valueAccessor instanceof SelectMultipleControlValueAccessor;
    }
    wrapperClass() {
        return this.multi ? 'clr-multiselect-wrapper' : 'clr-select-wrapper';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelectContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i1.ControlClassService }, { token: i1.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrSelectContainer, isStandalone: false, selector: "clr-select-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "multiple", first: true, predicate: SelectMultipleControlValueAccessor, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div [ngClass]="wrapperClass()">
        <ng-content select="[clrSelect]"></ng-content>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelectContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-select-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div [ngClass]="wrapperClass()">
        <ng-content select="[clrSelect]"></ng-content>
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
                }] }, { type: i1.ControlClassService }, { type: i1.NgControlService }], propDecorators: { multiple: [{
                type: ContentChild,
                args: [SelectMultipleControlValueAccessor, { static: false }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSelect extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrSelectContainer, injector, control, renderer, el);
        this.index = 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelect, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrSelect, isStandalone: false, selector: "[clrSelect]", host: { properties: { "class.clr-select": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelect, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrSelect]',
                    host: { '[class.clr-select]': 'true' },
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
class ClrSelectModule {
    constructor() {
        ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrSelectModule, declarations: [ClrSelect, ClrSelectContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrSelect, ClrSelectContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelectModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
                    declarations: [ClrSelect, ClrSelectContainer],
                    exports: [ClrCommonFormsModule, ClrSelect, ClrSelectContainer],
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

export { ClrSelect, ClrSelectContainer, ClrSelectModule };
//# sourceMappingURL=clr-angular-forms-select.mjs.map
